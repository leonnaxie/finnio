function Dashboard() {
    return (
        <div>
            <h2 className="text-xl mb-6">dashboard</h2>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-4">
                    <div className="bg-gray-700 rounded-xl p-4 h-48">Net Summary</div>
                    <div className="bg-gray-700 rounded-xl p-4 h-64">Spendings</div>
                    <div className="bg-gray-700 rounded-xl p-4 h-48">Savings</div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="bg-gray-700 rounded-xl p-4 h-64">Goals</div>
                    <div className="bg-gray-700 rounded-xl p-4 h-48">Spending Trends</div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard