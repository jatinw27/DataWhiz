import 'dotenv/config';
import express from 'express'
import mongoose from 'mongoose'
import chatbotRoutes from './routes/chatbot.route.js'
import cors from 'cors'


const app = express()

const port = process.env.PORT || 3000

//middleware
app.use(express.json());
app.use(cors());


//Db connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))    
    .catch((err) => console.error('Could not connect to MongoDB...', err));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// routes defined
app.use('/api/chatbot',chatbotRoutes)

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
