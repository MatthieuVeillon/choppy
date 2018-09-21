import React from "react";
import PropTypes from "prop-types";
import { Box, FormField } from "../BasicComponents/Box";

export const TextInput = ({ name, onChange, value }) => (
  <Box >
    <FormField type="text" value={value} onChange={onChange} id="title" placeholder={name} required />
  </Box>
);

TextInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};
