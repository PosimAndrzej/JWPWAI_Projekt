export default function Autorzy() {
    return (
      <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 py-8">
        <h1 className="text-4xl font-semibold text-center text-blue-600 mb-4">
          Autorzy:
        </h1>
        <ul className="list-disc list-inside space-y-2 max-w-md w-full bg-white p-4 rounded-lg shadow-md">
          <li className="text-lg text-gray-800">Michał Dańko 20436</li>
          <li className="text-lg text-gray-800">Filip Kłos 20453</li>
          <li className="text-lg text-gray-800">Andrzej Posim 20475</li>
        </ul>
      </main>
    );
  }
  