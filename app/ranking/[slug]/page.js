import { getGamesByPlayer } from '@/lib/rankings';

export default async function PlayerRanking({ params }) {
    const { slug } = await params;
    const games = await getGamesByPlayer(slug);

    if (games.length === 0) {
        return (
            <main className="min-h-screen  flex flex-col items-center justify-center px-4 py-8">
                <h1 className="text-4xl font-semibold text-center text-red-500 mb-4">
                    Nie znaleziono gracza: {slug}
                </h1>
                <p className="text-gray-600 text-lg">Brak zapisanych wyników dla tego gracza.</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
          <h1 className="text-4xl font-semibold text-center text-blue-600 mb-4">
            Wyniki gracza: {slug}
          </h1>
          <div className="w-full max-w-2xl">
                <table className="w-full border-collapse border border-gray-300 bg-white shadow-lg rounded-lg">
                    <thead>
                        <tr className="bg-blue-500 text-white">
                            <th className="p-3 border border-gray-300">Wynik</th>
                            <th className="p-3 border border-gray-300">Poziom</th>
                            <th className="p-3 border border-gray-300">Czas</th>
                            <th className="p-3 border border-gray-300">Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        {games.map((game, index) => (
                            <tr key={index} className="text-center border border-gray-300">
                                <td className="p-3 border border-gray-300 font-bold text-green-600">{game.score}</td>
                                <td className="p-3 border border-gray-300 text-gray-700">{game.difficulty}</td>
                                <td className="p-3 border border-gray-300 text-gray-700">{game.timeSpent}s</td>
                                <td className="p-3 border border-gray-300 text-gray-600">{new Date(game.date).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
