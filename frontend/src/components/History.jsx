import { useEffect, useState } from "react";
import axios from "axios";
import API from "../api";
function History() {

    const [history, setHistory] = useState([]);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {

        try {

            const response = await axios.post(
                "${API}/history",
                {
                    user_id: localStorage.getItem("userId")
                }
            );

            console.log("History API Response:", response.data);

            setHistory(response.data);

        } catch (error) {

            console.log(error);

        }

    };

    return (

        <div className="bg-slate-900 rounded-2xl p-8 mt-10">

            <div className="flex justify-between items-center mb-6">

                <h2 className="text-3xl font-bold text-white">
                    📜 Scan History
                </h2>

                <button
                    onClick={loadHistory}
                    className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-lg"
                >
                    Refresh
                </button>

            </div>

            <div className="overflow-x-auto max-h-[450px] overflow-y-auto rounded-xl">

                <table className="w-full text-left">

                    <thead className="sticky top-0 bg-slate-900">

                        <tr className="border-b border-slate-700">

                            <th className="py-3 text-cyan-400">ID</th>
                            <th className="py-3 text-cyan-400">Website</th>
                            <th className="py-3 text-cyan-400">Score</th>
                            <th className="py-3 text-cyan-400">Date</th>

                        </tr>

                    </thead>

                    <tbody>

                        {history.map((item) => (

                            <tr
                                key={item[0]}
                                className="border-b border-slate-800 hover:bg-slate-800 transition"
                            >

                                <td className="py-3 text-white">{item[0]}</td>

                                <td className="py-3 text-white">{item[1]}</td>

                                <td className="py-3">

                                    <span
                                        className={`px-3 py-1 rounded-full font-semibold ${
                                            item[2] >= 75
                                                ? "bg-green-600 text-white"
                                                : item[2] >= 50
                                                ? "bg-yellow-500 text-black"
                                                : "bg-red-600 text-white"
                                        }`}
                                    >
                                        {item[2]}
                                    </span>

                                </td>

                                <td className="py-3 text-white">
                                    {item[3]}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    );

}

export default History;