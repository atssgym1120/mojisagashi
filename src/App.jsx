import { useState, useEffect } from 'react';

// --- アイコンコンポーネント ---
const RefreshIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>);
const LightbulbIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>);
const CheckIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>);
const PrinterIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>);

// --- ゲームデータ ---
const CATEGORIES = [
  { id: 0, name: "くだもの", words: ["りんご", "みかん", "いちご", "すいか", "ばなな", "めろん", "ぶどう", "もも", "れもん", "かき"] },
  { id: 1, name: "のりもの", words: ["くるま", "でんしゃ", "ふね", "ひこうき", "ばす", "とらっく", "じてんしゃ", "ろけっと", "よっと", "ばいく"] },
  { id: 2, name: "いろ", words: ["あか", "あお", "きいろ", "しろ", "くろ", "みどり", "むらさき", "ぴんく", "ちゃいろ", "みずいろ"] },
  { id: 3, name: "たべもの", words: ["おにぎり", "ぱん", "たまご", "うどん", "そば", "すし", "てんぷら", "おにく", "さかな", "とうふ"] },
  { id: 4, name: "どうぶつ", words: ["いぬ", "ねこ", "うさぎ", "きりん", "ぞう", "らいおん", "くま", "さる", "とら", "ごりら"] },
  { id: 5, name: "とり", words: ["からす", "すずめ", "つばめ", "はと", "にわとり", "ぺんぎん", "だちょう", "ふくろう", "わし", "たか"] },
  { id: 6, name: "むし", words: ["あり", "はち", "ちょう", "とんぼ", "せみ", "かぶとむし", "くわがた", "ばった", "かまきり", "だんごむし"] },
  { id: 7, name: "うみのいきもの", words: ["いるか", "くじら", "さめ", "たこ", "いか", "くらげ", "かに", "かめ", "あざらし", "らっこ"] },
  { id: 8, name: "からだ", words: ["あたま", "かお", "みみ", "はな", "くち", "あし", "おなか", "せなか", "かた", "うで"] },
  { id: 9, name: "みせ", words: ["ほんや", "ぱんや", "はなや", "くすりや", "やおや", "とこや", "びよういん", "ぶんぼうぐや", "けえきや"] },
  { id: 10, name: "がっこう", words: ["つくえ", "いす", "こくばん", "えんぴつ", "けしごむ", "のり", "はさみ", "じょうぎ", "ふでばこ", "こま"] },
  { id: 11, name: "いえのなか", words: ["てれび", "れいぞうこ", "そうじき", "とけい", "べっど", "ふとん", "まくら", "そふぁ", "かがみ", "いす"] },
  { id: 12, name: "やさい", words: ["とまと", "きゅうり", "なす", "きゃべつ", "れたす", "にんじん", "だいこん", "たまねぎ", "ねぎ", "ごぼう"] },
  { id: 13, name: "ぶんぼうぐ", words: ["えんぴつ", "けしごむ", "はさみ", "のり", "ものさし", "じょうぎ", "ふでばこ", "くれよん", "えのぐ", "ふで"] },
  { id: 14, name: "きせつ・てんき", words: ["はる", "なつ", "あき", "ふゆ", "あめ", "はれ", "ゆき", "くも", "かぜ", "かみなり"] },
  { id: 15, name: "しごと", words: ["いしゃ", "かんごし", "けいさつ", "しょうぼう", "せんせい", "だいく", "かしゅ", "びようし", "けいびいん"] },
  { id: 16, name: "ほし・そら", words: ["たいよう", "つき", "ほし", "ちきゅう", "うちゅう", "すいせい", "きんせい", "かせい", "もくせい", "どせい"] },
  { id: 17, name: "あそび", words: ["かくれんぼ", "おにごっこ", "すべりだい", "ぶらんこ", "てつぼう", "なわとび", "おてだま", "こま", "つみき", "かるた"] },
  { id: 18, name: "がっき", words: ["ぴあの", "たいこ", "ふえ", "らっぱ", "ばいおりん", "ぎたあ", "こと", "もっきん", "てっきん", "しんばる"] },
  { id: 19, name: "スポーツ", words: ["やきゅう", "すいえい", "たっきゅう", "けんどう", "じゅうどう", "すもう", "てにす", "まらそん", "からて", "すきい"] },
];

const HIRAGANA = "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんがぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽ";

interface SelectedWord {
  word: string;
  cells: string[];
}

interface GameState {
  board: string[][];
  selectedWords: SelectedWord[];
  answerCells: Set<string>;
  hintCells: Set<string>;
  categoryName: string;
}

export default function App() {
  const [difficulty, setDifficulty] = useState(2);
  const [selectedCategoryId, setSelectedCategoryId] = useState("random");
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [revealedWords, setRevealedWords] = useState<Set<number>>(new Set());
  const [showPrintModal, setShowPrintModal] = useState(false);

  // 難易度に応じた単語の方向を返す
  const getDirections = (level: number) => {
    const rightDown = [[0, 1], [1, 0]]; // 右、下
    const diag = [[1, 1]]; // 右下斜め
    const reverse = [[0, -1], [-1, 0], [-1, -1], [1, -1], [-1, 1]]; // 左、上、左上、左下、右上

    if (level <= 2) return rightDown;
    if (level === 3) return [...rightDown, ...diag];
    if (level === 4) return [...rightDown, ...diag, [0, -1], [-1, 0]]; // 少し逆方向
    return [...rightDown, ...diag, ...reverse]; // 全方向
  };

  // 盤面の生成
  const generateBoard = (level: number, categoryObj: { name: string; words: string[] }): GameState => {
    const size = 7;
    const board: (string | null)[][] = Array(size).fill(null).map(() => Array(size).fill(null));
    const dirs = getDirections(level);
    const numWords = level + 2; // レベル1:3語 〜 レベル5:7語

    const availableWords = [...categoryObj.words].sort(() => 0.5 - Math.random());
    const selectedWords: SelectedWord[] = [];
    const answerCellsArray: string[] = [];
    const hintCellsArray: string[] = [];

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

        // 枠内に収まるか
        if (endRow >= 0 && endRow < size && endCol >= 0 && endCol < size) {
          let conflict = false;
          // すでに配置されている文字との衝突チェック
          for (let i = 0; i < word.length; i++) {
            const r = startRow + dir[0] * i;
            const c = startCol + dir[1] * i;
            if (board[r][c] !== null && board[r][c] !== word[i]) {
              conflict = true;
              break;
            }
          }

          if (!conflict) {
            const currentAnswerCells: string[] = [];
            for (let i = 0; i < word.length; i++) {
              const r = startRow + dir[0] * i;
              const c = startCol + dir[1] * i;
              board[r][c] = word[i];
              currentAnswerCells.push(`${r}-${c}`);
              if (i === 0) hintCellsArray.push(`${r}-${c}`); // 1文字目をヒントにする
            }
            selectedWords.push({ word, cells: currentAnswerCells });
            answerCellsArray.push(...currentAnswerCells);
            placed = true;
          }
        }
      }
    }

    // 空いているマスをランダムなひらがなで埋める
    const finalBoard: string[][] = board.map(row =>
      row.map(cell => cell ?? HIRAGANA[Math.floor(Math.random() * HIRAGANA.length)])
    );

    return {
      board: finalBoard,
      selectedWords,
      answerCells: new Set(answerCellsArray),
      hintCells: new Set(hintCellsArray),
      categoryName: categoryObj.name
    };
  };

  const startNewGame = () => {
    let catObj;
    if (selectedCategoryId === "random") {
      catObj = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    } else {
      catObj = CATEGORIES.find(c => c.id === parseInt(selectedCategoryId, 10));
    }
    if (catObj) {
      setGameState(generateBoard(difficulty, catObj));
    }
    setSelectedCells(new Set());
    setShowHint(false);
    setShowAnswer(false);
    setRevealedWords(new Set());
    setShowPrintModal(false);
  };

  // 初回マウント時と難易度変更時・ジャンル変更時にゲームを初期化
  useEffect(() => {
    startNewGame();

    // PWA Service Workerの登録
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(reg => console.log('PWA Service Worker 登録成功!', reg))
          .catch(err => console.log('登録失敗:', err));
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty, selectedCategoryId]);

  // マスのクリック処理
  const handleCellClick = (r: number, c: number) => {
    if (showAnswer) return; // 答え合わせ後は変更できないようにする

    const key = `${r}-${c}`;
    const newSelected = new Set(selectedCells);
    if (newSelected.has(key)) {
      newSelected.delete(key);
    } else {
      newSelected.add(key);
    }
    setSelectedCells(newSelected);
  };

  // 単語をめくる処理
  const handleRevealWord = (idx: number) => {
    if (showAnswer) return;
    setRevealedWords(prev => new Set(prev).add(idx));
  };

  // 印刷専用の新しいウィンドウを開く処理
  const handlePrint = () => {
    if (!gameState) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      setShowPrintModal(true);
      return;
    }

    const wordsHtml = gameState.selectedWords.map(item =>
      `<span style="display:inline-block; border:2px solid black; border-radius:20px; padding:4px 16px; margin:4px; font-size:24px; font-weight:bold;">${item.word}</span>`
    ).join('');

    let boardHtml = '<div style="display:inline-grid; grid-template-columns:repeat(7, 1fr); border:3px solid black; background: white;">';
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        boardHtml += `<div style="width:60px; height:60px; display:flex; align-items:center; justify-content:center; font-size:36px; font-weight:bold; border:1px solid #999;">${gameState.board[r][c]}</div>`;
      }
    }
    boardHtml += '</div>';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="ja">
      <head>
        <meta charset="UTF-8">
        <title>もじさがしゲーム</title>
        <style>
          body {
            font-family: 'Hiragino Maru Gothic ProN', 'Rounded Mplus 1c', 'Meiryo', sans-serif;
            text-align: center;
            margin: 0;
            padding: 40px;
            color: #000;
            background: #fff;
          }
          h1 { font-size: 40px; margin-bottom: 10px; }
          .category {
            display: inline-block;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 30px;
            border-bottom: 3px solid #000;
            padding-bottom: 5px;
          }
          .instruction {
            font-size: 20px;
            margin-bottom: 20px;
            font-weight: bold;
          }
          .words-container { margin-bottom: 40px; }
          @media print {
            @page { margin: 15mm; }
          }
        </style>
      </head>
      <body>
        <h1>もじさがしゲーム</h1>
        <div class="category">おだい：${gameState.categoryName}</div>

        <div class="instruction">したの ことばを さがして、まるで かこもう！</div>

        <div class="words-container">
          ${wordsHtml}
        </div>

        ${boardHtml}
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  if (!gameState) return null;

  return (
    <div className="min-h-screen bg-yellow-50 text-gray-800 font-sans p-2 sm:p-4 selection:bg-orange-200">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden print:shadow-none print:bg-transparent">

        {/* --- ヘッダー領域 --- */}
        <div className="bg-orange-400 p-4 sm:p-6 text-white text-center print:bg-transparent print:text-black print:p-0 print:mb-4">
          <h1 className="text-3xl sm:text-4xl font-black tracking-wider">もじさがしゲーム</h1>
          <p className="mt-2 text-orange-100 font-bold print:hidden">かくれていることばを みつけよう！</p>
        </div>

        {/* --- コントロール領域（印刷時は非表示） --- */}
        <div className="p-4 bg-orange-50 border-b border-orange-100 flex flex-col lg:flex-row gap-4 justify-between items-center print:hidden">
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 w-full lg:w-auto">
            <div className="flex items-center gap-2">
              <span className="font-bold text-orange-800 whitespace-nowrap">むずかしさ:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(level => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`w-10 h-10 rounded-full font-black text-lg transition-all
                      ${difficulty === level
                        ? 'bg-orange-500 text-white shadow-md scale-110'
                        : 'bg-white text-orange-400 border-2 border-orange-200 hover:bg-orange-100'}`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-orange-800 whitespace-nowrap">おだい:</span>
              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="p-2 rounded-xl border-2 border-orange-200 font-bold text-gray-700 bg-white cursor-pointer focus:outline-none focus:border-orange-500 min-w-[140px]"
              >
                <option value="random">🎲 おまかせ (ランダム)</option>
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={startNewGame}
            className="flex items-center justify-center gap-1 bg-white border-2 border-orange-400 text-orange-500 px-5 py-2 rounded-full font-bold hover:bg-orange-100 transition-colors active:scale-95 whitespace-nowrap w-full sm:w-auto"
          >
            <RefreshIcon /> あたらしいもんだい
          </button>
        </div>

        {/* --- ゲーム領域 --- */}
        <div className="p-4 sm:p-6 print:p-0">

          {/* さがすことばリスト */}
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
                    disabled={isRevealed || showAnswer}
                    className={`px-4 py-2 rounded-full text-lg sm:text-xl font-bold shadow-sm border-2 tracking-widest transition-transform print:border-black print:shadow-none print:px-2 print:py-0 print:text-2xl ${
                      isRevealed
                        ? "bg-white text-gray-700 border-blue-100 cursor-default"
                        : "bg-gray-200 text-gray-500 border-gray-300 hover:bg-gray-300 hover:scale-105 active:scale-95 cursor-pointer"
                    }`}
                  >
                    {isRevealed ? item.word : "？".repeat(item.word.length)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 7x7 グリッド */}
          <div className="flex justify-center mb-8">
            <div className="grid grid-cols-7 gap-1 sm:gap-2 p-2 sm:p-3 bg-orange-100 rounded-2xl print:bg-transparent print:border-2 print:border-black print:p-0 print:gap-0">
              {gameState.board.map((row, r) => (
                row.map((char, c) => {
                  const key = `${r}-${c}`;
                  const isSelected = selectedCells.has(key);
                  const isAnswer = showAnswer && gameState.answerCells.has(key);
                  const isWrong = showAnswer && isSelected && !gameState.answerCells.has(key);
                  const isHint = showHint && !showAnswer && gameState.hintCells.has(key);

                  // マスの基本スタイル
                  let cellClass = "w-11 h-11 sm:w-16 sm:h-16 flex items-center justify-center text-2xl sm:text-3xl font-black rounded-xl cursor-pointer transition-all select-none print:rounded-none print:border print:border-gray-500 print:w-14 print:h-14 print:text-4xl";

                  // 状態に応じたスタイル適用
                  if (isAnswer) {
                    // 正解のマス（答え合わせ時）
                    cellClass += " bg-green-400 text-white shadow-inner print:bg-gray-200 print:text-black";
                  } else if (isWrong) {
                    // 間違って塗ってしまったマス（答え合わせ時）
                    cellClass += " bg-red-400 text-white shadow-inner print:bg-transparent print:text-black";
                  } else if (isSelected) {
                    // ユーザーが塗っているマス
                    cellClass += " bg-orange-400 text-white shadow-inner scale-95 print:bg-transparent print:text-black print:scale-100";
                  } else if (isHint) {
                    // ヒントのマス（各単語の1文字目）
                    cellClass += " bg-yellow-300 text-yellow-900 animate-pulse print:bg-transparent print:text-black print:animate-none";
                  } else {
                    // 通常のマス
                    cellClass += " bg-white text-gray-700 shadow hover:bg-orange-50 print:bg-transparent print:shadow-none";
                  }

                  return (
                    <div
                      key={key}
                      className={cellClass}
                      onClick={() => handleCellClick(r, c)}
                    >
                      {char}
                    </div>
                  );
                })
              ))}
            </div>
          </div>

          {/* 答え合わせ後のメッセージ */}
          {showAnswer && (
            <div className="mb-6 p-4 text-center rounded-2xl bg-green-100 text-green-800 font-bold text-2xl animate-bounce print:hidden">
              ぜんぶ みつかったかな？✨
            </div>
          )}

          {/* 印刷案内のモーダル */}
          {showPrintModal && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
              <div className="bg-white p-6 rounded-3xl max-w-sm w-full text-center shadow-2xl">
                <div className="text-4xl mb-2">⚠️</div>
                <h3 className="text-xl font-black text-gray-800 mb-4">いんさつ できません</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  ブラウザの「ポップアップブロック」がオンになっているため、いんさつ用の画面がひらけませんでした。<br/><br/>
                  ブラウザの設定で<strong>ポップアップをきょか</strong>してから、もういちどボタンをおしてください。
                </p>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-bold text-lg transition-transform active:scale-95"
                >
                  とじる
                </button>
              </div>
            </div>
          )}

          {/* --- アクションボタン領域（印刷時は非表示） --- */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 print:hidden">
            <button
              onClick={() => setShowHint(true)}
              disabled={showAnswer}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-yellow-900 px-6 py-4 rounded-full font-black text-lg shadow-md transition-transform active:scale-95"
            >
              <LightbulbIcon /> ヒント
            </button>
            <button
              onClick={() => setShowAnswer(true)}
              disabled={showAnswer}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-4 rounded-full font-black text-lg shadow-md transition-transform active:scale-95"
            >
              <CheckIcon /> こたえあわせ
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-4 rounded-full font-black text-lg shadow-md transition-transform active:scale-95"
            >
              <PrinterIcon /> いんさつ
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
