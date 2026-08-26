import { useRouter } from "expo-router";
import WebLoginScreen from "../modules/login/screens/WebLoginScreen";
import { getTokenPayload, getUsuario } from "../modules/login/utils/tokenStorage";

export default function LoginWeb() {
    const router = useRouter();

    const handleLogin = () => {
        const usuario = getUsuario() || getTokenPayload();
        const isCaprocamAdmin = Boolean(
            usuario?.accesoGlobal || Number(usuario?.grupoDatos) === 22776226
        );

        if (isCaprocamAdmin) {
            router.replace("/registroWeb");
        } else {
            router.push("/inicio");
        }
    };

    const handleGoToLanding = () => {
        router.replace('/landing');
    };

    return <WebLoginScreen onLoginSuccess={handleLogin} onGoToLanding={handleGoToLanding} />;
}