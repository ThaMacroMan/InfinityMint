import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  FormHelperText
} from '@chakra-ui/react'; // Assuming you're using Chakra UI for styling

function Field() {
  const [prompt, setPrompt] = useState('');

  const autoExpand = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    target.style.height = 'auto';
    target.style.height = target.scrollHeight + 'px';
  };

  return (
    <div>

      <FormControl isRequired>
        <FormLabel>Enter Prompt</FormLabel>
        <Input type='prompt' />
        <FormHelperText>Get creative!</FormHelperText>
      </FormControl>
    </div>
  );
}

export default Field;
