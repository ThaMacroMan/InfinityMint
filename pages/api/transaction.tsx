import React, { useEffect, useState } from 'react';
import { Transaction } from '@meshsdk/core';

interface MyComponentProps {
  wallet: any; // Adjust the type of wallet as per your application's structure
  isVisible: boolean;
}

const MyComponent: React.FC<MyComponentProps> = ({ wallet, isVisible }) => {
  const [txHash, setTxHash] = useState<string | null>(null);

  useEffect(() => {
    const sendTransaction = async () => {
      try {
        const tx = new Transaction({ initiator: wallet })
          .sendLovelace(
            'addr1v9vx0sacufuypa2k4sngk7q40zc5c4npl337uusdh64kv0c93pyfx',
            '1000000'
          );
        
        const unsignedTx = await tx.build();
        const signedTx = await wallet.signTx(unsignedTx);
        const hash = await wallet.submitTx(signedTx);
        
        setTxHash(hash);
      } catch (error) {
        console.error('Error sending transaction:', error);
      }
    };

    if (isVisible) {
      sendTransaction();
    }
  }, [wallet, isVisible]);

  return (
    <div>
      {txHash ? (
        <p>Transaction Hash: {txHash}</p>
      ) : (
        <p>Sending transaction...</p>
      )}
    </div>
  );
};

export default MyComponent;
