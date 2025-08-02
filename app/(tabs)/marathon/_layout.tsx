import { useMarathon } from "@/store/selectors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import { useEffect } from "react";

export default function Layout() {
  const marathon = useMarathon();
  useEffect(() => {
    const saveAnswers = async () => {
      try {
        await AsyncStorage.setItem("marathon", JSON.stringify(marathon || []));
      } catch (e) {
        console.error("AsyncStorage saqlashda xatolik:", e);
      }
    };
    if (marathon?.length > 0 || 0) {
      saveAnswers();
    }
  }, [marathon.length]);
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="test" />
      <Stack.Screen name="result" />
    </Stack>
  );
}