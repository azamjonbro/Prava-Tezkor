import { createGlobalStyles } from "@/assets/styles/global.style";
import { NavigationArrowLeftIcon } from "@/assets/svgs/icon";
import { COLOR } from "@/constants/color.constant";
import { BASE_URL } from "@/constants/index.constants";
import { Languages } from "@/language";
import {
  useHomeTest,
  useLanguage,
  usePro,
  useThemeMode,
} from "@/store/selectors";
import { LanguageType } from "@/store/slices/language.slice";
import { answerToHomeTest } from "@/store/slices/ticket.slice";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";

export default function Test() {
  const router = useRouter();
  const dark_mode = useThemeMode();
  const styles = createStyles(dark_mode);
  const global_styles = createGlobalStyles(dark_mode);
  const [timer, setTimer] = useState<number>(15 * 60);
  const param = useLocalSearchParams() as { type: string; limit: string };
  const language = useLanguage() as LanguageType;
  const home_test = useHomeTest();
  const pro = usePro();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          router.push({
            pathname: "/home/result",
          });
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const question = home_test.questions[currentQuestion];

  const dispatch = useDispatch();

  return (
    <ScrollView
      style={{ backgroundColor: dark_mode ? COLOR.dark : COLOR.white }}
    >
      <View style={{ ...global_styles.container, marginBottom: 15 }}>
        <View style={styles.container_header}>
          <TouchableOpacity
            style={{ alignItems: "center", flexDirection: "row", gap: 6 }}
            onPress={() => router.back()}
          >
            <NavigationArrowLeftIcon color="#fff" />
            <Text style={styles.navigation_title}>
              {Languages[language]["template"]["title"]}
            </Text>
          </TouchableOpacity>
          <View style={styles.container_header_right}>
            <View style={styles.container_header_timer}>
              <Text style={styles.container_header_timer_text}>
                {formatTime(timer)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.question_number_list}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={home_test.questions}
            horizontal
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => {
              const ans = home_test.answers.find((i) => i.questionId === index);
              return (
                <TouchableOpacity
                  style={[
                    styles.question_number,
                    ans
                      ? ans.currentAnswer == item.currentAnswer
                        ? styles.question_number_green_color
                        : styles.question_number_red_color
                      : styles.question_number_default_color,
                  ]}
                  key={index}
                >
                  <Text
                    style={{
                      ...styles.question_number_text,
                      color: COLOR.black1,
                    }}
                  >
                    {index + 1}
                  </Text>
                </TouchableOpacity>
              );
            }}
            ItemSeparatorComponent={() => <View style={{ width: 6 }}></View>}
          />
        </View>

        <View style={styles.question_cont}>
          <Text style={styles.question_cont_text}>
            {question["questions"][language as LanguageType]}
          </Text>
          {question.imgUrl ? (
            <Image
              source={{ uri: BASE_URL + question.imgUrl.slice(4) }}
              height={180}
              style={{
                marginTop: 15,
                backgroundColor: "red",
                width: "100%",
                borderRadius: 10,
              }}
            />
          ) : (
            <View style={styles.default_img}></View>
          )}
          <View>
            {question.answers.map((item, index) => {
              return (
                <TouchableOpacity
                  style={styles.answer}
                  key={index}
                  onPress={() => {
                    const nextQuestionIndex = currentQuestion + 1;

                    dispatch(
                      answerToHomeTest({
                        answer: {
                          currentAnswer: index + 1,
                          questionId: currentQuestion,
                        },
                      })
                    );

                    if (nextQuestionIndex >= home_test.questions.length) {
                      router.push({ pathname: "/home/result" });
                    } else {
                      setCurrentQuestion(nextQuestionIndex);
                    }
                  }}
                >
                  <Text style={styles.answer_text}>
                    {item[language as LanguageType]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {pro ? (
            <Text style={styles.comment_text}>
              izox: {question["izoh"][language as LanguageType] || ""}
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
    container_header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexDirection: "row",
    },
    navigation_title: {
      fontSize: 24,
      fontWeight: 400,
      color: dark_mode?COLOR.white:COLOR.dark,
    },
    container_header_right: {
      alignItems: "center",
      flexDirection: "row",
      gap: 8,
      
    },
    container_header_timer: {
      width: 68,
      height: 32,
      backgroundColor: COLOR.gray4,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 5,
    },
    container_header_timer_text: {
      fontSize: 18,
      color: COLOR.white,
      fontWeight: 400,
    },
    question_number_list: {
      backgroundColor: dark_mode?COLOR.black1:COLOR.white,
      marginTop: 20,
      padding: 14,
      borderRadius: 10,
  ...( !dark_mode && {
    borderWidth: 1,
    borderColor: COLOR.blue, 
  })
    },
    question_number: {
      width: 34,
      height: 34,
      borderRadius: 10,

      alignItems: "center",
      justifyContent: "center",
    },
    question_number_text: {
      fontSize: 16,
    },
    question_number_default_color: {
      backgroundColor: COLOR.gray3,
      color:"#fff"
    },
    question_number_red_color: {
      backgroundColor: COLOR.red,
      color: COLOR.white,
    },
    question_number_green_color: {
      backgroundColor: COLOR.green,
      color: COLOR.white,
    },
    question_cont: {
      width: "100%",
      height: "70%",
      backgroundColor: dark_mode?COLOR.black1:COLOR.white,
      marginTop: 16,
      ...( !dark_mode && {
    borderWidth: 1,
    borderColor: COLOR.blue, 
  }),
      padding: 8,
      borderRadius: 10,
    },
    question_cont_text: {
      color: dark_mode?COLOR.white:COLOR.dark,
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
      borderColor: dark_mode?COLOR.white:COLOR.blue,
      borderRadius: 10,
      justifyContent: "center",
      paddingStart: 12,
    },
    answer_text: {
      color: dark_mode?COLOR.white:COLOR.dark,
      fontSize: 16,
    },
    comment_text: {
      color: dark_mode?COLOR.white:COLOR.dark,
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
    modalBackground: {
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "center",
      backgroundColor: COLOR.white2,
      paddingBottom: 40,
    },
    modalContent: {
      width: 300,
      padding: 8,
      backgroundColor: "white",
      borderRadius: 10,
    },
    modal_title: {
      fontSize: 16,
      fontWeight: 400,
    },
    modal_btns: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 32,
    },
    modal_btn_no: {
      width: "40%",
      height: 36,
      backgroundColor: COLOR.red,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
    },
    modal_btn_no_text: {
      fontSize: 16,
      color: COLOR.white,
    },
    modal_btn_yes: {
      width: "40%",
      height: 36,
      backgroundColor: COLOR.green,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
    },
    modal_btn_yes_text: {
      fontSize: 16,
      color: COLOR.white,
    },
  });
