import React, { useState, useEffect, useCallback } from 'react';
import QuestionDisplay from './QuestionDisplay';
import Timer from './Timer';
import SimulationResults from './SimulationResults';
import SimulationStats from './SimulationStats';
import { calculateSimulationResults } from './finishSimulation';
import '../styles/Simulation.css';
import '../styles/CustomSimulation.css';

const CustomSimulation = ({ 
  allChaptersData, 
  correctAnswersData,
  onExit 
}) => {
  const DEFAULT_SIMULATION_TIME_MINUTES = 120; // 2 hours
  const DEFAULT_SIMULATION_QUESTIONS_COUNT = 60; // 60 questions
  
  const [simulationState, setSimulationState] = useState('setup'); // setup, running, completed
  const [simulationTime, setSimulationTime] = useState(DEFAULT_SIMULATION_TIME_MINUTES);
  const [questionsCount, setQuestionsCount] = useState(DEFAULT_SIMULATION_QUESTIONS_COUNT);
  const [selectedChapters, setSelectedChapters] = useState({});
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [timeSpent, setTimeSpent] = useState(0);
  const [results, setResults] = useState(null);
  const [simulationStats, setSimulationStats] = useState({
    testsTaken: 0,
    testsPassed: 0,
    totalQuestionsAnswered: 0,
    totalCorrectAnswers: 0,
    last10Tests: []
  });
  
  // Initialize selected chapters on mount
  useEffect(() => {
    const initialSelectedChapters = {};
    Object.keys(allChaptersData).forEach(chapter => {
      initialSelectedChapters[chapter] = true; // Default all to true
    });
    setSelectedChapters(initialSelectedChapters);
  }, [allChaptersData]);
  
  // Load simulation statistics from localStorage on mount
  useEffect(() => {
    const savedStats = localStorage.getItem('customSimulationStats');
    if (savedStats) {
      try {
        const stats = JSON.parse(savedStats);
        setSimulationStats(stats);
      } catch (e) {
        console.error('Eroare la încărcarea statisticilor de simulare:', e);
      }
    }
  }, []);
  
  // Save simulation statistics to localStorage
  const saveSimulationStats = (newStats) => {
    localStorage.setItem('customSimulationStats', JSON.stringify(newStats));
    setSimulationStats(newStats);
  };
  
  // Reset simulation statistics
  const resetSimulationStats = () => {
    const resetStats = {
      testsTaken: 0,
      testsPassed: 0,
      totalQuestionsAnswered: 0,
      totalCorrectAnswers: 0,
      last10Tests: []
    };
    saveSimulationStats(resetStats);
  };
  
  // Update statistics when a simulation is completed
  const updateSimulationStats = (simulationResults, totalQuestions, timeSpentInSeconds) => {
    const { correctCount } = simulationResults;
    const score = Math.round((correctCount / totalQuestions) * 100);
    const isPassed = score >= 70;
    
    // Create a record of this test
    const testRecord = {
      date: new Date().toISOString(),
      score,
      passed: isPassed,
      correctCount,
      totalQuestions,
      timeSpent: timeSpentInSeconds,
      selectedChapters: Object.keys(selectedChapters).filter(ch => selectedChapters[ch])
    };
    
    // Update stats
    const newStats = {
      testsTaken: simulationStats.testsTaken + 1,
      testsPassed: simulationStats.testsPassed + (isPassed ? 1 : 0),
      totalQuestionsAnswered: simulationStats.totalQuestionsAnswered + Object.keys(userAnswers).length,
      totalCorrectAnswers: simulationStats.totalCorrectAnswers + correctCount,
      last10Tests: [testRecord, ...simulationStats.last10Tests].slice(0, 10) // Keep only last 10
    };
    
    saveSimulationStats(newStats);
  };
  
  // Prepare simulation questions by selecting questions from each selected chapter
  const prepareSimulationQuestions = useCallback(() => {
    // Get only selected chapters
    const selectedChapterKeys = Object.keys(selectedChapters).filter(
      chapter => selectedChapters[chapter]
    );
    
    if (selectedChapterKeys.length === 0) {
      alert("Selectați cel puțin un capitol pentru simulare.");
      return null;
    }
    
    // Calculate total available questions from selected chapters
    const availableQuestions = selectedChapterKeys.reduce((acc, chapter) => {
      return acc + allChaptersData[chapter].length;
    }, 0);
    
    // Check if we have enough questions
    const actualQuestionsCount = Math.min(questionsCount, availableQuestions);
    if (actualQuestionsCount < questionsCount) {
      alert(`Atenție: Capitolele selectate conțin doar ${availableQuestions} întrebări. Se va crea un test cu ${actualQuestionsCount} întrebări.`);
    }
    
    // Calculate how many questions to take from each chapter
    // Distribute questions proportionally to chapter size
    const selectedQuestions = [];
    
    // Calculate question distribution
    const totalQuestionsInSelectedChapters = selectedChapterKeys.reduce(
      (sum, chapter) => sum + allChaptersData[chapter].length, 0
    );
    
    // Take questions from each selected chapter
    selectedChapterKeys.forEach(chapter => {
      const chapterQuestions = allChaptersData[chapter];
      
      // Calculate proportional questions to take
      const proportion = chapterQuestions.length / totalQuestionsInSelectedChapters;
      let questionsToTake = Math.round(actualQuestionsCount * proportion);
      
      // Ensure at least one question per selected chapter
      questionsToTake = Math.max(1, questionsToTake);
      questionsToTake = Math.min(questionsToTake, chapterQuestions.length);
      
      // Get random indices without replacement
      const indices = getRandomIndices(chapterQuestions.length, questionsToTake);
      
      // Select questions using these indices
      const selectedFromChapter = indices.map(index => ({
        ...chapterQuestions[index],
        chapter // Add the chapter info to each question
      }));
      
      // Add to our final array
      selectedQuestions.push(...selectedFromChapter);
    });
    
    // If we have more questions than requested (due to rounding), trim some randomly
    if (selectedQuestions.length > actualQuestionsCount) {
      const indicesToKeep = getRandomIndices(selectedQuestions.length, actualQuestionsCount);
      const trimmedQuestions = indicesToKeep.map(i => selectedQuestions[i]);
      return shuffleArray(trimmedQuestions);
    }
    
    // Shuffle the combined array to mix questions from different chapters
    return shuffleArray(selectedQuestions);
  }, [allChaptersData, selectedChapters, questionsCount]);
  
  // Initialize simulation
  const startSimulation = () => {
    const simulationQuestions = prepareSimulationQuestions();
    if (!simulationQuestions) return; // If preparation failed, don't start
    
    setQuestions(simulationQuestions);
    
    // Reset states
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setSelectedAnswers([]);
    setTimeSpent(0);
    setResults(null);
    
    // Start the simulation
    setSimulationState('running');
  };
  
  // Handle time expiration
  const handleTimeExpired = useCallback(() => {
    finishSimulation();
  }, []);
  
  // Calculate results and end simulation
  const finishSimulation = useCallback(() => {
    // Use the helper function to calculate results
    const simulationResults = calculateSimulationResults(
      questions, 
      userAnswers, 
      correctAnswersData, 
      allChaptersData
    );
    
    // Calculate time spent in seconds
    const timeSpentInSeconds = simulationTime * 60 - timeSpent;
    
    // Update statistics
    updateSimulationStats(simulationResults, questions.length, timeSpentInSeconds);
    
    // Set the final results
    setResults(simulationResults);
    
    // Mark simulation as completed
    setSimulationState('completed');
  }, [questions, userAnswers, correctAnswersData, allChaptersData, timeSpent, simulationTime]);
  
  // Save answer for current question
  const saveAnswer = () => {
    if (selectedAnswers.length === 0) return;
    
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: [...selectedAnswers]
    }));
    
    // Move to next question
    if (currentQuestionIndex < questions.length - 1) {
      goToNextQuestion();
    }
  };
  
  // Navigation
  const goToNextQuestion = () => {
    setCurrentQuestionIndex(prev => prev + 1);
    setSelectedAnswers(userAnswers[currentQuestionIndex + 1] || []);
  };
  
  const goToPreviousQuestion = () => {
    setCurrentQuestionIndex(prev => prev - 1);
    setSelectedAnswers(userAnswers[currentQuestionIndex - 1] || []);
  };
  
  // Handle answer selection
  const handleAnswerSelection = (letter) => {
    setSelectedAnswers(prev => {
      const index = prev.indexOf(letter);
      
      if (index === -1) {
        // Add selection and sort
        const newSelected = [...prev, letter];
        newSelected.sort();
        return newSelected;
      } else {
        // Remove selection
        return prev.filter(l => l !== letter);
      }
    });
  };
  
  // Toggle chapter selection
  const toggleChapter = (chapter) => {
    setSelectedChapters(prev => ({
      ...prev,
      [chapter]: !prev[chapter]
    }));
  };
  
  // Select/deselect all chapters
  const selectAllChapters = (select) => {
    const updatedSelection = {};
    Object.keys(selectedChapters).forEach(chapter => {
      updatedSelection[chapter] = select;
    });
    setSelectedChapters(updatedSelection);
  };
  
  // When the current question changes, load any existing answers
  useEffect(() => {
    setSelectedAnswers(userAnswers[currentQuestionIndex] || []);
  }, [currentQuestionIndex, userAnswers]);
  
  // Utility functions
  const getRandomIndices = (max, count) => {
    const indices = Array.from({ length: max }, (_, i) => i);
    return shuffleArray(indices).slice(0, count);
  };
  
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };
  
  // Calculate total available questions
  const totalAvailableQuestions = Object.entries(allChaptersData)
    .filter(([chapter]) => selectedChapters[chapter])
    .reduce((sum, [_, questions]) => sum + questions.length, 0);
  
  // Calculate selected chapters count
  const selectedChaptersCount = Object.values(selectedChapters).filter(Boolean).length;
  
  // Render setup state
  if (simulationState === 'setup') {
    return (
      <div className="simulation-container custom-simulation">
        <div className="two-column-layout">
          <div className="left-column">
            <div className="simulation-setup">
              <h2>Simulare Personalizată</h2>
              
              <div className="setup-section">
                <h3>Parametri Simulare</h3>
                <div className="setup-params">
                  <div className="setup-param">
                    <label htmlFor="simulation-time">Timp (minute):</label>
                    <input 
                      id="simulation-time" 
                      type="number" 
                      min="10" 
                      max="240" 
                      value={simulationTime} 
                      onChange={(e) => setSimulationTime(Math.max(10, Math.min(240, parseInt(e.target.value) || 10)))}
                    />
                  </div>
                  
                  <div className="setup-param">
                    <label htmlFor="questions-count">Număr întrebări:</label>
                    <input 
                      id="questions-count" 
                      type="number" 
                      min="5" 
                      max="100" 
                      value={questionsCount} 
                      onChange={(e) => setQuestionsCount(Math.max(5, Math.min(100, parseInt(e.target.value) || 5)))}
                    />
                  </div>
                </div>
              </div>
              
              <div className="setup-section chapters-selection">
                <h3>Selectare Capitole</h3>
                <div className="chapter-selection-actions">
                  <button 
                    className="btn btn-small" 
                    onClick={() => selectAllChapters(true)}
                  >
                    Selectează toate
                  </button>
                  <button 
                    className="btn btn-small" 
                    onClick={() => selectAllChapters(false)}
                  >
                    Deselectează toate
                  </button>
                </div>
                
                <div className="chapters-grid">
                  {Object.keys(allChaptersData).map(chapter => (
                    <div 
                      key={chapter}
                      className={`chapter-item ${selectedChapters[chapter] ? 'selected' : ''}`}
                      onClick={() => toggleChapter(chapter)}
                    >
                      <div className="chapter-checkbox">
                        <input 
                          type="checkbox" 
                          checked={selectedChapters[chapter]} 
                          onChange={() => toggleChapter(chapter)} 
                          id={`chapter-${chapter}`}
                        />
                        <label htmlFor={`chapter-${chapter}`}>
                          Capitolul {chapter.replace('cap', '')}
                        </label>
                      </div>
                      <div className="chapter-info">
                        {allChaptersData[chapter].length} întrebări
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="selection-summary">
                  <p>
                    <strong>{selectedChaptersCount}</strong> capitole selectate, 
                    <strong> {totalAvailableQuestions}</strong> întrebări disponibile
                  </p>
                  {totalAvailableQuestions < questionsCount && (
                    <p className="warning">
                      Atenție: Numărul de întrebări selectat ({questionsCount}) depășește numărul de întrebări disponibile.
                    </p>
                  )}
                </div>
              </div>
              
              <div className="simulation-actions">
                <button 
                  className="btn btn-primary" 
                  onClick={startSimulation}
                  disabled={selectedChaptersCount === 0}
                >
                  Începe Simularea
                </button>
                <button className="btn btn-secondary" onClick={onExit}>
                  Înapoi
                </button>
              </div>
            </div>
          </div>
          
          <div className="right-column">
            {/* Display simulation statistics */}
            <SimulationStats 
              stats={simulationStats}
              onResetStats={resetSimulationStats}
              totalAvailableQuestions={totalAvailableQuestions}
              isCustom={true}
            />
          </div>
        </div>
      </div>
    );
  }
  
  if (simulationState === 'completed') {
    return (
      <SimulationResults
        results={results}
        totalQuestions={questions.length}
        timeSpentInSeconds={simulationTime * 60 - timeSpent}
        onRestart={() => setSimulationState('setup')}
        onExit={onExit}
        totalAvailableQuestions={totalAvailableQuestions}
        isCustom={true}
        customParams={{
          selectedChapters: Object.keys(selectedChapters).filter(ch => selectedChapters[ch]),
          simulationTime,
          questionsCount
        }}
      />
    );
  }
  
  // Running state
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isAnswered = !!userAnswers[currentQuestionIndex];
  
  // Calculate the correct answers from relevant chapter
  const chapter = currentQuestion?.chapter;
  const correctAnswers = chapter ? correctAnswersData[chapter] : {};
  
  return (
    <div className="simulation-container">
      <Timer 
        initialTimeInMinutes={simulationTime} 
        onTimeExpired={handleTimeExpired} 
      />
      
      <div className="simulation-header">
        <div className="progress-info">
          <span>Întrebarea {currentQuestionIndex + 1} din {questions.length}</span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        <button 
          className="btn btn-finish" 
          onClick={finishSimulation}
        >
          Termină simularea
        </button>
      </div>
      
      {currentQuestion && (
        <div className="simulation-question">
          <div className="chapter-indicator">
            Capitolul {currentQuestion.chapter.replace('cap', '')}
          </div>
          <QuestionDisplay
            question={currentQuestion}
            selectedAnswers={selectedAnswers}
            onAnswerSelect={handleAnswerSelection}
            feedback={{ visible: false }}
            correctAnswer=""
          />
          
          <div className="question-status">
            <div className="status-indicator">
              {isAnswered && <span className="answered-indicator">✓ Răspuns salvat</span>}
            </div>
          </div>
        </div>
      )}
      
      <div className="simulation-navigation">
        <button 
          className="btn btn-secondary" 
          onClick={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Întrebarea anterioară
        </button>
        
        <button 
          className="btn btn-primary" 
          onClick={saveAnswer}
          disabled={selectedAnswers.length === 0}
        >
          {isAnswered ? 'Actualizează răspunsul' : 'Salvează răspunsul'}
        </button>
        
        <button 
          className="btn btn-secondary" 
          onClick={goToNextQuestion}
          disabled={currentQuestionIndex === questions.length - 1}
        >
          Întrebarea următoare
        </button>
      </div>
    </div>
  );
};

export default CustomSimulation; 