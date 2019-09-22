import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export const ImageInput = ({ name, onChange, isLoading }) => (
  <ImageInputWrapper>
    {name}
    <input type="file" onChange={onChange} required />
    {isLoading && <span>currenlty loading</span>}
  </ImageInputWrapper>
);

ImageInput.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

const ImageInputWrapper = styled.label`
  margin-top: 10px;
`;
