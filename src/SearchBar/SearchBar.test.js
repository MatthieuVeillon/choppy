import React from 'react';
import { SearchBarBase } from './SearchBar';
import { render, fireEvent } from 'react-testing-library';

describe('SearchBar', function() {
  //test in isolation

  it('allow the user to search for a recipe', () => {
    //arrange
    const props = {
      searchTerm: 'tarte',
      setSearchTerm: jest.fn(searchTerm => (this.searchTerm = searchTerm)),
      dispatch: jest.fn()
    };
    const { container } = render(<SearchBarBase {...props} />);
    const formNode = container.querySelector('form');

    //act
    fireEvent.submit(formNode);

    //assert
    expect(props.dispatch).toHaveBeenCalledTimes(1);
    expect(props.dispatch).toHaveBeenCalledWith({
      searchTerm: 'tarte',
      type: 'RECIPE_SEARCH_SET'
    });
  });
});
