import { useSavedTickets, useTicketAnswers } from "@/store/selectors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import { useEffect } from "react";

export default function Layout() {
  const answers = useTicketAnswers();
  const savedTickets = useSavedTickets();
  useEffect(() => {
    const saveAnswers = async () => {
      try {
        await AsyncStorage.setItem("answers", JSON.stringify(answers));
      } catch (e) {
        console.error("AsyncStorage saqlashda xatolik:", e);
      }
    };

    if (answers.length > 0) {
      saveAnswers();
    }
  }, [answers]);
  
  useEffect(() => {
    const saveSavedTickets = async () => {
      try {
        await AsyncStorage.setItem("savedTickets", JSON.stringify(savedTickets));
      } catch (e) {
        console.error("AsyncStorage saqlashda xatolik:", e);
      }
    };

    if (savedTickets.length > 0) {
      saveSavedTickets();
    }
  }, [savedTickets]);
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="template-detail" />
      <Stack.Screen name="ticket-test-result" />
      <Stack.Screen name="ticket-test" />
    </Stack>
  );
}
