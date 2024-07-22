import React from 'react'
import ClientNabBar from '../../Nav/ClientNabBar'
import ClientFooter from '../../Footer/ClientFooter'


export default function Cart() {
    
  return (
    <div className="flex flex-col min-h-screen">
    <ClientNabBar />
    <main className="flex-grow ">
     This is Cart Page
    </main>
    
    <ClientFooter />
  </div>
  )
}
