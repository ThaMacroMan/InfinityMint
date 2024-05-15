import React, { useState, useEffect } from 'react';

interface TokenPriceProps {
  tokenUnit?: string;
  onchainID?: string;
  interval: string;
  numIntervals: number;
  setCatskyPerUse: (catskyPerUse: number, formattedPrice: string) => void;
}

const TokenPrice: React.FC<TokenPriceProps> = ({
  tokenUnit,
  onchainID,
  interval,
  numIntervals,
  setCatskyPerUse
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
            'x-api-key': API_KEY,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        const formattedClosePriceADA = json[0]?.close.toFixed(10);
        const [wholePart, decimalPart] = formattedClosePriceADA.split('.');
        const formattedPrice = `${wholePart}.${decimalPart.slice(0, 9)}`;
        const catskyPerUse = Math.floor(0.1 / parseFloat(formattedPrice));
        
        setFormattedPrice(formattedPrice);
        setCatskyPerUse(catskyPerUse, formattedPrice);

      } catch (error: any) {
        setError(`There was an error fetching the token price: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tokenUnit, onchainID, interval, numIntervals, setCatskyPerUse]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <p>Formatted Price: {formattedPrice}</p>
    </div>
  );
};

export default TokenPrice;

