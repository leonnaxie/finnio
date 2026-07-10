import ChatPanel from "./chat/ChatPanel"
import type { Account, FinancialProfile, Category, Transaction } from "../App"
import Accounts from "./Accounts"

interface Props {
    accounts: Account[]
    categories: Category[]
    transactions: Transaction[]
    financialProfile: FinancialProfile
}


function Dashboard({ accounts, categories, transactions, financialProfile }: Props) {
    const totalAssets = accounts.filter(a => a.balance > 0).reduce((sum, a) => sum + a.balance, 0)
    const totalDebt = accounts.filter(a => a.balance < 0).reduce((sum, a) => sum + Math.abs(a.balance), 0)

    const netWorth = totalAssets - totalDebt
    const totalSpent = categories.reduce((sum, c) => sum + c.spent, 0)
    const totalBudget = categories.reduce((sum, c) => sum + c.budget, 0)

    return (
        <div className="flex gap-6 h-full">

            <div className="flex-1 grid grid-cols-2 gap-4 p-6 content-start">
                <div className="flex flex-col gap-4">

                    {/* Net Summary */}
                    <div className="bg-finnio-card-1 rounded-xl p-4">
                        <h3 className="text-sm opacity-70 mb-3">Net Summary</h3>
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <span className="text-xs opacity-60">Total Assets</span>
                                <span className="text-green-400 font-semibold">
                                    ${totalAssets.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs opacity-60">Total Debt</span>
                                <span className="text-red-400 font-semibold">
                                    -${totalDebt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                </span>
                            </div>
                            <div className="h-px bg-white/20 my-1"></div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs opacity-60">Net Worth</span>
                                <span className={`text-xl font-bold ${netWorth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    ${netWorth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Spendings Card */}
                    <div className="bg-finnio-card-2 rounded-xl p-4 h-64">
                        <h3 className="text-sm opacity-70 mb-3">Spendings</h3>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-2xl font-bold">
                                ${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2})}
                            </span>
                            <span className="text-xs opacity-60">of ${totalBudget} budget</span>
                        </div>

                        <div className="w-full bg-white/20 rounded-full h-2 mb-4">
                            <div
                                className="h-2 rounded-full transition-all"
                                style={{
                                    width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%`,
                                    backgroundColor: totalSpent > totalBudget ? '#f87171' : '#4ade80'
                                }}
                            ></div>
                        </div>

                        <div className="flex flex-col gap-2">
                            {categories
                                .sort((a, b) => b.spent - a.spent)
                                .slice(0, 3)
                                .map(cat => (
                                    <div key={cat.id} className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <span style={{ color: cat.color }}>★</span>
                                            <span className="text-xs">{cat.name}</span>
                                        </div>
                                        <span className="text-xs opacity-70">${cat.spent}</span>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Savings Card */}
                    <div className="bg-finnio-card-3 rounded-xl p-4 h-48">
                        <h3 className="text-sm opacity-70 mb-3">Savings</h3>
                        {financialProfile.savingsTarget ? (
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between">
                                    <span className="text-xs opacity-60">Monthly Target</span>
                                    <span className="text-green-400 font-semibold">
                                        ${financialProfile.savingsTarget}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs opacity-60">Monthly Income</span>
                                    <span className="font-semibold">
                                        ${financialProfile.monthlyIncome}
                                    </span>
                                </div>

                                <div className="h-px bg-white/20 my-1"></div>
                                <div className="flex justify-between">
                                    <span className="text-xs opacity-60">Remaining after expenses</span>
                                    <span className={`font-semibold ${
                                        Number(financialProfile.monthlyIncome) - totalSpent >= 0
                                        ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                        ${(Number(financialProfile.monthlyIncome) - totalSpent).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-xs opacity-50">
                                Set your savings target in Profile to see insights here.
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-4">

                    {/* Goals Card */}
                    <div className="bg-finnio-card-3 rounded-xl p-4 h-64">
                        <h3 className="text-sm opacity-70 mb-3">Goals</h3>
                        <div className="flex flex-col gap-3">
                            {categories
                            .filter(c => c.spent / c.budget >= 0.8)
                            .slice(0, 3)
                            .map(cat => (
                                <div key={cat.id}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>{cat.name}</span>
                                        <span className={cat.spent >= cat.budget ? 'text-red-400' : 'text-yellow-400'}>
                                            {Math.round((cat.spent / cat.budget) * 100)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-white/20 rounded-full h-1.5">
                                        <div
                                            className="h-1.5 rounded-full"
                                            style={{
                                                width: `${Math.min((cat.spent / cat.budget) * 100, 100)}%`,
                                                backgroundColor: cat.spent >= cat.budget ? '#f87171' : '#facc15'
                                            }}>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {categories.filter(c => c.spent / c.budget >= 0.8).length === 0 && (
                                <p className="text-xs opacity-50">All categories within budget!</p>
                            )}
                        </div>
                    </div>


                    {/* Spending Trends */}
                    <div className="bg-finnio-card-2 rounded-xl p-4 h-64">
                        <h3 className="text-sm opacity-70 mb-3">Spending Trends</h3>
                        <div className="flex flex-col gap-3">
                            {categories.slice(0, 4).map(cat => (
                                <div key={cat.id} className="flex items-center gap-2">
                                    <span style={{ color: cat.color }} className="text-xs">★</span>
                                    <span className="text-sm flex-1">{cat.name}</span>
                                    <div className="w-24 bg-white/20 rounded-full h-1.5">
                                        <div 
                                            className="h-1.5 rounded-full"
                                            style={{
                                                width: `${Math.min((cat.spent / cat.budget) * 100, 100)}%`,
                                                backgroundColor: cat.color
                                            }}>
                                        </div>
                                        <span className="text-sm opacity-60 w-8 text-right">
                                            {Math.round((cat.spent / cat.budget) * 100)}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <ChatPanel />
        </div>
    )
}

export default Dashboard