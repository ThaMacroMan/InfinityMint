// Using types:
// useTokenCheck.ts
import { useState, useEffect } from 'react';
import { useWallet } from '@meshsdk/react'
export type AssetNameType = "$Catsky" | "OG NFT" | "CatNip NFT";

// Using enums:
export enum AssetName {
  Catsky = "$Catsky Tokens",
  OGNFT = "OG NFTs",
  CatNipNFT = "CatNip NFTs"
}
