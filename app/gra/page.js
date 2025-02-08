'use client'

import SolitaireGame from '../components/game/SolitaireGame';
import { saveScoreDatabase } from '../actions';

function saveScore(score, timeSpent, userName, difficulty) {
  saveScoreDatabase(score,timeSpent,userName,difficulty);
}

export default function Gra() {
  let user = { name: 'bezimieny' };

  return (
    <div>
      <SolitaireGame saveScore={saveScore} user={user} />
    </div>
  );
}
