import { Stack, useRouter } from "expo-router";
import { HeaderBackButton } from "expo-router/react-navigation.js";
import { COLORS } from "../../../theme/colors.js";

export default function RegistroStackLayout() {
  const router = useRouter();

  return (
    <Stack screenOptions={{
      headerShown: false, headerStyle: { backgroundColor: COLORS.primary }, headerTintColor: COLORS.white, headerBackVisible: false,
      headerLeft: (props) => (
        <HeaderBackButton
          {...props}
          onPress={() => router.dismissAll()}
        />
      ),
    }}>
      <Stack.Screen name="index" options={{ title: "Registro Web", headerShown: false }} />
    </Stack>
  );
}