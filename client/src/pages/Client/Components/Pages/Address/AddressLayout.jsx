import React from 'react'
import ClientNavBar from '../../Nav/ClientNabBar'
import ClientFooter from '../../Footer/ClientFooter'
import AddressContent from './AddressContent'

export default function AddressLayout() {
  return (
    <div className='bg-gray-100'>{/* bg-white is new */}
     <div className="flex flex-col min-h-screen">
        <ClientNavBar />
        <main className="flex-grow  ">
        <AddressContent />
        </main>
        
        <ClientFooter />
      </div>
    </div>
  )
}
