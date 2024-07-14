import React from 'react'
import ClientNabBar from '../Nav/ClientNabBar'
import ClientFooter from '../Footer/ClientFooter'
import ClientPage from './ClientPage'

export default function Layout() {
  return (
    <div>
     <div className="flex flex-col min-h-screen">
        <ClientNabBar />
        <main className="flex-grow ">
        <ClientPage />
        </main>
        
        <ClientFooter />
      </div>
    </div>
  )
}
