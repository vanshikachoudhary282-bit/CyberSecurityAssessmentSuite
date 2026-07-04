import { useState } from "react";
import axios from "axios";

function Login({ setUser, setShowRegister }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const login = async () => {

        try {

            const response = await axios.post(

                "http://127.0.0.1:5000/login",

                {

                    email,

                    password

                }

            );


            if (response.data.success) {

    localStorage.setItem(
        "userId",
        response.data.user_id
    );

    localStorage.setItem(
        "username",
        response.data.username
    );

    setUser(
        response.data.username
    );

}


            else {

                alert(

                    response.data.message

                );

            }

        }


        catch {

            alert(

                "Server Error"

            );

        }

    };



    return (

        <div className="min-h-screen flex items-center justify-center bg-slate-950">


            <div className="bg-slate-900 p-10 rounded-2xl shadow-lg w-96">


                <h1 className="text-3xl font-bold text-cyan-400 text-center">

                    Cyber Security Assessment Suite

                </h1>



                <input

                    className="w-full mt-6 p-3 rounded-lg bg-slate-800 text-white"

                    placeholder="Email"

                    value={email}

                    onChange={(e) => setEmail(e.target.value)}

                />



                <input

                    type="password"

                    className="w-full mt-4 p-3 rounded-lg bg-slate-800 text-white"

                    placeholder="Password"

                    value={password}

                    onChange={(e) => setPassword(e.target.value)}

                />



                <button

                    onClick={login}

                    className="w-full mt-6 p-3 rounded-lg bg-cyan-500 hover:bg-cyan-600"

                >

                    Login

                </button>
                <p
    className="text-center text-slate-400 mt-6"
>
    Don't have an account?{" "}
    <span
        onClick={() => setShowRegister(true)}
        className="text-cyan-400 cursor-pointer hover:underline"
    >
        Create Account
    </span>
</p>



            </div>


        </div>

    );

}


export default Login;