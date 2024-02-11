// TextInput.tsx
import React from 'react';

const TextInput: React.FC<{
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}> = ({ value, onChange, placeholder }) => {
  return <input type="text" value={value} onChange={onChange} placeholder={placeholder} />;
};

export default TextInput;
