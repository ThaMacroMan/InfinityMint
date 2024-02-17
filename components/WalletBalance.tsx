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
    <div className="bar-container">


      <div className="flex-wrap">
        <div className="relative">
          <div className="border relative bg-gray-200">
            <div className="relative">
              <span className="text-bar">Catsky Balance:</span>
              <span className="text-bar">{(catskyBalance || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletBalance;
