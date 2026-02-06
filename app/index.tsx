import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import { useAppTheme } from "../hooks/useTheme";
import { AppTheme } from "../constants/theme";
import Header from "../components/ui/Header";

export default function Index() {
  // Traducciones
  const { t } = useTranslation();
  // Navegación
  const router = useRouter();

  // Nombre del jugador
  const [name, setName] = useState("");
  // Deshabilitar los botones de jugar si el nombre está vacío
  const playDisabled = name.trim().length === 0;

  // Tema
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.app}>
      <Header />

      <Image
        source={require("../assets/images/logo.png")}
        style={styles.logoImage}
        resizeMode="contain"
      />

      <View style={styles.container}>
        <Text style={styles.title}>{t("home.label")}</Text>
        <TextInput
          style={styles.input}
          placeholder={t("home.namePlaceholder")}
          placeholderTextColor={theme.colors.text + "80"}
          value={name}
          onChangeText={setName}
        />

        <TouchableOpacity
          style={[styles.button, playDisabled && styles.buttonDisabled]}
          disabled={playDisabled}
          activeOpacity={0.8}
          onPress={() =>
            router.push({
              pathname: "/game",
              params: { name: name, difficulty: "easy" },
            })
          }
        >
          <Text style={styles.buttonText}>{t("home.startEasy")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, playDisabled && styles.buttonDisabled]}
          disabled={playDisabled}
          activeOpacity={0.8}
          onPress={() =>
            router.push({
              pathname: "/game",
              params: { name: name, difficulty: "hard" },
            })
          }
        >
          <Text style={styles.buttonText}>{t("home.startHard")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={() => router.navigate("/ranking")}
        >
          <Text style={styles.buttonText}>{t("home.ranking")}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    app: {
      flex: 1,
      backgroundColor: theme.colors.bg,
    },

    container: {
      flex: 1,
      padding: 20,
      gap: 12,
    },

    logoImage: {
      width: "100%",
      height: 230,
      marginBottom: 10,
    },

    title: {
      fontSize: 15,
      fontWeight: "bold",
      color: theme.colors.text,
    },

    input: {
      backgroundColor: theme.colors.card,
      color: theme.colors.text,
      padding: 12,
      borderRadius: 10,
      marginBottom: 10,
    },

    button: {
      backgroundColor: theme.colors.primary,
      padding: 14,
      borderRadius: 10,
      alignItems: "center",
    },

    buttonDisabled: {
      opacity: 0.5,
    },

    buttonText: {
      color: "#fff",
      fontWeight: "bold",
    },
  });