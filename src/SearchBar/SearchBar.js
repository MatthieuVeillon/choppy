import { Box } from '../BasicComponents/Box';
import React from 'react';

export const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <Box>
      <Box>
        <label htmlFor="search">search</label>
        <input
          id="search"
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </Box>
    </Box>
  );
};
