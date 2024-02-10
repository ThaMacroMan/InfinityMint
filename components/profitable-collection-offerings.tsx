// pages/bots/find-undervalued-nfts.tsx
import Head from "next/head";
import WalletBalance from './WalletBalance';
import Navigation from './Navigation';
import Analyze from "./Analyze";
import BackendPreConnect from "./BackendPreConnect";
import DataBasePreConnect from "./DataBasePreConnect";
import { useWallet } from "@meshsdk/react";
import AnalyzeCollectionOfferingsV1 from "./AnalyzeCollectionOfferingsV1";

export default function FindCswapArbitrageOpportunitiesV1() {
  const { connected } = useWallet();

  return (
    <div className="siteWrapper bg-pattern-primary flex flex-col min-h-screen">
      <Head>
        <title>Catsky AI - CSWAP Arbitrage</title>
        <meta name="description" content="A Cardano dApp powered by Cats & Lovelaces" />
      </Head>

      <Navigation />

      <main className="main flex-grow">
        <div className="flex flex-col justify-center items-center h-full flex-grow">
          <div className="container flex-grow">
            <div className="flex flex-wrap bg-gray-800 justify-start items-start h-full">

              <div className="w-full md:w-1/3">
                  <WalletBalance />
                </div>

              {!connected ? (
                <div className="w-full md:w-2/3">
                  <div className="bg-gray-800 text-white p-2 md:p-4">
                    <p className="text-lg font-semibold">Please connect your Cardano wallet.</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-full md:w-2/3">
                    <AnalyzeCollectionOfferingsV1 />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="flex flex-row bg-gray-900 text-gray-400 justify-center items-center h-full flex-grow text-sm p-1">
          <BackendPreConnect />
          <DataBasePreConnect />
        </div>
      </footer>
    </div>
  );
}
