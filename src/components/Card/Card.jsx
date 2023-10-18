import React from "react";
import "./card.css";
import profile from "../../images/profile.png";
import alert from "../../images/alert.png";

function Card({ ticket }) {
  return (
    <div className="card-container">
      <div className="name-icon">
        <div className="text">{ticket.id}</div>
        <img src={profile} className="profile-icon" />
      </div>
      <div className="title">{ticket.title}</div>
      <div className="feature-request"> 
        <div className="box">
          <img src={alert} className="profile-icon" />
        </div>
        <div className="box">
          <div className="dot"></div>
          <div className="text2">{ticket.tag[0]}</div>
        </div>
      </div>
    </div>
  );
}

export default Card;
