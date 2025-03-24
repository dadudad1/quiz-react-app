import React, { useState, useEffect, useCallback } from 'react';
import QuestionDisplay from './QuestionDisplay';
import Timer from './Timer';
import SimulationResults from './SimulationResults';
import SimulationStats from './SimulationStats';
import { calculateSimulationResults, formatTime } from './finishSimulation';
import '../styles/Simulation.css';

const Simulation = ({ 
  allChaptersData, 
  correctAnswersData,
  onExit 
}) => {
  const SIMULATION_TIME_MINUTES = 120; // 2 hours
  const SIMULATION_QUESTIONS_COUNT = 60; // 60 questions
  
  const [simulationState, setSimulationState] = useState('intro'); // intro, running, completed
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
  
  // Load simulation statistics from localStorage on mount
  useEffect(() => {
    const savedStats = localStorage.getItem('simulationStats');
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
    localStorage.setItem('simulationStats', JSON.stringify(newStats));
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
      timeSpent: timeSpentInSeconds
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
  
  // Prepare simulation questions by selecting questions from each chapter
  const prepareSimulationQuestions = useCallback(() => {
    const chaptersData = Object.keys(allChaptersData);
    const totalChapters = chaptersData.length;
    
    // Calculate how many questions to take from each chapter
    // We want to distribute questions evenly among chapters
    const questionsPerChapter = Math.floor(SIMULATION_QUESTIONS_COUNT / totalChapters);
    const remainder = SIMULATION_QUESTIONS_COUNT % totalChapters;
    
    const selectedQuestions = [];
    let chapterCounts = {};
    
    // First, select an equal number of questions from each chapter
    chaptersData.forEach(chapter => {
      const chapterQuestions = allChaptersData[chapter];
      
      // We need to determine how many questions to take from this chapter
      const questionsToTake = chapter === chaptersData[0] 
        ? questionsPerChapter + remainder // Add remainder to first chapter
        : questionsPerChapter;
      
      // Get random indices without replacement
      const indices = getRandomIndices(chapterQuestions.length, questionsToTake);
      
      // Select questions using these indices
      const selectedFromChapter = indices.map(index => ({
        ...chapterQuestions[index],
        chapter // Add the chapter info to each question
      }));
      
      // Add to our final array
      selectedQuestions.push(...selectedFromChapter);
      
      // Track how many we took from each chapter
      chapterCounts[chapter] = questionsToTake;
    });
    
    // Shuffle the combined array to mix questions from different chapters
    const shuffledQuestions = shuffleArray([...selectedQuestions]);
    
    setQuestions(shuffledQuestions);
    return shuffledQuestions;
  }, [allChaptersData]);
  
  // Initialize simulation
  const startSimulation = () => {
    const simulationQuestions = prepareSimulationQuestions();
    
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
    const timeSpentInSeconds = SIMULATION_TIME_MINUTES * 60 - timeSpent;
    
    // Update statistics
    updateSimulationStats(simulationResults, questions.length, timeSpentInSeconds);
    
    // Set the final results
    setResults(simulationResults);
    
    // Mark simulation as completed
    setSimulationState('completed');
  }, [questions, userAnswers, correctAnswersData, allChaptersData, timeSpent, SIMULATION_TIME_MINUTES]);
  
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
  
  // Render different states
  if (simulationState === 'intro') {
    // Calculate total available questions
    const totalAvailableQuestions = Object.values(allChaptersData).reduce((total, chapterQuestions) => {
      return total + chapterQuestions.length;
    }, 0);
    
    return (
      <div className="simulation-container">
        <div className="two-column-layout">
          <div className="left-column">
            <div className="simulation-intro">
              <h2>Mod Simulare Examen</h2>
              <div className="simulation-info">
                <p>Acest mod simulează un examen real cu:</p>
                <ul>
                  <li><strong>{SIMULATION_QUESTIONS_COUNT} întrebări</strong> selectate aleatoriu din toate capitolele</li>
                  <li><strong>{SIMULATION_TIME_MINUTES} minute</strong> timp disponibil ({SIMULATION_TIME_MINUTES / 60} ore)</li>
                  <li>Distribuție proporțională a întrebărilor între capitole</li>
                  <li>Posibilitatea de a naviga între întrebări și de a reveni</li>
                  <li>Rezultat detaliat la final</li>
                </ul>
                <p>Ești pregătit să începi?</p>
              </div>
              <div className="simulation-actions">
                <button className="btn btn-primary" onClick={startSimulation}>
                  Începe Simularea
                </button>
                <button className="btn btn-secondary" onClick={onExit}>
                  Înapoi la Quiz
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
            />
          </div>
        </div>
      </div>
    );
  }
  
  if (simulationState === 'completed') {
    // Calculate total available questions
    const totalAvailableQuestions = Object.values(allChaptersData).reduce((total, chapterQuestions) => {
      return total + chapterQuestions.length;
    }, 0);
    
    return (
      <SimulationResults
        results={results}
        totalQuestions={questions.length}
        timeSpentInSeconds={SIMULATION_TIME_MINUTES * 60 - timeSpent}
        onRestart={() => setSimulationState('intro')}
        onExit={onExit}
        totalAvailableQuestions={totalAvailableQuestions}
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
        initialTimeInMinutes={SIMULATION_TIME_MINUTES} 
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
            showQuestionNumber={false}
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

export default Simulation; 