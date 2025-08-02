import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { createGlobalStyles } from "@/assets/styles/global.style";
import { useLanguage, useMarathon, useThemeMode } from "@/store/selectors";
import { useRouter } from "expo-router";
import { NavigationArrowLeftIcon } from "@/assets/svgs/icon";
import { LanguageType } from "@/store/slices/language.slice";
import { Languages } from "@/language";
import { COLOR } from "@/constants/color.constant";
import { addMarathonTest } from "@/store/slices/ticket.slice";
import { useDispatch } from "react-redux";

export default function all_result() {
  const router = useRouter();
  const dark_mode = useThemeMode();
  const marathons = useMarathon();
  const global_styles = createGlobalStyles(dark_mode);
  const styles = createStyles(dark_mode);
  const language = useLanguage() as LanguageType;
  const Mainlanguage = Languages[language]["template"];
  const dispatch = useDispatch();
  return (
    <ScrollView>
      <View style={global_styles.container}>
        <View>
          <TouchableOpacity
            onPress={() => {
              router.push({ pathname: "/marathon" });
            }}
            style={{ alignItems: "center", flexDirection: "row", gap: 6 }}
          >
            <NavigationArrowLeftIcon color="#fff" />
            <Text style={styles.navigation_title}>
              {Mainlanguage["results_title"]}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.results_cont}>
          {marathons?.map((i, index) => {
            return (
              <View key={index}>
                <View style={styles.result}>
                  <Text style={styles.result_text}>
                    #{index + 1} {Mainlanguage["exercise"]} {index + 1}
                  </Text>
                  <View
                    style={{
                      ...styles.result_status,
                      backgroundColor: i.isFinished ? COLOR.green : COLOR.red,
                    }}
                  >
                    <Text style={styles.result_status_text}>
                      {i.isFinished
                        ? Mainlanguage["finished"]
                        : Mainlanguage["unfinished"]}
                    </Text>
                  </View>
                </View>

                <View style={styles.line}></View>
              </View>
            );
          })}
        </View>
        <TouchableOpacity
          style={styles.start_btn}
          onPress={() => {
            router.push({ pathname: "/marathon/test" });
            dispatch(addMarathonTest({}));
          }}
        >
          <Text style={styles.start_text}>{Mainlanguage["start"]}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const createStyles = (dark_mode: boolean) =>
  StyleSheet.create({
    navigation_title: {
      fontSize: 24,
      fontWeight: 400,
      color: COLOR.white,
    },
    start_btn: {
      marginTop: 24,
      borderRadius: 10,
      width: "100%",
      height: 62,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLOR.black1,
    },
    start_text: {
      fontSize: 16,
      color: COLOR.white,
      fontWeight: 500,
    },

    results_cont: {
      width: "100%",
      minHeight: 150,
      borderRadius: 10,
      marginTop: 24,
      backgroundColor: COLOR.black1,
    },
    result: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 8,
      marginTop: 8,
    },
    result_text: {
      fontSize: 14,
      fontWeight: "bold",
      color: COLOR.white,
    },
    result_status: {
      width: 90,
      height: 20,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 5,
    },
    result_status_text: {
      fontSize: 10,
      fontWeight: "bold",
      color: COLOR.white,
    },
    line: {
      width: "100%",
      height: 1,
      backgroundColor: dark_mode ? COLOR.white : COLOR.dark_color,
      marginTop: 9,
    },
  });
