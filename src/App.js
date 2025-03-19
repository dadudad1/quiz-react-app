import React, { useState, useEffect } from 'react';
import './App.css';
import QuizContainer from './components/QuizContainer';
import Statistics from './components/Statistics';
import LoadingOverlay from './components/LoadingOverlay';
import Simulation from './components/Simulation';

const isElectron = window?.electron !== undefined;

function App() {
  // State for app mode and chapter selection
  const [appMode, setAppMode] = useState('quiz'); // 'quiz' or 'simulation'
  const [activeChapter, setActiveChapter] = useState('cap1');
  
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

  // Combined fetch function for questions and answers
  const fetchChapterData = async (chapter) => {
    setChapterLoading(chapter, true);
    try {
      // Fetch questions
      let questionsData;
      let answersData;

      if (isElectron) {
        // Use Electron IPC to load files
        questionsData = await window.electron.ipcRenderer.invoke('read-file', `capitole/cap${chapter}.json`);
        answersData = await window.electron.ipcRenderer.invoke('read-file', `capitole/cap${chapter}_raspunsuri`);
      } else {
        // Web browser fetch
        const questionsResponse = await fetch(`/capitole/cap${chapter}.json`);
        questionsData = await questionsResponse.json();
        
        const answersResponse = await fetch(`/capitole/cap${chapter}_raspunsuri`);
        answersData = await answersResponse.text();
      }
      
      // Process answers
      const answers = {};
      answersData.split('; ').forEach(item => {
        const parts = item.split('.');
        if (parts.length === 2) {
          const questionNumber = parseInt(parts[0]);
          const answer = parts[1];
          answers[questionNumber] = answer;
        }
      });

      // Update state based on chapter
      switch(chapter) {
        case 4:
          setQuestionsChapter4(questionsData);
          setCorrectAnswersChapter4(answers);
          break;
        case 5:
          setQuestionsChapter5(questionsData);
          setCorrectAnswersChapter5(answers);
          break;
        case 6:
          setQuestionsChapter6(questionsData);
          setCorrectAnswersChapter6(answers);
          break;
        case 7:
          setQuestionsChapter7(questionsData);
          setCorrectAnswersChapter7(answers);
          break;
        case 8:
          setQuestionsChapter8(questionsData);
          setCorrectAnswersChapter8(answers);
          break;
        case 9:
          setQuestionsChapter9(questionsData);
          setCorrectAnswersChapter9(answers);
          break;
        case 10:
          setQuestionsChapter10(questionsData);
          setCorrectAnswersChapter10(answers);
          break;
        case 11:
          setQuestionsChapter11(questionsData);
          setCorrectAnswersChapter11(answers);
          break;
        case 12:
          setQuestionsChapter12(questionsData);
          setCorrectAnswersChapter12(answers);
          break;
        case 13:
          setQuestionsChapter13(questionsData);
          setCorrectAnswersChapter13(answers);
          break;
        case 14:
          setQuestionsChapter14(questionsData);
          setCorrectAnswersChapter14(answers);
          break;
      }
      setChapterError(chapter, null);
    } catch (error) {
      console.error(`Error loading chapter ${chapter}:`, error);
      setChapterError(chapter, `Failed to load chapter ${chapter}`);
    } finally {
      setChapterLoading(chapter, false);
    }
  };

  // Load all chapters data
  useEffect(() => {
    const loadChapters = async () => {
      // Load chapters 1 and 2 first
      try {
        let data1, data2;
        
        if (isElectron) {
          // Use Electron IPC to load files
          data1 = await window.electron.ipcRenderer.invoke('read-file', 'capitole/cap1.json');
          data2 = await window.electron.ipcRenderer.invoke('read-file', 'capitole/cap2.json');
        } else {
          // Web browser fetch
          const response1 = await fetch('/capitole/cap1.json');
          data1 = await response1.json();
          const response2 = await fetch('/capitole/cap2.json');
          data2 = await response2.json();
        }
        
        setQuestions(data1);
        setQuestionsChapter2(data2);
        setChapterLoading('cap1', false);
        setChapterLoading('cap2', false);
      } catch (error) {
        console.error('Error fetching chapters 1 and 2:', error);
        setChapterError('cap1', 'Failed to load chapter 1');
        setChapterError('cap2', 'Failed to load chapter 2');
      }

      // Then load chapters 4-14
      const chaptersToLoad = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
      
      const loadChapterWithDelay = async (chapter, delay) => {
        await new Promise(resolve => setTimeout(resolve, delay));
        await fetchChapterData(chapter);
      };

      const promises = chaptersToLoad.map((chapter, index) => 
        loadChapterWithDelay(chapter, index * 200)
      );

      await Promise.all(promises);
      setIsLoading(false);
    };

    loadChapters();
  }, []);

  // Încărcăm răspunsurile corecte pentru capitolul 1
  useEffect(() => {
    const answersData = "1.ACE; 2.CDE; 3.ABE; 4.ABE; 5.ADE; 6.BDE; 7.ACD; 8.BDE; 9.ABDE; 10.ACE; 11.BDE; 12.ACD; 13.ADE; 14.ACD; 15.BDE; 16.ABCE; 17.AE; 18.BCDE; 19.BE; 20.CDE; 21.ABD; 22.ACE; 23.BCD; 24.ACD; 25.CDE; 26.ACD; 27.CE; 28.BD; 29.CDE; 30.ACD; 31.E; 32.ACD; 33.BDE; 34.ACDE; 35.BD; 36.ABCE; 37.BCE; 38.ACD; 39.BCE; 40.ABD; 41.CDE; 42.BD; 43.CDE; 44.ABE; 45.ABC; 46.BCD; 47.ABE; 48.ADE; 49.BCE; 50.ABD; 51.BCE; 52.BCE; 53.ACE; 54.ABD; 55.ACD; 56.AE; 57.ABE; 58.ACD; 59.ACDE; 60.ACE; 61.BDE; 62.ABE; 63.CD; 64.ABCD; 65.BCD; 66.ACE; 67.ACE; 68.ABD; 69.BDE; 70.ABC; 71.BCE; 72.BDE; 73.ACE; 74.BD; 75.ACDE; 76.ABD; 77.BCE; 78.ACE; 79.BCE; 80.ABCE; 81.ACD; 82.ACD; 83.BDE; 84.ABDE; 85.ABE 86.ACE; 87.ACE; 88.ABE; 89.AD; 90.BCD; 91.BDE; 92.BCE; 93.ACE; 94.ABE; 95.ADE; 96.ABC; 97.BE; 98.ABE; 99.ACDE; 100.ABE; 101.CDE; 102.ACD; 103.ADE; 104.ABD; 105.ACDE; 106.AD; 107.BDE; 108.ABE; 109.ACE; 110.CDE; 111.CDE; 112.ADE; 113.ACE; 114.ACE; 115.ACE; 116.ACD; 117.ACE; 118.BE; 119.ABCE; 120.ACE; 121.ACE; 122.BCD; 123.BCE; 124.ACE; 125.BDE; 126.AC; 127.CDE; 128.ADE; 129.CE; 130.ABD; 131.ACD; 132.BCE; 133.B; 134.BE; 135.ADE; 136.ABCE; 137.BC; 138.CDE; 139.ABE; 140.BDE; 141.ACD; 142.BCE; 143.BCE; 144.CDE; 145.BD; 146.ABDE; 147.ACE; 148.ABD; 149.BDE; 150.ACE; 151.ACDE; 152.BCD; 153.ADE; 154.CDE; 155.BCE; 156.AC; 157.ACD; 158.BDE; 159.BDE; 160.BCE; 161.ACD; 162.ACE; 163.AC; 164.ACD; 165.BCE; 166.ABCD; 167.CE; 168.ABCE; 169.ABCE; 170.BCE; 171.ACE; 172.BDE; 173.CDE; 174.ABE; 175.BCE; 176.ABE; 177.BDE; 178.ABD; 179.ACD; 180.BDE; 181.ADE; 182.CDE; 183.BDE; 184.ACE; 185.BCD; 186.ABE; 187.BCE; 188.BCD; 189.ADE; 190.ADE; 191.ACD; 192.BCD; 193.ACE; 194.BCD; 195.ADE; 196.ABE; 197.BCDE; 198.ACD; 199.BDE; 200.ADE";
    
    const answers = {};
    answersData.split('; ').forEach(item => {
      const parts = item.split('.');
      if (parts.length === 2) {
        const questionNumber = parseInt(parts[0]);
        const answer = parts[1];
        answers[questionNumber] = answer;
      }
    });
    
    setCorrectAnswers(answers);
  }, []);

  // Încărcăm răspunsurile corecte pentru capitolul 2
  useEffect(() => {
    const answersData2 = "1.ADE; 2.AE; 3.ABE; 4.ABE; 5.ACE; 6.ABE; 7.ADE; 8.BCD; 9.BDE; 10.ACE; 11.ADE; 12.BCE; 13.BDE; 14.BCD; 15.BDE; 16.ABD; 17.ACDE; 18.BD; 19.ACE; 20.ACD; 21.BE; 22.ABD; 23.CE; 24.ACD; 25.ABE; 26.ACD; 27.ACDE; 28.BCE; 29.BE; 30.ABE; 31.ADE; 32.CD; 33.BD; 34.D; 35.BD; 36.ABE; 37.BCD; 38.BDE; 39.ADE; 40.ADE; 41.ACE; 42.ACDE; 43.ABE; 44.ADE; 45.BD; 46.ABE; 47.CD; 48.AD; 49.BDE; 50.ACE; 51.BCE; 52.BCD; 53.BCDE; 54.C; 55.BCE; 56.AD; 57.ACE; 58.BCE; 59.ABD; 60.BCE; 61.ACE; 62.AD; 63.ABD; 64.ACE; 65.ACE; 66.ACDE; 67.ADE; 68.ABD; 69.BCD; 70.ACD; 71.BD; 72.ABE; 73.BCE; 74.AD; 75.ACE; 76.BCE; 77.ABE; 78.BC; 79.BDE; 80.BE; 81.CE; 82.ACD; 83.ABD; 84.ABDE; 85.BCD; 86.CD; 87.AE; 88.BCD; 89.ACE; 90.CE; 91.BCD; 92.ABE; 93.BDE; 94.ABE; 95.DE; 96.BCD; 97.ABD; 98.ACE; 99.BCE; 100.ACE; 101.BCD; 102.BDE; 103.BCD; 104.BCD; 105.BCE; 106.BDE; 107.ACE; 108.ADE; 109.ACE; 110.ACD; 111.ACDE; 112.BCE; 113.BCE; 114.BCE; 115.BCDE; 116.ABD; 117.ACE; 118.BE; 119.BD; 120.ACD; 121.ABE; 122.ACE; 123.BCE; 124.ABE; 125.ACE; 126.ACD; 127.ACD; 128.ABD; 129.BCE; 130.BCE; 131.D; 132.DE; 133.AD; 134.BCD; 135.BCE; 136.ABCE; 137.BDE; 138.BDE; 139.BCD; 140.BCE; 141.ACD; 142.BCE; 143.CDE; 144.ACDE; 145.BDE; 146.BCD; 147.CDE; 148.AD; 149.BC; 150.ACD; 151.ACE; 152.AD; 153.ACE; 154.ACDE; 155.BCD; 156.ABDE; 157.ABE; 158.BCD; 159.ABD; 160.BCD; 161.AD; 162.ADE; 163.BCD; 164.AC; 165.BDE; 166.CDE; 167.ABC; 168.ADE; 169.BC; 170.BDE; 171.BDE; 172.ADE; 173.BDE; 174.ABE; 175.BCD; 176.BCE; 177.BCD; 178.ACE; 179.ACE; 180.ACD; 181.ABDE; 182.BE; 183.ACE; 184.CE; 185.CDE; 186.ACDE; 187.ABE; 188.BCD; 189.ACE; 190.ACD";
    
    const answers = {};
    answersData2.split('; ').forEach(item => {
      const parts = item.split('.');
      if (parts.length === 2) {
        const questionNumber = parseInt(parts[0]);
        const answer = parts[1];
        answers[questionNumber] = answer;
      }
    });
    
    setCorrectAnswersChapter2(answers);
  }, []);

  // Încărcăm răspunsurile corecte pentru capitolul 3
  useEffect(() => {
    const fetchQuestionsChapter3 = async () => {
      try {
        const response = await fetch('/cap3.json');
        const data = await response.json();
        setQuestionsChapter3(data);
      } catch (error) {
        console.error('Error fetching chapter 3:', error);
        setError('Failed to load chapter 3 questions');
      }
    };

    fetchQuestionsChapter3();
  }, [questionsChapter2]); // Depends on chapter 2 loading to ensure proper ordering

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
    try {
      const savedBookmarks = safeStorage.getItem('bookmarkedQuestions');
      if (savedBookmarks) {
        const bookmarks = JSON.parse(savedBookmarks);
        setBookmarkedQuestions(new Set(bookmarks));
        setStats(prev => ({
          ...prev,
          bookmarkedCount: bookmarks.length
        }));
      }
    } catch (e) {
      console.warn('Could not load bookmarks:', e);
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
    resetStats();
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
      if (newBookmarks.has(questionNumber)) {
        newBookmarks.delete(questionNumber);
      } else {
        newBookmarks.add(questionNumber);
      }
      return newBookmarks;
    });
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
        </div>
        
        {appMode === 'quiz' && (
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
        )}
      </header>
      
      <main>
        {appMode === 'quiz' ? (
          <>
            <QuizContainer
              questions={currentQuestionSet}
              filteredQuestions={filteredQuestions}
              correctAnswers={currentAnswers}
              bookmarkedQuestions={bookmarkedQuestions}
              updateStats={updateStats}
              toggleBookmark={toggleBookmark}
              searchQuestions={searchQuestions}
            />
            <Statistics
              correctCount={stats.correctCount}
              totalCount={stats.totalCount}
              bookmarkedCount={stats.bookmarkedCount}
              resetStats={resetStats}
            />
          </>
        ) : (
          <Simulation 
            allChaptersData={allChaptersData}
            correctAnswersData={correctAnswersData}
            onExit={() => switchAppMode('quiz')}
          />
        )}
      </main>
      
      <footer className="App-footer">
        <div className="footer-content">
          <p>© 2024 Grile Admitere Timisoara Biologie</p>
        </div>
      </footer>
    </div>
  );
}

export default App; 