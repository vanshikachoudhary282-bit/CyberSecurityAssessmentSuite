import MainLayout from "../layout/MainLayout";

function ReportsPage({ user }) {

    return (

        <MainLayout user={user}>

            <div className="bg-slate-900 rounded-2xl p-10">

                <h1 className="text-4xl text-white font-bold">
                    Reports
                </h1>

                <p className="text-slate-400 mt-4">
                    Download generated security reports.
                </p>

            </div>

        </MainLayout>

    );

}

export default ReportsPage;