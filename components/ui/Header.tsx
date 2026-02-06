import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { Moon, Sun } from "lucide-react-native";
import { useAppTheme } from "../../hooks/useTheme";
import { AppTheme } from "../../constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Header() {
    // Traducciones
    const { t, i18n } = useTranslation();
    // Tema
    const { themeName, toggleTheme, theme } = useAppTheme();
    const styles = createStyles(theme);

    // Cambiar idioma
    const toggleLanguage = () => {
        i18n.changeLanguage(i18n.language === "es" ? "en" : "es");
    };

    return (
        <SafeAreaView style={styles.header}>
            <View style={styles.container}>
                <View style={styles.left}>
                    <Text style={styles.title}>{t("common.title")}</Text>
                </View>

                <View style={styles.right}>
                    <TouchableOpacity style={styles.themeButton} activeOpacity={0.8} onPress={toggleTheme}>
                        {themeName === "dark" ? (
                            <Moon size={20} color={theme.colors.text} />
                        ) : (
                            <Sun size={20} color={theme.colors.text} />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.langButton}
                        activeOpacity={0.8}
                        onPress={toggleLanguage}
                    >
                        <Text style={styles.langText}>
                            {i18n.language === "es" ? "ES" : "EN"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const createStyles = (theme: AppTheme) =>
    StyleSheet.create({
        header: {
            backgroundColor: theme.colors.bg,
        },

        container: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingTop: 0,
            paddingBottom: 12,
            borderBottomWidth: 1,
            borderColor: theme.colors.border,
        },

        left: {
            flexDirection: "row",
            alignItems: "center",
        },

        right: {
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
        },

        title: {
            fontSize: 18,
            fontWeight: "bold",
            color: theme.colors.text,
        },

        themeButton: {
            padding: 8,
            backgroundColor: theme.colors.card,
            borderRadius: 8,
        },

        langButton: {
            paddingHorizontal: 12,
            paddingVertical: 8,
            backgroundColor: theme.colors.card,
            borderRadius: 8,
            justifyContent: "center",
            alignItems: "center",
        },

        langText: {
            color: theme.colors.text,
            fontWeight: "bold",
        },
    });