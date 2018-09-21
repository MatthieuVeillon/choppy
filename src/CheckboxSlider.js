import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Box, FormField } from "./BasicComponents/Box";

export const CheckboxSlider = ({ name, onChange, value }) => (
  <Box spaceBetween alignItems>
    <span> {name}</span> <FormField left="10px" type="checkbox" value={value} onChange={onChange} id={name} />
  </Box>
);

CheckboxSlider.propTypes = {
  name: PropTypes.string.isRequired,

  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
};
