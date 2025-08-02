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
  usePro,
  useSavedTickets,
  useThemeMode,
  useTicketAnswers,
  useTickets,
} from "@/store/selectors";
import { LanguageType } from "@/store/slices/language.slice";
import {
  addTicketToSaved,
  removeTicketFromSaved,
} from "@/store/slices/saved_tickets.slice";
import { addNewAnswerTicketTest } from "@/store/slices/ticket.slice";
import { useLocalSearchParams, useRouter } from "expo-router";
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

export default function ticketTest() {
  const router = useRouter();
  const tickets = useTickets() || [];
  const language = useLanguage() as LanguageType;
  const dark_mode = useThemeMode();
  const global_styles = createGlobalStyles(dark_mode);
  const param = useLocalSearchParams() as { id?: string };
  const { id } = param || {};
  const pro = usePro();
  const answers = useTicketAnswers();
  const dispatch = useDispatch();
  const [isFinished, setFinished] = useState(false);
  const [timer, setTimer] = useState<number>(15 * 60);
  const saved_tickets = useSavedTickets();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          router.push({
            pathname: "/template/ticket-test-result",
            params: { id },
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
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (!id || isNaN(Number(id))) {
    return (
      <View>
        <Text>Not found id</Text>
      </View>
    );
  }

  if (!tickets || !tickets[+id - 1]) {
    return (
      <View>
        <Text>not load tickets</Text>
      </View>
    );
  }

  const ticket = tickets?.[Number(id) - 1]?.children ?? [];
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const question = ticket[currentQuestion];

  const answer = useMemo(
    () => answers.find((i) => i.ticketId == +id),
    [answers, id]
  );

  const this_ticket = useMemo(() => {
    return saved_tickets.find((i) => i.id == +id + currentQuestion);
  }, [currentQuestion, saved_tickets]);

  const normalizeUrl = (base: string, path: string) => {
    const cleanPath = path.replace(/^\.?\//, "");
    return `${base.replace(/\/$/, "")}/${cleanPath}`;
  };

  return (
    <ScrollView
      style={{ backgroundColor: dark_mode ? COLOR.dark : COLOR.white }}
    >
      <View style={global_styles.container}>
        <View style={styles.container_header}>
          <TouchableOpacity
            style={{ alignItems: "center", flexDirection: "row", gap: 6 }}
            onPress={() => router.back()}
          >
            <NavigationArrowLeftIcon color="#fff" />
            {id ? (
              <Text style={styles.navigation_title}>
                {Languages[language]["template"]["title"]} - {id}
              </Text>
            ) : null}
          </TouchableOpacity>
          <View style={styles.container_header_right}>
            <Modal
              visible={isFinished}
              animationType="fade"
              transparent={true}
              onRequestClose={() => setFinished(false)}
            >
              <View style={styles.modalBackground}>
                <View style={styles.modalContent}>
                  <Text style={styles.modal_title}>
                    {Languages[language]["modals"]["finish_ticket_warning"]}
                    <Text style={{ color: COLOR.red }}>
                      {
                        Languages[language]["modals"][
                          "finish_ticket_question"
                        ]
                      }
                    </Text>
                  </Text>
                  <View style={styles.modal_btns}>
                    <TouchableOpacity
                      style={styles.modal_btn_no}
                      onPress={() => setFinished(false)}
                    >
                      <Text style={styles.modal_btn_no_text}>
                        {Languages[language]["modals"]["no"]}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.modal_btn_yes}
                      onPress={() => {
                        setFinished(false);
                        router.push({
                          pathname: "/template/ticket-test-result",
                          params: { id },
                        });
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
            <TouchableOpacity onPress={() => setFinished(true)}>
              <FlagIcon color="#D0D0D0" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (this_ticket) {
                  dispatch(
                    removeTicketFromSaved({ ticketId: +id + currentQuestion })
                  );
                } else {
                  dispatch(
                    addTicketToSaved({ ...question, id: +id + currentQuestion })
                  );
                }
              }}
            >
              <ArchiveIcon
                color={this_ticket ? COLOR.green : "#D0D0D0"}
              />
            </TouchableOpacity>
            <View style={styles.container_header_timer}>
              <Text style={styles.container_header_timer_text}>
                {formatTime(timer)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.question_number_list}>
          <FlatList
            data={ticket}
            horizontal
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => {
              const ans = answer?.answers.find((i)=>i.questionId == index)
              return (
                <TouchableOpacity
                  style={[
                    styles.question_number,
                    ans
                      ? ans.correct_answer == item.correct_answer
                        ? styles.question_number_green_color
                        : styles.question_number_red_color
                      : styles.question_number_default_color,
                  ]}
                  onPress={() => setCurrentQuestion(index)}
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
              return (
                <TouchableOpacity
                  style={styles.answer}
                  key={index}
                  onPress={() => {
                    const nextQuestionIndex = currentQuestion + 1;
                    const ans = answer?.answers.find(
                      (i) => i.questionId == currentQuestion
                    );

                    if (!ans) {
                      dispatch(
                        addNewAnswerTicketTest({
                          ticketId: +id,
                          correct_answer: index + 1,
                          questionId: currentQuestion,  
                        })
                      );
                    }

                    if (nextQuestionIndex >= ticket.length) {
                      router.push({
                        pathname: "/template/ticket-test-result",
                        params: { id },
                      });
                    } else {
                      setCurrentQuestion(nextQuestionIndex);
                    }
                  }}
                >
                  <Text style={styles.answer_text}>
                    {item[language]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {pro ? (
            <Text style={styles.comment_text}>
              izox: {question["izoh"][language] || ""}
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

const styles = StyleSheet.create({
  container_header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingTop: 40,
  },
  navigation_title: {
    fontSize: 24,
    fontWeight: 400,
    color: COLOR.white,
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
    color:COLOR.white
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
  question_cont: {
    width: "100%",
    height: "70%",
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
    padding:8,
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
