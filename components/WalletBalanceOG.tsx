import React, { useEffect } from 'react';
import { useWallet } from '@meshsdk/react';
import { AssetName } from '../pages/styles/types/types';
import { useTokenCheck } from '../hooks/TokenCheck';



const WalletBalance: React.FC = () => {
  const { connected, wallet } = useWallet();
  const { hasMinRequiredTokens, catskyAssetSummary, POLICY_ID_NAMES } = useTokenCheck();


  const MIN_ASSET_VALUES: Record<AssetName, number> = {
    "OG NFT": 1,
    "CatNip NFT": 1,
    "$CATSKY": 1000000000,
  };

  if (!connected) {
    return null; // Don't render anything if the wallet is not connected
  }

  // Helper functions to calculate percentage and background color
  const percentage = (value: number, max: number) => {
    let percent = (value / max) * 100;
    percent = percent <= 2 ? 2 : percent; // Ensure a minimum percentage for visibility
    return Math.min(percent, 100); // Ensures it doesn't exceed 100%
  };

  const bgColorForPercentage = (percent: number) => {
    if (percent < 5) return 'bg-red-600';
    if (percent < 50) return 'bg-red-600';
    if (percent < 100) return 'bg-green-700';
    return 'bg-green-800';
  };

  // Calculate the differences for assets that are below the minimum required values
  const assetDifferences = Object.entries(MIN_ASSET_VALUES).reduce((acc, [assetName, minValue]) => {
    const currentQuantity = catskyAssetSummary[assetName] || 0;
    if (currentQuantity < minValue) {
      acc[assetName] = minValue - currentQuantity;
    }
    return acc;
  }, {});


  return (
    <div className="bar-container">
      <h1 className="text-bar">
        Catsky AI Access 
        <span className={`pill ${hasMinRequiredTokens ? 'pill-enabled' : 'pill-disabled'}`}>
          {hasMinRequiredTokens ? ' Enabled' : ' Disabled'}
        </span>
      </h1>

      <div className="flex-wrap">
        {Object.entries(catskyAssetSummary).map(([friendlyName, quantity]) => {
          if (!friendlyName) {
            return null; // Skip rendering this entry if the friendly name is not found
          }
          const minValue = MIN_ASSET_VALUES[friendlyName as AssetName]; // Use the friendly name to get the min value
          if (minValue === undefined) {
            return null; // Skip rendering this entry if the min value is not found
          }
          const percent = percentage(quantity, minValue);

          return (
            <div key={friendlyName} className="relative">
              <div className="border relative bg-gray-200">
                <div className="relative ">
                  <span className={`text-bar ${percent < 100 ? 'text-red-600' : 'text-green-500'}`}>
                    {friendlyName}
                  </span> - <span className={`text-bar ${percent < 100 ? 'text-red-600' : 'text-green-500'}`}>
                    {(quantity || 0).toLocaleString()}
                  </span>
                </div>
                <div
                  style={{ width: `${percent}%` }}
                  className={`absolute inset-y-0 left-0 ${bgColorForPercentage(percent)} bar-graph-animation`}
                ></div>
              </div>
              <p className="text-sm ">{(quantity || 0).toLocaleString()} / <span className="font-600"> {minValue.toLocaleString()} {friendlyName}</span></p>
            </div>
          );
        })}
      </div>

      {hasMinRequiredTokens ? (
        <p className="text-bar my-4">
          <span className="bg-green-400 text-black p-1">Meow!</span> You hold enough $Catsky assets! <span />
        </p>
      ) : (
        <div className="text-bar my-1 animate-fadeIn">
          <p className="font-semibold">
            <span className="bg-red-600 text-white p-1">Meow!</span> You need more Catsky assets for premium features:
          </p>
          <ul className=" text-bar pl-5 ml-0">
            {Object.entries(assetDifferences).map(([assetName, difference]) => (
              <li key={assetName} className="my-4">
                {assetName}: {difference.toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WalletBalance;
