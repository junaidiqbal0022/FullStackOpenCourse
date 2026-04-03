import React from "react";

export const Button = ({ onClick, text }) => {
  return (
    <button
      style={{
        minWidth: "100px",
        minHeight: "40px",
        margin: "5px",
        padding: "5px",
        fontSize: "16px",
        fontWeight: "bold",
        fontFamily: "Arial, sans-serif",
        fontColor: "bbbbbb",
      }}
      onClick={onClick}
    >
      {text}
    </button>
  );
};
