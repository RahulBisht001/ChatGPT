import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'

const OPENAI_API_KEY = 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
const PORT = 8000
dotenv.config()

import { Configuration, OpenAIApi } from "openai"

// console.log(process.env.OPENAI_API_KEY)
const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

const app = express()
const corsOptions = {
    // origin: process.env.FRONTEND_URL,
    origin: 'https://chat-gpt-frontend-gules.vercel.app/',
    credentials: true,
    methods: ['GET', 'POST'],
    optionSuccessStatus: 200
}
app.use(cors(corsOptions))
// app.use(cors());
app.use(express.json())


app.get('/', async (req, res) => {
    console.log("___HI ____");
    res.setHeader('Access-Control-Allow-Origin', 'https://chat-gpt-frontend-gules.vercel.app/');
    res.status(200).send({
        message: 'Hello From ChatGPT version R'
    })
})

app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        })
        
        res.setHeader('Access-Control-Allow-Origin', 'https://chat-gpt-frontend-gules.vercel.app/');
        res.status(200).json({
            bot: response.data.choices[0].text
        })
    } catch (error) {
        console.log('POST Route Error')
        console.log(error)
        res.status(500).send({ error })
    }
})

app.listen(PORT, (err) => {
    if (err) {
        console.log('Some Error generated from server side')
    }
    console.log(`server is listening at PORT http://localhost:${PORT}`)
})
