import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function Placeholder() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, []);

  return null;
}