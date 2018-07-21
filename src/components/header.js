import React from "react";
import CategoryFilter from "../containers/CategoryFilter";

const Header = () => (
  <p>
    Show: <CategoryFilter category="SHOW_ALL">All</CategoryFilter>
    {", "}
    <CategoryFilter category="SHOW_VEGAN">Vegan</CategoryFilter>
    {", "}
    <CategoryFilter category="SHOW_HEALTHY">Healthy</CategoryFilter>
  </p>
);

export default Header;
