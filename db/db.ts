import * as SQLite from "expo-sqlite";

// Crear la base de datos
export const db = SQLite.openDatabaseSync("game-xoox.db");

// Crear la tabla para las puntuaciones si no existe
export function startDB() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      time INTEGER NOT NULL
    );
  `);
}

// Guardar la puntuación en la base de datos
export function insertScore(name: string, difficulty: string, time: number) {
  db.runSync(
    "INSERT INTO scores (name, difficulty, time) VALUES (?, ?, ?);",
    name,
    difficulty,
    time,
  );
}

// Obtener las mejores puntuaciones de la base de datos
export function getScores(limit: 5) {
  return db.getAllSync<{
    id: number;
    name: string;
    difficulty: string;
    time: number;
  }>("SELECT * FROM scores ORDER BY time ASC LIMIT ?;", limit);
}