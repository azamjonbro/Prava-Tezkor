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
  const dispatch = useDispatch();
  const [disabledInput, setDisabledInput] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const question = home_test.questions[currentQuestion];

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          router.push({ pathname: "/home/result" });
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

  const handleAnswerPress = (index: number) => {
    const alreadyAnswered = home_test.answers.find(
      (i) => i.questionId === currentQuestion
    );

    if (alreadyAnswered) return;

    const nextQuestionIndex = currentQuestion + 1;
    dispatch(
      answerToHomeTest({
        answer: {
          correct_answer: index + 1,
          questionId: currentQuestion,
        },
      })
    );

    setDisabledInput(true);
    setShowCorrectAnswer(true);

    setTimeout(() => {
      if (nextQuestionIndex >= home_test.questions.length) {
        router.push({ pathname: "/home/result" });
      } else {
        setCurrentQuestion(nextQuestionIndex);
      }
      setDisabledInput(false);
      setShowCorrectAnswer(false);
    }, 3000);
  };

  if (!question) return null;

  const normalizeUrl = (base: string, path: string) => {
    const cleanPath = path.replace(/^\.?\//, "");
    return `${base.replace(/\/$/, "")}/${cleanPath}`;
  };

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
                      ? ans.correct_answer === item.correct_answer
                        ? styles.question_number_green_color
                        : styles.question_number_red_color
                      : styles.question_number_default_color,
                  ]}
                  onPress={() => {
                    if (!showCorrectAnswer) {
                      setCurrentQuestion(index);
                    }
                  }}
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
            ItemSeparatorComponent={() => <View style={{ width: 6 }} />}
          />
        </View>

        <View style={styles.question_cont}>
          <Text style={styles.question_cont_text}>
            {question["questions"][language]}
          </Text>

          {question.imgUrl.length > 0 ? (
            <Image
              source={{ uri: normalizeUrl(BASE_URL,question.imgUrl) }}
              style={{
                marginTop: 15,
                backgroundColor: "red",
                width: "100%",
                height:180,
                borderRadius: 10,
              }}
            />
          ) : (
            <View style={styles.default_img}></View>
          )}

          <View style={styles.answers}>
            {question.answers.map((item, index) => {
              const answer = home_test.answers.find(
                (i) => i.questionId === currentQuestion
              );
              const isSelected = answer?.correct_answer === index + 1;
              const isCorrect = question.correct_answer === index + 1;

              const showCorrect = showCorrectAnswer && isCorrect;
              const showIncorrect = isSelected && !isCorrect;

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.answer,
                    showCorrect ? styles.green_answer_text : {},
                    showIncorrect ? styles.red_answer_text : {},
                    isSelected && isCorrect ? styles.green_answer_text : {},
                  ]}
                  disabled={disabledInput}
                  onPress={() => handleAnswerPress(index)}
                >
                  <Text style={styles.answer_text}>
                    {item[language as LanguageType]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {pro && (
            <Text style={styles.comment_text}>
              izox: {question["izoh"][language] || ""}
            </Text>
          )}
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
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    navigation_title: {
      fontSize: 24,
      fontWeight: "400",
      color: COLOR.white,
    },
    container_header_right: {
      flexDirection: "row",
      alignItems: "center",
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
      fontWeight: "400",
    },
    question_number_list: {
      backgroundColor: COLOR.black1,
      marginTop: 20,
      padding: 7,
      borderRadius: 10,
    },
    question_number: {
      width: 40,
      height: 40,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    question_number_text: {
      fontSize: 16,
      color: COLOR.white,
    },
    question_number_default_color: {
      backgroundColor: COLOR.gray3,
    },
    question_number_red_color: {
      backgroundColor: COLOR.red,
    },
    question_number_green_color: {
      backgroundColor: COLOR.green,
    },
    question_cont: {
      width: "100%",
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
      marginTop: 10,
    },
    answer: {
      width: "100%",
      padding: 5,
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
    green_answer_text: {
      backgroundColor: COLOR.green,
    },
    red_answer_text: {
      backgroundColor: COLOR.red,
    },
    comment_text: {
      color: COLOR.white,
      fontSize: 12,
      marginTop: 14,
    },
    ads_cont: {
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLOR.gray3,
      marginTop: 22,
      borderRadius: 10,
      marginBottom: 22,
      padding: 10,
    },
    ads_cont_text: {
      fontSize: 24,
      color: COLOR.black1,
    },
  });
