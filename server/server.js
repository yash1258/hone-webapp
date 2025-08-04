// server.js

// --- 1. Import Dependencies ---
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const pdf = require('pdf-parse');
const fs = require('fs');
const { GoogleGenerativeAI } = require("@google/generative-ai");
// NEW: Import and configure dotenv to manage environment variables
require('dotenv').config();

// --- 2. Initialize the Application & AI ---
const app = express();
const PORT = process.env.PORT || 3001;

// SECURE: Load API Key from .env file
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro"});

const upload = multer({ dest: 'uploads/' });

// --- 3. Configure Middleware ---
app.use(cors());
app.use(express.json());

// --- 4. Connect to MongoDB ---
// SECURE: Load Connection String from .env file
const dbConnectionString = process.env.DB_CONNECTION_STRING;
mongoose.connect(dbConnectionString)
  .then(() => console.log('✅ Successfully connected to MongoDB Atlas.'))
  .catch(err => console.error('❌ Could not connect to MongoDB Atlas.', err));

// --- 5. Define Data Schemas (Models) ---
const noteSchema = new mongoose.Schema({ name: { type: String, required: true }, date: { type: String, required: true }});
const Note = mongoose.model('Note', noteSchema);

const audioFileSchema = new mongoose.Schema({ name: { type: String, required: true }, date: { type: String, required: true }});
const AudioFile = mongoose.model('AudioFile', audioFileSchema);

const quizSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: String, required: true },
    questions: { type: Array, default: [] }, 
    status: { type: String, required: true, default: "Ready to Process" },
});
const Quiz = mongoose.model('Quiz', quizSchema);


// --- 6. Define API Routes ---

// -- Notes, Audio, and GET Quizzes Routes (No Changes) --
app.get('/api/notes', async (req, res) => { try { const notes = await Note.find(); res.json(notes); } catch (error) { res.status(500).json({ message: 'Error fetching notes' }); }});
app.post('/api/notes', async (req, res) => { try { const newNote = new Note(req.body); const savedNote = await newNote.save(); res.status(201).json(savedNote); } catch (error) { res.status(400).json({ message: 'Error saving note' }); }});
app.get('/api/audio', async (req, res) => { try { const audioFiles = await AudioFile.find(); res.json(audioFiles); } catch (error) { res.status(500).json({ message: 'Error fetching audio files' }); }});
app.post('/api/audio', async (req, res) => { try { const newAudioFile = new AudioFile(req.body); const savedAudioFile = await newAudioFile.save(); res.status(201).json(savedAudioFile); } catch (error) { res.status(400).json({ message: 'Error saving audio file' }); }});
app.get('/api/quizzes', async (req, res) => { try { const quizzes = await Quiz.find(); res.json(quizzes); } catch (error) { res.status(500).json({ message: 'Error fetching quizzes' }); }});

// *** UPDATED: Quiz upload endpoint with AI processing ***
app.post('/api/quizzes/upload', upload.single('quizFile'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        // Step 1: Parse text from the uploaded PDF
        const dataBuffer = fs.readFileSync(req.file.path);
        const data = await pdf(dataBuffer);
        const extractedText = data.text;
        console.log("--- PDF Text Parsed Successfully ---");

        // Step 2: Call the Gemini API to convert text to JSON
        console.log("Calling Gemini API...");
        const prompt = `
            You are an expert assistant for an IIT-JEE student. Analyze the following text from a quiz document.
            Convert it into a structured JSON array of questions. Each object in the array must have these exact properties: "questionText", "options" (an array of 4 strings), "correctAnswer" (the 0-indexed integer of the correct option), and "explanation".
            Ensure the output is ONLY the raw JSON array, without any surrounding text, markdown, or explanations.
            Here is the text:
            ---
            ${extractedText}
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const aiResponseText = response.text();
        
        // Clean the response to ensure it's valid JSON
        const cleanedJsonString = aiResponseText.replace(/```json\n|```/g, '').trim();
        const parsedQuestions = JSON.parse(cleanedJsonString);
        console.log("--- AI Response Parsed Successfully ---");

        // Step 3: Save the fully processed quiz to the database
        const newQuiz = new Quiz({
            name: req.file.originalname,
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            questions: parsedQuestions,
            status: `Processed: ${parsedQuestions.length} questions`,
        });

        const savedQuiz = await newQuiz.save();
        console.log("--- Quiz Saved to Database ---");

        // Step 4: Send the complete quiz object back to the front-end
        res.status(201).json(savedQuiz);

    } catch (error) {
        console.error("Error during quiz processing:", error);
        res.status(500).send("Error processing the file. Check server logs for details.");
    } finally {
        // Clean up the temporary file
        fs.unlinkSync(req.file.path);
    }
});


// --- 7. Start the Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
