import React from 'react';
import FormComponent from '../components/FormComponent';
import { CardanoWallet } from '@meshsdk/react';

import { Heading } from '@chakra-ui/react'
import  Field from '../components/Field';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/react'



const App: React.FC = () => {
  return (
    <div>
      <span style={{ display: "inline-block", marginRight: "325px"  }}>      <CardanoWallet /></span>
      <span style={{ display: "inline-block" }}>      <Heading>InfiniNFT</Heading></span> 

      <Field />

      <FormComponent />
      {/* Other components or content */}
    </div>
  );
};

export default App;
