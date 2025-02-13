"use client";

import { useState, useRef, useEffect } from "react";
import confetti from "canvas-confetti";
import "./App.css";

const questions = [
  {
    question: "What is Anna not allergic to?",
    options: ["Peaches", "Persimmons"],
    correctAnswer: "Persimmons",
  },
  {
    question: "When did Anna get her license?",
    options: ["Never", "2022"],
    correctAnswer: "Never",
  },
  {
    question: "What was Eli's favorite color?",
    options: ["Blue", "Red"],
    correctAnswer: "Red",
  },
  {
    question: "Which grapes are better?",
    options: ["Green", "Red"],
    correctAnswer: "Green",
  },
  {
    question: "True or False: Eli was born in GA.",
    options: ["True", "False"],
    correctAnswer: "False",
  },
  {
    question: "Will you be my Valentine?",
    options: ["Yes!", "No"],
    correctAnswer: "Yes!",
  },
];

function useRandomMovement() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const move = () => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const padding = 50;

    const x = Math.random() * (viewportWidth - 300) + padding;
    const y = Math.random() * (viewportHeight - 100) + padding;

    const boundedX = Math.min(Math.max(x, padding), viewportWidth - 250);
    const boundedY = Math.min(Math.max(y, padding), viewportHeight - 100);

    setPosition({ x: boundedX, y: boundedY });
  };

  return { position, move };
}

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showTempScreen, setShowTempScreen] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const { position, move } = useRandomMovement();
  const buttonRefs = useRef([]);

  useEffect(() => {
    buttonRefs.current.forEach((button) => {
      if (button) {
        button.style.position = "";
        button.style.left = "";
        button.style.top = "";
        button.style.width = "";
        button.style.transition = "";
      }
    });
  }, [currentQuestion]);

  useEffect(() => {
    let timer;
    if (showCelebration && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showCelebration, countdown]);

  const handleAnswer = (selectedAnswer) => {
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion === 4) {
        setShowTempScreen(true);
        setTimeout(() => {
          setShowTempScreen(false);
          setCurrentQuestion(nextQuestion);
        }, 3000);
      } else if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
      } else {
        setShowCelebration(true);
        confetti({
          particleCount: 150,
          spread: 180,
          origin: { y: 0.6 },
        });
        setTimeout(() => {
          confetti({
            particleCount: 100,
            spread: 100,
            origin: { x: 0.1, y: 0.8 },
          });
          confetti({
            particleCount: 100,
            spread: 100,
            origin: { x: 0.9, y: 0.8 },
          });
        }, 500);
      }
    }
  };

  const handleIncorrectHover = (index) => {
    const button = buttonRefs.current[index];
    if (button) {
      if (!button.style.position) {
        const rect = button.getBoundingClientRect();
        button.style.position = "fixed";
        button.style.left = `${rect.left}px`;
        button.style.top = `${rect.top}px`;
        button.style.width = `${rect.width}px`;
        button.style.transition = "none";

        void button.offsetHeight;

        button.style.transition = "all 0.5s ease";
      }

      move();
      button.style.left = `${position.x}px`;
      button.style.top = `${position.y}px`;
    }
  };

  if (showCelebration) {
    return (
      <div className="celebration-container">
        <div className="celebration-content">
          <h1>Yay! 🎉</h1>
          <img src="/gifs/cat2.gif" alt="Celebration Cat" className="gif" />

          <p>Thank you for being my Valentine!</p>
          <div className="heart">❤️</div>
          <p>You make everyday so fun ehehehehe</p>
          <div className="countdown">
            <h1>Look behind you in {countdown} seconds...</h1>
          </div>
        </div>
      </div>
    );
  }
  if (showTempScreen) {
    return (
      <div className="quiz-container">
        <h1>Good job, that was a trick question!</h1>
        <img src="/gifs/cat3.gif" alt="Celebration Cat" className="gif" />
      </div>
    );
  }
  return (
    <div className="quiz-container">
      <div className="quiz-content">
        <img src="/gifs/cat4.gif" alt="Celebration Cat" className="gif" />
        <h1>Valentine's Quiz</h1>
        <div className="question-section">
          <p>{questions[currentQuestion].question}</p>
          <div className="options">
            {questions[currentQuestion].options.map((option, index) => {
              const isCorrect =
                option === questions[currentQuestion].correctAnswer;
              return (
                <div key={index} className="button-wrapper">
                  <button
                    ref={(el) => (buttonRefs.current[index] = el)}
                    className={`quiz-button ${!isCorrect ? "incorrect" : ""}`}
                    onClick={() => handleAnswer(option)}
                    onMouseEnter={() =>
                      !isCorrect && handleIncorrectHover(index)
                    }
                  >
                    {option}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
