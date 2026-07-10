import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Accounts from './components/Accounts'
import Categories from './components/Categories'
import Profile from './components/Profile'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <BrowserRouter>
    { isLoggedIn ? (
      <div className="flex h-screen text-white overflow-hidden">
        <Sidebar onLogout={() => setIsLoggedIn(false)} />
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard></Dashboard>} />
              <Route path="/accounts" element={<Accounts></Accounts>} />
              <Route path="/categories" element={<Categories></Categories>} />
              <Route path="/profile" element={<Profile></Profile>} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </main>
      </div>
    ) : (
      <Routes>
        <Route path="/" element={<SignIn onLogin={() => setIsLoggedIn(true)} />} />
        <Route path="/signup" element={<SignUp onLogin={() => setIsLoggedIn(true)} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    )}
    </BrowserRouter>
  )
}

export default App
