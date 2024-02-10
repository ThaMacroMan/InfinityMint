import React, { useState } from 'react';
import { CardanoWallet } from "@meshsdk/react";
import Image from 'next/image';
import Link from 'next/link';

const Navigation: React.FC = () => {
  const [isAssetsNavOpen, setisAssetsNavOpen] = useState(false);
  const [isBotNavOpen, setIsBotNavOpen] = useState(false);
  const [isImageGenNavOpen, setIsImageGenNavOpen] = useState(false);

  const toggleBotNav = () => {
    setIsBotNavOpen(!isBotNavOpen);
    setisAssetsNavOpen(false);
    setIsImageGenNavOpen(false);
  };

  const toggleAssetsNav = () => {
    setisAssetsNavOpen(!isAssetsNavOpen);
    setIsBotNavOpen(false);
    setIsImageGenNavOpen(false);
  };

  const toggleImageGenNav = () => {
    setIsImageGenNavOpen(!isImageGenNavOpen);
    setisAssetsNavOpen(false);
    setIsBotNavOpen(false);
  };

  return (
    <nav className="primary-nav p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Link href="/" legacyBehavior>
            <a className="text-white font-bold text-xl">
              <Image src="/images/logo-dark-mode.png" alt="Catsky.Catbot Logo" width={150} height={50} />
            </a>
          </Link>

          {/* Dropdown for Bots */}
          <div className="relative">
            <button onClick={toggleBotNav} className="text-white font-semibold py-2 px-4 rounded hover:bg-gray-700 transition duration-150">
              Catsky AI Bots
            </button>
            {isBotNavOpen && (
              <div className="absolute left-0 mt-2 py-2 w-64 bg-white rounded-md shadow-lg z-100">
                <ul className="text-gray-700">
                  <li className="px-4 py-2 hover:bg-gray-100 transition duration-150">
                    <Link href="/bots/find-undervalued-nfts" legacyBehavior>
                      <a className="block">Find Undervalued NFTs</a>
                    </Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 transition duration-150">
                    <Link href="/bots/cswap-arbitrage" legacyBehavior>
                      <a className="block">CSWAP Arbitrage</a>
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Dropdown for Assets */}
          <div className="relative">
            <button onClick={toggleAssetsNav} className="text-white font-semibold py-2 px-4 rounded hover:bg-gray-700 transition duration-150">
              Get $Catsky Assets
            </button>
            {isAssetsNavOpen && (
              <div className="absolute left-0 mt-2 py-2 w-64 bg-white rounded-md shadow-lg z-10">
                <ul className="text-gray-700">
                  <li className="px-4 py-2 hover:bg-gray-100 transition duration-150">
                    <a href="https://app.minswap.org/swap?currencySymbolA=&tokenNameA=&currencySymbolB=9b426921a21f54600711da0be1a12b026703a9bd8eb9848d08c9d921&tokenNameB=434154534b59" target="_blank" rel="noopener noreferrer">
                      $Catsky Token
                    </a>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 transition duration-150">
                    <a href="https://www.jpg.store/collection/catnips" target="_blank" rel="noopener noreferrer">
                      CatNip NFTs
                    </a>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 transition duration-150">
                    <a href="https://www.jpg.store/collection/ogcatsky" target="_blank" rel="noopener noreferrer">
                      OG NFTs
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Dropdown for Image Generator */}
          <div className="relative">
            <button onClick={toggleImageGenNav} className="text-white font-semibold py-2 px-4 rounded hover:bg-gray-700 transition duration-150">
              Image Generator
            </button>
            {isImageGenNavOpen && (
              <div className="absolute left-0 mt-2 py-2 w-64 bg-white rounded-md shadow-lg z-50">
                <ul className="text-gray-700">
                  <li className="px-4 py-2 hover:bg-gray-100 transition duration-150">
                    <Link href="/image-generator/create" legacyBehavior>
                      <a className="block">Create Image</a>
                    </Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 transition duration-150">
                    <Link href="/image-generator/gallery" legacyBehavior>
                      <a className="block">Gallery</a>
                    </Link>
                  </li>
                  {/* Additional links can be added here if needed */}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          <CardanoWallet />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
