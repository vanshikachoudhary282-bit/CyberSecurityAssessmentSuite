function Topbar({ user }) {

    const logout = () => {

    localStorage.removeItem("username");
    localStorage.removeItem("userId");

    window.location.reload();

};

    return (
        <div className="bg-slate-900 p-5 flex justify-between items-center border-b border-slate-800">

            <div>
                <h1 className="text-3xl font-bold text-white">
                    Cyber Security Assessment Suite
                </h1>

                <p className="text-slate-400">
                    Welcome, {user} 👋
                </p>
            </div>

            <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg text-white font-semibold"
            >
                Logout
            </button>

        </div>
    );
}

export default Topbar;