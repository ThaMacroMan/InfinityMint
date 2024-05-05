import React, { useState, useEffect } from "react";
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
import DownloadImage from '../components/DownloadImage';
import ImageSlideshow from '../components/ImageSlideshow';
import axios from "axios";
import TokenPrice from './api/CheckPrice';


import logo from '../pages/styles/catsky-logo-white.png'
import jpglogo from '../pages/styles/jpglogo.png'
import chartlogo from '../pages/styles/chartlogo.png'
import matrix from '../pages/public/images/matrix.png'
import square from '../pages/public/images/square.png'
import square2 from '../pages/public/images/square2.png'
import tall from '../pages/public/images/tall.png'
import wide from '../pages/public/images/wide.png'
import two from '../pages/public/images/two.png';
//import three from '../pages/public/images/three.png';
import four from '../pages/public/images/four.png';
import five from '../pages/public/images/five.png';
import six from '../pages/public/images/six.png';
import seven from '../pages/public/images/seven.png';
import eight from '../pages/public/images/eight.png';
import nine from '../pages/public/images/nine.png';
import ten from '../pages/public/images/ten.png';
import eleven from '../pages/public/images/eleven.png';
import twelve from '../pages/public/images/twelve.png';
import thirteen from '../pages/public/images/thirteen.png';
import fourteen from '../pages/public/images/fourteen.png';
import fifteen from '../pages/public/images/fifteen.png';
import sixteen from '../pages/public/images/sixteen.png';
import seventeen from '../pages/public/images/seventeen.png';
import eighteen from '../pages/public/images/eighteen.png';
import nineteen from '../pages/public/images/nineteen.png';
import twenty from '../pages/public/images/twenty.png';
import twentyone from '../pages/public/images/twentyone.png';
import twentytwo from '../pages/public/images/twentytwo.png';
import twentythree from '../pages/public/images/twentythree.png';
import twentyfour from '../pages/public/images/twentyfour.png';
import twentyfive from '../pages/public/images/twentyfive.png';
import { Span } from "next/dist/trace";


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
  const [selectedModel, setSelectedModel] = useState("dall-e-2");
  const [selectedSize, setSelectedSize] = useState("256x256");
  const [selectedQuality, setSelectedQuality] = useState("standard");
  const [isLoading, setIsLoading] = useState(false); // State to manage loading state
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [selectedStyle, setSelectedStyle] = useState<string>(''); // State to store the selected style
  const [slideshowDisabled, setSlideshowDisabled] = useState(false);
  const [mintingPrice, setMintingPrice] = useState<number>(8.69); // Default to the initial price
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [userEnterInfo, setUserEnterInfo] = useState('');
  const [userEnterName, setUserEnterName] = useState('');
  const [userUses, setUserUses] = useState<number>(1);
  const { catskyAssetSummary, hasMinRequiredTokens } = useTokenCheck();
  const catskyBalance = catskyAssetSummary["$CATSKY"] || 0;
  const catnipBalance = catskyAssetSummary["CatNip NFT"] || 0;
  const ognftBalance = catskyAssetSummary["OG NFT"] || 0;
  const inifinitymintsBalance = catskyAssetSummary["Era I"] || 0;
  const [catskyPerUse, setCatskyPerUse] = useState<number>(0);
  const [formattedPrice, setFormattedPrice] = useState<string>('');
/*
  const tokenDetails = {
    tokenUnit:'9b426921a21f54600711da0be1a12b026703a9bd8eb9848d08c9d921434154534b59',
    onchainID: '0be55d262b29f564998ff81efe21bdc0022621c12f15af08d0f2ddb1.76ab3fb1e92b7a58ee94b712d1c1bff0e24146e8e508aa0008443e1db1f2244e',
    interval: '1d',
    numIntervals: 1,
  };
*/


  
  
  
  const autoExpand = (event: React.ChangeEvent<HTMLTextAreaElement>) => {

    const textarea = event.target;
    textarea.style.height = 'inherit'; // Reset the height
    textarea.style.height = `${textarea.scrollHeight}px`; // Set to scrollHeight
  };
// Inside the updateOptions function
const updateOptions = () => {
  const modelSelect = document.getElementById("model") as HTMLSelectElement;
  const sizeSelect = document.getElementById("size") as HTMLSelectElement;
  const qualitySelect = document.getElementById("quality") as HTMLSelectElement;
  const selectedModel = modelSelect.value;

  sizeSelect.innerHTML = "";
  qualitySelect.innerHTML = "";

  if (selectedModel === "dall-e-2") {
    // Add size options for DALL·E-2
    const sizeOptions = [
      { value: "256x256", label: "Small" },
      { value: "512x512", label: "Medium" },
      { value: "1024x1024", label: "Large" },
    ];
    sizeOptions.forEach((optionData) => {
      const option = document.createElement("option");
      option.value = optionData.value;
      option.textContent = optionData.label;
      sizeSelect.appendChild(option);
    });

    const qualityOption = document.createElement("option");
    qualityOption.value = "standard";
    qualityOption.textContent = "Standard";
    qualitySelect.appendChild(qualityOption);
  } else if (selectedModel === "dall-e-3") {
    const sizeOptions = [
      { value: "1024x1024", label: "Square" },
    ];
    sizeOptions.forEach((optionData) => {
      const option = document.createElement("option");
      option.value = optionData.value;
      option.textContent = optionData.label;
      sizeSelect.appendChild(option);
    });

    // Always add a standard quality option for DALL·E-3
    const standardOption = document.createElement("option");
    standardOption.value = "standard";
    standardOption.textContent = "Standard";
    qualitySelect.appendChild(standardOption);

    // Add quality options for DALL·E-3 if user has CatNip
    if (catnipBalance >= 3 || ognftBalance >= 1 || inifinitymintsBalance >=10) {
      const landscapeOption = document.createElement("option");
      landscapeOption.value = "1792x1024";
      landscapeOption.textContent = "Landscape";
      sizeSelect.appendChild(landscapeOption);

      const portraitOption = document.createElement("option");
      portraitOption.value = "1024x1792";
      portraitOption.textContent = "Portrait";
      sizeSelect.appendChild(portraitOption);

      const standardOption = document.createElement("option");
      standardOption.value = "standard";
      standardOption.textContent = "Standard";
      qualitySelect.appendChild(standardOption);

      const hdOption = document.createElement("option");
      hdOption.value = "hd";
      hdOption.textContent = "HD";
      qualitySelect.appendChild(hdOption);
    } else {
      const disabledOption = document.createElement("option");
      disabledOption.value = "standard";
      disabledOption.textContent = "Select";
      sizeSelect.appendChild(disabledOption);

      // Quality options are disabled if CatNip is not available
      qualitySelect.disabled = true;
    }
  }
  // Update size and quality based on the new selections
  setSelectedSize(sizeSelect.value);
  setSelectedQuality(qualitySelect.value);
  setSelectedModel(modelSelect.value);
};
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
  const generateImage = async () => {
    setUserEnterName('');
    setModalVisible(false)
    setSlideshowDisabled(true); // Disable the slideshow when generating image
    try {
      setIsLoading(true); // Set loading state to true when generating image
      console.log(selectedModel,selectedModel,selectedQuality);
      const response = await fetch('/api/generateImage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `${prompt} In Style: '${selectedStyle}'`, // Include the selected style in the prompt
          size: selectedSize,
          quality: selectedQuality,
          model: selectedModel,
        }),
      });
      console.log(selectedStyle);
      console.log(prompt);
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

      setUserUses((userUses) => userUses - 1); // Update the userUses state

      // Check if a user is connected
      if (connected) {
        // Save updated user uses to local storage
        const userWalletAddress = await fetchUsedAddresses();
        const updatedUses = userUses - 1;
        localStorage.setItem(userWalletAddress, updatedUses.toString());
      } else {
        // If no user is connected, check if the AI has already been tried
        const alreadyTriedAI = localStorage.getItem('alreadyTriedAI');
        if (!alreadyTriedAI) {
          // Subtract one usage and set the flag if the AI hasn't been tried before
          setUserUses((userUses) => userUses - 1); // Update the userUses state
          localStorage.setItem('userUses', (userUses - 1).toString());
          localStorage.setItem('alreadyTriedAI', 'true');
        }
      }
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
  const handleStyleSelection = (style: string) => {
    setSelectedStyle(style);
  };
  

  useEffect(() => {
    if (connected) {
      console.log("$CATSKY", catskyBalance); 
      console.log("CatNip", catnipBalance);
      console.log("OG-NFT", ognftBalance);
      console.log("Era I", inifinitymintsBalance);
  
      async function fetchUsedAddresses() {
        try {
          const usedAddresses = await wallet.getUsedAddresses();
          console.log("User Addresses: ", usedAddresses[0]);
          // Retrieve available uses for the user from local storage
          const storedUses = localStorage.getItem(usedAddresses[0]);
          if (storedUses) {
            const parsedUses = parseInt(storedUses, 10);
            setUserUses(parsedUses);
            console.log('User Uses:', parsedUses); // Log the userUses value
          }
        } catch (error) {
          console.error("Error fetching used addresses: ", error);
        }
      }
      fetchUsedAddresses(); // Call the async function to execute
    } else {
      // Reset user uses when wallet is disconnected
      setUserUses(1); // Set the initial value for user uses
      // Clear user uses from local storage
      localStorage.removeItem('userWalletAddress');
    }
  }, [connected, catskyBalance]); // Include catskyBalance as a dependency
  

  
  // Callback function to set catskyPerUse value
  const handleSetCatskyPerUse = (catskyPerUse: number, formattedPrice: string) => {
    setCatskyPerUse(catskyPerUse);
    setFormattedPrice(formattedPrice);
    console.log("Catsky Per Use: ", catskyPerUse)
    console.log("Catsky Price: ₳", formattedPrice)
    console.log("User Uses: ", userUses)
  };

  const buyUsesTransaction = async () => {

        // Store user wallet address and available uses in local storage
        const userWalletAddress = await fetchUsedAddresses();
        const updatedUses = userUses + 5;
        localStorage.setItem(userWalletAddress, updatedUses.toString());

    try {

      const tx = new Transaction({ initiator: wallet }).sendAssets(
        'addr1qyvefdy7d2d9dwrncanthwrxxaem5zuttcc2hx98ehqzvr4lxlsc08nu9pvf0phe8mgxdgvutex6xcdtxqvc8hsecanqdvj0vt',
        [
          {
            unit: '9b426921a21f54600711da0be1a12b026703a9bd8eb9848d08c9d921434154534b59',
            quantity: catskyPerUse.toString()
            ,
          },
        ]
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
  
      // Fetch the user's wallet address
      const userWalletAddress = await fetchUsedAddresses();
  
      // Credit the user with usage
      await creditUserWithUsage(userWalletAddress);
    } catch (error) {
      setError('You do not have enough ADA or the transaction was cancelled');
      console.error('Error processing transaction:', error);
    }
  };
  
  const fetchUsedAddresses = async () => {
    try {
      const usedAddresses = await wallet.getUsedAddresses();
      // Assuming the first address is the user's wallet address
      return usedAddresses[0];
    } catch (error) {
      console.error("Error fetching used addresses: ", error);
      throw error;
    }
  };
  
  const creditUserWithUsage = async (userWalletAddress: string) => {
    try {
      setUserUses((userUses) => userUses + 5); // Update the userUses state
      
      console.log(`User ${userWalletAddress} credited with 5 AI usages.`);
    } catch (error) {
      console.error('Error crediting user with usage:', error);
      // Handle the error as needed
    }
  }; 


  
    // Function to calculate the minting price based on CATSKY token holdings
    const calculateMintingPrice = (catskyBalance: number) => {
      if (catskyBalance >= 5000000000) {
        return 4690000; // 5 billion CATSKY tokens
      } else if (catskyBalance >= 3000000000) {
        return 5690000; // 3 billion CATSKY tokens
      } else if (catskyBalance >= 1000000000) {
        return 6690000; // 1 billion CATSKY tokens
      } else if (catskyBalance >= 500000000) {
        return 7690000; // 500M CATSKY tokens
      } else {
        return 8690000; // Default initial price when no CATSKY tokens are held
      }
    };

    const processTransaction = async () => {
      const price = calculateMintingPrice(catskyBalance);
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

 

  useEffect(() => {
    updateOptions();
  }, []);

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
   const uploadimgbb3 = async (image_file: any) => {
    let body = new FormData();
    body.set("key", "8072702f1c133271b4c484307bff7822") //// DO NOT RELEASE THE KEY
    body.append("image", image_file);
 
    //return
    const response = await axios({
      method: "post",
      url: "https://api.imgbb.com/1/upload",
      data: body,
    });
    return response;
  };
  
   const [uploadedImage, setUploadedImage] = useState<string | null>(null);
   const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.files?.length === 1) {
      const image_file = event.target.files[0];
      try {
        const res = await uploadimgbb3(image_file);
        console.log(res);
        const image_data = res.data.data;
        const image_url = image_data.url;
        setUploadedImage(image_url);

        //setUserEnterName(image_data.image.name)
        setPromptSummary(image_data.image.name)
        setUserEnterInfo("Minted by the Infinity Mint")
        setSelectedModel("User Uploaded")
        setSelectedQuality("Uploaded Image")
        setChunkedPrompt(["No Prompt"])
        const model_size = `${image_data.width}x${image_data.height}`;
        setSelectedSize(model_size);

        const chunkedMetadata = chunkData(image_url, 64);
        setChunkedMetadata(chunkedMetadata);

        setGeneratedImages([]);

        setSlideshowDisabled(true);
  
        // Show the metadata update modal after uploading the image
        setModalVisible(true);
      } catch (error) {
        // Handle error
        console.error('Error uploading image:', error);
      }
    }
  };
   const [modalVisible, setModalVisible] = useState(false);
   const handleMetadataUpdate = () => {
    // Handle metadata update logic here
    // Close modal after updating metadata
    setModalVisible(false);
  };

  return (
    <>
      <div className="header flex"> 
        <h1>
          Infinity Mint <span id="gradient-text">V1.0</span>
        </h1>   
        <h1>
          <span id="gradient-text">Powered by Catsky AI</span>
        </h1>
        <a 
          href="https://catsky.io/" 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ cursor: 'pointer' }}
        >
          <img src={logo.src} alt="Logo" className="h-10" />
        </a>
        <a 
          href="https://www.jpg.store/collection/infinitymintwildcatgenesisera?tab=items" 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ cursor: 'pointer' }}
        >
          <img src={jpglogo.src} alt="Logo" className="h-10" />
        </a>
        <a 
          href="https://www.taptools.io/charts/token?pairID=0be55d262b29f564998ff81efe21bdc0022621c12f15af08d0f2ddb1.76ab3fb1e92b7a58ee94b712d1c1bff0e24146e8e508aa0008443e1db1f2244e" 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ cursor: 'pointer' }}
        >
          <p style={{ color: 'green' }}>$CATSKY Price: ₳ {formattedPrice}</p>

        </a>
      </div>
      <div className="wrapper">
        {/* Form Section */}
        <div className="form">
          <div className="pixelfont" style={{ zIndex: 1000 }}>
            
            <div className="flex tag"> 
              <CardanoWallet isDark={true} {...{className: "wallet"}} />
              <div>
                <h1 className="infobutton" onClick={toggleInfo}>More Info</h1>
                {showInfo}
              </div>
            </div>
          </div>
            <div className="">
              {connected}
              <WalletBalance />
            </div>
            
            <div>
            <TokenPrice
            tokenUnit="9b426921a21f54600711da0be1a12b026703a9bd8eb9848d08c9d921434154534b59"
            onchainID="be55d262b29f564998ff81efe21bdc0022621c12f15af08d0f2ddb1.76ab3fb1e92b7a58ee94b712d1c1bff0e24146e8e508aa0008443e1db1f2244e"
            interval="1d"
            numIntervals={1}
            setCatskyPerUse={handleSetCatskyPerUse} // Pass the callback function as prop
            />


            </div>
            <button
              type="button"
              onClick={buyUsesTransaction}
              className={`button2 animated-gradient2 ${
                !connected ||
                isLoading ||
                (!generatedImages && !uploadedImage) ||
                (generatedImages.length === 0 && !uploadedImage)
                  ? "disabled-button"
                  : ""
              }`}
            >
               <span id="gradient-text">
                Available Uses: {userUses.toLocaleString()} 
              </span>

              <span id="gradient-text">
              Buy 5 AI Uses: {catskyPerUse} $CATSKY 
              </span>
              </button>
              

            <form>
              <textarea
                className="textarea"
                name="prompt"
                id="prompt"
                value={prompt}
                rows={6}
                onChange={(e) => setPrompt(e.target.value)}
                onInput={autoExpand}
                placeholder="What will you create? Dream Infinite: "
                ></textarea>
              <button
                className="button animated-gradient"
                type="button"
                id="randomGenerate"
                disabled={isLoading} // Disable the button when loading
                onClick={() => { getRandomPrompt(); setPrompt(''); }} // Clear prompt area when "Generate Prompt" is clickex
              >
               <span id="gradient-text"> Generate Prompt</span>
              </button>
              <div/>
              <div className="tag2">
              <label htmlFor="model" className="tag">Style</label>
              <div className="dropdown-container">
                <select 
                className="field"
                name="style"
                id="style" 
                onChange={(e) => handleStyleSelection(e.target.value)}>
                <option value="">Select</option>
                  <option value="Surrealism">Surrealism</option>
                  <option value="Renaissance">Renaissance</option>
                  <option value="Impressionism">Impressionism</option>
                  <option value="Cubism">Cubism</option>
                  <option value="Minimalism">Minimalism</option>
                  <option value="Pop art">Pop art</option>
                  <option value="Abstract">Abstract</option>
                  <option value="Art Deco">Art Deco</option>
                  <option value="Contemporary">Contemporary</option>
                  <option value="Digital art">Digital art</option>
                  <option value="Graffiti">Graffiti</option>
                  <option value="Light painting">Light painting</option>
                  <option value="Futurism">Futurism</option>
                </select>
              </div>
            </div>
              <div className="tag2">
                <label htmlFor="model" className="tag">Model</label>
                <div className="dropdown-container">
                <select
                  className="field"
                  name="model"
                  id="model"
                  onChange={updateOptions}
                >
                  <option value="dall-e-2">Regular</option>
                  {connected && catskyBalance >= 100000000 && (
                  <option value="dall-e-3">Upgraded</option>
                  )}
                </select>
                </div>
              </div>

              <div>
                <div className="" onClick={toggleInfo}></div>
                  {showInfo && (
                    <div className="info-popup">
                      <p><span id="gradient-text"> Models:</span> Dalle 2 and 3 are the current OpenAI Image Genearation Models. Dalle3 is significantly better, but slower</p>
                    </div>
                  )}
              </div>
              <div className="tag2">
                <label htmlFor="size" className="tag">Size</label>
                <div className="dropdown-container">
                <select className="field" 
                  name="size" 
                  id="size"
                  onChange={(e) => setSelectedSize(e.target.value)} // Add this line
                  >
                </select>
                </div>
              </div>
              <div>
                <div className="" onClick={toggleInfo}></div>
                  {showInfo && (
                    <div className="info-popup">
                      <p><span id="gradient-text"> Small = </span> 256x256</p>
                      <p><span id="gradient-text"> Medium =</span> 512x512</p>
                      <p><span id="gradient-text"> Large = </span> 1024x1024</p>
                      <p><span id="gradient-text"> Square = </span> 1024x1024</p>
                      <p><span id="gradient-text"> Landscape = </span> 1792x1024</p>
                      <p><span id="gradient-text"> Portrait = </span> 1024x1792</p>
                    </div>
                  )}
              </div>
              <div className="tag2">
                <label htmlFor="quality" className="tag">Quality</label>
                <div className="dropdown-container">
                <select className="field" 
                  name="quality" 
                  id="quality"
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
                      <p><span id="gradient-text"> Qualtiy:</span> Dalle 3 has 2 quality options to try</p>
                    </div>
                  )}
              </div>

              <button
              type="button"
              onClick={generateImage}
              className={`button animated-gradient ${
                isLoading  || !connected || !prompt.trim() || userUses === 0 ? 'disabled-button' : ''
              }`}
              disabled={isLoading || !connected || !prompt.trim() || userUses === 0} // Disable the button if loading, balance is insufficient, not connected, no prompt text, or no usage available
            >
              <span id="gradient-text">Generate Art</span>
            </button>


            <div className="Upload">
              <label
                htmlFor="upload_button"
                className={`button animated-gradient`}
              >
                <span id="gradient-text">{process.env.TOTO}Upload Image</span>
              </label>
              <input
                className={`button animated-gradient`}
                type="file"
                onChange={handleChange}
                accept=".jpg,.jpeg,.png"
                id="upload_button"
                style={{ visibility: "hidden" }}
              />
            </div>
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
              Mint on Cardano: ₳ {mintingPrice.toString()}
              </button>
              
              <div>
                <div className="" onClick={toggleInfo}></div>
                  {showInfo && (
                    <div className="info-popup">
                      <p><span id="gradient-texts"></span> Hold $CATSKY when minting!</p>
                      <br></br>
                      <p><span id="gradient-text"> 0.5 B = ₳ 1 ADA</span> an 11% Discount</p>
                      <p><span id="gradient-text"> 1.0 B = ₳ 2 ADA</span> an 22% Discount!</p>
                      <p><span id="gradient-text"> 3.0 B = ₳ 3 ADA</span> an 34% Discount!!</p>
                      <p><span id="gradient-text"> 5.0 B = ₳ 4 ADA</span> an 46% Discount!!!</p>
                    </div>
                  )}
              </div>
            </form>
          </div>
          {/* "Your Creation" Section */}
          <div className="creation-container" > 
          {!slideshowDisabled && 
            <ImageSlideshow 
            images={[
              two, four, five, six, seven, eight, nine, ten,
              eleven, twelve, thirteen, fourteen, fifteen, sixteen, seventeen, eighteen, nineteen, twenty,
              twentyone, twentytwo, twentythree, twentyfour, twentyfive,
              square, square2, wide, tall, matrix
            ]}  
              disabled={false} 
            />
          }
            <label className="pixelfont2 " id="gradient-text"> {userEnterName || promptSummary}</label>
            {error && <APIErrorPopup message={error} onClose={() => setError('')} />}
            {isLoading && (
            <div className="spinner-container">
             <Spinner message="Generating your creation..." />
            </div>
            )}
              <Swap
                orderTypes={["SWAP","LIMIT"]}
                defaultToken="9b426921a21f54600711da0be1a12b026703a9bd8eb9848d08c9d921434154534b59"
                colors={{"background":"#0E0F12","containers":"#191B23","subText":"#88919E","mainText":"#FFFFFF","buttonText":"#FFFFFF","accent":"#007DFF"}}
                theme="dark"
                width="450"
                partnerCode="catskyai61646472317179766566647937643264396477726e63616e74687772787861656d357a757474636332687839386568717a7672346c786c736330386e753970766630706865386d6778646776757465783678636474787176633868736563616e7164766a307674da39a3ee5e6b4b0d3255bfef95601890afd80709"
                partnerName="CatskyAI"
                displayType="WIDGET"
              />
            {!!generatedImages && generatedImages.length > 0 && (
              <div>
                {generatedImages.map((imageUrl, imageIndex) => (
                  <div key={`generated-image-${imageIndex}`}>
                    <img
                      src={imageUrl}
                      alt={`Generated Image ${imageIndex + 1}`}
                      className="mx-auto mt-4 mb-4 imageborder"
                      onClick={() => saveImage(imageUrl)}
                    />
                    <div className="button animated-gradient3 mx-auto">
                      <DownloadImage imageUrl={imageUrl} />
                    </div>
                    <div className="tag3">
                      <div className="tag">Model: {selectedModel}</div>
                      <div className="tag">Size: {selectedSize}</div>
                      <div className="tag">Quality: {selectedQuality}</div>
                    </div>
                                {/* Prompt */}
                  <div className="tag3">
                    <div className="tag">Prompt: {generatedPrompt}</div>
                  </div>
                </div>
                ))}
              </div>
            )}
            {uploadedImage && (
            <div>
              <div key={`uploaded-image`}>
                <img
                  src={uploadedImage}
                  alt={`Uploaded Image`}
                  className="mx-auto mt-4 mb-4 imageborder"
                  onClick={() => saveImage(uploadedImage)}
                />
              </div>
              {/* Form for metadata */}

            </div>
          )}
          </div>
      </div>
    </>
    );
  }
export default Home;