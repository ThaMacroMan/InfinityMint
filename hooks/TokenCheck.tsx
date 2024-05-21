import { useState, useEffect } from 'react';
import { useWallet } from '@meshsdk/react';

const POLICY_ID_NAMES: { [key: string]: string } = {
  "9b426921a21f54600711da0be1a12b026703a9bd8eb9848d08c9d921": "$CATSKY",
  "b77791d20054db4fa9726a58854b8c02550277c8683286ec5a353b89": "CatNips",
  "6f5d880ec1746a32afc1f4fb53ad7ec1e214f49f53f1175c424b1200": "OG NFTs",
  "333710c6c50bbee8197888e2e9ea26ad7bcc308e34706723a32082f5": "Era 1"
};

export const useTokenCheck = () => {
  const { connected, wallet } = useWallet();
  const [hasMinRequiredTokens, setHasMinRequiredTokens] = useState(false);
  const [projectAssetSummary, setprojectAssetSummary] = useState<Record<string, number>>({});

  const fetchBalanceAndCheckAssets = async () => {
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

      const policiesMet = Object.values(assetSums).filter(quantity => {
        if (quantity >= 1000000000) return true; // Criteria for Catsky
        if (quantity >= 1) return true; // Criteria for OG NFT
        if (quantity >= 4) return true; // Criteria for CatNips NFT
        return false;
      }).length;

      setHasMinRequiredTokens(policiesMet >= 2); // Require two or more policies to be met
      setprojectAssetSummary(assetSums); // Update the summary based on the fetched assets
    } catch (error: any) {
      console.error("Detailed error:", error);
    }
  };

  useEffect(() => {
    if (connected && wallet) {
      fetchBalanceAndCheckAssets();
    }
  }, [connected, wallet]);

  return { hasMinRequiredTokens, projectAssetSummary, fetchBalanceAndCheckAssets, POLICY_ID_NAMES };
};
