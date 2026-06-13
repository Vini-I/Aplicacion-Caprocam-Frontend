import { useRouter } from "expo-router";
import LoginScreen from "../modules/login/screens/LoginScreen";


export default function Login() {

    const router = useRouter();

    const handleLogin = () => {
        router.push("/inicio/");
    };

    return <LoginScreen onLoginSuccess={handleLogin} />;
}