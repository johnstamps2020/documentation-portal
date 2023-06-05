import React from 'react';
import Explorer from './Explorer';

export default function Explore() {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <div
        className="button button--secondary button--lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        Explore
      </div>
      {isOpen && <Explorer setIsOpen={setIsOpen} />}
    </>
  );
}
