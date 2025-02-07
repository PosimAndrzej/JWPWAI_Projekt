import { getRankings } from '@/lib/rankings';

export default async function Ranking() {
    const rankings = await getRankings();
    return (
        <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 py-8">
          <h1 className="text-4xl font-semibold text-center text-blue-600 mb-4">
            Ranking
          </h1>
          <div className="w-full max-w-2xl">
                <table className="w-full border-collapse border border-gray-300 bg-white shadow-lg rounded-lg">
                    <thead>
                        <tr className="bg-blue-500 text-white">
                            <th className="p-3 border border-gray-300">Gracz</th>
                            <th className="p-3 border border-gray-300">Wynik</th>
                            <th className="p-3 border border-gray-300">Poziom</th>
                            <th className="p-3 border border-gray-300">Czas</th>
                            <th className="p-3 border border-gray-300">Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rankings.map((ranking, index) => (
                            <tr key={index} className="text-center border border-gray-300">
                                <td className="p-3 border border-gray-300 text-gray-800 font-semibold">{ranking.playerName}</td>
                                <td className="p-3 border border-gray-300 font-bold text-green-600">{ranking.score}</td>
                                <td className="p-3 border border-gray-300 text-gray-700">{ranking.difficulty}</td>
                                <td className="p-3 border border-gray-300 text-gray-700">{ranking.timeSpent}s</td>
                                <td className="p-3 border border-gray-300 text-gray-600">{new Date(ranking.date).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}