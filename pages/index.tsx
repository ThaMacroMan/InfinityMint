import React, { useState, useEffect, useCallback } from "react";
import Image from 'next/image';
import type { NextPage } from "next";
import { useAddress, useWallet } from '@meshsdk/react';
import { CardanoWallet } from '@meshsdk/react';
import { Transaction } from '@meshsdk/core';
import '@dexhunterio/swaps/lib/assets/style.css'
import Swap from '@dexhunterio/swaps'
import { useTokenCheck } from '../hooks/TokenCheck'; 
import WalletBalance from '../components/WalletBalance';
import Spinner from '../components/Spinner'; 
import APIErrorPopup from '../components/APIErrorPopup';
import ImageSlideshow from '../components/ImageSlideshow';
import axios from "axios";
import TokenPrice from './api/CheckPrice';

import logo from '../pages/styles/new logo.jpg'
import pwdby from '../pages/styles/OpenAI Green.png'
import pwdby2 from '../pages/styles/cardano_ada-512.png'

import jpglogo from '../pages/styles/jpglogo.png'



import aigirl from '../pages/public/images/aigirl.jpg';
import amazonman from '../pages/public/images/amazonman.jpg';
import citizen from '../pages/public/images/citizen.jpg';
import dead from '../pages/public/images/dead.jpg';
import dragon from '../pages/public/images/dragon.jpg';
import escape from '../pages/public/images/escape.jpg';
import powergirl from '../pages/public/images/powergirl.jpg';
import ship from '../pages/public/images/ship.jpg';



const Home: NextPage = () => {
  const { connected, wallet } = useWallet(); 
  const [unsignedTx, setUnsignedTx] = useState<any>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [promptSummary, setPromptSummary] = useState<string>('');
  const [chunkedPrompt, setChunkedPrompt] = useState<string[]>([]);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>(''); // State variable to store the generated prompt
  const [error, setError] = useState<string | null>(null);
  const [chunkedMetadata, setChunkedMetadata] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState("dall-e-3");
  const [selectedSize, setSelectedSize] = useState("1024x1024");
  const [selectedQuality, setSelectedQuality] = useState("standard");
  const [isLoading, setIsLoading] = useState(false); // State to manage loading state
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [selectedStyle, setSelectedStyle] = useState<string>(''); // State to store the selected style
  const [slideshowDisabled, setSlideshowDisabled] = useState(false);
  const [mintingPrice, setMintingPrice] = useState<number>(8690000); // Default to the initial price
  const [showInfo, setShowInfo] = useState<boolean>(false);

  const [userUses, setUserUses] = useState<string>('1');
  const [userAddress, setUserAddress] = useState<string>('none');
  const { projectAssetSummary, hasMinRequiredTokens } = useTokenCheck();
  const tokenBalance = projectAssetSummary["$CATSKY"] || 0; //ENTER
  const nft1Balance = projectAssetSummary["CatNips"] || 0;//ENTER
  const nft2Balance = projectAssetSummary["OG NFT"] || 0;//ENTER
  const nft3balance = projectAssetSummary["Era I"] || 0;//ENTER
  const [tokenPerUse, settokenPerUse] = useState<number>(0);
  const [formattedPrice, setFormattedPrice] = useState<string>('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [balances, setBalances] = useState({
    tokenBalance: 0,
    nft1Balance: 0,
    nft2Balance: 0,
    nft3balance: 0,
  });

  ///////Load User Data
  useEffect(() => {
    if (connected) {
      
      const newBalances = {
        tokenBalance: projectAssetSummary["$CATSKY"] || 0,//ENTER
        nft1Balance: projectAssetSummary["CatNips"] || 0,//ENTER
        nft2Balance: projectAssetSummary["OG NFTs"] || 0,//ENTER
        nft3balance: projectAssetSummary["Era 1"] || 0,//ENTER
      };
      setBalances(newBalances);
      fetchUserData();
      const price = calculateMintingPrice(tokenBalance);
      console.log('price is :', price)
      setMintingPrice(price);
      console.log('minting price set :', price)

      console.log('addy is:', userAddress)
      console.log("$CATSKY", newBalances.tokenBalance);
      console.log("CatNips", newBalances.nft1Balance);
      console.log("OG NFTs", newBalances.nft2Balance);
      console.log("Era 1", newBalances.nft3balance);
    }
    else {
      setMintingPrice(8690000)
    }
  }, [connected, projectAssetSummary, userAddress, userUses, setMintingPrice]);

  const fetchUserData = async () => {
    const usedAddresses = await wallet.getUsedAddresses();
    setUserAddress(usedAddresses[0])

    if (localStorage.getItem(userAddress) === 'null') {
      console.log('New User Detected, saving and setting to 1 free use')
      localStorage.setItem(userAddress, '1');

    }
    else {
      const storedUses = localStorage.getItem(userAddress) || '0';
      setUserUses(storedUses); //// FOR TESTING ADD 1
      console.log('Returning user detected with', userUses)
    }
  }
    ///////Load User Data
  
  //////////////// Model Options
  const updateOptions = useCallback(() => {
    const modelSelect = document.getElementById("model") as HTMLSelectElement;
    const sizeSelect = document.getElementById("size") as HTMLSelectElement;
    const qualitySelect = document.getElementById("quality") as HTMLSelectElement;

    if (!modelSelect || !sizeSelect || !qualitySelect) return;

    // Clear existing options
    sizeSelect.innerHTML = "";
    qualitySelect.innerHTML = "";

    // Default options are always available
    const squareOption = document.createElement("option");
    squareOption.value = "1024x1024";
    squareOption.textContent = "Square";
    sizeSelect.appendChild(squareOption);

    const standardQualityOption = document.createElement("option");
    standardQualityOption.value = "standard";
    standardQualityOption.textContent = "Standard";
    qualitySelect.appendChild(standardQualityOption);

    // Conditional addition of more options based on asset balances
    if (nft1Balance >= 3 || nft2Balance >= 1 || nft3balance >= 10) {
      // Enable additional size options
      const landscapeOption = document.createElement("option");
      landscapeOption.value = "1792x1024";
      landscapeOption.textContent = "Landscape";
      sizeSelect.appendChild(landscapeOption);

      const portraitOption = document.createElement("option");
      portraitOption.value = "1024x1792";
      portraitOption.textContent = "Portrait";
      sizeSelect.appendChild(portraitOption);

      // Enable additional quality options
      const hdOption = document.createElement("option");
      hdOption.value = "hd";
      hdOption.textContent = "HD";
      qualitySelect.appendChild(hdOption);
    }

    // Update the selected values to reflect any changes
    setSelectedSize(sizeSelect.value);
    setSelectedQuality(qualitySelect.value);
  }, [nft1Balance, nft2Balance, nft3balance, setSelectedSize, setSelectedQuality]);

  useEffect(() => {
    updateOptions();
  }, [updateOptions]);
  //////////////// Model Options
  
  /////////////// GPT-3.5-Turbo Prompt
  const getRandomPrompt = async () => {
    try {


      setIsLoading(true); // Set loading state to true
      // Call your internal API endpoint instead of OpenAI's API directly
      const response = await fetch('/api/getRandomPrompt');
  
      if (!response.ok) {
        setError('Requests with swears or nudity are rejected. If error continues, notify MacroMan');
        setIsLoading(false);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const randomPrompt = data.prompt;
      console.log(randomPrompt);
  
      if (randomPrompt !== null) {
        setPrompt(randomPrompt);
        setIsLoading(false); // Reset loading state
      }
    } catch (error) {
      setIsLoading(false); // Ensure loading state is reset even on error
      console.error('Error generating random prompt:', error);
    }
  }
  /////////////// GPT-3.5-Turbo Prompt


    // Function to clear the prompt and generated images
    const clearGeneratedData = () => {
      setPrompt('');
      setGeneratedImages([]);
      setGeneratedPrompt('');
      setPromptSummary('');
    };

    /////////////// GPT-3.5-Turbo Summary of Prompt
  const summarizePrompt = async (prompt: string) => {
    try {
      const response = await fetch('/api/summarizePrompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const summary = data.summary;
      console.log(summary);
  
      return summary;
    } catch (error) {
      console.error('Error generating summarized prompt:', error);
      throw error;
    }
  };
  /////////////// GPT-3.5-Turbo Summary of Prompt


  const handleSettokenPerUse = useCallback((newtokenPerUse: number, newFormattedPrice: string) => {
    settokenPerUse(newtokenPerUse);
    setFormattedPrice(newFormattedPrice);
    console.log("CATSKY Per Use: ", tokenPerUse)
    console.log("CATSKY Price: ₳", formattedPrice)
    console.log("User Uses: ", userUses)
  }, []);

///////////////////Generate Image with Dalle 3
  const generateImage = async () => {
    const price = calculateMintingPrice(mintingPrice);
    setMintingPrice(price);

    setSlideshowDisabled(true); // Disable the slideshow when generating image
    try {
      setIsLoading(true); // Set loading state to true when generating image
      console.log(selectedModel,selectedSize,selectedQuality);
      const response = await fetch('/api/generateImage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `${prompt}`,
          size: selectedSize,
          quality: selectedQuality,
          model: selectedModel,
          style: selectedStyle
        }),
      });
      console.log(prompt, selectedSize, selectedQuality, selectedModel, selectedStyle);

      if (!response.ok) {
        setError('Requests with swears or nudity are rejected. If error continues, notify MacroMan');
        setIsLoading(false);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const imageUrls = data.imageUrls;
      setGeneratedImages(imageUrls);
      setUploadedImage(null);
      console.log(imageUrls);
      setGeneratedPrompt(prompt);
      // Get summary for the prompt
      const promptSummary = await summarizePrompt(prompt);
      setPromptSummary(promptSummary);
      // Chunking image URLs for metadata
      const chunkedMetadata = chunkData(imageUrls.join(','), 64);
      setChunkedMetadata(chunkedMetadata);
      // Chunking prompt for metadata
      const chunkedPromptData = chunkData(prompt, 64);
      setChunkedPrompt(chunkedPromptData);
      setIsLoading(false); // Set loading state to false when image generation is complete

      setUserUses((prevUserUses) => {
        const newUserUses = String(Number(prevUserUses) - 1);
        localStorage.setItem(userAddress, newUserUses);
        return newUserUses; // Return the updated count to ensure the state is correctly set
      });

    } catch (error) {
      console.error('Failed to generate images:', error);
      setIsLoading(false); // Ensure loading state is reset even on error
    }
  };

  // Function to chunk data into specified size
  const chunkData = (data: string, size: number) => {
    const chunks = [];
    for (let i = 0; i < data.length; i += size) {
      chunks.push(data.substring(i, i + size));
    }
    return chunks;
  };
  ///////////////////Generate Image with Dalle 3


  const handleStyleSelection = (style: string) => {
    setSelectedStyle(style);
  };

  const creditUser = async()=>{

    setUserUses((prevUserUses) => {
      const newUserUses = String(Number(prevUserUses) + 10);
      localStorage.setItem(userAddress, newUserUses);
      return newUserUses; // Return the updated count to ensure the state is correctly set
    })
  }
  /////////////Purchase AI Uses Transaction
  const buyUsesTransaction = async () => {

    try {

      const tx = new Transaction({ initiator: wallet }).sendLovelace(
        'addr1qyvefdy7d2d9dwrncanthwrxxaem5zuttcc2hx98ehqzvr4lxlsc08nu9pvf0phe8mgxdgvutex6xcdtxqvc8hsecanqdvj0vt',
        '1000000'
      );
  
      const unsignedTx = await tx.build();
      setUnsignedTx(unsignedTx); // Save unsignedTx to state
  
      if (!unsignedTx) {
        console.error('Unsigned transaction not available');
        return;
      }
  
      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);
      console.log('Transaction hash:', txHash);
      creditUser();

    } catch (error) {
      setError('You do not have enough ADA , RAD or Rejected the TX');
      console.error('Error processing transaction:', error);
    }
  };
  /////////////Purchase AI Uses Transaction
  
    /////// Calculate NFT Mint price based on token balance
    const calculateMintingPrice = (tokenBalance: number) => {
      if (tokenBalance >= 5000000000) {
        return 4690000; 
      } else if (tokenBalance >= 3000000000) {
        return 5690000; 
      } else if (tokenBalance >= 1000000000) {
        return 6690000; 
      } else if (tokenBalance >= 500000000) {
        return 7690000; 
      } else {
        return 8690000; 
      }
    };
    /////// Calculate NFT Mint price based on token balance


  //////// NFT Mint Transaction
    const processTransaction = async () => {
      const price = calculateMintingPrice(tokenBalance);
      console.log('user address: ', wallet)
      console.log('mint price:', price);
      console.log('Chunked image URL (2):', chunkedMetadata )
      console.log('Chunked Prompt (2):', chunkedPrompt);
      const tx = new Transaction({ initiator: wallet })
      .sendLovelace(
        'addr1vxufv40n45m0x7du3kk305trmsvclgdnw3ly2lxq2gkqxqga696du',
        price.toString()
      );
        // Define the type of metadataObj
        type MetadataObject = {
          URLs: string[];
          Prompt: string[];
          [key: string]: string[]; 
        };
        // Aggregate chunked URLs
        let metadataKey = 674;
        let metadataObj: MetadataObject = {
          URLs: [],
          Prompt: [],
        };
        // Iterate through each chunk of metadata, split it, and extract URLs
        chunkedMetadata.forEach((chunk: string) => {
          let urlsInChunk: string[] = chunk.split(',');
          metadataObj.URLs.push(...urlsInChunk);
        });
        // Iterate through each chunk of prompt, split it, and extract prompt
        chunkedPrompt.forEach((chunk: string) => {
          let promptInChunk: string[] = chunk.split(',');
          metadataObj.Prompt.push(...promptInChunk);
        });
        // Add additional metadata properties
        metadataObj['Era'] = ['V1.0: Wildcat Genesis Era']; // Explicitly define Era as string[]
        metadataObj['Text'] = ['Powered by Catsky AI and Sick City']; // Explicitly define Text as string[]
        metadataObj['Settings'] = [selectedModel, selectedSize, selectedQuality]
        metadataObj['Name'] = [promptSummary]
        // Set metadata with aggregated URLs, prompt, and additional metadata strings
        tx.setMetadata(metadataKey, metadataObj);
      try {
          // Build transaction
          const unsignedTx = await tx.build();
          setUnsignedTx(unsignedTx); // Save unsignedTx to state
          console.log('Unsigned transaction:', unsignedTx);
          // Sign transaction
          if (!unsignedTx) {
              console.error('Unsigned transaction not available');
              return;
          }
          const signedTx = await wallet.signTx(unsignedTx);
          console.log('Signed transaction:', signedTx);

          // Submit transaction
          const txHash = await wallet.submitTx(signedTx);
          console.log('Transaction hash:', txHash);
      } catch (error) {
        setError('You do not have enough ADA or Cancelled')
          console.error('Error processing transaction:', error);
      }
  };

  //////// NFT Mint Transaction

  const autoExpand = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = event.target;
    textarea.style.height = 'inherit'; // Reset the height
    textarea.style.height = `${textarea.scrollHeight}px`; // Set to scrollHeight
  };


  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', updateCursor);

    return () => {
      window.removeEventListener('mousemove', updateCursor);
    };
  }, []);

  const saveImage = async (imageUrl: string) => {
    try {
        // Open the image in a new tab
        window.open(imageUrl, '_blank');
    } catch (error) {
        console.error('Error opening image:', error);
    }
  };  

   // Function to toggle the info pop-up
   const toggleInfo = () => setShowInfo(!showInfo);
 //API IS ON CLIENT SIDE - FIX IN FUTURE

  const widgetStyle = {
    position: 'fixed',
    top: 0,
    right: 0,
    transform: 'translateY(0)', // Reset any previous translation on the y-axis
  };

  return (
    <>
    <div className="header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem' }}>
      <a 
        href="https://catsky.io/" 
        target="_blank" 
        rel="noopener noreferrer" 
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
      >
        <Image 
          src={logo.src} 
          alt="Logo" 
          width={60}
          height={60}
          style={{ marginRight: '8px' }} 
        />
        <span id="gradient-text">InfinityMint V2.0</span>
      </a>



        <a 
          href="https://catsky.io/" 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <Image 
          src={pwdby.src} 
          alt="Logo" 
          width={60}
          height={60}
          style={{ marginRight: '2px' }} 
        />
        <span id="gradient-text">Powered by Catsky AI </span>

        <Image 
          src={pwdby2.src} 
          alt="Logo" 
          width={40}
          height={40}
          style={{ marginLeft: '16px' }} 
        />
        </a>

      <a 
        href="https://www.taptools.io/charts/token/0be55d262b29f564998ff81efe21bdc0022621c12f15af08d0f2ddb1.76ab3fb1e92b7a58ee94b712d1c1bff0e24146e8e508aa0008443e1db1f2244e" 
        target="_blank" 
        rel="noopener noreferrer" 
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
      >
        <p style={{ color: 'green', fontSize:' .75 rem' }}>$CATSKY: ₳ {formattedPrice}</p>

      </a>
    </div>

      <div className="wrapper">
        {/* Form Section */}
        <div className="form">

            <div className=" tag6 "> 
              <CardanoWallet isDark={true} {...{className: "wallet"}} />
              <div>
                <h1 className="infobutton" onClick={toggleInfo}>More Info</h1>
                {showInfo}
              </div>

          </div>

          <button
                onClick={buyUsesTransaction}
                className={`button tag  ${
                  !connected ||
                  isLoading ||
                  (!generatedImages && !uploadedImage) ||
                  (generatedImages.length === 0 && !uploadedImage)
                    ? "disabled-button"
                    : ""
                }`}
              >
                <div id='gradient-text'>
                <p> Refuel: ₳ 1  </p> {/*{tokenPerUse} calculated in checkPrice component */}
                </div>
            </button>

            <div className="uses-container">
              <div className="loading-bar">
                <div className='loading-block' >
                <p style={{ color: 'red', margin: 0 }}>E</p>
                </div>
                {Array.from({ length: 10 }).map((_, index) => (
                  <div
                    key={index}
                    className={`loading-block ${
                      parseInt(userUses) >= 4 ? "magenta" : parseInt(userUses) > 0 ? "orange" : "red"


                    } ${
                      index < parseInt(userUses) ? "filled" : ""
                    }`}
                  ></div>
                  
                ))}
                                <div className='loading-block'>
                <p style={{ color: 'red', margin: 0 }}>F</p>
                </div>
              </div>
              
              <div className="token-per-use">

              </div>
            </div>

              {connected}
              <WalletBalance />

            
            <div>
            <TokenPrice
            tokenUnit="6787a47e9f73efe4002d763337140da27afa8eb9a39413d2c39d4286524144546f6b656e73"
            onchainID="0be55d262b29f564998ff81efe21bdc0022621c12f15af08d0f2ddb1.f73964cf9bfdc80b6b1b5a313100dede92dabe681e5fa072debb8a53f798e474"
            interval="1d"
            numIntervals={1}
            settokenPerUse={handleSettokenPerUse} // Pass the callback function as prop
            />
            </div>
            <div className="textarea-container">
            <textarea
              className="textarea"
              name="prompt"
              id="prompt"
              value={prompt}
              rows={3}
              onChange={(e) => setPrompt(e.target.value)}
              onInput={autoExpand}
              placeholder="Your Idea: " // update for brand
            ></textarea>
            {generatedImages.length >0 && (
              <button
                type="button"
                onClick={clearGeneratedData}
                className="overlay-button"
              >
                Retry
              </button>
            )}
          </div>

              <button
                className="button"
                type="button"
                id="randomGenerate"
                disabled={isLoading} // Disable the button when loading
                onClick={() => { getRandomPrompt(); setPrompt(''); }} // Clear prompt area when "Generate Prompt" is clickex
              >
               <span id="gradient-text"> AutoIdea</span>
              </button>
              <div/>

              <div className="tag2">
              <label htmlFor="model">Style</label> {/* update for brand */}
              <div className="dropdown-container">
                <select 
                className="field"
                name="style"
                id="style" 
                style={{ cursor: 'pointer' }}
                onChange={(e) => handleStyleSelection(e.target.value)}>
                <option value="">Select</option>
                  <option value="natural">Natural</option>
                  <option value="vivid">Vivid</option>
                </select>
              </div>
            </div>

            <div>
                <div className="" onClick={toggleInfo}>
                </div>
                  {showInfo && (
                    <div className="info-popup">
                      <p><span id="gradient-text"> Style:</span> Select Natural for more natural looking images and vivid for more pop. </p>
                    </div>
                  )}
              </div>

              <div className="tag2">
                <label htmlFor="model">AI Model</label> {/* update for brand */}
                <div className="dropdown-container">
                <select
                  className="field"
                  name="model"
                  id="model"
                  style={{ cursor: 'pointer' }}
                  onChange={updateOptions}
                >
                  <option value="dall-e-3"> dalle 3</option>

                </select>
                </div>
            </div> 

              <div>
                <div className="" onClick={toggleInfo}>
                </div>
                  {showInfo && (
                    <div className="info-popup">
                      <p><span id="gradient-text"> AI Model:</span> Dalle 3 is OpenAI&apos;s latest image generation model.</p>
                    </div>
                  )}
              </div>
              <div className="tag2">
                <label htmlFor="size">Form</label> {/* update for brand */}
                <div className="dropdown-container">
                <select className="field" 
                  name="size" 
                  id="size"
                  style={{ cursor: 'pointer' }}
                  onChange={(e) => setSelectedSize(e.target.value)} 
                  >
                </select>
                </div>
              </div>
              <div>
                <div className="" onClick={toggleInfo}></div>
                  {showInfo && (
                    <div className="info-popup">
                      <p><span id="gradient-text"> Square = </span> 1024x1024</p>
                      <p><span id="gradient-text"> Landscape = </span> 1792x1024</p>
                      <p><span id="gradient-text"> Portrait = </span> 1024x1792</p>
                    </div>
                  )}
              </div>
              <div className="tag2">
                <label htmlFor="quality"> Grade</label> {/* update for brand */}
                <div className="dropdown-container">
                <select className="field" 
                  name="quality" 
                  id="quality"
                  style={{ cursor: 'pointer' }}
                  onChange={(e) => setSelectedQuality(e.target.value)}>
                  <option value="standard">Standard</option>
                  <option value="hd">HD</option>
                </select>
                </div>
              </div>
              <div>
                <div className="" onClick={toggleInfo}></div>
                  {showInfo && (
                    <div className="info-popup">
                      <p><span id="gradient-text"> Grade:</span> Dalle 3 has 2 quality options: Standard and HD.</p>
                    </div>
                  )}
              </div>

              <button
                type="button"
                onClick={generateImage}
                className={`button animated-gradient ${
                  isLoading  || !connected || !prompt.trim() || userUses === '0' ? 'disabled-button' : ''
                }`}
                disabled={isLoading || !connected || !prompt.trim() || userUses === '0'} // Disable the button if loading, balance is insufficient, not connected, no prompt text, or no usage available
              >
                <span id="gradient-text">Build Idea</span> {/* update for brand */}
              </button>

            <button
              type="button"
              onClick={processTransaction}
              className={`button animated-gradient2 ${
                !connected ||
                isLoading ||
                (!generatedImages && !uploadedImage) ||
                (generatedImages.length === 0 && !uploadedImage)
                  ? "disabled-button"
                  : ""
              }`}
              disabled={
                !connected ||
                isLoading ||
                (!generatedImages && !uploadedImage) ||
                (generatedImages.length === 0 && !uploadedImage)
              } // Disable button based on condition
            >
              <span id='gradient-text'>Mint Creation: ₳ {(mintingPrice / 1000000).toFixed(2)}</span> {/* update for brand */}
              </button>

              <a
                    className={'button'}
                    href="https://www.jpg.store/collection/infinitymintwildcatgenesisera?tab=items"
                    rel="noopener noreferrer"
                    style={{ cursor: 'pointer', display: 'flex', alignContent:'center', justifyContent: 'space-around', paddingRight:'1rem', paddingLeft: '1rem' }}
                  >
                    <span id='gradient-text'>Market:  </span>
                
                  <Image 
                    src={jpglogo.src} 
                    alt="Logo" 
                    width={150}
                    height={15} 
                  />
                </a>

              <div>
                <div className="" onClick={toggleInfo}></div>
                  {showInfo && (
                    <div className="info-popup">
                      <p><span id="gradient-texts"></span> Hold $RAD when minting!</p>
                      <p><span id="gradient-text"> 0.5 M = ₳ 1 ADA</span> an 11% Discount</p>
                      <p><span id="gradient-text"> 1.0 M = ₳ 2 ADA</span> an 22% Discount!</p>
                      <p><span id="gradient-text"> 3.0 M = ₳ 3 ADA</span> an 34% Discount!!</p>
                      <p><span id="gradient-text"> 5.0 M = ₳ 4 ADA</span> an 46% Discount!!!</p>
                    </div>
                  )}
              </div>

          </div>

          {/* "Your Creation" Section */}
          <div className="creation-container">
              {!slideshowDisabled && (
                <ImageSlideshow 
                  images={[
                    aigirl, amazonman, citizen, dead, dragon, escape, powergirl, ship
                  ]}
                  disabled={false} 
                />
              )}

              {error && <APIErrorPopup message={error} onClose={() => setError('')} />}
              {isLoading && (
                <div className="spinner-container">
                  <Spinner message="Generating your creation..." />
                </div>
              )}

              <Swap
                orderTypes={["SWAP","LIMIT"]}
                defaultToken="6787a47e9f73efe4002d763337140da27afa8eb9a39413d2c39d4286524144546f6b656e73" //policyID + asset string
                colors={{"background":"#0E0F12","containers":"#191B23","subText":"#88919E","mainText":"#FFFFFF","buttonText":"#FFFFFF","accent":"#007DFF"}}
                theme="dark"
                width="450"
                partnerCode="cardania2463617264616e6961da39a3ee5e6b4b0d3255bfef95601890afd80709"
                partnerName="Cardania"
                displayType="WIDGET"
              />

            {!!generatedImages && generatedImages.length > 0 && (
              <div>
              <div className="tag5">
                <span  id="creation-gradient-text"> {promptSummary}</span>
                </div>
                {generatedImages.map((imageUrl, imageIndex) => (
                  <div key={`generated-image-${imageIndex}`}>
                    <img
                      src={imageUrl}
                      alt={`Generated Image ${imageIndex + 1}`}
                      className="imageborder"
                      onClick={() => saveImage(imageUrl)}
                      style={{ cursor: 'pointer' }} // Add this line
                    />
                        {/* Prompt */}

                    <div className="tag5">
                    <span  id="creation-gradient-text">Prompt: {generatedPrompt}</span>
                      </div>
                </div>
                ))}

                  
                </div>


            )}
            {uploadedImage && (
            <div>
              <div key={`uploaded-image`}>
                <Image
                  src={uploadedImage}
                  alt={`Uploaded Image`}
                  width={500}
                  height={300}
                  className="mx-auto mt-4 mb-4 imageborder"
                  onClick={() => saveImage(uploadedImage)}
                />
              </div>
            </div>
          )}
          </div>
      </div>
    </>
    );
  }
export default Home;