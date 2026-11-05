import { QMS_TOKENS } from "./useQMSWallet";
import { useCallback, useEffect, useState } from "react";
import { BrowserProvider, Contract, JsonRpcProvider, formatUnits } from "ethers";

import { QMS_LENDING_POOL_ABI } from "../contracts/QMSLendingPool";
import {
  QMS_LENDING_POOL_ADDRESS,
  QMS_LENDING_POOL_CHAIN_ID,
  isLendingPoolDeployed,
} from "../contracts/lendingPoolConfig";

export type LendingPoolStatus =
  | "not-deployed"
  | "disconnected"
  | "wrong-network"
  | "loading"
  | "ready"
  | "partial"
  | "error";


export interface LendingPoolData {
  totalSuppliedUsd: string | null;
  protocolBorrowedUsd: string | null;
  availableLiquidityUsd: string | null;
  mySuppliedUsd: string | null;
  totalCollateralUsd: string | null;
  totalDebtUsd: string | null;
  availableBorrowUsd: string | null;
  healthFactor: string | null;
  protocolTokenTotals: ProtocolTokenTotal[];
}



export interface ProtocolTokenTotal {
  symbol: string;
  supplied: string;
  borrowed: string;
  available: string;
}

export interface LendingTokenPosition {
  symbol: string;
  tokenAddress: string;
  supplied: string;
  collateral: string;
  borrowed: string;
}

export type LendingTokenPositions =
  Record<string, LendingTokenPosition>;


const EMPTY_DATA: LendingPoolData = {
  totalSuppliedUsd: null,
  protocolBorrowedUsd: null,
  availableLiquidityUsd: null,
  mySuppliedUsd: null,
  totalCollateralUsd: null,
  totalDebtUsd: null,
  availableBorrowUsd: null,
  healthFactor: null,
  protocolTokenTotals: [],
};


interface EthereumProvider {
  request: (args: {
    method: string;
    params?: unknown[];
  }) => Promise<unknown>;
}

type OKXWindow = Window & {
  okxwallet?: {
    ethereum?: EthereumProvider;
    request?: EthereumProvider["request"];
  };
};

function getOKXProvider(): EthereumProvider | null {
  const okx = (window as OKXWindow).okxwallet;
  const provider = okx?.ethereum ?? okx;

  if (!provider || typeof provider.request !== "function") {
    return null;
  }

  return provider as EthereumProvider;
}

export function useLendingPool(
  address: string | null,
  isQMSNetwork: boolean
) {
  const [status, setStatus] =
    useState<LendingPoolStatus>("not-deployed");

  const [data, setData] =
    useState<LendingPoolData>(EMPTY_DATA);

    const [tokenPositions, setTokenPositions] =
  useState<LendingTokenPositions>({});

  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!isLendingPoolDeployed()) {
      setStatus("not-deployed"); setData(EMPTY_DATA); setTokenPositions({}); return;
    }
    setStatus("loading"); setError(null);
    try {
      // Public protocol metrics must work without a connected wallet.
      const provider = new JsonRpcProvider(import.meta.env.DEV ? "https://rpc.testnet.qms.finance" : "/api/rpc", QMS_LENDING_POOL_CHAIN_ID);
      const contract = new Contract(QMS_LENDING_POOL_ADDRESS, QMS_LENDING_POOL_ABI, provider);
      if (await provider.getCode(QMS_LENDING_POOL_ADDRESS) === "0x") {
        throw new Error("Lending Pool not deployed at configured address");
      }
      const supported: string[] = await contract.getSupportedAssets();
      const supportedSet = new Set(supported.map((a) => a.toLowerCase()));
      const markets = QMS_TOKENS.filter((t) => supportedSet.has(t.address.toLowerCase()));
      let totalSupplied = 0n;
      let totalBorrowed = 0n;
      let totalLiquidity = 0n;
      let incomplete = false;
      const protocolTokenTotals: ProtocolTokenTotal[] = [];
      for (const token of markets) {
        const [supplied, borrowed, liquid] = await Promise.all([
          contract.totalSupplied(token.address) as Promise<bigint>,
          contract.totalBorrowed(token.address) as Promise<bigint>,
          contract.getAvailableLiquidity(token.address) as Promise<bigint>,
        ]);
        protocolTokenTotals.push({
          symbol: token.symbol,
          supplied: formatUnits(supplied, token.decimals),
          borrowed: formatUnits(borrowed, token.decimals),
          available: formatUnits(liquid, token.decimals),
        });
        // Zero token balances are USD zero even if the oracle has expired.
        const amounts = [supplied, borrowed, liquid];
        const values = await Promise.allSettled(amounts.map((amount) =>
          amount === 0n ? Promise.resolve(0n) : contract.getAssetValue(token.address, amount) as Promise<bigint>
        ));
        if (values.some((v) => v.status === "rejected")) incomplete = true;
        if (values[0].status === "fulfilled") totalSupplied += values[0].value;
        if (values[1].status === "fulfilled") totalBorrowed += values[1].value;
        if (values[2].status === "fulfilled") totalLiquidity += values[2].value;
      }
      const publicData = {
        totalSuppliedUsd: incomplete ? null : formatUnits(totalSupplied, 18),
        protocolBorrowedUsd: incomplete ? null : formatUnits(totalBorrowed, 18),
        availableLiquidityUsd: incomplete ? null : formatUnits(totalLiquidity, 18),
        protocolTokenTotals,
      };
      if (!address || !isQMSNetwork) {
        setData({ ...EMPTY_DATA, ...publicData });
        setTokenPositions({});
        setStatus(incomplete ? "partial" : "ready");
        setError(incomplete ? "Some active markets have stale or missing oracle prices" : null);
        return;
      }
      const wallet = getOKXProvider();
      if (!wallet) throw new Error("OKX Wallet provider not found");
      const walletProvider = new BrowserProvider(wallet);
      if (Number((await walletProvider.getNetwork()).chainId) !== QMS_LENDING_POOL_CHAIN_ID) {
        setData({ ...EMPTY_DATA, ...publicData }); setStatus("wrong-network"); return;
      }
      const positions: LendingTokenPositions = {};
      let mySupplied = 0n;
      for (const token of markets) {
        const [supplied, collateral, borrowed] = await Promise.all([
          contract.suppliedBalances(address, token.address) as Promise<bigint>,
          contract.collateralBalances(address, token.address) as Promise<bigint>,
          contract.debtBalances(address, token.address) as Promise<bigint>,
        ]);
        positions[token.symbol] = {
          symbol: token.symbol, tokenAddress: token.address,
          supplied: formatUnits(supplied, token.decimals),
          collateral: formatUnits(collateral, token.decimals),
          borrowed: formatUnits(borrowed, token.decimals),
        };
        if (supplied !== 0n) {
          try { mySupplied += await contract.getAssetValue(token.address, supplied) as bigint; }
          catch { incomplete = true; }
        }
      }
      const results = await Promise.allSettled([
        contract.getTotalCollateralValue(address) as Promise<bigint>,
        contract.getTotalDebtValue(address) as Promise<bigint>,
        contract.getAvailableBorrowValue(address) as Promise<bigint>,
        contract.getHealthFactor(address) as Promise<bigint>,
      ]);
      const val = (i: number): bigint | null => results[i].status === "fulfilled" ? results[i].value as bigint : null;
      const debt = val(1);
      const ready = !incomplete && results.every((r) => r.status === "fulfilled");
      setTokenPositions(positions);
      setData({
        ...publicData,
        mySuppliedUsd: incomplete ? null : formatUnits(mySupplied, 18),
        totalCollateralUsd: val(0) === null ? null : formatUnits(val(0)!, 18),
        totalDebtUsd: debt === null ? null : formatUnits(debt, 18),
        availableBorrowUsd: val(2) === null ? null : formatUnits(val(2)!, 18),
        healthFactor: debt === 0n ? "∞" : val(3) === null ? null : Number(formatUnits(val(3)!, 18)).toFixed(2),
      });
      setStatus(ready ? "ready" : "partial");
      setError(ready ? null : "Some oracle prices or position values are unavailable");
    } catch (err) {
      setStatus("error"); setError(err instanceof Error ? err.message : String(err));
    }
  }, [address, isQMSNetwork]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
  status,
  data,
  tokenPositions,
  error,
  refresh,
  isReady: status === "ready",
};
}
