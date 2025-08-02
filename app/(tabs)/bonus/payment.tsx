import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
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
import { api } from "@/services/api";
import { Toast } from "toastify-react-native";

export interface FeeI {
  isPaid: boolean;
  credit_card: string;
  money_id: string;
  name: string;
}

export default function Payment() {
  const router = useRouter();
  const language = useLanguage() as LanguageType;
  const MainLanguage = Languages[language]["offer"]["coin"]["payment"];
  const dark_mode = useThemeMode();
  const global_styles = createGlobalStyles(dark_mode);
  const styles = createStyles(dark_mode);
  const [fee, setFee] = useState<FeeI[]>([]);

  const getUser = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const { data, status } = await api.get("/api/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (status === 200) {
        setFee(data.user.fees);
      }
    } catch (err) {
      const error = err as Error;
      Toast.error(error.message);
    }
  };
  useEffect(() => {
    getUser();
  }, []);

  return (
    <ScrollView>
      <View style={global_styles.container}>
        <View style={styles.container_header}>
          <TouchableOpacity
            style={{ alignItems: "center", flexDirection: "row", gap: 6 }}
            onPress={() => router.push({pathname:"/(tabs)/bonus"})}
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

        <View style={styles.payments_cont}>
          {fee.length == 0 ? (
            <>
              <Text style={styles.nothing_text}>
                {MainLanguage["not_found"]}
              </Text>
              <View style={styles.line}></View>
            </>
          ) : (
            <>
              {fee.map((i, index) => {
                return (
                  <View key={index}>
                    <View style={styles.payment}>
                      <Text style={styles.payment_text}>
                        #{index + 1} {MainLanguage["payment"]} {index + 1}
                      </Text>
                      <View style={styles.payment_status}>
                        <Text
                          style={{
                            ...styles.payment_status_text,
                            backgroundColor: i.isPaid ? COLOR.green : COLOR.red,
                          }}
                        >
                          {i.isPaid
                            ? MainLanguage["agree"]
                            : MainLanguage["rejected"]}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.line}></View>
                  </View>
                );
              })}
            </>
          )}
        </View>

        <View style={styles.ads_cont}>
          <Text style={styles.ads_cont_text}>ADS</Text>
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
    ads_cont: {
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLOR.gray3,
      marginTop: 22,
      borderRadius: 10,
      marginBottom: 22,
      padding: 10,
    },
    ads_cont_text: {
      fontSize: 24,
      color: COLOR.black1,
    },
    payments_cont: {
      width: "100%",
      minHeight: 150,
      borderRadius: 10,
      marginTop: 24,
      backgroundColor: COLOR.black1,
    },
    payment: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 8,
      marginTop: 8,
    },
    payment_text: {
      fontSize: 14,
      fontWeight: "bold",
      color: COLOR.white,
    },
    payment_status: {
      width: 90,
      height: 20,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 5,
    },
    payment_status_text: {
      fontSize: 10,
      fontWeight: "bold",
      color: COLOR.white,
    },
    line: {
      width: "100%",
      height: 1,
      backgroundColor: dark_mode ? COLOR.white : COLOR.dark_color,
      marginTop: 9,
    },
    nothing_text: {
      textAlign: "center",
      color: dark_mode ? COLOR.white : COLOR.dark_color,
      fontWeight: "regular",
      marginTop: 12,
    },
  });
