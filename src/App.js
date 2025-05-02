import React, { useState, useEffect } from 'react';
import './App.css';
import QuizContainer from './components/QuizContainer';
import Statistics from './components/Statistics';
import LoadingOverlay from './components/LoadingOverlay';
import Simulation from './components/Simulation';
import CustomSimulation from './components/CustomSimulation';
import FutureImplementationsModal from './components/FutureImplementationsModal';
import { Analytics } from '@vercel/analytics/react';
import './styles/InfoButton.css';

const isElectron = window?.electron !== undefined;

function App() {
  // State for app mode and chapter selection
  const [appMode, setAppMode] = useState('quiz'); // 'quiz', 'simulation', or 'customSimulation'
  const [activeChapter, setActiveChapter] = useState('cap1');
  const [selectedYear] = useState('2025'); // Fixed to 2025
  const [randomizeAnswers, setRandomizeAnswers] = useState(true); // Default to randomized answers
  const [modalOpen, setModalOpen] = useState(false); // State for modal visibility
  
  // State for question sets
  const [questions, setQuestions] = useState([]);
  const [questionsChapter2, setQuestionsChapter2] = useState([]);
  const [questionsChapter3, setQuestionsChapter3] = useState([]);
  const [questionsChapter4, setQuestionsChapter4] = useState([]);
  const [questionsChapter5, setQuestionsChapter5] = useState([]);
  const [questionsChapter6, setQuestionsChapter6] = useState([]);
  const [questionsChapter7, setQuestionsChapter7] = useState([]);
  const [questionsChapter8, setQuestionsChapter8] = useState([]);
  const [questionsChapter9, setQuestionsChapter9] = useState([]);
  const [questionsChapter10, setQuestionsChapter10] = useState([]);
  const [questionsChapter11, setQuestionsChapter11] = useState([]);
  const [questionsChapter12, setQuestionsChapter12] = useState([]);
  const [questionsChapter13, setQuestionsChapter13] = useState([]);
  const [questionsChapter14, setQuestionsChapter14] = useState([]);
  const [questionsChapter15, setQuestionsChapter15] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  
  // State for correct answers from all chapters
  const [correctAnswers, setCorrectAnswers] = useState({});
  const [correctAnswersChapter2, setCorrectAnswersChapter2] = useState({});
  const [correctAnswersChapter3, setCorrectAnswersChapter3] = useState({});
  const [correctAnswersChapter4, setCorrectAnswersChapter4] = useState({});
  const [correctAnswersChapter5, setCorrectAnswersChapter5] = useState({});
  const [correctAnswersChapter6, setCorrectAnswersChapter6] = useState({});
  const [correctAnswersChapter7, setCorrectAnswersChapter7] = useState({});
  const [correctAnswersChapter8, setCorrectAnswersChapter8] = useState({});
  const [correctAnswersChapter9, setCorrectAnswersChapter9] = useState({});
  const [correctAnswersChapter10, setCorrectAnswersChapter10] = useState({});
  const [correctAnswersChapter11, setCorrectAnswersChapter11] = useState({});
  const [correctAnswersChapter12, setCorrectAnswersChapter12] = useState({});
  const [correctAnswersChapter13, setCorrectAnswersChapter13] = useState({});
  const [correctAnswersChapter14, setCorrectAnswersChapter14] = useState({});
  const [correctAnswersChapter15, setCorrectAnswersChapter15] = useState({});
  
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    correctCount: 0,
    totalCount: 0,
    bookmarkedCount: 0
  });
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState(new Set());
  const [error, setError] = useState(null);

  // State for loading and errors per chapter
  const [chapterLoadingStates, setChapterLoadingStates] = useState({
    cap1: true,
    cap2: true,
    cap3: true,
    cap4: true,
    cap5: true,
    cap6: true,
    cap7: true,
    cap8: true,
    cap9: true,
    cap10: true,
    cap11: true,
    cap12: true,
    cap13: true,
    cap14: true,
    cap15: true
  });

  const [chapterErrors, setChapterErrors] = useState({});

  // Add state for available chapters
  const [availableChapters, setAvailableChapters] = useState([]);

  // Helper function to update loading state for a chapter
  const setChapterLoading = (chapter, isLoading) => {
    setChapterLoadingStates(prev => ({
      ...prev,
      [chapter]: isLoading
    }));
  };

  // Helper function to update error state for a chapter
  const setChapterError = (chapter, error) => {
    setChapterErrors(prev => ({
      ...prev,
      [chapter]: error
    }));
  };

  // Load all chapters data
  useEffect(() => {
    const loadChapters = async () => {
      try {
        const loadJsonFile = async (path) => {
          try {
            const fullPath = `${process.env.PUBLIC_URL}/${path}`;
            console.log(`Attempting to load file from: ${fullPath}`);
            const response = await fetch(fullPath);
            
            if (!response.ok) {
              throw new Error(`Failed to load file: ${path} (Status: ${response.status})`);
            }
            
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
              console.warn(`Response is not JSON: ${path} (Content-Type: ${contentType})`);
            }
            
            const data = await response.json();
            return data;
          } catch (error) {
            console.error(`Error loading file ${path}:`, error);
            setChapterError(path.replace('/capitole/cap', '').replace('.json', ''), error.message);
            return null;
          }
        };

        // Function to load answer files
        const loadAnswerFile = async (chapterNum) => {
          try {
            const fullPath = `${process.env.PUBLIC_URL}/capitole/${selectedYear}/cap${chapterNum}_raspunsuri`;
            console.log(`Attempting to load answer file from: ${fullPath}`);
            const response = await fetch(fullPath);
            
            if (!response.ok) {
              throw new Error(`Failed to load answer file: ${fullPath} (Status: ${response.status})`);
            }
            
            const text = await response.text();
            
            // Parse answer strings format
            const parseAnswers = (answerStr) => {
              const answers = {};
              answerStr.split(';').forEach(item => {
                const parts = item.trim().split('.');
                if (parts.length === 2) {
                  const questionNumber = parseInt(parts[0]);
                  const answer = parts[1];
                  answers[questionNumber] = answer;
                }
              });
              return answers;
            };
            
            return parseAnswers(text);
          } catch (error) {
            console.error(`Error loading answer file for chapter ${chapterNum}:`, error);
            return {};
          }
        };

        // Load all JSON files from the selected year
        const chapters = [];
        const loadChapter = async (chapterNum) => {
          const data = await loadJsonFile(`capitole/${selectedYear}/cap${chapterNum}.json`);
          if (data) {
            chapters.push(chapterNum);
            
            // Load the answer file for this chapter
            const answers = await loadAnswerFile(chapterNum);
            
            // Set the questions and answers
            switch(chapterNum) {
              case 1: 
                setQuestions(data); 
                setCorrectAnswers(answers);
                break;
              case 2: 
                setQuestionsChapter2(data); 
                setCorrectAnswersChapter2(answers);
                break;
              case 3: 
                setQuestionsChapter3(data); 
                setCorrectAnswersChapter3(answers);
                break;
              case 4: 
                setQuestionsChapter4(data); 
                setCorrectAnswersChapter4(answers);
                break;
              case 5: 
                setQuestionsChapter5(data); 
                setCorrectAnswersChapter5(answers);
                break;
              case 6: 
                setQuestionsChapter6(data); 
                setCorrectAnswersChapter6(answers);
                break;
              case 7: 
                setQuestionsChapter7(data); 
                setCorrectAnswersChapter7(answers);
                break;
              case 8: 
                setQuestionsChapter8(data); 
                setCorrectAnswersChapter8(answers);
                break;
              case 9: 
                setQuestionsChapter9(data); 
                setCorrectAnswersChapter9(answers);
                break;
              case 10: 
                setQuestionsChapter10(data); 
                setCorrectAnswersChapter10(answers);
                break;
              case 11: 
                setQuestionsChapter11(data); 
                setCorrectAnswersChapter11(answers);
                break;
              case 12: 
                setQuestionsChapter12(data); 
                setCorrectAnswersChapter12(answers);
                break;
              case 13: 
                setQuestionsChapter13(data); 
                setCorrectAnswersChapter13(answers);
                break;
              case 14: 
                setQuestionsChapter14(data); 
                setCorrectAnswersChapter14(answers);
                break;
              case 15: 
                setQuestionsChapter15(data); 
                setCorrectAnswersChapter15(answers);
                break;
            }
          }
        };

        // Load all chapters in parallel
        await Promise.all([
          loadChapter(1), loadChapter(2), loadChapter(3), loadChapter(4),
          loadChapter(5), loadChapter(6), loadChapter(7), loadChapter(8),
          loadChapter(9), loadChapter(10), loadChapter(11), loadChapter(12),
          loadChapter(13), loadChapter(14), loadChapter(15)
        ]);

        // Update available chapters
        setAvailableChapters(chapters.sort((a, b) => a - b));

        // If the current active chapter is not available, switch to the first available chapter
        if (!chapters.includes(parseInt(activeChapter.replace('cap', '')))) {
          setActiveChapter(`cap${chapters[0]}`);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error loading chapters:', error);
        setChapterError('general', 'Failed to load chapters');
        setIsLoading(false);
      }
    };

    loadChapters();
  }, [selectedYear]);

  // Helper function to safely interact with localStorage
  const safeStorage = {
    getItem: (key) => {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        return null;
      }
    },
    setItem: (key, value) => {
      try {
        localStorage.setItem(key, value);
        return true;
      } catch (e) {
        return false;
      }
    }
  };

  // Încărcăm întrebările salvate din localStorage
  useEffect(() => {
    const savedItems = safeStorage.getItem('bookmarkedQuestions');
    if (savedItems) {
      try {
        const parsedItems = JSON.parse(savedItems);
        const bookmarks = new Set(parsedItems);
        setBookmarkedQuestions(bookmarks);
        
        // Update bookmarked count in stats
        setStats(prevStats => ({
          ...prevStats,
          bookmarkedCount: bookmarks.size
        }));
      } catch (e) {
        console.error('Eroare la încărcarea întrebărilor salvate:', e);
      }
    }
  }, []);

  // Actualizăm numărul de întrebări salvate când se modifică bookmarkedQuestions
  useEffect(() => {
    setStats(prev => ({
      ...prev,
      bookmarkedCount: bookmarkedQuestions.size
    }));
    
    // Salvăm întrebările marcate în localStorage
    try {
      safeStorage.setItem('bookmarkedQuestions', JSON.stringify([...bookmarkedQuestions]));
    } catch (e) {
      console.warn('Could not save bookmarks:', e);
    }
  }, [bookmarkedQuestions]);

  // Load quiz statistics from localStorage on mount
  useEffect(() => {
    const savedStats = safeStorage.getItem('quizStats');
    if (savedStats) {
      try {
        const parsedStats = JSON.parse(savedStats);
        setStats(parsedStats);
      } catch (e) {
        console.error('Eroare la încărcarea statisticilor de quiz:', e);
      }
    }
  }, []);

  // Save quiz statistics to localStorage whenever they change
  useEffect(() => {
    safeStorage.setItem('quizStats', JSON.stringify(stats));
  }, [stats]);

  // Funcția pentru schimbarea modului aplicației
  const switchAppMode = (mode) => {
    setAppMode(mode);
  };

  // Update switchChapter function to handle new chapters
  const switchChapter = (chapter) => {
    setActiveChapter(chapter);
    switch(chapter) {
      case 'cap1':
        setFilteredQuestions(questions);
        break;
      case 'cap2':
        setFilteredQuestions(questionsChapter2);
        break;
      case 'cap3':
        setFilteredQuestions(questionsChapter3);
        break;
      case 'cap4':
        setFilteredQuestions(questionsChapter4);
        break;
      case 'cap5':
        setFilteredQuestions(questionsChapter5);
        break;
      case 'cap6':
        setFilteredQuestions(questionsChapter6);
        break;
      case 'cap7':
        setFilteredQuestions(questionsChapter7);
        break;
      case 'cap8':
        setFilteredQuestions(questionsChapter8);
        break;
      case 'cap9':
        setFilteredQuestions(questionsChapter9);
        break;
      case 'cap10':
        setFilteredQuestions(questionsChapter10);
        break;
      case 'cap11':
        setFilteredQuestions(questionsChapter11);
        break;
      case 'cap12':
        setFilteredQuestions(questionsChapter12);
        break;
      case 'cap13':
        setFilteredQuestions(questionsChapter13);
        break;
      case 'cap14':
        setFilteredQuestions(questionsChapter14);
        break;
      case 'cap15':
        setFilteredQuestions(questionsChapter15);
        break;
      default:
        setFilteredQuestions([]);
    }
  };

  // Funcția de căutare în întrebări
  const searchQuestions = (query) => {
    if (!query.trim()) {
      // Reset based on active chapter
      switch(activeChapter) {
        case 'cap1':
          setFilteredQuestions([...questions]);
          break;
        case 'cap2':
          setFilteredQuestions([...questionsChapter2]);
          break;
        case 'cap3':
          setFilteredQuestions([...questionsChapter3]);
          break;
        case 'cap4':
          setFilteredQuestions([...questionsChapter4]);
          break;
        case 'cap5':
          setFilteredQuestions([...questionsChapter5]);
          break;
        case 'cap6':
          setFilteredQuestions([...questionsChapter6]);
          break;
        case 'cap7':
          setFilteredQuestions([...questionsChapter7]);
          break;
        case 'cap8':
          setFilteredQuestions([...questionsChapter8]);
          break;
        case 'cap9':
          setFilteredQuestions([...questionsChapter9]);
          break;
        case 'cap10':
          setFilteredQuestions([...questionsChapter10]);
          break;
        case 'cap11':
          setFilteredQuestions([...questionsChapter11]);
          break;
        case 'cap12':
          setFilteredQuestions([...questionsChapter12]);
          break;
        case 'cap13':
          setFilteredQuestions([...questionsChapter13]);
          break;
        case 'cap14':
          setFilteredQuestions([...questionsChapter14]);
          break;
        case 'cap15':
          setFilteredQuestions([...questionsChapter15]);
          break;
      }
      return true;
    }
    
    query = query.toLowerCase();
    
    // Select the appropriate question set based on active chapter
    let currentQuestions;
    switch(activeChapter) {
      case 'cap1':
        currentQuestions = questions;
        break;
      case 'cap2':
        currentQuestions = questionsChapter2;
        break;
      case 'cap3':
        currentQuestions = questionsChapter3;
        break;
      case 'cap4':
        currentQuestions = questionsChapter4;
        break;
      case 'cap5':
        currentQuestions = questionsChapter5;
        break;
      case 'cap6':
        currentQuestions = questionsChapter6;
        break;
      case 'cap7':
        currentQuestions = questionsChapter7;
        break;
      case 'cap8':
        currentQuestions = questionsChapter8;
        break;
      case 'cap9':
        currentQuestions = questionsChapter9;
        break;
      case 'cap10':
        currentQuestions = questionsChapter10;
        break;
      case 'cap11':
        currentQuestions = questionsChapter11;
        break;
      case 'cap12':
        currentQuestions = questionsChapter12;
        break;
      case 'cap13':
        currentQuestions = questionsChapter13;
        break;
      case 'cap14':
        currentQuestions = questionsChapter14;
        break;
      case 'cap15':
        currentQuestions = questionsChapter15;
        break;
      default:
        currentQuestions = [];
    }
    
    const filtered = currentQuestions.filter(q => {
      // Căutăm după numărul întrebării
      if (q.numar.toString() === query) {
        return true;
      }
      
      // Căutăm în textul întrebării
      if (q.intrebare.toLowerCase().includes(query)) {
        return true;
      }
      
      // Căutăm în variante
      for (const text of Object.values(q.variante)) {
        if (text.toLowerCase().includes(query)) {
          return true;
        }
      }
      
      return false;
    });
    
    setFilteredQuestions(filtered);
    
    return filtered.length > 0;
  };

  // Funcția pentru actualizarea statisticilor
  const updateStats = (isCorrect) => {
    setStats(prev => ({
      ...prev,
      correctCount: isCorrect ? prev.correctCount + 1 : prev.correctCount,
      totalCount: prev.totalCount + 1
    }));
  };

  // Funcția pentru resetarea statisticilor
  const resetStats = () => {
    setStats(prev => ({
      ...prev,
      correctCount: 0,
      totalCount: 0
    }));
  };

  // Funcția pentru toggle bookmark
  const toggleBookmark = (questionNumber) => {
    setBookmarkedQuestions(prev => {
      const newBookmarks = new Set(prev);
      const wasBookmarked = newBookmarks.has(questionNumber);
      
      if (wasBookmarked) {
        newBookmarks.delete(questionNumber);
      } else {
        newBookmarks.add(questionNumber);
      }
      
      // Update bookmarked count in stats
      setStats(prevStats => ({
        ...prevStats,
        bookmarkedCount: wasBookmarked ? prevStats.bookmarkedCount - 1 : prevStats.bookmarkedCount + 1
      }));
      
      return newBookmarks;
    });
  };

  // Function to toggle answer randomization
  const toggleRandomizeAnswers = () => {
    const newValue = !randomizeAnswers;
    setRandomizeAnswers(newValue);
    // Save preference to localStorage
    try {
      localStorage.setItem('randomizeAnswers', JSON.stringify(newValue));
    } catch (e) {
      console.warn('Could not save answer randomization preference:', e);
    }
  };

  // Load randomization preference from localStorage
  useEffect(() => {
    try {
      const savedRandomizePref = localStorage.getItem('randomizeAnswers');
      if (savedRandomizePref !== null) {
        setRandomizeAnswers(JSON.parse(savedRandomizePref));
      } else {
        // Explicitly set to true if no preference is stored
        setRandomizeAnswers(true);
        localStorage.setItem('randomizeAnswers', JSON.stringify(true));
      }
    } catch (e) {
      console.warn('Could not load answer randomization preference:', e);
      // Default to true in case of error
      setRandomizeAnswers(true);
    }
  }, []);

  // Function to toggle modal visibility
  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  if (isLoading) {
    const loadedChapters = Object.values(chapterLoadingStates).filter(state => !state).length;
    const totalChapters = Object.keys(chapterLoadingStates).length;
    return (
      <LoadingOverlay 
        progress={Math.round((loadedChapters / totalChapters) * 100)} 
        errors={chapterErrors}
      />
    );
  }

  if (error) {
    return <div className="error-message">Eroare: {error}</div>;
  }

  // Prepare data for simulation mode
  const allChaptersData = {
    cap1: questions,
    cap2: questionsChapter2,
    cap3: questionsChapter3,
    cap4: questionsChapter4,
    cap5: questionsChapter5,
    cap6: questionsChapter6,
    cap7: questionsChapter7,
    cap8: questionsChapter8,
    cap9: questionsChapter9,
    cap10: questionsChapter10,
    cap11: questionsChapter11,
    cap12: questionsChapter12,
    cap13: questionsChapter13,
    cap14: questionsChapter14,
    cap15: questionsChapter15
  };
  
  const correctAnswersData = {
    cap1: correctAnswers,
    cap2: correctAnswersChapter2,
    cap3: correctAnswersChapter3,
    cap4: correctAnswersChapter4,
    cap5: correctAnswersChapter5,
    cap6: correctAnswersChapter6,
    cap7: correctAnswersChapter7,
    cap8: correctAnswersChapter8,
    cap9: correctAnswersChapter9,
    cap10: correctAnswersChapter10,
    cap11: correctAnswersChapter11,
    cap12: correctAnswersChapter12,
    cap13: correctAnswersChapter13,
    cap14: correctAnswersChapter14,
    cap15: correctAnswersChapter15
  };
  
  // Get the correct answers based on active chapter
  let currentAnswers;
  let currentQuestionSet;
  
  switch(activeChapter) {
    case 'cap1':
      currentAnswers = correctAnswers;
      currentQuestionSet = questions;
      break;
    case 'cap2':
      currentAnswers = correctAnswersChapter2;
      currentQuestionSet = questionsChapter2;
      break;
    case 'cap3':
      currentAnswers = correctAnswersChapter3;
      currentQuestionSet = questionsChapter3;
      break;
    case 'cap4':
      currentAnswers = correctAnswersChapter4;
      currentQuestionSet = questionsChapter4;
      break;
    case 'cap5':
      currentAnswers = correctAnswersChapter5;
      currentQuestionSet = questionsChapter5;
      break;
    case 'cap6':
      currentAnswers = correctAnswersChapter6;
      currentQuestionSet = questionsChapter6;
      break;
    case 'cap7':
      currentAnswers = correctAnswersChapter7;
      currentQuestionSet = questionsChapter7;
      break;
    case 'cap8':
      currentAnswers = correctAnswersChapter8;
      currentQuestionSet = questionsChapter8;
      break;
    case 'cap9':
      currentAnswers = correctAnswersChapter9;
      currentQuestionSet = questionsChapter9;
      break;
    case 'cap10':
      currentAnswers = correctAnswersChapter10;
      currentQuestionSet = questionsChapter10;
      break;
    case 'cap11':
      currentAnswers = correctAnswersChapter11;
      currentQuestionSet = questionsChapter11;
      break;
    case 'cap12':
      currentAnswers = correctAnswersChapter12;
      currentQuestionSet = questionsChapter12;
      break;
    case 'cap13':
      currentAnswers = correctAnswersChapter13;
      currentQuestionSet = questionsChapter13;
      break;
    case 'cap14':
      currentAnswers = correctAnswersChapter14;
      currentQuestionSet = questionsChapter14;
      break;
    case 'cap15':
      currentAnswers = correctAnswersChapter15;
      currentQuestionSet = questionsChapter15;
      break;
    default:
      currentAnswers = {};
      currentQuestionSet = [];
  }

  return (
    <div className="App">
      <Analytics />
      
      {/* Info Button */}
      <button className="info-button pulse-animation" onClick={toggleModal}>i</button>
      
      {/* Future Implementations Modal */}
      <FutureImplementationsModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
      
      <header className="App-header">
        <h1>Grile Admitere Timisoara Biologie 2025</h1>
        <a href="https://revolut.me/dragoscdk" target="_blank" rel="noopener noreferrer" className="donate-button">
          Donează
        </a>
        
        <div className="app-mode-selector">
          <button 
            className={`mode-btn ${appMode === 'quiz' ? 'active' : ''}`}
            onClick={() => switchAppMode('quiz')}
          >
            Grile
          </button>
          <button 
            className={`mode-btn ${appMode === 'simulation' ? 'active' : ''}`}
            onClick={() => switchAppMode('simulation')}
          >
            Simulare Examen
          </button>
          <button 
            className={`mode-btn ${appMode === 'customSimulation' ? 'active' : ''}`}
            onClick={() => switchAppMode('customSimulation')}
          >
            Simulare Personalizată
          </button>
        </div>
      </header>
      
      {appMode === 'quiz' && (
        <div>
          <div className="chapter-selector">
            <select 
              className="chapter-dropdown"
              value={activeChapter}
              onChange={(e) => switchChapter(e.target.value)}
            >
              {availableChapters.map(chapterNum => (
                <option key={chapterNum} value={`cap${chapterNum}`}>
                  Capitolul {chapterNum}
                </option>
              ))}
            </select>
          </div>
          
          <div className="quiz-options">
            <div className="answer-order-toggle-container">
              <p className="toggle-description">Ordine răspunsuri:</p>
              <div className="answer-order-toggle">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={randomizeAnswers} 
                    onChange={toggleRandomizeAnswers}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <span className="toggle-label">
                  {randomizeAnswers ? 'Răspunsuri aleatorii' : 'Răspunsuri ordonate'}
                </span>
              </div>
            </div>
          </div>
          
          <QuizContainer
            questions={currentQuestionSet}
            filteredQuestions={filteredQuestions}
            correctAnswers={currentAnswers}
            bookmarkedQuestions={bookmarkedQuestions}
            updateStats={(isCorrect) => updateStats(isCorrect)}
            toggleBookmark={toggleBookmark}
            searchQuestions={searchQuestions}
            randomizeAnswers={randomizeAnswers}
          />
        </div>
      )}
      
      <main>
        {appMode === 'quiz' ? (
          <>
            <Statistics
              correctCount={stats.correctCount}
              totalCount={stats.totalCount}
              bookmarkedCount={stats.bookmarkedCount}
              resetStats={resetStats}
            />
          </>
        ) : appMode === 'simulation' ? (
          <Simulation 
            allChaptersData={allChaptersData}
            correctAnswersData={correctAnswersData}
            onExit={() => switchAppMode('quiz')}
          />
        ) : (
          <CustomSimulation 
            allChaptersData={allChaptersData}
            correctAnswersData={correctAnswersData}
            onExit={() => switchAppMode('quiz')}
          />
        )}
      </main>
      
      <footer className="App-footer">
        <div className="footer-content">
          <p>Grile Admitere Timisoara Biologie</p>
        </div>
      </footer>
    </div>
  );
}

export default App; 