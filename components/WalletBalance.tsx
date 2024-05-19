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
        tokenBalance: projectAssetSummary["$RAD"] || 0,
        nft1Balance: projectAssetSummary["Terraforms"] || 0,
        nft2Balance: projectAssetSummary["StarShips"] || 0,
        nft3balance: projectAssetSummary["Citizens"] || 0,
      });
    }
  }, [connected, projectAssetSummary]);

  if (!connected) {
    return null; // Don't render anything if the wallet is not connected
  }

  return (
    <div className="tag grid-container">
      <div className="asset-container">
        <div>
          <span id="gradient-text">$RAD</span>
        </div>
        <div className="asset-value">
          <span className="pixelfont3 text-white">
            {Math.floor((balances.tokenBalance || 0) / 1000).toLocaleString()} K
          </span>
        </div>
      </div>
      <div className="asset-container">
        <div>
          <span id="gradient-text">Terraforms</span>
        </div>
        <div className="asset-value">
          <span className="pixelfont3 text-white">
            {(balances.nft1Balance || 0).toLocaleString()}
          </span>
        </div>
      </div>
      <div className="asset-container">
        <div>
          <span id="gradient-text">StarShips</span>
        </div>
        <div className="asset-value">
          <span className="pixelfont3 text-white">
            {(balances.nft2Balance || 0).toLocaleString()}
          </span>
        </div>
      </div>
      <div className="asset-container">
        <div>
          <span id="gradient-text">Citizens</span>
        </div>
        <div className="asset-value">
          <span className="pixelfont3 text-white">
            {(balances.nft3balance || 0).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
  
  
};

export default WalletBalance;
