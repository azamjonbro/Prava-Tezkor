import { createGlobalStyles } from "@/assets/styles/global.style";
import {
  ArchiveIcon,
  FlagIcon,
  NavigationArrowLeftIcon,
} from "@/assets/svgs/icon";
import { COLOR } from "@/constants/color.constant";
import { BASE_URL } from "@/constants/index.constants";
import { Languages } from "@/language";
import {
  useLanguage,
  useMarathon,
  usePro,
  useSavedTickets,
  useThemeMode,
} from "@/store/selectors";
import { LanguageType } from "@/store/slices/language.slice";
import {
  addTicketToSaved,
  removeTicketFromSaved,
} from "@/store/slices/saved_tickets.slice";
import {
  addMarathonTest,
  answerTheQuestionMarathon,
  clearMarathon,
  saveMarathon,
} from "@/store/slices/ticket.slice";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
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
  const marathon = useMarathon();
  const language = useLanguage() as LanguageType;
  const pro = usePro();
  const global_styles = createGlobalStyles(dark_mode);
  const styles = createStyles(dark_mode);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const question = marathon?.questions[currentQuestion];
  const Mainlanguage = Languages[language]["marathon"];
  const dispatch = useDispatch();
  const saved_tickets = useSavedTickets();
  const [disabledInput, setDisabledInput] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [finish, setFinish] = useState(false);



  const normalizeUrl = (base: string, path: string) => {
    const cleanPath = path.replace(/^\.?\//, "");
    return `${base.replace(/\/$/, "")}/${cleanPath}`;
  };

  const handleNext = (_id:string,index:number) => {
    const alreadyAnswered = marathon.answers.find(
      (i) => i.questionId === _id
    );

    if (alreadyAnswered) return;

    dispatch(
      answerTheQuestionMarathon({
        answer: {
          correct_answer: index + 1,
          questionId: _id,
        },
      })
    );

    setDisabledInput(true);
    setShowCorrectAnswer(true);
    const nextQuestionIndex = currentQuestion + 1;

    setTimeout(() => {
      if (nextQuestionIndex >= marathon.questions.length) {
        router.push({ pathname: "/marathon/result" });
      } else {
        setCurrentQuestion(nextQuestionIndex);
      }

      setDisabledInput(false);
      setShowCorrectAnswer(false);
    }, 3000);
  };

  const this_ticket = useMemo(() => {
    return saved_tickets.find((i) => i.id == currentQuestion);
  }, [currentQuestion, saved_tickets]);

  if(!question){
    return <View>
      <Text>Not found</Text>
    </View>
  }

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
            <NavigationArrowLeftIcon color={dark_mode ? COLOR.white : COLOR.dark}/>
            <Text style={styles.navigation_title}>
              {Mainlanguage["marathon_title"]}
            </Text>
          </TouchableOpacity>

          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <TouchableOpacity onPress={() => setFinish(true)}>
              <FlagIcon color={dark_mode ? "#D0D0D0" : COLOR.dark} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (this_ticket) {
                  dispatch(
                    removeTicketFromSaved({ ticketId: currentQuestion })
                  );
                } else {
                  dispatch(
                    addTicketToSaved({
                      ...question,
                      _id: question._id,
                    })
                  );
                }
              }}
            >
              <ArchiveIcon color={this_ticket ? COLOR.green : dark_mode ? "#D0D0D0" : COLOR.dark} />
            </TouchableOpacity>
            <View style={[styles.view, styles.used_view]}>
              <Text style={{ color: COLOR.white }}>{marathon.used}</Text>
            </View>
            <View style={[styles.view, styles.rejected_view]}>
              <Text style={{ color: COLOR.white }}>{marathon.rejected}</Text>
            </View>
          </View>
        </View>

        <View style={styles.question_cont}>
          <Text style={styles.question_cont_title}>
            {question?.questions[language] || ""}
          </Text>
          {question.imgUrl?.length > 0 ? (
            <Image
              source={{
                uri: normalizeUrl(BASE_URL, question.imgUrl),
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
            <View style={styles.default_img} />
          )}
          <View>
            {question.answers.map((item, index) => {
              const answer = marathon.answers.find(
                (i) => i.questionId === question._id
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
                  onPress={() => handleNext(question._id,index)}
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
        visible={finish}
        animationType="fade"
        transparent={true}
        onRequestClose={() => {
          setFinish(false);
        }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modal_title}>
              {Languages[language]["modals"]["marathon"]['title']}
            </Text>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Text style={styles.modal_description}>
                {Languages[language]["modals"]["marathon"]['description']}
              </Text>
            </View>
            <View style={styles.modal_btns}>
              <TouchableOpacity
                style={styles.modal_btn_no}
                onPress={() => {
                  router.push({pathname:"/(tabs)/marathon"})
                  setFinish(false);
                  dispatch(clearMarathon({}))
                }}
              >
                <Text style={styles.modal_btn_no_text}>
                  {Languages[language]["modals"]["no"]}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modal_btn_yes}
                onPress={() => {
                  setFinish(false);
                  router.push({pathname:"/(tabs)/marathon"})
                  dispatch(saveMarathon({}))
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
    view: {
      width: 36,
      height: 24,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    used_view: {
      backgroundColor: COLOR.green,
    },
    rejected_view: {
      backgroundColor: COLOR.red,
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
      padding: 8,
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
    green_answer_text: {
      backgroundColor: COLOR.green,
    },
    red_answer_text: {
      backgroundColor: COLOR.red,
    },
    question_cont: {
      width: "100%",
      minHeight: 420,
      padding: 8,
      backgroundColor: COLOR.black1,
      marginTop: 16,
      overflowY: "scroll",
      borderRadius: 10,
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
