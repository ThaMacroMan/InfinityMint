// useTokenCheck.ts
import { useState, useEffect } from 'react';
import { useWallet } from '@meshsdk/react';

const POLICY_ID_NAMES: { [key: string]: string } = {
  "c859e9d7e71b8f90bdc1e453fd1b9adbc5e6163898fb574543cb5be8": "Terraforms",
  "9a4579e93ba889999f91db52f8b2268541fea47b8b16d961e0f77e6d": "StarShips",
  "6787a47e9f73efe4002d763337140da27afa8eb9a39413d2c39d4286": "$RAD",
  "3530c5d7ce77ea067c20bbca7688e18731c8f0c7de456a940eefa27c": "Citizens"
};

export const useTokenCheck = () => {
  const { connected, wallet } = useWallet();
  const [hasMinRequiredTokens, setHasMinRequiredTokens] = useState(false);
  const [catskyAssetSummary, setCatskyAssetSummary] = useState<Record<string, number>>({});

  useEffect(() => {
    if (connected && wallet) {
      (async function fetchBalanceAndCheckAssets() {
        try {
          const fetchedBalance = await wallet.getBalance();
          if (!fetchedBalance) {
            console.error("No balance data received.");
            return;
          }

          const relevantAssets = fetchedBalance.filter(asset =>
            Object.keys(POLICY_ID_NAMES).some(policyId => asset.unit.startsWith(policyId))
          );

          const assetSums = Object.keys(POLICY_ID_NAMES).reduce((acc, policyId) => {
            const totalQuantityForPolicy = relevantAssets
              .filter(asset => asset.unit.startsWith(policyId))
              .reduce((sum, asset) => sum + Number(asset.quantity), 0);
            const friendlyName = POLICY_ID_NAMES[policyId]; // Get the friendly name
            acc[friendlyName] = totalQuantityForPolicy; // Use friendly name as the key
            return acc;
          }, {} as Record<string, number>);

          // Call the checkTokens function with the asset sums
          // checkTokens(assetSums); // This line should be removed if checkTokens is not used elsewhere

          // Instead of calling checkTokens, directly set the states here
          const policiesMet = Object.values(assetSums).filter(quantity => {
            if (quantity >= 1000000000) return true; // Criteria for Catsky
            if (quantity >= 1) return true; // Criteria for OG NFT
            if (quantity >= 4) return true; // Criteria for CatNips NFT
            return false;
          }).length;

          setHasMinRequiredTokens(policiesMet >= 2); // Require two or more policies to be met

          setCatskyAssetSummary(assetSums); // Update the summary based on the fetched assets

        } catch (error: any) {
          console.error("Detailed error:", error);
        }
      })();
    }
  }, [connected, wallet]);

  return { hasMinRequiredTokens, catskyAssetSummary, POLICY_ID_NAMES };
}
