import { useRouter } from "expo-router";
import WebLoginScreen from "../modules/login/screens/WebLoginScreen";


export default function LoginWeb() {

    const router = useRouter();

    const handleLogin = () => {
        router.push("/login");
    };

        const handleRegister = () => {
        router.push("/registerWeb");
    };

    return <WebLoginScreen onLoginSuccess={handleLogin} onGoToRegister={handleRegister} />;
}