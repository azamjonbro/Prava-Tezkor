import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useMemo } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  useLanguage,
  usePro,
  useSavedTickets,
  useThemeMode,
} from "@/store/selectors";
import { createGlobalStyles } from "@/assets/styles/global.style";
import { LanguageType } from "@/store/slices/language.slice";
import { Languages } from "@/language";
import { COLOR } from "@/constants/color.constant";
import { ArrowLeftIcon } from "@/assets/svgs/icon";
import { BASE_URL } from "@/constants/index.constants";

export default function Saved_ticket() {
  const router = useRouter();
  const dark_mode = useThemeMode();
  const global_styles = createGlobalStyles(dark_mode);
  const styles = createStyles(dark_mode);
  const language = useLanguage() as LanguageType;
  const MainLanguage = Languages[language]["home"]["departments"]["saved"];
  const saved_tickets = useSavedTickets();
  const { id, index } = useLocalSearchParams<{ id: string; index: string }>();
  const pro = usePro();
  const ticket = useMemo(() => {
    return saved_tickets.find((i) => i.id == +id);
  }, [id, saved_tickets]);

  if (isNaN(+id) || isNaN(+index) || !ticket) {
    return (
      <View>
        <Text>Not Found</Text>
      </View>
    );
  }

  const normalizeUrl = (base: string, path: string) => {
    const cleanPath = path.replace(/^\.?\//, "");
    return `${base.replace(/\/$/, "")}/${cleanPath}`;
  };
  return (
    <ScrollView>
      <View style={global_styles.container}>
        <TouchableOpacity
          onPress={() => router.push({ pathname: "/(tabs)/home/saved" })}
          style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
        >
          <ArrowLeftIcon color={dark_mode ? COLOR.white : COLOR.black1} />
          <Text style={styles.navigation_title}>
            {+index + 1}-{MainLanguage["question"]}
          </Text>
        </TouchableOpacity>

        <View style={styles.question_cont}>
          <Text style={styles.question_cont_text}>
            {ticket["questions"][language as LanguageType]}
          </Text>
          {ticket.imgUrl.length > 0 ? (
            <Image
              source={{
                uri: ticket?.imgUrl
                  ? normalizeUrl(BASE_URL, ticket.imgUrl)
                  : normalizeUrl(BASE_URL, "images/default.png"),
              }}
              style={{
                marginTop: 15,
                height: 180,
                backgroundColor: "red",
                width: "100%",
                borderRadius: 10,
              }}
            />
          ) : (
            <View style={styles.default_img}></View>
          )}

          <View>
            {ticket.answers.map((item, index) => {
              return (
                <View
                  style={{
                    ...styles.answer,
                    backgroundColor:
                      ticket.correct_answer == index + 1 ? COLOR.green : 'transparent',
                  }}
                  key={index}
                >
                  <Text style={styles.answer_text}>
                    {item[language as LanguageType]}
                  </Text>
                </View>
              );
            })}
          </View>
          {pro ? (
            <Text style={styles.comment_text}>
              izox: {ticket["izoh"][language as LanguageType] || ""}
            </Text>
          ) : null}
        </View>
        <View style={styles.ads_cont}>
          <Text style={styles.ads_cont_text}>Ads</Text>
        </View>
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
    question_cont: {
      width: "100%",
      minHeight: "70%",
      backgroundColor: COLOR.black1,
      marginTop: 16,
      padding: 8,
      borderRadius: 10,
    },
    question_cont_text: {
      color: COLOR.white,
      fontSize: 14,
    },
    default_img: {
      width: "100%",
      height: 180,
      backgroundColor: COLOR.gray3,
      borderRadius: 10,
      marginTop: 15,
    },
    answers: {
      marginTop: 5,
      flexDirection: "column",
    },
    answer: {
      width: "100%",
      height: 40,
      borderWidth: 1,
      marginTop: 10,
      borderColor: COLOR.white,
      borderRadius: 10,
      justifyContent: "center",
      paddingStart: 12,
    },
    answer_text: {
      color: COLOR.white,
      fontSize: 16,
    },
    comment_text: {
      color: COLOR.white,
      fontSize: 12,
      marginTop: 14,
    },
    ads_cont: {
      width: "100%",
      height: "15%",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLOR.gray3,
      marginTop: 22,
      borderRadius: 10,
      marginBottom: 22,
    },
    ads_cont_text: {
      fontSize: 24,
    },
  });
