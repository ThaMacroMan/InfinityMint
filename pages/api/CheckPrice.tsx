import React, { useState, useEffect } from 'react';

interface TokenPriceProps {
  tokenUnit?: string;
  onchainID?: string;
  interval: string;
  numIntervals: number;
  settokenPerUse: (tokenPerUse: number, formattedPrice: string) => void;
}

const TokenPrice: React.FC<TokenPriceProps> = ({
  tokenUnit,
  onchainID,
  interval,
  numIntervals,
  settokenPerUse
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formattedPrice, setFormattedPrice] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_KEY = '8w7MBbmePqxKF5phWuUPzPE0xUkCgt2p';
        const queryParams = new URLSearchParams({
          interval,
          numIntervals: numIntervals.toString(),
        });

        if (tokenUnit) queryParams.append('unit', tokenUnit);
        if (onchainID) queryParams.append('onchainID', onchainID);

        const response = await fetch(`https://openapi.taptools.io/api/v1/token/ohlcv?${queryParams}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': '8w7MBbmePqxKF5phWuUPzPE0xUkCgt2p',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        console.log('API response:', json);

        const formattedClosePriceADA = json[0]?.close.toFixed(10);
        const [wholePart, decimalPart] = formattedClosePriceADA.split('.');
        const formattedPrice = `${wholePart}.${decimalPart.slice(0, 9)}`;
        const tokenPerUse = Math.floor(0.1 / parseFloat(formattedPrice));
        
        setFormattedPrice(formattedPrice);
        settokenPerUse(tokenPerUse, formattedPrice);

      } catch (error: any) {
        console.error('Error fetching token price:', error);
        setError(`There was an error fetching the token price: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tokenUnit, onchainID, interval, numIntervals, settokenPerUse]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div></div>;

  return null; // No need to return any JSX as there's no content specified
};

export default TokenPrice;
