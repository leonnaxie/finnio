import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import ChatPanel from './components/chat/ChatPanel'

function App() {
  return (
    <>
    <div className="flex h-screen bg-gray-900 text-white">

      <Sidebar />

      <main className="flex-1 overflow-y-auto p-6">
        <Dashboard />
      </main>

      <ChatPanel />
    </div>
    </>
  )
}

export default App
