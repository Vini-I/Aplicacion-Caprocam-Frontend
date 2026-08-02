import { useRouter } from "expo-router";
import LandingScreen from "../modules/landing/screens/LandingScreen";

export default function LandingScreens(){

    const router = useRouter();

    const handleLogin = () => {
        router.push("/loginWeb")
    }

    return <LandingScreen onLogin={handleLogin}/>
}