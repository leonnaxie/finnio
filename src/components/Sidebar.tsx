function Sidebar() {
    return (
        <aside className="w-56 bg-gray-800 flex flex-col p-6">
            <h1 className="text-2xl font-bold mb-8">FINNIO ★</h1>

            <nav className="flex flex-col gap-4 flex-1">
                <a href="#" className="hover:text-blue-400">Dashboard</a>
                <a href="#" className="hover:text-blue-400">Accounts</a>
                <a href="#" className="hover:text-blue-400">Categories</a>
            </nav>

            <div className="flex flex-col gap-4">
                <a href="#" className="hover:text-blue-400">Profile</a>
                <a href="#" className="hover:text-blue:400">Log Out</a>
            </div>
        </aside>
    )
}

export default Sidebar