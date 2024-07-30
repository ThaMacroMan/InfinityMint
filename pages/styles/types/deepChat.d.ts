// types/deepChat.d.ts
declare module 'deep-chat-react' {
  import * as React from 'react';

  export interface DeepChatProps {
    directConnection: {
      openAI: {
        key: any;
        chat?: {
          max_tokens?: number;
          system_prompt?: string;
          model?: string;
          temperature?: number;
          top_p?: number;
          messages: string;
          directConnection?: boolean;
        };
      };
    };
    style?: React.CSSProperties;
    onChat?: (messages: { role: string; content: string }[]) => Promise<string>;
  }

  export const DeepChat: React.FC<DeepChatProps>;
}
