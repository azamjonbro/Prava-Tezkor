import { createGlobalStyles } from "@/assets/styles/global.style";
import { InfoIcon, NavigationArrowLeftIcon } from "@/assets/svgs/icon";
import { COLOR } from "@/constants/color.constant";
import { Languages } from "@/language";
import {
  useLanguage,
  useMarathon,
  useThemeMode,
} from "@/store/selectors";
import { LanguageType } from "@/store/slices/language.slice";
import { addMarathonTest } from "@/store/slices/ticket.slice";
import { useRouter } from "expo-router";
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
  const marathon = useMarathon();

  const dispatch = useDispatch();

  const global_styles = createGlobalStyles(dark_mode);
  const styles = createStyles(dark_mode);

  // Safe fallback
  const MainLanguage =
    Languages?.[language as LanguageType]?.["marathon"] ?? {
      my_result: "My Result",
      true_answers: "Correct",
      false_answers: "Incorrect",
      description: "Answer questions as fast as possible.",
      start: "Start",
    };

  const totalQuestions = marathon?.questions?.length || 0;
  const used = marathon?.used || 0;
  const rejected = marathon?.rejected || 0;

  // Prevent division by zero
  const score = totalQuestions > 0 ? Math.round((used / totalQuestions) * 100) : 0;

  return (
    <ScrollView style={{ paddingBottom: 15 }}>
      <View style={global_styles.container}>
        {/* Header */}
        <View style={styles.container_header}>
          <TouchableOpacity
            style={{ alignItems: "center", flexDirection: "row", gap: 6 }}
            onPress={() => router.back()}
          >
            <NavigationArrowLeftIcon color={dark_mode ? COLOR.white1 : COLOR.black1} />
            <Text style={styles.navigation_title}>Marathon</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <InfoIcon color="#B0B0B0" />
          </TouchableOpacity>
        </View>

        {/* Score Section */}
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
                <Text style={styles.statistic_result_text_true}>{used}</Text> / {totalQuestions}
              </Text>
              <Text style={styles.statistic_mini_title}>
                {MainLanguage["true_answers"]}
              </Text>
            </View>
            <View>
              <Text style={styles.statistic_result_text}>
                <Text style={styles.statistic_result_text_false}>{rejected}</Text> / {totalQuestions}
              </Text>
              <Text style={styles.statistic_mini_title}>
                {MainLanguage["false_answers"]}
              </Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.description_cont}>
          <Text style={styles.description_text}>
            {MainLanguage["description"]}
          </Text>
        </View>

        {/* Start Button */}
        <TouchableOpacity
          style={styles.start_btn}
          onPress={() => {
            dispatch(addMarathonTest({}));
            router.push("/marathon/test");
          }}
        >
          <Text style={styles.start_text}>{MainLanguage["start"]}</Text>
        </TouchableOpacity>

        {/* Ads Placeholder */}
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
      fontWeight: "400",
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
      fontWeight: "500",
    },
    statistic_percent_text: {
      fontSize: 32,
      fontWeight: "500",
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
      fontWeight: "500",
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
      fontWeight: "500",
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
      fontWeight: "400",
    },
  });
