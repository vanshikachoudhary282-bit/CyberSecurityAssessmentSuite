import PasswordAnalyzer from "../PasswordAnalyzer";
import MainLayout from "../layout/MainLayout";

function PasswordPage({ user }) {

    return (

        <MainLayout user={user}>

            <PasswordAnalyzer />

        </MainLayout>

    );

}

export default PasswordPage;