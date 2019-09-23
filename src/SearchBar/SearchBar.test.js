import React from 'react';
import { SearchBar } from './SearchBar';
import { render, fireEvent } from '@testing-library/react';

describe('SearchBar', function() {
  it('allow the user to search for a recipe', () => {
    let props = {
      searchTerm: '',
      setSearchTerm: jest.fn()
    };
    const { getByLabelText, rerender } = render(<SearchBar {...props} />);
    const input = getByLabelText('search');
    expect(input.value).toBe('');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(props.setSearchTerm).toHaveBeenCalledTimes(1);

    props = { ...props, searchTerm: 'test' };
    rerender(<SearchBar {...props} />);
    expect(input.value).toBe('test');
  });
});
