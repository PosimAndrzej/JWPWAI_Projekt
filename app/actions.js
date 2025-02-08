'use server';

import { addRanking, getRankings } from '@/lib/rankings';

export async function saveScoreDatabase(score, timeSpent, userName, difficulty) {
    addRanking(userName, score, difficulty, timeSpent);
}

export async function getRankingsAll(){
    return await getRankings();
}