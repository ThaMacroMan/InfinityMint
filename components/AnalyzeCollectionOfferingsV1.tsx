import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import ObjectID from 'bson-objectid';
import { useWallet } from '@meshsdk/react';
import { useTokenCheck } from '../hooks/TokenCheck';


// Mapping of Policy IDs to human-readable names.
const POLICY_ID_NAMES: { [key: string]: string } = {
  "6f5d880ec1746a32afc1f4fb53ad7ec1e214f49f53f1175c424b1200": "OG NFT",
  "b77791d20054db4fa9726a58854b8c02550277c8683286ec5a353b89": "CatNips NFT",
  "9b426921a21f54600711da0be1a12b026703a9bd8eb9848d08c9d921": "$Catsky"
};

const AnalyzeCollectionOfferingsV1: React.FC = () => {
  // Wallet states and functions.
  const { connected, wallet } = useWallet();

  // Local states.
  const [selectedProject, setSelectedProject] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agentResponse, setAgentResponse] = useState<string | null>(null);
  const [formattedAgentResponse, setFormattedAgentResponse] = useState('');
  const [buttonClicked, setButtonClicked] = useState(false);
  const [isAnalysisButtonEnabled, setIsAnalysisButtonEnabled] = useState(false);

  const [progress, setProgress] = useState(0);
  const [progressStep, setProgressStep] = useState(0);
  const [jobId, setjobId] = useState<string | null>(null);
  const [buttonBorderColor, setButtonBorderColor] = useState('border-green-300');

  useEffect(() => {
    if (connected) {
      // Set border color to green when the wallet is connected
      setButtonBorderColor('border-green-300');
    } else {
      // Set border color to red when the wallet is not connected
      setButtonBorderColor('border-red-600');
    }
  }, [connected]); // This effect runs whenever the 'connected' state changes.

  // Check for minimum required tokens using the custom hook.
  const { hasMinRequiredTokens } = useTokenCheck();

  // Predefined list of projects.
  const projects = ['What collection do you want to analyze?', 'cardanobits', 'tappy', 'oldmoney', 'hoskycashgrab', 'toolheads', 'theapesociety', 'blockowlshydracollection', 'blockowls-plutuscollection', 'blockowls-c1collection'];

  // Check if selected project is valid.
  const isProjectValid = selectedProject !== 'What collection do you want to analyze?' && projects.includes(selectedProject);



  // Function to initiate the NFT analysis.
  const startAnalysis = async () => {
    try {
      setIsLoading(true);
      setButtonClicked(true);

      const job_id = ObjectID().toString();
      setjobId(job_id); // Save the generated job_id in state

      const response = await axios.post('http://localhost:5000/bot/collection_offerings', {job_id: job_id });

      if (response.data.agentResponse && response.data.job_id) {
        setAgentResponse(response.data.agentResponse);
      }
    } catch (error) {
      console.error('Error starting analysis:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Define progressInterval within the scope of the effect
    let progressInterval: number | null = null;

    // Start polling only if analysis has started (buttonClicked) and we have a job ID.
    if (buttonClicked && jobId) {
      // Cast setInterval return to number as that's the return type in the browser environment
      progressInterval = window.setInterval(async () => {
        try {
          const progressResponse = await axios.get(`http://localhost:5000/job_status/${jobId}`);
          if (progressResponse.data && progressResponse.data.progress !== undefined) {
            // Update progress state
            setProgress(progressResponse.data.progress);
            setProgressStep(progressResponse.data.step);
            if (progressResponse.data.progress >= 100) {
              // Stop polling when progress is complete
              window.clearInterval(progressInterval);
              progressInterval = null;
              // Fetch analysis result here or update the UI state accordingly
            }
          }
        } catch (error) {
          console.error('Error fetching progress:', error);
          // On error, clear the interval
          if (progressInterval !== null) {
            window.clearInterval(progressInterval);
            progressInterval = null;
          }
          // You might want to set some error state here to show an error message to the user
        }
      }, 7500); // Polling every 5 seconds
    }

    // Cleanup function to clear the interval when the component unmounts or the dependencies change
    return () => {
      if (progressInterval !== null) {
        window.clearInterval(progressInterval);
      }
    };
  }, [buttonClicked, jobId]); // This effect will re-run if buttonClicked or jobId changes




  // Update the enable state of the analysis button based on the project selection and token check.
  useEffect(() => {
    if(hasMinRequiredTokens) {
      setIsAnalysisButtonEnabled(true);
    } else {
      setIsAnalysisButtonEnabled(false);
    }
  }, [selectedProject, hasMinRequiredTokens]);

  // Format the received agent response.

  // Format the received agent response.
  useEffect(() => {
    if (agentResponse) {
      // Create a new DOMParser instance
      const parser = new DOMParser();
      // Parse the string as HTML
      const doc = parser.parseFromString(agentResponse, 'text/html');
      // Use innerHTML to get the HTML content
      const unescapedHTML = doc.body.innerHTML;

      setFormattedAgentResponse(unescapedHTML);
      setIsLoading(false);
    }
  }, [agentResponse]);


  /*
  useEffect(() => {
    if (agentResponse) {
      const formatted = agentResponse
      .replace(/>/g, '<br>')
      .replace(/ADA/g, ' ADA')
      .replace(/\b\d+\.\s/g, '') // Removes the leading numbers like "1. ", "2. ", etc.
      .replace(/https:\/\/www\.jpg\.store\/asset\/[a-zA-Z0-9]+/g, match => `<div class="mb-4"><a href="${match}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2 inline-block" target="_blank">View on JPG Store</a></div>`)
      .replace('These are the most undervalued NFTs:', '<h3 class="font-bold mb-2">These are the most undervalued NFTs:</h3>');

      setFormattedAgentResponse(formatted);

      setIsLoading(false);

    }
  }, [agentResponse, isProjectValid]);
  */

  // Return early if not connected.
  if (!connected) {
    return null;
  }

  return (
    <div className="bg-gray-900 text-gray-200 p-4 min-h-400">
      <h2 className="text-xl font-bold mb-4">Catsky AI CatBot: Collection Offerings</h2>

      <div className="button-container mb-4 text-center flex justify-center items-center">
        {isLoading && <Image src="/images/logo-icon.png" className='object-contain animate-spin mx-auto' alt="Loading..." width={80} height={80} />}
        {!buttonClicked && (
          <button
            onClick={startAnalysis}
            disabled={!isAnalysisButtonEnabled}
            className={`loading-button w-full p-1 border ${buttonBorderColor}  text-white ${!isAnalysisButtonEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <Image src="/images/logo-icon.png" className='object-contain animate-spin mx-auto' alt="Loading..." width={80} height={80} />
            ) : (
              <span className="font-semibold">Find Lucrative Collection Offerings</span>
            )}
          </button>
        )}
      </div>
      {isLoading && (
        <div className="wrap-progress-bar">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        <div className="flex flex-col sm:flex-row sm:justify-between">
          <div>
            {progress > 0 ? `${Math.round(progress)}% complete` : "0% Complete"}
          </div>
          <div>
            {progressStep != 0 ? progressStep : "Initializing..."}
          </div>
        </div>
        </div>

      )}
      {formattedAgentResponse && !isLoading && (
        <div className="analysis-result mt-4">
          <h2 className="analysis-title text-xl mb-2 font-bold border-b">{selectedProject}</h2>
          <div dangerouslySetInnerHTML={{ __html: formattedAgentResponse }}></div>
        </div>
      )}
      {!formattedAgentResponse && !isLoading && buttonClicked && (
        <div className="analysis-result mt-4">
          <h2 className="analysis-title text-xl mb-2 font-bold border-b">{selectedProject}</h2>
          <p>No results found for this project. Please try again later or select a different project.</p>
        </div>
      )}
      {buttonClicked && !isLoading && !formattedAgentResponse && (
        <div className="empty-result mt-4">
          <p>Unfortunately, we couldn&lsquo;t gather enough data for a comprehensive analysis. Please select a different project or try again later.</p>
        </div>
      )}
    </div>
  );
};

export default AnalyzeCollectionOfferingsV1;