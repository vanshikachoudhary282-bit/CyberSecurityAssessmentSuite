import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from "recharts";

function SecurityAnalytics({ history }) {

    const chartData = history
        .slice()
        .reverse()
        .map((item, index) => ({
            scan: index + 1,
            score: item[2]
        }));

    return (

        <div className="bg-slate-900 rounded-2xl p-8 mt-10">

            <h2 className="text-2xl font-bold text-white mb-6">
                📊 Security Analytics
            </h2>

            <div style={{ width: "100%", height: 320 }}>

                <ResponsiveContainer>

                    <LineChart data={chartData}>

                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="scan" />

                        <YAxis />

                        <Tooltip />

                        <Line
                            type="monotone"
                            dataKey="score"
                            stroke="#06b6d4"
                            strokeWidth={3}
                        />

                    </LineChart>

                </ResponsiveContainer>

            </div>

        </div>

    );

}

export default SecurityAnalytics;
