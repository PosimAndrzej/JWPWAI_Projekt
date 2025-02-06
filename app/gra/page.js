'use client'

import SolitaireGame from '../components/game/SolitaireGame';


function saveScore(score, timeSpent, userName, difficulty) {
  console.log('Zapidsne:', { score, timeSpent, userName, difficulty });
}

export default function Gra() {
  const user = { name: 'bezimieny' };

  return (
    <div>
      <SolitaireGame saveScore={saveScore} user={user} />
    </div>
  );
}
