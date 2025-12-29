 import db from "./database.js";
 import { nlpToSQL } from "./nlp.service.js";
 import { toNaturalLanguage } from "./response.service.js";

 export const handleNLQ = (req, res) =>{
    const { question } = req.body;
    const sql = nlpToSQL(question);
     if(!sql) {
        return res.json({
            answer: "I couldn't understand your question."
        });
     }
     db.all(sql, [], (err,rows) => {
        res.json({
            question,
            generatedQuery: sql,
            answer: toNaturalLanguage(rows),
            data: rows
        });
     })
 }