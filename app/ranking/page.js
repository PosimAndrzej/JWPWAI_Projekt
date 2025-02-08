'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getRankingsAll } from '../actions';
import Link from 'next/link';

export default function Ranking() {
    const router = useRouter();
    const [rankings, setRankings] = useState([]);

    // Funkcja, która ładuje dane z bazy
    const fetchRankings = async () => {
        const data = await getRankingsAll();
        setRankings(data);
    };

    useEffect(() => {
        fetchRankings(); // Załadowanie danych zaraz po zamontowaniu komponentu
    }, []);

    // Funkcja obsługująca wyszukiwanie
    const handleSearch = (e) => {
        e.preventDefault();
        const playerName = e.target.playerName.value.trim();
        if (playerName) {
            router.push(`/ranking/${playerName}`); // Przekierowanie na stronę gracza
        }
    };

    return (
        <main className="min-h-screen  flex flex-col items-center justify-center px-4 py-8">
            <h1 className="text-4xl font-semibold text-center text-blue-600 mb-4">Ranking</h1>

            <form className="mb-4 flex gap-2" onSubmit={handleSearch}>
                <input
                    type="text"
                    name="playerName"
                    placeholder="Wpisz nazwę gracza..."
                    className="p-2 border border-gray-300 rounded-lg text-gray-700"
                />
                <button type="submit" className="p-2 bg-blue-500 text-white rounded-lg">
                    Szukaj
                </button>
            </form>

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
                                <td className="p-3 border border-gray-300 text-gray-800 font-semibold">
                                    <Link href={`/ranking/${ranking.playerName}`} className="text-blue-500 hover:underline">
                                        {ranking.playerName}
                                    </Link> 
                                </td>
                                <td className="p-3 border border-gray-300 font-bold text-green-600">
                                    {ranking.score}
                                </td>
                                <td className="p-3 border border-gray-300 text-gray-700">
                                    {ranking.difficulty}
                                </td>
                                <td className="p-3 border border-gray-300 text-gray-700">
                                    {ranking.timeSpent}s
                                </td>
                                <td className="p-3 border border-gray-300 text-gray-600">
                                    {new Date(ranking.date).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
