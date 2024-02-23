import React, { useState, useEffect } from "react";
import type { NextPage } from "next";
import { useWallet } from '@meshsdk/react';
import { CardanoWallet } from '@meshsdk/react';
import { Transaction } from '@meshsdk/core';

import '@dexhunterio/swaps/lib/assets/style.css'
import Swap from '@dexhunterio/swaps'




import { useTokenCheck } from '../hooks/TokenCheck'; 

import WalletBalance from '../components/WalletBalance';
import Spinner from '../components/Spinner'; 
import ErrorPopup from '../components/ErrorPopup';
import DownloadImage from '../components/DownloadImage';


import logo from '../pages/styles/catsky-logo-white.png';
import jpglogo from '../pages/styles/jpglogo.png'
import tokenlogo from '../pages/styles/tokenlogo.png'
import chartlogo from '../pages/styles/chartlogo.png'

//import darkSynthAudio from '../darkSynthAudio.mp3';


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




  //const GENERATIONS_MADE_KEY = "generationsMade";

  //const [generationsAllowed, setGenerationsAllowed] = useState<number>(0);
  //const [generationsMade, setGenerationsMade] = useState<number>(0);
  const CATSKY_PER_GENERATION = 1000;





  //const darkSynthAudio = './darkSynthAudio.mp3'; // Adjust the path accordingly

  const [mintingPrice, setMintingPrice] = useState<number>(8.69); // Default to the initial price
  // Call the custom hook to get the data
  const { catskyAssetSummary, hasMinRequiredTokens } = useTokenCheck();
  
  const catskyBalance = catskyAssetSummary["$CATSKY"] || 0;

  const [showInfo, setShowInfo] = useState<boolean>(false);


  const autoExpand = (event: React.ChangeEvent<HTMLTextAreaElement>) => {

    const textarea = event.target;
    textarea.style.height = 'inherit'; // Reset the height
    textarea.style.height = `${textarea.scrollHeight}px`; // Set to scrollHeight
  };
  
  
  const updateOptions = () => {
    const modelSelect = document.getElementById("model") as HTMLSelectElement;
    const sizeSelect = document.getElementById("size") as HTMLSelectElement;
    const qualitySelect = document.getElementById("quality") as HTMLSelectElement;
    const selectedModel = modelSelect.value;
  
    sizeSelect.innerHTML = "";
    qualitySelect.innerHTML = "";
  
    if (selectedModel === "dall-e-2") {
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
  
      // For DALL·E-2, set quality to "standard"
      const qualityOption = document.createElement("option");
      qualityOption.value = "standard";
      qualityOption.textContent = "Standard";
      qualitySelect.appendChild(qualityOption);
    } else if (selectedModel === "dall-e-3") {
      const sizeOptions = [
        { value: "1024x1024", label: "Square" },
        { value: "1792x1024", label: "Landscape" },
        { value: "1024x1792", label: "Portrait" },
      ];
      sizeOptions.forEach((optionData) => {
        const option = document.createElement("option");
        option.value = optionData.value;
        option.textContent = optionData.label;
        sizeSelect.appendChild(option);
      });
  
      // For DALL·E-3, set quality options to both "standard" and "high"
      const standardOption = document.createElement("option");
      standardOption.value = "standard";
      standardOption.textContent = "Standard";
      qualitySelect.appendChild(standardOption);
  
      const highOption = document.createElement("option");
      highOption.value = "hd";
      highOption.textContent = "HD";
      qualitySelect.appendChild(highOption);
    }
  
    // Update size and quality based on the new selections
    setSelectedSize(sizeSelect.value);
    setSelectedQuality(qualitySelect.value);
    setSelectedModel(modelSelect.value);
  };
  

  const getRandomPrompt = async () => {
    try {
      setIsLoading(true); // Set loading state to true
      //const audio = new Audio("/darkSynthAudio.MP3");
      //audio.play();
  
      // Call your internal API endpoint instead of OpenAI's API directly
      const response = await fetch('/api/getRandomPrompt');
  
      if (!response.ok) {
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
  //  if (generationsMade < generationsAllowed) {
  //    setGenerationsMade(prevGenerationsMade => prevGenerationsMade + 1);
  //    if (typeof window !== 'undefined') {
  //      localStorage.setItem(GENERATIONS_MADE_KEY, (generationsMade + 1).toString());
  //    }
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      const imageUrls = data.imageUrls;
      
      setGeneratedImages(imageUrls);
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
  
    } catch (error) {
      console.error('Failed to generate images:', error);
      setError('An error occurred while generating images');
      setIsLoading(false); // Ensure loading state is reset even on error
    }
//  }
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
  
/*
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedGenerationsMade = localStorage.getItem(GENERATIONS_MADE_KEY);
      const generationsMadeFromStorage = storedGenerationsMade ? parseInt(storedGenerationsMade, 10) : 0;
      setGenerationsMade(generationsMadeFromStorage);
    }
  }, []);

  useEffect(() => {
    if (catskyBalance >= CATSKY_PER_GENERATION) {
      const generations = Math.floor(catskyBalance / CATSKY_PER_GENERATION);
      setGenerationsAllowed(generations);
    } else {
      setGenerationsAllowed(0);
    }
  }, [catskyBalance]);
  */
  useEffect(() => {
    console.log(catskyBalance);
    const calculatedMintingPrice = calculateMintingPrice(catskyBalance);
    const firstDigitMintingPrice = calculatedMintingPrice / 1000000; // Extracting the first digit
    setMintingPrice(firstDigitMintingPrice);
  }, [catskyBalance]);

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
      console.log('mint price:', price);
      console.log('Chunked image URL (2):', chunkedMetadata )
      console.log('Chunked Prompt (2):', chunkedPrompt);

      const tx = new Transaction({ initiator: wallet })
      .sendLovelace(
        'addr1vxufv40n45m0x7du3kk305trmsvclgdnw3ly2lxq2gkqxqga696du',
        
        price.toString()
      );
        // Assuming this code block is within a JSX context
        // Define the type of metadataObj
        type MetadataObject = {
          URLs: string[];
          Prompt: string[];
          [key: string]: string[]; // Allow additional properties with string array values
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
        setError(' Not enough ADA!')
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
          <img src={chartlogo.src} alt="Logo" className="h-10" />

        </a>
      </div>
      <div className="wrapper">
        {/* Form Section */}
        <div className="form">
          <div className="pixelfont" style={{ zIndex: 1000 }}>
            
            <div className="flex tag2"> 
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
            <div className= "tag">

            Hold 100M $CATSKY to Generate

              </div>

            <form>

              <textarea
                className="textarea"
                name="prompt"
                id="prompt"
                value={prompt}
                rows={6}
                onChange={(e) => setPrompt(e.target.value)}
                onInput={autoExpand}

                placeholder="What will you create? Dream Infinite:"
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
              {/*
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
            */}
              <div className="tag2">
                <label htmlFor="model" className="tag">Model</label>
                <div className="dropdown-container">
                <select
                  className="field"
                  name="model"
                  id="model"
                  onChange={updateOptions}
                >
                  <option value="dall-e-3">DALL·E-3</option>
                  <option value="dall-e-2">DALL·E-2</option>
                  
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
            !connected || isLoading ||  catskyBalance < 100000000
                ? 'disabled-button'
                : ''
                }`}
            disabled={!connected || isLoading  || catskyBalance < 100000000}
            >
            Generate Art 

            </button>

              <button
                type="button"
                onClick={processTransaction}
                className={`button animated-gradient2 ${(!connected || isLoading || !generatedImages || generatedImages.length === 0) ? 'disabled-button' : ''}`}
                disabled={!connected || isLoading || !generatedImages || generatedImages.length === 0} // Disable button based on condition
              >
                Mint on Cardano: ₳ {mintingPrice.toString()} 
                {error && <ErrorPopup message={error} />}
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

            <label className="prompt-summary pixelfont2 " id="gradient-text">{promptSummary}</label>
            <br>  
            </br>
            <br>  
            </br>
            <br>  
            </br>


            {/* Loading spinner inside the "Creation Container" */}
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
                      className="mx-auto imageborder"
                      onClick={() => saveImage(imageUrl)}
                    />
                    <div className="button animated-gradient3 mx-auto">
                      <DownloadImage imageUrl={imageUrl} />
                    </div>
                    <div className="tag3">
                      <div className="tag">Model: {selectedModel}</div>
                      <div className="tag">Size: {selectedSize}</div>
                      <div className="tag">Quality: {selectedQuality}</div>
                      {/* Add more tags as needed */}
                    </div>
                                {/* Prompt */}
                  <div className="tag3">
                    <div className="tag">Prompt: {generatedPrompt}</div>
                  </div>

                </div>
                  
                ))}
              </div>
            )}
          </div>
      </div>
    </>
    );
  }
export default Home;



