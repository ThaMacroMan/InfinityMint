import React from 'react';
import { useWallet } from '@meshsdk/react';
import { AssetName } from '../styles/types/types';
import { useTokenCheck } from '../hooks/TokenCheck';

const MIN_ASSET_VALUES: Record<AssetName, number> = {
  "OG NFT": 1,
  "CatNip NFT": 5,
  "$Catsky": 1000000000,
};

const WalletBalance: React.FC = () => {
  const { connected } = useWallet();
  const { hasMinRequiredTokens, catskyAssetSummary, POLICY_ID_NAMES } = useTokenCheck();

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
  if (percent < 50) return 'bg-gray-600';
  if (percent < 100) return 'bg-gray-700';
  return 'bg-gray-800';
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
  <div className="">
    <div className="p-4 bg-gray-8900 text-gray-200">
      <h1 className="text-xl font-bold mb-4">
        Catsky AI Alpha Access
        <span className={`pill ${hasMinRequiredTokens ? 'pill-enabled' : 'pill-disabled'}`}>
          {hasMinRequiredTokens ? 'Enabled' : 'Disabled'}
        </span>
      </h1>

      <div className="flex flex-wrap -mx-2 my-4">
      {Object.entries(catskyAssetSummary).map(([friendlyName, quantity]) => {
          //const minValue = MIN_ASSET_VALUES[friendlyName as AssetName]; // Cast to AssetName type if necessary
          //const percent = percentage(quantity, minValue);

          //console.log('what is the policyId', policyId);

          //const friendlyName = POLICY_ID_NAMES[policyId]; // Get the friendly name using policyId
          if (!friendlyName) {
            return null; // Skip rendering this entry if the friendly name is not found
          }

          const minValue = MIN_ASSET_VALUES[friendlyName as AssetName]; // Use the friendly name to get the min value
          if (minValue === undefined) {
            return null; // Skip rendering this entry if the min value is not found
          }

          const percent = percentage(quantity, minValue);


          return (
            <div key={friendlyName} className="w-full mb-2 px-2 relative">
              <div className="border relative py-1 px-2 bg-gray-200">
                <div className="relative z-10">
                  <span className={`font-medium text-sm ${percent < 100 ? 'text-red-600' : 'text-green-500'}`}>
                    {friendlyName}
                  </span> - <span className={`font-light ${percent < 100 ? 'text-red-600' : 'text-green-500'}`}>
                    {(quantity || 0).toLocaleString()}
                  </span>
                </div>
                <div
                  style={{ width: `${percent}%` }}
                  className={`absolute inset-y-0 left-0 ${bgColorForPercentage(percent)} bar-graph-animation`}
                ></div>
              </div>
              <p className="mt-2 text-sm">You're holding {(quantity || 0).toLocaleString()} of the <span className="font-600">required {minValue.toLocaleString()} {friendlyName}</span> to access Catsky AI Alpha.</p>
            </div>
          );
        })}
      </div>

      {hasMinRequiredTokens ? (
        <p className="text-sm my-4">
          <span className="bg-green-400 text-black p-1">Meow!</span> You&apos;re holding sufficient $Catsky assets! Enough to grant you <span className="font-bold">Catsky AI Alpha</span> access.
        </p>
      ) : (
        <div className="text-sm my-4 animate-fadeIn">
          <p className="font-semibold"><span className="bg-red-600 text-white p-1">Meow!</span> You need to be holding more Catsky assets for Alpha access, reaching the required amount for 2 of the 3 Catsky asset categories:</p>
          <ul className="list-decimal pl-6 text-sm">
            {Object.entries(assetDifferences).map(([assetName, difference]) => (
              <li key={assetName} className="pt-1 pl-1">
                {assetName}: {difference.toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </div>
);
};

export default WalletBalance;