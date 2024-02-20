import React, { useState, useEffect } from "react";
import type { NextPage } from "next";
import { useWallet } from '@meshsdk/react';
import { CardanoWallet } from '@meshsdk/react';
import { Transaction } from '@meshsdk/core';
import WalletBalance from '../components/WalletBalance';
import Spinner from '../components/Spinner'; // Import the spinner component
import SpinnerStyle from './styles/SpinnerStyle.module.css'
import logo from '../pages/styles/catsky-logo-white.png';
import adalogo from '../pages/styles/cardano-ada-logo.png'; // Adjust the path to where your logo is located
import { useTokenCheck } from '../hooks/TokenCheck'; // Import the custom hook
import ErrorPopup from '../components/ErrorPopup';
import { OpenAI } from "openai";
//import darkSynthAudio from '../darkSynthAudio.mp3';
export const openAI = new OpenAI({apiKey: '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', dangerouslyAllowBrowser: true});

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
  const [selectedSize, setSelectedSize] = useState("512x512");
  const [selectedQuality, setSelectedQuality] = useState("standard");
  const [isLoading, setIsLoading] = useState(false); // State to manage loading state
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  
  const darkSynthAudio = './darkSynthAudio.mp3'; // Adjust the path accordingly

  const [mintingPrice, setMintingPrice] = useState<number>(8); // Default to the initial price
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
    //const nInput = document.getElementById("n") as HTMLInputElement;

    const selectedModel = modelSelect.value;

    setSelectedModel(modelSelect.value);
    sizeSelect.innerHTML = "";
    qualitySelect.innerHTML = "";
  

    if (selectedModel === "dall-e-2") {
      const sizeOptions = ["256x256", "512x512", "1024x1024"];
      sizeOptions.forEach((optionValue) => {
        const option = document.createElement("option");
        option.value = optionValue;
        option.textContent = optionValue;
        sizeSelect.appendChild(option);
      });
      
      //Add for additional Image gens
      //nInput.removeAttribute("disabled");
      //nInput.max = "10";

      // For DALL·E-2, set quality to "standard"
      const qualityOption = document.createElement("option");
      qualityOption.value = "standard";
      qualityOption.textContent = "Standard";
      qualitySelect.appendChild(qualityOption);
    } else if (selectedModel === "dall-e-3") {
      const sizeOptions = ["1024x1024", "1024x1792", "1792x1024"];
      sizeOptions.forEach((optionValue) => {
        const option = document.createElement("option");
        option.value = optionValue;
        option.textContent = optionValue;
        sizeSelect.appendChild(option);
      });

      //nInput.setAttribute("disabled", "disabled");
      //nInput.value = "1";

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
  };

  const getRandomPrompt = async () => {
    try {
      const audio = new Audio("/darkSynthAudio.MP3");
      const playSound = () => {
        audio.play();
      };
      playSound();  
      const response = await openAI.chat.completions.create ({
        model: "gpt-3.5-turbo-0125",
        max_tokens: 70,
        temperature: 0.5,
        messages: [
          {"role": "system", "content": "You make random Dalle prompts that create incredible outputs and utilize dalle to its limits"},
          {"role": "system", "content": "Only include the prompt itself in the output. Ensure no text or quotes in the image. Max 70 tokens"},
          {"role": "system", "content": "Example prompt: a surreal cyberpunk cityscape with neon lights, flying cars, and towering skyscrapers reflecting a digital sunset"},
          {"role": "user", "content": "Make me a dalle prompt that is random and futuristic."}
        ]
      }, 
    );
      const randomPrompt = response.choices[0].message.content;
      console.log(response.choices[0].message.content);      
      if (randomPrompt !== null) {
        setPrompt(randomPrompt);
      }
    } catch (error) {
      console.error('Error generating random prompt:', error);
    }
  };

  const summarizePrompt = async() => {
    try{
      const response = await openAI.chat.completions.create({
        model:"gpt-3.5-turbo-0125",
        max_tokens: 50,
        temperature:0.5,
        messages:[
            {"role": "system", "content": "Summarize the given prompt into a short epic name."},
            {"role": "system", "content": "Only include the name itself in the output. Ensure no text or quotes in the image. Max 50 tokens"},
            {"role": "system", "content": "Example Name: Crystal World: Orbiting Alien Planet"},
            {"role": "user", "content": prompt}
        ]
      }
    );
      const summary= response.choices[0].message.content;
      console.log(response.choices[0].message.content)
      if (summary !== null) {
        setPromptSummary(summary);
      }
    } catch (error) {
      console.error('Error generating summarized prompt:', error);
    }
  };
  

  const generateImage = async () => {
    try {
      //const image_urls = []  
      const formData = new FormData();
      const modelSelect = document.getElementById("model") as HTMLSelectElement;
      const sizeSelect = document.getElementById("size") as HTMLSelectElement;
      const qualitySelect = document.getElementById("quality") as HTMLSelectElement;
      const nInput = document.getElementById("n") as HTMLInputElement;

      formData.append('prompt', prompt);
      formData.append('size', sizeSelect.value);
      formData.append('quality', qualitySelect.value);
      formData.append('model', modelSelect.value);
      //formData.append('n', nInput.value);

      console.log('Sending image generation request...');
          // Set loading state to true when generating image
      setIsLoading(true);

      const response = await openAI.images.generate({
        model: modelSelect.value,
        prompt: prompt,
        size: sizeSelect.value as "256x256" | "512x512" | "1024x1024" | "1792x1024" | "1024x1792",
        quality: qualitySelect.value as "standard" | "hd"
      });

      const image_urls: string[] = response.data.map(image_data => image_data.url ?? '');
      
      setGeneratedImages(image_urls);   

      setGeneratedPrompt(prompt);
        // Function to play sound when the button is clicked

      summarizePrompt();
      // For example, simulate image generation using setTimeout
      setTimeout(() => {
        // Set loading state to false when image generation is complete
        setIsLoading(false);
        // Perform additional actions after image generation
      });

      // Convert wallet metadata into chunks
      const walletMetadata = image_urls.join(','); 
      const chunks: string[] = [];
      for (let i = 0; i < walletMetadata.length; i += 64) {
        chunks.push(walletMetadata.substring(i, i + 64));
      } 
      setChunkedMetadata(chunks); 

      console.log('Chunked Image URL (1):', chunks);
      // Fetch the generated images after generating

      const pChunks: string[] = [];
      for (let i = 0; i < prompt.length; i += 64) {
        pChunks.push(prompt.substring(i, i + 64));
      }

      setChunkedPrompt(pChunks); // Assuming setChunkedPrompt is your state setter for the chunked prompt
      console.log("Chunked Prompt (1)", pChunks);

  } catch (error) {
    console.error('Failed to generate images:', error);
    setError('Not enough ADA!')
  }
  };

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

  const clearPrompt = () => {
    setPrompt('');
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


  return (
    <>

      
      <div className="header flex"> 
      <h1>Infinity Mint <span id="gradient-text">V1.0</span></h1>              
      <h1><span id="gradient-text">Powered by Catsky AI</span></h1>
      <a href="https://catsky.io/" rel="noopener noreferrer" style={{ cursor: 'pointer' }}>
          <img src={logo.src} alt="Logo" className="h-10" />
      </a>
      </div>
      
        <div className="flex">
          {/* Form Section */}
          <div className="form">
            <div className="pixelfont" style={{ zIndex: 1000 }}>
              <div className="flex"> {/* Add a flex container */}
                <CardanoWallet isDark={true} />
                <div>
                  <h1 className="widebutton gradient-text" onClick={toggleInfo}>Info:</h1>
                  {showInfo && (
                    <div className="widebutton">
                      <button onClick={toggleInfo}>Close</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="">
              {connected}
              <WalletBalance />
            </div>

            <form>

              <textarea
                className="textarea"
                name="prompt"
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onInput={autoExpand}

                placeholder="What will you create? Dream Infinite:"
                ></textarea>

              <button
                className="button animated-gradient"
                type="button"
                id="randomGenerate"
                onClick={() => { getRandomPrompt(); setPrompt(''); }} // Clear prompt area when "Generate Prompt" is clickex
              >
                Generate Prompt
              </button>
              
              <div/>
              <div className="tag2">
                <label htmlFor="model" className="tag">Model</label>
                <div className="dropdown-container">
                <select
                  className="field"
                  name="model"
                  id="model"
                  onChange={updateOptions}
                >
                  <option value="dall-e-2">DALL·E-2</option>
                  <option value="dall-e-3">DALL·E-3</option>
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
                  id="size">
                </select>
                </div>
              </div>
              <div>
                <div className="" onClick={toggleInfo}></div>
                  {showInfo && (
                    <div className="info-popup">
                      <p><span id="gradient-text"> Size:</span> The image size in Pixels X Pixels</p>
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
                className="button animated-gradient"
                disabled={!prompt.trim()|| isLoading} // Disable if prompt is empty or contains only whitespace
              >
              Generate Art
              </button>

              <button
                type="button"
                onClick={processTransaction}
                className={`button animated-gradient2 ${(!connected || isLoading || !generatedImages || generatedImages.length === 0) ? 'disabled-button' : ''}`}
                disabled={!connected || isLoading || !generatedImages || generatedImages.length === 0} // Disable button based on condition
              >
                Mint on Cardano: ${mintingPrice.toString()} ADA
                {error && <ErrorPopup message={error} />}
              </button>
              <div>
                <div className="" onClick={toggleInfo}></div>
                  {showInfo && (
                    <div className="info-popup">
                      <p><span id="gradient-text"> Discounts:</span> Hold $CATSKY for minting discounts!</p>
                      <p><span id="gradient-text"> 0.5 B    =</span> 7.69 ADA or 1 ADA or 11% Discount</p>
                      <p><span id="gradient-text"> 1.0 B    =</span> 6.69 ADA or 2 ADA or 22% Discount</p>
                      <p><span id="gradient-text"> 3.0 B    =</span> 5.69 ADA or 3 ADA or 34% Discount</p>
                      <p><span id="gradient-text"> 5.0 B    =</span> 4.69 ADA or 4 ADA or 46%s Discount</p>
                    </div>
                  )}
              </div>
            </form>
          </div>

          {/* "Your Creation" Section */}
          <div className="creation-container" >

            <label className="pixelfont2 mr-2 mb-4">{promptSummary}</label>
            {/* Loading spinner inside the "Creation Container" */}
            {isLoading && (

            <div className="spinner-container">
             <Spinner message="Generating your creation..." />
            </div>

            )}

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




