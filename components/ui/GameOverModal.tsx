import { StyleSheet, Modal, View, Text, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { AppTheme } from "../../constants/theme";

// Props que recibe el modal
type Props = {
    visible: boolean;
    result: "X" | "O" | "DRAW" | null;
    time: number;
    theme: AppTheme;
    onPlayAgain: () => void;
    onGoToIndex: () => void;
};

export default function GameOverModal({ visible, result, time, theme, onPlayAgain, onGoToIndex }: Props) {
    // Traducciones
    const { t } = useTranslation();
    // Estilos
    const styles = createStyles(theme);

    // Obtener el título del modal según el resultado
    const title = result === "DRAW" ? t("game.draw") : result === "X" ? t("game.win") : t("game.lose");

    return (
        <Modal visible={visible} animationType="fade" transparent>
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <Text style={styles.title}>{title}</Text>

                    <Text style={styles.timeText}>{t("game.time")} {time} {t("game.seconds")}</Text>

                    <TouchableOpacity style={styles.button} onPress={onPlayAgain} activeOpacity={0.8}>
                        <Text style={styles.buttonText}>{t("common.playAgain")}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={onGoToIndex} activeOpacity={0.8}>
                        <Text style={styles.buttonText}>{t("common.goToIndex")}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const createStyles = (theme: AppTheme) =>
    StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.6)",
            justifyContent: "center",
            alignItems: "center",
            padding: 16,
        },

        modal: {
            backgroundColor: theme.colors.card,
            padding: 20,
            borderRadius: 14,
            width: 280,
            gap: 10,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },

        title: {
            color: theme.colors.text,
            fontSize: 18,
            textAlign: "center",
            marginBottom: 10,
        },

        timeText: {
            color: theme.colors.text,
            fontSize: 16,
            textAlign: "center",
            marginBottom: 10,
        },

        button: {
            backgroundColor: theme.colors.primary,
            padding: 12,
            borderRadius: 10,
            alignItems: "center",
        },

        buttonText: {
            color: "#fff",
            fontWeight: "bold",
        },
    });