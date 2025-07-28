import { createGlobalStyles } from "@/assets/styles/global.style";
import {
  FolderCrossIcon,
  NavigationArrowLeftIcon,
  SaveIcon,
  ShareIcon,
  UserIcon,
} from "@/assets/svgs/icon";
import { COLOR } from "@/constants/color.constant";
import { Languages } from "@/language";
import { api } from "@/services/api";
import { useLanguage, useThemeMode } from "@/store/selectors";
import { LanguageType } from "@/store/slices/language.slice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import {
  Clipboard,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Toast } from "toastify-react-native";

export interface UserList {
  toUser: number;
}

export default function Offer() {
  const [tab, setTab] = useState<"tab1" | "tab2">("tab1");
  const [add_input, setAddInput] = useState("");
  const [inviteInput, setInviteInput] = useState<string>("321678321783421");
  const [users, setUsers] = useState<UserList[]>([]);

  const navigation = useNavigation();

  const language = useLanguage();

  const Mainlanguage = Languages[language as LanguageType]["offer"];

  const handleCopy = () => {
    Clipboard.setString(inviteInput);
  };

  const handleShare = async () => {
    await Share.share({ title: "Share to your friends", message: inviteInput });
  };

  const dark_mode = useThemeMode();
  const global_styles = createGlobalStyles(dark_mode);

  useEffect(() => {
    const getInviteCode = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const { data, status } = await api.get("/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (status === 200) {
          setInviteInput(data.user.invite_code);
        }
      } catch (err) {
        const error = err as Error;
        Toast.error(error.message);
      }
    };
    getInviteCode();
  }, []);

  useEffect(() => {
    const getInviteUsers = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const { data, status } = await api.get("/api/user/invited_users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (status === 200) {
          setUsers(data.invited_users);
        }
      } catch (err) {
        const error = err as Error;
        Toast.error(error.message);
      }
    };
    getInviteUsers();
  }, []);

  const handleAddInvitation = async () => {
    if (add_input === "") {
      Toast.warn(Mainlanguage["input_placeholder"]);
    } else {
      Toast.info("Loading..");
      try {
        const token = await AsyncStorage.getItem("token");
        const { status } = await api.post(
          "/api/invited_user/create",
          {
            toUser: add_input,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (status === 201) {
          Toast.success("Xabar keti");
        }
      } catch (err) {
        const error = err as Error;
        Toast.error(error.message);
      }
    }
  };

  const styles = createStyles(dark_mode);

  return (
    <ScrollView>
      <View style={global_styles.container}>
        <View style={styles.container_header}>
          <TouchableOpacity
            style={{ alignItems: "center", flexDirection: "row", gap: 6 }}
            onPress={() => navigation.goBack()}
          >
            <NavigationArrowLeftIcon
              color={dark_mode ? "#fff" : COLOR.black1}
            />
            <Text style={styles.navigation_title}>{Mainlanguage["title"]}</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 18,
            gap: 16,
          }}
        >
          <TouchableOpacity
            style={{
              ...styles.btn,
              backgroundColor: tab == "tab1" ? "white" : COLOR.black1,
            }}
            onPress={() => setTab("tab1")}
          >
            <Text
              style={{
                color: tab == "tab1" ? COLOR.black1 : "white",
                fontSize: 16,
              }}
            >
              {Mainlanguage["tab1"]}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              ...styles.btn,
              backgroundColor: tab == "tab2" ? "white" : COLOR.black1,
            }}
            onPress={() => setTab("tab2")}
          >
            <Text
              style={{
                color: tab == "tab2" ? COLOR.black1 : "white",
                fontSize: 16,
              }}
            >
              {Mainlanguage["tab2"]}
            </Text>
          </TouchableOpacity>
        </View>
        {tab === "tab2" ? (
          <View style={styles.invitetion}>
            <Text style={styles.invitetion_title}>
              {Mainlanguage["tab2_description"]}
            </Text>
            <View style={styles.invitetion_form}>
              <TextInput
                value={add_input}
                onChangeText={setAddInput}
                placeholder={Mainlanguage["input_placeholder"]}
                style={styles.invitetion_form_input}
                placeholderTextColor={COLOR.white}
              />
              <TouchableOpacity
                style={styles.invitetion_form_btn}
                onPress={handleAddInvitation}
              >
                <Text style={styles.invitetion_form_btn_text}>
                  {Mainlanguage["send"]}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
        {tab == "tab1" ? (
          <>
            <View style={styles.invitetion}>
              <Text style={styles.invitetion_title}>
                {Mainlanguage["tab1_description"]}
              </Text>
              <View style={styles.invitetion_form}>
                <TextInput
                  value={inviteInput}
                  onChangeText={setInviteInput}
                  placeholder={Mainlanguage["input_placeholder"]}
                  style={styles.invitetion_form_input}
                  placeholderTextColor={COLOR.white}
                />
                <View style={styles.invitetion_form_btns}>
                  <TouchableOpacity
                    style={{ ...styles.invitetion_form_btn, padding: 5 }}
                    onPress={handleCopy}
                  >
                    <SaveIcon color="#D0D0D0" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ ...styles.invitetion_form_btn, padding: 5 }}
                    onPress={handleShare}
                  >
                    <ShareIcon color="#D0D0D0" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles.list_of_invitation_users}>
              <Text style={styles.list_of_invitation_users_title}>
                {Mainlanguage["invited_users"]}
              </Text>
              <View style={styles.list_of_invitation_line}></View>
              {users.length > 0 ? (
                users.map((i, index) => {
                  return (
                    <View key={index}>
                      <View style={styles.list_of_user}>
                        <UserIcon color="#D0D0D0" />
                        <Text style={styles.list_of_user_id}>{i.toUser}</Text>
                      </View>
                      <View style={styles.list_of_invitation_line}></View>
                    </View>
                  );
                })
              ) : (
                <>
                  <View style={styles.not_found_cont}>
                    <FolderCrossIcon color="white" />
                    <Text style={styles.not_found_cont_title}>
                      {Mainlanguage["not_found"]}
                    </Text>
                  </View>
                </>
              )}
            </View>
          </>
        ) : null}
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
    btn: {
      width: "45%",
      height: 62,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
    },
    invitetion: {
      width: "100%",
      height: 172,
      backgroundColor: COLOR.black1,
      marginTop: 18,
      borderRadius: 10,
      paddingTop: 20,
      paddingBottom: 20,
      paddingLeft: 20,
      paddingRight: 20,
    },
    invitetion_title: {
      fontSize: 14,
      color: COLOR.white,
      textAlign: "center",
      fontWeight: 500,
    },
    invitetion_form: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 50,
    },
    invitetion_form_input: {
      width: "60%",
      height: 38,
      backgroundColor: COLOR.gray5,
      paddingLeft: 12,
      borderRadius: 5,
      color: COLOR.white,
    },
    invitetion_form_btns: {
      flexDirection: "row",
      alignItems: "center",
      marginLeft: 15,
      gap: 5,
    },
    invitetion_form_btn: {
      paddingStart: 15,
      paddingEnd: 15,
      height: 38,
      borderRadius: 5,
      backgroundColor: COLOR.gray5,
      alignItems: "center",
      justifyContent: "center",
    },
    invitetion_form_btn_text: {
      fontSize: 14,
      fontWeight: 500,
      color: COLOR.white,
    },
    list_of_invitation_users: {
      marginTop: 18,
      width: "100%",
      height: "50%",
      backgroundColor: COLOR.black1,
      borderRadius: 10,
    },
    list_of_invitation_users_title: {
      color: COLOR.white,
      fontWeight: 400,
      marginTop: 10,
      marginLeft: 18,
      marginBottom: 10,
    },
    list_of_invitation_line: {
      width: "100%",
      height: 1,
      backgroundColor: COLOR.white3,
    },
    list_of_user: {
      alignItems: "center",
      flexDirection: "row",
      marginTop: 6,
      marginBottom: 6,
      marginLeft: 8,
    },
    list_of_user_id: {
      marginLeft: 12,
      fontSize: 14,
      color: COLOR.white,
      fontWeight: 400,
    },
    not_found_cont: {
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      marginTop: 16,
      gap: 16,
    },
    not_found_cont_title: {
      fontSize: 14,
      fontWeight: 400,
      color: COLOR.white,
    },
  });
