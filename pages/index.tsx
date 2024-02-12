import React, { useState, useEffect } from "react";
import type { NextPage } from "next";
import { useWallet } from '@meshsdk/react';
import { CardanoWallet } from '@meshsdk/react';
import axios from 'axios';
import { Transaction } from '@meshsdk/core';

import Spinner from '../components/Spinner'; // Import the spinner component

const Home: NextPage = () => {
  const { connected, wallet } = useWallet(); 
  const [unsignedTx, setUnsignedTx] = useState<any>(null);
  const [assets, setAssets] = useState<null | any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("");
  const [chunkedPrompt, setChunkedPrompt] = useState<string[]>([]);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [chunkedMetadata, setChunkedMetadata] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState("dall-e-2");
  const [selectedSize, setSelectedSize] = useState("256x256");
  const [selectedQuality, setSelectedQuality] = useState("standard");
  const [isLoading, setIsLoading] = useState(false); // State to manage loading state
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });


  // Update these states in the `updateOptions` and corresponding onChange handlers


  const autoExpand = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = 'textarea.scrollHeight' + 'px';
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
        // Clear the existing prompt in the textarea
        const promptTextarea = document.getElementById("prompt") as HTMLTextAreaElement;
        promptTextarea.value = "";

        const response = await axios.get('http://localhost:5001/generate-random-prompt');

        // Assuming the response contains the random prompt as a JSON object
        const randomPrompt = response.data;
        console.log('Random prompt UnChunked:', randomPrompt);

        // Set the new generated prompt
        setPrompt(randomPrompt);
        promptTextarea.value = randomPrompt; // Fill the textarea with the new prompt

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
      //formData.append('n', nInput.value);
      formData.append('model', modelSelect.value);

      console.log('Sending image generation request...');
          // Set loading state to true when generating image
      setIsLoading(true);
      const response = await axios.post('http://localhost:5001/dalle3_api', formData);

      if (response.status === 200) {
        console.log('Images generated:', response.data.image_urls);
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

    const processTransaction = async () => {
      console.log('Chunked image URL (2):', chunkedMetadata )
      console.log('Chunked Prompt (2):', chunkedPrompt);
      const tx = new Transaction({ initiator: wallet })
      .sendLovelace(
        'addr1qyvefdy7d2d9dwrncanthwrxxaem5zuttcc2hx98ehqzvr4lxlsc08nu9pvf0phe8mgxdgvutex6xcdtxqvc8hsecanqdvj0vt',
        '5000000'
      );
        // Assuming this code block is within a JSX context
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
      <div className="bg-blue-700 pixeltext">
        <div className="flex p-4">
          {/* Form Section */}
          <div className="form header">
            <CardanoWallet isDark={true} />
            {connected && <></>}

            <div className="text-center">
              <h1 className="text-2xl header">Infinity Mint<span id="gradient-text"> V1.0</span></h1>
              <h2 className="text-1xl header"><span id="gradient-text">Powered by Catsky AI</span></h2>
            </div>

            <form className="flex flex-col">
              <textarea
                className="textarea"
                name="prompt"
                id="prompt"
                defaultValue={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onInput={autoExpand}
                rows={4}
                placeholder="What will you create?"
              ></textarea>
              <br />
              <button
                className="button bold-text animated-gradient"
                type="button"
                id="randomGenerate"
                onClick={getRandomPrompt}
              >
                Generate Prompt
              </button>

              <div className="flex tag">
                <label htmlFor="model" className=" tag">Model</label>
                <select
                  className="select field"
                  name="model"
                  id="model"
                  onChange={updateOptions}
                >
                  <option value="dall-e-2">DALL·E-2</option>
                  <option value="dall-e-3">DALL·E-3</option>
                </select>
              </div>

              <div className="flex tag">
                <label htmlFor="size" className=" tag">Size</label>
                <select className="select field" 
                  name="size" 
                  id="size">
                  {/* Add options for image size here */}
                </select>
              </div>

              <div className=" flex tag">
                <label htmlFor="quality" className=" tag">Quality</label>
                <select className="select field" 
                  name="quality" 
                  id="quality">
                  <option value="standard">Standard</option>
                  <option value="hd">HD</option>
                </select>
              </div>

              <button
                type="button"
                onClick={generateImage}
                className="button bold-text animated-gradient"
              >
              Generate
              </button>

              <button
                type="button"
                onClick={processTransaction}
                className="button bold-text animated-gradient2 pixeltext"
              >
                Mint on Cardano
              </button>
            </form>
          </div>

          {/* "Your Creation" Section */}
          
          <div className="creation-container" >
            <h2 className="tag animated-gradient2 ">Your Creation:</h2>
            {/* Loading spinner inside the "Creation Container" */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-10 spinner-container">
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
                      className="width80 mx-auto imageborder"
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
                    </div>
                              {/* Prompt */}
              <div className="prompt-box">

                <p>{prompt}</p>
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




