'use server';


import sql from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'ranking.db');
const db = sql(dbPath);


export async function getRankings() {
    return db.prepare('SELECT * FROM ranking').all();
}

export async function addRanking(playerName, score, difficulty, timeSpent) {
    const stmt = db.prepare(`
        INSERT INTO ranking (playerName, score, difficulty, timeSpent) 
        VALUES (@playerName, @score, @difficulty, @timeSpent)
    `);
    stmt.run({ playerName, score, difficulty, timeSpent });
}

export async function getGamesByPlayer(playerName) {
    return db.prepare('SELECT * FROM ranking WHERE playerName = ?').all(playerName);
}