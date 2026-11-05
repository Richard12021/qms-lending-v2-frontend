
export const QMS_LENDING_POOL_ABI = [
  "function getSupportedAssets() view returns (address[])",
  "function totalSupplied(address token) view returns (uint256)",
  "function totalBorrowed(address token) view returns (uint256)",
  "function assetConfigs(address token) view returns (bool supported, bool canBorrow, bool canCollateralize, uint8 decimals, uint256 ltvBps, uint256 liquidationThresholdBps, uint256 liquidationBonusBps)",

  "function suppliedBalances(address user, address token) view returns (uint256)",
  "function collateralBalances(address user, address token) view returns (uint256)",
  "function debtBalances(address user, address token) view returns (uint256)",

  "function getTotalCollateralValue(address user) view returns (uint256)",
  "function getMaxBorrowValue(address user) view returns (uint256)",
  "function getTotalDebtValue(address user) view returns (uint256)",
  "function getAvailableBorrowValue(address user) view returns (uint256)",
  "function getHealthFactor(address user) view returns (uint256)",
  "function getAvailableLiquidity(address token) view returns (uint256)",
  "function getAssetValue(address token, uint256 amount) view returns (uint256)",

  "function supply(address token, uint256 amount)",
  "function withdraw(address token, uint256 amount)",
  "function depositCollateral(address token, uint256 amount)",
  "function withdrawCollateral(address token, uint256 amount)",
  "function borrow(address token, uint256 amount)",
  "function repay(address token, uint256 amount)",
] as const;
