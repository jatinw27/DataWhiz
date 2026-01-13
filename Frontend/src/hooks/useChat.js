export function useChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const sessionId =
    localStorage.getItem("myChatSession") || "user_" + Date.now();

  useEffect(() => {
    localStorage.setItem("myChatSession", sessionId);
  }, [sessionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const isDataQuery = (text) => {
    const keywords = [
      "show","list","get","fetch","users","data",
      "records","older than","younger than",
      "count","how many","average","avg",
    ];
    return keywords.some(k => text.toLowerCase().includes(k));
  };

  const sendMessage = async ({ text, source, dataset }) => {
    if (!text?.trim()) return;

    setMessages(prev => [...prev, { text, sender: "user" }]);
    setLoading(true);

    try {
      let res;

      if (isDataQuery(text)) {
        res = await askNLQ({
          question: text,
          source,
          dataset,
        });

        setMessages(prev => [
          ...prev,
          { text: res.data.answer, sender: "bot" },
        ]);
      } else {
        res = await sendChatMessage({
          text,
          sessionId,
        });

        setMessages(prev => [
          ...prev,
          { text: res.data.botMsg, sender: "bot" },
        ]);
      }
    } catch {
      setMessages(prev => [
        ...prev,
        { text: "Something went wrong. Please try again.", sender: "bot" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, loading, sendMessage, bottomRef };
}
