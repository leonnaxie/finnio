import { useState } from "react"
import AccountModal from "./AccountModal"
import { supabase } from "../lib/supabase"
import type { Account, Transaction } from "../App"

interface Props {
    accounts: Account[]
    setAccounts: React.Dispatch<React.SetStateAction<Account[]>>
    transactions: Transaction[]
}

function Accounts({ accounts, setAccounts, transactions }: Props) {
    const [selectedAmount, setSelectedAmount] = useState<Account | null>(accounts[0] ?? null)
    const [showModal, setShowModal] = useState(false)

    const handleDelete = async (id: string) => {
        const { error } = await supabase.from('accounts').delete().eq('id', id)
        if (error) {
            alert(error.message)
            return
        }
        setAccounts(prev => prev.filter(account => account.id !== id))
        if (selectedAmount?.id === id) {
            setSelectedAmount(null)
        }
    }

    const handleSaveAccounts = async (
        newAccounts: { name: string; type: 'Checkings' | 'Credit Card' | 'Savings'; balance: number }[]
    ) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
            .from('accounts')
            .insert(newAccounts.map(a => ({ ...a, user_id: user.id })))
            .select()

        if (error) {
            alert(error.message)
            return
        }

        if (data) {
            setAccounts(prev => [...prev, ...data])
        }
        setShowModal(false)
    }

    return (
        <div className="flex h-screen">
            <div className="flex-1 p-6 overflow-y-auto">
                <div className="flex gap-4 h-full">
                    {/* Accounts List */}
                    <div className="w-64 min-w-[256px] flex flex-col gap-3 overflow-y-auto">
                        {accounts.map(account => (
                            <div key={account.id} className="relative group">
                                <button
                                    onClick={() => setSelectedAmount(account)}
                                    className={`w-full rounded-xl p-4 text-left transition-all ${selectedAmount?.id === account.id ? 'bg-finnio-card-2' : 'bg-finnio-card-1 hover:bg-finnio-card2'}`}>
                                    <p className="font-semibold">{account.name}</p>
                                    <p className="text-sm opacity-70">{account.type}</p>
                                    <p className={`text-lg font-bold mt-1 ${account.balance < 0 ? 'text-red-400' : 'text-green-400'}`}>${Math.abs(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                </button>

                                <button
                                    onClick={() => handleDelete(account.id)}
                                    className="absolute top-2 right-2 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs">✕</button>
                            </div>
                        ))}

                        <button
                            onClick={() => setShowModal(true)}
                            className="rounded-xl p-4 border-2 border-dashed border-gray-400 text-gray-400 hover:border-black hover:text-black transition-all text-sm">
                            + Add Account
                        </button>
                    </div>

                    {/* Account Details */}
                    <div className="flex-1 overflow-y-auto">
                        {selectedAmount && (
                            <div className="flex-1 bg-finnio-card-1 rounded-xl p-6 flex flex-col gap-4">
                                <div>
                                    <h3 className="text-2xl font-bold">{selectedAmount.name}</h3>
                                    <p className="text-sm opacity-70">{selectedAmount.type}</p>
                                </div>

                                <div>
                                    <p className="text-sm opacity-70">Current Balance</p>
                                    <p className={`text-4xl font-bold ${selectedAmount.balance < 0 ? 'text-red-400' : 'text-green-400'}`}>${Math.abs(selectedAmount.balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                </div>

                                <div className="bg-finnio-card-2 rounded-xl p-4 flex-1">
                                    <h4 className="font-semibold mb-3">Recent Transactions</h4>
                                    <div className="flex flex-col gap-2">
                                        {transactions.map((tx, i) => (
                                            <div key={i} className="flex justify-between items-center py-2 border-b border-white/10">
                                                <div>
                                                    <p className="text-sm font-medium">{tx.name}</p>
                                                    <p className="text-xs opacity-50">{tx.date}</p>
                                                </div>
                                                <p className={`text-sm font-semibold ${tx.amount < 0 ? 'text-red-400' : 'text-green-400'}`}>
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
            </div>

            {showModal && (
                <AccountModal
                    onClose={() => setShowModal(false)}
                    onSave={handleSaveAccounts} />
            )}
        </div>
    )
}

export default Accounts