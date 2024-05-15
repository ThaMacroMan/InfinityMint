import React, { useEffect, useState } from 'react';
import { useWallet } from '@meshsdk/react';
import { useTokenCheck } from '../hooks/TokenCheck';

const WalletBalance: React.FC = () => {
  const { connected } = useWallet();
  const { catskyAssetSummary } = useTokenCheck();
  const [balances, setBalances] = useState({
    catskyBalance: 0,
    catnipBalance: 0,
    ognftBalance: 0,
    inifinitymintsBalance: 0,
  });

  useEffect(() => {
    if (connected && catskyAssetSummary) {
      setBalances({
        catskyBalance: catskyAssetSummary["$RAD"] || 0,
        catnipBalance: catskyAssetSummary["Terraforms"] || 0,
        ognftBalance: catskyAssetSummary["StarShips"] || 0,
        inifinitymintsBalance: catskyAssetSummary["Citizens"] || 0,
      });
    }
  }, [connected, catskyAssetSummary]);

  if (!connected) {
    return null; // Don't render anything if the wallet is not connected
  }

  return (
    <div className="tag">
      <div className="asset-container">
        <div>
          <span id="gradient-text">$RAD</span>
        </div>
        <div className="asset-value">
          <span className="pixelfont3 text-white">
            {Math.floor((balances.catskyBalance || 0) / 1000).toLocaleString()} K
          </span>
        </div>
      </div>
      <div className="asset-container">
        <div>
          <span id="gradient-text">Terraforms</span>
        </div>
        <div className="asset-value">
          <span className="pixelfont3 text-white">
            {(balances.catnipBalance || 0).toLocaleString()}
          </span>
        </div>
      </div>
      <div className="asset-container">
        <div>
          <span id="gradient-text">StarShips</span>
        </div>
        <div className="asset-value">
          <span className="pixelfont3 text-white">
            {(balances.ognftBalance || 0).toLocaleString()}
          </span>
        </div>
      </div>
      <div className="asset-container">
        <div>
          <span id="gradient-text">Citizens</span>
        </div>
        <div className="asset-value">
          <span className="pixelfont3 text-white">
            {(balances.inifinitymintsBalance || 0).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WalletBalance;
