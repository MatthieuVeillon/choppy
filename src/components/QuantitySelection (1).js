import React from "react";

export const QuantitySelection = ({ name }) => (
  <select name={name}>
    <option value="g" selected>
      g
    </option>
    <option value="l">l</option>
    <option value="cup">cup</option>
    <option value="piece">piece</option>
  </select>
);
