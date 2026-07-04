import { useState } from "react";

import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Register from "./components/Register";

function App(){


const [user,setUser]=useState(

localStorage.getItem(

"username"

)

);
const [showRegister, setShowRegister] = useState(false);


return(


<>
{
    user ? (

        <Dashboard
            user={user}
            setUser={setUser}
        />

    ) : (

        showRegister ? (

            <Register
                setShowRegister={setShowRegister}
            />

        ) : (

            <Login
                setUser={setUser}
                setShowRegister={setShowRegister}
            />

        )

    )
}
</>
);


}


export default App;