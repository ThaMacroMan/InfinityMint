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

  return (
          <div className="tag2">
              <span className="pixelfont " id ="gradient-text" >Catsky Balance: </span>
              <span className="pixelfont text-white">{(catskyBalance || 0).toLocaleString()}</span>
          </div>
  );
};

export default WalletBalance;
