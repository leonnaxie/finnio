import ChatPanel from "./chat/ChatPanel"
import type { Account, FinancialProfile, Category, Transaction } from "../App"

interface Props {
    accounts: Account[]
    categories: Category[]
    transactions: Transaction[]
    financialProfile: FinancialProfile
}


function Dashboard(_props : Props) {
    return (
        <div className="flex gap-6 h-full">

            <div className="flex-1 grid grid-cols-2 gap-4 p-6 content-start">
                <div className="flex flex-col gap-4">
                    <div className="bg-finnio-card-1 rounded-xl p-4 h-48">Net Summary</div>
                    <div className="bg-finnio-card-2 rounded-xl p-4 h-64">Spendings</div>
                    <div className="bg-finnio-card-3 rounded-xl p-4 h-48">Savings</div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="bg-finnio-card-3 rounded-xl p-4 h-64">Goals</div>
                    <div className="bg-finnio-card-2 rounded-xl p-4 h-64">Spending Trends</div>
                </div>
            </div>

            <ChatPanel />
        </div>
    )
}

export default Dashboard