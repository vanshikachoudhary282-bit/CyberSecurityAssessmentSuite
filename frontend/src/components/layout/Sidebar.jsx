function Sidebar() {
    return (
        <div className="w-64 bg-slate-900 text-white p-6">
            <h1 className="text-2xl font-bold text-cyan-400">
                Cyber Suite
            </h1>

            <ul className="mt-10 space-y-4">
                <li className="hover:text-cyan-400 cursor-pointer">Dashboard</li>
                <li className="hover:text-cyan-400 cursor-pointer">Password Analyzer</li>
                <li className="hover:text-cyan-400 cursor-pointer">Website Scanner</li>
                <li className="hover:text-cyan-400 cursor-pointer">History</li>
                <li className="hover:text-cyan-400 cursor-pointer">Reports</li>
            </ul>
        </div>
    );
}

export default Sidebar;