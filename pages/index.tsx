import React, { useState, useEffect } from "react";
import type { NextPage } from "next";
import { useWallet } from '@meshsdk/react';
import { CardanoWallet } from '@meshsdk/react';
import axios from 'axios';
import { Transaction } from '@meshsdk/core';



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
      const response = await axios.post('http://localhost:5001/dalle3_api', formData);

      if (response.status === 200) {
        console.log('Images generated:', response.data.image_urls);
        // Set the generated images in state
        setGeneratedImages(response.data.image_urls);

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
        '1000000'
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

  const saveImage = async (imageUrl: string) => {
    try {
        // Open the image in a new tab
        window.open(imageUrl, '_blank');
    } catch (error) {
        console.error('Error opening image:', error);
    }
  };  


  return (
    <div className="bg-blue-700 p-10 min-h-screen flex items-center justify-center">
      <div className="flex bg-black shadow-lg rounded-lg p-5" style={{ width: '100%', flexDirection: 'row' }}>
        
        {/* Form Section */}
        <div className="form-container" style={{ flex: 1 }}>
          <CardanoWallet isDark={true} />
          {connected && <></>}

          <div className="text-center">
            <h1 className="text-2xl font-pixel mb-3">Infinity Mint V1.0</h1>
            <h2 className="text-1xl font-pixel mb-4">Powered by <span id="gradient-text">Catsky AI</span></h2>
          </div>

          <form className="flex flex-col items-center">
            <textarea
              className="textarea textarea-bordered w-full mb-3"
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
              className="button mb-4"
              type="button"
              id="randomGenerate"
              onClick={getRandomPrompt}
              style={{ margin: "0 auto", display: "block", borderRadius: "0.618rem" }}
            >
              Generate a prompt
            </button>

            <div className="mb-3 flex items-center mt-4">
              <label htmlFor="model" className="label tag">AI Model:</label>
              <select
                className="select select-bordered w-full field"
                name="model"
                id="model"
                onChange={updateOptions}
              >
                <option value="dall-e-2">DALL·E-2</option>
                <option value="dall-e-3">DALL·E-3</option>
              </select>
            </div>

            <div className="mb-3 flex items-center mt-4">
              <label htmlFor="size" className="label tag">Image Size:</label>
              <select className="select select-bordered w-full field" name="size" id="size">
                {/* Add options for image size here */}
              </select>
            </div>

            <div className="mb-3 flex items-center mt-4">
              <label htmlFor="quality" className="label tag">Image Quality:</label>
              <select className="select select-bordered w-full field" name="quality" id="quality">
                <option value="standard">Standard</option>
                <option value="hd">HD</option>
              </select>
            </div>

            <button
              type="button"
              onClick={generateImage}
              className="button my-4 mt-4 rounded"
              style={{ borderRadius: "0.618rem" }}
            >
              Generate
            </button>

            <button
              type="button"
              onClick={processTransaction}
              className="button my-4 mt-4 rounded"
              style={{ borderRadius: "0.618rem" }}
            >
              Mint
            </button>
          </form>
        </div>

        {/* "Your Creation" Section */}
        <div className="creation-container" style={{ flex: 1, border: '20px solid white', padding: '10px', margin: '10px', borderRadius: '.618rem' }}>
          <h2 className="text-xl font-pixel mb-3 text-center text">Your Creation Lives here:</h2>
          {!!generatedImages && generatedImages.length > 0 && (
            <div>
              {generatedImages.map((imageUrl, imageIndex) => (
                <div key={`generated-image-${imageIndex}`} className="relative">
                  <img
                    src={imageUrl}
                    alt={`Generated Image ${imageIndex + 1}`}
                    className="w-full h-auto"
                    onClick={() => saveImage(imageUrl)}
                  />
                </div>
                
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default Home;
{/* 
<div className="mb-3">
    <label htmlFor="n" className="label">Number of Images (1-10 for DALL·E-2):</label>
    <input
        type="number"
        defaultValue="1"
        name="n"
        id="n"
        min="1"
        max="10"
        className="input input-bordered w-full"
    />
</div>
{/*}*/}



