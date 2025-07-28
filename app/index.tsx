import { useEffect } from "react";
import { Image, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { COLOR } from "@/constants/color.constant";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("/(tabs)/home");
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require("@/assets/images/car.png")} style={styles.img} />
      <Text style={styles.title}>PRAVA TEZKOR</Text>
      <Text style={styles.little_title}>© 2025 Sardorbek</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.dark,
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  img: {
    width: 241,
    height: 100,
  },
  title: {
    color: COLOR.white,
    fontSize: 40,
    fontWeight: "400",
  },
  little_title: {
    color: COLOR.white2,
    fontSize: 14,
    position: "absolute",
    bottom: "14%",
  },
});
