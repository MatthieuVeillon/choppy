import React from 'react';
import PropTypes from 'prop-types';

const Link = ({ active, children, onClick }) => {
  return (
    <button
      style={
        active
          ? { backgroundColor: 'darkgray' }
          : { backgroundColor: undefined }
      }
      onClick={e => {
        e.preventDefault();
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
