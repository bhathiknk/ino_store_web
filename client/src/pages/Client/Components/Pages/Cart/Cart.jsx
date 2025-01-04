import React from 'react';

import Cartdata from './Cartdata';

export default function Cart() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow ">
        <Cartdata />
      </main>
    </div>
  );
}
