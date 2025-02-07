'use client'

import SolitaireGame from '../components/game/SolitaireGame';
import { saveScoreDatabase } from '../actions';

function saveScore(score, timeSpent, userName, difficulty) {
  console.log('Zapisane:', { score, timeSpent, userName, difficulty });
  saveScoreDatabase(score,timeSpent,userName,difficulty);
}

export default function Gra() {
  const user = { name: 'bezimieny' };

  return (
    <div>
      <SolitaireGame saveScore={saveScore} user={user} />
    </div>
  );
}
