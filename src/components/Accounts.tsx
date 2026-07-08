import { useState } from "react"
import AccountModal from "./AccountModal"

interface Account {
    id: number
    name: string
    type: 'Checkings' | 'Savings' | 'Credit Card'
    balance: number
}

const mockAccounts: Account[] = [
    { id: 1, name: 'Chase Checkings', type: 'Checkings', balance: 3240.50 },
    { id: 2, name: 'Chase Savings', type: 'Savings', balance: 8500.40 },
    { id: 3, name: 'Visa Card', type: 'Credit Card', balance: -1200.00 }
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
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Accounts