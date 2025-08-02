import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useLanguage, useThemeMode } from "@/store/selectors";
import { LanguageType } from "@/store/slices/language.slice";
import { Languages } from "@/language";
import { createGlobalStyles } from "@/assets/styles/global.style";
import { COLOR } from "@/constants/color.constant";
import {
  Bonus2Icon,
  CartIcon,
  NavigationArrowLeftIcon,
} from "@/assets/svgs/icon";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const router = useRouter();
  const language = useLanguage() as LanguageType;
  const MainLanguage = Languages[language]["offer"];
  const dark_mode = useThemeMode();
  const global_styles = createGlobalStyles(dark_mode);
  const styles = createStyles(dark_mode);
  const [user, setUser] = useState<{
    coin: number;
  }>({ coin: 0 });

  const data = [
    {
      title: MainLanguage["coin"]["coins_excersize"]["first"],
      link: "/(tabs)/bonus/offer" as any,
      type: "page",
    },
    {
      title: MainLanguage["coin"]["coins_excersize"]["second"],
      link: "",
      type: "none",
    },
    {
      title: MainLanguage["coin"]["coins_excersize"]["third"],
      link: "",
      type: "link",
    },
  ];

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await AsyncStorage.getItem("user");
        if (user) {
          setUser(JSON.parse(user));
        }
      } catch (error) {
        console.error(error);
      }
    };

    getUser();
  }, []);

  const handleOpen = async (url: string) => {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  };

  return (
    <ScrollView>
      <View style={global_styles.container}>
        <View style={styles.container_header}>
          <TouchableOpacity
            style={{ alignItems: "center", flexDirection: "row", gap: 6 }}
            onPress={() => router.back()}
          >
            <NavigationArrowLeftIcon color="#fff" />
            <Text style={styles.navigation_title}>{MainLanguage["title"]}</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <TouchableOpacity
              onPress={() => router.push({ pathname: "/bonus/payment" })}
            >
              <Bonus2Icon color={dark_mode ? COLOR.white : COLOR.dark_color} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push({ pathname: "/bonus/earn_money" })}
            >
              <CartIcon color={dark_mode ? COLOR.white : COLOR.dark_color} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.coin_container}>
          <Text style={styles.coin_title}>{MainLanguage["coin"]["title"]}</Text>
          <Text style={styles.coin_number}>{user.coin}</Text>
          <Text style={styles.coin_description}>
            {MainLanguage["coin"]["description"]}
          </Text>
        </View>
        <View style={styles.exercise_cont}>
          {data.map((i, index) => {
            return (
              <View key={index}>
                <View style={styles.exercise}>
                  <Text style={styles.exercise_title}>{i.title}</Text>
                  <TouchableOpacity
                    style={styles.exercise_get}
                    onPress={() => {
                      switch (i.type) {
                        case "page":
                          router.push({ pathname: i.link });
                          break;
                        case "link":
                          handleOpen(i.link);
                          break;
                        default:
                          break;
                      }
                    }}
                  >
                    <Text style={styles.exercise_get_text}>Get</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.line}></View>
              </View>
            );
          })}
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
    coin_container: {
      width: "100%",
      minHeight: 176,
      backgroundColor: dark_mode ? COLOR.black1 : COLOR.dark_bg,
      alignItems: "center",
      justifyContent: "flex-start",
      flexDirection: "column",
      borderBottomLeftRadius: 180,
      borderBottomRightRadius: 180,
      marginTop: 7,
    },
    coin_title: {
      marginTop: 24,
      fontSize: 18,
      fontWeight: 400,
      color: dark_mode ? COLOR.white : COLOR.dark_color,
    },
    coin_number: {
      marginTop: 12,
      fontSize: 32,
      fontWeight: "bold",
      color: COLOR.yellow,
    },
    coin_description: {
      fontSize: 12,
      color: COLOR.white2,
      fontWeight: "regular",
      marginTop: 12,
      width: 180,
      textAlign: "center",
    },
    line: {
      width: "100%",
      height: 1,
      backgroundColor: COLOR.white,
    },
    exercise_cont: {
      width: "100%",
      minHeight: "70%",
      backgroundColor: dark_mode ? COLOR.black1 : COLOR.dark_bg,
      borderRadius: 10,
      marginTop: 25,
    },
    exercise: {
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 10,
      paddingBottom: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    exercise_title: {
      fontSize: 14,
      color: COLOR.white,
      width:"80%"
    },
    exercise_get: {
      width: 41,
      height: 18,
      borderRadius: 5,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLOR.gray2,
    },
    exercise_get_text: {
      fontSize: 10,
      color: COLOR.dark,
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
  });
