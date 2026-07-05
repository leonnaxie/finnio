import { Link } from "react-router-dom"

function Sidebar() {
    return (
        <aside className="w-56 bg-finnio-sidebar flex flex-col p-6">
            <h1 className="text-2xl font-bold mb-8">FINNIO ★</h1>

            <nav className="flex flex-col gap-4 flex-1">
                <Link to="/dashboard" className="hover:text-blue-400">Dashboard</Link>
                <Link to="/accounts" className="hover:text-blue-400">Accounts</Link>
                <Link to="/categories" className="hover:text-blue-400">Categories</Link>
            </nav>

            <div className="flex flex-col gap-4">
                <Link to="/profile" className="hover:text-blue-400">Profile</Link>
                <a href="#" className="hover:text-blue:400">Log Out</a>
            </div>
        </aside>
    )
}

export default Sidebar