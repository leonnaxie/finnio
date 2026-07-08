import { useState } from "react"
import AccountModal from "./AccountModal"

interface Account {
    id: number
    name: string
    type: 'Checkings' | 'Savings' | 'Credit Card'
    balance: number
}

interface Transaction {
    name: string
    amount: number
    date: string
}

const mockAccounts: Account[] = [
    { id: 1, name: 'Chase Checkings', type: 'Checkings', balance: 3240.50 },
    { id: 2, name: 'Chase Savings', type: 'Savings', balance: 8500.40 },
    { id: 3, name: 'Visa Card', type: 'Credit Card', balance: -1200.00 }
]

const mockTransactions: Transaction[] = [
    { name: 'Walmart', amount: 87.34, date: 'Jul 2'},
    { name: 'Netflix', amount: 16.99, date: 'Jul 7'},
    { name: 'Direct Deposit', amount: 1200.00, date: 'Jul 1'}
]

function Accounts() {
    const [accounts, setAccounts] = useState<Account[]>(mockAccounts)
    const [selectedAmount, setSelectedAmount] = useState<Account | null>(mockAccounts[0])
    const [showModal, setShowModal] = useState(false)

    return (
        <div className="flex h-screen">

            <div className="flex-1 p-6 overflow-y-auto">
                <h2 className="text-xl mb-6">accounts</h2>

                <div className="flex gap-4 h-full">
                    {/* Accounts List */}
                    <div className="w-64 flex flex-col gap-3">
                        {accounts.map(account => (
                            <button 
                                key={account.id}
                                onClick={() => setSelectedAmount(account)}
                                className={`rounded-xl p-4 text-left transition-all ${selectedAmount?.id === account.id ? 'bg-finnio-card-2' : 'bg-finnio-card-1 hover:bg-finnio-card2'}`}>
                            
                                <p className="font-semibold">{account.name}</p>
                                <p className="text-sm opacity-70">{account.type}</p>
                                <p className={`text-lg font-bold mt-1 ${account.balance < 0 ? 'text-red-400' : 'text-green-400'}`}>${Math.abs(account.balance).toLocaleString()}</p>
                            </button>
                        ))}

                        <button
                            onClick={() => setShowModal(true)}
                            className="rounded-xl p-4 border-2 border-dashed border-gray-400 text-gray-400 hover:border-white hover:text-white transition-all text-sm">
                                + Add Account
                            </button>
                    </div>

                    {/* Account Details */}
                    {selectedAmount && (
                        <div className="flex-1 bg-finnio-card-1 rounded-xl p-6 flex flex-col gap-4">
                            <div>
                                <h3 className="text-2xl font-bold">{selectedAmount.name}</h3>
                                <p className="text-sm opacity-70">{selectedAmount.type}</p>
                            </div>

                        
                            <div>
                                <p className="text-sm opacity-70">Current Balance</p>
                                <p className={`text-4xl font-bold ${selectedAmount.balance < 0 ? 'text-red-400' : 'text-green-400'}`}>${Math.abs(selectedAmount.balance).toLocaleString()}</p>
                            </div>

                            {/* Recent Transactions */}
                            <div className="bg-finnio-card-2 rounded-xl p-4 flex-1">
                                <h4 className="font-semibold mb-3">Recent Transactions</h4>
                                <div className="flex flex-col gap-2">
                                    {mockTransactions.map((tx, i) => (
                                        <div key={i} className="flex justify-between items-center py-2 border-b border-white/10">
                                            <div>
                                                <p className="text-sm font-medium">{tx.name}</p>
                                                <p className="text-xs opacity-50">{tx.date}</p>
                                            </div>
                                            <p className={`text-sm font-semibold ${
                                                tx.amount < 0 ? 'text-red-400' : 'text-green-400'}`}>
                                                    {tx.amount < 0 ? '-' : '+'}${Math.abs(tx.amount)}
                                                </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <AccountModal
                    onClose={() => setShowModal(false)}
                    onSave={(newAccounts) => {
                        setAccounts(prev => [...prev, ...newAccounts])
                        setShowModal(false)
                    }} />
            )}
        </div>
    )
}

export default Accounts