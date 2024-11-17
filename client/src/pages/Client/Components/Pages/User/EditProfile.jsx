import React from 'react'
import ClientNavBar from '../../Nav/ClientNabBar'
import ClientFooter from '../../Footer/ClientFooter'

export default function EditProfile() {
  return (
    <div className="bg-gray-100">
      {/* bg-white is new */}
      <div className="flex flex-col min-h-screen">
        <ClientNavBar />
        <main className="flex-grow  ">
          {/*-------####---------- Warning !---------------####------------*/}
          {/* Do not edit other code in this file. You can only add, edit, or delete code within this 'Editable area' section. */}
          {/* Editable area start */}

          <h2 className="text-2xl text-center mt-20  text-cyan-950">
            Edit Profile
          </h2>
          <h5 className="text-base text-center mt-2 mb-20 text-red-600 underline">
            Please read comments in the code
          </h5>
          {/* Editable area end  */}
        </main>

        <ClientFooter />
      </div>
    </div>
  )
}
