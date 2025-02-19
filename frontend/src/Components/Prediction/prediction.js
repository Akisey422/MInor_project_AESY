import React, { useEffect } from "react";
import styled from "styled-components";

function Prediction() {
  return (
    <PredictionStyled>
      <h1>Predictions</h1>
      <div className="month-selector">
        <label htmlFor="month">Select Month:</label>
        <select id="month">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
        </select>
        <button>Predict</button>
      </div>
    </PredictionStyled>
  );
}

const PredictionStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  .month-selector {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;
  }
`;

export default Prediction;
