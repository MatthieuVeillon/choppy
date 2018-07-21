import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

export const NumberInput = ({ onChange, name, value }) => (
  <div>
    <label>
      <StyledInput
        type="number"
        id={name}
        value={value}
        onChange={onChange}
        required
        placeholder={name}
      />
    </label>
  </div>
);

NumberInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

const StyledInput = styled.input`
  width: 20px
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
`;
