import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { FaUserCircle } from 'react-icons/fa';

function Bot() {
    const [msg, setMsg] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    
    const [sessionId] = useState(() => {
    return localStorage.getItem("myChatSession") || "user_" + Date.now();
});

    useEffect(() => {
    localStorage.setItem("myChatSession", sessionId);
}, [sessionId]);

    const isDataQuery = (text) => {
  const keywords = [
    "show",
    "list",
    "get",
    "fetch",
    "users",
    "data",
    "records",
    "older than",
    "younger than",
    "count",
    "how many"
  ];

  const lowerText = text.toLowerCase();
  return keywords.some(keyword => lowerText.includes(keyword));
};


//     const handleSendMsg = async () => {
//     if (!input.trim()) return;

//     const userText = input.trim();

   
//     setMsg(prev => [...prev, { text: userText, sender: 'user' }]);
//     setInput("");
//     setLoading(true);

//     try {
//         const res = await axios.post(
//           // "https://datawhiz-production.up.railway.app/api/chatbot/message", 
//             "http://localhost:3000/api/nlq/ask",
//           {
//               question: userText
//           //  text: userText,
//           //   sessionId: sessionId
//         });

        
//         // setMsg(prev => [...prev, { text: res.data.botMsg, sender: 'bot' }]);
//         setMsg(prev => [ ...prev, {text:res.data.answer, sender: 'bot' }])

//     } catch (error) {
//         console.error("Error:", error);
//         setMsg(prev => [...prev, { text: "Bot is offline", sender: 'bot' }]);
//     } finally {
//         setLoading(false);
//     }
// };

      const handleSendMsg = async () => {
  if (!input.trim()) return;

  const userText = input.trim();

  // show user message immediately
  setMsg(prev => [...prev, { text: userText, sender: 'user' }]);
  setInput("");
  setLoading(true);

  try {
    let res;

    if (isDataQuery(userText)) {
      // 🔹 DATA QUESTION → NLQ ENGINE
      res = await axios.post(
        "http://localhost:3000/api/nlq/ask",
        { question: userText }
      );

      setMsg(prev => [
        ...prev,
        { text: res.data.answer, sender: 'bot' }
      ]);

    } else {
      // 🔹 NORMAL CHAT → AI CHATBOT
      res = await axios.post(
        "https://datawhiz-production.up.railway.app/api/chatbot/message",
        {
          text: userText,
          sessionId: sessionId
        }
      );

      setMsg(prev => [
        ...prev,
        { text: res.data.botMsg, sender: 'bot' }
      ]);
    }

  } catch (error) {
    console.error("Error:", error);
    setMsg(prev => [
      ...prev,
      { text: "Something went wrong. Please try again.", sender: 'bot' }
    ]);
  } finally {
    setLoading(false);
  }
};

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMsg();
        }
    };

  return (
       <div className='flex flex-col min-h-screen bg-[#0d0d0d] text-white'>
        {/* Header */}
        <header className="fixed top-0 left-0 w-full border-b border-gray-800 bg-[#0d0d0d] z-10">
        <div className="container mx-auto flex justify-between items-center px-6 py-4">
          <h1 className="text-lg font-bold">DataWhiz</h1>
          <FaUserCircle size={30} className="cursor-pointer" />
        </div>
      </header>
      
        {/* Chat area */}
        <main className="flex-1 overflow-y-auto pt-20 pb-24 flex items-center justify-center">
        <div className="w-full max-w-4xl mx-auto px-4 flex flex-col space-y-3">
          {msg.length === 0 ? (
            //  welcome message
            <div className="text-center text-gray-400 text-lg">
              Hi, I'm{" "}
              <span className="text-green-500 font-semibold">DataWhiz</span> — your AI data analyst.
            </div>
          ) : (
            <>
              {msg.map((mesg, idx) => (
                <div
                  key={idx}
                  className={`px-4 py-2 rounded-xl max-w-[75%] ${
                    mesg.sender === "user"
                      ? "bg-blue-600 text-white self-end"
                      : "bg-gray-800 text-gray-100 self-start"
                  }`}
                >
                  {mesg.text}
                </div>
              ))} 
                {loading && (
                <div className="bg-gray-700 text-gray-300 px-4 py-2 rounded-xl max-w-[60%] self-start">
                  DataWhiz is thinking...
                </div>
              )}
           
            </>
          )}
        </div>
      </main>

        {/* input area */}
        <footer className="fixed bottom-0 left-0 w-full border-t border-gray-800 bg-[#0d0d0d] z-10">
        <div className="max-w-4xl mx-auto flex justify-center px-4 py-3">
          <div className="w-full flex bg-gray-900 rounded-full px-4 py-2 shadow-lg">
            <input
              type="text"
              className="flex-1 bg-transparent outline-none text-white placeholder-gray-400 px-2"
              placeholder="Ask DataWhiz..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button
             onClick={handleSendMsg}
              className="bg-green-600 hover:bg-green-700 px-4 py-1 rounded-full text-white font-medium transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Bot