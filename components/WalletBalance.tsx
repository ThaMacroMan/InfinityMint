import React, { useEffect, useState } from 'react';
import { useWallet } from '@meshsdk/react';
import { useTokenCheck } from '../hooks/TokenCheck';

const WalletBalance: React.FC = () => {
  const { connected } = useWallet();
  const { projectAssetSummary } = useTokenCheck();
  const [balances, setBalances] = useState({
    tokenBalance: 0,
    nft1Balance: 0,
    nft2Balance: 0,
    nft3balance: 0,
  });

  useEffect(() => {
    if (connected && projectAssetSummary) {
      setBalances({
        tokenBalance: projectAssetSummary["$CATSKY"] || 0,
        nft1Balance: projectAssetSummary["CatNips"] || 0,
        nft2Balance: projectAssetSummary["OG NFTs"] || 0,
        nft3balance: projectAssetSummary["Era I"] || 0,
      });
    }
  }, [connected, projectAssetSummary]);

  if (!connected) {
    return null; // Don't render anything if the wallet is not connected
  }

  return (
    <div className="tag grid-container">
      <a href="https://www.taptools.io/charts/token/0be55d262b29f564998ff81efe21bdc0022621c12f15af08d0f2ddb1.76ab3fb1e92b7a58ee94b712d1c1bff0e24146e8e508aa0008443e1db1f2244e" className="asset-link" target="_blank" rel="noopener noreferrer">
        <div className="asset-container">
          <div>
            <span id="gradient-text">$CATSKY</span>
          </div>
          <div className="asset-value">
          <span style={{ color: 'green' }}>
            {Math.floor((balances.tokenBalance || 0) / 1000000).toLocaleString()} M
          </span>
          </div>
        </div>
      </a>
      <a href="https://www.jpg.store/collection/catnips" className="asset-link" target="_blank" rel="noopener noreferrer">
        <div className="asset-container">
          <div>
            <span id="gradient-text">CatNips</span>
          </div>
          <div className="asset-value">
            <span>
              {(balances.nft1Balance || 0).toLocaleString()}  <span id="gradient-text2">/ 3</span>
            </span>
          </div>
        </div>
      </a>
      <a href="https://www.jpg.store/collection/ogcatsky" className="asset-link" target="_blank" rel="noopener noreferrer">
        <div className="asset-container">
          <div>
            <span id="gradient-text">OG NFTs</span>
          </div>
          <div className="asset-value">
            <span>
              {(balances.nft2Balance || 0).toLocaleString()}  <span id="gradient-text2">/ 1</span>
            </span>
          </div>
        </div>
      </a>
      <a href="https://www.jpg.store/collection/infinitymintwildcatgenesisera" className="asset-link" target="_blank" rel="noopener noreferrer">
        <div className="asset-container">
          <div>
            <span id="gradient-text">Era 1</span>
          </div>
          <div className="asset-value">
            <span >
              {(balances.nft3balance || 0).toLocaleString()} <span id="gradient-text2">/ 10</span>
            </span>
          </div>
        </div>
      </a>
    </div>
  );
};

export default WalletBalance;
