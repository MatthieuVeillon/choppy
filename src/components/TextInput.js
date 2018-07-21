import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

export const TextInput = ({ name, onChange, value }) => (
  <div>
    <label>
      <StyledInput
        type="text"
        value={value}
        onChange={onChange}
        id="title"
        placeholder={name}
        required
      />
    </label>
  </div>
);

TextInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

const StyledInput = styled.input`
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
`;
