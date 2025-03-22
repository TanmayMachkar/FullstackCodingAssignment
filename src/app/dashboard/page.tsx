import { DashboardPage } from './dashboard';
import { redirect } from "next/navigation";

const Dashboard: React.FC = async() => {
	const isAuthenticated = true;
	
	if(!isAuthenticated){
		redirect("/auth/sign-in");
	}else{
		return <DashboardPage />
	}
}

export default Dashboard;