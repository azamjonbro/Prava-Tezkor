import { createGlobalStyles } from "@/assets/styles/global.style";
import {
  AllQuestionIcon,
    ArrowSquareIcon,
    EyeIcon,
    FinesIcon,
    InfoIcon,
    InfoIcon2,
    InstagramIcon,
    LinkIcon,
    MenuBoardIcon,
    MoonIcon,
    NavigationArrowLeftIcon,
    PlayCircleIcon,
    SafeSecuratyIcon,
    Screen2Icon,
    ScreenIcon,
    SmartCarIcon,
    StarIcon,
    TelegramIcon,
    TranslateIcon,
} from "@/assets/svgs/icon";
import { COLOR } from "@/constants/color.constant";
import { Languages } from "@/language";
import { useLanguage, useThemeMode } from "@/store/selectors";
import { LanguageType, setLanguage } from "@/store/slices/language.slice";
import { setTheme } from "@/store/slices/theme-mode.slice";
import { useNavigation } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Linking,
    Modal,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useDispatch } from "react-redux";

export default function Settings() {
  const navigation = useNavigation();
  const [lang_open, setLangOpen] = useState(false);
  const language = useLanguage();

  const dark_mode = useThemeMode();

  const MainLanguage = Languages[language as LanguageType]["settings"];
  const dispatch = useDispatch();

  const toggleSwitch = () => {
    dispatch(setTheme(!dark_mode));
  };

  const global_styles = createGlobalStyles(dark_mode)

  const handleOpen = async (url:string)=>{
     const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }

  return (
    <View style={global_styles.container2}>
      <ScrollView>
        <View style={styles.container_header}>
          <TouchableOpacity
            style={{ alignItems: "center", flexDirection: "row", gap: 6 }}
            onPress={() => navigation.goBack()}
          >
            <NavigationArrowLeftIcon color="#fff" />
            <Text style={styles.navigation_title}>{MainLanguage["title"]}</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <InfoIcon color="#B0B0B0" />
          </TouchableOpacity>
        </View>
        <View style={{ ...styles.line, marginTop: 20 }}></View>
        <Text style={styles.section_title}>
          {MainLanguage["sections"]["extras"]}
        </Text>
        <View style={styles.section}>
          <TouchableOpacity style={styles.section_child} onPress={toggleSwitch}>
            <View style={styles.section_child_left}>
              <View style={styles.section_child_icon}>
                <MoonIcon color={COLOR.green2} />
              </View>
              <Text style={styles.section_child_text}>
                {MainLanguage["options"]["dark_mode"]}
              </Text>
            </View>
            <View>
              <Switch
                trackColor={{ false: "#767577", true: COLOR.black2 }}
                thumbColor={dark_mode ? COLOR.green2 : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={dark_mode}
              />
            </View>
          </TouchableOpacity>

          <View style={styles.line}></View>
          <TouchableOpacity
            onPress={() => setLangOpen(true)}
            style={styles.section_child}
          >
            <View style={styles.section_child_left}>
              <View style={styles.section_child_icon}>
                <TranslateIcon color={COLOR.green2} />
              </View>
              <Text style={styles.section_child_text}>
                {MainLanguage["options"]["app_language"]}
              </Text>
            </View>
            <View>
              <Text style={{ color: "white", fontSize: 14, fontWeight: 400 }}>
                {language === "lotin"
                  ? MainLanguage["options"]["uzbek"]
                  : language == "rus"
                  ? MainLanguage["options"]["russian"]
                  : MainLanguage["options"]["cyrillic"]}
              </Text>
            </View>
          </TouchableOpacity>

          <Modal
            visible={lang_open}
            animationType="fade"
            transparent={true}
            onRequestClose={() => setLangOpen(false)}
          >
            <View style={styles.modalBackground}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  {MainLanguage["options"]["choose_language"]}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.language_btn,
                    language == "lotin"
                      ? styles.selected_language
                      : styles.default_language,
                  ]}
                  onPress={() => {
                    dispatch(setLanguage("lotin"));
                    setLangOpen(false);
                  }}
                >
                  <Text
                    style={[
                      language === "lotin"
                        ? styles.selected_language_text
                        : styles.language_btn_text,
                    ]}
                  >
                    {MainLanguage["options"]["uzbek"]}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.language_btn,
                    language == "rus"
                      ? styles.selected_language
                      : styles.default_language,
                  ]}
                  onPress={() => {
                    dispatch(setLanguage("rus"));
                    setLangOpen(false);
                  }}
                >
                  <Text
                    style={[
                      language === "rus"
                        ? styles.selected_language_text
                        : styles.language_btn_text,
                    ]}
                  >
                    {MainLanguage["options"]["russian"]}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.language_btn,
                    language == "krill"
                      ? styles.selected_language
                      : styles.default_language,
                  ]}
                  onPress={() => {
                    dispatch(setLanguage("krill"));
                    setLangOpen(false);
                  }}
                >
                  <Text
                    style={[
                      language === "krill"
                        ? styles.selected_language_text
                        : styles.language_btn_text,
                    ]}
                  >
                    {MainLanguage["options"]["cyrillic"]}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <View style={styles.line}></View>
          <View style={styles.section_child}>
            <View style={styles.section_child_left}>
              <View style={styles.section_child_icon}>
                <AllQuestionIcon color={COLOR.green2} />
              </View>
              <Text style={styles.section_child_text}>
                {MainLanguage["options"]["all_questions"]}
              </Text>
            </View>
          </View>

          <View style={styles.line}></View>
          <View style={styles.section_child}>
            <View style={styles.section_child_left}>
              <View style={styles.section_child_icon}>
                <FinesIcon color={COLOR.green2} />
              </View>
              <Text style={styles.section_child_text}>
                {MainLanguage["options"]["fines"]}
              </Text>
            </View>
          </View>
        </View>


        <Text style={styles.section_title}>
          {MainLanguage["sections"]["contact"]}
        </Text>
        <View style={styles.section}>
          <TouchableOpacity style={styles.section_child} onPress={()=>handleOpen("https://telegram.org/")}>
            <View style={styles.section_child_left}>
              <View style={styles.section_child_icon}>
                <TelegramIcon color={COLOR.green2} />
              </View>
              <Text style={styles.section_child_text}>
                {MainLanguage["options"]["telegram"]}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.line}></View>
          <TouchableOpacity style={styles.section_child} onPress={()=>handleOpen("https://instagram.com")}>
            <View style={styles.section_child_left}>
              <View style={styles.section_child_icon}>
                <InstagramIcon color={COLOR.green2} />
              </View>
              <Text style={styles.section_child_text}>
                {MainLanguage["options"]["instagram"]}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.line}></View>
          <TouchableOpacity style={styles.section_child} onPress={()=>handleOpen("https://telegra.ph/Privacy-Policy-for-Prava-UZ--YHQ-2025-03-22")}>
            <View style={styles.section_child_left}>
              <View style={styles.section_child_icon}>
                <SafeSecuratyIcon color={COLOR.green2} />
              </View>
              <Text style={styles.section_child_text}>
                {MainLanguage["options"]["privacy_policy"]}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.line}></View>
          <TouchableOpacity style={styles.section_child} onPress={()=>handleOpen(`https://play.google.com/store/apps?hl=ru&pli=1`)}>
            <View style={styles.section_child_left}>
              <View style={styles.section_child_icon}>
                <StarIcon color={COLOR.green2} />
              </View>
              <Text style={styles.section_child_text}>
                {MainLanguage["options"]["rate_app"]}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.line}></View>
          <TouchableOpacity style={styles.section_child} onPress={()=>handleOpen(`https://play.google.com/store/apps?hl=ru&pli=1`)}>
            <View style={styles.section_child_left}>
              <View style={styles.section_child_icon}>
                <LinkIcon color={COLOR.green2} />
              </View>
              <Text style={styles.section_child_text}>
                {MainLanguage["options"]["share_app"]}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.line}></View>
          <View style={styles.section_child}>
            <View style={styles.section_child_left}>
              <View style={styles.section_child_icon}>
                <InfoIcon2 color={COLOR.green2} />
              </View>
              <Text style={styles.section_child_text}>
                {MainLanguage["options"]["about_app"]}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.line}></View>
        <View style={styles.version_cont}>
          <Text style={styles.version_text}>Version 1.0.0 </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container_header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingLeft: 12,
    paddingRight: 12,
  },
  navigation_title: {
    fontSize: 24,
    fontWeight: 400,
    color: COLOR.white,
  },
  line: {
    width: "100%",
    height: 1,
    backgroundColor: COLOR.white,
  },
  section_title: {
    fontSize: 24,
    fontWeight: 400,
    color: COLOR.white,
    marginLeft: 12,
    marginRight: 12,
    marginTop: 16,
  },
  section: {
    width: "100%",
    backgroundColor: COLOR.black1,
    marginTop: 13,
  },
  section_child: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    gap: 12,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 12,
    paddingRight: 12,
  },
  section_child_left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  section_child_text: {
    fontSize: 14,
    color: COLOR.white,
    fontWeight: 400,
  },
  section_child_icon: {
    width: 30,
    height: 30,
    backgroundColor: COLOR.green3,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  version_cont: {
    width: "100%",
    height: 55,
    backgroundColor: COLOR.black1,
    alignItems: "center",
    justifyContent: "center",
  },
  version_text: {
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
    padding: 8,
    backgroundColor: "white",
    borderRadius: 10,
  },
  modalTitle: {
    textAlign: "center",
    fontSize: 20,
  },
  language_btn: {
    width: "100%",
    height: 40,
    marginTop: 5,
    justifyContent: "center",
    padding: 5,
    borderRadius: 7,
  },
  language_btn_text: {
    color: COLOR.dark1,
  },
  selected_language: {
    backgroundColor: COLOR.black1,
  },
  selected_language_text: {
    color: COLOR.white,
  },
  default_language: {
    backgroundColor: COLOR.white3,
  },
});
