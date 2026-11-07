import { useEffect, useState } from "react";
import { Contract, Interface, JsonRpcProvider, type Log } from "ethers";
import { QMS_LENDING_POOL_ADDRESS, QMS_LENDING_POOL_CHAIN_ID } from "../contracts/lendingPoolConfig";
import { QMS_TOKENS } from "./useQMSWallet";

const DEPLOYMENT_BLOCK = 266707;
const EVENT_ABI = [
  "event Supplied(address indexed user,address indexed token,uint256 amount)",
  "event Withdrawn(address indexed user,address indexed token,uint256 amount)",
  "event CollateralDeposited(address indexed user,address indexed token,uint256 amount)",
  "event CollateralWithdrawn(address indexed user,address indexed token,uint256 amount)",
  "event Borrowed(address indexed user,address indexed token,uint256 amount)",
  "event Repaid(address indexed user,address indexed token,uint256 amount)",
  "event Liquidated(address indexed liquidator,address indexed borrower,address indexed debtToken,address collateralToken,uint256 repaidAmount,uint256 seizedCollateral)",
];
const POSITION_ABI = [
  "function suppliedBalances(address,address) view returns (uint256)",
  "function collateralBalances(address,address) view returns (uint256)",
  "function debtBalances(address,address) view returns (uint256)",
];
const iface = new Interface(EVENT_ABI);
const topics = EVENT_ABI.map(fragment => iface.getEvent(fragment.slice(6, fragment.indexOf("(")))!.topicHash);
export type GrowthDay = { date: string; total: number; daily: number };
export type AnalyticsData = { totalUsers: number; activePositions: number; newToday: number; growth: GrowthDay[]; indexedBlock: number };
export function useProtocolAnalytics(enabled = true) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    const run = async () => {
      setLoading(true); setError(null);
      try {
        const url = import.meta.env.DEV ? "https://rpc.testnet.qms.finance" : new URL("/api/rpc", window.location.origin).href;
        const provider = new JsonRpcProvider(url, QMS_LENDING_POOL_CHAIN_ID);
        const latest = await provider.getBlockNumber();
        const logs: Log[] = [];
        // Small ranges reduce the chance of RPC log-query limits. Fail closed: never show partial counts.
        for (let from = DEPLOYMENT_BLOCK; from <= latest; from += 500) {
          const to = Math.min(from + 499, latest);
          const batch = await provider.getLogs({ address: QMS_LENDING_POOL_ADDRESS, fromBlock: from, toBlock: to, topics: [topics] });
          logs.push(...batch);
        }
        const blockTimes = new Map<number, number>();
        const blocks = [...new Set(logs.map(l => l.blockNumber))];
        for (const number of blocks) {
          const block = await provider.getBlock(number);
          if (!block) throw new Error(`Missing block ${number}`);
          blockTimes.set(number, block.timestamp);
        }
        const events: { user: string; day: string; block: number; index: number }[] = [];
        const participants = new Set<string>();
        for (const log of logs) {
          const parsed = iface.parseLog(log);
          if (!parsed) continue;
          const user = String(parsed.name === "Liquidated" ? parsed.args.borrower : parsed.args.user).toLowerCase();
          participants.add(user);
          const day = new Date(blockTimes.get(log.blockNumber)! * 1000).toISOString().slice(0, 10);
          events.push({ user, day, block: log.blockNumber, index: log.index });
        }
        events.sort((a,b) => a.block - b.block || a.index - b.index);
        const seen = new Set<string>();
        const daily = new Map<string, Set<string>>();
        const first = new Map<string, number>();
        for (const e of events) {
          if (!daily.has(e.day)) daily.set(e.day, new Set());
          daily.get(e.day)!.add(e.user);
          if (!seen.has(e.user)) { seen.add(e.user); first.set(e.day, (first.get(e.day) ?? 0) + 1); }
        }
        const nowBlock = await provider.getBlock(latest);
        if (!nowBlock) throw new Error("Latest block unavailable");
        const today = new Date(nowBlock.timestamp * 1000).toISOString().slice(0,10);
        const start = new Date(Date.UTC(Number(today.slice(0,4)),Number(today.slice(5,7))-1,Number(today.slice(8,10))));
        start.setUTCDate(start.getUTCDate() - 89);
        const growth: GrowthDay[] = [];
        let running = 0;
        // Include wallets first seen before the chart window.
        for (const [day,count] of first) if (day < start.toISOString().slice(0,10)) running += count;
        for (let i=0;i<90;i++) {
          const date = start.toISOString().slice(0,10);
          running += first.get(date) ?? 0;
          growth.push({ date, total: running, daily: daily.get(date)?.size ?? 0 });
          start.setUTCDate(start.getUTCDate()+1);
        }
        const contract = new Contract(QMS_LENDING_POOL_ADDRESS, POSITION_ABI, provider);
        let activePositions = 0;
        // Read each participant's current position across all supported tokens.
        for (const user of participants) {
          let active = false;
          for (const token of QMS_TOKENS) {
            const [supplied, collateral, borrowed] = await Promise.all([
              contract.suppliedBalances(user, token.address) as Promise<bigint>,
              contract.collateralBalances(user, token.address) as Promise<bigint>,
              contract.debtBalances(user, token.address) as Promise<bigint>,
            ]);
            if (supplied > 0n || collateral > 0n || borrowed > 0n) { active = true; break; }
          }
          if (active) activePositions++;
        }
        if (!cancelled) setData({ totalUsers: participants.size, activePositions, newToday: first.get(today) ?? 0, growth, indexedBlock: latest });
      } catch (e) {
        if (!cancelled) { setError(e instanceof Error ? e.message : String(e)); setData(null); }
      } finally { if (!cancelled) setLoading(false); }
    };
    void run();
    return () => { cancelled = true; };
  }, [enabled, refreshKey]);
  return { data, loading, error, refresh: () => setRefreshKey(v => v+1) };
}
