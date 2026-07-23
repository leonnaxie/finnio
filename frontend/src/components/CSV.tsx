import { useState } from "react";
import Papa from "papaparse";
import { supabase } from "../lib/supabase";
import type { Account, Transaction, Category } from "../App";


interface Props {
    accounts: Account[]
    categories: Category[]
    onImport: (transactions: Transaction[]) => void
    onClose: () => void
}

interface RawRow {
    [key: string]: string
}


function CSVImport({ accounts, categories, onImport, onClose}: Props) {
    const [step, setStep] = useState<'upload' | 'mapping' | 'preview'>('upload')
    const [rawRows, setRawRows] = useState<RawRow[]>([])
    const [headers, setHeaders] = useState<string[]>([])
    const [mapping, setMapping] = useState({
        name: '',
        amount: '',
        date: ''
    })

    const [accountId, setAccountId] = useState(accounts[0]?.id ?? '')

    const [defaultCategoryId, setDefaultCategoryId] = useState(categories[0]?.id ?? '')
    const [isLoading, setIsLoading] = useState(false)

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        Papa.parse<RawRow>(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                setRawRows(results.data)
                setHeaders(results.meta.fields ?? [])

                const fields = results.meta.fields ?? []
                const nameGuess = fields.find(f =>
                    /desc|name|merchant|transaction/i.test(f)
                ) ?? ''
                const amountGuess = fields.find(f =>
                    /amount|debit|credit|sum/i.test(f)
                ) ?? ''
                const dateGuess = fields.find(f =>
                    /date|time/i.test(f)
                ) ?? ''

                setMapping({ name: nameGuess, amount: amountGuess, date: dateGuess })
                setStep('mapping')
            }
        })
    }

    const previewRows = rawRows.slice(0, 5).map(row => ({
        name: row[mapping.name] ?? '',
        amount: parseFloat(row[mapping.amount] ?? '0'),
        date: row[mapping.date] ?? ''
    }))

    const handleImport = async () => {
        setIsLoading(true)

        const { data: { user }} = await supabase.auth.getUser()
        if (!user) return

        const normalized = rawRows
            .map(row => {
                const amount = parseFloat(row[mapping.amount] ?? '0')

                return {
                    name: row[mapping.name]?.trim() ?? 'Unknown',
                    amount: isNaN(amount) ? 0 : amount,
                    date: row[mapping.date] ?? '',
                    category_id: defaultCategoryId,
                    account_id: accountId,
                    user_id: user.id
                }
            })
            .filter(row => row.name && !isNaN(row.amount))

        const { data, error } = await supabase
            .from('transactions')
            .insert(normalized)
            .select()

        if (error) {
            alert(error.message)
            setIsLoading(false)
            return
        }

        const imported: Transaction[] = data.map((tx: any) => ({
            id: tx.id,
            name: tx.name,
            amount: tx.amount,
            date: tx.date,
            categoryId: tx.category_id,
            accountId: tx.account_id ?? ''
        }))

        onImport(imported)
        setIsLoading(false)
        onClose()
    }


    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-finnio-sidebar rounded-2xl p-6 w-[500px] max-h-[80vh] overflow-y-auto flex flex-col gap-4">

                <h2 className="text-lg font-semibold">Import Transactions</h2>

                {/* Step One */}
                {step === 'upload' && (
                    <div className="flex flex-col gap-4">
                        <p className="text-xs opacity-70">
                            Upload a CSV file exported from your bank. Most banks support CSV export from
                            their transaction history page. (As demo purposes, we will use pre-written CSV files.)
                        </p>

                        <label className="border-2 border-dashed border-white/30 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer hover:border-white/60 transition-all">
                            <span className="text-2xl">📂</span>
                            <span className="text-sm">Click to upload CSV file.</span>
                            <input 
                                type="file"
                                accept=".csv"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                        </label>
                    </div>
                )}

                {/* Step Two */}
                {step === 'mapping' && (
                    <div className="flex flex-col gap-4">
                        <p className="text-xs opacity-70">
                            We found {rawRows.length} transactions. Map your CSV columns to the right fields.
                        </p>

                        {/* Name mapping */}
                        <div>
                            <label className="text-xs opacity-70 mb-1 block">Description / Merchant Column</label>
                            <select
                                value={mapping.name}
                                onChange={e => setMapping(prev => ({ ...prev, name: e.target.value}))}
                                className="w-full bg-white/20 rounded-lg px-3 py-2 text-sm outline-none"
                            >
                                {headers.map(h => <option className="text-black" key={h} value={h}>{h}</option>)}
                            </select>
                        </div>

                        {/* Amount mapping */}
                        <div>
                            <label className="text-xs opacity-70 mb-1 block">Amount Column</label>
                            <select
                                value={mapping.amount}
                                onChange={e => setMapping(prev => ({ ...prev, amount: e.target.value}))}
                                className="w-full bg-white/20 rounded-lg px-3 py-2 text-sm outline-none"
                            >
                                {headers.map(h => <option className="text-black" key={h} value={h}>{h}</option>)}
                            </select>
                        </div>

                        {/* Date mapping */}
                        <div>
                            <label className="text-xs opacity-70 mb-1 block">Date Column</label>
                            <select
                                value={mapping.date}
                                onChange={e => setMapping(prev => ({ ...prev, date: e.target.value}))}
                                className="w-full bg-white/20 rounded-lg px-3 py-2 text-sm outline-none"
                            >
                                {headers.map(h => <option className="text-black" key={h} value={h}>{h}</option>)}
                            </select>
                        </div>

                        {/* Account */}
                        <div>
                            <label className="text-xs opacity-70 mb-1 block">Import Into Account</label>
                            <select
                                value={accountId}
                                onChange={(e) => setAccountId(e.target.value)}
                                className="w-full bg-white/20 rounded-lg px-3 py-2 text-sm outline-none">
                                    {accounts.map(account => (
                                        <option
                                            className="text-black"
                                            key={account.id} 
                                            value={account.id}
                                        >{account.name}</option>
                                    ))}
                                </select>
                        </div>

                        {/* Default Category */}
                        <div>
                            <label className="text-xs opacity-70 mb-1 block">Assign to Category</label>
                            <select
                                value={defaultCategoryId}
                                onChange={e => setDefaultCategoryId(e.target.value)}
                                className="w-full bg-white/20 rounded-lg px-3 py-2 text-sm outline-none">
                                    {categories.map(cat => (
                                        <option className="text-black" key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                            </select>
                            <p className="text-xs opacity-50 mt-1">You can reassign transactions individually later</p>
                        </div>

                        <button
                            onClick={() => setStep('preview')}
                            disabled={!mapping.name || !mapping.amount || !mapping.date}
                            className="w-ful py-2 bg-finnio-card-2 rounded-lg text-sm hover:bg-gray-500 disabled:opacity-50"
                        >Preview Import</button>
                    </div>
                )}

                {/* Step Three */}
                {step === 'preview' && (
                    <div className="flex flex-col gap-4">
                        <p className="text-xs opacity-70">
                            Previewing first of 5 {rawRows.length} transactions:
                        </p>

                        <div className="flex flex-col gap-2">
                            {previewRows.map((row, i) => (
                                <div key={i} className="flex justify-between items-center bg-white/10 rounded-lg px-3 py-2">
                                    <div>
                                        <p className="text-sm font-medium">{row.name || 'Unknown'}</p>
                                        <p className="text-sm font-medium">{row.date}</p>
                                    </div>
                                    <span className="text-gray-600 text-sm font-semibold">${row.amount.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <p className="text-xs opacity-50 text-center">
                            + {rawRows.length - 5} more transactions
                        </p>

                        <button
                            onClick={handleImport}
                            disabled={isLoading}
                            className="w-full py-2 bg-finnio-card-2 rounded-lg text-sm hover:bg-gray-500 disabled:opacity-50">
                                {isLoading ? 'Importing...' : `Import All ${rawRows.length} transactions`}
                        </button>

                        <button 
                            onClick={() => setStep('mapping')}
                            className="text-xs text-gray-600 hover:text-white text-center">
                                ← Back to mapping
                        </button>
                    </div>
                )}

                {/* Cancel */}
                <button
                    onClick={onClose}
                    className="text-xs text-gray-600 hover:text-white text-center"
                >Cancel</button>
            </div>
        </div>
    )
}

export default CSVImport