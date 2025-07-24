import {
  HomeIcon,
  MarathonIcon,
  OfferIcon,
  SettingsIcon,
  TemplateIcon,
} from "@/assets/svgs/icon";
import { COLOR } from "@/constants/color.constant";
import { Languages } from "@/language";
import { api } from "@/services/api";
import { useLanguage, useThemeMode } from "@/store/selectors";
import { LanguageType, setLanguage } from "@/store/slices/language.slice";
import { setSavedTickets } from "@/store/slices/saved_tickets.slice";
import { setTickets } from "@/store/slices/ticket.slice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Tabs, usePathname } from "expo-router";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Toast } from "toastify-react-native";

export default function TabScreen() {
  const language = useLanguage();
  const MainLanguage = Languages[language as LanguageType]["tabs"];

  const dispatch = useDispatch();

  useEffect(() => {
    const setLang = async () => {
      const lang = await AsyncStorage.getItem("language");

      if (lang) {
        dispatch(setLanguage(lang as LanguageType));
      } else {
        await AsyncStorage.setItem("language", language);
      }
    };
    setLang();
  }, []);

  useEffect(() => {
    const getTicket = async () => {
      Toast.info("Please wait")
      try {
        const token = await AsyncStorage.getItem("token");
        const { data, status } = await api.get("/api/ticket/findall", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const answers = await AsyncStorage.getItem("answers");
        const marathon = await AsyncStorage.getItem("marathon");
        const savedTickets = await AsyncStorage.getItem('savedTickets')

        if (status === 200) {
          dispatch(
            setTickets({
              tickets: data.tickets,
              answers: answers ? JSON.parse(answers) : [],
              marathon: marathon ? JSON.parse(marathon) : {},
            })
          );
          dispatch(
            setSavedTickets(savedTickets ? JSON.parse(savedTickets) : [])
          )
        }
      } catch (err) {
        const error = err as Error;
        console.error(error);
        Toast.error(error.message);
      }
    };
    getTicket();
  }, []);

  const dark_mode = useThemeMode();
  const pathname = usePathname();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: dark_mode ? COLOR.dark2 : "white",
          display: !["/template/ticket-test"].includes(pathname)
            ? "flex"
            : "none",
        },
        tabBarActiveTintColor: COLOR.green,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: MainLanguage.home,
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="template"
        options={{
          title: MainLanguage.template,
          tabBarIcon: ({ color }) => <TemplateIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="marathon"
        options={{
          title: MainLanguage.marathon,
          tabBarIcon: ({ color }) => <MarathonIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="offer"
        options={{
          title: MainLanguage.offer,
          tabBarIcon: ({ color }) => <OfferIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: MainLanguage.settings,
          tabBarIcon: ({ color }) => <SettingsIcon color={color} />,
        }}
      />
    </Tabs>
  );
}
