

import ProtocolAnalytics from "./components/ProtocolAnalytics";

import { useLendingPool } from "./hooks/useLendingPool";
import type { LendingTokenPositions } from "./hooks/useLendingPool";

import { QMS_LENDING_POOL_ADDRESS } from "./contracts/lendingPoolConfig";

import { QMS_LENDING_POOL_ABI } from "./contracts/QMSLendingPool";


import { useEffect, useRef, useState } from "react";


import LendingDocs from "./components/LendingDocs";


import { BrowserProvider, Contract, Interface, parseUnits } from "ethers";


import {
  useQMSWallet,
  QMS_TOKENS,
} from "./hooks/useQMSWallet";

import type { ReactNode } from "react";
import {
  LayoutDashboard,
  Landmark,
  BookOpen,
  Wallet,
  ExternalLink,
  Menu,
  Globe,
  ChevronDown,
  Droplets,
  Sun,
  Moon,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Activity,
} from "lucide-react";
import "./App.css";


const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function decimals() view returns (uint8)",
];

type Page = "Dashboard" | "Markets" | "My Position" | "Docs";

const PAGE_PATHS: Record<Page, string> = {
  Dashboard: "/dashboard",
  Markets: "/markets",
  "My Position": "/myposition",
  Docs: "/docs",
};

function getPageFromPath(pathname: string): Page {
  const normalized = pathname.replace(/\/+$/, "").toLowerCase() || "/";
  if (normalized === "/markets") return "Markets";
  if (normalized === "/myposition") return "My Position";
  if (normalized === "/docs") return "Docs";
  return "Dashboard";
}



const markets = [
  {
    symbol: "USDC",
    name: "USD Coin",
    logo: "/tokens/usdc.png",
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    logo: "/tokens/usdt.png",
  },
  {
    symbol: "WETH",
    name: "Wrapped Ether",
    logo: "/tokens/eth.png",
  },
  {
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    logo: "/tokens/wbtc.png",
  },
  {
    symbol: "WQMS",
    name: "Wrapped QMS",
    logo: "/tokens/wqms.png",
  },
];


function App() {
  
const {
  address,
  balance,
  connecting,
  error,
  isConnected,
  isQMSNetwork,
  connectWallet,
    disconnectWallet,
  switchToQMS,
   tokenBalances,
  tokensLoading,
    refreshTokenBalances,
} = useQMSWallet();

const lendingPool = useLendingPool(
  address,
  isQMSNetwork
);

const formatProtocolTokens = (metric: "supplied" | "borrowed" | "available") => {
  const items = lendingPool.data.protocolTokenTotals
    .filter((token) => Number(token[metric]) > 0)
    .map((token) => `${Number(token[metric]).toLocaleString(undefined, { maximumFractionDigits: 6 })} ${token.symbol}`);
  return items.length ? items.join(" · ") : "0 tokens across supported markets";
};


useEffect(() => {
  console.log("QMS Lending Pool Status:", lendingPool.status);
  console.log("QMS Lending Pool Data:", lendingPool.data);
  console.log(
    "QMS Lending Token Positions:",
    lendingPool.tokenPositions
  );
  console.log("QMS Lending Pool Error:", lendingPool.error);
}, [
  lendingPool.status,
  lendingPool.data,
  lendingPool.tokenPositions,
  lendingPool.error,
]);

const [walletMenuOpen, setWalletMenuOpen] = useState(false);
const walletMenuRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (!walletMenuOpen) return;

  const handleClickOutside = (event: PointerEvent) => {
    if (walletMenuRef.current && !walletMenuRef.current.contains(event.target as Node)) {
      setWalletMenuOpen(false);
    }
  };

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape") setWalletMenuOpen(false);
  };

  document.addEventListener("pointerdown", handleClickOutside);
  document.addEventListener("keydown", handleEscape);
  return () => {
    document.removeEventListener("pointerdown", handleClickOutside);
    document.removeEventListener("keydown", handleEscape);
  };
}, [walletMenuOpen]);
const [copied, setCopied] = useState(false);

const handleCopyAddress = async () => {
  if (!address) return;

  try {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  } catch (err) {
    console.error("Failed to copy wallet address:", err);
  }
};

const handleExplorer = () => {
  if (!address) return;

  window.open(
    `https://testnet.qmsscan.io/address/${address}`,
    "_blank",
    "noopener,noreferrer"
  );
};

const handleDisconnect = () => {
  disconnectWallet();
  setWalletMenuOpen(false);
};

  
  const [page, setPage] = useState<Page>(() => getPageFromPath(window.location.pathname));

  useEffect(() => {
    // Keep the URL canonical, including the initial visit to "/".
    const current = window.location.pathname;
    const canonical = PAGE_PATHS[getPageFromPath(current)];
    if (current !== canonical) {
      window.history.replaceState(null, "", canonical + window.location.search + window.location.hash);
    }
    const handlePopState = () => setPage(getPageFromPath(window.location.pathname));
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigateTo = (nextPage: Page) => {
    const path = PAGE_PATHS[nextPage];
    if (window.location.pathname !== path) {
      window.history.pushState(null, "", path);
    }
    setPage(nextPage);
    setSidebarOpen(false);
  };
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    try {
      return localStorage.getItem("qms-theme") === "light" ? "light" : "dark";
    } catch {
      return "dark";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("qms-theme", theme);
    } catch {
      // Theme remains available even when storage is disabled.
    }
  }, [theme]);

  const navigation = [
    { name: "Dashboard" as Page, icon: LayoutDashboard },
    { name: "Markets" as Page, icon: Landmark },
    { name: "My Position" as Page, icon: Wallet },
  ];

  return (
    <div className={`app ${theme === "light" ? "light-theme" : "dark-theme"}`}>
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="brand">
          <img src="/qms-logo.jpg" alt="QMS Logo" />
          <div>
            <strong>QMS Lending</strong>
            <span>DeFi Lending Protocol</span>
          </div>
        </div>

        <div className="sidebar-label">MAIN MENU</div>

        <nav className="navigation">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                className={`nav-item ${
                  page === item.name ? "active" : ""
                }`}
                onClick={() => {
                  navigateTo(item.name);
                }}
              >
                <Icon size={19} />
                {item.name}
              </button>
            );
          })}
        </nav>

        
<div className="sidebar-label community-label">
  ECOSYSTEM
</div>

<div className="navigation">
  <a
    className="nav-item"
    href="https://testnet.qwap.xyz/"
    target="_blank"
    rel="noopener noreferrer"
  >
    <Activity size={19} />
    Qwap DEX
    <ExternalLink size={14} className="external" />
  </a>
</div>

<div className="sidebar-quick-links">
  <div className="sidebar-label quick-links-label">
    QUICK LINKS
  </div>

  <div className="quick-links-navigation">
    <button
      type="button"
      className={`quick-link-item ${
        page === "Docs" ? "active" : ""
      }`}
      onClick={() => {
        navigateTo("Docs");
      }}
    >
      <BookOpen size={15} />
      <span>Docs</span>
    </button>

    <a
      className="quick-link-item"
      href="https://qms.finance/"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Globe size={15} />
      <span>QMS Website</span>
      <ExternalLink size={12} className="external" />
    </a>

    <a
      className="quick-link-item"
      href="https://testnet.qmsscan.io/"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Activity size={15} />
      <span>Explorer</span>
      <ExternalLink size={12} className="external" />
    </a>

    <a
      className="quick-link-item"
      href="https://faucet.testnet.qms.finance/"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Droplets size={15} />
      <span>Faucet</span>
      <ExternalLink size={12} className="external" />
    </a>
  </div>
</div>

<div className="sidebar-bottom">
          <div className="network-card">
            <span className="network-dot" />
            <div>
              <strong>QMS Testnet</strong>
              <small>Chain ID: 19480</small>
            </div>
          </div>
          <p>QMS Lending • Testnet Preview</p>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="main">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="mobile-menu"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <span className="breadcrumb">QMS Lending</span>
            <span className="breadcrumb-divider">/</span>
            <strong>{page}</strong>
          </div>

          <div className="topbar-right">
            <button
              type="button"
              className="theme-toggle"
              onClick={() => setTheme((current) => current === "dark" ? "light" : "dark")}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={theme === "dark" ? "Light Mode" : "Dark Mode"}
            >
              {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
            </button>
            <div className="chain-pill">
              <span className="network-dot" />
              QMS Testnet
            </div>

            

{!isConnected ? (
  <button
    className="connect-btn"
    type="button"
    onClick={() => {
      console.log("QMS Connect Wallet clicked");
      void connectWallet();
    }}
    disabled={connecting}
  >
    <Wallet size={17} />
    {connecting ? "Connecting..." : "Connect Wallet"}
  </button>
) : !isQMSNetwork ? (
  <button
    className="connect-btn"
    type="button"
    onClick={switchToQMS}
  >
    Switch to QMS Testnet
  </button>

) : (
  <div className="wallet-wrapper" ref={walletMenuRef}>
    <button
      className="connect-btn"
      type="button"
      onClick={() => setWalletMenuOpen(!walletMenuOpen)}
      aria-expanded={walletMenuOpen}
    >
      <Wallet size={17} />
      {`${address.slice(0, 6)}...${address.slice(-4)}`}
      <ChevronDown size={15} />
    </button>

    {walletMenuOpen && (
      <div className="wallet-dropdown">
        <div className="wallet-balance-row">
          <span>QMS Balance</span>
          <strong>
            {Number(balance).toLocaleString(undefined, {
              maximumFractionDigits: 4,
            })}{" "}
            QMS
          </strong>
        </div>
        
<div className="wallet-token-section">
  <div className="wallet-token-heading">
    <span>Token Balances</span>
    {tokensLoading && (
      <span className="wallet-token-loading">
        Updating...
      </span>
    )}
  </div>

  {QMS_TOKENS.map((token) => (
    <div className="wallet-token-row" key={token.symbol}>
      <div className="wallet-token-info">
        <img
          src={token.logo}
          alt={`${token.symbol} logo`}
          className="wallet-token-logo"
        />

        <div className="wallet-token-name">
          <strong>{token.symbol}</strong>
          <span>{token.name}</span>
        </div>
      </div>

      <div className="wallet-token-amount">
        {tokenBalances[token.symbol] !== undefined
          ? Number(
              tokenBalances[token.symbol]
            ).toLocaleString(undefined, {
              maximumFractionDigits: 6,
            })
          : tokensLoading
            ? "Loading..."
            : "—"}
      </div>
    </div>
  ))}
</div>


        <div className="wallet-dropdown-actions">
          <button
            type="button"
            onClick={handleCopyAddress}
          >
            {copied ? "Copied!" : "Copy"}
          </button>

          <button
            type="button"
            onClick={handleExplorer}
          >
            QMS Explorer
          </button>
        </div>

        <button
          type="button"
          className="wallet-disconnect"
          onClick={handleDisconnect}
        >
          Disconnect
        </button>
      </div>
    )}
  </div>
)}


{error && (
  <div className="wallet-error" role="alert">
    {error}
  </div>
)}



          </div>
        </header>

        <div className="content">
          {page === "Dashboard" && (
            <>

              <div
                role="note"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  padding: "12px 16px",
                  marginBottom: 20,
                  border: "1px solid rgba(245, 158, 11, 0.35)",
                  borderRadius: 12,
                  background: "rgba(245, 158, 11, 0.07)",
                  color: "inherit",
                }}
              >
                <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: 2, color: "#f59e0b" }} />
                <div>
                  <strong style={{ display: "block", marginBottom: 3 }}>Testnet Demo Prices</strong>
                  <span style={{ fontSize: 13, opacity: 0.8 }}>
                    Asset prices are fixed for testing purposes and do not reflect live market prices.
                  </span>
                </div>
              </div>
              <section className="hero">
                <div>
                  <div className="eyebrow">
                    <span className="hero-dot" />
                    DECENTRALIZED LENDING
                  </div>
                  <h1>
                    Your assets.
                    <br />
                    <span>Your control.</span>
                  </h1>
                  <p>
                    Explore lending and borrowing on QMS Testnet.
                    Supply assets, manage collateral and monitor
                    your borrowing position in one place.
                  </p>
                  <button
                    className="hero-button"
                    onClick={() => navigateTo("Markets")}
                  >
                    Explore Markets
                    <ArrowUpRight size={18} />
                  </button>
                </div>
                <div className="hero-art">
                  <img src="/qms-logo.jpg" alt="QMS" />
                </div>
              </section>

              <div className="section-heading">
                <h2>Protocol Overview</h2>
                <span className="preview-tag">
                  {isConnected && isQMSNetwork
                    ? "Preview • Wallet connected"
                    : "Preview • Wallet not connected"}
                </span>
              </div>

              
<div className="stats-grid">
  
<StatCard
  title="Total Supplied"
  icon={<ArrowDownLeft size={19} />}
  value={
    lendingPool.data.totalSuppliedUsd === null
      ? "—"
      : `$${Number(
          lendingPool.data.totalSuppliedUsd
        ).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
  }
  description={
    lendingPool.data.totalSuppliedUsd === null
      ? `On-chain supplied: ${formatProtocolTokens("supplied")} • USD unavailable`
      : `Protocol-wide supplied assets • ${formatProtocolTokens("supplied")}`
  }
/>

  <StatCard title="Available Liquidity" icon={<Droplets size={19} />} value={lendingPool.data.availableLiquidityUsd === null ? "—" : `$${Number(lendingPool.data.availableLiquidityUsd).toLocaleString(undefined, {maximumFractionDigits: 2})}`} description={lendingPool.data.availableLiquidityUsd === null ? `On-chain available: ${formatProtocolTokens("available")} • USD unavailable` : `Protocol-wide liquid assets • ${formatProtocolTokens("available")}`} />
<StatCard title="Protocol Borrowed" icon={<ArrowUpRight size={19} />} value={lendingPool.data.protocolBorrowedUsd === null ? "—" : `$${Number(lendingPool.data.protocolBorrowedUsd).toLocaleString(undefined, {maximumFractionDigits: 2})}`} description={lendingPool.data.protocolBorrowedUsd === null ? `On-chain borrowed: ${formatProtocolTokens("borrowed")} • USD unavailable` : `Protocol-wide outstanding loans • ${formatProtocolTokens("borrowed")}`} />

</div>


              <ProtocolAnalytics />

              <div className="section-heading markets-heading">
                <h2>Lending Markets</h2>
                <button
                  className="text-button"
                  onClick={() => navigateTo("Markets")}
                >
                  View all markets
                  <ArrowUpRight size={16} />
                </button>
              </div>

              

<MarketTable
  address={address}
  tokenBalances={tokenBalances}
  isConnected={isConnected}
  isQMSNetwork={isQMSNetwork}
    refreshTokenBalances={refreshTokenBalances}
refreshLendingPool={lendingPool.refresh}
  tokenPositions={lendingPool.tokenPositions}
  availableBorrowUsd={lendingPool.data.availableBorrowUsd}

/>


            </>
          )}

          {page === "My Position" && (
            <MyPositionPage
              isConnected={isConnected}
              isQMSNetwork={isQMSNetwork}
              connectWallet={connectWallet}
              switchToQMS={switchToQMS}
              data={lendingPool.data}
              status={lendingPool.status}
              error={lendingPool.error}
              refresh={lendingPool.refresh}
              tokenPositions={lendingPool.tokenPositions}
            />
          )}

          {page === "Markets" && (
            <>

              <div
                role="note"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  padding: "12px 16px",
                  marginBottom: 20,
                  border: "1px solid rgba(245, 158, 11, 0.35)",
                  borderRadius: 12,
                  background: "rgba(245, 158, 11, 0.07)",
                  color: "inherit",
                }}
              >
                <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: 2, color: "#f59e0b" }} />
                <div>
                  <strong style={{ display: "block", marginBottom: 3 }}>Testnet Demo Prices</strong>
                  <span style={{ fontSize: 13, opacity: 0.8 }}>
                    Asset prices are fixed for testing purposes and do not reflect live market prices.
                  </span>
                </div>
              </div>
              <div className="page-heading">
                <h1>Lending Markets</h1>
                <p>
                  Explore assets planned for QMS Lending.
                  On-chain market data will be available after
                  contract deployment.
                </p>
              </div>
              

<MarketTable
  address={address}
  tokenBalances={tokenBalances}
  isConnected={isConnected}
  isQMSNetwork={isQMSNetwork}
    refreshTokenBalances={refreshTokenBalances}
refreshLendingPool={lendingPool.refresh}
  tokenPositions={lendingPool.tokenPositions}
  availableBorrowUsd={lendingPool.data.availableBorrowUsd}

/>


            </>
          )}

          
{page === "Docs" && <LendingDocs />}

        </div>
      </main>
    </div>
  );
}


type MyPositionData = ReturnType<typeof useLendingPool>["data"];

function MyPositionPage({
  isConnected, isQMSNetwork, connectWallet, switchToQMS,
  data, status, error, refresh, tokenPositions,
}: {
  isConnected: boolean;
  isQMSNetwork: boolean;
  connectWallet: () => void | Promise<unknown>;
  switchToQMS: () => void | Promise<unknown>;
  data: MyPositionData;
  status: ReturnType<typeof useLendingPool>["status"];
  error: string | null;
  refresh: () => void | Promise<unknown>;
  tokenPositions: LendingTokenPositions;
}) {
  const money = (value: string | null) =>
    value === null ? "—" : `$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const hf = data.healthFactor;
  const numericHF = hf === null || hf === "∞" ? null : Number(hf);
  const health = hf === null
    ? { label: "Unavailable", color: "#64748b", detail: "Health Factor is not available. Check oracle and pool data." }
    : hf === "∞"
      ? { label: "No Debt", color: "#16a34a", detail: "No outstanding debt; liquidation risk from borrowing is absent." }
      : numericHF === null || !Number.isFinite(numericHF)
        ? { label: "Unavailable", color: "#64748b", detail: "Health Factor could not be interpreted." }
        : numericHF <= 1
          ? { label: "Liquidatable", color: "#dc2626", detail: "Health Factor is at or below 1.0. Your collateral may be liquidated." }
          : numericHF < 1.1
            ? { label: "High Risk", color: "#dc2626", detail: "Very close to the liquidation threshold (HF 1.0)." }
            : numericHF < 1.5
              ? { label: "Caution", color: "#eab308", detail: "Your borrowing position is approaching liquidation risk." }
              : { label: "Healthy", color: "#16a34a", detail: "Your borrowing position is currently above the warning threshold." };
  const positionCards = [
    { title: "My Supply", value: data.mySuppliedUsd, icon: <ArrowDownLeft size={19} />, description: "Your supplied assets (USD)" },
    { title: "My Collateral", value: data.totalCollateralUsd, icon: <ShieldCheck size={19} />, description: "Collateral value (USD)" },
    { title: "My Borrow", value: data.totalDebtUsd, icon: <ArrowUpRight size={19} />, description: "Outstanding debt (USD)" },
    { title: "Available Borrow", value: data.availableBorrowUsd, icon: <Wallet size={19} />, description: "Remaining borrow capacity (USD); market liquidity may further limit borrowing" },
  ];
  return (
    <section>
      <div className="page-heading">
        <h1>My Position</h1>
        <p>Track your on-chain lending, collateral and borrowing risk on QMS Testnet.</p>
      </div>
      {!isConnected ? (
        <div className="docs-notice" role="status">
          Connect your wallet to view your personal position.{' '}
          <button type="button" className="text-button" onClick={() => void connectWallet()}>Connect Wallet</button>
        </div>
      ) : !isQMSNetwork ? (
        <div className="docs-notice" role="status">
          Switch to QMS Testnet to view your position.{' '}
          <button type="button" className="text-button" onClick={() => void switchToQMS()}>Switch Network</button>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
            <button type="button" className="text-button" onClick={() => void refresh()} disabled={status === "loading"}>
              <RefreshCw size={16} /> {status === "loading" ? "Refreshing..." : "Refresh Position"}
            </button>
          </div>
          {error && <div className="docs-notice" role="alert">{error}</div>}
          <div className="stats-grid">
            {positionCards.map((item) => (
              <StatCard key={item.title} title={item.title} icon={item.icon} value={money(item.value)} description={item.description} />
            ))}
          </div>
          <div className="stat-card" style={{ marginTop: 20, borderLeft: `4px solid ${health.color}` }}>
            <div className="stat-top">
              <span>Health Factor</span>
              <div className="stat-icon" style={{ color: health.color }}>
                {numericHF !== null && Number.isFinite(numericHF) && numericHF < 1.5 ? <AlertTriangle size={19} /> : <ShieldCheck size={19} />}
              </div>
            </div>
            <div className="stat-value" style={{ color: health.color }}>{hf ?? "—"}</div>
            <div style={{ color: health.color, fontWeight: 700, marginBottom: 8 }}>{health.label}</div>
            <div className="stat-bottom">{health.detail}</div>
            <div className="stat-bottom" style={{ marginTop: 8 }}>Warning: HF &lt; 1.5 · High risk: HF &lt; 1.1 · Liquidation threshold: HF ≤ 1.0</div>
          </div>
          <div className="section-heading markets-heading"><h2>Your Assets</h2></div>
          <div className="stat-card" style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
              <thead><tr><th style={{ padding: 10 }}>Asset</th><th style={{ padding: 10 }}>Supplied</th><th style={{ padding: 10 }}>Collateral</th><th style={{ padding: 10 }}>Borrowed</th></tr></thead>
              <tbody>{Object.values(tokenPositions).map((token) => (
                <tr key={token.symbol}>
                  <td style={{ padding: 10 }}>{token.symbol}</td>
                  <td style={{ padding: 10 }}>{token.supplied}</td>
                  <td style={{ padding: 10 }}>{token.collateral}</td>
                  <td style={{ padding: 10 }}>{token.borrowed}</td>
                </tr>
              ))}</tbody>
            </table>
            {Object.keys(tokenPositions).length === 0 && <p className="stat-bottom">No position data available yet.</p>}
          </div>
        </>
      )}
    </section>
  );
}

function StatCard({
  title,
  icon,
  value = "—",
  description = "Not deployed",
}: {
  title: string;
  icon: ReactNode;
  value?: string;
  description?: string;
}) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <span>{title}</span>
        <div className="stat-icon">{icon}</div>
      </div>

      <div className="stat-value">
        {value}
      </div>

      <div className="stat-bottom">
        {description}
      </div>
    </div>
  );
}





type MarketAction =
  | "Supply"
  | "Withdraw"
  | "Deposit Collateral"
  | "Withdraw Collateral"
  | "Borrow"
  | "Repay";



function MarketTable({
  address,
  tokenBalances,
  isConnected,
  isQMSNetwork,
  refreshTokenBalances,
  refreshLendingPool,
  tokenPositions,
  availableBorrowUsd,
}: {

  
  address: string | null;
  tokenBalances: Record<string, string>;
  isConnected: boolean;
  isQMSNetwork: boolean;
  refreshTokenBalances: (address: string) => Promise<void>;
  refreshLendingPool: () => void | Promise<void>;
  tokenPositions: LendingTokenPositions;
  availableBorrowUsd: string | null;
}) {




  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  

const [activeAction, setActiveAction] =
  useState<MarketAction>("Supply");


  const [amount, setAmount] = useState("");




const [transactionStatus, setTransactionStatus] = useState<
  | "idle"
  | "approving"
  | "depositing"
  | "pending_confirmation"
  | "success"
  | "error"
>("idle");


const [transactionError, setTransactionError] =
  useState<string | null>(null);

const [transactionHash, setTransactionHash] =
  useState<string | null>(null);


const depositInProgressRef = useRef(false);


useEffect(() => {
  setTransactionStatus("idle");
  setTransactionError(null);
  setTransactionHash(null);
}, [address, isConnected, isQMSNetwork]);


const getPendingDepositHash = (walletAddress: string): string | null => {
  try {
    const storageKey =
      `qms_pending_deposit_19480_${walletAddress.toLowerCase()}`;

    const savedHash = localStorage.getItem(storageKey);

    if (!savedHash) {
      return null;
    }

    if (!/^0x[a-fA-F0-9]{64}$/.test(savedHash)) {
      console.warn("Invalid pending Deposit transaction hash.");
      return null;
    }

    return savedHash;
  } catch (storageError: unknown) {
    console.warn(
      "Unable to read pending Deposit transaction:",
      storageError
    );

    return null;
  }
};


useEffect(() => {
  if (!address || !isConnected || !isQMSNetwork) {
    return;
  }

  const savedHash = getPendingDepositHash(address);

  if (!savedHash) {
    return;
  }

  setTransactionHash(savedHash);
  setTransactionStatus("pending_confirmation");
  setTransactionError(
    "A previous Deposit Collateral transaction requires confirmation. Please verify its status before submitting another deposit."
  );

  console.log("Pending Deposit transaction restored:", savedHash);


let cancelled = false;

let retryTimer: ReturnType<typeof setTimeout> | null = null;

const schedulePendingRetry = (callback: () => void) => {
  if (cancelled) {
    return;
  }

  retryTimer = setTimeout(() => {
    retryTimer = null;

    if (!cancelled) {
      callback();
    }
  }, 10000);
};

const verifyPendingDeposit = async () => {
  if (cancelled) {
    return;
  }

  try {
    const result = await checkPendingDepositReceipt(
      savedHash,
      address
    );

    if (cancelled) {
      return;
    }

    if (result === "success") {
      setTransactionStatus("success");
      setTransactionError(null);
      setTransactionHash(savedHash);

      console.log(
        "Recovered Deposit transaction confirmed successfully:",
        savedHash
      );

      
try {
  await refreshLendingPool();

  if (cancelled) {
    return;
  }

  console.log(
    "Lending Pool refreshed after recovered Deposit."
  );
} catch (refreshError: unknown) {
  console.warn(
    "Unable to refresh Lending Pool after recovered Deposit:",
    refreshError
  );
}


try {
  if (!cancelled) {
    await refreshTokenBalances(address);
  }

  if (cancelled) {
    return;
  }

  console.log(
    "Wallet token balances refreshed after recovered Deposit."
  );
} catch (refreshError: unknown) {
  console.warn(
    "Unable to refresh wallet balances after recovered Deposit:",
    refreshError
  );
}

      try {
        const storageKey =
          `qms_pending_deposit_19480_${address.toLowerCase()}`;

        if (localStorage.getItem(storageKey) === savedHash) {
          localStorage.removeItem(storageKey);
        }
      } catch (storageError: unknown) {
        console.warn(
          "Unable to clear recovered Deposit transaction:",
          storageError
        );
      }

      return;
    }

    if (result === "failed") {
      setTransactionStatus("error");
      setTransactionError(
        "Deposit Collateral transaction failed on QMS Testnet. The transaction was confirmed but reverted on-chain."
      );
      setTransactionHash(savedHash);

      console.warn(
        "Recovered Deposit transaction failed on-chain:",
        savedHash
      );

      try {
        const storageKey =
          `qms_pending_deposit_19480_${address.toLowerCase()}`;

        if (localStorage.getItem(storageKey) === savedHash) {
          localStorage.removeItem(storageKey);
        }
      } catch (storageError: unknown) {
        console.warn(
          "Unable to clear failed Deposit transaction:",
          storageError
        );
      }

      return;
    }

    console.log(
      "Recovered Deposit is still pending. Retrying in 10 seconds:",
      savedHash
    );

    schedulePendingRetry(() => {
      void verifyPendingDeposit();
    });
  } catch (error: unknown) {
    if (cancelled) {
      return;
    }

    console.error(
      "Unable to verify recovered Deposit transaction:",
      error
    );

    
setTransactionError(
  "Unable to verify the pending Deposit transaction. " +
  "The transaction remains locked while verification is retried. " +
  "Please check your wallet connection and QMS Testnet."
);

    // Giữ Pending khi RPC gặp lỗi và thử kiểm tra lại.
    schedulePendingRetry(() => {
      void verifyPendingDeposit();
    });
  }
};

void verifyPendingDeposit();


return () => {
  cancelled = true;

  if (retryTimer !== null) {
    clearTimeout(retryTimer);
  }
};


}, [address, isConnected, isQMSNetwork]);



const checkPendingDepositReceipt = async (
  txHash: string,
  walletAddress: string
): Promise<"success" | "failed" | "pending"> => {

  const okxProvider =
    window.okxwallet?.ethereum ?? window.okxwallet;

  if (!okxProvider) {
    throw new Error("OKX Wallet provider not found.");
  }

  const provider = new BrowserProvider(okxProvider);

  const network = await provider.getNetwork();

  if (network.chainId !== 19480n) {
    throw new Error("Please switch to QMS Testnet.");
  }

const transaction = await provider.getTransaction(txHash);


if (!transaction) {
  console.warn(
    "Pending Deposit transaction details are not available yet."
  );

  return "pending";
}

if (transaction) {
  if (
    transaction.from.toLowerCase() !==
    walletAddress.toLowerCase()
  ) {
    throw new Error(
      "Pending transaction does not belong to the connected wallet."
    );
  }
}

if (transaction) {
  if (
    transaction.to?.toLowerCase() !==
    QMS_LENDING_POOL_ADDRESS.toLowerCase()
  ) {
    throw new Error(
      "Pending transaction does not target QMS Lending Pool V2."
    );
  }
}

if (transaction) {
  const lendingPoolInterface = new Interface(QMS_LENDING_POOL_ABI);

  const depositFunction = lendingPoolInterface.getFunction(
    "depositCollateral"
  );

  if (!depositFunction) {
    throw new Error(
      "Deposit Collateral function not found in Lending Pool ABI."
    );
  }

  const expectedSelector = depositFunction.selector;

  if (
    transaction.data.slice(0, 10).toLowerCase() !==
    expectedSelector.toLowerCase()
  ) {
    throw new Error(
      "Pending transaction is not a Deposit Collateral call."
    );
  }

  console.log("Deposit Collateral function selector verified.");

const decodedData = lendingPoolInterface.decodeFunctionData(
  "depositCollateral",
  transaction.data
);

const collateralToken = decodedData[0] as string;
const collateralAmount = decodedData[1] as bigint;

if (collateralAmount <= 0n) {
  throw new Error(
    "Pending Deposit Collateral amount must be greater than zero."
  );
}

const matchingToken = QMS_TOKENS.find(
  (token) =>
    token.address.toLowerCase() === collateralToken.toLowerCase()
);

if (!matchingToken) {
  throw new Error(
    "Pending Deposit Collateral contains an unknown token."
  );
}

console.log("Verified collateral token:", matchingToken.symbol);
console.log("Verified collateral amount:", collateralAmount.toString());

}

  const receipt = await provider.getTransactionReceipt(txHash);

  if (!receipt) {
    return "pending";
  }

  return receipt.status === 1 ? "success" : "failed";
};

const handleDepositCollateral = async () => {
  
if (depositInProgressRef.current) {
  console.warn("A Deposit Collateral transaction is already in progress.");
  return;
}

depositInProgressRef.current = true;

setTransactionStatus("idle");
setTransactionError(null);
setTransactionHash(null);


try {
  if (!isConnected || !address) {
    console.warn("Please connect your OKX Wallet.");
    return;
  }

  if (!isQMSNetwork) {
    console.warn("Please switch to QMS Testnet.");
    return;
  }

if (!selectedAsset) {
  console.warn("Please select a collateral asset.");
  return;
}

if (amount.trim() === "") {
  console.warn("Please enter an amount.");
  return;
}

const depositAmount = Number(amount);

if (!Number.isFinite(depositAmount) || depositAmount <= 0) {
  console.warn("Please enter a valid amount greater than zero.");
  return;
}


const availableBalance = tokenBalances[selectedAsset];

if (availableBalance === undefined) {
  console.warn("Unable to determine wallet token balance.");
  return;
}

const walletBalanceAmount = Number(availableBalance);

if (
  !Number.isFinite(walletBalanceAmount) ||
  depositAmount > walletBalanceAmount
) {
  console.warn("Insufficient wallet balance.");
  return;
}


const supportedCollateralAssets = [
  "USDT",
  "USDC",
  "WQMS",
  "WBTC",
  "WETH",
];

if (!supportedCollateralAssets.includes(selectedAsset)) {
  console.warn("Selected asset is not supported as collateral.");
  return;
}


const selectedToken = QMS_TOKENS.find(
  (token) => token.symbol === selectedAsset
);

if (!selectedToken) {
  console.warn("Token configuration not found.");
  return;
}

const tokenAddress = selectedToken.address;
const tokenDecimals = selectedToken.decimals;

console.log("Selected token:", selectedToken.symbol);
console.log("Token address:", tokenAddress);
console.log("Token decimals:", tokenDecimals);


let amountInWei: bigint;

try {
  amountInWei = parseUnits(amount.trim(), tokenDecimals);
} catch {
  console.warn("Invalid token amount or decimal precision.");
  return;
}

if (amountInWei <= 0n) {
  console.warn("Deposit amount must be greater than zero.");
  return;
}

console.log("Deposit amount (smallest units):", amountInWei.toString());


const okxProvider = window.okxwallet?.ethereum ?? window.okxwallet;

if (!okxProvider) {
  console.warn("OKX Wallet provider not found.");
  return;
}

const provider = new BrowserProvider(okxProvider);

const network = await provider.getNetwork();

if (network.chainId !== 19480n) {
  console.warn("Wrong network. Please switch to QMS Testnet.");
  return;
}

console.log("OKX Wallet provider connected.");
console.log("Connected chain ID:", network.chainId.toString());


const signer = await provider.getSigner();
const signerAddress = await signer.getAddress();

if (signerAddress.toLowerCase() !== address.toLowerCase()) {
  console.warn("Signer address does not match connected wallet.");
  return;
}

console.log("Signer verified:", signerAddress);


const tokenContract = new Contract(
  tokenAddress,
  ERC20_ABI,
  provider
);

const onChainBalance: bigint = await tokenContract.balanceOf(
  signerAddress
);


if (amountInWei <= 0n) {
  throw new Error("Deposit amount must be greater than zero.");
}

if (amountInWei > onChainBalance) {
  throw new Error(
    "Insufficient on-chain token balance for Deposit Collateral."
  );
}


console.log("On-chain balance:", onChainBalance.toString());
console.log("Token balance verification passed.");


const currentAllowance: bigint = await tokenContract.allowance(
  signerAddress,
  QMS_LENDING_POOL_ADDRESS
);

const needsApproval = currentAllowance < amountInWei;

console.log("Current allowance:", currentAllowance.toString());
console.log("Required amount:", amountInWei.toString());
console.log("Approval required:", needsApproval);


const lendingPoolContract = new Contract(
  QMS_LENDING_POOL_ADDRESS,
  QMS_LENDING_POOL_ABI,
  provider
);

console.log(
  "Lending Pool address:",
  QMS_LENDING_POOL_ADDRESS
);


const assetConfig = await lendingPoolContract.assetConfigs(
  tokenAddress
);

console.log("Asset configuration:", assetConfig);


if (!assetConfig.supported) {
  console.warn("This token is not supported by the Lending Pool.");
  return;
}

if (!assetConfig.canCollateralize) {
  console.warn("This token cannot be used as collateral.");
  return;
}

if (Number(assetConfig.decimals) !== tokenDecimals) {
  console.warn("Token decimals do not match Lending Pool configuration.");
  return;
}

console.log("Collateral asset verification passed.");



const tokenContractWithSigner = tokenContract.connect(signer) as Contract;


console.log("ERC-20 contract ready for approval.");


if (needsApproval) {
  setTransactionStatus("approving");

  console.log("Requesting ERC-20 approval...");

  const approveTx = await tokenContractWithSigner.approve(
    QMS_LENDING_POOL_ADDRESS,
    amountInWei
  );

  console.log("Approval transaction:", approveTx.hash);

  const approveReceipt = await approveTx.wait();

  if (!approveReceipt || approveReceipt.status !== 1) {
    throw new Error("ERC-20 approval transaction failed.");
  }

  console.log("ERC-20 approval confirmed.");
  
const updatedAllowance: bigint = await tokenContract.allowance(
  signerAddress,
  QMS_LENDING_POOL_ADDRESS
);

if (updatedAllowance < amountInWei) {
  throw new Error(
    "Insufficient allowance after approval confirmation."
  );
}

console.log("Allowance verification passed.");

}


const lendingPoolWithSigner = lendingPoolContract.connect(
  signer
) as Contract;

console.log("Lending Pool signer ready.");


const finalAllowance: bigint = await tokenContract.allowance(
  signerAddress,
  QMS_LENDING_POOL_ADDRESS
);

if (finalAllowance < amountInWei) {
  throw new Error(
    "Insufficient ERC-20 allowance for Deposit Collateral."
  );
}

console.log("Final ERC-20 allowance verification passed.");

setTransactionStatus("depositing");

console.log("Preparing Deposit Collateral transaction...");

const depositTx = await lendingPoolWithSigner.depositCollateral(
  tokenAddress,
  amountInWei
);

setTransactionHash(depositTx.hash);


try {
  localStorage.setItem(
    `qms_pending_deposit_19480_${signerAddress.toLowerCase()}`,
    depositTx.hash
  );

  console.log("Pending Deposit transaction hash saved.");
} catch (storageError: unknown) {
  console.warn(
    "Unable to save pending transaction hash:",
    storageError
  );
}

console.log("Deposit transaction hash:", depositTx.hash);


let depositReceipt;

try {
  depositReceipt = await depositTx.wait();
} catch (waitError: unknown) {
  console.error(
    "Unable to confirm Deposit Collateral receipt:",
    waitError
  );

  setTransactionStatus("pending_confirmation");

  setTransactionError(
    "Deposit transaction was submitted, but confirmation could not be verified. Check the transaction hash before trying again."
  );

  return;
}

if (!depositReceipt) {
  setTransactionStatus("pending_confirmation");

  setTransactionError(
    "Deposit transaction has not been confirmed yet. Check the transaction hash before trying again."
  );

  return;
}

if (depositReceipt.status !== 1) {
  throw new Error("Deposit Collateral transaction failed.");
}



try {
  localStorage.removeItem(
    `qms_pending_deposit_19480_${signerAddress.toLowerCase()}`
  );

  console.log("Confirmed Deposit transaction removed from pending storage.");
} catch (storageError: unknown) {
  console.warn(
    "Unable to clear confirmed Deposit transaction from storage:",
    storageError
  );
}


setTransactionStatus("success");

console.log("Deposit Collateral confirmed successfully.");

try {
  await refreshTokenBalances(signerAddress);

  console.log("Wallet token balances refreshed successfully.");
} catch (refreshError: unknown) {
  console.warn(
    "Deposit succeeded, but wallet balance refresh failed:",
    refreshError
  );
}


try {
  await refreshLendingPool();

  console.log("Lending Pool data refreshed successfully.");
} catch (refreshError: unknown) {
  console.warn(
    "Deposit succeeded, but Lending Pool refresh failed:",
    refreshError
  );
}


  console.log("Deposit Collateral pre-check passed.");
  
  } catch (error: unknown) {
    
const walletError = error as {
  code?: number | string;
  message?: string;
  info?: {
    error?: {
      code?: number | string;
    };
  };
};

const isUserRejected =
  walletError?.code === 4001 ||
  walletError?.code === "ACTION_REJECTED" ||
  walletError?.info?.error?.code === 4001;

const errorMessage = isUserRejected
  ? "Transaction cancelled. You rejected the request in OKX Wallet."
  : error instanceof Error
    ? error.message
    : "An unexpected error occurred.";


    setTransactionStatus("error");
    setTransactionError(errorMessage);

    console.error("Deposit Collateral error:", error);
  }

finally {
  depositInProgressRef.current = false;
}

};

// All non-collateral actions use the same verified wallet, network and pool.
// Deposit Collateral keeps its existing recovery and confirmation flow.
const handleMarketTransaction = async () => {
  if (activeAction === "Deposit Collateral") {
    void handleDepositCollateral();
    return;
  }
  if (depositInProgressRef.current) return;
  depositInProgressRef.current = true;
  setTransactionStatus("idle");
  setTransactionError(null);
  setTransactionHash(null);
  let submittedHash: string | null = null;
  try {
    if (!isConnected || !isQMSNetwork || !address || !selectedAsset) {
      throw new Error("Connect OKX Wallet on QMS Testnet first.");
    }
    const token = QMS_TOKENS.find((item) => item.symbol === selectedAsset);
    if (!token) throw new Error("Unknown market token.");
    if (!/^\d+(?:\.\d+)?$/.test(amount.trim())) {
      throw new Error("Enter a positive token amount.");
    }
    const rawAmount = parseUnits(amount.trim(), token.decimals);
    if (rawAmount <= 0n) throw new Error("Amount must be greater than zero.");

    const injected = window.okxwallet?.ethereum ?? window.okxwallet;
    if (!injected) throw new Error("OKX Wallet not detected.");
    const provider = new BrowserProvider(injected);
    const network = await provider.getNetwork();
    if (network.chainId !== 19480n) throw new Error("Switch to QMS Testnet.");
    const signer = await provider.getSigner();
    const signerAddress = await signer.getAddress();
    if (signerAddress.toLowerCase() !== address.toLowerCase()) {
      throw new Error("Wallet account changed. Reconnect and try again.");
    }
    const pool = new Contract(QMS_LENDING_POOL_ADDRESS, QMS_LENDING_POOL_ABI, signer);
    const erc20 = new Contract(token.address, ERC20_ABI, signer);
    const config = await pool.assetConfigs(token.address);
    if (!config.supported || Number(config.decimals) !== token.decimals) {
      throw new Error("Unsupported asset or token decimals mismatch.");
    }
    const action = activeAction;
    const requiresBorrowMarket = action === "Supply" || action === "Withdraw" ||
      action === "Borrow" || action === "Repay";
    if (requiresBorrowMarket && !config.canBorrow) {
      throw new Error(`${token.symbol} is not enabled for this operation.`);
    }
    if (action === "Withdraw Collateral" && !config.canCollateralize) {
      throw new Error(`${token.symbol} is not enabled as collateral.`);
    }
    if (action === "Withdraw" || action === "Repay" || action === "Withdraw Collateral") {
      const readFunction = action === "Withdraw" ? "suppliedBalances" :
        action === "Repay" ? "debtBalances" : "collateralBalances";
      const position: bigint = await pool[readFunction](signerAddress, token.address);
      if (rawAmount > position) throw new Error(`Amount exceeds your ${action === "Repay" ? "debt" : action === "Withdraw" ? "supplied balance" : "collateral"}.`);
    }
    if (action === "Withdraw" || action === "Borrow") {
      const liquidity: bigint = await erc20.balanceOf(QMS_LENDING_POOL_ADDRESS);
      if (rawAmount > liquidity) throw new Error("Insufficient pool liquidity.");
    }
    if (action === "Borrow") {
      const availableUsd: bigint = await pool.getAvailableBorrowValue(signerAddress);
      const requestedUsd: bigint = await pool.getAssetValue(token.address, rawAmount);
      if (requestedUsd > availableUsd) {
        throw new Error("Borrow amount exceeds your remaining borrowing capacity.");
      }
    }
    if (action === "Supply" || action === "Repay") {
      const balance: bigint = await erc20.balanceOf(signerAddress);
      if (rawAmount > balance) throw new Error("Insufficient wallet token balance.");
      const allowance: bigint = await erc20.allowance(signerAddress, QMS_LENDING_POOL_ADDRESS);
      if (allowance < rawAmount) {
        setTransactionStatus("approving");
        // Approve only the requested amount, never an unlimited allowance.
        const approvalTx = await erc20.approve(QMS_LENDING_POOL_ADDRESS, rawAmount);
        const approvalReceipt = await approvalTx.wait();
        if (!approvalReceipt || approvalReceipt.status !== 1) {
          throw new Error("Token approval failed.");
        }
        const updatedAllowance: bigint = await erc20.allowance(signerAddress, QMS_LENDING_POOL_ADDRESS);
        if (updatedAllowance < rawAmount) throw new Error("Approval allowance insufficient.");
      }
    }
    const method = action === "Supply" ? "supply" :
      action === "Withdraw" ? "withdraw" :
      action === "Withdraw Collateral" ? "withdrawCollateral" :
      action === "Borrow" ? "borrow" : "repay";

    // Reverts before a real transaction if the contract rejects this action.
    await pool[method].staticCall(token.address, rawAmount);
    setTransactionStatus("depositing");
    const tx = await pool[method](token.address, rawAmount);
    submittedHash = tx.hash;
    setTransactionHash(tx.hash);
    setTransactionStatus("pending_confirmation");
    const receipt = await tx.wait();
    if (!receipt) throw new Error("Transaction submitted but confirmation is not available yet.");
    if (receipt.status !== 1) throw new Error("Transaction reverted on-chain.");
    setTransactionStatus("success");
    setAmount("");
    await Promise.allSettled([
      refreshTokenBalances(signerAddress),
      Promise.resolve(refreshLendingPool()),
    ]);
  } catch (err: unknown) {
    const walletError = err as { code?: number | string; info?: { error?: { code?: number | string } } };
    const rejected = walletError.code === 4001 || walletError.code === "ACTION_REJECTED" ||
      walletError.info?.error?.code === 4001;
    const message = rejected ? "Transaction cancelled in OKX Wallet." :
      err instanceof Error ? err.message : "Transaction failed.";
    if (submittedHash) {
      // A known hash may be pending or reverted; verify it on Explorer before retrying.
      setTransactionStatus("pending_confirmation");
      setTransactionError(`${message} Check the transaction on Explorer before retrying.`);
    } else {
      setTransactionStatus("error");
      setTransactionError(message);
    }
    console.error(`${activeAction} failed:`, err);
  } finally {
    depositInProgressRef.current = false;
  }
};

const walletBalance = selectedAsset
  ? tokenBalances[selectedAsset]
  : undefined;

const amountNumber = Number(amount);
const walletBalanceNumber = Number(walletBalance);



const isAmountInvalid =
  amount.trim() !== "" &&
  (!Number.isFinite(amountNumber) ||
    amountNumber <= 0 ||
    ((
      activeAction === "Supply" ||
      activeAction === "Deposit Collateral" ||
      activeAction === "Repay"
    ) &&
      (walletBalance === undefined ||
        !Number.isFinite(walletBalanceNumber) ||
        amountNumber > walletBalanceNumber)));


const canDepositCollateral =

  isConnected &&
  isQMSNetwork &&
  address !== null &&
  selectedAsset !== null &&
  amount.trim() !== "" &&
  !isAmountInvalid &&
  transactionStatus !== "approving" &&
  transactionStatus !== "depositing" &&
transactionStatus !== "pending_confirmation" &&
  !depositInProgressRef.current;

const openMarket = (symbol: string) => {
  
if (
  depositInProgressRef.current ||
  transactionStatus === "pending_confirmation"
) {

    console.warn(
      "Cannot open another market while a transaction is in progress."
    );
    return;
  }

  setSelectedAsset(symbol);
  setActiveAction("Supply");
  setAmount("");

  setTransactionStatus("idle");
  setTransactionError(null);
  setTransactionHash(null);
};


  
const closeMarket = () => {
  
if (
  depositInProgressRef.current ||
  transactionStatus === "pending_confirmation"
) {

    console.warn(
      "Cannot close Market Modal while a transaction is in progress."
    );
    return;
  }

  setSelectedAsset(null);
  setAmount("");
};


  return (
    <>
      {(["success", "error", "pending_confirmation"] as string[]).includes(transactionStatus) && (
        <div className={`qms-tx-toast qms-tx-toast--${transactionStatus}`}
          role={transactionStatus === "error" ? "alert" : "status"}>
          {transactionStatus !== "pending_confirmation" && (
            <button type="button" className="qms-tx-toast-close"
              aria-label="Dismiss notification"
              onClick={() => {
                setTransactionStatus("idle");
                setTransactionError(null);
                setTransactionHash(null);
              }}>×</button>
          )}
          <strong>{transactionStatus === "success" ? "✓ Transaction successful" :
            transactionStatus === "error" ? "✕ Transaction failed" : "Transaction pending"}</strong>
          {transactionStatus === "error" && <span>{
            transactionError?.toLowerCase().includes("reject") || transactionError?.toLowerCase().includes("cancel")
              ? "Transaction cancelled in wallet."
              : transactionError ?? "Transaction could not be completed. Check your wallet or Explorer."
          }</span>}
          {transactionStatus === "pending_confirmation" && <span>{transactionError ?? "Waiting for on-chain confirmation. Do not resubmit until verified."}</span>}
          {transactionHash && /^0x[a-fA-F0-9]{64}$/.test(transactionHash) && (
            <a href={`https://testnet.qmsscan.io/tx/${transactionHash}`}
              target="_blank" rel="noopener noreferrer">Explorer transaction ↗</a>
          )}
        </div>
      )}
      <div className="market-table">
        <div className="table-head">
          <span>Asset</span>
          
<span>Supplied</span>
<span>Borrowed</span>

          <span>Actions</span>
        </div>

        {markets.map((market) => (
          <div className="market-row" key={market.symbol}>
            <div className="asset-info">
              <img
                className="asset-icon"
                src={market.logo}
                alt={`${market.symbol} logo`}
              />
              <div>
                <strong>{market.symbol}</strong>
                <small>{market.name}</small>
              </div>
            </div>

            
<span className="market-placeholder">
  {tokenPositions[market.symbol]
    ? `${Number(tokenPositions[market.symbol].supplied).toLocaleString(undefined, {
        maximumFractionDigits: 6,
      })} ${market.symbol}`
    : "—"}
</span>

<span className="market-placeholder">
  {tokenPositions[market.symbol]
    ? `${Number(tokenPositions[market.symbol].borrowed).toLocaleString(undefined, {
        maximumFractionDigits: 6,
      })} ${market.symbol}`
    : "—"}
</span>


            <button
              className="market-action"
              type="button"
              onClick={() => openMarket(market.symbol)}
            >
              Manage
            </button>
          </div>
        ))}
      </div>

      {selectedAsset && (
        <div className="market-modal-overlay" onClick={closeMarket}>
          <div
            className="market-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedAsset} market`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="market-modal-header">
              <h3>{selectedAsset} Market</h3>
              <button
                type="button"
                onClick={closeMarket}
                aria-label="Close market"
              >
                ×
              </button>
            </div>

            <p className="market-modal-description">
              Manage your lending and borrowing positions on QMS Testnet.
            </p>

            <div className="market-modal-actions">
              
{(
  [
    "Supply",
    "Withdraw",
    "Deposit Collateral",
    "Withdraw Collateral",
    "Borrow",
    "Repay",
  ] as const
).map(

                (action) => (
                  <button
                    key={action}
                    type="button"

disabled={
  transactionStatus === "approving" ||
  transactionStatus === "depositing" ||
  transactionStatus === "pending_confirmation"
}

                    className={activeAction === action ? "active" : ""}
                    
onClick={() => {
  if (depositInProgressRef.current) {
    console.warn(
      "Cannot change market action while a transaction is in progress."
    );
    return;
  }

  setActiveAction(action);
  setAmount("");
}}

                  >
                    {action}
                  </button>
                )
              )}
            </div>

            <div className="market-amount-section">
              
<div className="market-amount-header">
  <span>Amount</span>

  <span>
    {activeAction === "Supply" || activeAction === "Deposit Collateral" || activeAction === "Repay"
      ? `Wallet: ${walletBalance ?? "—"} ${selectedAsset}`
      : activeAction === "Withdraw"
        ? `Supplied: ${tokenPositions[selectedAsset]?.supplied ?? "—"} ${selectedAsset}`
        : activeAction === "Withdraw Collateral"
          ? `Collateral: ${tokenPositions[selectedAsset]?.collateral ?? "—"} ${selectedAsset}`
          : activeAction === "Borrow"
            ? `Available to borrow: ${availableBorrowUsd === null ? "—" : `$${Number(availableBorrowUsd).toFixed(2)}`}`
            : ""}
  </span>
</div>


              <div className="market-amount-input">
                <input
                  type="number" 

disabled={
  !isConnected ||
  !isQMSNetwork ||
  transactionStatus === "approving" ||
  
transactionStatus === "depositing" ||

    transactionStatus === "pending_confirmation"
}


                  min="0"
                  step="any"
                  placeholder="0.00"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                />
                
<div className="market-input-actions">
  

{(activeAction === "Supply" ||
  activeAction === "Deposit Collateral" ||
  activeAction === "Repay" ||
  activeAction === "Withdraw" ||
  activeAction === "Withdraw Collateral") &&
  selectedAsset &&
  (activeAction === "Withdraw" || activeAction === "Withdraw Collateral" || tokenBalances[selectedAsset] !== undefined) && (
    <button
      type="button"
      className="market-max-btn"
      
disabled={
  !isConnected ||
  !isQMSNetwork ||
  transactionStatus === "approving" ||
  
transactionStatus === "depositing" ||

    transactionStatus === "pending_confirmation"
}

      onClick={() => {
        const max = activeAction === "Withdraw"
          ? tokenPositions[selectedAsset]?.supplied
          : activeAction === "Withdraw Collateral"
            ? tokenPositions[selectedAsset]?.collateral
            : activeAction === "Repay"
              ? (() => {
                  const debt = tokenPositions[selectedAsset]?.borrowed;
                  const wallet = tokenBalances[selectedAsset];
                  return debt && wallet && Number(debt) < Number(wallet) ? debt : (wallet ?? "");
                })()
              : tokenBalances[selectedAsset];
        setAmount(max ?? "");
      }}
    >
      MAX
    </button>
  )}


  <strong>{selectedAsset}</strong>
</div>

              </div>
            </div>

{isAmountInvalid && (
  <p className="market-amount-error">
    {amountNumber <= 0 || !Number.isFinite(amountNumber)
      ? "Please enter a valid amount greater than zero."
      : "Amount exceeds your wallet balance."}
  </p>
)}




            
<button
  type="button"
  className="market-submit-btn"
  disabled={!canDepositCollateral}
  onClick={() => {
    if (!canDepositCollateral || depositInProgressRef.current) return;
    void handleMarketTransaction();
  }}
>
  {activeAction === "Deposit Collateral"
    ? transactionStatus === "approving"
      ? "Approving..."
      
: transactionStatus === "depositing"
  ? "Depositing..."
  : transactionStatus === "pending_confirmation"
    ? "Pending Confirmation..."
    : "Deposit Collateral"

    : transactionStatus === "approving" ? "Approving..."
      : transactionStatus === "depositing" ? `${activeAction}...`
      : transactionStatus === "pending_confirmation" ? "Pending Confirmation..."
      : activeAction}
</button>


            
<p className="market-modal-notice">
  {activeAction === "Deposit Collateral"
    ? "Deposit Collateral is enabled on QMS Testnet. Please verify the token, amount, and wallet network before confirming any transaction."
    : "QMS Testnet transaction. Review token, amount and network before confirming in OKX Wallet."}
</p>

          </div>
        </div>
      )}
    </>
  );
}


export default App;
