import { useCallback, useEffect, useRef, useState } from "react";
import { BrowserProvider, Contract, formatEther, formatUnits } from "ethers";

const QMS_CHAIN_ID = 19480;
const QMS_CHAIN_HEX = `0x${QMS_CHAIN_ID.toString(16)}`;
const QMS_RPC = "https://rpc.testnet.qms.finance";
const QMS_EXPLORER = "https://testnet.qmsscan.io/";

export const QMS_TOKENS = [
  { symbol: "USDT", name: "Tether USD", address: "0x5D1386fC130143F92511bC2D18124D3E414ed429", decimals: 6, logo: "/tokens/usdt.png" },
  { symbol: "USDC", name: "USD Coin", address: "0xDd4D61DF875cc613E1372c78827a5F4C2741bf11", decimals: 6, logo: "/tokens/usdc.png" },
  { symbol: "WQMS", name: "Wrapped QMS", address: "0x9AA510295aC664A3d5A3182a3eFe959DE2B12c34", decimals: 18, logo: "/tokens/wqms.png" },
  { symbol: "WBTC", name: "Wrapped Bitcoin", address: "0x5eBfE302200a5b22E182a5C0D10444Fe44b2A678", decimals: 8, logo: "/tokens/wbtc.png" },
  { symbol: "WETH", name: "Wrapped Ether", address: "0x43D7c8434A5290a32C8725224870ad6f85132a31", decimals: 18, logo: "/tokens/eth.png" },
] as const;

export const ERC20_BALANCE_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
];

type WalletProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, listener: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, listener: (...args: unknown[]) => void) => void;
};

declare global {
  interface Window {
    okxwallet?: WalletProvider & { ethereum?: WalletProvider };
  }
}

export function useQMSWallet() {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("0");
  const [chainId, setChainId] = useState<number | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState("");
  const [tokenBalances, setTokenBalances] = useState<Record<string, string>>({});
  const [tokensLoading, setTokensLoading] = useState(false);

  const disconnectedRef = useRef(
    sessionStorage.getItem("qms-wallet-disconnected") === "true"
  );
  // Invalidates any pending reads after a network/account/disconnect change.
  const requestVersionRef = useRef(0);

  const getWallet = useCallback((): WalletProvider => {
    const wallet = window.okxwallet?.ethereum ?? window.okxwallet;
    if (!wallet) {
      throw new Error(
        "OKX Wallet not detected. Please install or unlock OKX Wallet."
      );
    }
    return wallet;
  }, []);

  const clearBalances = useCallback(() => {
    setBalance("0");
    setTokenBalances({});
    setTokensLoading(false);
  }, []);

  const refreshTokenBalances = useCallback(
    async (walletAddress: string) => {
      if (disconnectedRef.current) return;
      const version = ++requestVersionRef.current;
      const wallet = getWallet();
      const currentChain = Number(
        await wallet.request({ method: "eth_chainId" })
      );
      if (version !== requestVersionRef.current || disconnectedRef.current) return;
      setChainId(currentChain);
      if (currentChain !== QMS_CHAIN_ID) {
        clearBalances();
        return;
      }

      setTokensLoading(true);
      try {
        const provider = new BrowserProvider(wallet);
        const results = await Promise.allSettled(
          QMS_TOKENS.map(async (token) => {
            const contract = new Contract(token.address, ERC20_BALANCE_ABI, provider);
            const rawBalance: bigint = await contract.balanceOf(walletAddress);
            return { symbol: token.symbol, balance: formatUnits(rawBalance, token.decimals) };
          })
        );
        if (version !== requestVersionRef.current || disconnectedRef.current) return;
        const chainAfterRead = Number(
          await wallet.request({ method: "eth_chainId" })
        );
        if (version !== requestVersionRef.current || disconnectedRef.current) return;
        setChainId(chainAfterRead);
        if (chainAfterRead !== QMS_CHAIN_ID) {
          clearBalances();
          return;
        }
        const balances: Record<string, string> = {};
        results.forEach((result, index) => {
          if (result.status === "fulfilled") {
            balances[result.value.symbol] = result.value.balance;
          } else {
            console.error(`Failed to load ${QMS_TOKENS[index].symbol} balance:`, result.reason);
          }
        });
        setTokenBalances(balances);
      } catch (err) {
        if (version === requestVersionRef.current) {
          console.error("Failed to refresh token balances:", err);
        }
      } finally {
        if (version === requestVersionRef.current) setTokensLoading(false);
      }
    },
    [clearBalances, getWallet]
  );

  const refreshWallet = useCallback(async () => {
    if (disconnectedRef.current) return;
    const version = ++requestVersionRef.current;
    const wallet = window.okxwallet?.ethereum ?? window.okxwallet;
    if (!wallet) return;

    const [accountsValue, chainValue] = await Promise.all([
      wallet.request({ method: "eth_accounts" }),
      wallet.request({ method: "eth_chainId" }),
    ]);
    if (disconnectedRef.current || version !== requestVersionRef.current) return;

    const accounts = accountsValue as string[];
    const currentChainId = Number(chainValue);
    setChainId(currentChainId);

    if (!accounts.length) {
      setAddress("");
      clearBalances();
      return;
    }

    const walletAddress = accounts[0];
    setAddress(walletAddress);

    if (currentChainId !== QMS_CHAIN_ID) {
      clearBalances();
      return;
    }

    try {
      const provider = new BrowserProvider(wallet);
      const nativeBalance = await provider.getBalance(walletAddress);
      if (disconnectedRef.current || version !== requestVersionRef.current) return;
      const chainAfterRead = Number(
        await wallet.request({ method: "eth_chainId" })
      );
      if (disconnectedRef.current || version !== requestVersionRef.current) return;
      setChainId(chainAfterRead);
      if (chainAfterRead !== QMS_CHAIN_ID) {
        clearBalances();
        return;
      }
      setBalance(formatEther(nativeBalance));
      await refreshTokenBalances(walletAddress);
    } catch (err) {
      if (version === requestVersionRef.current) {
        console.error("Failed to refresh QMS balances:", err);
        clearBalances();
      }
    }
  }, [clearBalances, refreshTokenBalances]);

  const connectWallet = useCallback(async () => {
    setConnecting(true);
    setError("");
    try {
      const wallet = getWallet();
      await wallet.request({ method: "eth_requestAccounts" });
      disconnectedRef.current = false;
      sessionStorage.removeItem("qms-wallet-disconnected");
      await refreshWallet();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect OKX Wallet");
    } finally {
      setConnecting(false);
    }
  }, [getWallet, refreshWallet]);

  const switchToQMS = useCallback(async () => {
    setError("");
    try {
      const wallet = getWallet();
      try {
        await wallet.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: QMS_CHAIN_HEX }],
        });
      } catch (err) {
        const walletError = err as { code?: number; message?: string };
        if (walletError.code !== 4902) throw err;
        await wallet.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: QMS_CHAIN_HEX,
            chainName: "QMS Testnet",
            nativeCurrency: { name: "QMS", symbol: "QMS", decimals: 18 },
            rpcUrls: [QMS_RPC],
            blockExplorerUrls: [QMS_EXPLORER],
          }],
        });
      }
      await refreshWallet();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to switch to QMS Testnet");
    }
  }, [getWallet, refreshWallet]);

  const disconnectWallet = useCallback(() => {
    disconnectedRef.current = true;
    ++requestVersionRef.current;
    sessionStorage.setItem("qms-wallet-disconnected", "true");
    setAddress("");
    setChainId(null);
    clearBalances();
    setError("");
  }, [clearBalances]);

  useEffect(() => {
    const wallet = window.okxwallet?.ethereum ?? window.okxwallet;
    if (!wallet) return;

    const safeRefresh = () => {
      void refreshWallet().catch((err) => console.error("Wallet refresh failed:", err));
    };

    const onAccountsChanged = () => {
      ++requestVersionRef.current;
      clearBalances();
      if (!disconnectedRef.current) safeRefresh();
    };

    const onChainChanged = (...args: unknown[]) => {
      ++requestVersionRef.current;
      const nextChain = Number(args[0]);
      setChainId(Number.isFinite(nextChain) ? nextChain : null);
      clearBalances();
      if (!disconnectedRef.current) safeRefresh();
    };

    safeRefresh();
    wallet.on?.("accountsChanged", onAccountsChanged);
    wallet.on?.("chainChanged", onChainChanged);
    const interval = window.setInterval(safeRefresh, 12000);

    return () => {
      wallet.removeListener?.("accountsChanged", onAccountsChanged);
      wallet.removeListener?.("chainChanged", onChainChanged);
      window.clearInterval(interval);
      ++requestVersionRef.current;
    };
  }, [clearBalances, refreshWallet]);

  return {
    address,
    balance,
    chainId,
    connecting,
    error,
    tokenBalances,
    tokensLoading,
    refreshTokenBalances,
    isConnected: Boolean(address),
    isQMSNetwork: chainId === QMS_CHAIN_ID,
    connectWallet,
    disconnectWallet,
    switchToQMS,
    refreshWallet,
  };
}
