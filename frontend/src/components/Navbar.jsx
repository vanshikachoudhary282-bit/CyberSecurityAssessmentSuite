function Navbar({ user, setUser }) {

const logout = ()=>{

localStorage.removeItem(

"username"

);

setUser(

null

);

};



return(

<nav

className="bg-slate-900 shadow-lg"

>

<div

className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center"

>


<h1

className="text-2xl font-bold text-cyan-400"

>

🛡 Cyber Security Suite


</h1>



<div

className="flex items-center gap-5"

>

<p

className="text-white"

>

Welcome,

{" "}

{user}

👋


</p>



<button

onClick={logout}

className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700"

>

Logout


</button>


</div>


</div>


</nav>

);


}

export default Navbar;