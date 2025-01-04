import React from 'react';
import PropTypes from 'prop-types';

function Container({ children }) {
  return (
    <div className="max-w-[1920px] mx-auto xl:px-20 md:px-2 px-4">
      {children}
    </div>
  );
}

Container.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Container;
