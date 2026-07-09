import { useState, useEffect } from 'react';

// --- 効果音再生関数（ピキーン！と鳴るピュアオーディオ） ---
const playCorrectSound = () => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.type = 'sine';
    // ド(C5) から ソ(G5) へ滑らかに音が上がるピキーン効果音
    oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime); 
    oscillator.frequency.exponentialRampToValueAtTime(783.99, audioCtx.currentTime + 0.12); 
    
    gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.6);
  } catch (e) {
    console.log("Audio error:", e);
  }
};

// --- アイコンコンポーネント ---
const RefreshIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>);
const LightbulbIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>);
const CheckIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>);
const PrinterIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>);
const StoreIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/><path d="M12 3v6"/></svg>);

// --- クリア演出（紙吹雪）コンポーネント ---
const Confetti = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden flex justify-center">
      {[...Array(60)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-10%`,
            backgroundColor: ['#f87171', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#f472b6'][Math.floor(Math.random() * 6)],
            width: `${Math.random() * 10 + 6}px`,
            height: `${Math.random() * 16 + 8}px`,
            animationDelay: `${Math.random() * 1.5}s`,
            animationDuration: `${Math.random() * 2 + 2.5}s`,
            transform: `rotate(${Math.random() * 360}deg)`
          }}
        />
      ))}
      <style>{`
        @keyframes confetti { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(110vh) rotate(720deg); opacity: 0; } }
        .animate-confetti { animation: confetti linear forwards; }
      `}</style>
    </div>
  );
};

// --- ゲームデータ（超大容量版） ---
const CATEGORIES = [
  { id: 0, name: "くだもの", words: ["りんご", "みかん", "いちご", "すいか", "ばなな", "めろん", "ぶどう", "もも", "れもん", "かき", "ぱいなっぷる", "さくらんぼ", "まんごー", "ようなし"] },
  { id: 1, name: "のりもの", words: ["くるま", "でんしゃ", "ふね", "ひこうき", "ばす", "とらっく", "じてんしゃ", "ろけっと", "よっと", "ばいく", "しんかんせん", "ぱとかー", "きゅうきゅうしゃ", "しょうぼうしゃ"] },
  { id: 2, name: "いろ", words: ["あか", "あお", "きいろ", "しろ", "くろ", "みどり", "むらさき", "ぴんく", "ちゃいろ", "みずいろ", "きみどり", "おれんじ", "はいいろ", "ぎんいろ", "きんいろ"] },
  { id: 3, name: "たべもの", words: ["おにぎり", "ぱん", "たまご", "うどん", "そば", "すし", "てんぷら", "おにく", "さかな", "とうふ", "かれー", "はんばーぐ", "らーめん", "ぎょうざ", "ぴざ"] },
  { id: 4, name: "どうぶつ", words: ["いぬ", "ねこ", "うさぎ", "きりん", "ぞう", "らいおん", "くま", "さる", "とら", "ごりら", "ぱんだ", "こあら", "しか", "きつね", "たぬき"] },
  { id: 5, name: "とり", words: ["からす", "すずめ", "つばめ", "はと", "にわとり", "ぺんぎん", "だちょう", "ふくろう", "わし", "たか", "あひる", "かもめ", "いんこ", "はくちょう"] },
  { id: 6, name: "むし", words: ["あり", "はち", "ちょう", "とんぼ", "せみ", "かぶとむし", "くわがた", "ばった", "かまきり", "だんごむし", "てんとうむし", "ほたる", "か", "くも"] },
  { id: 7, name: "うみのいきもの", words: ["イルカ", "くじら", "さめ", "たこ", "いか", "くらげ", "かに", "かめ", "あざらし", "らっこ", "しゃち", "ひとで", "さんご", "えい"] },
  { id: 8, name: "からだ", words: ["あたま", "かお", "みみ", "はな", "くち", "あし", "おなか", "せなか", "かた", "うで", "むね", "こし", "ひざ", "ゆび", "まゆげ"] },
  { id: 9, name: "みせ", words: ["ほんや", "ぱんや", "はなや", "くすりや", "やおや", "とこや", "びよういん", "ぶんぼうぐや", "けえきや", "すーぱー", "こんびに", "かふぇ", "くつや", "ふくや"] },
  { id: 10, name: "がっこう", words: ["つくえ", "いす", "こくばん", "えんぴつ", "けしごむ", "のり", "はさみ", "じょうぎ", "ふでばこ", "こま", "きょうかしょ", "のーと", "たいいくかん", "ぷーる", "ぱそこん"] },
  { id: 11, name: "いえのなか", words: ["てれび", "れいぞうこ", "そうじき", "とけい", "べっど", "ふとん", "まくら", "そふぁ", "かがみ", "いす", "でんしれんじ", "せんたくき", "えあこん", "せんぷうき"] },
  { id: 12, name: "やさい", words: ["とまと", "きゅうり", "なす", "きゃべつ", "れたす", "にんじん", "だいこん", "たまねぎ", "ねぎ", "ごぼう", "ぴーまん", "ほうれんそう", "かぼちゃ", "じゃがいも"] },
  { id: 13, name: "ぶんぼうぐ", words: ["えんぴつ", "けしごむ", "はさみ", "のり", "ものさし", "じょうぎ", "ふでばこ", "くれよん", "えのぐ", "ふで", "ぼーるぺん", "めもちょう", "ほっちきす"] },
  { id: 14, name: "きせつ・てんき", words: ["はる", "なつ", "あき", "ふゆ", "あめ", "はれ", "ゆき", "くも", "かぜ", "かみなり", "たいふう", "にじ", "あられ", "ゆうだち"] },
  { id: 15, name: "しごと", words: ["いしゃ", "かんごし", "けいさつ", "しょうぼう", "せんせい", "だいく", "かしゅ", "びようし", "けいびいん", "ぱいろっと", "のうか", "はいゆう", "ほいくし"] },
  { id: 16, name: "ほし・そら", words: ["たいよう", "つき", "ほし", "ちきゅう", "うちゅう", "すいせい", "きんせい", "かせい", "もくせい", "どせい", "うみ", "そら", "にじ"] },
  { id: 17, name: "あそび", words: ["かくれんぼ", "おにごっこ", "すべりだい", "ぶらんこ", "てつぼう", "なわとび", "おてだま", "こま", "つみき", "かるた", "すなば", "ぷーる", "げーむ", "おえかき"] },
  { id: 18, name: "がっき", words: ["ぴあの", "たいこ", "ふえ", "らっぱ", "ばいおりん", "ぎたあ", "こと", "もっきん", "てっきん", "しんばる", "どらむ", "けんばん", "はーもにか", "おるがん"] },
  { id: 19, name: "スポーツ", words: ["やきゅう", "すいえい", "たっきゅう", "けんどう", "じゅうどう", "すもう", "てにす", "まらそん", "からて", "すきい", "さっかー", "ばすけ", "ばれー", "すのぼ"] },
  { id: 20, name: "ポケモン", words: ["ぴかちゅう", "いーぶい", "かびごん", "げんがー", "りざーどん", "みゅうつー", "かめっくす", "ふしぎだね", "にゃおは", "ほげーた", "くわっす", "るかりお", "ぷりん", "こいんぐ", "めたもん", "ぽっちゃま", "るぎあ", "ほおう"] }
];

// --- プレミアムおだい（コインで解放） ---
const PREMIUM_CATEGORIES = [
  { id: 101, name: "✨でんせつのポケモン", price: 500, words: ["みゅうつー", "るぎあ", "ほおう", "すいくん", "えんてい", "らいこう", "でぃあるが", "ぱるきあ", "れっくうざ", "ぐらーどん", "かいおーが", "ざしあん", "むげんだいな"] },
  { id: 102, name: "⛏️マインクラフト", price: 500, words: ["くりーぱー", "すけるとん", "ぞんび", "えんだーまん", "すらいむ", "がすと", "つるはし", "たいまつ", "だいやもんど", "てつ", "きん", "ぶた", "うし"] }
];

// --- きせかえスタンプ（コインで解放） ---
const STAMPS = [
  { id: 'default', name: 'ふつうの色', emoji: '', price: 0 },
  { id: 'star', name: '⭐ ほしスタンプ', emoji: '⭐', price: 300 },
  { id: 'paw', name: '🐾 にくきゅうスタンプ', emoji: '🐾', price: 300 },
  { id: 'flower', name: '🌸 さくらスタンプ', emoji: '🌸', price: 300 },
];

// --- ガチャの景品一覧 ---
const GACHA_POOL = ['👑','💎','🏆','🚀','🦄','🦖','🍔','🎸','⚽','🎮','🤖','👻','👽','🍀','🔥','⚔️','🛡️','🍎'];

const HIRAGANA = "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんがぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽ";
const REWARD_COINS = { 1: 10, 2: 50, 3: 100, 4: 200, 5: 300 };

export default function App() {
  const [difficulty, setDifficulty] = useState(2);
  const [selectedCategoryId, setSelectedCategoryId] = useState("random");
  const [gameState, setGameState] = useState(null);
  const [selectedCells, setSelectedCells] = useState(new Set());
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [revealedWords, setRevealedWords] = useState(new Set());
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [gachaResult, setGachaResult] = useState(null);

  // localStorage を使った共通セーブデータ
  const [coins, setCoins] = useState(() => { const s = localStorage.getItem('shared_game_coins'); return s ? parseInt(s, 10) : 0; });
  const [unlockedCategories, setUnlockedCategories] = useState(() => JSON.parse(localStorage.getItem('unlockedCategories')) || []);
  const [unlockedStamps, setUnlockedStamps] = useState(() => JSON.parse(localStorage.getItem('unlockedStamps')) || ['default']);
  const [currentStamp, setCurrentStamp] = useState(() => localStorage.getItem('currentStamp') || 'default');
  const [badges, setBadges] = useState(() => JSON.parse(localStorage.getItem('badges')) || []);

  const [earnedCoins, setEarnedCoins] = useState(0);
  const [isCoinRewarded, setIsCoinRewarded] = useState(false);

  // セーブ処理の同期
  useEffect(() => { localStorage.setItem('shared_game_coins', coins.toString()); }, [coins]);
  useEffect(() => { localStorage.setItem('unlockedCategories', JSON.stringify(unlockedCategories)); }, [unlockedCategories]);
  useEffect(() => { localStorage.setItem('unlockedStamps', JSON.stringify(unlockedStamps)); }, [unlockedStamps]);
  useEffect(() => { localStorage.setItem('currentStamp', currentStamp); }, [currentStamp]);
  useEffect(() => { localStorage.setItem('badges', JSON.stringify(badges)); }, [badges]);

  const activeCategories = [
    ...CATEGORIES,
    ...PREMIUM_CATEGORIES.filter(c => unlockedCategories.includes(c.id))
  ];

  // 難易度に応じた単語の方向を返す (※順読みのみに制限)
  const getDirections = (level) => {
    const rightDown = [[0, 1], [1, 0]]; // 右、下
    const diag = [[1, 1]]; // 右下斜め
    if (level <= 2) return rightDown;
    return [...rightDown, ...diag];
  };

  // 盤面の生成 (厳密な完全版ロジック)
  const generateBoard = (level, categoryObj) => {
    const size = 7;
    const board = Array(size).fill(null).map(() => Array(size).fill(null));
    const dirs = getDirections(level);
    const numWords = level + 2; 

    const availableWords = [...categoryObj.words].sort(() => 0.5 - Math.random());
    const selectedWords = [];
    const answerCellsArray = [];
    const hintCellsArray = [];

    for (const word of availableWords) {
      if (selectedWords.length >= numWords) break;
      let placed = false;
      let attempts = 0;

      while (!placed && attempts < 100) {
        attempts++;
        const dir = dirs[Math.floor(Math.random() * dirs.length)];
        const startRow = Math.floor(Math.random() * size);
        const startCol = Math.floor(Math.random() * size);
        const endRow = startRow + dir[0] * (word.length - 1);
        const endCol = startCol + dir[1] * (word.length - 1);

        if (endRow >= 0 && endRow < size && endCol >= 0 && endCol < size) {
          let conflict = false;
          for (let i = 0; i < word.length; i++) {
            const r = startRow + dir[0] * i;
            const c = startCol + dir[1] * i;
            if (board[r][c] !== null && board[r][c] !== word[i]) {
              conflict = true;
              break;
            }
          }

          if (!conflict) {
            const currentAnswerCells = [];
            for (let i = 0; i < word.length; i++) {
              const r = startRow + dir[0] * i;
              const c = startCol + dir[1] * i;
              board[r][c] = word[i];
              currentAnswerCells.push(`${r}-${c}`);
              if (i === 0) hintCellsArray.push(`${r}-${c}`);
            }
            selectedWords.push({ word, cells: currentAnswerCells });
            answerCellsArray.push(...currentAnswerCells);
            placed = true;
          }
        }
      }
    }

    const finalBoard = board.map(row =>
      row.map(cell => cell ?? HIRAGANA[Math.floor(Math.random() * HIRAGANA.length)])
    );

    return { board: finalBoard, selectedWords, answerCells: new Set(answerCellsArray), hintCells: new Set(hintCellsArray), categoryName: categoryObj.name };
  };

  const startNewGame = () => {
    let catObj;
    if (selectedCategoryId === "random") {
      catObj = activeCategories[Math.floor(Math.random() * activeCategories.length)];
    } else {
      catObj = activeCategories.find(c => c.id === parseInt(selectedCategoryId, 10));
    }
    if (catObj) setGameState(generateBoard(difficulty, catObj));
    setSelectedCells(new Set());
    setShowHint(false);
    setShowAnswer(false);
    setRevealedWords(new Set());
    setShowPrintModal(false);
    setIsCoinRewarded(false);
    setEarnedCoins(0);
  };

  useEffect(() => { startNewGame(); }, [difficulty, selectedCategoryId]);

  const handleCellClick = (r, c) => {
    if (showAnswer) return;
    const key = `${r}-${c}`;
    const newSelected = new Set(selectedCells);
    if (newSelected.has(key)) newSelected.delete(key);
    else newSelected.add(key);
    setSelectedCells(newSelected);
  };

  // 個別文字オープン（？？？）時のコイン消費処理
  const handleRevealWord = (idx) => {
    if (showAnswer) return;
    const cost = difficulty * 10;
    if (!revealedWords.has(idx)) {
      if (coins >= cost) {
        setCoins(c => c - cost);
        setRevealedWords(prev => new Set(prev).add(idx));
      } else {
        alert("コインがたりないよ！もっと問題を解いてあつめよう！");
      }
    }
  };

  // 全体ヒント（10コイン消費）
  const handleBuyHint = () => {
    if (coins >= 10 && !showHint) {
      setCoins(c => c - 10);
      setShowHint(true);
    }
  };

  const handleCheckAnswer = () => {
    setShowAnswer(true);
    let isPerfectMatch = false;
    if (gameState && selectedCells.size === gameState.answerCells.size) {
      isPerfectMatch = [...gameState.answerCells].every(cell => selectedCells.has(cell));
    }
    if (isPerfectMatch && !isCoinRewarded) {
      playCorrectSound(); // 正解の効果音を再生！
      const reward = REWARD_COINS[difficulty] || 10;
      setCoins(c => c + reward);
      setEarnedCoins(reward);
      setIsCoinRewarded(true);
    } else {
      setEarnedCoins(0);
    }
  };

  // おみせショップ＆ガチャ処理
  const buyCategory = (id, price) => {
    if (coins >= price && !unlockedCategories.includes(id)) {
      setCoins(c => c - price);
      setUnlockedCategories([...unlockedCategories, id]);
    }
  };
  const buyStamp = (id, price) => {
    if (coins >= price && !unlockedStamps.includes(id)) {
      setCoins(c => c - price);
      setUnlockedStamps([...unlockedStamps, id]);
      setCurrentStamp(id);
    }
  };
  const playGacha = () => {
    if (coins >= 100) {
      setCoins(c => c - 100);
      const item = GACHA_POOL[Math.floor(Math.random() * GACHA_POOL.length)];
      setGachaResult(item);
      setBadges([...badges, item]);
      setTimeout(() => setGachaResult(null), 2500);
    }
  };

  const handlePrint = () => {
    if (!gameState) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) { setShowPrintModal(true); return; }
    const wordsHtml = gameState.selectedWords.map(item => `<span style="display:inline-block; border:2px solid black; border-radius:20px; padding:4px 16px; margin:4px; font-size:24px; font-weight:bold;">${item.word}</span>`).join('');
    let boardHtml = '<div style="display:inline-grid; grid-template-columns:repeat(7, 1fr); border:3px solid black; background: white;">';
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) { boardHtml += `<div style="width:60px; height:60px; display:flex; align-items:center; justify-content:center; font-size:36px; font-weight:bold; border:1px solid #999;">${gameState.board[r][c]}</div>`; }
    }
    boardHtml += '</div>';
    printWindow.document.write(`
      <!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><title>もじさがしゲーム</title><style>body { font-family: sans-serif; text-align: center; margin: 0; padding: 40px; } h1 { font-size: 40px; margin-bottom: 10px; } .category { display: inline-block; font-size: 24px; font-weight: bold; margin-bottom: 30px; border-bottom: 3px solid #000; padding-bottom: 5px; } .instruction { font-size: 20px; margin-bottom: 20px; font-weight: bold; } .words-container { margin-bottom: 40px; } @media print { @page { margin: 15mm; } }</style></head><body><h1>もじさがしゲーム</h1><div class="category">おだい：${gameState.categoryName}</div><div class="instruction">したの ことばを さがして、まるで かこもう！</div><div class="words-container">${wordsHtml}</div>${boardHtml}</body></html>
    `);
    printWindow.document.close(); printWindow.focus(); setTimeout(() => printWindow.print(), 500);
  };

  if (!gameState) return null;

  return (
    <div className="min-h-screen bg-yellow-50 text-gray-800 font-sans p-2 sm:p-4 selection:bg-orange-200 relative">
      
      {showAnswer && earnedCoins > 0 && <Confetti />}

      {/* --- コイン＆おみせボタン UI --- */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex flex-col items-end gap-2 z-20 print:hidden">
        <div className="bg-white border-4 border-yellow-400 text-yellow-600 font-black px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
          <span className="text-2xl">🪙</span>
          <span className="text-xl sm:text-2xl">{coins}</span>
        </div>
        <button 
          onClick={() => setIsShopOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-full shadow-md flex items-center gap-1 transition-transform active:scale-95 border-2 border-blue-300"
        >
          <StoreIcon /> おみせ＆ガチャ
        </button>
      </div>

      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden print:shadow-none print:bg-transparent mt-24 sm:mt-0 relative z-10">

        <div className="bg-orange-400 p-4 sm:p-6 text-white text-center print:bg-transparent print:text-black print:p-0 print:mb-4">
          <h1 className="text-3xl sm:text-4xl font-black tracking-wider">もじさがしゲーム</h1>
          <p className="mt-2 text-orange-100 font-bold print:hidden">かくれていることばを みつけよう！</p>
        </div>

        <div className="p-4 bg-orange-50 border-b border-orange-100 flex flex-col lg:flex-row gap-4 justify-between items-center print:hidden">
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 w-full lg:w-auto">
            <div className="flex items-center gap-2">
              <span className="font-bold text-orange-800 whitespace-nowrap">むずかしさ:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(level => (
                  <button key={level} onClick={() => setDifficulty(level)} className={`w-10 h-10 rounded-full font-black text-lg transition-all ${difficulty === level ? 'bg-orange-500 text-white shadow-md scale-110' : 'bg-white text-orange-400 border-2 border-orange-200 hover:bg-orange-100'}`}>
                    {level}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-orange-800 whitespace-nowrap">おだい:</span>
              <select window-value={selectedCategoryId} value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(e.target.value)} className="p-2 rounded-xl border-2 border-orange-200 font-bold text-gray-700 bg-white cursor-pointer focus:outline-none focus:border-orange-500 min-w-[140px]">
                <option value="random">🎲 おまかせ (ランダム)</option>
                {activeCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
          <button onClick={startNewGame} className="flex items-center justify-center gap-1 bg-white border-2 border-orange-400 text-orange-500 px-5 py-2 rounded-full font-bold hover:bg-orange-100 transition-colors active:scale-95 whitespace-nowrap w-full sm:w-auto">
            <RefreshIcon /> あたらしいもんだい
          </button>
        </div>

        <div className="p-4 sm:p-6 print:p-0">

          <div className="mb-6 bg-blue-50 p-4 rounded-2xl border-2 border-blue-200 print:border-none print:bg-transparent print:p-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-2xl print:hidden">🔍</span>
                <h2 className="text-xl sm:text-2xl font-black text-blue-800 flex items-center flex-wrap gap-2">
                  さがすことば
                  <span className="text-base bg-blue-200 text-blue-900 px-4 py-1 rounded-full border border-blue-300 print:border-black print:bg-transparent">おだい：{gameState.categoryName}</span>
                </h2>
              </div>
              <div className="text-blue-800 font-bold print:hidden">ぜんぶで {gameState.selectedWords.length}こ</div>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {gameState.selectedWords.map((item, idx) => {
                const isRevealed = revealedWords.has(idx) || showAnswer;
                return (
                  <button 
                    key={idx} 
                    onClick={() => handleRevealWord(idx)} 
                    className={`px-4 py-2 rounded-full text-lg sm:text-xl font-bold shadow-sm border-2 tracking-widest transition-transform print:border-black print:shadow-none print:px-2 print:py-0 print:text-2xl ${isRevealed ? "bg-white text-gray-700 border-blue-100 cursor-default" : "bg-gray-200 text-gray-500 border-gray-300 hover:bg-gray-300 hover:scale-105 active:scale-95 cursor-pointer"}`}
                  >
                    {isRevealed ? item.word : `${"？".repeat(item.word.length)} (${difficulty * 10}🪙)`}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center mb-8">
            <div className="grid grid-cols-7 gap-1 sm:gap-2 p-2 sm:p-3 bg-orange-100 rounded-2xl print:bg-transparent print:border-2 print:border-black print:p-0 print:gap-0">
              {gameState.board.map((row, r) => (
                row.map((char, c) => {
                  const key = `${r}-${c}`;
                  const isSelected = selectedCells.has(key);
                  const isAnswer = showAnswer && gameState.answerCells.has(key);
                  const isWrong = showAnswer && isSelected && !gameState.answerCells.has(key);
                  const isHint = showHint && !showAnswer && gameState.hintCells.has(key);

                  let cellClass = "w-11 h-11 sm:w-16 sm:h-16 flex items-center justify-center text-2xl sm:text-3xl font-black rounded-xl cursor-pointer transition-all select-none print:rounded-none print:border print:border-gray-500 print:w-14 print:h-14 print:text-4xl relative overflow-hidden";

                  if (isAnswer) cellClass += " bg-green-400 text-white shadow-inner print:bg-gray-200 print:text-black";
                  else if (isWrong) cellClass += " bg-red-400 text-white shadow-inner print:bg-transparent print:text-black";
                  else if (isSelected) cellClass += " bg-orange-400 text-white shadow-inner scale-95 print:bg-transparent print:text-black print:scale-100";
                  else if (isHint) cellClass += " bg-yellow-300 text-yellow-900 animate-pulse print:bg-transparent print:text-black print:animate-none";
                  else cellClass += " bg-white text-gray-700 shadow hover:bg-orange-50 print:bg-transparent print:shadow-none";

                  return (
                    <div key={key} className={cellClass} onClick={() => handleCellClick(r, c)}>
                      {isSelected && currentStamp !== 'default' && (
                        <div className="absolute inset-0 flex items-center justify-center text-4xl sm:text-5xl opacity-40 z-0">
                          {STAMPS.find(s=>s.id === currentStamp)?.emoji}
                        </div>
                      )}
                      <span className="relative z-10">{char}</span>
                    </div>
                  );
                })
              ))}
            </div>
          </div>

          {showAnswer && (
            <div className="mb-6 p-4 text-center rounded-2xl bg-green-100 text-green-800 font-bold text-2xl animate-bounce print:hidden border-4 border-green-300">
              {earnedCoins > 0 ? (
                <div>だいせいかい！🎉<br/><span className="text-yellow-600 text-3xl">🪙 {earnedCoins} コイン</span> ゲット！</div>
              ) : (
                <div>おしい！つぎはぜんぶみつけよう！✨</div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 print:hidden">
            <button
              onClick={handleBuyHint}
              disabled={showAnswer || showHint || coins < 10}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-yellow-900 px-6 py-4 rounded-full font-black text-lg shadow-md transition-transform active:scale-95"
            >
              <LightbulbIcon /> ヒント (10🪙)
            </button>
            <button
              onClick={handleCheckAnswer}
              disabled={showAnswer}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-4 rounded-full font-black text-lg shadow-md transition-transform active:scale-95"
            >
              <CheckIcon /> こたえあわせ
            </button>
            <button onClick={handlePrint} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-4 rounded-full font-black text-lg shadow-md transition-transform active:scale-95">
              <PrinterIcon /> いんさつ
            </button>
          </div>

        </div>
      </div>

      {/* --- おみせ＆ガチャ モーダル --- */}
      {isShopOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative">
            
            {gachaResult && (
              <div className="absolute inset-0 bg-yellow-100/90 z-20 flex flex-col items-center justify-center animate-pulse">
                <span className="text-2xl font-bold text-yellow-800 mb-4">おめでとう！</span>
                <span className="text-8xl">{gachaResult}</span>
              </div>
            )}

            <div className="bg-blue-500 p-4 flex justify-between items-center text-white">
              <h2 className="text-2xl font-black">おみせ ＆ ガチャ</h2>
              <button onClick={() => setIsShopOpen(false)} className="text-3xl font-black hover:text-blue-200">×</button>
            </div>
            
            <div className="p-4 bg-yellow-100 border-b-4 border-yellow-200 text-center font-bold text-yellow-800 text-lg">
              あなたのコイン: <span className="text-2xl">🪙 {coins}</span>
            </div>

            <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-8">
              
              {/* ガチャ */}
              <div className="bg-orange-50 p-4 rounded-2xl border-2 border-orange-200">
                <h3 className="text-xl font-bold text-orange-800 mb-4 flex items-center gap-2">🎁 ごほうびガチャ (100🪙)</h3>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <button onClick={playGacha} disabled={coins < 100} className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-black px-6 py-4 rounded-full shadow-md text-lg active:scale-95">
                    ガチャをまわす！
                  </button>
                  <div className="flex-1 bg-white p-3 rounded-xl border border-gray-200 w-full">
                    <div className="text-sm font-bold text-gray-500 mb-2">あつめたバッジ ({badges.length}こ)</div>
                    <div className="flex flex-wrap gap-2 text-2xl h-16 overflow-y-auto">
                      {badges.map((b, i) => <span key={i} className="animate-bounce">{b}</span>)}
                    </div>
                  </div>
                </div>
              </div>

              {/* とくべつなおだい */}
              <div>
                <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">🔓 とくべつなおだい (各500🪙)</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {PREMIUM_CATEGORIES.map(cat => {
                    const isUnlocked = unlockedCategories.includes(cat.id);
                    return (
                      <div key={cat.id} className={`p-4 rounded-xl border-2 flex justify-between items-center ${isUnlocked ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                        <span className="font-bold">{cat.name}</span>
                        {isUnlocked ? (
                          <span className="text-green-600 font-bold text-sm bg-green-100 px-3 py-1 rounded-full">かいほうずみ</span>
                        ) : (
                          <button onClick={() => buyCategory(cat.id, cat.price)} disabled={coins < cat.price} className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-bold px-3 py-1 rounded-full text-sm">
                            買う
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* きせかえスタンプ */}
              <div>
                <h3 className="text-xl font-bold text-pink-800 mb-4 flex items-center gap-2">🎨 きせかえスタンプ (各300🪙)</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {STAMPS.map(stamp => {
                    if (stamp.id === 'default') return null;
                    const isUnlocked = unlockedStamps.includes(stamp.id);
                    const isCurrent = currentStamp === stamp.id;
                    return (
                      <div key={stamp.id} className={`p-4 rounded-xl border-2 flex justify-between items-center ${isCurrent ? 'bg-pink-100 border-pink-400' : isUnlocked ? 'bg-pink-50 border-pink-200' : 'bg-gray-50 border-gray-200'}`}>
                        <span className="font-bold text-lg">{stamp.name}</span>
                        {isCurrent ? (
                          <span className="text-pink-600 font-bold text-sm">✓ しよう中</span>
                        ) : isUnlocked ? (
                          <button onClick={() => setCurrentStamp(stamp.id)} className="bg-gray-600 hover:bg-gray-700 text-white font-bold px-3 py-1 rounded-full text-sm">つかう</button>
                        ) : (
                          <button onClick={() => buyStamp(stamp.id, stamp.price)} disabled={coins < stamp.price} className="bg-pink-500 hover:bg-pink-600 disabled:bg-gray-300 text-white font-bold px-3 py-1 rounded-full text-sm">
                            買う
                          </button>
                        )}
                      </div>
                    )
                  })}
                  <div className={`p-4 rounded-xl border-2 flex justify-between items-center ${currentStamp === 'default' ? 'bg-pink-100 border-pink-400' : 'bg-gray-50 border-gray-200'}`}>
                    <span className="font-bold">ふつうの色（スタンプなし）</span>
                    {currentStamp !== 'default' && (
                      <button onClick={() => setCurrentStamp('default')} className="bg-gray-600 hover:bg-gray-700 text-white font-bold px-3 py-1 rounded-full text-sm">もどす</button>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
