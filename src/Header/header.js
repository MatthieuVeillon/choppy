import React from 'react';
import Link from '../Link';

const Header = ({ dispatchFilter, filter }) => {
  const handleShowAll = () => {
    dispatchFilter({ type: 'SHOW_ALL' });
  };

  const handleShowVegan = () => {
    dispatchFilter({ type: 'SHOW_VEGAN' });
  };

  const handleShowHealthy = () => {
    dispatchFilter({ type: 'SHOW_HEALTHY' });
  };

  return (
    <p>
      Show:{' '}
      <Link active={filter === 'ALL'} onClick={handleShowAll}>
        All
      </Link>
      {', '}
      <Link active={filter === 'VEGAN'} onClick={handleShowVegan}>
        Vegan
      </Link>
      {', '}
      <Link active={filter === 'HEALTHY'} onClick={handleShowHealthy}>
        {' '}
        Healthy
      </Link>
    </p>
  );
};

export default Header;
