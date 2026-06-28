import { useRouter } from "expo-router";
import WebRegisterScreen from "../modules/login/screens/WebRegisterScreen";


export default function RegisterWeb() {

    const router = useRouter();

    const handleRegister = () => {
        router.push("/loginWeb");
    };

      const handleBackToLogin = () => {
        router.push("/loginWeb");
    };

    return <WebRegisterScreen onRegisterSuccess={handleRegister} onBackToLogin={handleBackToLogin} />;
}