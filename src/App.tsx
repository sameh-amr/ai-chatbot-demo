import { useState, useRef, useEffect } from 'react';
import { FiSend, FiUser, FiMessageSquare, FiMenu, FiX } from 'react-icons/fi';

// Type definitions
type Message = {
  id: number;
  text: string;
  sender: 'user' | 'bot';
};

type QAPairs = {
  [key: string]: string;
};

const AIChatbotDemo = () => {
  // Chat state with TypeScript types
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! I'm your AI assistant. What would you like to know?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Predefined questions and answers with type
  const qaPairs: QAPairs = {
    "What can you do?": "I can answer questions, provide information, and help with general knowledge topics.",
    "Tell me about yourself": "I'm an AI chatbot designed to provide helpful information.",
    "How does this work?": "You type questions and I provide answers based on my knowledge base.",
    "Explain AI in simple terms": "AI is like teaching computers to think and learn similarly to humans.",
    "What are your limitations?": "I can't browse the internet or access real-time information.",
    "Give me a fun fact": "Honey never spoils! Archaeologists have found 3,000-year-old honey that's still edible.",
    "How do I learn programming?": "Start with basics like HTML/CSS, then move to JavaScript or Python."
  };

  // Auto-scroll to bottom of chat
  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendUserMessage = (messageText: string): void => {
    const newUserMessage: Message = {
      id: messages.length + 1,
      text: messageText,
      sender: 'user'
    };
    setMessages([...messages, newUserMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const response = qaPairs[messageText] || 
        "I'm not sure about that as i am only a demo. Could you pick something from predefine questions ?";
      
      const newBotMessage: Message = {
        id: messages.length + 2,
        text: response,
        sender: 'bot'
      };
      setMessages(prev => [...prev, newBotMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  // Handle sending a message
  const handleSendMessage = (e: React.FormEvent): void => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    // Add user message
    const newUserMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user'
    };
    setMessages([...messages, newUserMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      let response: string;
      
      if (qaPairs[inputValue]) {
        response = qaPairs[inputValue];
      } else {
        const defaultResponses: string[] = [
          "I'm not sure about that one as i am only a demo chatbot. Could you pick something from the predefined questions?",
        ];
        response = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
      }

      const newBotMessage: Message = {
        id: messages.length + 2,
        text: response,
        sender: 'bot'
      };
      setMessages(prev => [...prev, newBotMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  // Get first 4 questions as conversation starters
  const conversationStarters: string[] = Object.keys(qaPairs);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
  <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  AI Assistant
                </span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <button className="text-indigo-600 hover:text-indigo-800 font-medium">
                Features
              </button>
              <button className="text-indigo-600 hover:text-indigo-800 font-medium">
                About
              </button>
              <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full font-medium hover:shadow-lg transition-all duration-300">
                Try Premium
              </button>
            </div>
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-500 hover:text-gray-900 focus:outline-none"
              >
                {mobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg rounded-b-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#" className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 rounded-md">
                Features
              </a>
              <a href="#" className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 rounded-md">
                About
              </a>
              <a href="#" className="block px-3 py-2 text-base font-medium text-indigo-600 hover:bg-indigo-50 rounded-md">
                Try Premium
              </a>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                  message.sender === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                }`}>
                  <p className="text-sm md:text-base">{message.text}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 rounded-lg rounded-bl-none px-4 py-2 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Sticky quick-reply buttons */}
        <div className="sticky bottom-16 bg-gradient-to-t from-white via-white to-transparent pt-4 pb-2 px-4">
          <div className="max-w-3xl mx-auto flex flex-wrap gap-2">
            {conversationStarters.map((question) => (
              <button
                key={question}
                onClick={() => sendUserMessage(question)}
                className="px-3 py-1.5 bg-white text-indigo-600 rounded-full text-xs font-medium shadow-sm hover:shadow-md transition-all duration-200 border border-indigo-100"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Input area */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
          <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto flex">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-l-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />
            <button
              type="submit"
              disabled={isTyping || inputValue.trim() === ''}
              className="bg-indigo-600 text-white rounded-r-full px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors duration-200"
            >
              <FiSend className="h-4 w-4" />
            </button>
          </form>
        </div>
      </main>
      <div className="bg-white border-t border-gray-200 py-4">
  <div className="max-w-3xl mx-auto px-4">
    <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
      <div className="mb-2 md:mb-0">
        © {new Date().getFullYear()} Stackvibes, Inc. All rights reserved.
      </div>
    </div>
  </div>
</div>
    </div>
  );
};

export default AIChatbotDemo;