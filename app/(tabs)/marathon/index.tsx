import { createGlobalStyles } from "@/assets/styles/global.style";
import { COLOR } from "@/constants/color.constant";
import {NavigationArrowLeftIcon} from "@/assets/svgs/icon"
import { Languages } from "@/language";
import {
  useLanguage,
  useMarathon,
  useThemeMode,
  useTicketAnswers,
  useTickets,
} from "@/store/selectors";
import { LanguageType } from "@/store/slices/language.slice";
import { addMarathonTest } from "@/store/slices/ticket.slice";
import { useNavigation, useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";

export default function Marathon() {
  const router = useRouter();
  const dark_mode = useThemeMode();
  const language = useLanguage();
  const marathon = useMarathon()
  const answers = marathon.reduce((a,b)=>a+b.answers.length,0)
  const dispatch = useDispatch();
  const tickets = useTickets()

  const global_styles = createGlobalStyles(dark_mode);
  const styles = createStyles(dark_mode);

  const MainLanguage = Languages[language as LanguageType]["marathon"];

  const totalQuestions = tickets?.length || 20
  const used = marathon.reduce((a,b)=>a + b.used,0) || 0
  const rejected = marathon.reduce((a,b)=>a + b.rejected,0) || 0
  const score = Math.round((used / totalQuestions) * 100);
  return (
    <ScrollView style={{ paddingBottom: 15 }}>
      <View style={global_styles.container}>
        <View style={styles.container_header}>
          <TouchableOpacity
            style={{ alignItems: "center", flexDirection: "row", gap: 6 }}
            onPress={() => router.back()}
          >
            <NavigationArrowLeftIcon color="#fff" />
            <Text style={styles.navigation_title}>Marafon</Text>
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
        <View style={styles.description_cont}>
          <Text style={styles.description_text}>
            {MainLanguage["description"]}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.start_btn}
          onPress={() => {
            router.push({ pathname: "/marathon/test" });
            dispatch(addMarathonTest({}));
          }}
        >
          <Text style={styles.start_text}>{MainLanguage["start"]}</Text>
        </TouchableOpacity>
        <View style={styles.ads_container}>
          <Text style={styles.ads_text}>ADS</Text>
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
    description_cont: {
      width: "100%",
      backgroundColor: COLOR.black1,
      padding: 8,
      marginTop: 24,
      borderRadius: 10,
    },
    description_text: {
      fontSize: 16,
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
    ads_container: {
      width: "100%",
      height: 187,
      backgroundColor: COLOR.white,
      borderRadius: 10,
      marginTop: 24,
      alignItems: "center",
      justifyContent: "center",
    },
    ads_text: {
      fontSize: 24,
      fontWeight: 400,
    },
  });
