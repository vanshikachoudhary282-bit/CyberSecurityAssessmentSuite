import History from "../History";
import MainLayout from "../layout/MainLayout";

function HistoryPage({ user }) {

    return (

        <MainLayout user={user}>

            <History />

        </MainLayout>

    );

}

export default HistoryPage;