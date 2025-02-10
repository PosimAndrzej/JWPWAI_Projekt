'use server'

const sql = require('better-sqlite3');
import path from 'path';
const fs = require('fs');

const dbPath = path.resolve(process.cwd(), 'ranking.db');
const db = sql(dbPath);

try {
    // Sprawdź, czy plik bazy danych istnieje i ma odpowiednie uprawnienia
    fs.accessSync(dbPath, fs.constants.R_OK | fs.constants.W_OK);
    console.log('Plik bazy danych jest dostępny do odczytu i zapisu');
} catch (err) {
    console.error('Brak dostępu do pliku bazy danych:', err);
}

export async function getRankings() {
    return db.prepare('SELECT * FROM ranking').all();
}

export function addRanking(playerName, score, difficulty, timeSpent) {
    const stmt = db.prepare(`
        INSERT INTO ranking (playerName, score, difficulty, timeSpent) 
        VALUES (@playerName, @score, @difficulty, @timeSpent)
    `);
    stmt.run({ playerName, score, difficulty, timeSpent });
}

export async function getGamesByPlayer(playerName) {
    return db.prepare('SELECT * FROM ranking WHERE playerName = ?').all(playerName);
}