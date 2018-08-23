import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

export const CheckboxSlider = ({ name, onChange, value }) => (
  <CheckBoxWrapper>
    {name}
    <input type="checkbox" value={value} onChange={onChange} id={name} />
  </CheckBoxWrapper>
);

CheckboxSlider.propTypes = {
  name: PropTypes.string.isRequired,

  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
};

const CheckBoxWrapper = styled.label`
  margin-top: 10px;
`;
