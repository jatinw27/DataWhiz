import React, { useState, useEffect, useRef } from 'react'
import { FaUserCircle } from 'react-icons/fa';
import { useChat } from '../hooks/useChat.js';
import { fetchDatasets, uploadCSV } from '../services/api.js';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function Bot() {
    const [uploading, setUploading] = useState(false);
    const [input, setInput] = useState("");
    const [datasets, setDatasets] = useState([]);
    const [selectedDataset, setSelectedDataset] = useState("users");
    const [selectedSource, setSelectedSource] = useState("csv")
    const { messages, loading, sendMessage, bottomRef } = useChat();


    const [sessionId] = useState(() => {
    return localStorage.getItem("myChatSession") || "user_" + Date.now();
});


//     useEffect(() => {
//   bottomRef.current?.scrollIntoView({ behavior: "smooth" });
// }, [msg, loading]);

    useEffect(() => {
      async function fetchDatasets() {
        try {
          const res = await axios.get(
            `${API_BASE}/api/datasets`
          );
          setDatasets(res.data.datasets || []);
          if (res.data.datasets?.length) {
            setSelectedDataset(res.data.datasets[0]);
          }
        } catch (err) {
          console.error("failed to load datasets", err);
          
        }
      }
      fetchDatasets();
    }, [])

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

const handleCSVUpload = async (file) => {
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    setUploading(true);

    await uploadCSV(formData);

    const res = await fetchDatasets();
    setDatasets(res.data.datasets || []);
    setSelectedDataset(res.data.datasets[0]);

    alert("CSV uploaded successfully!");
  } catch (err) {
    console.error("Upload failed", err);
    alert("CSV upload failed");
  } finally {
    setUploading(false);
  }
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

//       const handleSendMsg = async () => {
//   if (!input.trim()) return;

//   const userText = input.trim();

//   if (isDataQuery(userText) && !selectedDataset) {
//   alert("Please select a dataset first");
//   return;
// }



//   // show user message immediately
//   setMsg(prev => [...prev, { text: userText, sender: 'user' }]);
//   setInput("");
//   setLoading(true);

//   try {
//     let res;

//     if (isDataQuery(userText)) {
//       // 🔹 DATA QUESTION → NLQ ENGINE
//       res = await axios.post(
//   `${API_BASE}/api/nlq/ask`,
//   {
//     question: userText,
//     source: selectedSource,
//     dataset: selectedDataset
//   }
// );


//       setMsg(prev => [
//         ...prev,
//         { text: res.data.answer, sender: 'bot' }
//       ]);

//     } else {
//       // 🔹 NORMAL CHAT → AI CHATBOT
//       res = await axios.post(
//         `${API_BASE}/api/chatbot/message`,
//         {
//           text: userText,
//           sessionId: sessionId
//         }
//       );

//       setMsg(prev => [
//         ...prev,
//         { text: res.data.botMsg, sender: 'bot' }
//       ]);
//     }

//   } catch (error) {
//     console.error("Error:", error);
//     setMsg(prev => [
//       ...prev,
//       { text: "Something went wrong. Please try again.", sender: 'bot' }
//     ]);
//   } finally {
//     setLoading(false);
//   }
// };

const handleSendMsg = () => {
  if (!input.trim()) return;

  const userText = input.trim();

  sendMessage({
    text: userText,
    source: selectedSource,
    dataset: selectedDataset,
    isDataQuery: isDataQuery(userText),
  });

  setInput("");
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
      
{/* Source & Dataset Selector */}
<div className="w-full max-w-4xl mx-auto px-4 mb-4 mt-24">

  <div className="flex gap-3 items-center">

    {/* Source Selector */}
    <select
      value={selectedSource}
      onChange={(e) => setSelectedSource(e.target.value)}
      className="bg-gray-900 text-white border border-gray-700 rounded px-3 py-2"
    >
      <option value="sqlite">SQLite</option>
      <option value="csv">CSV</option>
      <option value="mongo">MongoDB</option>
    </select>

    {/* Dataset Selector (ONLY for CSV) */}
    {selectedSource === "csv" && (
      <select
        value={selectedDataset}
        onChange={(e) => setSelectedDataset(e.target.value)}
        className="bg-gray-900 text-white border border-gray-700 rounded px-3 py-2"
      >
        {datasets.length === 0 ? (
          <option disabled>No datasets loaded</option>
        ) : (
          datasets.map(ds => (
            <option key={ds} value={ds}>
              {ds}
            </option>
          ))
        )}
      </select>
    )}
  </div>

  {/* CSV Upload (below dataset selector) */}
  {selectedSource === "csv" && (
    <div className="flex items-center gap-3 mt-3">
      <input
        type="file"
        accept=".csv"
        onChange={(e) => handleCSVUpload(e.target.files[0])}
        className="text-sm"
      />
      {uploading && (
        <span className="text-gray-400 text-sm">Uploading...</span>
      )}
    </div>
  )}
</div>


        {/* Chat area */}
        <main className="flex-1 overflow-y-auto pt-20 pb-24 flex items-center justify-center">
        <div className="w-full max-w-4xl mx-auto px-4 flex flex-col space-y-3">
          {messages.length === 0 ? (
            //  welcome message
            <div className="text-center text-gray-400 text-lg">
              Hi, I'm{" "}
              <span className="text-green-500 font-semibold">DataWhiz</span> — your AI data analyst.
            </div>
          ) : (
            <>
              {messages.map((mesg, idx) => (
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

           {/* 👇 AUTO-SCROLL TARGET */}
              <div ref={bottomRef} />
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