const sql = require('better-sqlite3');
const db = sql('ranking.db');

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
