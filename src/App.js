import React, { useState, useEffect } from 'react';
import './App.css';
import QuizContainer from './components/QuizContainer';
import Statistics from './components/Statistics';
import LoadingOverlay from './components/LoadingOverlay';
import Simulation from './components/Simulation';
import CustomSimulation from './components/CustomSimulation';
import { Analytics } from '@vercel/analytics/react';

const isElectron = window?.electron !== undefined;

function App() {
  // State for app mode and chapter selection
  const [appMode, setAppMode] = useState('quiz'); // 'quiz', 'simulation', or 'customSimulation'
  const [activeChapter, setActiveChapter] = useState('cap1');
  const [randomizeAnswers, setRandomizeAnswers] = useState(true); // Default to randomized answers
  
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
    cap14: true
  });

  const [chapterErrors, setChapterErrors] = useState({});

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
        // Web browser fetch for questions in development
        const loadJsonFile = async (path) => {
          try {
            console.log(`Attempting to load file from: ${path}`);
            const response = await fetch(path);
            
            if (!response.ok) {
              throw new Error(`Failed to load file: ${path} (Status: ${response.status})`);
            }
            
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
              console.warn(`Response is not JSON: ${path} (Content-Type: ${contentType})`);
            }
            
            return await response.json();
          } catch (error) {
            console.error(`Error loading file ${path}:`, error);
            setChapterError(path.replace('/capitole/cap', '').replace('.json', ''), error.message);
            return [];
          }
        };

        // Load all JSON files
        const data1 = await loadJsonFile('./capitole/cap1.json');
        const data2 = await loadJsonFile('./capitole/cap2.json');
        const data3 = await loadJsonFile('./capitole/cap3.json');
        const data4 = await loadJsonFile('./capitole/cap4.json');
        const data5 = await loadJsonFile('./capitole/cap5.json');
        const data6 = await loadJsonFile('./capitole/cap6.json');
        const data7 = await loadJsonFile('./capitole/cap7.json');
        const data8 = await loadJsonFile('./capitole/cap8.json');
        const data9 = await loadJsonFile('./capitole/cap9.json');
        const data10 = await loadJsonFile('./capitole/cap10.json');
        const data11 = await loadJsonFile('./capitole/cap11.json');
        const data12 = await loadJsonFile('./capitole/cap12.json');
        const data13 = await loadJsonFile('./capitole/cap13.json');
        const data14 = await loadJsonFile('./capitole/cap14.json');
        
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
        
        // Load answer files for all chapters
        const loadAnswerFile = async (path) => {
          try {
            const response = await fetch(`./capitole/${path}`);
            
            if (!response.ok) {
              throw new Error(`Failed to load answer file: ${path} (Status: ${response.status})`);
            }
            
            const text = await response.text();
            return parseAnswers(text);
          } catch (error) {
            console.error(`Error loading answer file ${path}:`, error);
            setChapterError(path.replace('cap', '').replace('_raspunsuri', ''), error.message);
            return {};
          }
        };
        
        // Load all answer files
        const answersMap1 = await loadAnswerFile('cap1_raspunsuri');
        const answersMap2 = await loadAnswerFile('cap2_raspunsuri');
        const answersMap3 = await loadAnswerFile('cap3_raspunsuri');
        const answersMap4 = await loadAnswerFile('cap4_raspunsuri');
        const answersMap5 = await loadAnswerFile('cap5_raspunsuri');
        const answersMap6 = await loadAnswerFile('cap6_raspunsuri');
        const answersMap7 = await loadAnswerFile('cap7_raspunsuri');
        const answersMap8 = await loadAnswerFile('cap8_raspunsuri');
        const answersMap9 = await loadAnswerFile('cap9_raspunsuri');
        const answersMap10 = await loadAnswerFile('cap10_raspunsuri');
        const answersMap11 = await loadAnswerFile('cap11_raspunsuri');
        const answersMap12 = await loadAnswerFile('cap12_raspunsuri');
        const answersMap13 = await loadAnswerFile('cap13_raspunsuri');
        const answersMap14 = await loadAnswerFile('cap14_raspunsuri');
        
        // Set question data
        setQuestions(data1);
        setQuestionsChapter2(data2);
        setQuestionsChapter3(data3);
        setQuestionsChapter4(data4);
        setQuestionsChapter5(data5);
        setQuestionsChapter6(data6);
        setQuestionsChapter7(data7);
        setQuestionsChapter8(data8);
        setQuestionsChapter9(data9);
        setQuestionsChapter10(data10);
        setQuestionsChapter11(data11);
        setQuestionsChapter12(data12);
        setQuestionsChapter13(data13);
        setQuestionsChapter14(data14);
        
        // Set answers data
        setCorrectAnswers(answersMap1);
        setCorrectAnswersChapter2(answersMap2);
        setCorrectAnswersChapter3(answersMap3);
        setCorrectAnswersChapter4(answersMap4);
        setCorrectAnswersChapter5(answersMap5);
        setCorrectAnswersChapter6(answersMap6);
        setCorrectAnswersChapter7(answersMap7);
        setCorrectAnswersChapter8(answersMap8);
        setCorrectAnswersChapter9(answersMap9);
        setCorrectAnswersChapter10(answersMap10);
        setCorrectAnswersChapter11(answersMap11);
        setCorrectAnswersChapter12(answersMap12);
        setCorrectAnswersChapter13(answersMap13);
        setCorrectAnswersChapter14(answersMap14);
        
        // Update loading states for all chapters
        setChapterLoading('cap1', false);
        setChapterLoading('cap2', false);
        setChapterLoading('cap3', false);
        setChapterLoading('cap4', false);
        setChapterLoading('cap5', false);
        setChapterLoading('cap6', false);
        setChapterLoading('cap7', false);
        setChapterLoading('cap8', false);
        setChapterLoading('cap9', false);
        setChapterLoading('cap10', false);
        setChapterLoading('cap11', false);
        setChapterLoading('cap12', false);
        setChapterLoading('cap13', false);
        setChapterLoading('cap14', false);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching chapters:', error);
        setChapterError('general', 'Failed to load chapters');
        setIsLoading(false);
      }
    };

    loadChapters();
  }, []);

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
    cap14: questionsChapter14
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
    cap14: correctAnswersChapter14
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
    default:
      currentAnswers = {};
      currentQuestionSet = [];
  }

  return (
    <div className="App">
      <Analytics />
      <header className="App-header">
        <h1>Grile Admitere Timisoara Biologie 2024</h1>
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
        
        {appMode === 'quiz' && (
          <div>
            <div className="chapter-selector">
              <select 
                className="chapter-dropdown"
                value={activeChapter}
                onChange={(e) => switchChapter(e.target.value)}
              >
                <option value="cap1">Capitolul 1</option>
                <option value="cap2">Capitolul 2</option>
                <option value="cap3">Capitolul 3</option>
                <option value="cap4">Capitolul 4</option>
                <option value="cap5">Capitolul 5</option>
                <option value="cap6">Capitolul 6</option>
                <option value="cap7">Capitolul 7</option>
                <option value="cap8">Capitolul 8</option>
                <option value="cap9">Capitolul 9</option>
                <option value="cap10">Capitolul 10</option>
                <option value="cap11">Capitolul 11</option>
                <option value="cap12">Capitolul 12</option>
                <option value="cap13">Capitolul 13</option>
                <option value="cap14">Capitolul 14</option>
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
      </header>
      
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