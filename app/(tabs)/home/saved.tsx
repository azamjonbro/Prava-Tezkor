import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { createGlobalStyles } from "@/assets/styles/global.style";
import { useLanguage, useSavedTickets, useThemeMode } from "@/store/selectors";
import { ArrowLeftIcon } from "@/assets/svgs/icon";
import { COLOR } from "@/constants/color.constant";
import { LanguageType } from "@/store/slices/language.slice";
import { Languages } from "@/language";
import { useRouter } from "expo-router";

export default function Saved() {
  const router = useRouter();
  const dark_mode = useThemeMode();
  const global_styles = createGlobalStyles(dark_mode);
  const styles = createStyles(dark_mode);
  const language = useLanguage() as LanguageType;
  const MainLanguage = Languages[language]["home"]["departments"]["saved"];
  const saved_tickets = useSavedTickets();
  return (
    <ScrollView>
      <View style={global_styles.container}>
        <TouchableOpacity
          onPress={() => router.push({ pathname: "/(tabs)/home" })}
          style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
        >
          <ArrowLeftIcon color={dark_mode ? COLOR.white : COLOR.black1} />
          <Text style={styles.navigation_title}>{MainLanguage["title"]}</Text>
        </TouchableOpacity>
        {saved_tickets.map((i, index) => {
          return (
            <View style={styles.question}>
              <Text style={styles.question_title}>
                {index + 1}-{MainLanguage["question"]}
              </Text>
              <TouchableOpacity
                style={styles.question_see}
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/home/saved_ticket",
                    params: { id: i.id, index },
                  })
                }
              >
                <Text style={styles.question_see_text}>
                  {MainLanguage["see"]}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const createStyles = (dark_mode: boolean) =>
  StyleSheet.create({
    navigation_title: {
      fontSize: 24,
      fontWeight: "400",
      color: dark_mode ? COLOR.white : COLOR.black1,
    },
    question: {
      width: "100%",
      height: 55,
      backgroundColor: dark_mode ? COLOR.black1 : COLOR.dark_bg,
      borderRadius: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingLeft: 8,
      paddingRight: 8,
      marginTop: 10,
    },
    question_title: {
      color: COLOR.white,
      fontWeight: 400,
    },
    question_see: {
      width: 60,
      height: 21,
      borderRadius: 5,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLOR.gray,
    },
    question_see_text: {
      fontSize: 10,
      fontWeight: 400,
      color: COLOR.white,
    },
  });
