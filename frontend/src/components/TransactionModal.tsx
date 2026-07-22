import { useState } from "react"
import type { Account, Category } from "../App"

interface Props {
    onClose: () => void
    onSave: (transaction: {
        name: string
        amount: number
        date: string
        categoryId: string
        accountId: string
    }) => void
    accounts: Account[]
    categories: Category[]
    defaultAccountId?: string
    defaultCategoryId?: string
}


function TransactionModal({ onClose, onSave, accounts, categories, defaultAccountId, defaultCategoryId }: Props) {
    const [name, setName] = useState('')
    const [amount, setAmount] = useState('')
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
    const [type, setType] = useState<'Expense' | 'Income'>('Expense')
    const [accountId, setAccountId] = useState(defaultAccountId ?? accounts[0]?.id ?? '')
    const [categoryId, setCategoryId] = useState(defaultCategoryId ?? categories[0]?.id ?? '')

    const canSave = name.trim() && amount && accountId && categoryId

    const handleSave = () => {
        if (!canSave) return

        const parsed = parseFloat(amount)
        const signedAmount = type === 'Expense' ? -Math.abs(parsed) : Math.abs(parsed)

        onSave({
            name: name.trim(),
            amount: signedAmount,
            date,
            categoryId,
            accountId
        })
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-finnio-sidebar rounded-2xl p-6 w-[400px] flex flex-col gap-4">
                <h2 className="text-lg font-semibold">Add Transaction</h2>

                <div>
                    <label className="text-xs opacity-70 mb-1 block">Description</label>
                    <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Publix"
                        className="w-full bg-white rounded-lg px-3 py-2 text-sm text-black outline-none placeholder:text-gray-400"
                    />
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setType('Expense')}
                        className={`flex-1 py-2 rounded-lg text-xs transition-all ${type === 'Expense' ? 'bg-finnio-card-2' : 'bg-white/10 hover:bg-white/20'}`}>
                            Expense
                    </button>

                    <button
                        onClick={() => setType('Income')}
                        className={`flex-1 py-2 rounded-lg text-xs transition-all ${type === 'Income' ? 'bg-finnio-card-2' : 'bg-white/10 hover:bg-white/20'}`}>
                            Income
                    </button>
                </div>

                <div>
                    <label className="text-xs opacity-70 mb-1 block">Amount</label>
                    <input
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        placeholder="e.g. 45.00"
                        type="number"
                        min="0"
                        className="w-full bg-white rounded-lg pl-7 pr-3 py-2 text-sm text-gray-500 outline-none placeholder:text-gray-400" />
                </div>

            <div>
                <label className="text-xs opacity-70 mb-1 block">Date</label>
                <input 
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    type="date"
                    className="w-full bg-white/20 rounded-lg px-3 py-2 text-sm outline-none" />
            </div>

            <div>
                <label className="text-xs opacity-70 mb-1 block">Account</label>
                <select
                    value={accountId}
                    onChange={e => setAccountId(e.target.value)}
                    className="w-full bg-white/20 rounded-lg px-3 py-2 text-sm outline-none">
                        {accounts.map(acc => (
                            <option className="text-gray-500" key={acc.id} value={acc.id}>{acc.name}</option>
                        ))}
                    </select>
            </div>

            <div>
                <label className="text-xs opacity-70 mb-1 block">Category</label>
                <select
                    value={categoryId}
                    onChange={e => setCategoryId(e.target.value)}
                    className="w-full bg-white/20 rounded-lg px-3 py-2 text-sm outline-none">
                        {categories.map(cat => (
                            <option className="text-gray-500" key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                </select>
            </div>

            <div className="flex justify-end gap-3 mt-2">
                <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm text-gray-500 hover:text-white">
                        Cancel
                </button>
                <button
                    onClick={handleSave}
                    disabled={!canSave}
                    className="px-4 py-2 text-sm bg-finnio-card-2 rounded-lg hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed">
                        Add Transaction
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TransactionModal