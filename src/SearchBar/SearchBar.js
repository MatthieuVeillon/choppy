import { Box } from '../BasicComponents/Box';
import { Form } from '../BasicComponents/Form';
import React from 'react';
import { compose, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import { doSetRecipeSearch } from './searchBar-reducer';

export const SearchBarBase = ({ searchTerm, setSearchTerm, dispatch }) => {
  const handleSubmit = e => {
    e.preventDefault();
    return dispatch(doSetRecipeSearch(searchTerm));
  };
  return (
    <Box>
      <Form onSubmit={handleSubmit}>
        <Box>
          <label htmlFor="search">search</label>
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={setSearchTerm}
          />
          <button type="submit">search</button>
        </Box>
      </Form>
    </Box>
  );
};

export const SearchBar = compose(
  withState('searchTerm', 'setSearchTerm', ''),
  withHandlers({
    setSearchTerm: ({ setSearchTerm }) => e => {
      setSearchTerm(e.target.value);
    }
  }),
  connect()
)(SearchBarBase);
