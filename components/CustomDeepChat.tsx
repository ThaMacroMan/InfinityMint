import React from 'react';
import dynamic from 'next/dynamic';
const DeepChat = dynamic(() => import('deep-chat-react').then(mod => mod.DeepChat), { ssr: false });
// Define the DeepChatProps type as any to avoid type errors
type DeepChatProps = any;


const CustomDeepChat: React.FC = () => {
  return (
    // Add type assertion to inform TypeScript about the correct props type
// Add type assertion to inform TypeScript about the correct props type
// Add type assertion to inform TypeScript about the correct props type
<DeepChat
  {...{
    connect: {
      url: '/api/deepChat',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      stream: true,
      directConnection: false, // Add directConnection property
    },
    style: { borderRadius: '10px', marginTop: `.5rem`, width: '95%' },
    introMessage: { text: 'Ask me anything about this platform or Catsky AI!' },
    avatars: {
      default: {
        styles: {
          avatar: { height: '30px', width: '30px' },
          container: { marginTop: '8px' },
        },
      },
      ai: {
        src: '/Catsky LOGO Small.png',
        styles: {
          avatar: { marginLeft: '-3px' },
        },
      },
      user: {
        src: '/cardano_ada-512.png',
        styles: {
          avatar: { borderRadius: '15px' },
        },
      },
    },
  } as DeepChatProps} // Add type assertion here
/>
  )}
export default CustomDeepChat; 