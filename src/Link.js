import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Link = ({ active, children, onClick }) => {
  if (active) {
    return <span>{children}</span>;
  }
  const [isSelected, setIsSelected] = useState(false);

  return (
    <button
      style={
        isSelected
          ? { backgroundColor: 'darkgray' }
          : { backgroundColor: undefined }
      }
      onClick={e => {
        e.preventDefault();
        setIsSelected(!isSelected);
        onClick();
      }}
    >
      {children}
    </button>
  );
};

Link.propTypes = {
  active: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired
};

export default Link;
