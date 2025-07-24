import SplashScreen from "@/components/screens/Splash.screen";
import TabScreen from "@/components/screens/Tab.screen";
import { GetProfile, SignUp } from "@/services/user";
import { store } from "@/store/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import ToastManager, { Toast } from "toastify-react-native";

export default function RootLayout() {
  const [opensplash, setOpenSplash] = useState(false);

  useEffect(() => {
    let time = setTimeout(() => {
      setOpenSplash(false);
    }, 3000);

    return () => clearTimeout(time);
  }, []);

  useEffect(() => {
    const SubmitTheToken = async () => {
      try {
        let token = await AsyncStorage.getItem("token");

        if (!token) {
          const res = await SignUp();
          if (res?.status === 201) {
            token = res.data.token;
            await AsyncStorage.setItem("token", token ? token : "");
            Toast.success("Signup successful");
          }
        } else {
          const res = await GetProfile(token);
          if (res?.status !== 200) {
            await AsyncStorage.clear();
          }
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          Toast.error(error.response?.data?.message || error.message);
        } else {
          Toast.error("Unexpected error occurred.");
        }
      }
    };

    SubmitTheToken();
  }, []);

  return (
    <>
      <Provider store={store}>
        {opensplash ? <SplashScreen /> : <TabScreen />}
        <ToastManager />
      </Provider>
    </>
  );
}
