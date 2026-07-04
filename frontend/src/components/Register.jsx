import { useState } from "react";
import axios from "axios";
import API from "../../api";
function Register({ setShowRegister }) {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const register = async () => {

        if (password !== confirmPassword) {

            alert("Passwords do not match");

            return;

        }

        try {

            const response = await axios.post(

                "${API}/register",

                {
                    username,
                    email,
                    password
                }

            );

            alert(response.data.message);

            if (response.data.success) {

                setShowRegister(false);

            }

        }

        catch (error) {

            console.log(error);

        }

    };

    return (

        <div className="min-h-screen flex justify-center items-center bg-slate-950">

            <div className="bg-slate-900 p-10 rounded-2xl w-96">

                <h1 className="text-3xl font-bold text-white mb-6">

                    Create Account

                </h1>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-3 mb-4 rounded bg-slate-800 text-white"
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 mb-4 rounded bg-slate-800 text-white"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 mb-4 rounded bg-slate-800 text-white"
                />

                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-3 mb-6 rounded bg-slate-800 text-white"
                />

                <button
                    onClick={register}
                    className="w-full bg-cyan-500 hover:bg-cyan-600 p-3 rounded text-white font-semibold"
                >
                    Register
                </button>

                <p
                    className="text-cyan-400 mt-5 cursor-pointer text-center"
                    onClick={() => setShowRegister(false)}
                >
                    Already have an account? Login
                </p>

            </div>

        </div>

    );

}

export default Register;