'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './SolitaireGame.module.css';

// Stałe dotyczące gry
const PILES_COUNT = 10; // liczba stosów głównych (tableau)
const COMPLETE_PILES_COUNT = 8; // liczba stosów "skończonych" (foundation)
const suitsOneColor = ['♠'];
const suitsTwoColors = ['♠', '♥'];
const suitsFourColors = ['♠', '♥', '♦', '♣'];

const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const valueOrder = {
  A: 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  J: 11,
  Q: 12,
  K: 13,
};

// Ustawienia trudności w jednym obiekcie
const difficultySettings = {
  'one-color': {
    suits: suitsOneColor,
    sets: 8,
    initialScore: 100,
    completeBonus: 100,
  },
  'two-colors': {
    suits: suitsTwoColors,
    sets: 4,
    initialScore: 200,
    completeBonus: 200,
  },
  'four-colors': {
    suits: suitsFourColors,
    sets: 2,
    initialScore: 400,
    completeBonus: 400,
  },
};

// Pomocnicza funkcja do tworzenia pustych stosów
function createEmptyPiles(count) {
  return Array.from({ length: count }, () => []);
}

// Prosta funkcja głębokiego klonowania
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Generowanie talii na podstawie wybranej trudności
function generateDeck(difficultyKey) {
  const { suits, sets } = difficultySettings[difficultyKey];
  const deck = [];

  for (let i = 0; i < sets; i++) {
    for (let suit of suits) {
      for (let value of values) {
        deck.push({
          id: `${value}-${suit}-${i}`,
          suit,
          value,
          isRevealed: false,
        });
      }
    }
  }
  return deck;
}

// Tasowanie talii metodą Fisher-Yates
function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

const SolitaireGame = ({ saveScore, user }) => {
  const router = useRouter();

  // Stany gry
  const [piles, setPiles] = useState(createEmptyPiles(PILES_COUNT));
  const [drawPile, setDrawPile] = useState([]);
  const [completePiles, setCompletePiles] = useState(createEmptyPiles(COMPLETE_PILES_COUNT));
  const [startTime, setStartTime] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [selectedCard, setSelectedCard] = useState(null);
  const [moveHistory, setMoveHistory] = useState([]);
  const [score, setScore] = useState(100);
  const [difficulty, setDifficulty] = useState('one-color');
  const [isWin, setIsWin] = useState(false);
  const [winDetails, setWinDetails] = useState(null);
  const [playerName, setPlayerName] = useState(user?.name || '');

  // Inicjalizacja gry i uruchomienie timera przy zmianie trudności
  useEffect(() => {
    initializeGame(difficulty);
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [difficulty]);

  // Funkcja inicjalizująca stan gry
  const initializeGame = (difficultyKey) => {
    const settings = difficultySettings[difficultyKey];
    let newDeck = generateDeck(difficultyKey);
    shuffleDeck(newDeck);

    const newPiles = createEmptyPiles(PILES_COUNT);
    // Pierwsze 4 stosy – 6 kart, kolejne – 5 kart
    for (let i = 0; i < PILES_COUNT; i++) {
      const numCards = i < 4 ? 6 : 5;
      for (let j = 0; j < numCards; j++) {
        const card = newDeck.pop();
        if (j === numCards - 1) {
          card.isRevealed = true;
        }
        newPiles[i].push(card);
      }
    }

    setPiles(newPiles);
    setDrawPile(newDeck);
    setCompletePiles(createEmptyPiles(COMPLETE_PILES_COUNT));
    setMoveHistory([]);
    setSelectedCard(null);
    setStartTime(new Date());
    setTimeElapsed(0);
    setScore(settings.initialScore);
  };

  // Zapisuje stan gry (dla cofania)
  const saveGameState = (drawnCards = []) => {
    setMoveHistory((prevHistory) => [
      ...prevHistory,
      {
        piles: deepClone(piles),
        drawPile: deepClone(drawPile),
        completePiles: deepClone(completePiles),
        drawnCards,
      },
    ]);
  };

  // Dobieranie kart
  const handleDrawCard = () => {
    if (drawPile.length === 0) return;

    saveGameState();

    const newPiles = piles.map((pile) => [...pile]);
    const drawnCards = [];

    for (let pile of newPiles) {
      if (drawPile.length > 0) {
        const card = drawPile.pop();
        card.isRevealed = true;
        pile.push(card);
        drawnCards.push(card);
      }
    }

    setPiles(newPiles);
    setDrawPile([...drawPile]);
    setScore((prev) => prev - 1);

    setMoveHistory((prevHistory) => {
      const last = prevHistory[prevHistory.length - 1];
      return [...prevHistory.slice(0, -1), { ...last, drawnCards }];
    });
  };

  // Obsługa kliknięcia na kartę lub pusty stos
  const handleCardClick = (pileIndex, cardIndex) => {
    if (piles[pileIndex].length === 0 && selectedCard) {
      moveSequenceToEmptyPile(pileIndex);
      return;
    }

    const clickedCard = piles[pileIndex][cardIndex];
    if (!clickedCard || !clickedCard.isRevealed) return;

    if (selectedCard) {
      moveSequenceToPile(pileIndex, cardIndex);
    } else {
      setSelectedCard({ pileIndex, cardIndex });
    }
  };

  // Przenoszenie sekwencji na pusty stos
  const moveSequenceToEmptyPile = (toPileIndex) => {
    const { pileIndex: fromPileIndex, cardIndex: fromCardIndex } = selectedCard;
    const fromPile = piles[fromPileIndex];
    const movingCards = fromPile.slice(fromCardIndex);

    if (!isSequenceValid(movingCards)) {
      setSelectedCard(null);
      return;
    }

    saveGameState();

    const newPiles = piles.map((p) => [...p]);
    newPiles[toPileIndex] = [...movingCards];
    newPiles[fromPileIndex] = fromPile.slice(0, fromCardIndex);

    if (newPiles[fromPileIndex].length > 0) {
      newPiles[fromPileIndex][newPiles[fromPileIndex].length - 1].isRevealed = true;
    }

    setPiles(newPiles);
    setSelectedCard(null);
    setScore((prev) => prev - 1);

    checkAndMoveCompleteSequence(newPiles, toPileIndex);
  };

  // Przenoszenie sekwencji na stos (niepusty)
  const moveSequenceToPile = (toPileIndex, toCardIndex) => {
    const { pileIndex: fromPileIndex, cardIndex: fromCardIndex } = selectedCard;
    if (fromPileIndex === toPileIndex && fromCardIndex === toCardIndex) {
      setSelectedCard(null);
      return;
    }

    const fromPile = piles[fromPileIndex];
    const toPile = piles[toPileIndex];
    const movingCards = fromPile.slice(fromCardIndex);

    if (!isSequenceValid(movingCards)) {
      setSelectedCard(null);
      return;
    }

    const topCard = toPile[toPile.length - 1];
    const canMoveToEmptyPile = toPile.length === 0;
    const canMoveToNonEmptyPile =
      topCard &&
      valueOrder[topCard.value] === valueOrder[movingCards[0].value] + 1 &&
      (difficulty === 'one-color' ||
        (topCard.suit !== movingCards[0].suit ||
          (topCard.suit === movingCards[0].suit && areAllSameSuit(movingCards))));

    if (canMoveToEmptyPile || canMoveToNonEmptyPile) {
      saveGameState();

      const newPiles = piles.map((p) => [...p]);
      newPiles[toPileIndex] = [...toPile, ...movingCards];
      newPiles[fromPileIndex] = fromPile.slice(0, fromCardIndex);

      if (newPiles[fromPileIndex].length > 0) {
        newPiles[fromPileIndex][newPiles[fromPileIndex].length - 1].isRevealed = true;
      }

      setPiles(newPiles);
      setSelectedCard(null);
      setScore((prev) => prev - 1);

      checkAndMoveCompleteSequence(newPiles, toPileIndex);
    } else {
      setSelectedCard(null);
    }
  };

  // Pomocnicza funkcja – sprawdza, czy wszystkie karty w sekwencji mają ten sam kolor
  const areAllSameSuit = (cards) => {
    const firstSuit = cards[0].suit;
    return cards.every((card) => card.suit === firstSuit);
  };

  // Walidacja sekwencji: kolejne karty muszą być o 1 mniejsze i mieć ten sam kolor
  const isSequenceValid = (cards) => {
    for (let i = 0; i < cards.length - 1; i++) {
      if (valueOrder[cards[i].value] !== valueOrder[cards[i + 1].value] + 1) return false;
      if (cards[i].suit !== cards[i + 1].suit) return false;
    }
    return true;
  };

  // Jeśli na stosie jest 13 kart (od K do A), przenosimy je do completePiles
  const checkAndMoveCompleteSequence = (newPiles, pileIndex) => {
    const pile = newPiles[pileIndex];
    if (pile.length < 13) return;

    const last13Cards = pile.slice(-13);
    const isCompleteSequence = last13Cards.every((card, index, arr) => {
      if (index === 0) return card.value === 'K';
      return (
        valueOrder[card.value] === valueOrder[arr[index - 1].value] - 1 &&
        card.suit === arr[index - 1].suit
      );
    });

    if (isCompleteSequence) {
      const emptyCompletePileIndex = completePiles.findIndex((p) => p.length === 0);
      if (emptyCompletePileIndex !== -1) {
        const newCompletePiles = deepClone(completePiles);
        newCompletePiles[emptyCompletePileIndex] = last13Cards;

        newPiles[pileIndex] = pile.slice(0, -13);
        if (newPiles[pileIndex].length > 0) {
          newPiles[pileIndex][newPiles[pileIndex].length - 1].isRevealed = true;
        }
        
        setPiles(newPiles);
        setCompletePiles(newCompletePiles);
        const bonus = difficultySettings[difficulty].completeBonus;
        setScore((prev) => prev + bonus);
        checkWinCondition(newCompletePiles);
      }
    }
  };

  // Sprawdzenie warunku wygranej: wszystkie completePiles muszą być wypełnione
  const checkWinCondition = (updatedCompletePiles) => {
    let hasWon = updatedCompletePiles.every((pile) => pile.length > 0);
    if (hasWon) {
      const endTime = new Date();
      const timeSpent = (endTime - startTime) / 1000;
      setWinDetails({ score, timeSpent, difficulty});
      setIsWin(true);
    }
  };

  // Cofanie ostatniego ruchu
  const undoLastMove = () => {
    if (moveHistory.length === 0) return;

    const lastState = moveHistory[moveHistory.length - 1];
    const { piles: prevPiles, drawPile: prevDrawPile, completePiles: prevCompletePiles, drawnCards } = lastState;

    setPiles(prevPiles);
    setDrawPile([...prevDrawPile, ...drawnCards]);
    setCompletePiles(prevCompletePiles);
    setMoveHistory(moveHistory.slice(0, -1));
    setSelectedCard(null);
    setScore((prev) => prev - 1);
  };

  // Rozpoczęcie nowej gry
  const startNewGame = () => {
    initializeGame(difficulty);
  };

  // Funkcja symulująca wygraną (oszukanie)
  const simulateWin = () => {
    const timeSpent = Math.floor(Math.random() * 901) + 100;
    const randomScore = Math.floor(Math.random() * 501) + 200;
    const difficulties = ['one-color', 'two-colors', 'four-colors'];
    const randomDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
    setWinDetails({ score: randomScore, timeSpent, difficulty: randomDifficulty});
    setIsWin(true);
  };

  // po kliknięciu przycisku "Zapisz"
  const handleSaveWin = () => {
    if (winDetails) {
      saveScore(winDetails.score, winDetails.timeSpent, playerName, winDetails.difficulty);
      router.push('/');
    }
  };

  // modal wygranej
  const WinModal = ({ winDetails, playerName, setPlayerName, onSave }) => (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Gratulacje!</h2>
        <p>
          Wynik: {winDetails.score}<br />
          Czas gry: {winDetails.timeSpent} sekund<br />
          Poziom trudności: {winDetails.difficulty}
        </p>
        <input
          type="text"
          placeholder="Podaj nazwę gracza"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <button onClick={onSave}>Zapisz</button>
      </div>
    </div>
  );

  return (
    <div>
      <h1>Pasjans pająk</h1>
  
      {/* Informacje o grze */}
      <div className={styles.gameInfo}>
        <div className={styles.timeElapsed}>Czas: {timeElapsed} sec</div>
        <div className={styles.score}>Wynik: {score}</div>
      </div>
  
      {/* Wybór trudności */}
      <div>
        <label htmlFor="difficulty">Wybierz trudność: </label>
        <select
          id="difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="one-color">Jeden kolor</option>
          <option value="two-colors">Dwa kolory</option>
          <option value="four-colors">Cztery kolory</option>
        </select>
      </div>
  
      {/* Plansza gry */}
      <div className={styles.gameBoard}>
        {/* Stosy ukończone */}
        <div className={styles.completePiles}>
          {completePiles.map((pile, index) => (
            <div key={index} className={styles.completePile}>
              {pile.length === 0 ? '' : `${pile[0].value}${pile[0].suit}`}
            </div>
          ))}
        </div>
  
        {/* Stos dobierania */}
        <div className={styles.drawPileContainer}>
          <div
            className={`${styles.drawPile} ${drawPile.length === 0 ? 'Pusto' : ''}`}
            onClick={handleDrawCard}
          >
            {drawPile.length === 0 ? 'Brak kart' : 'Dobierz karty'}
          </div>
        </div>
  
        {/* Główne stosy */}
        <div className={styles.piles}>
          {piles.map((pile, pileIndex) => (
            <div key={pileIndex} className={styles.pile}>
              {pile.length === 0 ? (
                <div
                  className={styles.emptyPile}
                  onClick={() => handleCardClick(pileIndex, 0)}
                >
                  Empty
                </div>
              ) : (
                pile.map((card, cardIndex) => {
                  const isSelected =
                    selectedCard &&
                    selectedCard.pileIndex === pileIndex &&
                    selectedCard.cardIndex === cardIndex;
                  return (
                    <div
                      key={card.id}
                      className={`${styles.card} ${
                        card.isRevealed ? '' : styles.hidden
                      } ${isSelected ? styles.selected : ''} ${
                        card.suit === '♥' || card.suit === '♦' ? styles.red : ''
                      }`}
                      onClick={() => handleCardClick(pileIndex, cardIndex)}
                    >
                      {card.isRevealed ? `${card.value}${card.suit}` : ''}
                    </div>
                  );
                })
              )}
            </div>
          ))}
        </div>
      </div>
      {/* przyciski funkcyjne */}
      <button onClick={startNewGame}>Nowa gra</button>
      <button onClick={undoLastMove}>Cofnij</button>
      <button onClick={simulateWin}>Oszukaj</button>
      <button onClick={() => router.push('/')}>Powrót</button>

      {isWin && winDetails && (
        <WinModal
          winDetails={winDetails}
          playerName={playerName}
          setPlayerName={setPlayerName}
          onSave={handleSaveWin}
        />
      )}
    </div>
  );
};

export default SolitaireGame;
