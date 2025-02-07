const sql = require('better-sqlite3');
const db = sql('ranking.db');

const dummyRankings=[
    {
        playerName:'jakisgracz',
        score:100,
        difficulty:'one-color',
        timeSpent:189
    },
    {
        playerName:'KamilSlimak',
        score:89,
        difficulty:'four-color',
        timeSpent:300
    },
    {
        playerName:'GotardMadzimski',
        score:120,
        difficulty:'two-color',
        timeSpent:242
    }
]

db.prepare(`
    CREATE TABLE IF NOT EXISTS ranking (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        playerName TEXT NOT NULL,
        score INTEGER NOT NULL,
        difficulty TEXT NOT NULL,
        timeSpent INTEGER NOT NULL,
        date TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
     )
 `).run();

async function initData() {
    const stmt = db.prepare(`
        INSERT INTO ranking (playerName, score, difficulty, timeSpent) VALUES (
           @playerName,
           @score,
           @difficulty,
           @timeSpent
        )
     `);
  
    for (const ranking of dummyRankings) {
      stmt.run(ranking);
    }
}
  
initData();