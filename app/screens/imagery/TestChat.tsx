import AiService from '@/components/ai/AiService';
import { Chat, ChatRef } from '@/components/app/Chat';
import React, { useEffect, useRef } from 'react';

// This file is for testing out the chat.

const TestChat = () => {
  const chatSettings = useRef<ChatRef>(null);

  // Generate text when creating new chat:
  useEffect(() => {
    const init = async () => {
      await chatSettings.current?.createMessage({
        role: "sender",
        content: [
          {
            type: "image",
            image: {
              type: "base64",
              content: await AiService.imageToBase64(require("@/assets/app/PLACEHOLDER.png")),
            },
          },
          {
            type: "text",
            text: "What kind of mango is this?",
          }
        ]
      });

      await chatSettings.current?.createLoadingText()

      setTimeout(() => {
        chatSettings.current?.destroyLoadingText();

        chatSettings.current?.createMessage({
          role: "receiver",
          content: [
            {
              type: "text",
              text: "This is phonk edit mango.",
            }
          ]
        });
      }, 3000);
    };

    init();
    init();
    init();
  }, []);

  return (<Chat ref={chatSettings}/>)
}

export default TestChat
