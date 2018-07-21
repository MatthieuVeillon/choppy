import React from "react";
import PropTypes from "prop-types";

export function RecipeHomeCard({ title, uploadImageUrl }) {
  return (
    <div>
      <img src={uploadImageUrl} alt={uploadImageUrl} height="150" width="150" />
      <h4>{title}</h4>
    </div>
  );
}

RecipeHomeCard.propTypes = {
  title: PropTypes.string.isRequired,
  uploadImageUrl: PropTypes.string.isRequired
};
