import { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAppTheme } from "../hooks/useTheme";
import { AppTheme } from "../constants/theme";
import { getScores } from "../db/db";
import Header from "../components/ui/Header";


export default function Ranking() {
  // Traducciones
  const { t } = useTranslation();
  // Navegación
  const router = useRouter();

  // Tema
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  // Lista de puntuaciones
  const [scores, setScores] = useState<any[]>([]);

  // Cargar solo las 5 mejores puntuaciones
  useEffect(() => {
    setScores(getScores(5));
  }, []);

  // Posiciones para el ranking
  const position1 = scores[0];
  const position2 = scores[1];
  const position3 = scores[2];
  const position4 = scores[3];
  const position5 = scores[4];

  return (
    <SafeAreaView style={styles.app}>
      <Header />

      <View style={styles.container}>
        <Text style={styles.title}>{t("ranking.title")}</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.position}>#1</Text>
            <Text style={styles.name}>{position1?.name ?? "—"}</Text>
            <Text style={styles.time}>{position1 ? `${position1.time}seg` : "--"}</Text>
          </View>

          <View style={styles.line} />

          <View style={styles.row}>
            <Text style={styles.position}>#2</Text>
            <Text style={styles.name}>{position2?.name ?? "—"}</Text>
            <Text style={styles.time}>{position2 ? `${position2.time}seg` : "--"}</Text>
          </View>

          <View style={styles.line} />

          <View style={styles.row}>
            <Text style={styles.position}>#3</Text>
            <Text style={styles.name}>{position3?.name ?? "—"}</Text>
            <Text style={styles.time}>{position3 ? `${position3.time}seg` : "--"}</Text>
          </View>

          <View style={styles.line} />

          <View style={styles.row}>
            <Text style={styles.position}>#4</Text>
            <Text style={styles.name}>{position4?.name ?? "—"}</Text>
            <Text style={styles.time}>{position4 ? `${position4.time}seg` : "--"}</Text>
          </View>

          <View style={styles.line} />

          <View style={styles.row}>
            <Text style={styles.position}>#5</Text>
            <Text style={styles.name}>{position5?.name ?? "—"}</Text>
            <Text style={styles.time}>{position5 ? `${position5.time}seg` : "--"}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.back()}
          activeOpacity={0.80}
        >
          <Text style={styles.buttonText}>{t("ranking.goToIndex")}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    app: {
      flex: 1,
      backgroundColor: theme.colors.bg
    },

    container: {
      flex: 1,
      padding: 20,
      gap: 12,
    },

    title: {
      color: theme.colors.text,
      fontSize: 22,
      fontWeight: "bold"
    },

    card: {
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      overflow: "hidden",
    },

    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 12,
      gap: 12,
    },

    position: {
      width: 40,
      textAlign: "center",
      color: theme.colors.text,
      fontWeight: "bold",
    },

    name: {
      flex: 1,
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: "bold",
    },

    time: {
      width: 60,
      textAlign: "right",
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: "bold",
    },

    line: {
      height: 1,
      backgroundColor: theme.colors.border,
      opacity: 0.6
    },

    button: {
      backgroundColor: theme.colors.primary,
      padding: 14,
      borderRadius: 10,
      alignItems: "center",
      alignSelf: "center",
    },

    buttonText: {
      color: "#fff",
      fontWeight: "bold",
    }
  });