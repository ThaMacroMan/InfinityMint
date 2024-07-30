import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import dynamic from 'next/dynamic';

// Define the DeepChatProps type as any to avoid type errors
type DeepChatProps = any;
const DeepChat = dynamic(() => import('deep-chat-react').then(mod => mod.DeepChat), { ssr: false });

const CustomDeepChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const chatWidgetRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [position, setPosition] = useState({ top: 100, left: 430 });
  const [size, setSize] = useState({ width: 400, height: 400 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const messagesRef = useRef<any[]>([]); // Store messages in a ref

  const toggleChat = useCallback(() => {
    setIsOpen(prevIsOpen => !prevIsOpen);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const chatWidget = chatWidgetRef.current;
    if (chatWidget && e.target === chatWidget) {
      const offsetX = e.clientX - chatWidget.getBoundingClientRect().left;
      const offsetY = e.clientY - chatWidget.getBoundingClientRect().top;
      setOffset({ x: offsetX, y: offsetY });
      setIsDragging(true);
    }
  }, []);

  const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
    setIsResizing(true);
    e.stopPropagation(); // Prevent triggering drag
  }, []);

  useEffect(() => {
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (isDragging) {
        const newX = moveEvent.clientX - offset.x;
        const newY = moveEvent.clientY - offset.y;
        setPosition({ top: newY, left: newX });
      } else if (isResizing) {
        const chatWidget = chatWidgetRef.current;
        if (chatWidget) {
          const newWidth = moveEvent.clientX - chatWidget.getBoundingClientRect().left;
          const newHeight = moveEvent.clientY - chatWidget.getBoundingClientRect().top;
          setSize({ width: newWidth, height: newHeight });
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    const handleWindowResize = () => {
      // Adjust chat widget position or size if necessary
      const chatWidget = chatWidgetRef.current;
      if (chatWidget) {
        const boundingRect = chatWidget.getBoundingClientRect();
        setPosition(prevPosition => ({
          top: Math.min(prevPosition.top, window.innerHeight - boundingRect.height),
          left: Math.min(prevPosition.left, window.innerWidth - boundingRect.width),
        }));
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('resize', handleWindowResize);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [isDragging, isResizing, offset]);

  const handleNewMessage = useCallback((newMessage: any) => {
    messagesRef.current = [...messagesRef.current, newMessage];
  }, []);

  return (
    <>
      <div className="chat-widget-toggle" onClick={toggleChat}>
        {isOpen ? '✖️' : '💬'}
      </div>
      {isOpen && (
        <div
          className="chat-widget"
          ref={chatWidgetRef}
          style={{ top: `${position.top}px`, left: `${position.left}px`, width: `${size.width}px`, height: `${size.height}px`, position: 'fixed' }}
          onMouseDown={handleMouseDown}
        >
          <DeepChat
            {...{
              connect: {
                url: '/api/deepChat',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                stream: true,
                directConnection: false,
              },
              style: { borderRadius: '10px', marginTop: '.7rem', width: '100%', height: '100%', background: '#191970', border: 'none' },
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
              messageStyles: {
                default: {
                  shared: {
                    bubble: { color: 'white', backgroundColor: 'blue' },
                  },
                  ai: {
                    bubble: { backgroundColor: 'blue' },
                  },
                  user: {
                    bubble: { backgroundColor: 'green' },
                  },
                },
              },
              messages: messagesRef.current, // Pass the messages from the ref
              onMessage: handleNewMessage, // Update messages when a new message arrives
            } as DeepChatProps}
          />
          <div className="resize-handle" onMouseDown={handleResizeMouseDown} />
        </div>
      )}
    </>
  );
};

export default memo(CustomDeepChat);
