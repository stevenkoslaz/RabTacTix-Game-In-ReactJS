// Importing necessary dependencies and assets
import React, { useRef, useState, useEffect } from "react";
import "./TicTacToe.css";
import InfoModal from "./InfoModal";
import AchievementPanel from "./AchievementPanel";
import o_icon from "../Assets/rabbit-player.png";
import o_winner from "../Assets/rabbit-winner.png";
import x_icon from "../Assets/turtle-player.png";
import x_winner from "../Assets/turtle-winner.png";
import tie_icon from "../Assets/tie-icon.png";
import unmuteIcon from "../Assets/volume-mute.png";
import muteIcon from "../Assets/volume.png";
import githubIcon from "../Assets/github-icon.png";
import winnerFx from "../Assets/win.mp3";
import loserFx from "../Assets/loss.mp3";
import drawFx from "../Assets/drawgame.mp3";
import backgroundMusic from "../Assets/song.mp3";
import soundFx from "../Assets/soundfx.mp3";
import resetSound from "../Assets/reset.mp3";
import infoIcon from "../Assets/info.png";
import cupIcon from "../Assets/cup.png";

// Array to store the game state
let data = Array(9).fill("");

// React component definition
const TicTacToe = () => {
  // Variable initializations and React state hooks
  let [count, setCount] = useState(0);
  let [lock, setLock] = useState(false);
  let titleRef = useRef(null);
  // References for each box on the game board
  let box0 = useRef(null);
  let box1 = useRef(null);
  let box2 = useRef(null);
  let box3 = useRef(null);
  let box4 = useRef(null);
  let box5 = useRef(null);
  let box6 = useRef(null);
  let box7 = useRef(null);
  let box8 = useRef(null);
  // Array to hold all box references
  let boxArray = [box0, box1, box2, box3, box4, box5, box6, box7, box8];
  // State variables to track scores, player turn, click disable, audio, mute, and game mode
  const [rabbitScore, setRabbitScore] = useState(0);
  const [turtleScore, setTurtleScore] = useState(0);
  const [tieCount, setTieCount] = useState(0);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [disableClick, setDisableClick] = useState(false);
  const [audioBackground, setAudioBackground] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  let [mode, setMode] = useState("easy");
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [isAchievementPanelOpen, setIsAchievementPanelOpen] = useState(false);

  // Function to toggle the info modal
  const toggleInfoModal = () => {
    setShowInfoModal(!showInfoModal);
  };

  // Function to play sound effects
  const playSoundFx = (sound) => {
    if (!isMuted) {
      const audioFx = new Audio(sound);
      audioFx.play();
    }
  };

  // Function to toggle mute and handle background music accordingly
  const toggleMute = () => {
    setIsMuted((prevIsMuted) => !prevIsMuted);

    if (audioBackground) {
      if (isMuted) {
        audioBackground.play();
      } else {
        audioBackground.pause();
      }
    }
  };

  // useEffect to handle background music setup and cleanup
  useEffect(() => {
    const audio = new Audio(backgroundMusic);
    audio.loop = true;
    setAudioBackground(audio);

    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [backgroundMusic]);

  // Function to handle player moves and simulate PC move in certain conditions
  const toogle = (e, num) => {
    if (lock || !playerTurn || disableClick || data[num] !== "") {
      return 0;
    }
    if (count % 2 === 0) {
      e.target.innerHTML = `<img src='${o_icon}'>`;
      data[num] = "o";
      setCount(++count);
      console.log(count);
      playSoundFx(soundFx);
    } else {
      e.target.innerHTML = `<img src='${x_icon}'>`;
      data[num] = "x";
      setCount(++count);
    }
    checkforWin();
    checkForTie();
    setPlayerTurn(false);
  };

  // Function to reset the game state
  const Reset = () => {
    playSoundFx(resetSound);
    setLock(false);
    setCount(0);
    setPlayerTurn(true);
    // clear the data
    data = ["", "", "", "", "", "", "", "", ""];
    // clear the title
    while (titleRef.current.firstChild) {
      titleRef.current.removeChild(titleRef.current.firstChild);
    }
    titleRef.current.appendChild(document.createElement("img")).src = o_winner;
    titleRef.current.appendChild(document.createElement("span")).textContent =
      "VS";
    titleRef.current.appendChild(document.createElement("img")).src = x_winner;
    // clear the Board and unset background color
    boxArray.forEach((box) => {
      if (box.current) {
        box.current.innerHTML = "";
        box.current.classList.remove("winning-box");
        box.current.classList.remove("tie-box");
      }
    });
  };

  // useEffect to trigger PC move when player turn is over
  useEffect(() => {
    if (!playerTurn && !lock) {
      setDisableClick(true);
      setTimeout(simulatePCMove, 1000);
    }
  }, [playerTurn, lock]);

  // Function to simulate PC move based on game mode
  const simulatePCMove = async () => {
    const emptyBoxes = data.reduce((acc, value, index) => {
      if (value === "") {
        acc.push(index);
      }
      return acc;
    }, []);

    if (mode === "easy") {
      // Easy mode strategy
      if (emptyBoxes.length > 0) {
        const randomIndex1 = Math.floor(Math.random() * emptyBoxes.length);
        boxArray[
          emptyBoxes[randomIndex1]
        ].current.innerHTML = `<img id='ghost' src='${x_icon}'>`;
        await sleep(300);
        boxArray[emptyBoxes[randomIndex1]].current.innerHTML = "";
        const randomIndex2 = Math.floor(Math.random() * emptyBoxes.length);
        boxArray[
          emptyBoxes[randomIndex2]
        ].current.innerHTML = `<img src='${x_icon}'>`;
        playSoundFx(soundFx);
        await sleep(300);
        const pcMove = emptyBoxes[randomIndex2];
        boxArray[pcMove].current.innerHTML = `<img src='${x_icon}'>`;
        data[pcMove] = "x";
        setCount((prevCount) => prevCount + 1);
        checkforWin();
        checkForTie();
        setPlayerTurn(true);
        setDisableClick(false);
      }
    } else if (mode === "medium") {
      const randomIndex1 = Math.floor(Math.random() * emptyBoxes.length);
      boxArray[
        emptyBoxes[randomIndex1]
      ].current.innerHTML = `<img id='ghost' src='${x_icon}'>`;
      playSoundFx(soundFx);
      await sleep(300);
      boxArray[emptyBoxes[randomIndex1]].current.innerHTML = "";
      // Medium mode strategy (blocks player win or makes a random move)
      const blockWinIndex = findBlockingMoveIndex("o");
      const pcMoveIndex =
        blockWinIndex !== -1 ? blockWinIndex : getRandomMoveIndex(emptyBoxes);
      if (pcMoveIndex !== -1 && data[pcMoveIndex] === "") {
        // Block the winning move or make a random move if no blocking move
        boxArray[pcMoveIndex].current.innerHTML = `<img src='${x_icon}'>`;
        data[pcMoveIndex] = "x";
        setCount((prevCount) => prevCount + 1);
        checkforWin();
        checkForTie();
        setPlayerTurn(true);
        setDisableClick(false);
      } else {
        // If no winning move or block available, make a random move
        const randomIndex = Math.floor(Math.random() * emptyBoxes.length);
        const pcMove = emptyBoxes[randomIndex];
        if (pcMove !== undefined) {
          boxArray[pcMove].current.innerHTML = `<img src='${x_icon}'>`;
          data[pcMove] = "x";
          setCount((prevCount) => prevCount + 1);
          checkforWin();
          setPlayerTurn(true);
          setDisableClick(false);
        }
      }
    } else if (mode === "hard") {
      const randomIndex1 = Math.floor(Math.random() * emptyBoxes.length);
      boxArray[
        emptyBoxes[randomIndex1]
      ].current.innerHTML = `<img id='ghost' src='${x_icon}'>`;
      playSoundFx(soundFx);
      await sleep(300);
      boxArray[emptyBoxes[randomIndex1]].current.innerHTML = "";
      // Hard mode strategy (blocks player win or finds a win condition)
      const winMoveIndex = findBlockingMoveIndex("x");
      if (winMoveIndex !== -1) {
        // Make the winning move
        boxArray[winMoveIndex].current.innerHTML = `<img src='${x_icon}'>`;
        data[winMoveIndex] = "x";
        setCount((prevCount) => prevCount + 1);
        checkforWin();
        checkForTie();
        setPlayerTurn(true);
        setDisableClick(false);
      } else {
        const blockWinIndex = findBlockingMoveIndex("o");
        const pcMoveIndex =
          blockWinIndex !== -1 ? blockWinIndex : getRandomMoveIndex(emptyBoxes);
        if (pcMoveIndex !== -1 && data[pcMoveIndex] === "") {
          // Block the winning move or make a random move if no blocking move
          boxArray[pcMoveIndex].current.innerHTML = `<img src='${x_icon}'>`;
          data[pcMoveIndex] = "x";
          setCount((prevCount) => prevCount + 1);
          checkforWin();
          checkForTie();
          setPlayerTurn(true);
          setDisableClick(false);
        } else {
          // If no winning move or block available, make a random move
          const randomIndex = Math.floor(Math.random() * emptyBoxes.length);
          const pcMove = emptyBoxes[randomIndex];
          if (pcMove !== undefined) {
            boxArray[pcMove].current.innerHTML = `<img src='${x_icon}'>`;
            data[pcMove] = "x";
            setCount((prevCount) => prevCount + 1);
            checkforWin();
            setPlayerTurn(true);
            setDisableClick(false);
          }
        }
      }
    }
  };

  // Helper function for introducing delay
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Function to check for a winner and update game state accordingly
  const checkForWinner = () => {
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Columns
      [0, 4, 8],
      [2, 4, 6], // Diagonals
    ];

    for (const condition of winConditions) {
      const [a, b, c] = condition;
      if (data[a] === data[b] && data[b] === data[c] && data[c] !== "") {
        handleWinner(data[c]);
        return true; // Winner found
      }
    }

    return false; // No winner found
  };

  // Function to check for a tie and update game state accordingly
  const checkForTie = () => {
    if (count === 9 && !lock) {
      // Check for a winner before declaring a tie
      const winnerFound = checkForWinner();
      if (!winnerFound) {
        setLock(true);
        titleRef.current.innerHTML = `It's a Tie <img src='${tie_icon}'>`;
        setTieCount((prevTieCount) => prevTieCount + 1);
        playSoundFx(drawFx);
        boxArray.forEach((box) => {
          if (box.current) {
            box.current.classList.add("tie-box");
          }
        });
      }
    }
  };

  // Function to check for a win and update game state accordingly
  const checkforWin = () => {
    if (!checkForWinner() && count === 9 && !lock) {
      setLock(true);
    }
  };

  // Function to handle the winner announcement and highlight winning boxes
  const handleWinner = (winner) => {
    setLock(true);
    if (winner === "x") {
      titleRef.current.innerHTML = `<img src='${x_winner}'> Wins!`;
      playSoundFx(loserFx);
      setTurtleScore((prevScore) => prevScore + 1);
    } else if (winner === "o") {
      titleRef.current.innerHTML = `<img src='${o_winner}'> Wins!`;
      playSoundFx(winnerFx);
      setRabbitScore((prevScore) => prevScore + 1);
    }

    // Highlight winning boxes
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Columns
      [0, 4, 8],
      [2, 4, 6], // Diagonals
    ];

    for (const condition of winConditions) {
      const [a, b, c] = condition;
      if (data[a] === data[b] && data[b] === data[c] && data[c] !== "") {
        // Add class to winning boxes
        if (boxArray[a].current)
          boxArray[a].current.classList.add("winning-box");
        if (boxArray[b].current)
          boxArray[b].current.classList.add("winning-box");
        if (boxArray[c].current)
          boxArray[c].current.classList.add("winning-box");

        // Update the title with the win message and achievement text
        titleRef.current.innerHTML = `<img src='${
          data[a] === "o" ? o_winner : x_winner
        }'> Wins!`;
        return; // Winner found
      }
    }
  };

  // Function to find an index to block the opponent's winning move
  const findBlockingMoveIndex = (playerSymbol) => {
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Columns
      [0, 4, 8],
      [2, 4, 6], // Diagonals
    ];

    for (const condition of winConditions) {
      const [a, b, c] = condition;
      const symbols = [data[a], data[b], data[c]];
      const playerCount = symbols.filter(
        (symbol) => symbol === playerSymbol
      ).length;
      const emptyCount = symbols.filter((symbol) => symbol === "").length;

      if (playerCount === 2 && emptyCount === 1) {
        // Block the winning move
        if (data[a] === "") {
          return a;
        } else if (data[b] === "") {
          return b;
        } else if (data[c] === "") {
          return c;
        }
      }
    }

    return -1; // No blocking move found
  };

  // Function to get a random move index from available empty boxes
  const getRandomMoveIndex = (emptyBoxes) => {
    return emptyBoxes.length > 0
      ? Math.floor(Math.random() * emptyBoxes.length)
      : -1;
  };

  // State variable to track achievements
  const [achievements, setAchievements] = useState({
    firstWin: false,
    threeWins: false,
    threeTies: false,
    threeLosses: false,
  });

  // Function to check for achievements
  const checkAchievements = () => {
    // Check for first win
    if (!achievements.firstWin && rabbitScore === 1) {
      setAchievements((prevAchievements) => ({
        ...prevAchievements,
        firstWin: true,
      }));
    }
    // Check for three wins
    if (!achievements.threeWins && rabbitScore === 3) {
      setAchievements((prevAchievements) => ({
        ...prevAchievements,
        threeWins: true,
      }));
    }
    // Check for three ties
    if (!achievements.threeTies && tieCount === 3) {
      setAchievements((prevAchievements) => ({
        ...prevAchievements,
        threeTies: true,
      }));
    }
    // Check for three losses
    if (!achievements.threeLosses && turtleScore === 3) {
      setAchievements((prevAchievements) => ({
        ...prevAchievements,
        threeLosses: true,
      }));
    }
  };

  // Function to open the achievement panel
  const openAchievementPanel = () => {
    setIsAchievementPanelOpen(true);
  };

  // Call checkAchievements function whenever rabbitScore, turtleScore, or tieCount changes
  useEffect(() => {
    checkAchievements();
  }, [rabbitScore, turtleScore, tieCount]);

  return (
    <div className="container">
      <h1 className="game-title" ref={titleRef}>
        RabTacTix
      </h1>
      <button className="info-button" onClick={toggleInfoModal}>
        <img src={infoIcon} alt="Info" />
      </button>
      {showInfoModal && <InfoModal onClose={toggleInfoModal} />}

      {/* Add a button to open the achievement panel */}
      <button className="achievement-button" onClick={openAchievementPanel}>
        <img src={cupIcon} alt="Achievements" />
      </button>
      {/* Render the AchievementPanel component */}
      {isAchievementPanelOpen && (
        <AchievementPanel
          onClose={() => setIsAchievementPanelOpen(false)}
          achievements={achievements}
        />
      )}

      <button className="mute-button" onClick={toggleMute}>
        {isMuted ? (
          <img src={unmuteIcon} alt="Unmute" />
        ) : (
          <img src={muteIcon} alt="Mute" />
        )}
      </button>
      <h2 className="score">
        <img id="score-img" src={o_winner} alt="Rabbit" /> {rabbitScore}
        <span id="space"></span>
        <img id="score-img" src={tie_icon} alt="Tie" /> {tieCount}
        <span id="space"></span>
        <img id="score-img" src={x_winner} alt="Turtle" /> {turtleScore}
      </h2>
      <h3 className="title" ref={titleRef}>
        <img src={o_winner} alt="Rabbit" />
        <span>VS</span>
        <img src={x_winner} alt="Turtle" />
      </h3>
      <div className="dropdown">
        <button
          className="reset"
          onClick={() => {
            Reset();
          }}
        >
          Reset
        </button>
        <span id="space-2"> </span>
        <label>Difficulty</label>
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      <div className="board">
        <div className="row-a">
          <div
            className="box"
            ref={box0}
            onClick={(e) => {
              toogle(e, 0);
            }}
          ></div>
          <div
            className="box"
            ref={box1}
            onClick={(e) => {
              toogle(e, 1);
            }}
          ></div>
          <div
            className="box"
            ref={box2}
            onClick={(e) => {
              toogle(e, 2);
            }}
          ></div>
        </div>
        <div className="row-b">
          <div
            className="box"
            ref={box3}
            onClick={(e) => {
              toogle(e, 3);
            }}
          ></div>
          <div
            className="box"
            ref={box4}
            onClick={(e) => {
              toogle(e, 4);
            }}
          ></div>
          <div
            className="box"
            ref={box5}
            onClick={(e) => {
              toogle(e, 5);
            }}
          ></div>
        </div>
        <div className="row-c">
          <div
            className="box"
            ref={box6}
            onClick={(e) => {
              toogle(e, 6);
            }}
          ></div>
          <div
            className="box"
            ref={box7}
            onClick={(e) => {
              toogle(e, 7);
            }}
          ></div>
          <div
            className="box"
            ref={box8}
            onClick={(e) => {
              toogle(e, 8);
            }}
          ></div>
        </div>
      </div>
      <div className="credits-container">
        <p className="credits-text">Developed by Stevenkoslaz</p>
        <a
          className="credits-link"
          href="https://github.com/stevenkoslaz"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img className="github-icon" src={githubIcon} alt="GitHub" />
        </a>
      </div>
    </div>
  );
};

export default TicTacToe;
