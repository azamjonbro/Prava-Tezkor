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
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Template() {
  const router = useRouter();

  const language = useLanguage();
  const dark_mode = useThemeMode();
  const tickets = useTickets();
  const answers = useTicketAnswers();

  const global_styles = createGlobalStyles(dark_mode);
  const styles = createStyles(dark_mode);

  const totalQuestions = tickets.reduce((acc, item) => {
    return acc + item.children.length;
  }, 0);
  const used = answers.reduce((acc, item) => acc + item.used, 0);
  const rejected = answers.reduce((acc, item) => acc + item.rejected, 0);
  const score = Math.round((used / totalQuestions) * 100);
  const MainLanguage = Languages[language as LanguageType]["template"];
  return (
    <ScrollView>
      <View style={global_styles.container}>
        <View style={styles.container_header}>
          <TouchableOpacity
            style={{ alignItems: "center", flexDirection: "row", gap: 6 }}
            onPress={() => router.push({pathname:"/(tabs)/home"})}
          >
            <NavigationArrowLeftIcon
              color={dark_mode ? "#fff" : COLOR.black1}
            />
            <Text style={styles.navigation_title}>{MainLanguage["title"]}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statistic_cont}>
          <View>
            <Text style={styles.statistic_percent_text}>{score}%</Text>
            <Text style={styles.statistic_mini_title}>
              {MainLanguage["my_result"]}
            </Text>
          </View>
          <View style={styles.statistic_results}>
            <View>
              <Text style={styles.statistic_result_text}>
                <Text style={styles.statistic_result_text_true}>{used}</Text> /{" "}
                {totalQuestions}
              </Text>
              <Text style={styles.statistic_mini_title}>
                {MainLanguage["true_answers"]}
              </Text>
            </View>
            <View>
              <Text style={styles.statistic_result_text}>
                <Text style={styles.statistic_result_text_false}>
                  {rejected}
                </Text>{" "}
                / {totalQuestions}
              </Text>
              <Text style={styles.statistic_mini_title}>
                {MainLanguage["false_answers"]}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            style={styles.ticket}
            onPress={() =>
              router.push({
                pathname: "/template/template-detail",
                params: { from: 0, to: 9 },
              })
            }
          >
            <Text style={styles.ticket_text}>
              {MainLanguage["tickets"]["ten_ticket"]}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.ticket}
            onPress={() =>
              router.push({
                pathname: "/template/template-detail",
                params: { from: 9, to: 19 },
              })
            }
          >
            <Text style={styles.ticket_text}>
              {MainLanguage["tickets"]["twenty_ticket"]}
            </Text>
          </TouchableOpacity>

          {/* == */}
          <TouchableOpacity
            style={styles.ticket}
            onPress={() =>
              router.push({
                pathname: "/template/template-detail",
                params: { from: 19, to: 299 },
              })
            }
          >
            <Text style={styles.ticket_text}>
              {MainLanguage["tickets"]["three_hundred_ticket"]}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.ticket}
            onPress={() =>
              router.push({
                pathname: "/template/template-detail",
                params: { from: 299, to: 500 },
              })
            }
          >
            <Text style={styles.ticket_text}>
              {MainLanguage["tickets"]["five_hundred_ticket"]}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.marathon_btn}
          onPress={() => router.push("/marathon")}
        >
          <Text style={styles.marathon_btn_text}>
            {MainLanguage["marathon"]}
          </Text>
        </TouchableOpacity>

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
      paddingTop:40,
    },
    navigation_title: {
      fontSize: 24,
      fontWeight: 400,
      color: dark_mode ? COLOR.white : COLOR.black1,
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
      justifyContent: "center",
      marginTop: 15,
    },
    ticket_text: {
      fontSize: 16,
      color: COLOR.white,
      fontWeight: 500,
    },
    marathon_btn: {
      width: "100%",
      height: 62,
      marginTop: 16,
      backgroundColor: COLOR.black1,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
    },
    marathon_btn_text: {
      fontSize: 16,
      color: COLOR.white,
      fontWeight: 500,
    },
    ads_cont: {
      width: "100%",
      height: "30%",
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
