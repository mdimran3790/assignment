import React, { useState } from "react";
import "./dropdown.css";
import icon from "../../images/dropdown.png";

function Dropdown({ options, selected, setSelected }) {
  const [isActive, setIsActive] = useState(false);
  return (
    <div className="drop-down">
      <div className="dropdown-btn" onClick={() => setIsActive(!isActive)}>
        {selected}
        <img style={{ height: 18, width: 18 }} src={icon} />{" "}
      </div>
      {isActive && (
        <div className="dropdown-content">
          {options.map((option) => {
            return (
              <div
                key={option}
                onClick={() => {
                  setSelected(option);
                  setIsActive(false);
                }}
                className="dropdown-item"
              >
                {option}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
