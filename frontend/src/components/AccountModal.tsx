import { useState } from "react"

interface AccountEntry {
    name: string
    balance: string
}

interface Props {
    onClose: () => void
    onSave: (accounts: { name: string; type: 'Checkings' | 'Savings' | 'Credit Card'; balance: number}[]) => void
}


function AccountModal({ onClose, onSave }: Props) {
    const [checkingAccounts, setCheckingAccounts] = useState<AccountEntry[]>([{name: '', balance: ''}])
    const [creditAccounts, setCreditAccounts] = useState<AccountEntry[]>([{name: '', balance: ''}])

    const updateChecking = (index: number, field: keyof AccountEntry, value: string) => {
        setCheckingAccounts(prev => prev.map((a, i) => i === index ? { ...a, [field]: value} : a))
    }

    const updateCredit = (index: number, field: keyof AccountEntry, value: string) => {
        setCreditAccounts(prev => prev.map((a, i) => i === index ? { ...a, [field]: value} : a))
    }

    const handleSave = () => {
        const allAccounts = [
            ...checkingAccounts
            .filter(a => a.name)
            .map((a) => ({
                name: a.name,
                type: 'Checkings' as const,
                balance: parseFloat(a.balance) || 0
            })),
            ...creditAccounts
            .filter(a => a.name)
            .map((a) => ({
                name: a.name,
                type: 'Credit Card' as const,
                balance: -(parseFloat(a.balance) || 0)
            }))
        ]
        onSave(allAccounts)
    }
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-finnio-ai-chat rounded-2xl p-6 w-[500px] max-h-[80vh] overflow-y-auto">

                {/* Checkings and Savings Section */}
                <div className="mb-6">
                    <h3 className="bg-finnio-card-2 rounded-lg px-4 py-2 font-semibold mb-3">
                        Checkings, Savings or Cash
                    </h3>
                    {checkingAccounts.map((account, index) => (
                        <div key={index} className="flex gap-2 mb-2 items-center">
                            <div className="flex-1">
                                <label className="text-xs opacity-70 mb-1 block">Name</label>
                                <input 
                                    value={account.name}
                                    onChange={e => updateChecking(index, 'name', e.target.value)}
                                    className="w-full bg-white rounded-lg px-3 py-2 text-sm text-black outline-none placeholder:text-gray-400"
                                    placeholder="e.g. AMEX Checking" />
                            </div>

                            <div className="flex-1">
                                <label className="text-xs opacity-70 mb-1 block">Current Balance</label>
                                <input
                                    value={account.balance}
                                    onChange={e => updateChecking(index, 'balance', e.target.value)}
                                    className="w-full bg-white rounded-lg px-3 py-2 text-sm text-black outline-none palceholder:text-gray-400"
                                    placeholder="e.g. 3200.00" />
                            </div>

                            <button
                                onClick={() => setCheckingAccounts(prev => prev.filter((_, i) => i !== index))}
                                className="mt-5 text-gray-400 hover:text-white">✕</button>
                        </div>
                    ))}
                    <button 
                        onClick={() => setCheckingAccounts(prev => [...prev, { name: '', balance: ''}])}
                        className="text-sm text-gray-100 hover:text-white mt-1">+ Add Account</button>
                </div>

                {/* Credit Card Section */}
                <div className="mb-6">
                    <h3 className="bg-finnio-card-2 rounded-lg px-3 py-2 font-semibold mb-3">Credit Cards</h3>
                    {creditAccounts.map((account, index) => (
                        <div key={index} className="flex gap-2 mb-2 items-center">
                            <div className="flex-1">
                                <label className="text-xs opacity-70 mb-1 block">Name</label>
                                <input
                                    value={account.name}
                                    onChange={e => updateCredit(index, 'name', e.target.value)}
                                    className="w-full bg-white rounded-lg px-3 py-2 text-sm text-black outline-none placeholder:text-gray-400"
                                    placeholder="e.g. Visa Card"></input>
                            </div>

                            <div className="flex-1">
                                <label className="text-xs opacity-70 mb-1 block">Current Balance</label>
                                <input
                                    value={account.balance}
                                    onChange={e => updateCredit(index, 'balance', e.target.value)}
                                    className="w-full bg-white rounded-lg px-3 py-2 text-sm text-black outline-none placeholder:text-gray-400"
                                    placeholder="e.g. 300.00"
                                    type="number"></input>
                            </div>

                            <button 
                                onClick={() => setCreditAccounts(prev => prev.filter((_, i) => i !== index))}
                                className="mt-5 text-gray-400 hover:text-white">✕</button>
                        </div>
                    ))}

                    <button
                        onClick={() => setCreditAccounts(prev => [...prev, { name: '', balance: ''}])}
                        className="text-sm text-gray-100 hover:text-white mt-1">+ Add Account</button>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-gray-200 hover:text-white">Exit</button>

                    <button
                        onClick={handleSave}
                        className="px-4 py-2 text-sm bg-finnio-card-2 rounded-lg hover:bg-gray-400">Save</button>
                </div>
            </div>
        </div>
    )
}

export default AccountModal