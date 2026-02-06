import { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAppTheme } from "../hooks/useTheme";
import { AppTheme } from "../constants/theme";
import { insertScore } from "../db/db";
import Header from "../components/ui/Header";
import GameOverModal from "../components/ui/GameOverModal";

// Las celdas pueden estar vacías, o ser "X" o "O"
type Cell = "X" | "O" | null;

export default function GameScreen() {
  // Traducciones
  const { t } = useTranslation();
  // Navegación
  const router = useRouter();

  // Tema
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  // Obtener el nombre y la dificultad en la que se quiere jugar
  const { name, difficulty } = useLocalSearchParams<{
    name: string;
    difficulty: "easy" | "hard";
  }>();

  // Tablero de 3x3
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  // Turno actual: jugador (X) o IA (O)
  const [turn, setTurn] = useState<"PLAYER" | "AI">("PLAYER");
  // Resultado de la partida
  const [result, setResult] = useState<"X" | "O" | "DRAW" | null>(null);

  // Tiempo de la partida
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(true);

  // Temporizador de la partida
  useEffect(() => {
    if (!timerActive) return;

    const interval = setInterval(() => {
      setTime((time) => time + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive]);

  // Comprobar si hay un ganador
  const checkWinner = (board: Cell[]) => {
    // Todas las combinaciones ganadoras
    const winPatterns = [
      // Filas
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      // Columnas
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      // Diagonales
      [0, 4, 8],
      [2, 4, 6],
    ];

    // Comprobar si hay un ganador
    for (const pattern of winPatterns) {
      const [first, second, third] = pattern;
      // Si las tres celdas son iguales y no están vacías, hay un ganador
      if (board[first] && board[first] === board[second] && board[first] === board[third]) {
        return board[first];
      }
    }

    // Si todas las celdas están ocupadas, hay un empate
    let isDraw = true;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        isDraw = false;
        break;
      }
    }
    if (isDraw) return "DRAW";

    return null; // No hay ganador todavía
  };

  // Modo de juego fácil
  const easyMode = (board: Cell[]) => {
    // Lista de celdas libres
    const empty: number[] = [];

    // Guardar todas las celdas que estén libres
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) empty.push(i);
    }

    // Ocupar una celda libre aleatoria
    return empty[Math.floor(Math.random() * empty.length)];
  };

  // Modo de juego difícil - elige la mejor jugada posible
  const hardMode = (board: Cell[]) => {
    // Mejor puntuación posible
    let bestScore = -Infinity;
    // Índice de la celda con la mejor jugada
    let bestMove = 0;

    // Recorrer todas las celdas
    for (let i = 0; i < 9; i++) {
      // Si la celda está libre
      if (board[i] === null) {
        // Probar la jugada de la IA en esa celda
        board[i] = "O";
        // Obtener la puntuación de la jugada
        const score = minimax(board, false);
        // Deshacer la jugada
        board[i] = null;

        // Si la puntuación es mejor que la anterior la usamos
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }

    // Ocupar la celda con la mejor jugada posible
    return bestMove;
  };

  // Minimax para el modo difícil
  const minimax = (board: Cell[], isMax: boolean): number => {
    // Comprobar si hay un ganador o empate
    const result = checkWinner(board);

    if (result === "O") return 10; // Si gana la IA
    if (result === "X") return -10; // Si gana el jugador
    if (result === "DRAW") return 0; // Si hay empate

    if (isMax) {
      // Si es el turno de la IA
      let bestScore = -Infinity;

      // Recorremos todas las celdas
      for (let i = 0; i < 9; i++) {
        // Si la celda está libre
        if (board[i] === null) {
          // Hacemos la jugada
          board[i] = "O";
          // Comprobar la puntuación
          bestScore = Math.max(bestScore, minimax(board, false));
          // Deshacer la jugada
          board[i] = null;
        }
      }
      return bestScore;
    } else {
      // Si es el turno del jugador
      let bestScore = Infinity;

      // Recorremos todas las celdas 
      for (let i = 0; i < 9; i++) {
        // Si la celda está libre
        if (board[i] === null) {
          // Hacemos la jugada
          board[i] = "X";
          // Comprobar la puntuación
          bestScore = Math.min(bestScore, minimax(board, true));
          // Deshacer la jugada
          board[i] = null;
        }
      }
      return bestScore;
    }
  };

  // Turno del jugador
  const play = (index: number) => {
    // Si hay resultado o no es su turno, no se puede jugar
    if (result || turn !== "PLAYER") return;
    // Si la celda ya está ocupada, no se puede jugar
    if (board[index] !== null) return; 

    // Hacemos una copia del tablero y ocupamos la celda con la jugada del jugador
    const copyBoard = board.slice();
    copyBoard[index] = "X";
    // Actualizamos el tablero
    setBoard(copyBoard);
    // Pasamos el turno a la IA
    setTurn("AI");
  };


  // Turno de la IA
  useEffect(() => {
    // Comprobar si hay un ganador o empate
    const winner = checkWinner(board);
    if (winner) {
      setResult(winner); // Guardar el resultado
      setTimerActive(false); // Parar el temporizador
      if (winner === "X") saveScore(); // Guardar la puntuación solo si gana el jugador
      return;
    }

    // Si no es el turno de la IA, no hacemos nada
    if (turn !== "AI") return;

    // Hacemos la jugada de la IA
    const timeoutId = setTimeout(() => {
      // Elegir como va a jugar la IA dependiendo de la dificultad
      const move = difficulty === "hard" ? hardMode(board.slice()) : easyMode(board);

      // Actualizamos el tablero con la jugada de la IA
      setBoard((currentBoard) => {
        // Si la celda ya está ocupada, no se puede jugar
        if (currentBoard[move]) return currentBoard;
        // Hacemos una copia del tablero y ocupamos la celda con la jugada de la IA
        const copyBoard = currentBoard.slice();
        copyBoard[move] = "O";
        return copyBoard;
      });

      // Pasamos el turno al jugador
      setTurn("PLAYER");
    }, 500);

    // Limpiar el temporizador
    return () => clearTimeout(timeoutId);
  }, [turn, board]);

  // Guardar puntuación si gana el jugador
  const saveScore = () => {
    // Solo guardamos en el modo fácil porque en el difícil pude ganar
    if (difficulty === "easy") insertScore(name, difficulty, time);
  };

  // Reiniciar partida
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn("PLAYER");
    setResult(null);
    setTime(0);
    setTimerActive(true);
  };

  // Mini componente para las celdas del tablero
  const CellBtn = ({ i }: { i: number }) => (
    <TouchableOpacity style={styles.cell} onPress={() => play(i)} activeOpacity={0.8}>
      <Text style={styles.cellText}>{board[i]}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.app}>
      <Header />
      <View style={styles.container}>
        <Text style={styles.text}>{t("game.name")} {name}</Text>
        <Text style={styles.text}>
          {t("game.difficulty")} {difficulty === "hard" ? t("common.hard") : t("common.easy")}
        </Text>
        <Text style={styles.text}>{t("game.timer")} {time} {t("game.seconds")}</Text>

        <View style={styles.board}>
          <View style={styles.row}>
            <CellBtn i={0} />
            <CellBtn i={1} />
            <CellBtn i={2} />
          </View>
          <View style={styles.row}>
            <CellBtn i={3} />
            <CellBtn i={4} />
            <CellBtn i={5} />
          </View>
          <View style={styles.row}>
            <CellBtn i={6} />
            <CellBtn i={7} />
            <CellBtn i={8} />
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => router.back()} activeOpacity={0.80}>
          <Text style={styles.buttonText}>{t("game.exit")}</Text>
        </TouchableOpacity>
      </View>

      <GameOverModal
        visible={result !== null}
        result={result}
        time={time}
        theme={theme}
        onPlayAgain={resetGame}
        onGoToIndex={() => router.back()}
      />

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
      alignItems: "center",
    },

    text: {
      color: theme.colors.text,
      fontSize: 18,
    },

    board: {
      marginTop: 20,
      padding: 10,
      borderRadius: 14,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: 8,
    },

    row: {
      flexDirection: "row",
      gap: 8,
    },

    cell: {
      width: 92,
      height: 92,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.bg,
    },

    cellText: {
      fontSize: 34,
      color: theme.colors.text,
      fontWeight: "bold",
    },

    button: {
      backgroundColor: theme.colors.primary,
      padding: 14,
      borderRadius: 10,
      alignItems: "center",
    },

    buttonText: {
      color: "#fff",
      fontWeight: "bold",
    }
  });