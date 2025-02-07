const sql = require('better-sqlite3');
const db = sql('ranking.db');

export async function getRankings() {
    return db.prepare('SELECT * FROM ranking').all();
}