import { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

function App() {
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const AI_KEY = import.meta.env.VITE_AI_KEY;

  const handle = async () => {
    if (!input.trim()) return;

    try {
      setIsTyping(true);

      const genAI = new GoogleGenerativeAI(AI_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const result = await model.generateContent(input);
      const aiResponse = result.response.text();

      setChat((prevChat) => [
        ...prevChat,
        { usertext: input, aitext: aiResponse },
      ]);

      setInput('');
    } catch (err) {
      console.log(err);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat, isTyping]);

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} min-h-screen flex flex-col`}>
      <div className="fixed top-4 left-4">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="px-4 py-2 text-sm font-semibold bg-gray-800 dark:bg-gray-200 text-white dark:text-black rounded-lg transition"
        >
          {isDarkMode ? "Light" : "Dark"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 mb-24">
        {chat.map((val, i) => (
          <div key={i} className="flex flex-col">
            <div className="self-end bg-purple-600 text-white p-4 rounded-lg max-w-s shadow-md mx-6">
              <p className="text-sm">{val.usertext}</p>
            </div>

            <div className="self-start bg-green-600 text-white p-4 rounded-lg max-w-2/3 shadow-md mx-6">
              <p className="text-sm">{val.aitext}</p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="self-start bg-gray-600 text-white p-4 rounded-lg max-w-xs shadow-md mx-6 animate-pulse">
            <span>Typing...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 dark:bg-gray-200 p-4 rounded-xl flex items-center w-2/3">
        <textarea
          placeholder="Ask me anything..."
          className={`flex-1 h-12 px-4 py-2 rounded-lg focus:outline-none resize-none overflow-y-auto 
          ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="ml-3 bg-blue-500 text-white px-5 py-2.5 rounded-lg hover:bg-blue-600 transition"
          onClick={handle}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;