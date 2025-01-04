import React from 'react';
import ClientNavBar from '../../Nav/ClientNabBar';
import ClientFooter from '../../Footer/ClientFooter';

export default function EditProfile() {
  return (
    <div className="bg-gray-100">
      {/* bg-white is new */}
      <div className="flex flex-col min-h-screen">
        <ClientNavBar />
        <main className="flex-grow  ">
          {/* -------####---------- Warning !---------------####------------*/}
          {/* Do not edit other code in this file. You can only add, edit, or delete code within this 'Editable area' section. */}
          {/* Editable area start */}

          {/* Editable area end  */}
        </main>

        <ClientFooter />
      </div>
    </div>
  );
}
