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
const catskyBalance = catskyAssetSummary["$CATSKY"] || 0;
const catnipBalance = catskyAssetSummary["CatNip NFT"] || 0;
const ognftBalance = catskyAssetSummary["OG NFT"] || 0;
const inifinitymintsBalance = catskyAssetSummary["Era I"] || 0;

return (
  <div className="tag">
    <div className="asset-container">
      <div>
        <span id="gradient-text">$CATSKY</span>
      </div>
      <div className="asset-value">
        <span className="pixelfont3 text-white">{Math.floor((catskyBalance || 0) / 1000000).toLocaleString()}M</span>
      </div>
    </div>
    <div className="asset-container">
      <div>
        <span id="gradient-text">CatNip</span>
      </div>
      <div className="asset-value">
        <span className="pixelfont3 text-white">{(catnipBalance || 0).toLocaleString()}</span>
      </div>
    </div>
    <div className="asset-container">
      <div>
        <span id="gradient-text">OG-NFT</span>
      </div>
      <div className="asset-value">
        <span className="pixelfont3 text-white">{(ognftBalance || 0).toLocaleString()}</span>
      </div>
    </div>
    <div className="asset-container">
      <div>
        <span id="gradient-text">Era I</span>
      </div>
      <div className="asset-value">
        <span className="pixelfont3 text-white">{(inifinitymintsBalance || 0).toLocaleString()}</span>
      </div>
    </div>
  </div>
);

}

export default WalletBalance;
