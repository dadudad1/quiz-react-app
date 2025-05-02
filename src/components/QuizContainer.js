import React, { useState, useEffect } from 'react';
import QuestionDisplay from './QuestionDisplay';
import { Analytics } from '@vercel/analytics/react';
import '../styles/QuizContainer.css';

const QuizContainer = ({
  questions,
  filteredQuestions,
  correctAnswers,
  bookmarkedQuestions,
  updateStats,
  toggleBookmark,
  searchQuestions,
  randomizeAnswers
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [feedback, setFeedback] = useState({ visible: false, isCorrect: false, message: '' });
  const [currentMode, setCurrentMode] = useState('random');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [jumpToQuestion, setJumpToQuestion] = useState('');

  // Încărcăm întrebarea curentă când se modifică questions sau currentMode
  useEffect(() => {
    if (questions.length > 0) {
      loadQuestion();
    }
  }, [questions, currentMode, filteredQuestions, currentIndex]);

  const loadQuestion = () => {
    // Resetăm starea
    setFeedback({ visible: false, isCorrect: false, message: '' });
    setSelectedAnswers([]);
    
    // Utilizăm întrebările filtrate sau toate întrebările
    const questionPool = (currentMode === "search") ? filteredQuestions : questions;
    
    if (questionPool.length === 0) {
      setCurrentQuestion(null);
      return;
    }
    
    // Determinăm ce întrebare să încărcăm în funcție de mod
    let newIndex = currentIndex;
    
    if (currentMode === "random") {
      newIndex = Math.floor(Math.random() * questionPool.length);
      setCurrentIndex(newIndex);
    } else if (currentMode === "bookmarked") {
      // Găsim toate întrebările salvate
      const bookmarked = questionPool.filter(q => bookmarkedQuestions.has(q.numar));
      if (bookmarked.length === 0) {
        setCurrentQuestion(null);
        return;
      }
      // Alegem o întrebare aleatorie dintre cele salvate
      const randomBookmarked = Math.floor(Math.random() * bookmarked.length);
      const bookmarkedQuestion = bookmarked[randomBookmarked];
      newIndex = questionPool.findIndex(q => q.numar === bookmarkedQuestion.numar);
      setCurrentIndex(newIndex);
    } else if (currentMode === "search") {
      // Pentru modul de căutare, folosim indexul curent
      newIndex = currentIndex;
    } else if (currentMode === "sequential") {
      // Pentru modul secvențial, folosim indexul curent
      newIndex = currentIndex;
    }
    
    // Ne asigurăm că newIndex este în limite
    if (newIndex >= questionPool.length) {
      newIndex = 0;
      setCurrentIndex(0);
    }
    
    setCurrentQuestion(questionPool[newIndex]);
  };

  const nextQuestion = () => {
    if (currentMode === "sequential") {
      const nextIndex = (currentIndex + 1) % questions.length;
      setCurrentIndex(nextIndex);
    } else if (currentMode === "search") {
      const nextIndex = (currentIndex + 1) % filteredQuestions.length;
      setCurrentIndex(nextIndex);
    } else {
      loadQuestion();
    }
  };

  const previousQuestion = () => {
    if (currentMode === "sequential") {
      const prevIndex = (currentIndex - 1 + questions.length) % questions.length;
      setCurrentIndex(prevIndex);
    } else if (currentMode === "search") {
      const prevIndex = (currentIndex - 1 + filteredQuestions.length) % filteredQuestions.length;
      setCurrentIndex(prevIndex);
    } else {
      loadQuestion();
    }
  };

  const handleAnswerSelection = (letter) => {
    setSelectedAnswers(prev => {
      const index = prev.indexOf(letter);
      
      if (index === -1) {
        // Adăugăm selecția
        const newSelected = [...prev, letter];
        newSelected.sort();
        return newSelected;
      } else {
        // Eliminăm selecția
        return prev.filter(l => l !== letter);
      }
    });
  };

  const checkAnswer = () => {
    if (!currentQuestion) return;
    
    const questionNumber = currentQuestion.numar;
    const correct = correctAnswers[questionNumber] || "";
    
    // Convertim selecțiile în string pentru comparație
    const userAnswer = selectedAnswers.join('');
    
    // Determinăm dacă răspunsul este corect
    const isCorrect = userAnswer === correct;
    
    // Track analytics
    Analytics.track('question_answered', {
      questionNumber,
      chapter: currentQuestion.chapter,
      isCorrect,
      userAnswer,
      correctAnswer: correct
    });
    
    // Actualizăm statisticile
    updateStats(isCorrect);
    
    // Afișăm rezultatul
    setFeedback({
      visible: true,
      isCorrect,
      message: isCorrect 
        ? `Corect! Ai selectat răspunsul corect.` 
        : `Incorect! Răspunsul corect este ${correct}.`
    });
  };

  const handleModeChange = (e) => {
    const newMode = e.target.value;
    setCurrentMode(newMode);
    
    if (newMode === "search") {
      // Nu încărcăm întrebarea aici pentru modul search, doar când se face căutarea
    } else {
      // Resetăm indexul pentru celelalte moduri și încărcăm o nouă întrebare
      setCurrentIndex(0);
    }
  };

  const handleSearch = () => {
    if (searchQuestions(searchQuery)) {
      // Dacă s-au găsit rezultate, încărcăm prima întrebare
      setCurrentIndex(0);
    }
  };

  const handleBookmarkToggle = () => {
    if (currentQuestion) {
      toggleBookmark(currentQuestion.numar);
    }
  };

  const handleJumpToQuestion = (e) => {
    e.preventDefault();
    const questionNumber = parseInt(jumpToQuestion);
    if (isNaN(questionNumber) || questionNumber < 1 || questionNumber > questions.length) {
      alert(`Te rog introdu un număr între 1 și ${questions.length}`);
      return;
    }
    
    // Find the index of the question with this number
    const targetIndex = questions.findIndex(q => q.numar === questionNumber);
    if (targetIndex !== -1) {
      setCurrentIndex(targetIndex);
      setJumpToQuestion('');
    } else {
      alert(`Întrebarea cu numărul ${questionNumber} nu a fost găsită`);
    }
  };

  return (
    <div className="quiz-container">
      <div className="question-counter">
        {currentQuestion && (
          <span>Întrebarea {currentQuestion.numar} din {questions.length}</span>
        )}
      </div>
      
      <div className="controls">
        <select 
          value={currentMode}
          onChange={handleModeChange}
          className="question-selector"
        >
          <option value="random">Întrebare aleatorie</option>
          <option value="sequential">Întrebări în ordine</option>
          <option value="bookmarked">Întrebări salvate</option>
          <option value="search">Căutare întrebări</option>
        </select>
        
        {currentMode === "sequential" && (
          <form onSubmit={handleJumpToQuestion} className="jump-to-question">
            <input
              type="number"
              min="1"
              max={questions.length}
              value={jumpToQuestion}
              onChange={(e) => setJumpToQuestion(e.target.value)}
              placeholder="Salt la întrebarea..."
              className="jump-input"
            />
            <button type="submit" className="btn btn-jump">
              Salt
            </button>
          </form>
        )}

        <div>
          <span 
            className={`bookmark-icon ${bookmarkedQuestions.has(currentQuestion?.numar) ? 'bookmark-active' : 'bookmark-inactive'}`}
            onClick={handleBookmarkToggle}
          >
            ★
          </span>
        </div>
      </div>
      
      {currentMode === "search" && (
        <div className="search-container">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Caută după număr sau text..."
            className="search-input"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} className="btn">Caută</button>
          <div className="search-hint">
            Poți căuta după numărul exact al întrebării (ex: 25) sau după text.
          </div>
        </div>
      )}
      
      {currentQuestion ? (
        <QuestionDisplay
          question={currentQuestion}
          selectedAnswers={selectedAnswers}
          onAnswerSelect={handleAnswerSelection}
          feedback={feedback}
          correctAnswer={correctAnswers[currentQuestion.numar] || ""}
          randomizeAnswers={randomizeAnswers}
        />
      ) : (
        <div className="question-placeholder">
          {currentMode === "bookmarked" 
            ? "Nu ai întrebări salvate. Salvează întrebări folosind steluța." 
            : currentMode === "search"
            ? "Nicio întrebare nu conține termenul căutat. Încearcă o altă căutare."
            : "Nicio întrebare disponibilă."}
        </div>
      )}
      
      <div className="multiple-choice-hint">
        Selectează toate răspunsurile corecte (pot fi una sau mai multe variante).
      </div>
      
      <div className="button-container">
        {(currentMode === "sequential" || currentMode === "search") && (
          <button 
            className="btn" 
            onClick={previousQuestion}
          >
            Întrebarea anterioară
          </button>
        )}
        <button 
          className="btn btn-check" 
          onClick={checkAnswer}
          disabled={!currentQuestion || selectedAnswers.length === 0}
        >
          Verifică răspunsul
        </button>
        <button className="btn" onClick={nextQuestion}>
          {currentMode === "sequential" ? "Întrebarea următoare" : "Următoarea întrebare"}
        </button>
      </div>
    </div>
  );
};

export default QuizContainer; 