import { useState } from "react"
import CategoryModal from "./CategoryModal"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface Category {
    id: number
    name: string
    color: string
    budget: number
    spent: number
}

interface Transaction {
    name: string
    amount: number
    date: string
    categoryId: number
}

const mockCategories: Category[] = [
    { id: 1, name: 'Food', color: '#4ade80', budget: 400, spent: 340 },
    { id: 2, name: 'Rent', color: '#60a5fa', budget: 1200, spent: 1200 },
    { id: 3, name: 'Transport', color: '#c084fc', budget: 200, spent: 145 },
    { id: 4, name: 'Shopping', color: '#facc15', budget: 300, spent: 210 },
    { id: 5, name: 'Subscriptions', color: '#f87171', budget: 100, spent: 82}
]

const mockTransactions: Transaction[] = [
    { name: 'Publix', amount: 87.43, date: 'Jul 3', categoryId: 1},
    { name: 'Hulu', amount: 15.99, date: 'June 30', categoryId: 5},
    { name: 'Chipotle', amount: 13.50, date: 'Jul 8', categoryId: 1},
    { name: 'Shell', amount: 45.20, date: 'Jul 4', categoryId: 3},
]

function Categories() {
    const [categories, setCategories] = useState<Category[]>(mockCategories)
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(mockCategories[0])
    const currentMonth = new Date().toLocaleString('default', { month: 'long' })
    const [selectedMonth, setSelectedMonth] = useState(currentMonth)

    const [showModal, setShowModal] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)

    const handleSaveCategory = (category: Category) => {
        if (editingCategory) {
            setCategories(prev => prev.map(c => c.id === category.id ? category: c)) 
        } else {
            setCategories(prev => [...prev, category])
        }
        setShowModal(false)
        setEditingCategory(null)
    }

    const handleDeleteCategory = (id: number) => {
        setCategories(prev => prev.filter(c => c.id !== id))
        if (selectedCategory?.id === id) {
            setSelectedCategory(null)
        }
    }
    
    const filteredTransactions = mockTransactions.filter(
        tx => tx.categoryId === selectedCategory?.id
    )

    return (
        <div className="flex h-screen p-6 gap-4 overflow-hidden">
            <div className="flex-1 flex flex-col gap-4">

                {/* Top Chart and Categories */}
                <div className="flex gap-4 flex-1">
                    
                    {/* Left Chart */}
                    <div className="flex-1 bg-finnio-card-1 rounded-xl p-6 flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">This Month's Breakdown</h2>
                            <select
                                value={selectedMonth}
                                onChange={e => setSelectedMonth(e.target.value)}
                                className="bg-finnio-card-2 rounded-lg px-3 py-1 text-sm">
                                <option>January</option>
                                <option>February</option>
                                <option>March</option>
                                <option>April</option>
                                <option>May</option>
                                <option>June</option>
                                <option>July</option>
                                <option>August</option>
                                <option>September</option>
                                <option>November</option>
                                <option>December</option>
                            </select>
                        </div>

                        <div className="flex-1 flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categories}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius="55%"
                                        outerRadius="75%"
                                        paddingAngle={3}
                                        dataKey="spent"
                                        nameKey="name"
                                    >
                                        {categories.map(cat => (
                                            <Cell key={cat.id} fill={cat.color}></Cell>
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value: unknown) => [`$${(value as number).toFixed(2)}`, 'Spent']}
                                        contentStyle={{
                                            backgroundColor: '#6b7a99',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontSize: '12px',
                                        }}>  
                                    </Tooltip>
                                    <Legend
                                        formatter={(value) => (
                                            <span style={{ fontSize: '12px', color: 'white'}}>{value}</span>
                                        )}
                                    ></Legend>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Right category List */}
                    <div className="w-56 bg-finnio-card-1 rounded-xl p-4 flex flex-col gap-2">
                        <h3 className="font-semibold mb-2">Category List</h3>
                        {categories.map(cat => (
                            <div key={cat.id} className="relative group">
                                <button
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`flex items-center gap-2 p-2 rounded-lg text-left w-full text-gray-100 transition-all border border-finnio-card-2 ${
                                        selectedCategory?.id === cat.id ? 'bg-finnio-card-2' : 'bg-finnio-card-1 hover:bg-finnio-card-2'
                                    }`}>
                                        <span style={{ color: cat.color }}>★</span>
                                        <span className="flex-1 text-sm">{cat.name}</span>
                                        <span className="flex-1 opacity-70">${cat.spent}</span>
                                </button>

                                <button
                                    onClick={() => {
                                        setEditingCategory(cat)
                                        setShowModal(true)
                                    }}
                                    className="absolute top-1 right-1 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                                        ✎
                                </button>

                                <button 
                                    onClick={() => {
                                        handleDeleteCategory(cat.id)
                                    }}
                                    className="absolute top-1 right-6 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                                        ✕
                                    </button>
                            </div>
                        ))}
                        <button 
                            onClick={() => {
                                setEditingCategory(null)
                                setShowModal(true)
                            }}
                            className="text-sm text-gray-400 hover:text-white mt-2">+ Add</button>
                    </div>
                </div>

                {/* Bottom Details */}
                {selectedCategory && (
                    <div className="bg-finnio-card-1 rounded-xl p-4 h-48">
                        <h3 className="font-semibold mb-2">{selectedCategory.name} Details</h3>

                        {/* Progress Bar */}
                        <div className="mb-3">
                            <div className="flex justify-between text-xs opacity-70 mb-1">
                                <span>${selectedCategory.spent} spent</span>
                                <span>${selectedCategory.budget} budget</span>
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-2">
                                <div
                                    className="h-2 rounded-full transition-all"
                                    style={{
                                        width: `${Math.min((selectedCategory.spent / selectedCategory.budget) * 100, 100)}%`,
                                        backgroundColor: selectedCategory.color
                                    }}></div>
                            </div>
                        </div>

                        {/* Transactions List */}
                        <div className="flex flex-col gap-1">
                            {filteredTransactions.map((tx, i) => (
                                <div key={i} className="flex justify-between text-sm py-1 border-b border-white/10">
                                    <span>{tx.name}</span>
                                    <span className="text-red-400">-${tx.amount}</span>
                                </div>)
                            )}
                        </div>
                    </div>
                )}
            </div>

            
            {/* Modal */}
            {showModal && (
                <CategoryModal
                    onClose={() => {
                        setShowModal(false)
                        setEditingCategory(null)
                    }}
                    onSave={handleSaveCategory}
                    existingCategory={editingCategory}
                />
            )}
        </div>
    )
}

export default Categories