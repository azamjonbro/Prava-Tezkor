import { createGlobalStyles } from "@/assets/styles/global.style";
import {  NavigationArrowLeftIcon } from "@/assets/svgs/icon";
import { COLOR } from "@/constants/color.constant";
import { Languages } from "@/language";
import {
  useLanguage,
  useThemeMode,
  useTicketAnswers,
  useTickets,
} from "@/store/selectors";
import { LanguageType } from "@/store/slices/language.slice";
import { addNewAnswerTicket } from "@/store/slices/ticket.slice";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";

export default function templateDetail() {
  const router = useRouter();
  const { to, from } = useLocalSearchParams();
  const tickets = useTickets();
  const ticket = tickets.slice(+from, +to);
  const totalQuestions = ticket.reduce(
    (acc, item) => acc + item.children.length,
    0
  );
  const answers = useTicketAnswers();
  const language = useLanguage();
  const Mainlanguage =
    Languages[language as LanguageType]["template"]["ticket"];

  const dark_mode = useThemeMode();
  const global_styles = createGlobalStyles(dark_mode);
  const ticketIds = ticket.map((i) => i.id);
  const answer = answers.filter((i) => ticketIds.includes(i.ticketId))
  const used = answer.reduce((acc, item) => acc + item.used, 0);
  const rejected = answer.reduce((acc, item) => acc + item.rejected, 0);
  const score = Math.round((used / totalQuestions) * 100);
  const dispatch = useDispatch();

  return (
    <View style={global_styles.container}>
      <View style={styles.container_header}>
        <TouchableOpacity
          style={{ alignItems: "center", flexDirection: "row", gap: 6 }}
          onPress={() => router.push({pathname:"/template"})}
        >
          <NavigationArrowLeftIcon color="#fff" />
          <Text style={styles.navigation_title}>{Mainlanguage["title"]}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.statistic_cont}>
        <View>
          <Text style={styles.statistic_percent_text}>{score}%</Text>
          <Text style={styles.statistic_mini_title}>
            {Mainlanguage["my_result"]}
          </Text>
        </View>
        <View style={styles.statistic_results}>
          <View>
            <Text style={styles.statistic_result_text}>
              <Text style={styles.statistic_result_text_true}>{used}</Text>/{" "}
              {totalQuestions}
            </Text>
            <Text style={styles.statistic_mini_title}>
              {Mainlanguage["true_answers"]}
            </Text>
          </View>
          <View>
            <Text style={styles.statistic_result_text}>
              <Text style={styles.statistic_result_text_false}>{rejected}</Text>{" "}
              /{totalQuestions}
            </Text>
            <Text style={styles.statistic_mini_title}>
              {Mainlanguage["false_answers"]}
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        data={ticket}
        style={styles.tickets}
        numColumns={2}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => {
          const ticket_answer = answers.find((i) => i.ticketId === item.id);
          return (
            <TouchableOpacity
              style={styles.ticket}
              onPress={() => {
                router.push({
                  pathname: "/template/ticket-test",
                  params: { id: item.id },
                });
                dispatch(addNewAnswerTicket({ ticketId: index + 1 }));
              }}
            >
              <Text style={styles.ticket_text}>{index + 1} {Mainlanguage['title']}</Text>
              <Text
                style={[
                  styles.ticket_result_text,
                  (ticket_answer?.used || 0) >= 9
                    ? styles.ticket_result_text_green
                    : styles.ticket_result_text_red,
                ]}
              >
                {ticket_answer?.used || 0}/{item.children.length}
              </Text>
            </TouchableOpacity>
          );
        }}
        columnWrapperStyle={{ gap: 15 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container_header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingTop:40,

  },
  navigation_title: {
    fontSize: 24,
    fontWeight: 400,
    color: COLOR.white,
  },
  statistic_cont: {
    width: "100%",
    height: 172,
    backgroundColor: COLOR.black1,
    marginTop: 29,
    borderRadius: 10,
    padding: 18,
  },
  statistic_mini_title: {
    color: COLOR.gray2,
    fontSize: 8,
    fontWeight: 500,
  },
  statistic_percent_text: {
    fontSize: 32,
    fontWeight: 500,
    color: COLOR.white,
  },
  statistic_results: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 24,
  },
  statistic_result_text: {
    fontSize: 18,
    fontWeight: 500,
    color: COLOR.white,
  },
  statistic_result_text_true: {
    color: COLOR.green,
  },
  statistic_result_text_false: {
    color: COLOR.red,
  },
  tickets: {
    marginTop: 22,
  },
  ticket: {
    width: "47%",
    height: 62,
    backgroundColor: COLOR.black1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
    marginTop: 15,
  },
  ticket_text: {
    fontSize: 16,
    color: COLOR.white,
    fontWeight: 500,
  },
  ticket_result_text: {
    marginTop: 25,
    fontSize: 10,
    fontWeight: 500,
  },
  ticket_result_text_green: {
    color: COLOR.green,
  },
  ticket_result_text_red: {
    color: COLOR.red,
  },
});
