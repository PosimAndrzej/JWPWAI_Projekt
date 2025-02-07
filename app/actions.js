'use server';

import { addRanking } from '@/lib/rankings';

export async function saveScoreDatabase(score, timeSpent, userName, difficulty) {
    addRanking(userName, score, difficulty, timeSpent);
}
