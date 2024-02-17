import React, { useState, useEffect } from "react";
import type { NextPage } from "next";
import { useWallet } from '@meshsdk/react';
import { CardanoWallet } from '@meshsdk/react';
import axios from 'axios';
import { Transaction } from '@meshsdk/core';
import WalletBalance from '../components/WalletBalance';
import Spinner from '../components/Spinner'; // Import the spinner component
import logo from '../pages/styles/catsky-logo.png'; // Adjust the path to where your logo is located
import { useTokenCheck } from '../hooks/TokenCheck'; // Import the custom hook




const Home: NextPage = () => {
  const { connected, wallet } = useWallet(); 
  const [unsignedTx, setUnsignedTx] = useState<any>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [promptSummary, setPromptSummary] = useState<string>('');
  const [chunkedPrompt, setChunkedPrompt] = useState<string[]>([]);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>(''); // State variable to store the generated prompt

  const [chunkedMetadata, setChunkedMetadata] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState("dall-e-2");
  const [selectedSize, setSelectedSize] = useState("512x512");
  const [selectedQuality, setSelectedQuality] = useState("standard");
  const [isLoading, setIsLoading] = useState(false); // State to manage loading state
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const [mintingPrice, setMintingPrice] = useState<number>(8); // Default to the initial price
  // Call the custom hook to get the data
  const { catskyAssetSummary, hasMinRequiredTokens } = useTokenCheck();
  
  
  const catskyBalance = catskyAssetSummary["$CATSKY"] || 0;




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
      const response = await axios.get('http://localhost:5001/generate-random-prompt');
      const randomPrompt = response.data;
      console.log('Random prompt UnChunked:', randomPrompt);

      setPrompt(randomPrompt); // Update the prompt state
    } catch (error) {
      console.error('Error fetching random prompt:', error);
    }
  };

  const generateImage = async () => {
    try {
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
      const response = await axios.post('http://localhost:5001/dalle3_api', formData);

      if (response.status === 200) {
        console.log('Images generated:', response.data.image_urls);
        console.log('summarized Prompt:', response.data.summarized_prompt)
        
        setGeneratedPrompt(prompt);

        //const [promptSummary, setPromptSummary] = useState<string>("");
        setPromptSummary(response.data.summarized_prompt)

        // Set the generated images in state
        setGeneratedImages(response.data.image_urls);
        // For example, simulate image generation using setTimeout
        setTimeout(() => {
          // Set loading state to false when image generation is complete
          setIsLoading(false);
          // Perform additional actions after image generation
        });
        // Convert wallet metadata into chunks
        const walletMetadata = response.data.image_urls.join(','); // Replace this with your actual wallet metadata string
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

      } else {
        console.error('Failed to generate images:', response.data.error);
      }
    } catch (error) {
      console.error('Error generating images:', error);
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
      if (catskyBalance >= 10000000000) {
        return 3000000; // 10 billion CATSKY tokens
      } else if (catskyBalance >= 7000000000) {
        return 4000000; // 7 billion CATSKY tokens
      } else if (catskyBalance >= 5000000000) {
        return 5000000; // 5 billion CATSKY tokens
      } else if (catskyBalance >= 3000000000) {
        return 6000000; // 3 billion CATSKY tokens
      } else if (catskyBalance >= 1000000000) {
        return 7000000; // 1 billion CATSKY tokens
      } else {
        return 8000000; // Default initial price when no CATSKY tokens are held
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


  return (
    <>
      <div className="small" style={{
        position: 'fixed',
        left: `${cursorPos.x}px`,
        top: `${cursorPos.y}px`,
        zIndex: 9999,
        pointerEvents: 'none', // Ensures the cursor doesn't interfere with other mouse events
        // Add more styles for your small cursor here
      }} />
      <div className="big" style={{
        position: 'fixed',
        left: `${cursorPos.x}px`,
        top: `${cursorPos.y}px`,
        zIndex: 9998,
        pointerEvents: 'none',
        // Add more styles for your big cursor here
      }} />
      <div className="pixeltext">
        <div className="flex-container" >
      <h1 className="header ml-6">Infinity Mint <span id="gradient-text">V1.0</span></h1>              
      <h3 className="header"><span id="gradient-text">Powered by Catsky AI</span></h3>
      <a href="https://catsky.io/" target="_blank" rel="noopener noreferrer" style={{ cursor: 'pointer' }}>
                  <img src={logo.src} alt="Logo" className="h-8 mr-2" />
                </a>
      </div>
        <div className="flex">
          {/* Form Section */}
          <div className="form">
            <div className="header " style={{ position: 'relative', zIndex: 1000 }}>
              <div style={{ position: 'relative', zIndex: 1000 }}>
                <CardanoWallet isDark={true}  />
              </div>

            </div>
            <div className="header">
              {connected}
              <WalletBalance />
            </div>

            <form className="flex flex-col">

              <textarea
                className="textarea"
                name="prompt"
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onInput={autoExpand}
                rows={3}
                placeholder="What will you create? Write it here:"
              ></textarea>


              <button
                className="button bold-text animated-gradient"
                type="button"
                id="randomGenerate"
                onClick={() => { getRandomPrompt(); setPrompt(''); }} // Clear prompt area when "Generate Prompt" is clicked


              >
                Generate Prompt
              </button>

              <div className="flex tag2">
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

              <div className="flex tag2">
                <label htmlFor="size" className="tag">Size</label>
                <div className="dropdown-container">
                <select className="field" 
                  name="size" 
                  id="size">
                </select>
                </div>
              </div>

              <div className=" flex tag2">
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

              <button
                type="button"
                onClick={generateImage}
                className="button bold-text animated-gradient"
                disabled={!prompt.trim()|| isLoading} // Disable if prompt is empty or contains only whitespace

              >
              Generate Art
              </button>

              <button
                type="button"
                onClick={processTransaction}
                className={`button bold-text animated-gradient2 pixeltext ${(!connected || isLoading || !generatedImages || generatedImages.length === 0) ? 'disabled-button' : ''}`}
                disabled={!connected || isLoading || !generatedImages || generatedImages.length === 0} // Disable button based on conditions

              >
                Mint on Cardano: $ {mintingPrice.toString()} ADA
              </button>
            </form>
          </div>

          {/* "Your Creation" Section */}
          
          <div className="creation-container" >
            <label className="tag3 animated-gradient2">{promptSummary}</label>
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
                    <div className="info-container">
                      {/* AI Model tag */}
                      <div className="tag">
                        <p>Model: {selectedModel}</p>
                      </div>
                      {/* Image Size tag */}
                      <div className="tag">
                        <p>Size: {selectedSize}</p>
                      </div>
                      {/* Image Quality tag */}
                      <div className="tag">
                        <p>Quality: {selectedQuality}</p>
                      </div>
                                  {/* Prompt summary */}
                    </div>
                              {/* Prompt */}
              <div className="prompt-box">
                <p>{generatedPrompt}</p>
              </div>
                  </div>
                  
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

   </>
    );
  }
export default Home;




