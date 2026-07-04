import { useEffect, useState } from "react";
import axios from "axios";
import API from "../api";
import SecurityAnalytics from "./SecurityAnalytics";
import PasswordAnalyzer from "./PasswordAnalyzer";
import WebsiteScanner from "./WebsiteScanner";
import History from "./History";
import MainLayout from "./layout/MainLayout";


function Dashboard({ user, setUser }) {
    const [stats, setStats] = useState({
    total_scans: 0,
    average_score: 0,
    high_risk: 0,
    reports: 0
});
const [history, setHistory] = useState([]);
useEffect(() => {

    loadStats();

}, []);

const loadStats = async () => {

    try {

        const response = await axios.post(
    `${API}/dashboard-stats`,
    {
        user_id: localStorage.getItem("userId")
    }
);


const downloadReport = async () => {
    try {
        const response = await axios.get(
            `${API}/report`,
            {
                responseType: "blob"
            }
        );

        const url = window.URL.createObjectURL(new Blob([response.data]));

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "CyberSecurityReport.pdf");

        document.body.appendChild(link);

        link.click();

        link.remove();

    } catch (error) {
        console.log(error);
        alert("Unable to download report.");
    }
};
setStats(response.data);

const historyResponse = await axios.post(
    `${API}/history`,
    {
        user_id: localStorage.getItem("userId")
    }
);

setHistory(historyResponse.data);

    }

    catch (error) {

        console.log(error);

    }

};
   return (

    <MainLayout user={user}>

        <div className="max-w-7xl mx-auto">

            <h1 className="text-5xl font-bold text-white">
                Cyber Security Assessment Suite
            </h1>

            <p className="text-slate-400 mt-2">
                Real-Time Website & Password Security Analysis Platform
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">

                <div className="bg-slate-900 rounded-2xl p-8 border border-cyan-500">

                    <p className="text-slate-400 mb-2">
                        Average Security Score
                    </p>

                    <h2 className="text-5xl font-bold text-cyan-400">
                        {stats.average_score}%
                    </h2>

                </div>

                <div className="bg-slate-900 rounded-2xl p-8 border border-green-500">

                    <p className="text-slate-400 mb-2">
                        Websites Scanned
                    </p>

                    <h2 className="text-5xl font-bold text-green-400">
                        {stats.total_scans}
                    </h2>

                </div>

                <div className="bg-slate-900 rounded-2xl p-8 border border-red-500">

                    <p className="text-slate-400 mb-2">
                        High Risk Websites
                    </p>

                    <h2 className="text-5xl font-bold text-red-400">
                        {stats.high_risk}
                    </h2>

                </div>

                <div className="bg-slate-900 rounded-2xl p-8 border border-yellow-500">

                    <p className="text-slate-400 mb-2">
                        Reports Generated
                    </p>

                    <h2 className="text-5xl font-bold text-yellow-400">
                        {stats.reports}
                    </h2>

                </div>

            </div>

            <div className="bg-slate-900 rounded-2xl p-8 mt-10">

                <h2 className="text-2xl font-bold text-white mb-6">
                    Quick Actions
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    <button className="bg-cyan-600 hover:bg-cyan-700 p-6 rounded-xl text-white font-semibold">
                        🔑 Analyze Password
                    </button>

                    <button className="bg-green-600 hover:bg-green-700 p-6 rounded-xl text-white font-semibold">
                        🌐 Scan Website
                    </button>

                    <button className="bg-yellow-600 hover:bg-yellow-700 p-6 rounded-xl text-white font-semibold">
                        📄 Download Report
                    </button>

                </div>

            </div>

            <SecurityAnalytics history={history} />

<div className="grid md:grid-cols-2 gap-8 mt-10">

    <PasswordAnalyzer />

    <WebsiteScanner />

</div>

<History history={history} />

</div>

    </MainLayout>

);

}

export default Dashboard;