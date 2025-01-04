import React from 'react';
import CategoryDetails from './CategoryDetails';
import ClientNavBar from '../../Nav/ClientNabBar';
import ClientFooter from '../../Footer/ClientFooter';

export default function Category() {
  return (
    <div>
      <div className="bg-gray-100">
        {/* bg-white is new */}
        <div className="flex flex-col min-h-screen">
          <ClientNavBar />
          <main className="flex-grow  ">
            <CategoryDetails />
          </main>

          <ClientFooter />
        </div>
      </div>
    </div>
  );
}
