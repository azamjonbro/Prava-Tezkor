import TabScreen from "@/components/screens/Tab.screen";
import { store } from "@/store/store";
import { SafeAreaView } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import ToastManager, { Toast } from "toastify-react-native";

export default function RootLayout() {
  return (
    <>
      <SafeAreaView style={{flex:1}}>
        <Provider store={store}>
          <TabScreen />
        </Provider>
          <ToastManager />
      </SafeAreaView>
    </>
  );
}
