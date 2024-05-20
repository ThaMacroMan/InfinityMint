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
      <a href="https://www.taptools.io/charts/token/0be55d262b29f564998ff81efe21bdc0022621c12f15af08d0f2ddb1.f73964cf9bfdc80b6b1b5a313100dede92dabe681e5fa072debb8a53f798e474" className="asset-link" target="_blank" rel="noopener noreferrer">
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
      </a>
      <a href="https://www.jpg.store/collection/cardaniaterraforms?tab=items" className="asset-link" target="_blank" rel="noopener noreferrer">
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
      </a>
      <a href="https://www.jpg.store/collection/starships?tab=items" className="asset-link" target="_blank" rel="noopener noreferrer">
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
      </a>
      <a href="https://www.jpg.store/collection/citizens?tab=items" className="asset-link" target="_blank" rel="noopener noreferrer">
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
      </a>
    </div>
  );
};

export default WalletBalance;
