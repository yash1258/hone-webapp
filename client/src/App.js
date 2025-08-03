import React, { useState, useRef, useEffect } from 'react';

// --- ICONS ---
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
);
const BookOpenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
);
const MusicIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
);
const PuzzleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 7V4.5a2.5 2.5 0 0 0-5 0V7" /><path d="M18 12.5a2.5 2.5 0 0 0-2.5-2.5h-3a2.5 2.5 0 0 0 0 5h3a2.5 2.5 0 0 1 0 5h-3a2.5 2.5 0 0 1-2.5-2.5V14" /><path d="M10 7V4.5a2.5 2.5 0 0 0-5 0V7" /><path d="M6 12.5a2.5 2.5 0 0 0-2.5-2.5h-1A2.5 2.5 0 0 0 0 12.5v1A2.5 2.5 0 0 0 2.5 16h1a2.5 2.5 0 0 1 2.5 2.5v1a2.5 2.5 0 0 1-5 0V19" /><path d="M21.5 16a2.5 2.5 0 0 0-2.5-2.5h-1a2.5 2.5 0 0 0-2.5 2.5v1a2.5 2.5 0 0 0 2.5 2.5h1a2.5 2.5 0 0 1 2.5 2.5v1a2.5 2.5 0 0 1-5 0v-1.5" /></svg>
);
const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
);
const UploadCloudIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" /><path d="M12 12v9" /><path d="m16 16-4-4-4 4" /></svg>
);

// --- Page Components ---

const Dashboard = ({ notes, quizzes, audioFiles }) => (
  <div>
    <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-md"><h2 className="text-xl font-semibold text-gray-700 mb-2">Notes Uploaded</h2><p className="text-4xl font-bold text-blue-500">{notes.length}</p></div>
      <div className="bg-white p-6 rounded-xl shadow-md"><h2 className="text-xl font-semibold text-gray-700 mb-2">Audio Summaries</h2><p className="text-4xl font-bold text-green-500">{audioFiles.length}</p></div>
      <div className="bg-white p-6 rounded-xl shadow-md"><h2 className="text-xl font-semibold text-gray-700 mb-2">Quizzes Available</h2><p className="text-4xl font-bold text-purple-500">{quizzes.length}</p></div>
    </div>
    <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Activity</h2>
      <ul className="space-y-3">
        {notes.length > 0 && <li className="flex items-center text-gray-600"><BookOpenIcon /> <span className="ml-3">Last note: {notes[notes.length - 1].name}</span></li>}
        {audioFiles.length > 0 && <li className="flex items-center text-gray-600"><MusicIcon /> <span className="ml-3">Last audio: {audioFiles[audioFiles.length - 1].name}</span></li>}
        {quizzes.length > 0 && <li className="flex items-center text-gray-600"><PuzzleIcon /> <span className="ml-3">Last quiz: {quizzes[quizzes.length - 1].name}</span></li>}
      </ul>
    </div>
  </div>
);

const Notes = ({ notes, setNotes }) => {
  const fileInputRef = useRef(null);
  const handleUploadClick = () => { fileInputRef.current.click(); };
  const handleFileSelected = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const newNoteData = { name: file.name, date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) };
    try {
      const response = await fetch('http://localhost:3001/api/notes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newNoteData) });
      if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.message || 'Failed to save note'); }
      const savedNote = await response.json();
      setNotes(prev => [...prev, savedNote]);
    } catch (error) { console.error("Note upload error:", error); alert(`Error: ${error.message}`); }
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Notes</h1>
        <input type="file" ref={fileInputRef} onChange={handleFileSelected} className="hidden" accept=".pdf,.doc,.docx,.txt,.jpg,.png" />
        <button onClick={handleUploadClick} className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 shadow-md">
          <UploadCloudIcon />
          <span className="ml-2">Upload New Note</span></button></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.length > 0 ? notes.map(note => (
          <div key={note._id} className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 className="font-semibold text-lg text-gray-700 break-all">{note.name}</h3>
            <p className="text-sm text-gray-500 mt-1">Uploaded: {note.date}</p>
            </div>)) : <p className="text-gray-500 col-span-full">No notes uploaded yet.</p>}
      </div>
    </div>
  );
};

const AudioSummaries = ({ audioFiles, setAudioFiles }) => {
    const fileInputRef = useRef(null);
    const handleUploadClick = () => { fileInputRef.current.click(); };
    const handleFileSelected = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const newAudioData = { name: file.name, date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) };
        try {
            const response = await fetch('http://localhost:3001/api/audio', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newAudioData) });
            if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.message || 'Failed to save audio file'); }
            const savedAudio = await response.json();
            setAudioFiles(prev => [...prev, savedAudio]);
        } catch (error) { console.error("Audio upload error:", error); alert(`Error: ${error.message}`); }
    };
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Audio Summaries</h1>
              <input type="file" ref={fileInputRef} onChange={handleFileSelected} className="hidden" accept=".mp3,.wav,.m4a" />
              <button onClick={handleUploadClick} className="flex items-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 shadow-md">
                <UploadCloudIcon /><span className="ml-2">Upload Audio</span>
                </button>
                </div>
            <div className="space-y-4">
                {audioFiles.length > 0 ? audioFiles.map(audio => (<div key={audio._id} className="bg-white p-4 rounded-xl shadow-md flex items-center justify-between hover:shadow-lg transition-shadow duration-300">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-700 break-all">{audio.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">Uploaded: {audio.date}</p>
                    </div>
                    <button className="bg-gray-200 hover:bg-gray-300 p-3 rounded-full transition duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="currentColor" className="text-gray-700">
                      <path d="M8 5v14l11-7z"/>
                      </svg>
                      </button></div>)) : <p className="text-gray-500">No audio summaries uploaded yet.</p>}
            </div>
        </div>
    );
};

const Quizzes = ({ quizzes, setQuizzes, onStartTest }) => {
    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleUploadClick = () => { fileInputRef.current.click(); };

    const handleFileSelected = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('quizFile', file);

        try {
            const response = await fetch('http://localhost:3001/api/quizzes/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to upload and process quiz file');
            }

            const savedQuiz = await response.json();
            setQuizzes(prev => [...prev, savedQuiz]);
            alert(`Quiz "${savedQuiz.name}" processed and saved successfully!`);

        } catch (error) {
            console.error("Quiz upload error:", error);
            alert(`Error: ${error.message}`);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">My Quizzes</h1>
                <input type="file" ref={fileInputRef} onChange={handleFileSelected} className="hidden" accept=".pdf" disabled={isUploading} />
                <button onClick={handleUploadClick} className="flex items-center bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 shadow-md disabled:bg-gray-400" disabled={isUploading}>
                    {isUploading ? 'Processing...' : <><UploadCloudIcon /><span className="ml-2">Upload New Quiz</span></>}
                </button>
            </div>
            <div className="space-y-4">
                {quizzes.length > 0 ? quizzes.map(quiz => (
                    <div key={quiz._id} className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-lg text-gray-700 break-all">{quiz.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                {quiz.questions?.length > 0 ? `${quiz.questions.length} Questions` : `Status: ${quiz.status}`}
                            </p>
                        </div>
                        <button onClick={() => onStartTest(quiz)} className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 disabled:bg-gray-400" disabled={!quiz.questions || quiz.questions.length === 0}>Start Test</button>
                    </div>
                )) : <p className="text-gray-500">No quizzes uploaded yet.</p>}
            </div>
        </div>
    );
};

// *** NEW: Quiz Taker Component ***
const QuizTaker = ({ quiz, onFinish }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const currentQuestion = quiz.questions[currentQuestionIndex];

    const handleAnswerSelect = (optionIndex) => {
        setUserAnswers({
            ...userAnswers,
            [currentQuestionIndex]: optionIndex,
        });
    };

    const handleNext = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmit = () => {
        let correctAnswers = 0;
        quiz.questions.forEach((q, index) => {
            if (userAnswers[index] === q.correctAnswer) {
                correctAnswers++;
            }
        });
        setScore(correctAnswers);
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Quiz Results</h1>
                <h2 className="text-xl text-gray-600 mb-6">{quiz.name}</h2>
                <p className="text-5xl font-bold text-center text-blue-500 mb-8">
                    {score} / {quiz.questions.length}
                </p>
                <div className="space-y-6">
                    {quiz.questions.map((q, index) => (
                        <div key={index} className={`p-4 rounded-lg ${userAnswers[index] === q.correctAnswer ? 'bg-green-100 border-l-4 border-green-500' : 'bg-red-100 border-l-4 border-red-500'}`}>
                            <p className="font-semibold text-gray-800">{index + 1}. {q.questionText}</p>
                            <p className="text-sm mt-2">Your answer: <span className="font-medium">{q.options[userAnswers[index]] ?? 'Not answered'}</span></p>
                            <p className="text-sm">Correct answer: <span className="font-medium">{q.options[q.correctAnswer]}</span></p>
                            <p className="text-sm mt-2 text-gray-600"><i>Explanation: {q.explanation}</i></p>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-8">
                    <button onClick={onFinish} className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-6 rounded-lg transition duration-300">Back to Quizzes</button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{quiz.name}</h1>
            <p className="text-gray-500 mb-6">Question {currentQuestionIndex + 1} of {quiz.questions.length}</p>

            <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <p className="text-lg font-semibold text-gray-700">{currentQuestion.questionText}</p>
            </div>

            <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                    <button 
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${userAnswers[currentQuestionIndex] === index ? 'bg-blue-500 border-blue-500 text-white font-semibold' : 'bg-white hover:bg-gray-100 hover:border-gray-300'}`}
                    >
                        {option}
                    </button>
                ))}
            </div>

            <div className="flex justify-between items-center mt-8">
                <button onClick={handlePrevious} disabled={currentQuestionIndex === 0} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-6 rounded-lg transition duration-300 disabled:opacity-50">Previous</button>
                {currentQuestionIndex === quiz.questions.length - 1 ? (
                    <button onClick={handleSubmit} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300">Submit</button>
                ) : (
                    <button onClick={handleNext} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300">Next</button>
                )}
            </div>
        </div>
    );
};


// --- Main App Component (Manages State) ---
export default function App() {
  const [activePage, setActivePage] = useState('Dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null); // NEW: To manage which quiz is being taken

  const [notes, setNotes] = useState([]);
  const [audioFiles, setAudioFiles] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchData = async (endpoint, setter) => {
        try {
            const response = await fetch(`http://localhost:3001/api/${endpoint}`);
            if (!response.ok) throw new Error(`Failed to fetch ${endpoint}`);
            const data = await response.json();
            setter(data);
        } catch (error) { console.error(`Error fetching ${endpoint}:`, error); }
    };

    fetchData('notes', setNotes);
    fetchData('audio', setAudioFiles);
    fetchData('quizzes', setQuizzes);
  }, []);

  const handleStartTest = (quiz) => {
    setCurrentQuiz(quiz);
  };

  const handleFinishTest = () => {
    setCurrentQuiz(null);
  };

  // Main render logic now decides whether to show the dashboard or the quiz taker
  if (currentQuiz) {
    return (
        <div className="bg-gray-100 min-h-screen p-4 md:p-8 flex items-center justify-center">
            <QuizTaker quiz={currentQuiz} onFinish={handleFinishTest} />
        </div>
    );
  }

  const renderPage = () => {
    switch (activePage) {
      case 'Dashboard': return <Dashboard notes={notes} quizzes={quizzes} audioFiles={audioFiles} />;
      case 'Notes': return <Notes notes={notes} setNotes={setNotes} />;
      case 'Audio': return <AudioSummaries audioFiles={audioFiles} setAudioFiles={setAudioFiles} />;
      case 'Quizzes': return <Quizzes quizzes={quizzes} setQuizzes={setQuizzes} onStartTest={handleStartTest} />;
      default: return <Dashboard notes={notes} quizzes={quizzes} audioFiles={audioFiles} />;
    }
  };

  const NavLink = ({ pageName, icon, children }) => (
    <button onClick={() => { setActivePage(pageName); setSidebarOpen(false); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${activePage === pageName ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>{icon}<span>{children}</span></button>
  );

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <div className={`fixed inset-y-0 left-0 bg-gray-800 text-white w-64 p-6 space-y-6 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-30`}>
        <div className="flex items-center space-x-3"><div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg"><PuzzleIcon /></div><span className="text-2xl font-bold">JEE Hub</span></div>
        <nav className="space-y-2">
          <NavLink pageName="Dashboard" icon={<HomeIcon />}>Dashboard</NavLink>
          <NavLink pageName="Notes" icon={<BookOpenIcon />}>My Notes</NavLink>
          <NavLink pageName="Audio" icon={<MusicIcon />}>Audio Summaries</NavLink>
          <NavLink pageName="Quizzes" icon={<PuzzleIcon />}>Quizzes</NavLink>
        </nav>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm md:hidden"><div className="flex justify-between items-center p-4"><span className="text-xl font-bold text-gray-800">JEE Hub</span><button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-gray-600 focus:outline-none"><MenuIcon /></button></div></header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6 md:p-8">{renderPage()}</main>
      </div>
    </div>
  );
}