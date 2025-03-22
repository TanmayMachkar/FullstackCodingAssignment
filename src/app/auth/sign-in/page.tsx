import { SignInPage } from "@src/app/auth/sign-in/signin";
import { redirect } from "next/navigation";

const SignIn: React.FC = async() => {
	const isAuthenticated = false;

	if(isAuthenticated){
		redirect("/dashboard")
	} else{
		return <SignInPage/>
	}
}

export default SignIn;