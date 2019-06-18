import React, { useReducer, useState } from 'react';
import Header from '../Header/header';
import { SearchBar } from '../SearchBar/SearchBar';
import { RecipeList, VisibleRecipeList } from './RecipeList/RecipeList';

const filterReducer = (state, action) => {
  switch (action.type) {
    case 'SHOW_ALL':
      return 'ALL';
    case 'SHOW_VEGAN':
      return 'VEGAN';
    case 'SHOW_HEALTHY':
      return 'HEALTHY';
    default:
      throw new Error('not a type supported for filter');
  }
};

export const RecipePage = () => {
  const [filter, dispatchFilter] = useReducer(filterReducer, 'ALL');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div>
      <Header filter={filter} dispatchFilter={dispatchFilter} />
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <RecipeList searchTerm={searchTerm} filter={filter} />
    </div>
  );
};
