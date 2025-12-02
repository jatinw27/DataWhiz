// controllers/chatbot.msg.js
import User from '../models/user.model.js';
import Bot from '../models/bot.model.js';
import { Groq } from 'groq-sdk';


const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});




const sessions = new Map(); // To store conversation history per user session

export const Message = async(req, res) => {
    try {
        const {text, sessionId = "default"} = req.body;
      
        console.log("Session ID received:", sessionId);

        console.log('User said:', text);
        
        if(!text?.trim()){
            return res.status(400).json({error: 'Text is required'});
        }

        if(!sessions.has(sessionId)){
            sessions.set(sessionId, []);
            console.log("New session created:", sessionId);
        }
        const conversationHistory = sessions.get(sessionId);

         // Store user message in conversation history
        conversationHistory.push({role: 'user', content:text.trim()  });
        await User.create({
            sender: 'user',
            text
        })
       

        // AI response
        const chatCompletion = await groq.chat.completions.create({
            messages: [
            { role: 'system', content: 'You are a super smart AI assistant. You remember everything the user says. Always use past context and be friendly.' },
                ...conversationHistory
            ],
            model: 'llama-3.3-70b-versatile',  // ← This is the new, working model,   
            temperature: 0.7,
            max_tokens: 500,
        });
        
        // const normalizedText = text.toLowerCase().trim();

        const botresponse = chatCompletion.choices[0]?.message?.content?.trim() || "I'm thinking... let me try that again.";
   
        conversationHistory.push({ role: "assistant", content: botresponse });
        
        
        if (conversationHistory.length > 40) {
            conversationHistory.splice(0, conversationHistory.length - 40);
        }
        // Save to DB 
        await Bot.create({ text: botresponse, sender: 'bot' });
        console.log('Ai replied: ',botresponse);

        

        return res.status(200).json({
            userMsg:text.trim(),
            botMsg:botresponse});
        

    } catch (error) {
        console.log("error in msg control:",error);
        return res.status(500).json({error: 'Internal Server Error'});
        
    }
};

export default Message;   