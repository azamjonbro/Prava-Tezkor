import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import React, { use, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useLanguage, useThemeMode } from "@/store/selectors";
import { LanguageType } from "@/store/slices/language.slice";
import { Languages } from "@/language";
import { createGlobalStyles } from "@/assets/styles/global.style";
import {
  Bonus2Icon,
  CartIcon,
  NavigationArrowLeftIcon,
} from "@/assets/svgs/icon";
import { COLOR } from "@/constants/color.constant";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "@/services/api";
import { Toast } from "toastify-react-native";
import { AxiosError } from "axios";

export interface Earn_moneyI {
  _id: string;
  coin: number;
  price: string;
}

export default function Earn_money() {
  const router = useRouter();
  const language = useLanguage() as LanguageType;
  const MainLanguage = Languages[language]["offer"];
  const dark_mode = useThemeMode();
  const global_styles = createGlobalStyles(dark_mode);
  const styles = createStyles(dark_mode);

  const [earn_money, setEarnmoney] = useState<Earn_moneyI[]>([]);
  const [user, setUser] = useState<{
    coin: number;
    credit_card: string;
    name: string;
    money_id: string;
  }>({ coin: 0, credit_card: "", name: "", money_id: "" });
  const [isFee, setIsFee] = useState(false);

  const getEarnMoney = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const { data, status } = await api.get("/api/earn_money/findall", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (status === 200) {
        setEarnmoney(data.earn_moneys);
      }
    } catch (err) {
      const error = err as Error;
      Toast.error(error.message);
    }
  };

  const getUser = async () => {
    try {
      const user = await AsyncStorage.getItem("user");
      if (user) {
        setUser({
          ...JSON.parse(user),
          name: "",
          money_id: "",
          credit_card: "",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePaid = async () => {
    if (!user.credit_card.length || !user.name.length) {
      Alert.alert("Ism familiya yoki");
    }
    try {
      const token = await AsyncStorage.getItem("token");
      const { data, status } = await api.post(
        "/api/user/create/fee",
        {
          money_id: user.money_id,
          credit_card: user.credit_card,
          name: user.name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (status === 201) {
        Toast.success("ok");
        getUser();
      }
    } catch (err) {
      const error = err as AxiosError;
      if (error.status === 400) {
        Toast.error(MainLanguage["coin"]["not_enough_money"]);
      } else {
        Toast.error(error.message);
      }
    } finally {
      setIsFee(false);
    }
  };

  useEffect(() => {
    getEarnMoney();
  }, []);

  useEffect(() => {
    getUser();
  }, [handlePaid]);

  return (
    <ScrollView>
      <View style={global_styles.container}>
        <View style={styles.container_header}>
          <TouchableOpacity
            style={{ alignItems: "center", flexDirection: "row", gap: 6 }}
            onPress={() => router.push({ pathname: "/(tabs)/bonus" })}
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
        <View style={styles.earn_money_cont}>
          {earn_money.map((i, index) => {
            return (
              <View key={index}>
                <View style={styles.earn_money}>
                  <Text style={styles.earn_money_title}>
                    {i.coin} x {i.price}
                  </Text>
                  <TouchableOpacity
                    style={styles.earn_money_btn}
                    onPress={() => {
                      setUser((prev) => ({ ...prev, money_id: i._id }));
                      setIsFee(true);
                    }}
                  >
                    <Text style={styles.earn_money_btn_text}>Get</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.line}></View>
              </View>
            );
          })}
        </View>
        <View style={styles.ads}>
          <Text style={styles.ads_text}>ADS</Text>
        </View>
      </View>
      <Modal
        visible={isFee}
        animationType="fade"
        transparent={true}
        onRequestClose={() => {
          setIsFee(false);
        }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modal_title}>
              {Languages[language]["modals"]["earn_money"]["title"]}
            </Text>
            <Text style={styles.modal_description}>
              {Languages[language]["modals"]["earn_money"]["description"]}
            </Text>
            <TextInput
              value={user.credit_card}
              onChangeText={(e) =>
                setUser((prev) => ({ ...prev, credit_card: e }))
              }
              placeholder={
                Languages[language]["modals"]["earn_money"]["credit_card_input"]
              }
              style={styles.modal_input}
            />
            <TextInput
              value={user.name}
              onChangeText={(e) => setUser((prev) => ({ ...prev, name: e }))}
              placeholder={
                Languages[language]["modals"]["earn_money"]["name_input"]
              }
              style={styles.modal_input}
            />
            <View style={styles.modal_btns}>
              <TouchableOpacity
                style={styles.modal_btn_no}
                onPress={() => {
                  setIsFee(false);
                }}
              >
                <Text style={styles.modal_btn_no_text}>
                  {Languages[language]["modals"]["no"]}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modal_btn_yes}
                onPress={() => {
                  handlePaid();
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
    earn_money_cont: {
      marginTop: 27,
      width: "100%",
      minHeight: 200,
      backgroundColor: COLOR.black1,
      borderRadius: 10,
    },
    earn_money: {
      alignItems: "center",
      justifyContent: "space-between",
      flexDirection: "row",
      paddingLeft: 12,
      paddingRight: 12,
      paddingTop: 8,
      paddingBottom: 8,
    },
    earn_money_title: {
      fontSize: 14,
      color: COLOR.white,
      fontWeight: 400,
    },
    earn_money_btn: {
      width: 41,
      height: 18,
      backgroundColor: COLOR.gray3,
      borderRadius: 5,
      alignItems: "center",
      justifyContent: "center",
    },
    earn_money_btn_text: {
      color: COLOR.dark_color,
      fontSize: 10,
      fontWeight: 400,
    },
    line: {
      width: "100%",
      height: 1,
      backgroundColor: COLOR.white,
    },
    ads: {
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLOR.gray3,
      marginTop: 22,
      borderRadius: 10,
      marginBottom: 22,
      padding: 10,
    },
    ads_text: {
      fontSize: 24,
      color: COLOR.black1,
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
      width: 226,
      textAlign: "center",
    },
    modalBackground: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: dark_mode ? COLOR.black1 : COLOR.white2,
    },
    modalContent: {
      width: "80%",
      padding: 8,
      backgroundColor: "white",
      borderRadius: 10,
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
      textAlign: "center",
      fontWeight: "bold",
    },
    modal_description: {
      fontSize: 12,
      color: COLOR.gray6,
      textAlign: "center",
      marginTop: 7,
    },
    modal_input: {
      width: "100%",
      height: 36,
      backgroundColor: COLOR.gray3,
      padding: 11,
      borderRadius: 5,
      marginTop: 12,
    },
  });
