import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from 'next/image';
import dynamic from 'next/dynamic';
import type { NextPage } from "next";
import { useAddress, useWallet } from '@meshsdk/react';
import { CardanoWallet } from '@meshsdk/react';
import { Transaction } from '@meshsdk/core';
import '@dexhunterio/swaps/lib/assets/style.css'

import { useTokenCheck } from '../hooks/TokenCheck'; 

const WalletBalance = dynamic(() => import('../components/WalletBalance'), { ssr: false });
const APIErrorPopup = dynamic(() => import('../components/APIErrorPopup'), { ssr: false });
const ImageSlideshow = dynamic(() => import('../components/ImageSlideshow'), { ssr: false });
const Radio = dynamic(() => import('../components/Radio'), {ssr: false})
const TokenPrice = dynamic(() => import('./api/CheckPrice'), { ssr: false });
const Swap = dynamic(() => import('@dexhunterio/swaps'), { ssr: false });

import catskylogo from '../pages/styles/logo-icon.png'
import logo from '../pages/styles/new logo.jpg'
import pwdby from '../pages/styles/OpenAI Green.png'
import pwdby2 from '../pages/styles/cardano_ada-512.png'

import CustomDeepChat from '../components/CustomDeepChat';

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
  const [selectedModel, setSelectedModel] = useState("SDXL-Lightning");
  const [selectedSize, setSelectedSize] = useState([1024,1024]);
  const [selectedQuality, setSelectedQuality] = useState(100);
  const [isLoading, setIsLoading] = useState(false); // State to manage loading state
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [selectedStyle, setSelectedStyle] = useState<string>(''); // State to store the selected style
  const [slideshowDisabled, setSlideshowDisabled] = useState(false);
  const [mintingPrice, setMintingPrice] = useState<number>(8690000); // Default to the initial price
  const [showInfo, setShowInfo] = useState<boolean>(false);

  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  const [showAssets, setShowAssets] = useState<boolean>(false); // Renamed state
  const assetsRef = useRef<HTMLDivElement>(null);

  const [userUses, setUserUses] = useState<string>('2');
  const [userAddress, setUserAddress] = useState<string>('none');
  const { projectAssetSummary, hasMinRequiredTokens } = useTokenCheck();
  const tokenBalance = projectAssetSummary["$CATSKY"] || 0; //ENTER
  const nft1Balance = projectAssetSummary["CatNips"] || 0;//ENTER
  const nft2Balance = projectAssetSummary["OG NFT"] || 0;//ENTER
  const nft3Balance = projectAssetSummary["Era I"] || 0;//ENTER
  const [tokenPerUse, settokenPerUse] = useState<number>(0);
  const [formattedPrice, setFormattedPrice] = useState<string>('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [balances, setBalances] = useState({
    tokenBalance: 0,
    nft1Balance: 0,
    nft2Balance: 0,
    nft3Balance: 0,
  });

  const toggleAssets = () => {
    setShowAssets(!showAssets);
  };

  const autoExpand = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = event.target;
    textarea.style.height = 'inherit';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, []);

  useEffect(() => {
    if (assetsRef.current) {
      if (showAssets) {
        assetsRef.current.style.maxHeight = `${assetsRef.current.scrollHeight}px`;
      } else {
        assetsRef.current.style.maxHeight = '0';
      }
    }
  }, [showAssets]);

  useEffect(() => {
    if (connected) {
      const newBalances = {
        tokenBalance: projectAssetSummary["$CATSKY"] || 0,
        nft1Balance: projectAssetSummary["CatNips"] || 0,
        nft2Balance: projectAssetSummary["OG NFTs"] || 0,
        nft3Balance: projectAssetSummary["Era 1"] || 0,
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
      console.log("Era 1", newBalances.nft3Balance);
    }
    else {
      setMintingPrice(8690000)
      clearBalancesAndOptions();
    }
  }, [connected, projectAssetSummary, userAddress, userUses, setMintingPrice]);
  
  const clearBalancesAndOptions = () => {
    setBalances({
      tokenBalance: 0,
      nft1Balance: 0,
      nft2Balance: 0,
      nft3Balance: 0,
    });
    setUserUses('0');
    clearOptions();
  };

  const fetchUserData = async () => {
    const usedAddresses = await wallet.getUsedAddresses();
    setUserAddress(usedAddresses[0]);

    if (localStorage.getItem(userAddress) === 'null') {
      console.log('New User Detected, saving and setting to 1 free use');
      localStorage.setItem(userAddress, '1');
    } else {
      const storedUses = localStorage.getItem(userAddress) || '0';
      setUserUses(storedUses);
      console.log('Returning user detected with', userUses);
    }
  };

  const updateOptions = useCallback(() => {
    const sizeSelect = document.getElementById("size") as HTMLSelectElement;
    const qualitySelect = document.getElementById("quality") as HTMLSelectElement;

    if (!sizeSelect || !qualitySelect) return;

    const currentSize = sizeSelect.value;
    const currentQuality = qualitySelect.value;

    sizeSelect.innerHTML = "";
    qualitySelect.innerHTML = "";

    const smallOption = document.createElement("option");
    smallOption.value = [1024,1024].toString();;
    smallOption.textContent = "Square 🟧";
    sizeSelect.appendChild(smallOption);

    const mediumOption = document.createElement("option");
    mediumOption.value = [1080,1920].toString();
    mediumOption.textContent = "Portrait ꟾ";
    sizeSelect.appendChild(mediumOption);

    const largeOption = document.createElement("option");
    largeOption.value = "1920,1080";
    largeOption.textContent = "Landscape ⟺";
    sizeSelect.appendChild(largeOption);

    setSelectedSize(sizeSelect.value.split(',').map(Number));
    setSelectedQuality(Number(qualitySelect.value));
  }, []);
  const clearOptions = useCallback(() => {
    const sizeSelect = document.getElementById("size") as HTMLSelectElement;
    const qualitySelect = document.getElementById("quality") as HTMLSelectElement;

    if (!sizeSelect || !qualitySelect) return;

    sizeSelect.innerHTML = "";
    qualitySelect.innerHTML = "";

    const squareOption = document.createElement("option");
    squareOption.value = "1024x1024";
    squareOption.textContent = "Square";
    sizeSelect.appendChild(squareOption);

    const standardQualityOption = document.createElement("option");
    standardQualityOption.value = "standard";
    standardQualityOption.textContent = "Standard";
    qualitySelect.appendChild(standardQualityOption);

    setSelectedSize(sizeSelect.value.split(',').map(Number));
    setSelectedQuality(Number(qualitySelect.value));
  }, []);

  useEffect(() => {
    updateOptions(); 
  }, [balances, updateOptions]);

  //////////////// Model Options
  
  /////////////// GPT-3.5-Turbo Prompt
  const getRandomPrompt = async () => {
    try {

      setIsLoading(true); // Set loading state to true
      // Call your internal API endpoint instead of OpenAI's API directly
      const response = await fetch('/api/getRandomPrompt');
  
      if (!response.ok) {
        setError('Requests with swears or nudity are rejected by OpenAIs policy here: https://openai.com/policies/usage-policies/');
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

  const generateImage = async () => {
    const price = calculateMintingPrice(mintingPrice);
    setMintingPrice(price);
  
    setSlideshowDisabled(true); // Disable the slideshow when generating image
    try {
      setIsLoading(true); // Set loading state to true when generating image
      
      console.log(selectedModel, selectedSize, selectedQuality);
      // Define variables for API endpoint and request body
      let apiEndpoint = '';
      let bodyData = {};
      const [width, height] = selectedSize; // Use the array directly


      // Determine the appropriate API endpoint and body data based on the selected model
      switch (selectedModel) {
        case 'SDXL-Lightning':
          apiEndpoint = '/api/replicateSDXL';
          bodyData = {
            prompt: `${prompt}`,
            width: width,
            height: height,
            num_outputs: 1,
            output_format: 'png',
            negative_prompt: "worst quality, low quality",
            disable_safety_checker: true
          };
          break;

        case 'Stable Diffusion 3':
          apiEndpoint = '/api/replicateSD3';
          bodyData = {
            prompt,
            width: width,
            height: height,
            num_outputs: 1,
            output_format: 'png',
          };
          break;

        case 'dall-e-3':
          apiEndpoint = '/api/generateImage';
          bodyData = {
            prompt: `${prompt}`,
            width: width,
            height: height,
            num_outputs: 1,
            output_format: 'png',
            style: selectedStyle
          };
          break;

        default:
          console.error('Unknown model selected:', selectedModel);
          throw new Error('Unknown model selected');
      }

      // Log the selected model, size, and quality for debugging
      console.log(selectedModel, selectedSize, selectedQuality);

      // Make an API request to generate the image
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      });

// Log the final parameters for debugging
console.log(prompt, selectedSize, selectedQuality, selectedModel, selectedStyle);

  
      if (!response.ok) {
        setError('Requests with swears or nudity are rejected by OpenAIs policy here: openai.com/policies');
        setIsLoading(false);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const imageUrls = data.imageUrls;

      const base64DataUrl = data.base64DataUrl || '';
  
      if (imageUrls.length === 0 && !base64DataUrl) {
        throw new Error('No image generated');
      }
  
      if (imageUrls.length > 0) {
        setGeneratedImages((prevImages) => {
          const newImages = [...prevImages, ...imageUrls];
          setSelectedImageIndex(newImages.length - 1); // Select the latest image
          return newImages;
        });
      } else if (base64DataUrl) {
        setGeneratedImages((prevImages) => {
          const newImages = [...prevImages, base64DataUrl];
          setSelectedImageIndex(newImages.length - 1); // Select the latest image
          return newImages;
        });
      }

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
  
      // Determine the number of uses to deduct
      const usesToDeduct = selectedQuality === 100 ? 1 : 2;

      setUserUses((prevUserUses) => {
        const newUserUses = String(Number(prevUserUses) - usesToDeduct);
        localStorage.setItem(userAddress, newUserUses);
        return newUserUses; // Return the updated count to ensure the state is correctly set
      });
  
    } catch (error) {
      console.error('Failed to generate images:', error);
      setIsLoading(false); // Ensure loading state is reset even on error
    }
  };

  const upscaleImage = async (imageUrl: string) => {
    try {
      setIsLoading(true);
  
      const response = await fetch('/api/replicateUpscaler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const upscaleImageUrl = data.upscaleImageUrl;
  
      if (!upscaleImageUrl) {
        throw new Error('No upscaled image generated');
      }
  
          // Replace the selected image with the upscaled image
      setGeneratedImages(prevImages => {
        const newImages = [...prevImages];
        newImages[selectedImageIndex] = upscaleImageUrl;
      
        const chunkedMetadata = chunkData(newImages.join(','), 64);
      setChunkedMetadata(chunkedMetadata);

        return newImages;
        
      });

      setUserUses((prevUserUses) => {
        const newUserUses = String(Number(prevUserUses) - 2);
        localStorage.setItem(userAddress, newUserUses);
        return newUserUses; // Return the updated count to ensure the state is correctly set
      });

  setTimeout(() => {
    setIsLoading(false);
  }, 5300);
  
    } catch (error) {
      console.error('Failed to upscale image:', error);
      setIsLoading(false);
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
      const newUserUses = String(Number(prevUserUses) + 15);
      localStorage.setItem(userAddress, newUserUses);
      return newUserUses; // Return the updated count to ensure the state is correctly set
    })
  }
  /////////////Purchase AI Uses Transaction
/////////////Purchase AI Uses Transaction
const buyUsesTransaction = async () => {
  try {


    const tx = new Transaction({ initiator: wallet }).sendLovelace(
      'addr1qyvefdy7d2d9dwrncanthwrxxaem5zuttcc2hx98ehqzvr4lxlsc08nu9pvf0phe8mgxdgvutex6xcdtxqvc8hsecanqdvj0vt',
     `1000000`
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

  } catch (error:any) {
    if (error.message.includes('TypeError: this._initiator.getUsedUTxOs is not a function.')) {
      setError('Wallet not connected. Connect your wallet!');
    } else if (error.message.includes('An error occurred during signTx: {"code":2,"info":"user declined sign tx"}.')) {
      setError('Refuel cancelled');
    } else if (error.message.includes('Not enough ADA leftover to include non-ADA assets in a change address.')) {
      setError('Not enough ADA! Load up!');
    } else {
      setError('An unexpected error occurred. Please try again.');
    }
    console.error('Error processing transaction:', error);
  }
};
/////////////Purchase AI Uses Transaction

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
        //'addr_test1vqnyw727fxs7ptkdje2pgprhks0ch60w00exfp5nx8r9hzqfhqcx4',
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
        metadataObj['Era'] = ['V2.0: Neolithic Nexus Era']; // Explicitly define Era as string[]
        metadataObj['Text'] = ['Powered by Catsky AI and Sick City']; // Explicitly define Text as string[]
        metadataObj['Settings'] = [selectedModel, selectedSize.toString()];
        metadataObj['Name'] = [promptSummary];
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

      } catch (error:any) {
        if (error.message.includes('TypeError: this._initiator.getUsedUTxOs is not a function.')) {
          setError('Wallet not connected. Connect your wallet!');
        } else if (error.message.includes('An error occurred during signTx: {"code":2,"info":"user declined sign tx"}.')) {
          setError('Minting cancelled');
        } else if (error.message.includes('Not enough ADA leftover to include non-ADA assets in a change address.')) {
          setError('Not enough ADA! Load up!');
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
        console.error('Error processing transaction:', error);
      }
    };

  //////// NFT Mint Transaction
   // Function to handle error closing
   const handleCloseError = () => {
    setError(null);
  };

  ///////// Handle the loading state with a delay to allow for a smooth fade-out
  useEffect(() => {
    const creationContainer = document.querySelector('.creation-container') as HTMLElement;

    if (creationContainer) {
      if (isLoading) {
        creationContainer.classList.add('glowing');
      } else {
        creationContainer.classList.remove('glowing');
        const timeoutId = setTimeout(() => {
          creationContainer.style.opacity = '1'; // Ensure it's fully opaque
        }, 2000); // The delay should match the transition duration in CSS
        return () => clearTimeout(timeoutId);
      }
    }
  }, [isLoading]);


  return (
    <>
<div className="header">
  <a 
    href="https://catsky.io/" 
    target="_blank" 
    rel="noopener noreferrer" 
    className="logo-container"
  >
    <Image 
      src={logo.src} 
      alt="Logo" 
      width={80}
      height={80}
      style={{ marginRight: '8px' }} 
    />
    <div className="text-wrapper">
      <span id="gradient-text2">InfinityMint V2.0</span>
      <span className="subtext">Neolithic Nexus Era</span>
    </div>
  </a>
  <div className="hide-on-mobile">
    <a 
      href="https://catsky.io/" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="logo-container"
    >
      <Image 
        src={pwdby.src} 
        alt="Logo" 
        width={60}
        height={60}
        style={{ marginRight: '2px' }} 
      />
      <span id="gradient-text">Powered by Catsky AI</span>
      <Image 
        src={pwdby2.src} 
        alt="Logo" 
        width={40}
        height={40}
        style={{ marginLeft: '16px' }} 
      />
    </a>
  </div>
  <a 
    href="https://www.taptools.io/charts/token/0be55d262b29f564998ff81efe21bdc0022621c12f15af08d0f2ddb1.76ab3fb1e92b7a58ee94b712d1c1bff0e24146e8e508aa0008443e1db1f2244e" 
    target="_blank" 
    rel="noopener noreferrer" 
    className="logo-container"
    style={{ justifyContent: 'flex-end' }}
  >
    <Image 
      src={catskylogo.src} 
      alt="Logo" 
      width={60}
      height={60}
      className="cat-logo"
    />
    <div className="text-wrapper2">
      <p style={{ color: 'green', fontSize:'2rem', marginLeft: '8px' }}> $CATSKY: ₳ {formattedPrice}</p>
    </div>
  </a>
</div>              

<div className="wrapper">
        {/* Form Section */}
        <div className="form">
          <div className="wallet-assets-container tag" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex:1000 }}>
            <CardanoWallet isDark={true} {...{ className: "wallet" }} />
            <button className="infobutton" onClick={toggleAssets}>
              {showAssets ? 'Hide Assets' : 'Show Assets'}
            </button>
          </div>
          <div 
            ref={assetsRef} 
            className="assets-container" 
            style={{ display: 'flex', justifyContent: 'center', width: '100%', overflow: 'hidden', transition: 'max-height 0.5s ease-out', maxHeight: showAssets ? '500px' : '0' }}
          >
            <WalletBalance />
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
                <p> Refuel 🔋 : ₳ 1  </p> {/*{tokenPerUse} calculated in checkPrice component */}

            </button>
            {/*}
            <button
                onClick={creditUser}
                className={`button tag  ${
                  !connected ||
                  isLoading ||
                  (!generatedImages && !uploadedImage) ||
                  (generatedImages.length === 0 && !uploadedImage)
                    ? "disabled-button"
                    : ""
                }`}
              >
                <p> Refuel to Begin: ₳ 1  </p> {/*{tokenPerUse} calculated in checkPrice component *
            </button>
                  */}
            <div className="uses-container">
              <div className="loading-bar">
                <div className='loading-block' >
                <p style={{ color: 'red', margin: 0 }}>🪫</p>
                </div>
                {Array.from({ length: 15 }).map((_, index) => (
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
                <p style={{ color: 'red', margin: 0 }}>🔋</p>
                </div>
              </div>
              
              <div className="token-per-use">

              </div>
            </div>
              {connected}
              

            <div>
            <TokenPrice
            tokenUnit="9b426921a21f54600711da0be1a12b026703a9bd8eb9848d08c9d921434154534b59" //UPDATE TOKEN: POLICY ID + ASSET NAME HEX
            onchainID="0be55d262b29f564998ff81efe21bdc0022621c12f15af08d0f2ddb1.76ab3fb1e92b7a58ee94b712d1c1bff0e24146e8e508aa0008443e1db1f2244e" //UPDATE FROM TAPTOOLS LINK
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
              rows={4}
              onChange={(e) => setPrompt(e.target.value)}
              onInput={autoExpand}
              placeholder="Your Idea: " // update for brand
            ></textarea>
            {/*}
            {generatedImages.length >0 && (
              <button
                type="button"
                onClick={clearGeneratedData}
                className="overlay-button"
              >
                Clear
              </button>
            )}
          */}
          </div>


              <button
                className="button"
                type="button"
                id="randomGenerate"
                disabled={isLoading} // Disable the button when loading
                onClick={() => { getRandomPrompt(); setPrompt(''); }} // Clear prompt area when "Generate Prompt" is clickex
              >
               <span id="gradient-text">🚨 AutoIdea 🚨</span>
              </button>
              <div/>

              
              
              <div className="tag2">
              <label htmlFor="model" style={{ whiteSpace: 'nowrap' }}>AI Model</label> {/* Prevent wrapping */}
                <div className="dropdown-container">
                <select
                  className="field"
                  name="model"
                  id="model"
                  style={{ cursor: 'pointer' }}
                  onChange={(e) => setSelectedModel(e.target.value)} // Ensure this updates the state
                  >
                <option value="SDXL-Lightning">SDXL ⚡️</option>
                <option value="Stable Diffusion 3">SD 3 🌌</option>
                <option value="dall-e-3">DALLE 3</option>

                </select>
                </div>
            </div> 

            {/*}
            <div className="tag2">
              <label htmlFor="model">Style</label> 
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
            */}

            <div className="tag2">
                <label htmlFor="size">Size</label>
                <div className="dropdown-container">
                <select className="field" name="size" id="size" style={{ cursor: 'pointer' }} onChange={(e) => setSelectedSize(e.target.value.split('x').map(Number))}>
                    <option value="1024x1024">Square 🟧</option>
                    <option value="1024x1920">Portrait ꟾ</option>
                    <option value="1920x1024">Landscape ⟺</option>
                  </select>
                </div>
              </div>

              <div className="button-container flex flex-row justify-between gap-1 w-full">
                <button
                  type="button"
                  onClick={generateImage}
                  className={`button flex flex-col items-center justify-center py-2 ${isLoading || !connected || !prompt || userUses === '0' || generatedImages.length === 0 ? 'disabled-button' : ''}`}
                  disabled={isLoading || !connected || !prompt.trim() || userUses <= '0'} // Disable the button if loading, balance is insufficient, not connected, no prompt text, or no usage available
                >
                  <span>Build Idea</span> {/* update for brand */}
                  <span className="icon mt-1">👾</span>
                </button>

                <button
                  type="button"
                  onClick={() => { upscaleImage(generatedImages[selectedImageIndex]); }}
                  className={`button flex flex-col items-center justify-center py-2 ${isLoading || !connected || !prompt || userUses === '0' || generatedImages.length === 0 ? 'disabled-button' : ''}`}
                  disabled={isLoading || !connected || !prompt || userUses === '0' || generatedImages.length === 0}
                >
                  <span>Upscale 4x</span>
                  <span className="icon mt-1">🛠️</span>
                </button>
              </div>

            <button
              type="button"
              onClick={processTransaction}
              className={`button flex flex-col items-center justify-center py-2 ${
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
              <span className="icon mt-1">🎞️⛓️</span>
              </button>

              <Radio/>
              <CustomDeepChat/>

          </div>

          {/* "Your Creation" Section */}
          <div className={`creation-container ${isLoading ? 'glowing' : ''}`}>
          

              {error && <APIErrorPopup message={error} onClose={handleCloseError} />}

              <Swap
                orderTypes={["SWAP","LIMIT"]}
                defaultToken="9b426921a21f54600711da0be1a12b026703a9bd8eb9848d08c9d921434154534b59" //policyID + asset string
                colors={{"background":"#0E0F12","containers":"#191B23","subText":"#88919E","mainText":"#FFFFFF","buttonText":"#FFFFFF","accent":"#007DFF"}}
                theme="dark"
                width="450"
                partnerCode="catskyai61646472317179766566647937643264396477726e63616e74687772787861656d357a757474636332687839386568717a7672346c786c736330386e753970766630706865386d6778646776757465783678636474787176633868736563616e7164766a307674da39a3ee5e6b4b0d3255bfef95601890afd80709"
                partnerName="CatskyAI"
                displayType="WIDGET"
              />

              <div className="selected-image-container">
                {generatedImages.length > 0 && (
                  <>
                    {/* Title/Prompt Summary */}
                    <div className="tag5">
                      <span>{promptSummary}</span>
                    </div>
                    {/* Generated Image */} 
                    <img
                      src={generatedImages[selectedImageIndex]}
                      alt={`Selected Image ${selectedImageIndex + 1}`}
                      className="selected-image"
                      style={{ cursor: 'pointer' }}
                    />
                    {/* Prompt */}
                    <div className="tag5">
                      <span>Prompt: {generatedPrompt}</span>
                    </div>
                  </>
                )}
              </div>
                <div className="thumbnails-sidebar">
                  {!!generatedImages && generatedImages.length > 0 && [...generatedImages].reverse().map((imageUrl, imageIndex) => (
                    <div
                      key={`generated-image-${imageIndex}`}
                      className={`thumbnail ${generatedImages.length - 1 - imageIndex === selectedImageIndex ? 'selected' : ''}`}
                      onClick={() => setSelectedImageIndex(generatedImages.length - 1 - imageIndex)}
                      style={{ cursor: 'pointer' }}
                    >
                      <img
                        src={imageUrl}
                        alt={`Generated Image ${imageIndex + 1}`}
                        className="thumbnail-image"
                      />
                    </div>
                  ))}
                </div>
            </div>
      </div>
    </>
  );
};

export default Home;