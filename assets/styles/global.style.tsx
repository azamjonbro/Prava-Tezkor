import { COLOR } from "@/constants/color.constant";
import { Dimensions, StyleSheet } from "react-native";

export const createGlobalStyles = (dark_mode: boolean) =>
  StyleSheet.create({
    container: {
      backgroundColor: dark_mode ? COLOR.dark : COLOR.white,
      flex: 1,
      height: Dimensions.get("window").height,
      paddingTop: 35,
      paddingLeft: 12,
      paddingRight: 12,
      paddingBottom: 35,
    },
    container2: {
      backgroundColor: dark_mode ? COLOR.dark : COLOR.white,
      flex: 1,
      paddingTop: 35,
    },
  });
