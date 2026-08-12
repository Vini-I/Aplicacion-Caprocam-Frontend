import { useRouter } from "expo-router";
import WebRegisterScreen from "../../../modules/login/screens/WebRegisterScreen";

export default function RegistrarUsuario() {

    const router = useRouter();

    const handleRegisterSuccess = () => {
        router.replace("/inicio");
    };

    return <WebRegisterScreen onRegisterSuccess={handleRegisterSuccess} />;
}
