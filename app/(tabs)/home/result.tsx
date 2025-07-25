import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useHomeTest, useLanguage, useThemeMode } from "@/store/selectors";
import { createGlobalStyles } from "@/assets/styles/global.style";
import { COLOR } from "@/constants/color.constant";
import * as Progress from "react-native-progress";
import { useRouter } from "expo-router";
import { NavigationArrowLeftIcon } from "@/assets/svgs/icon";
import { LanguageType } from "@/store/slices/language.slice";
import { Languages } from "@/language";

export default function Result() {
  const router = useRouter();
  const theme = useThemeMode();
  const global_styles = createGlobalStyles(theme);
  const styles = createStyles(theme);
  const language = useLanguage() as LanguageType;
  const Mainlanguage = Languages[language]["template"];
  const home_test = useHomeTest()

  const totalQuestions = home_test.questions.length || 1;
  const correct = home_test?.used || 0;
  const score = Math.round((correct / totalQuestions) * 100);
  return (
    <ScrollView>
      <View
        style={{
          ...global_styles.container,
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <View>
          <View>
            <TouchableOpacity
              onPress={() => {
                router.push({ pathname: "/marathon" });
              }}
              style={{ alignItems: "center", flexDirection: "row", gap: 6 }}
            >
              <NavigationArrowLeftIcon color="#fff" />
              <Text style={styles.navigation_title}>
                {Mainlanguage["result_title"]}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.result_cont}>
            <View style={styles.bar_container}>
              <Progress.Circle
                progress={score / 100}
                size={180}
                thickness={20}
                showsText={false}
                color={score < 70 ? "#FFC300" : COLOR.green}
                unfilledColor="#1c1d21"
                borderWidth={0}
              />
              <View style={styles.bar_text_container}>
                <Text style={styles.bar_text}>{score}%</Text>
              </View>
            </View>
            <Text style={styles.result_title}>Natija</Text>
            <View style={styles.result_footer}>
              <View>
                <View style={styles.result_number}>
                  <View
                    style={{
                      ...styles.result_number_color,
                      backgroundColor: COLOR.green,
                    }}
                  ></View>
                  <Text style={styles.result_number_text}>
                    Used: {home_test?.used}/{home_test.questions.length}
                  </Text>
                </View>
                <View style={styles.result_number}>
                  <View
                    style={{
                      ...styles.result_number_color,
                      backgroundColor: COLOR.red,
                    }}
                  ></View>
                  <Text style={styles.result_number_text}>
                    rejected: {home_test?.rejected}/{home_test.questions.length}
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.next_button}>
                <Text style={styles.next_button_text}>KEYINGI</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.ads_cont}>
          <Text style={styles.ads_text}>ADS</Text>
        </View>
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
    ads_cont: {
      width: "100%",
      height: "30%",
      backgroundColor: COLOR.white,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    ads_text: {
      fontSize: 14,
      fontWeight: 400,
    },
    result_cont: {
      width: "100%",
      backgroundColor: COLOR.black1,
      padding: 25,
      borderRadius: 10,
      marginTop: 37,
    },
    result_title: {
      fontSize: 36,
      fontWeight: 700,
      textAlign: "center",
      color: COLOR.white,
    },
    result_footer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 15,
    },
    result_number: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginTop: 10,
    },
    result_number_color: {
      width: 20,
      height: 20,
      borderRadius: 4,
    },
    result_number_text: {
      fontSize: 14,
      color: COLOR.white,
      fontWeight: 500,
    },
    next_button: {
      paddingTop: 12,
      paddingBottom: 12,
      paddingRight: 16,
      paddingLeft: 16,
      backgroundColor: COLOR.green,
      borderRadius: 4,
    },
    next_button_text: {
      color: COLOR.white,
      fontSize: 13,
      fontWeight: 700,
    },
    bar_container: {
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 15,
    },
    bar_text_container: {
      position: "absolute",
      justifyContent: "center",
      alignItems: "center",
    },
    bar_text: {
      fontSize: 24,
      fontWeight: "bold",
      color: "white",
    },
  });
