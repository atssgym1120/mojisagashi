import { useState, useEffect } from 'react';

// --- アイコン・効果音 ---
const playCorrectSound = () => {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
  oscillator.frequency.exponentialRampToValueAtTime(783.99, audioCtx.currentTime + 0.1); // G5
  gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 0.5);
};

const RefreshIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>);
const LightbulbIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>);
const CheckIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>);
const StoreIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/><path d="M12 3v6"/></svg>);

const Confetti = () => (
  <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden flex justify-center">
    {[...Array(60)].map((_, i) => (
      <div key={i} className="absolute animate-confetti" style={{
        left: `${Math.random() * 100}%`, top: `-10%`,
        backgroundColor: ['#f87171', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#f472b6'][Math.floor(Math.random() * 6)],
        width: `${Math.random() * 10 + 6}px`, height: `${Math.random() * 16 + 8}px`,
        animationDelay: `${Math.random() * 1.5}s`, animationDuration: `${Math.random() * 2 + 2.5}s`,
        transform: `rotate(${Math.random() * 360}deg)`
      }} />
    ))}
    <style>{`@keyframes confetti { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(110vh) rotate(720deg); opacity: 0; } } .animate-confetti { animation: confetti linear forwards; }`}</style>
  </div>
);

const CATEGORIES = [
  { id: 0, name: "くだもの", words: ["りんご", "みかん", "いちご", "すいか", "ばなな", "めろん", "ぶどう", "もも", "れもん", "かき", "ぱいなっぷる", "さくらんぼ"] },
  { id: 1, name: "のりもの", words: ["くるま", "でんしゃ", "ふね", "ひこうき", "ばす", "とらっく", "じてんしゃ", "ろけっと", "よっと", "ばいく", "しんかんせん"] },
  { id: 2, name: "いろ", words: ["あか", "あお", "きいろ", "しろ", "くろ", "みどり", "むらさき", "ぴんく", "ちゃいろ", "みずいろ", "きみどり"] },
  { id: 3, name: "たべもの", words: ["おにぎり", "ぱん", "たまご", "うどん", "そば", "すし", "てんぷら", "おにく", "さかな", "とうふ", "かれー"] },
  { id: 4, name: "どうぶつ", words: ["いぬ", "ねこ", "うさぎ", "きりん", "ぞう", "らいおん", "くま", "さる", "とら", "ごりら", "ぱんだ"] }
];

const PREMIUM_CATEGORIES = [
  { id: 101, name: "✨でんせつのポケモン", price: 500, words: ["みゅうつー", "るぎあ", "ほおう", "すいくん", "えんてい", "らいこう", "れっくうざ"] },
  { id: 102, name: "⛏️マインクラフト", price: 500, words: ["くりーぱー", "すけるとん", "ぞんび", "えんだーまん", "つるはし", "たいまつ", "だいやもんど"] }
];

const STAMPS = [
  { id: 'default', name: 'ふつうの色', emoji: '', price: 0 },
  { id: 'star', name: '⭐ ほし', emoji: '⭐', price: 300 },
  { id: 'paw', name: '🐾 にくきゅう', emoji: '🐾', price: 300 }
];

const GACHA_POOL = ['👑','💎','🏆','🚀','🦄','🦖','🍔','🎸','⚽','🎮'];
const HIRAGANA = "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんがぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽ";

export default function App() {
  const [difficulty, setDifficulty] = useState(2);
  const [coins, setCoins] = useState(() => parseInt(localStorage.getItem('shared_game_coins') || 0, 10));
  const [gameState, setGameState] = useState(null);
  const [selectedCells, setSelectedCells] = useState(new Set());
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [revealedWords, setRevealedWords] = useState(new Set());
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [unlockedCategories, setUnlockedCategories] = useState(() => JSON.parse(localStorage.getItem('unlockedCategories') || '[]'));
  const [badges, setBadges] = useState(() => JSON.parse(localStorage.getItem('badges') || '[]'));

  useEffect(() => { localStorage.setItem('shared_game_coins', coins.toString()); }, [coins]);

  const generateBoard = (level, categoryObj) => {
    const size = 7;
    const board = Array(size).fill(null).map(() => Array(size).fill(null));
    const words = [...categoryObj.words].sort(() => 0.5 - Math.random()).slice(0, level + 2);
    const answerCellsArray = [];
    
    // 単純配置（簡略化）
    words.forEach((word, idx) => {
      const dir = idx % 2 === 0 ? [0, 1] : [1, 0];
      const r = Math.floor(Math.random() * (size - word.length * dir[0]));
      const c = Math.floor(Math.random() * (size - word.length * dir[1]));
      for(let i=0; i<word.length; i++){
        board[r + i*dir[0]][c + i*dir[1]] = word[i];
        answerCellsArray.push(`${r + i*dir[0]}-${c + i*dir[1]}`);
      }
    });

    return { 
      board: board.map(r => r.map(c => c ?? HIRAGANA[Math.floor(Math.random()*HIRAGANA.length)])),
      selectedWords: words.map((w, i) => ({word: w, cells: []})), // 簡単のためセル情報は割愛
      answerCells: new Set(answerCellsArray),
      categoryName: categoryObj.name 
    };
  };

  const startNewGame = () => {
    const all = [...CATEGORIES, ...PREMIUM_CATEGORIES.filter(c => unlockedCategories.includes(c.id))];
    setGameState(generateBoard(difficulty, all[Math.floor(Math.random()*all.length)]));
    setSelectedCells(new Set()); setShowHint(false); setShowAnswer(false); setRevealedWords(new Set());
  };

  useEffect(startNewGame, [difficulty]);

  const handleRevealWord = (idx) => {
    const cost = difficulty * 10;
    if (!revealedWords.has(idx) && coins >= cost) {
      setCoins(c => c - cost);
      setRevealedWords(prev => new Set(prev).add(idx));
    }
  };

  const handleCheckAnswer = () => {
    setShowAnswer(true);
    playCorrectSound();
    setCoins(c => c + 50);
  };

  return (
    <div className="min-h-screen bg-yellow-50 p-4 font-sans">
      <div className="flex justify-between items-center mb-6">
        <div className="bg-white px-6 py-2 rounded-full font-black text-2xl text-yellow-600 border-4 border-yellow-400">🪙 {coins}</div>
        <button onClick={() => setIsShopOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded-full font-bold">おみせ</button>
      </div>

      {showAnswer && <Confetti />}

      <div className="grid grid-cols-7 gap-1 bg-orange-100 p-2 rounded-xl">
        {gameState?.board.map((row, r) => row.map((char, c) => (
          <div key={`${r}-${c}`} className={`w-10 h-10 flex items-center justify-center font-black rounded-lg cursor-pointer ${selectedCells.has(`${r}-${c}`) ? 'bg-orange-400' : 'bg-white'}`} 
            onClick={() => setSelectedCells(prev => { const s = new Set(prev); s.has(`${r}-${c}`) ? s.delete(`${r}-${c}`) : s.add(`${r}-${c}`); return s; })}>
            {char}
          </div>
        )))}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {gameState?.selectedWords.map((item, idx) => (
          <button key={idx} onClick={() => handleRevealWord(idx)} className="bg-blue-200 px-4 py-2 rounded-full font-bold">
            {revealedWords.has(idx) ? item.word : "？？？"}({difficulty * 10}🪙)
          </button>
        ))}
      </div>

      <button onClick={handleCheckAnswer} className="mt-8 w-full bg-green-500 text-white py-4 rounded-2xl font-black text-xl">こたえあわせ</button>
      
      {isShopOpen && <div className="fixed inset-0 bg-black/50 flex items-center justify-center" onClick={() => setIsShopOpen(false)}>
        <div className="bg-white p-8 rounded-3xl" onClick={e => e.stopPropagation()}>おみせの中身（開発中）</div>
      </div>}
    </div>
  );
}
