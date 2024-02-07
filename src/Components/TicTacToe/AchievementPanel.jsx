// AchievementPanel.jsx
import React from "react";
import "./InfoModal.css";
import congrats from "../Assets/congratulation.png";

const AchievementPanel = ({ onClose, achievements }) => {
  const allAchieved =
    achievements.firstWin &&
    achievements.threeWins &&
    achievements.threeTies &&
    achievements.threeLosses;
  return (
    <div className="achievement-panel">
      <button className="close-button" onClick={onClose}>
        x
      </button>
      <div className="achievement-header">
        <h2>Achievements</h2>
      </div>
      {allAchieved ? (
        <div className="congratulations-message">
          <img src={congrats} alt="congrats" />
          <p className="congratulations-text">
            You achieved all the achievements!
          </p>
        </div>
      ) : (
        <ul className="achievement-list">
          <li>
            First Win:{" "}
            <span className={achievements.firstWin ? "achieved" : ""}>
              {achievements.firstWin ? "Achieved" : "Not Yet"}
            </span>
          </li>
          <li>
            3 Wins:{" "}
            <span className={achievements.threeWins ? "achieved" : ""}>
              {achievements.threeWins ? "Achieved" : "Not Yet"}
            </span>
          </li>
          <li>
            3 Ties:{" "}
            <span
              style={{
                color: achievements.threeTies ? "greenyellow" : "orange",
              }}
            >
              {achievements.threeTies ? "Achieved" : "Not Yet"}
            </span>
          </li>
          <li>
            3 Losses:{" "}
            <span
              style={{
                color: achievements.threeLosses ? "greenyellow" : "orange",
              }}
            >
              {achievements.threeLosses ? "Achieved" : "Not Yet"}
            </span>
          </li>
        </ul>
      )}
    </div>
  );
};

export default AchievementPanel;
