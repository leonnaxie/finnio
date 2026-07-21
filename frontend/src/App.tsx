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
  id: string
  name: string
  type: 'Checkings' | 'Savings' | 'Credit Card'
  balance: number
}

export interface Category {
  id: string
  name: string
  color: string
  budget: number
  spent: number
}

export interface Transaction {
  id: string
  name: string
  amount: number
  date: string
  categoryId: string
}

export interface FinancialProfile {
    monthlyIncome: string
    riskTolerance: 'Conservative' | 'Moderate' | 'Aggressive'
    savingsTarget: string
}

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const [accounts, setAccounts] = useState<Account[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [financialProfile, setFinancialProfile] = useState<FinancialProfile>({
    monthlyIncome: '',
    riskTolerance: 'Moderate',
    savingsTarget: ''
  })

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);


  useEffect(() => {
    if (!session) return;

    const fetchData = async () => {
      const [
        { data: accountsData, error: accountsError },
        { data: categoriesData, error: categoriesError },
        { data: transactionsData, error: transactionsError },
        { data: profileData, error: profileError },
      ] = await Promise.all([
        supabase.from('accounts').select('*'),
        supabase.from('categories').select('*'),
        supabase.from('transactions').select('*'),
        supabase.from('financial_profiles').select('*').single(),
      ]);

      if (accountsError) console.error('accounts fetch error:', accountsError);
      if (categoriesError) console.error('categories fetch error:', categoriesError);
      if (transactionsError) console.error('transactions fetch error:', transactionsError);
      if (profileError) console.error('profile fetch error:', profileError);

      if (accountsData) {
        setAccounts(accountsData.map(a => ({
          id: a.id,
          name: a.name,
          type: a.type,
          balance: a.balance,
        })));
      }

      if (categoriesData) {
        setCategories(categoriesData.map(c => ({
          id: c.id,
          name: c.name,
          color: c.color,
          budget: c.budget,
          spent: c.spent,
        })));
      }

      if (transactionsData) {
        setTransactions(transactionsData.map(t => ({
          id: t.id,
          name: t.name,
          amount: t.amount,
          date: t.date,
          categoryId: t.category_id,
        })));
      }

      if (profileData) {
        setFinancialProfile({
          monthlyIncome: String(profileData.monthly_income ?? ''),
          riskTolerance: profileData.risk_tolerance ?? 'Moderate',
          savingsTarget: String(profileData.savings_target ?? ''),
        });
      }
    };

    fetchData();
  }, [session]);

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