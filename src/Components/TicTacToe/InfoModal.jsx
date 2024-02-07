import React from "react";
import "./InfoModal.css";
import o_icon from "../Assets/rabbit-player.png";
import x_icon from "../Assets/turtle-player.png";

const InfoModal = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-text">
          <button className="close-button" onClick={onClose}>
            x
          </button>
          <div class="info-container">
            <div class="player-info">
              <img src={o_icon} alt="Rabbit" />
              <span>Player</span>
            </div>
            <div class="bot-info">
              <img src={x_icon} alt="Turtle" />
              <span>PC Bot</span>
            </div>
          </div>
          <p>Bot Difficulties:</p>
          <ul>
            <li>Easy: Random moves.</li>
            <li>Medium: Blocks winning moves.</li>
            <li>Hard: Blocks winning moves and tries to win.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;