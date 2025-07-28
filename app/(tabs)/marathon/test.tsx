import { createGlobalStyles } from "@/assets/styles/global.style";
import { NavigationArrowLeftIcon } from "@/assets/svgs/icon";
import { COLOR } from "@/constants/color.constant";
import { BASE_URL } from "@/constants/index.constants";
import { Languages } from "@/language";
import {
  useLanguage,
  useMarathon,
  usePro,
  useThemeMode,
} from "@/store/selectors";
import { LanguageType } from "@/store/slices/language.slice";
import {
  addMarathonTest,
  answerTheQuestionMarathon,
} from "@/store/slices/ticket.slice";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
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
  const marathons = useMarathon();
  const language = useLanguage() as LanguageType;
  const [timer, setTimer] = useState<number>(25 * 60);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const pro = usePro();
  const [isErrors, setIsErrors] = useState(false);

  const global_styles = createGlobalStyles(dark_mode);
  const styles = createStyles(dark_mode);
  const question = marathons.questions[currentQuestion];
  const Mainlanguage = Languages[language]["marathon"];
  const dispatch = useDispatch();

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          router.push({
            pathname: "/marathon/result",
          });
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (marathons.rejected === 5) {
      setIsErrors(true);
    }
  }, [marathons.rejected]);

  return (
    <ScrollView>
      <View style={global_styles.container}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            style={{ alignItems: "center", flexDirection: "row", gap: 6 }}
            onPress={() => router.back()}
          >
            <NavigationArrowLeftIcon color="#fff" />
            <Text style={styles.navigation_title}>
              {Mainlanguage["marathon_title"]} - 1
            </Text>
          </TouchableOpacity>
          <View style={styles.timer}>
            <Text style={styles.timer_text}>{formatTime(timer)}</Text>
          </View>
        </View>

        <View style={styles.question_number_list}>
          <FlatList
            data={marathons.questions}
            horizontal
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => {
              const ans = marathons.answers.find(
                (i) => i.questionId == item.id
              );
              return (
                <TouchableOpacity
                  style={[
                    styles.question_number,
                    ans
                      ? ans.currentAnswer === item.currentAnswer
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
          <Text style={styles.question_cont_title}>
            {question.questions[language]}
          </Text>
          {BASE_URL + question.imgUrl ? (
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
                      answerTheQuestionMarathon({
                        questionId: nextQuestionIndex,
                        currentAnswer: index + 1,
                      })
                    );

                    if (nextQuestionIndex >= marathons.questions.length) {
                      router.push({
                        pathname: "/marathon/result",
                      });
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
      <Modal
        visible={isErrors}
        animationType="fade"
        transparent={true}
        onRequestClose={() => {
          setIsErrors(false);
        }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modal_title}>
              {Languages[language]["modals"]["too_many_errors_title"]}
            </Text>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Text style={styles.modal_description}>
                {Languages[language]["modals"]["try_again_question"]}
              </Text>
            </View>
            <View style={styles.modal_btns}>
              <TouchableOpacity
                style={styles.modal_btn_no}
                onPress={() => {
                  setIsErrors(false);
                }}
              >
                <Text style={styles.modal_btn_no_text}>
                  {Languages[language]["modals"]["no"]}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modal_btn_yes}
                onPress={() => {
                  setIsErrors(false);
                  dispatch(addMarathonTest({}));
                  setCurrentQuestion(0);
                  setTimer(25 * 60);
                }}
              >
                <Text style={styles.modal_btn_yes_text}>
                  {Languages[language]["modals"]["yes"]}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const createStyles = (dark_mode: boolean) =>
  StyleSheet.create({
    navigation_title: {
      fontSize: 24,
      fontWeight: 400,
      color: dark_mode ? COLOR.white : COLOR.black1,
    },
    timer: {
      width: 68,
      height: 32,
      backgroundColor: COLOR.gray4,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 5,
    },
    timer_text: {
      fontSize: 18,
      color: COLOR.white,
      fontWeight: 400,
    },
    question_number_list: {
      backgroundColor: COLOR.black1,
      marginTop: 20,
      padding: 7,
      borderRadius: 10,
    },
    question_number: {
      width: 26,
      height: 26,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    question_number_text: {
      fontSize: 14,
    },
    question_number_default_color: {
      backgroundColor: COLOR.gray3,
    },
    question_number_red_color: {
      backgroundColor: COLOR.red,
      color: COLOR.white,
    },
    question_number_green_color: {
      backgroundColor: COLOR.green,
      color: COLOR.white,
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
    question_cont: {
      width: "100%",
      minHeight: 420,
      padding: 8,
      backgroundColor: COLOR.black1,
      marginTop: 16,
      overflowY: "scroll",
    },
    question_cont_title: {
      fontSize: 14,
      fontWeight: 400,
      color: COLOR.white,
    },
    modalBackground: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: COLOR.white2,
    },
    modalContent: {
      width: 300,
      backgroundColor: "white",
      borderRadius: 10,
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 8,
      paddingBottom: 8,
    },
    modal_btns: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 22,
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
    modal_title: {
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
    },
    modal_description: {
      fontSize: 12,
      fontWeight: "regular",
      color: "#656363",
      textAlign: "center",
      marginTop: 8,
      width: 139,
    },
  });
