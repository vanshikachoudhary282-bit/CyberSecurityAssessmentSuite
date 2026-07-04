import { useState } from "react";
import axios from "axios";
import API from "../api";


function WebsiteScanner() {
    const [url, setUrl] = useState("");
    const [result, setResult] = useState(null);

    const scanWebsite = async () => {

        try {

            console.log("Username:", localStorage.getItem("username"));

            const response = await axios.post(
    `${API}/scan`,
    {
        url,
        user_id: localStorage.getItem("userId")
    }
);
            setResult(response.data);
            console.log(response.data);
        } catch (error) {

            console.log(error);

        }

    };const downloadReport = async () => {

    try {

        const response = await axios.get(
            `${API}/report`,
            {
                responseType: "blob"
            }
        );

        const file = new Blob([response.data], {
            type: "application/pdf"
        });

        const fileURL = window.URL.createObjectURL(file);

        const link = document.createElement("a");

        link.href = fileURL;
        link.download = "CyberSecurityReport.pdf";

        document.body.appendChild(link);

        link.click();

        link.remove();

    } catch (error) {

        console.log(error);

    }

};

    return (

        <div className="bg-slate-900 rounded-2xl p-8 h-full min-h-[700px] flex flex-col">

            <h2 className="text-3xl font-bold text-white mb-6">
                🌐 Website Scanner
            </h2>

            <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full p-4 rounded-lg bg-slate-800 text-white"
            />

            <button
                onClick={scanWebsite}
                className="mt-5 bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg text-white font-semibold"
            >
                Scan Website
            </button>

            {result && (

                <div className="mt-8 p-5 rounded-xl bg-slate-800 border border-slate-700">

                    <h3 className="text-xl font-semibold text-cyan-400 mb-6">
                        Scan Result
                    </h3>

                    <div className="flex justify-between border-b border-slate-700 py-2">
                        <span className="text-slate-400">URL</span>
                        <span className="text-white">{result.url}</span>
                    </div>
                    {result.error && (
    <div className="mt-4 mb-4 p-3 rounded-lg bg-red-900/40 border border-red-500">
        <p className="text-red-300 font-semibold">
            Error: {result.error}
        </p>
    </div>
)}
                    <div className="flex justify-between border-b border-slate-700 py-2">
                        <span className="text-slate-400">Reachable</span>
                        <span className="text-white">
                            {result.reachable ? "Yes" : "No"}
                        </span>
                    </div>

                    <div className="flex justify-between border-b border-slate-700 py-2">
                        <span className="text-slate-400">HTTPS</span>
                        <span className="text-white">
                            {result.https_enabled ? "Yes" : "No"}
                        </span>
                    </div>

                    <div className="flex justify-between border-b border-slate-700 py-2">
                        <span className="text-slate-400">Status Code</span>
                        <span className="text-white">
                            {result.status_code}
                        </span>
                    </div>

                    <div className="flex justify-between border-b border-slate-700 py-2">
                        <span className="text-slate-400">Security Score</span>
                        <span className="text-white">
                            {result.security_score}%
                        </span>
                    </div>

                    <div className="flex justify-between border-b border-slate-700 py-2">
                        <span className="text-slate-400">Risk Level</span>

                        <span
                            className={
                                result.risk_level === "Low"
                                    ? "text-green-400 font-semibold"
                                    : result.risk_level === "Medium"
                                    ? "text-yellow-400 font-semibold"
                                    : "text-red-400 font-semibold"
                            }
                        >
                            {result.risk_level}
                        </span>
                    </div>

                    <div className="mt-5">

                        <div className="w-full bg-slate-700 rounded-full h-3">

                            <div
                                className={`h-3 rounded-full ${
                                    result.security_score >= 75
                                        ? "bg-green-500"
                                        : result.security_score >= 50
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                }`}
                                style={{
                                    width: `${result.security_score}%`
                                }}
                            />

                        </div>

                    </div>

                    <div className="flex justify-between border-b border-slate-700 py-2 mt-4">
                        <span className="text-slate-400">SSL Valid</span>
                        <span className="text-white">
                            {result.ssl_valid ? "Yes" : "No"}
                        </span>
                    </div>

                    <div className="flex justify-between border-b border-slate-700 py-2">
                        <span className="text-slate-400">Issuer</span>
                        <span className="text-white">
                            {result.ssl_issuer}
                        </span>
                    </div>

                    <div className="flex justify-between border-b border-slate-700 py-2">
                        <span className="text-slate-400">Expiry</span>
                        <span className="text-white">
                            {result.ssl_expiry}
                        </span>
                    </div>

                    {result.recommendations?.length > 0 ? (

                        <div className="mt-6 p-4 bg-slate-900 rounded-xl">

                            <h3 className="text-yellow-400 font-semibold mb-3">
                                Recommendations
                            </h3>

                            <ul>

                                {result.recommendations.map((item, index) => (

                                    <li
                                        key={index}
                                        className="text-yellow-300 mb-2"
                                    >
                                        ⚠️ {item}
                                    </li>

                                ))}

                            </ul>

                        </div>

                    ) : (

                        <div className="mt-6 p-4 rounded-xl bg-green-900/30 border border-green-500">

                            <p className="text-green-400 font-semibold">
                                ✅ Website follows security best practices.
                            </p>

                        </div>

                    )}
                      <button
    onClick={downloadReport}
    className="mt-6 w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 rounded-xl"
>
    📄 Download Security Report
</button>
                </div>

            )}

        </div>

    );

}

export default WebsiteScanner;