import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import ChatPanel from './components/chat/ChatPanel'
import Accounts from './components/Accounts'
import Categories from './components/Categories'
import Profile from './components/Profile'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen text-white overflow-hidden">

        <Sidebar />

        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard></Dashboard>} />
            <Route path="/accounts" element={<Accounts></Accounts>} />
            <Route path="/categories" element={<Categories></Categories>} />
            <Route path="/profile" element={<Profile></Profile>} />
          </Routes>
        </main>

      </div>
    </BrowserRouter>
  )
}

export default App
