import React from 'react';
import { useWallet } from '@meshsdk/react';
import { useTokenCheck } from '../hooks/TokenCheck';

const WalletBalance: React.FC = () => {
  const { connected } = useWallet();
  const { catskyAssetSummary } = useTokenCheck();

  if (!connected) {
    return null; // Don't render anything if the wallet is not connected
  }
// Filter out NFT assets
const catskyBalance = catskyAssetSummary["$RAD"] || 0;
const catnipBalance = catskyAssetSummary["Terraforms"] || 0;
const ognftBalance = catskyAssetSummary["StarShips"] || 0;
const inifinitymintsBalance = catskyAssetSummary["Citizens"] || 0;

return (
  <div className="tag">
    <div className="asset-container">
      <div>
        <span id="gradient-text">$RAD</span>
      </div>
      <div className="asset-value">
        <span className="pixelfont3 text-white">{Math.floor((catskyBalance || 0) / 1000).toLocaleString() } K</span>
      </div>
    </div>
    <div className="asset-container">
      <div>
        <span id="gradient-text">Terraforms</span>
      </div>
      <div className="asset-value">
        <span className="pixelfont3 text-white">{(catnipBalance || 0).toLocaleString()}</span>
      </div>
    </div>
    <div className="asset-container">
      <div>
        <span id="gradient-text">StarShips</span>
      </div>
      <div className="asset-value">
        <span className="pixelfont3 text-white">{(ognftBalance || 0).toLocaleString()}</span>
      </div>
    </div>
    <div className="asset-container">
      <div>
        <span id="gradient-text">Citizens</span>
      </div>
      <div className="asset-value">
        <span className="pixelfont3 text-white">{(inifinitymintsBalance || 0).toLocaleString()}</span>
      </div>
    </div>
  </div>
);

}

export default WalletBalance;
