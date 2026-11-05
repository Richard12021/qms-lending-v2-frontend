

import { useState } from "react";
import {
  BookOpen,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import "./LendingDocs.css";


export const DOC_SECTIONS = [
  { id: "introduction", title: "Introduction" },
  { id: "getting-started", title: "Getting Started" },
  { id: "supply-withdraw", title: "Supply & Withdraw" },
  { id: "collateral", title: "Collateral" },
  { id: "borrow-repay", title: "Borrow & Repay" },
  { id: "health-factor", title: "Health Factor" },
  { id: "liquidation", title: "Liquidation" },
  { id: "risk-management", title: "Risk Management" },
  { id: "smart-contracts", title: "Smart Contracts" },
  { id: "faq", title: "FAQ" },
] as const;

type SectionId = (typeof DOC_SECTIONS)[number]["id"];

export default function LendingDocs() {
  const [activeSection, setActiveSection] =
    useState<SectionId>("introduction");

  const currentSection = DOC_SECTIONS.find(
    (section) => section.id === activeSection
  );

  return (
    <div className="lending-docs">
      <div className="docs-header">
        <div>
          <span className="docs-eyebrow">
            QMS LENDING V2 • DOCUMENTATION
          </span>
          <h1>Documentation</h1>
          <p>
            Everything you need to understand lending,
            borrowing, collateral and risk management
            on QMS Testnet.
          </p>
        </div>

        <span className="docs-version">
          Testnet V2
        </span>
      </div>

      <div className="docs-layout">
        <aside className="docs-sidebar">
          <div className="docs-sidebar-title">
            <BookOpen size={16} />
            CONTENTS
          </div>

          <nav aria-label="Documentation sections">
            {DOC_SECTIONS.map((section) => (
              <button
                key={section.id}
                type="button"
                className={
                  activeSection === section.id
                    ? "docs-nav-item active"
                    : "docs-nav-item"
                }
                onClick={() => setActiveSection(section.id)}
              >
                <span>{section.title}</span>
                <ChevronRight size={15} />
              </button>
            ))}
          </nav>
        </aside>

        <article className="docs-article">
          <div className="docs-article-label">
            QMS LENDING / {currentSection?.title}
          </div>

          {activeSection === "introduction" && (
            <>
              <h2>Welcome to QMS Lending</h2>

              <p>
                QMS Lending V2 is an experimental
                decentralized lending and borrowing
                application deployed on QMS Testnet.
              </p>

              <p>
                Users can interact with supported ERC-20
                test tokens, supply assets, deposit
                collateral, borrow available assets,
                repay debt and manage their positions.
              </p>

              <div className="docs-feature-grid">
                <div className="docs-feature-card">
                  <Wallet size={22} />
                  <h3>Asset Management</h3>
                  <p>
                    Supply and withdraw supported
                    testnet tokens.
                  </p>
                </div>

                <div className="docs-feature-card">
                  <ShieldCheck size={22} />
                  <h3>Risk Monitoring</h3>
                  <p>
                    Monitor collateral, debt,
                    borrowing capacity and health factor.
                  </p>
                </div>
              </div>

              <h3>Supported Assets</h3>

              <p>
                The current deployment includes USDT,
                USDC, WQMS, WBTC and WETH test tokens.
                Available actions depend on each
                asset's on-chain configuration.
              </p>

              <div className="docs-notice-box">
                <strong>Testnet Disclaimer</strong>
                <p>
                  QMS Lending V2 is an experimental
                  testnet application. Test tokens
                  have no guaranteed monetary value.
                  This application has not been
                  presented as an audited or
                  production-ready lending protocol.
                </p>
              </div>

              <h3>Network</h3>

              <p>
                QMS Testnet uses Chain ID 19480.
                Transactions and smart contracts can
                be inspected using the QMS Explorer.
              </p>

              <a
                className="docs-external-link"
                href="https://testnet.qmsscan.io/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open QMS Explorer
                <ExternalLink size={15} />
              </a>
            </>
          )}

{activeSection === "getting-started" && (
  <>
    <h2>Getting Started</h2>

    <p>
      Follow this guide to connect your wallet,
      configure QMS Testnet and prepare test tokens
      before interacting with QMS Lending V2.
    </p>

    <h3>Step 1 — Install OKX Wallet</h3>

    <p>
      QMS Lending V2 currently supports connecting
      through the OKX Wallet browser extension.
      Install the extension from the official
      OKX Wallet website and create or import
      your wallet.
    </p>

    <a
      className="docs-external-link"
      href="https://web3.okx.com/wallet"
      target="_blank"
      rel="noopener noreferrer"
    >
      OKX Wallet
      <ExternalLink size={15} />
    </a>

    <h3>Step 2 — Configure QMS Testnet</h3>

    <p>
      Add the following network to your wallet.
      If prompted, approve the network configuration.
    </p>

    <div className="docs-notice-box">
      <strong>QMS Testnet Configuration</strong>
      <p>Network Name: QMS Testnet</p>
      <p>Chain ID: 19480</p>
      <p>RPC URL: https://rpc.testnet.qms.finance</p>
      <p>Native Currency: QMS</p>
      <p>Explorer: https://testnet.qmsscan.io</p>
    </div>

    <h3>Step 3 — Get Testnet Tokens</h3>

    <p>
      You need testnet QMS to pay transaction
      fees. Visit the QMS Faucet and follow
      the instructions to request test tokens.
    </p>

    <a
      className="docs-external-link"
      href="https://faucet.testnet.qms.finance/"
      target="_blank"
      rel="noopener noreferrer"
    >
      QMS Testnet Faucet
      <ExternalLink size={15} />
    </a>

    <h3>Step 4 — Connect Your Wallet</h3>

    <p>
      Open QMS Lending V2, click Connect Wallet,
      select OKX Wallet and approve the
      connection request.
    </p>

    <p>
      Make sure your wallet is connected to
      QMS Testnet (Chain ID 19480).
    </p>

    <h3>Step 5 — Explore Supported Assets</h3>

    <p>
      Navigate to Markets to view USDT, USDC,
      WQMS, WBTC and WETH. Your wallet balances
      and lending positions are read from
      the connected testnet.
    </p>

    <div className="docs-notice-box">
      <strong>Important</strong>
      <p>
        Native QMS is used for transaction fees.
        WQMS is a separate ERC-20 token.
        Having native QMS does not automatically
        mean you have WQMS available to supply.
      </p>
    </div>

    <h3>Step 6 — Start Using QMS Lending</h3>

    <p>
      Once connected, you can explore Supply,
      Withdraw, Deposit Collateral, Borrow
      and Repay actions.
      Transactions may require ERC-20 token
      approvals and wallet confirmations.
    </p>

    <p>
      Borrowing capacity depends on collateral,
      on-chain risk parameters, available
      liquidity and valid oracle prices.
      Some actions may be unavailable when
      oracle data is stale.
    </p>
  </>
)}

{activeSection === "supply-withdraw" && (
  <>
    <h2>Supply & Withdraw</h2>

    <p>
      QMS Lending V2 allows users to supply supported
      ERC-20 test tokens to the lending pool and
      withdraw their supplied assets when sufficient
      liquidity is available.
    </p>

    <h3>What is Supply?</h3>

    <p>
      Supplying means transferring supported tokens
      from your wallet into the lending pool smart
      contract. The contract tracks your supplied
      balance for each asset.
    </p>

    <div className="docs-notice-box">
      <strong>Example — Supplying USDT</strong>
      <p>Initial wallet balance: 100 USDT</p>
      <p>Supply amount: 40 USDT</p>
      <p>Wallet balance after supply: 60 USDT</p>
      <p>Supplied position: 40 USDT</p>
      <p>
        This example excludes transaction fees,
        which are paid in native QMS.
      </p>
    </div>

    <h3>How to Supply Assets</h3>

    <ol>
      <li>Connect your OKX Wallet to QMS Testnet.</li>
      <li>Open the Markets page.</li>
      <li>Select an asset and click Manage.</li>
      <li>Choose the Supply action.</li>
      <li>Enter the amount you want to supply.</li>
      <li>
        Approve the token allowance if required.
      </li>
      <li>
        Confirm the supply transaction in your wallet.
      </li>
      <li>
        Wait for on-chain confirmation and refresh
        your position if necessary.
      </li>
    </ol>

    <h3>Why is Token Approval Required?</h3>

    <p>
      ERC-20 tokens require permission before a
      smart contract can transfer them from your
      wallet. This permission is called an allowance.
    </p>

    <p>
      When your allowance is insufficient, the
      application requests an approval transaction
      before submitting the supply transaction.
    </p>

    <div className="docs-notice-box">
      <strong>Important</strong>
      <p>
        Approval does not supply tokens by itself.
        The supply transaction must also be confirmed.
        Review the token, spender and allowance
        amount before approving.
      </p>
    </div>

    <h3>What is Withdraw?</h3>

    <p>
      Withdrawing means requesting the return of
      previously supplied tokens from the lending
      pool to your connected wallet.
    </p>

    <p>
      A withdrawal must satisfy the contract's
      balance checks and available pool liquidity.
    </p>

    <h3>How to Withdraw Assets</h3>

    <ol>
      <li>Connect your wallet.</li>
      <li>Open Markets and select an asset.</li>
      <li>Click Manage and choose Withdraw.</li>
      <li>Enter the withdrawal amount.</li>
      <li>Confirm the transaction in your wallet.</li>
      <li>Wait for confirmation and review your balance.</li>
    </ol>

    <div className="docs-notice-box">
      <strong>Example — Withdrawing USDT</strong>
      <p>Supplied position: 40 USDT</p>
      <p>Withdrawal amount: 15 USDT</p>
      <p>Remaining supplied position: 25 USDT</p>
      <p>
        The transaction succeeds only if all
        contract conditions are satisfied.
      </p>
    </div>

    <h3>Common Transaction Issues</h3>

    <ul>
      <li>
        <strong>Insufficient wallet balance:</strong>{" "}
        You cannot supply more tokens than you own.
      </li>
      <li>
        <strong>Insufficient allowance:</strong>{" "}
        The contract may require an ERC-20 approval.
      </li>
      <li>
        <strong>Insufficient pool liquidity:</strong>{" "}
        A withdrawal may be rejected if the pool
        cannot return the requested amount.
      </li>
      <li>
        <strong>Wrong network:</strong>{" "}
        Switch to QMS Testnet, Chain ID 19480.
      </li>
      <li>
        <strong>Transaction rejected:</strong>{" "}
        The action is cancelled if you reject
        the wallet confirmation.
      </li>
    </ul>

    <h3>Supply vs. Collateral</h3>

    <p>
      In QMS Lending V2, supplying assets and
      depositing collateral are separate actions.
      A supplied balance should not be assumed
      to increase borrowing capacity automatically.
    </p>

    <p>
      To use an asset as collateral, select
      Deposit Collateral and follow the
      corresponding process.
    </p>

    <div className="docs-notice-box">
      <strong>Testnet Notice</strong>
      <p>
        Supplied token balances are tracked
        on-chain. Do not assume that supplying
        generates interest or rewards unless
        the deployed contract explicitly
        implements those mechanisms.
      </p>
    </div>
  </>
)}

          
{activeSection === "collateral" && (
  <>
    <h2>Collateral</h2>

    <p>
      Collateral is an asset deposited into QMS Lending V2
      to support a borrowing position. The protocol
      evaluates eligible collateral using oracle prices
      and on-chain risk parameters.
    </p>

    <h3>Supply vs. Collateral</h3>

    <p>
      QMS Lending V2 separates supplying liquidity
      from depositing collateral.
    </p>

    <ul>
      <li>
        <strong>Supply:</strong> Adds tokens to the
        lending pool's available liquidity.
      </li>
      <li>
        <strong>Deposit Collateral:</strong> Locks
        eligible tokens as backing for your debt.
      </li>
    </ul>

    <p>
      Supplying 100 USDT does not automatically mean
      that 100 USDT is counted as collateral.
    </p>

    <h3>How to Deposit Collateral</h3>

    <ol>
      <li>Connect your OKX Wallet to QMS Testnet.</li>
      <li>Navigate to the Markets page.</li>
      <li>Select the asset you want to use.</li>
      <li>Click Manage.</li>
      <li>Select Deposit Collateral.</li>
      <li>Enter the amount to deposit.</li>
      <li>Approve the ERC-20 allowance if required.</li>
      <li>Confirm the transaction in your wallet.</li>
      <li>Wait for confirmation and check your position.</li>
    </ol>

    <h3>Collateral Value</h3>

    <p>
      Collateral value is determined using the
      amount deposited and the asset's oracle price.
    </p>

    <div className="docs-notice-box">
      <strong>Example — Collateral Valuation</strong>
      <p>Collateral deposited: 2 WETH</p>
      <p>Illustrative WETH price: $2,500</p>
      <p>Total collateral value: $5,000</p>
      <p>
        Formula: Collateral Amount × Oracle Price
      </p>
    </div>

    <h3>Loan-to-Value (LTV)</h3>

    <p>
      Loan-to-Value determines the maximum borrowing
      value permitted against eligible collateral.
      The applicable LTV is defined by the deployed
      smart contract's asset configuration.
    </p>

    <div className="docs-notice-box">
      <strong>Example — 70% LTV</strong>
      <p>Total eligible collateral value: $5,000</p>
      <p>Illustrative LTV: 70%</p>
      <p>Maximum borrow value: $3,500</p>
      <p>Formula: $5,000 × 70% = $3,500</p>
    </div>

    <p>
      The 70% LTV above is an illustrative example.
      Actual limits depend on the configured
      parameters for each supported asset.
    </p>

    <h3>Borrowing Capacity</h3>

    <p>
      Your available borrowing capacity depends
      on eligible collateral value, applicable
      LTV limits and existing debt.
    </p>

    <div className="docs-notice-box">
      <strong>Example — Available Borrow</strong>
      <p>Maximum borrow value: $3,500</p>
      <p>Existing debt value: $1,000</p>
      <p>Remaining capacity: $2,500</p>
      <p>
        Actual borrowing is also limited by
        pool liquidity and contract restrictions.
      </p>
    </div>

    <h3>How to Withdraw Collateral</h3>

    <ol>
      <li>Connect your wallet.</li>
      <li>Open Markets and select your collateral asset.</li>
      <li>Click Manage and select Withdraw Collateral.</li>
      <li>Enter the amount you want to withdraw.</li>
      <li>Review your remaining collateral and debt.</li>
      <li>Confirm the transaction.</li>
    </ol>

    <h3>Why Can Collateral Withdrawal Fail?</h3>

    <p>
      A withdrawal can be rejected if removing
      collateral would leave insufficient backing
      for your outstanding debt.
    </p>

    <ul>
      <li>The requested amount exceeds your balance.</li>
      <li>Remaining collateral fails the LTV check.</li>
      <li>Required oracle prices are stale or unavailable.</li>
      <li>The asset or action is restricted by the contract.</li>
      <li>The wallet is connected to the wrong network.</li>
    </ul>

    <h3>Collateral Risk</h3>

    <p>
      Collateral values can change when oracle prices
      change. A decline in collateral value or an
      increase in debt value may reduce borrowing
      capacity and worsen your health factor.
    </p>

    <div className="docs-notice-box">
      <strong>Risk Warning</strong>
      <p>
        Deposited collateral may be subject to
        liquidation if a borrowing position
        becomes undercollateralized.
        Monitor your health factor and avoid
        borrowing at the maximum permitted limit.
      </p>
    </div>
  </>
)}


{activeSection === "borrow-repay" && (
  <>
    <h2>Borrow & Repay</h2>

    <p>
      QMS Lending V2 allows users to borrow supported
      ERC-20 test tokens against eligible collateral.
      Borrowing is subject to the protocol's on-chain
      risk parameters, oracle prices and available
      liquidity.
    </p>

    <h3>What is Borrowing?</h3>

    <p>
      Borrowing means receiving tokens from the
      lending pool while maintaining sufficient
      collateral to support the outstanding debt.
    </p>

    <p>
      Borrowed tokens are transferred to your wallet,
      while your debt is recorded by the lending
      pool smart contract.
    </p>

    <h3>How to Borrow Assets</h3>

    <ol>
      <li>Connect OKX Wallet to QMS Testnet.</li>
      <li>Deposit eligible collateral.</li>
      <li>Open the Markets page.</li>
      <li>Select the asset you want to borrow.</li>
      <li>Click Manage and choose Borrow.</li>
      <li>Enter the desired borrowing amount.</li>
      <li>Review your available borrowing capacity.</li>
      <li>Confirm the transaction in your wallet.</li>
      <li>Wait for confirmation and check your debt.</li>
    </ol>

    <h3>Borrowing Limits</h3>

    <p>
      Your borrowing capacity depends on collateral
      valuation, the configured LTV limits, existing
      debt and the pool's available liquidity.
    </p>

    <div className="docs-notice-box">
      <strong>Example — Borrowing USDT</strong>
      <p>Eligible collateral value: $2,000</p>
      <p>Illustrative LTV: 70%</p>
      <p>Maximum borrow value: $1,400</p>
      <p>Existing debt: $400</p>
      <p>Remaining borrowing capacity: $1,000</p>
      <p>
        If the pool has only 600 USDT available,
        you cannot borrow 1,000 USDT in a single
        transaction, even if your collateral
        supports that amount.
      </p>
    </div>

    <p>
      The values above are illustrative. Actual
      borrowing limits depend on the deployed
      contract and current oracle data.
    </p>

    <h3>What Happens After Borrowing?</h3>

    <ul>
      <li>
        Your wallet receives the borrowed tokens.
      </li>
      <li>
        Your outstanding debt increases.
      </li>
      <li>
        Your remaining borrowing capacity decreases.
      </li>
      <li>
        Your health factor may decrease as your
        debt increases.
      </li>
    </ul>

    <h3>What is Repayment?</h3>

    <p>
      Repayment means returning borrowed tokens
      to the lending pool to reduce or clear
      your outstanding debt.
    </p>

    <p>
      QMS Lending V2 supports partial and full
      repayment, subject to the deployed
      contract's validation rules.
    </p>

    <h3>How to Repay a Loan</h3>

    <ol>
      <li>Connect your wallet to QMS Testnet.</li>
      <li>Open Markets and select the borrowed asset.</li>
      <li>Click Manage and choose Repay.</li>
      <li>Enter the amount you want to repay.</li>
      <li>
        Approve the ERC-20 token allowance
        if required.
      </li>
      <li>Confirm the repayment transaction.</li>
      <li>Wait for confirmation.</li>
      <li>Review your remaining debt and health factor.</li>
    </ol>

    <h3>Partial vs. Full Repayment</h3>

    <div className="docs-notice-box">
      <strong>Example — Partial Repayment</strong>
      <p>Outstanding debt: 500 USDT</p>
      <p>Repayment amount: 200 USDT</p>
      <p>Remaining debt: 300 USDT</p>
    </div>

    <div className="docs-notice-box">
      <strong>Example — Full Repayment</strong>
      <p>Outstanding debt: 300 USDT</p>
      <p>Repayment amount: 300 USDT</p>
      <p>Remaining debt: 0 USDT</p>
    </div>

    <h3>Why Can Borrowing Fail?</h3>

    <ul>
      <li>
        Insufficient eligible collateral.
      </li>
      <li>
        The requested amount exceeds borrowing
        capacity.
      </li>
      <li>
        Insufficient available pool liquidity.
      </li>
      <li>
        Oracle prices are stale or unavailable.
      </li>
      <li>
        The asset is not enabled for borrowing.
      </li>
      <li>
        The transaction is rejected in the wallet.
      </li>
    </ul>

    <h3>Why Can Repayment Fail?</h3>

    <ul>
      <li>
        Insufficient token balance in your wallet.
      </li>
      <li>
        Insufficient ERC-20 allowance.
      </li>
      <li>
        Invalid repayment amount.
      </li>
      <li>
        Wrong network or wallet connection.
      </li>
      <li>
        A transaction simulation or on-chain
        validation fails.
      </li>
    </ul>

    <h3>Borrowing Risk</h3>

    <p>
      Borrowing increases your debt exposure.
      Changes in collateral prices or debt
      valuation can reduce your health factor
      and potentially make your position
      eligible for liquidation.
    </p>

    <div className="docs-notice-box">
      <strong>Important Risk Notice</strong>
      <p>
        Avoid borrowing at your maximum permitted
        limit. Keep a safety margin, monitor
        your position and ensure that oracle
        data is valid before relying on displayed
        borrowing values.
      </p>
    </div>
  </>
)}


{activeSection === "health-factor" && (
  <>
    <h2>Health Factor</h2>

    <p>
      Health Factor (HF) is a risk indicator that
      measures how well a borrowing position is
      supported by its collateral.
    </p>

    <p>
      A higher Health Factor generally indicates
      a larger safety margin. A lower Health Factor
      indicates that a position is closer to
      potential liquidation.
    </p>

    <h3>How is Health Factor Calculated?</h3>

    <p>
      In a lending model that uses collateral
      liquidation thresholds, Health Factor
      can be expressed as:
    </p>

    <div className="docs-notice-box">
      <strong>Health Factor Formula</strong>
      <p>
        HF = Liquidation-Adjusted Collateral Value
        / Total Debt Value
      </p>
      <p>
        For a single collateral asset:
      </p>
      <p>
        HF = (Collateral Value × Liquidation Threshold)
        / Total Debt Value
      </p>
    </div>

    <p>
      When multiple collateral assets are supported,
      each asset may have a different liquidation
      threshold. The exact calculation depends
      on the deployed contract implementation.
    </p>

    <h3>Example — Calculating Health Factor</h3>

    <p>
      Consider a hypothetical borrowing position
      with the following parameters:
    </p>

    <div className="docs-notice-box">
      <strong>Example Position</strong>
      <p>Total collateral value: $2,000</p>
      <p>Illustrative liquidation threshold: 80%</p>
      <p>Total debt value: $1,000</p>
      <p>Liquidation-adjusted collateral: $1,600</p>
      <p>Health Factor: 1.60</p>
      <p>
        Calculation: ($2,000 × 0.80) / $1,000 = 1.60
      </p>
    </div>

    <p>
      In this example, the position has a
      Health Factor of 1.60, meaning it has
      a buffer above the illustrative
      liquidation boundary of HF = 1.
    </p>

    <h3>Understanding Health Factor Levels</h3>

    <div className="docs-notice-box">
      <strong>HF Above 2.0 — Larger Buffer</strong>
      <p>
        The position has a relatively large
        collateral buffer compared with its debt.
        This does not eliminate market risk.
      </p>
    </div>

    <div className="docs-notice-box">
      <strong>HF Between 1.5 and 2.0 — Moderate Buffer</strong>
      <p>
        The position has some room to absorb
        adverse changes in collateral or debt
        valuations.
      </p>
    </div>

    <div className="docs-notice-box">
      <strong>HF Between 1.0 and 1.5 — Elevated Risk</strong>
      <p>
        The position is closer to the
        liquidation boundary. Smaller adverse
        price movements may have a significant
        impact on its safety margin.
      </p>
    </div>

    <div className="docs-notice-box">
      <strong>HF Below 1.0 — Liquidation Risk</strong>
      <p>
        In a protocol using HF = 1 as its
        liquidation boundary, the position
        may become eligible for liquidation.
        Actual execution depends on the
        contract's liquidation conditions.
      </p>
    </div>

    <p>
      These ranges are educational guidelines,
      not guaranteed safety classifications.
    </p>

    <h3>What Happens When Collateral Prices Fall?</h3>

    <p>
      A decrease in collateral value can lower
      your Health Factor even when the amount
      of debt remains unchanged.
    </p>

    <div className="docs-notice-box">
      <strong>Example — Collateral Price Drop</strong>
      <p>Initial collateral value: $2,000</p>
      <p>Debt value: $1,000</p>
      <p>Illustrative liquidation threshold: 80%</p>
      <p>Initial HF: 1.60</p>
      <p>Collateral value after a 25% drop: $1,500</p>
      <p>New HF: 1.20</p>
      <p>
        Calculation: ($1,500 × 0.80) / $1,000 = 1.20
      </p>
    </div>

    <h3>What Happens When Debt Increases?</h3>

    <p>
      Borrowing additional assets generally
      increases your total debt value and
      reduces your Health Factor if collateral
      remains unchanged.
    </p>

    <div className="docs-notice-box">
      <strong>Example — Additional Borrowing</strong>
      <p>Collateral value: $2,000</p>
      <p>Illustrative liquidation threshold: 80%</p>
      <p>Initial debt: $1,000</p>
      <p>Initial HF: 1.60</p>
      <p>New total debt: $1,300</p>
      <p>New HF: approximately 1.23</p>
    </div>

    <h3>How to Improve Your Health Factor</h3>

    <ul>
      <li>
        <strong>Repay debt:</strong> Reducing
        outstanding debt can improve your HF.
      </li>
      <li>
        <strong>Add eligible collateral:</strong>
        Increasing collateral value can improve
        your position's safety margin.
      </li>
      <li>
        <strong>Avoid excessive borrowing:</strong>
        Maintain borrowing capacity for
        adverse price movements.
      </li>
      <li>
        <strong>Monitor oracle prices:</strong>
        Changes in asset valuations can affect
        your Health Factor.
      </li>
    </ul>

    <h3>Why Does the Dashboard Show Infinity?</h3>

    <p>
      When a position has no outstanding debt,
      its Health Factor may be displayed as
      infinity (∞), representing the absence
      of debt-based liquidation exposure.
    </p>

    <p>
      An infinite Health Factor does not mean
      that the underlying assets or smart
      contracts are risk-free.
    </p>

    <h3>Oracle Data and Health Factor</h3>

    <p>
      Health Factor calculations depend on
      asset valuations. If required oracle
      prices are stale or unavailable, the
      application may be unable to calculate
      a reliable Health Factor.
    </p>

    <div className="docs-notice-box">
      <strong>Important Risk Notice</strong>
      <p>
        Health Factor is a risk indicator, not
        a guarantee against liquidation.
        Always consider collateral volatility,
        available liquidity, oracle freshness
        and smart contract risks.
      </p>
    </div>
  </>
)}


{activeSection === "liquidation" && (
  <>
    <h2>Liquidation</h2>

    <p>
      Liquidation is a risk-management mechanism
      used by lending protocols when a borrowing
      position no longer has sufficient collateral
      backing under the protocol's rules.
    </p>

    <p>
      Depending on the smart contract implementation,
      an eligible liquidator may repay part of a
      borrower's outstanding debt in exchange for
      a corresponding amount of collateral.
    </p>

    <h3>What Causes Liquidation?</h3>

    <p>
      A position may become eligible for liquidation
      when its collateral value falls relative to
      its outstanding debt, or when its debt value
      increases relative to its collateral.
    </p>

    <ul>
      <li>Collateral asset prices decrease.</li>
      <li>Borrowed asset prices increase.</li>
      <li>Additional borrowing increases debt exposure.</li>
      <li>Collateral is no longer sufficient under
        the protocol's liquidation rules.</li>
    </ul>

    <h3>Liquidation Threshold</h3>

    <p>
      The liquidation threshold determines how much
      debt a position can support before becoming
      eligible for liquidation.
    </p>

    <div className="docs-notice-box">
      <strong>Illustrative Example — 80% Threshold</strong>
      <p>Collateral value: $2,000</p>
      <p>Illustrative liquidation threshold: 80%</p>
      <p>Threshold-adjusted collateral: $1,600</p>
      <p>Outstanding debt: $1,700</p>
      <p>Illustrative Health Factor: 0.94</p>
      <p>
        Calculation: ($2,000 × 0.80) / $1,700
        ≈ 0.94
      </p>
    </div>

    <p>
      Under a model where liquidation becomes
      possible below HF = 1, this position
      would be eligible for liquidation.
      Actual eligibility must be determined
      by the deployed smart contract.
    </p>

    <h3>How Does Liquidation Work?</h3>

    <ol>
      <li>
        A borrowing position reaches the
        contract's liquidation conditions.
      </li>
      <li>
        An eligible liquidator submits a
        liquidation transaction.
      </li>
      <li>
        The liquidator repays an allowed amount
        of the borrower's debt.
      </li>
      <li>
        The protocol calculates the collateral
        that may be seized.
      </li>
      <li>
        The contract updates the borrower's
        debt and collateral balances.
      </li>
    </ol>

    <h3>What is Close Factor?</h3>

    <p>
      Close Factor limits the portion of a
      borrower's debt that can be repaid
      during a liquidation transaction,
      where such a limit is implemented.
    </p>

    <div className="docs-notice-box">
      <strong>Illustrative Example — 50% Close Factor</strong>
      <p>Outstanding debt: 1,000 USDT</p>
      <p>Illustrative close factor: 50%</p>
      <p>Maximum debt repaid in one liquidation: 500 USDT</p>
      <p>
        Calculation: 1,000 × 50% = 500 USDT
      </p>
    </div>

    <h3>What is Liquidation Bonus?</h3>

    <p>
      A liquidation bonus is an incentive that
      may allow a liquidator to receive more
      collateral value than the debt value repaid.
    </p>

    <div className="docs-notice-box">
      <strong>Illustrative Example — 5% Bonus</strong>
      <p>Debt repaid by liquidator: $500</p>
      <p>Illustrative liquidation bonus: 5%</p>
      <p>Collateral value received: $525</p>
      <p>
        Calculation: $500 × 1.05 = $525
      </p>
    </div>

    <p>
      The actual collateral seized depends on
      the liquidation function, token decimals,
      oracle valuations and available collateral.
      The simplified example does not account
      for every contract-level restriction.
    </p>

    <h3>Partial vs. Full Liquidation</h3>

    <p>
      Some lending protocols limit the amount
      of debt that can be liquidated in a
      single transaction. Other protocols
      may allow different liquidation amounts
      depending on position health.
    </p>

    <p>
      Users should not assume that a liquidation
      will close their entire debt or that
      one liquidation will restore their
      position to a safe state.
    </p>

    <h3>How to Reduce Liquidation Risk</h3>

    <ul>
      <li>
        <strong>Monitor Health Factor:</strong>{" "}
        Check your position regularly.
      </li>
      <li>
        <strong>Repay outstanding debt:</strong>{" "}
        Reducing debt can improve your
        collateral coverage.
      </li>
      <li>
        <strong>Add eligible collateral:</strong>{" "}
        Increasing collateral may improve
        your safety margin.
      </li>
      <li>
        <strong>Avoid maximum borrowing:</strong>{" "}
        Maintain a buffer against price changes.
      </li>
      <li>
        <strong>Check oracle status:</strong>{" "}
        Do not rely on stale valuations.
      </li>
    </ul>

    <h3>Can Liquidation Be Reversed?</h3>

    <p>
      A successfully confirmed blockchain
      liquidation transaction generally cannot
      be reversed through the application.
      Users should monitor their positions
      before liquidation conditions are reached.
    </p>

    <div className="docs-notice-box">
      <strong>Important Risk Notice</strong>
      <p>
        Liquidation can result in the loss of
        deposited collateral. The exact
        liquidation trigger, repayment limit,
        bonus and collateral transfer rules
        are defined by the deployed contract.
        All numerical examples in this chapter
        are educational illustrations.
      </p>
    </div>
  </>
)}


{activeSection === "risk-management" && (
  <>
    <h2>Risk Management</h2>

    <p>
      Lending and borrowing involve financial,
      technical and operational risks. QMS Lending V2
      uses on-chain parameters, collateral valuation
      and transaction validation to enforce its
      lending rules.
    </p>

    <p>
      These mechanisms can help manage risk,
      but they do not eliminate the possibility
      of transaction failures, collateral loss
      or smart contract vulnerabilities.
    </p>

    <h3>1. Loan-to-Value (LTV)</h3>

    <p>
      Loan-to-Value determines how much borrowing
      capacity eligible collateral can support.
      A higher LTV allows more borrowing against
      the same collateral value but leaves
      a smaller safety margin.
    </p>

    <div className="docs-notice-box">
      <strong>Illustrative LTV Example</strong>
      <p>Eligible collateral: $1,000</p>
      <p>Assumed LTV: 70%</p>
      <p>Maximum borrow value: $700</p>
      <p>
        Calculation: $1,000 × 0.70 = $700
      </p>
    </div>

    <h3>2. Health Factor Risk</h3>

    <p>
      Health Factor measures collateral coverage
      relative to outstanding debt under the
      protocol's liquidation rules.
    </p>

    <p>
      Changes in collateral prices, borrowed asset
      prices or debt amounts can reduce the
      Health Factor of an existing position.
    </p>

    <div className="docs-notice-box">
      <strong>Important</strong>
      <p>
        A Health Factor above 1 does not guarantee
        that a position will remain safe.
        Rapid price changes may reduce the
        available safety margin.
      </p>
    </div>

    <h3>3. Oracle Price Risk</h3>

    <p>
      QMS Lending V2 relies on an on-chain price
      oracle to value collateral and debt.
      Oracle data can become outdated, unavailable
      or inconsistent with external market prices.
    </p>

    <p>
      The application may be unable to calculate
      USD-denominated values when required
      oracle prices are stale.
    </p>

    <h3>4. What Does "Stale Price" Mean?</h3>

    <p>
      A stale price is an oracle value that has
      not been updated within the freshness
      period required by the protocol.
    </p>

    <div className="docs-notice-box">
      <strong>Illustrative Freshness Example</strong>
      <p>Maximum permitted price age: 3,600 seconds</p>
      <p>Equivalent period: 60 minutes</p>
      <p>Last oracle update: 90 minutes ago</p>
      <p>Result: Price is stale</p>
    </div>

    <p>
      The actual freshness limit is determined
      by the deployed oracle contract.
    </p>

    <h3>5. Why Does the Dashboard Show "—"?</h3>

    <p>
      The dashboard reads lending positions and
      valuation data from smart contracts.
      If a required oracle price cannot be
      retrieved reliably, some USD values
      may be unavailable.
    </p>

    <p>
      In that situation, the interface may show
      a dash (—) instead of displaying an
      unsupported or potentially misleading value.
    </p>

    <div className="docs-notice-box">
      <strong>Example</strong>
      <p>Supplied balance: 10 USDT</p>
      <p>Collateral balance: 5 USDT</p>
      <p>Available Borrow: —</p>
      <p>
        Token balances can still be readable
        even when USD valuation is unavailable.
      </p>
    </div>

    <h3>6. Liquidity Risk</h3>

    <p>
      Available liquidity represents the tokens
      that the lending pool can currently
      provide for withdrawals or borrowing.
    </p>

    <p>
      Even when a user has sufficient collateral
      or a recorded supplied balance, a transaction
      may fail if the pool does not have enough
      available tokens.
    </p>

    <h3>7. Smart Contract Risk</h3>

    <p>
      Smart contracts may contain implementation
      errors, unexpected edge cases or security
      vulnerabilities. Successful deployment
      does not guarantee that a protocol is secure.
    </p>

    <ul>
      <li>Unexpected contract behavior.</li>
      <li>Incorrect token or decimal handling.</li>
      <li>Oracle integration failures.</li>
      <li>Transaction reverts and network issues.</li>
      <li>Potential vulnerabilities in dependencies.</li>
    </ul>

    <h3>8. Wallet and Transaction Risk</h3>

    <p>
      Users must review wallet requests carefully.
      Token approvals authorize smart contracts
      to transfer tokens up to the approved allowance.
    </p>

    <ul>
      <li>Verify the connected network.</li>
      <li>Review transaction amounts.</li>
      <li>Check token approval permissions.</li>
      <li>Never share private keys or recovery phrases.</li>
      <li>Use official wallet software.</li>
    </ul>

    <h3>9. Testnet Limitations</h3>

    <p>
      QMS Lending V2 is currently deployed on
      QMS Testnet. Testnet conditions may differ
      from production environments.
    </p>

    <ul>
      <li>Test tokens may have no monetary value.</li>
      <li>Oracle prices may be manually configured.</li>
      <li>Network availability may change.</li>
      <li>Contracts may be upgraded or redeployed.</li>
      <li>Testnet data may be reset.</li>
    </ul>

    <h3>10. Recommended Risk Practices</h3>

    <ol>
      <li>Understand the asset before using it.</li>
      <li>Check your wallet and network.</li>
      <li>Monitor collateral and debt positions.</li>
      <li>Maintain a borrowing safety margin.</li>
      <li>Review Health Factor regularly.</li>
      <li>Check oracle availability.</li>
      <li>Verify transaction details before signing.</li>
    </ol>

    <div className="docs-notice-box">
      <strong>Disclaimer</strong>
      <p>
        This documentation is provided for
        educational and testing purposes.
        QMS Lending V2 is an experimental
        testnet application and should not
        be treated as an audited,
        production-ready financial service.
      </p>
    </div>
  </>
)}



{activeSection === "smart-contracts" && (
  <>
    <h2>Smart Contracts</h2>

    <p>
      QMS Lending V2 operates through smart contracts
      deployed on QMS Testnet. Users can inspect
      contract addresses, transaction histories and
      available on-chain information using QMS Explorer.
    </p>

    <h3>Network Information</h3>

    <div className="docs-notice-box">
      <strong>QMS Testnet</strong>
      <p>Chain ID: 19480</p>
      <p>RPC: https://rpc.testnet.qms.finance</p>
      <p>Native token: QMS</p>
      <p>Explorer: https://testnet.qmsscan.io</p>
    </div>

    <h3>Lending Pool V2</h3>

    <p>
      The lending pool manages supplied balances,
      collateral positions, debt accounting and
      supported lending operations.
    </p>

    <div className="docs-notice-box">
      <strong>LendingPool V2 Address</strong>
      <p style={{ overflowWrap: "anywhere" }}>
        0x061755777B6Af7FDd6458340a6bB2d81848c92f8
      </p>
    </div>

    <a
      className="docs-external-link"
      href="https://testnet.qmsscan.io/address/0x061755777B6Af7FDd6458340a6bB2d81848c92f8"
      target="_blank"
      rel="noopener noreferrer"
    >
      View LendingPool on Explorer
      <ExternalLink size={15} />
    </a>

    <h3>Price Oracle V2</h3>

    <p>
      The oracle provides token prices used by
      the lending pool for collateral valuation,
      borrowing capacity and risk calculations.
    </p>

    <div className="docs-notice-box">
      <strong>Oracle V2 Address</strong>
      <p style={{ overflowWrap: "anywhere" }}>
        0xBF6BE5722e243f55185135F51192F44Ac39Eb3f2
      </p>
    </div>

    <a
      className="docs-external-link"
      href="https://testnet.qmsscan.io/address/0xBF6BE5722e243f55185135F51192F44Ac39Eb3f2"
      target="_blank"
      rel="noopener noreferrer"
    >
      View Oracle on Explorer
      <ExternalLink size={15} />
    </a>

    <h3>Supported Test Tokens</h3>

    <p>
      The following ERC-20 token addresses are
      configured in the QMS Lending V2 frontend.
      Actual lending permissions depend on
      each asset's on-chain configuration.
    </p>

    <ul>
      <li>
        <strong>USDT:</strong>{" "}
        <code>0x5D1386fC130143F92511bC2D18124D3E414ed429</code>
      </li>
      <li>
        <strong>USDC:</strong>{" "}
        <code>0xDd4D61DF875cc613E1372c78827a5F4C2741bf11</code>
      </li>
      <li>
        <strong>WQMS:</strong>{" "}
        <code>0x9AA510295aC664A3d5A3182a3eFe959DE2B12c34</code>
      </li>
      <li>
        <strong>WBTC:</strong>{" "}
        <code>0x5eBfE302200a5b22E182a5C0D10444Fe44b2A678</code>
      </li>
      <li>
        <strong>WETH:</strong>{" "}
        <code>0x43D7c8434A5290a32C8725224870ad6f85132a31</code>
      </li>
    </ul>

    <h3>Core Lending Functions</h3>

    <p>
      The frontend interacts with the lending
      pool through the following operations:
    </p>

    <ul>
      <li><code>supply()</code> — Supply tokens.</li>
      <li><code>withdraw()</code> — Withdraw supplied tokens.</li>
      <li><code>depositCollateral()</code> — Deposit collateral.</li>
      <li><code>withdrawCollateral()</code> — Withdraw collateral.</li>
      <li><code>borrow()</code> — Borrow supported tokens.</li>
      <li><code>repay()</code> — Repay outstanding debt.</li>
    </ul>

    <h3>Read-Only Functions</h3>

    <p>
      The application also reads on-chain
      positions and risk-related values,
      including:
    </p>

    <ul>
      <li><code>getSupportedAssets()</code></li>
      <li><code>getTotalCollateralValue()</code></li>
      <li><code>getTotalDebtValue()</code></li>
      <li><code>getAvailableBorrowValue()</code></li>
      <li><code>getHealthFactor()</code></li>
      <li><code>getAvailableLiquidity()</code></li>
    </ul>

    <h3>Verify Transactions</h3>

    <ol>
      <li>Open QMS Explorer.</li>
      <li>Paste your transaction hash into the search bar.</li>
      <li>Check the transaction status.</li>
      <li>Verify the contract address and token transfers.</li>
      <li>Review the transaction details and events.</li>
    </ol>

    <div className="docs-notice-box">
      <strong>Security Notice</strong>
      <p>
        Contract addresses identify deployed
        contracts but do not establish that
        the contracts have been independently
        audited. Always verify the network
        and destination address before
        signing transactions.
      </p>
    </div>
  </>
)}

{activeSection === "faq" && (
  <>
    <h2>Frequently Asked Questions</h2>

    <p>
      Find answers to common questions about
      QMS Lending V2, wallet connections,
      supported assets, lending operations
      and risk management.
    </p>

    <h3>1. What is QMS Lending V2?</h3>
    <p>
      QMS Lending V2 is an experimental
      decentralized lending and borrowing
      application deployed on QMS Testnet.
      It allows users to supply supported
      ERC-20 test tokens, deposit collateral,
      borrow assets, repay debt and monitor
      their lending positions.
    </p>

    <h3>2. Is QMS Lending V2 on Mainnet?</h3>
    <p>
      No. The current deployment operates
      on QMS Testnet (Chain ID 19480).
      Testnet tokens should not be treated
      as assets with guaranteed monetary value.
    </p>

    <h3>3. Which Wallets Are Supported?</h3>
    <p>
      The current frontend supports connecting
      through the OKX Wallet browser extension.
      Additional wallet integrations may be
      considered in future versions.
    </p>

    <h3>4. How Do I Connect My Wallet?</h3>
    <p>
      Install OKX Wallet, open QMS Lending V2,
      click Connect Wallet and approve the
      connection request. Make sure your
      wallet is connected to QMS Testnet.
    </p>

    <h3>5. Which Assets Are Supported?</h3>
    <p>
      The current frontend is configured for
      USDT, USDC, WQMS, WBTC and WETH test tokens.
      The availability of individual lending
      actions depends on on-chain asset settings.
    </p>

    <h3>6. What Is the Difference Between
      Supply and Deposit Collateral?</h3>
    <p>
      Supply adds tokens to the lending pool,
      while Deposit Collateral records eligible
      assets as backing for a borrowing position.
      These are separate operations in
      QMS Lending V2.
    </p>

    <h3>7. Does Supplying Assets Generate Interest?</h3>
    <p>
      Do not assume that supplied balances
      generate interest or rewards.
      The current documentation does not
      establish an implemented interest-accrual
      mechanism for this testnet deployment.
    </p>

    <h3>8. Why Do I Need to Approve Tokens?</h3>
    <p>
      ERC-20 approvals allow the lending pool
      contract to transfer tokens from your
      wallet up to the approved allowance.
      Approval and the lending operation
      are separate transactions.
    </p>

    <h3>9. Why Can't I Borrow Tokens?</h3>
    <p>
      Borrowing may fail if you have insufficient
      eligible collateral, exceed your borrowing
      limit, request more tokens than the pool
      has available, or if required oracle
      prices are stale or unavailable.
    </p>

    <h3>10. What Is Health Factor?</h3>
    <p>
      Health Factor is a risk indicator that
      compares liquidation-adjusted collateral
      value with outstanding debt.
      A lower Health Factor generally indicates
      greater liquidation risk.
    </p>

    <h3>11. Why Does My Health Factor Show Infinity?</h3>
    <p>
      When your position has no outstanding
      debt, the dashboard may display
      infinity (∞). This represents the
      absence of debt-based liquidation
      exposure, not an absence of all risks.
    </p>

    <h3>12. Why Does Available Borrow Show "—"?</h3>
    <p>
      Some USD-denominated values depend on
      oracle prices. If required price data
      is stale or unavailable, the frontend
      may display a dash instead of an
      unreliable borrowing value.
    </p>

    <h3>13. Can I Repay Only Part of My Debt?</h3>
    <p>
      Yes. QMS Lending V2 supports partial
      repayment, subject to the contract's
      validation rules. You can repay
      additional amounts later to reduce
      or clear the remaining debt.
    </p>

    <h3>14. Can My Collateral Be Liquidated?</h3>
    <p>
      A borrowing position may become
      eligible for liquidation when its
      collateral is insufficient under
      the contract's liquidation rules.
      Review the Liquidation and Health
      Factor sections for more information.
    </p>

    <h3>15. Where Can I Verify My Transactions?</h3>
    <p>
      You can inspect transaction hashes,
      contract addresses and available
      on-chain records using QMS Explorer.
    </p>

    <a
      className="docs-external-link"
      href="https://testnet.qmsscan.io/"
      target="_blank"
      rel="noopener noreferrer"
    >
      Open QMS Explorer
      <ExternalLink size={15} />
    </a>

    <div className="docs-notice-box">
      <strong>Still Have Questions?</strong>
      <p>
        Review the relevant documentation
        sections and verify your network,
        wallet balance, token allowances
        and transaction status before
        retrying an unsuccessful action.
      </p>
    </div>
  </>
)}


{activeSection !== "introduction" &&
  activeSection !== "getting-started" &&
  activeSection !== "supply-withdraw" &&
  activeSection !== "collateral" &&
  activeSection !== "borrow-repay" &&
  activeSection !== "health-factor" &&
  activeSection !== "liquidation" &&
  activeSection !== "risk-management" &&
  activeSection !== "smart-contracts" &&
  activeSection !== "faq" && (
    <>
      <h2>{currentSection?.title}</h2>
      <p>
        Detailed guidance for this section
        will be added in the next step.
      </p>
    </>
)}

        </article>
      </div>
    </div>
  );
}
