export const QMS_LENDING_POOL_ADDRESS: string =
  "0x061755777B6Af7FDd6458340a6bB2d81848c92f8";


export const QMS_LENDING_POOL_CHAIN_ID = 19480;

export const isLendingPoolDeployed = () => {
  return /^0x[a-fA-F0-9]{40}$/.test(
    QMS_LENDING_POOL_ADDRESS
  );
};
