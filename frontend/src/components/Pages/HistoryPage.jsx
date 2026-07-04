import History from "../History";
import MainLayout from "../layout/MainLayout";
import API from "../../api";
function HistoryPage({ user }) {

    return (

        <MainLayout user={user}>

            <History />

        </MainLayout>

    );

}

export default HistoryPage;