import React from 'react';

const Heading = props => {
  return (
    <header>
      <h1>{props.name}'s Todo List</h1>
      <h2>so much to do...</h2>
    </header>
  );
};

export default Heading;
