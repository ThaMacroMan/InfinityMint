import React from 'react';
import dynamic from 'next/dynamic';
const DeepChat = dynamic(() => import('deep-chat-react').then(mod => mod.DeepChat), { ssr: false });

const CustomDeepChat: React.FC = () => {
  return (
    <DeepChat
      connect={{
        url: '/api/deepChat', // URL to your API route
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        stream: true,
        //assistant_id: 'asst_Yy5op24Wl2cFVTOzJDigOnuv', // Replace with your actual assistant ID
        //load_thread_history: true, // Optionally preload thread history
      }}
      style={{ borderRadius: '10px', marginTop: `.5rem`, width: '95%' }}

      introMessage={{text: 'Ask me anything about this platform or Catsky AI!'}}
      avatars= {{
        default: {
            styles:{
                avatar: { height: '30px', width: '30px' },
                container: { marginTop: '8px' }
            }
        },
        ai: {
            src: '/Catsky LOGO Small.png',
            styles: {
            avatar: { marginLeft: '-3px' }
            }
        },
        user: {
            src: '/cardano_ada-512.png',
            styles: {
              avatar: { borderRadius: '15px' }
            }
          }

    }}
        />
    );
    };

export default CustomDeepChat; 