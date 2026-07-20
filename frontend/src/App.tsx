import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Accounts from './components/Accounts'
import Categories from './components/Categories'
import Profile from './components/Profile'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import { supabase } from './lib/supabase';
import type { Session } from '@supabase/supabase-js';

export interface Account {
  id: number
  name: string
  type: 'Checkings' | 'Savings' | 'Credit Card'
  balance: number
}

export interface Category {
  id: number
  name: string
  color: string
  budget: number
  spent: number
}

export interface Transaction {
  name: string
  amount: number
  date: string
  categoryId: number
}

export interface FinancialProfile {
    monthlyIncome: string
    riskTolerance: 'Conservative' | 'Moderate' | 'Aggressive'
    savingsTarget: string
}

const initialAccounts: Account[] = [
    { id: 1, name: 'Chase Checkings', type: 'Checkings', balance: 3240.50 },
    { id: 2, name: 'Chase Savings', type: 'Savings', balance: 8500.40 },
    { id: 3, name: 'Visa Card', type: 'Credit Card', balance: -1200.00 }
]

const initialCategories: Category[] = [
    { id: 1, name: 'Food', color: '#4ade80', budget: 400, spent: 340 },
    { id: 2, name: 'Rent', color: '#60a5fa', budget: 1200, spent: 1200 },
    { id: 3, name: 'Transport', color: '#c084fc', budget: 200, spent: 145 },
    { id: 4, name: 'Shopping', color: '#facc15', budget: 300, spent: 210 },
    { id: 5, name: 'Subscriptions', color: '#f87171', budget: 100, spent: 82}
]

const initialTransactions: Transaction[] = [
    { name: 'Publix', amount: 87.43, date: 'Jul 3', categoryId: 1},
    { name: 'Hulu', amount: 15.99, date: 'June 30', categoryId: 5},
    { name: 'Chipotle', amount: 13.50, date: 'Jul 8', categoryId: 1},
    { name: 'Shell', amount: 45.20, date: 'Jul 4', categoryId: 3},
]


function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const [accounts, setAccounts] = useState<Account[]>(initialAccounts)
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)
  const [financialProfile, setFinancialProfile] = useState<FinancialProfile>({
    monthlyIncome: '',
    riskTolerance: 'Moderate',
    savingsTarget: ''
  })

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
    { session ? (
      <div className="flex h-screen text-white overflow-hidden">
        <Sidebar onLogout={ async () => 
          await supabase.auth.signOut().then(() => setSession(null))
        } />
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard
                  accounts={accounts}
                  categories={categories}
                  transactions={transactions}
                  financialProfile={financialProfile}></Dashboard>
              } />
              <Route path="/accounts" element={<Accounts
                accounts={accounts}
                setAccounts={setAccounts}
                transactions={transactions}></Accounts>} />
              <Route path="/categories" element={<Categories
                categories={categories}
                setCategories={setCategories}
                transactions={transactions}></Categories>} />
              <Route path="/profile" element={<Profile
                financialProfile={financialProfile}
                setFinancialProfile={setFinancialProfile}></Profile>} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </main>
      </div>
    ) : (
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    )}
    </BrowserRouter>
  )
}

export default App
