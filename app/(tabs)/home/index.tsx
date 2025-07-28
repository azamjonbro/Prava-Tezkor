import { createGlobalStyles } from "@/assets/styles/global.style";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ExamIcon,
  Marathon2Icon,
  RandomIcon,
  SaveIcon,
  TemplateIcon,
} from "@/assets/svgs/icon";
import { COLOR } from "@/constants/color.constant";
import { HomeLinksParams } from "@/constants/index.constants";
import { Banner } from "@/data/banner.data";
import { Languages } from "@/language";
import { useLanguage, useThemeMode } from "@/store/selectors";
import { LanguageType } from "@/store/slices/language.slice";
import { setPro } from "@/store/slices/pro.slice";
import { setHomeTest } from "@/store/slices/ticket.slice";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";

export default function Index() {
  const [modal, setModal] = useState(false);
  const [carousel, setCarousel] = useState(0);

  const route = useRouter();
  const language = useLanguage();
  const MainLanguage = Languages[language as LanguageType]["home"];
  const dark_mode = useThemeMode();

  const handleNext = () => {
    if (Banner[carousel + 1]) {
      setCarousel(carousel + 1);
    } else {
      setCarousel(0);
    }
  };

  const handlePrev = () => {
    if (Banner[carousel - 1]) {
      setCarousel(carousel - 1);
    } else {
      setCarousel(Banner.length - 1);
    }
  };

  const global_styles = createGlobalStyles(dark_mode);
  const style = createStyles(dark_mode);
  const dispatch = useDispatch();

  return (
    <ScrollView>
      <View style={global_styles.container}>
        <View style={style.container_header}>
          <Text style={style.title}>{MainLanguage["title"]}</Text>
          <TouchableOpacity
            style={style.pro_background}
            onPress={() => setModal(true)}
          >
            <Text style={style.pro_text}>{MainLanguage["pro"]}</Text>
          </TouchableOpacity>
        </View>

        {/* <View style={style.banner_list_container}>
        <FlatList
          data={Banner}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={style.banner}>
              <Text style={style.banner_text}>{item.label}</Text>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
        />
      </View> */}
        <View style={style.banner_list_container}>
          <View style={style.banner}>
            <View style={style.banner_btns}>
              <TouchableOpacity onPress={handlePrev}>
                <ArrowLeftIcon color="#292D32" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleNext}>
                <ArrowRightIcon color="#292D32" />
              </TouchableOpacity>
            </View>
            <Text style={style.banner_text}>{Banner[carousel].label}</Text>
          </View>
        </View>

        <Text style={style.departments_title}>
          {MainLanguage["section_title"]}
        </Text>
        <View style={style.departments_wrapper}>
          <TouchableOpacity
            style={style.department}
            onPress={() => {
              route.push({
                pathname: "/home/test",
                params: {
                  type: HomeLinksParams.twenty_exam.link,
                  limit: HomeLinksParams.twenty_exam.params,
                },
              });
              dispatch(setHomeTest({ limit: 20 }));
            }}
          >
            <ExamIcon color={dark_mode ? COLOR.white: COLOR.black1} />
            <Text style={style.department_text}>
              {MainLanguage["departments"]["exam20"]}
            </Text>
          </TouchableOpacity>
          <View style={style.department_line}></View>
          <TouchableOpacity
            style={style.department}
            onPress={() => {
              route.push({
                pathname: "/home/test",
                params: {
                  type: HomeLinksParams.ten_exam.link,
                  limit: HomeLinksParams.ten_exam.params,
                },
              });
              dispatch(setHomeTest({ limit: 10 }));
            }}
          >
            <TemplateIcon color={dark_mode ? COLOR.white: COLOR.black1} />
            <Text style={style.department_text}>
              {MainLanguage["departments"]["exam10"]}
            </Text>
          </TouchableOpacity>
          <View style={style.department_line}></View>
          <TouchableOpacity
            style={style.department}
            onPress={() => route.push({ pathname: "/marathon" })}
          >
            <Marathon2Icon color={dark_mode ? COLOR.white: COLOR.black1} />
            <Text style={style.department_text}>
              {MainLanguage["departments"]["marathon"]}
            </Text>
          </TouchableOpacity>
          <View style={style.department_line}></View>
          <TouchableOpacity
            style={style.department}
            onPress={() => {
              route.push({
                pathname: "/home/test",
                params: {
                  type: HomeLinksParams.random.link,
                  limit: HomeLinksParams.random.params,
                },
              });
              dispatch(setHomeTest({ limit: 10 }));
            }}
          >
            <RandomIcon color={dark_mode ? COLOR.white: COLOR.black1} />
            <Text style={style.department_text}>
              {MainLanguage["departments"]["random"]}
            </Text>
          </TouchableOpacity>
          <View style={style.department_line}></View>
          <View style={style.department}>
            <SaveIcon color={dark_mode ? COLOR.white: COLOR.black1} />
            <Text style={style.department_text}>
              {MainLanguage["departments"]["saved"]}
            </Text>
          </View>
        </View>
        <Modal
          visible={modal}
          animationType="fade"
          transparent={true}
          onRequestClose={() => {
            setModal(false);
          }}
        >
          <View style={style.modalBackground}>
            <View style={style.modalContent}>
              <Text style={style.modal_title}>
                {
                  Languages[language as LanguageType]["modals"][
                    "pro_purchase_title"
                  ]
                }
              </Text>
              <View style={style.modal_btns}>
                <TouchableOpacity
                  style={style.modal_btn_no}
                  onPress={() => {
                    dispatch(setPro(false));
                    setModal(false);
                  }}
                >
                  <Text style={style.modal_btn_no_text}>
                    {Languages[language as LanguageType]["modals"]["no"]}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={style.modal_btn_yes}
                  onPress={() => {
                    dispatch(setPro(true));
                    setModal(false);
                  }}
                >
                  <Text style={style.modal_btn_yes_text}>
                    {Languages[language as LanguageType]["modals"]["yes"]}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}

const createStyles = (dark_mode: boolean) =>
  StyleSheet.create({
    container_header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    title: {
      color: dark_mode ? COLOR.white : COLOR.black1,
      fontSize: 25,
      fontWeight: "700",
    },
    pro_background: {
      backgroundColor: dark_mode ? COLOR.white : COLOR.black1,
      width: 74,
      height: 29,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 5,
    },
    pro_text: {
      fontSize: 16,
      fontWeight: "700",
      color: dark_mode ? COLOR.black1 : COLOR.white,
    },

    banner_list_container: {
      height: 208,
      marginTop: 19,
      justifyContent: "center",
    },

    banner: {
      width: "100%",
      height: 208,
      backgroundColor: COLOR.gray,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
    },

    banner_text: {
      fontSize: 20,
      fontWeight: "700",
      color: dark_mode?COLOR.white: COLOR.black1,
    },

    departments_title: {
      marginTop: 16,
      color: dark_mode ? COLOR.white : COLOR.black1,
      fontSize: 18,
      marginBottom: 16,
    },
    departments_wrapper: {
      width: "100%",
      backgroundColor: dark_mode?COLOR.black2:COLOR.dark_bg,
      borderRadius: 10,
    },
    department: {
      padding: 12,
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
    },
    department_text: {
      fontSize: 14,
      color: dark_mode?COLOR.white:COLOR.dark,
    },
    department_line: {
      width: "100%",
      height: 1,
      backgroundColor: dark_mode?COLOR.white3:COLOR.dark_color,
    },
    modalBackground: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: dark_mode?COLOR.black1: COLOR.white2,
    },
    modalContent: {
      width: 300,
      height: 120,
      padding: 8,
      backgroundColor: "white",
      borderRadius: 10,
    },
    modal_title: {
      fontSize: 16,
      fontWeight: 700,
      textAlign: "center",
      marginTop: 20,
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
    banner_btns: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      position: "absolute",
    },
  });