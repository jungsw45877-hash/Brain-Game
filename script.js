// ==========================================
// BRAIN ARCADE
// ==========================================


// HTML 요소 가져오기

const homeScreen = document.getElementById("homeScreen");
const gameScreen = document.getElementById("gameScreen");
const resultScreen = document.getElementById("resultScreen");

const gameArea = document.getElementById("gameArea");

const gameTitle = document.getElementById("gameTitle");
const gameCategory = document.getElementById("gameCategory");

const gameInstructions = document.getElementById("gameInstructions");

const timerElement = document.getElementById("timer");

const gameScoreElement = document.getElementById("gameScore");
const gameRoundElement = document.getElementById("gameRound");
const gameBestElement = document.getElementById("gameBest");

const bestScoreElement = document.getElementById("bestScore");
const playedCountElement = document.getElementById("playedCount");

const recordBestElement = document.getElementById("recordBest");
const recordPlayedElement = document.getElementById("recordPlayed");

const finalScoreElement = document.getElementById("finalScore");
const finalBestElement = document.getElementById("finalBest");
const finalPlayedElement = document.getElementById("finalPlayed");

const resultMessage = document.getElementById("resultMessage");


// ==========================================
// localStorage
// ==========================================

const STORAGE_KEY = "brainArcadeData";


let storageData = JSON.parse(
  localStorage.getItem(STORAGE_KEY)
) || {

  bestScore: 0,

  played: 0,

  gameBest: {

    reaction: 0,
    memory: 0,
    number: 0,
    color: 0,
    focus: 0

  }

};


// 기록 저장

function saveData() {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(storageData)
  );

}


// 기록 화면 업데이트

function updateRecords() {

  bestScoreElement.textContent = storageData.bestScore;

  playedCountElement.textContent = storageData.played;

  recordBestElement.textContent = storageData.bestScore;

  recordPlayedElement.textContent = storageData.played;

}


updateRecords();


// ==========================================
// 게임 데이터
// ==========================================

const gameData = {

  reaction: {

    title: "반응속도 테스트",

    category: "REACTION TEST",

    instruction: "화면이 초록색으로 바뀌면 최대한 빠르게 클릭하세요.",

    time: 30

  },

  memory: {

    title: "기억력 카드",

    category: "MEMORY TEST",

    instruction: "같은 그림의 카드를 찾아 모든 짝을 맞히세요.",

    time: 60

  },

  number: {

    title: "숫자 순서",

    category: "SEQUENCE TEST",

    instruction: "1부터 숫자를 순서대로 눌러보세요.",

    time: 30

  },

  color: {

    title: "색깔 구분",

    category: "COLOR TEST",

    instruction: "글자가 아니라 실제 글자의 색깔과 같은 버튼을 선택하세요.",

    time: 30

  },

  focus: {

    title: "집중력 테스트",

    category: "FOCUS TEST",

    instruction: "화면에 나타나는 목표물을 빠르게 클릭하세요.",

    time: 30

  }

};


// ==========================================
// 게임 상태
// ==========================================

let currentGame = null;

let score = 0;

let round = 0;

let timeLeft = 30;

let timerInterval = null;

let gameRunning = false;

let cleanupGame = null;

let reactionStartTime = 0;

let reactionTimeout = null;


// 화면 전환

function showScreen(screen) {

  homeScreen.classList.remove("active");

  gameScreen.classList.remove("active");

  resultScreen.classList.remove("active");

  screen.classList.add("active");

}


// ==========================================
// 게임 시작
// ==========================================

function startGame(gameName) {

  clearGame();

  currentGame = gameName;

  score = 0;

  round = 0;

  timeLeft = gameData[gameName].time;

  gameRunning = false;

  gameTitle.textContent = gameData[gameName].title;

  gameCategory.textContent = gameData[gameName].category;

  gameInstructions.textContent = gameData[gameName].instruction;

  gameScoreElement.textContent = score;

  gameRoundElement.textContent = round;

  gameBestElement.textContent =
    storageData.gameBest[gameName];

  timerElement.textContent = timeLeft;

  showScreen(gameScreen);

  gameArea.innerHTML = `

    <button id="gameStartButton" class="gold-button">

      START GAME

    </button>

  `;

  document
    .getElementById("gameStartButton")
    .addEventListener("click", beginGame);

}


// 실제 게임 시작

function beginGame() {

  if (gameRunning) return;

  gameRunning = true;

  score = 0;

  round = 0;

  timeLeft = gameData[currentGame].time;

  gameScoreElement.textContent = score;

  gameRoundElement.textContent = round;

  timerElement.textContent = timeLeft;

  gameArea.innerHTML = "";

  startTimer();

  if (currentGame === "reaction") {

    initReaction();

  }

  if (currentGame === "memory") {

    initMemory();

  }

  if (currentGame === "number") {

    initNumber();

  }

  if (currentGame === "color") {

    initColor();

  }

  if (currentGame === "focus") {

    initFocus();

  }

}


// ==========================================
// 타이머
// ==========================================

function startTimer() {

  clearInterval(timerInterval);

  timerInterval = setInterval(() => {

    timeLeft--;

    timerElement.textContent = timeLeft;

    if (timeLeft <= 0) {

      finishGame();

    }

  }, 1000);

}


// ==========================================
// 점수 처리
// ==========================================

function addScore(points) {

  score += points;

  round++;

  gameScoreElement.textContent = score;

  gameRoundElement.textContent = round;

}


// ==========================================
// 게임 종료
// ==========================================

function finishGame() {

  if (!gameRunning) return;

  gameRunning = false;

  clearInterval(timerInterval);

  if (reactionTimeout) {

    clearTimeout(reactionTimeout);

    reactionTimeout = null;

  }

  if (cleanupGame) {

    cleanupGame();

    cleanupGame = null;

  }

  storageData.played++;

  if (score > storageData.bestScore) {

    storageData.bestScore = score;

  }

  if (score > storageData.gameBest[currentGame]) {

    storageData.gameBest[currentGame] = score;

  }

  saveData();

  updateRecords();

  finalScoreElement.textContent = score;

  finalBestElement.textContent = storageData.gameBest[currentGame];

  finalPlayedElement.textContent = storageData.played;

  resultMessage.textContent = getResultMessage(score);

  showScreen(resultScreen);

}


// 결과 메시지

function getResultMessage(score) {

  if (score >= 100) {

    return "놀라운 집중력입니다! 당신의 두뇌는 빛나고 있어요.";

  }

  if (score >= 50) {

    return "좋은 결과입니다! 조금 더 연습하면 최고 기록을 갱신할 수 있어요.";

  }

  return "좋은 도전이었습니다! 다시 도전해서 기록을 높여보세요.";

}


// 게임 정리

function clearGame() {

  clearInterval(timerInterval);

  if (reactionTimeout) {

    clearTimeout(reactionTimeout);

    reactionTimeout = null;

  }

  if (cleanupGame) {

    cleanupGame();

    cleanupGame = null;

  }

  gameRunning = false;

}


// ==========================================
// 1. 반응속도 테스트
// ==========================================

function initReaction() {

  let state = "waiting";

  let totalReactionScore = 0;

  let reactionCount = 0;

  let target;

  let startButton;

  let stopped = false;


  function createTarget() {

    if (stopped || !gameRunning) return;

    state = "waiting";

    gameArea.innerHTML = `

      <button class="reaction-target">

        WAIT...

      </button>

    `;

    target = gameArea.querySelector(".reaction-target");

    target.addEventListener("click", handleClick);

    const delay = 1200 + Math.random() * 2800;

    reactionTimeout = setTimeout(() => {

      if (!gameRunning || stopped) return;

      state = "go";

      target.classList.add("go");

      target.textContent = "CLICK!";

      reactionStartTime = performance.now();

    }, delay);

  }


  function handleClick() {

    if (state === "waiting") {

      clearTimeout(reactionTimeout);

      reactionTimeout = null;

      target.textContent = "TOO EARLY!";

      target.classList.add("ready");

      state = "penalty";

      setTimeout(createTarget, 700);

      return;

    }

    if (state === "go") {

      const reactionTime =
        performance.now() - reactionStartTime;

      const points = Math.max(
        1,
        Math.round(1000 / reactionTime * 100)
      );

      addScore(points);

      reactionCount++;

      totalReactionScore += reactionTime;

      target.textContent =
        Math.round(reactionTime) + " ms";

      state = "done";

      setTimeout(createTarget, 650);

    }

  }


  createTarget();


  cleanupGame = () => {

    stopped = true;

    clearTimeout(reactionTimeout);

    if (target) {

      target.removeEventListener("click", handleClick);

    }

  };

}


// ==========================================
// 2. 기억력 카드
// ==========================================

function initMemory() {

  const symbols = [

    "★", "★",
    "◆", "◆",
    "●", "●",
    "▲", "▲",
    "♥", "♥",
    "♣", "♣"

  ];

  symbols.sort(() => Math.random() - .5);

  let firstCard = null;

  let secondCard = null;

  let lock = false;

  let matched = 0;

  gameArea.innerHTML = `

    <div class="memory-grid"></div>

  `;

  const grid = gameArea.querySelector(".memory-grid");

  symbols.forEach((symbol, index) => {

    const button = document.createElement("button");

    button.className = "memory-card";

    button.textContent = "?";

    button.dataset.symbol = symbol;

    button.dataset.index = index;

    button.addEventListener("click", () => {

      if (

        lock ||

        button.classList.contains("flipped") ||

        button.classList.contains("matched")

      ) return;

      button.classList.add("flipped");

      button.textContent = symbol;

      if (!firstCard) {

        firstCard = button;

        return;

      }

      secondCard = button;

      lock = true;

      if (

        firstCard.dataset.symbol ===

        secondCard.dataset.symbol

      ) {

        firstCard.classList.add("matched");

        secondCard.classList.add("matched");

        matched++;

        addScore(20);

        firstCard = null;

        secondCard = null;

        lock = false;

        if (matched === symbols.length / 2) {

          setTimeout(() => {

            if (gameRunning) {

              initMemory();

            }

          }, 700);

        }

      } else {

        setTimeout(() => {

          firstCard.classList.remove("flipped");

          secondCard.classList.remove("flipped");

          firstCard.textContent = "?";

          secondCard.textContent = "?";

          firstCard = null;

          secondCard = null;

          lock = false;

        }, 650);

      }

    });

    grid.appendChild(button);

  });

}


// ==========================================
// 3. 숫자 순서
// ==========================================

function initNumber() {

  let nextNumber = 1;

  const numbers = Array.from(
    { length: 16 },
    (_, i) => i + 1
  );

  numbers.sort(() => Math.random() - .5);

  gameArea.innerHTML = `

    <div class="number-grid"></div>

  `;

  const grid = gameArea.querySelector(".number-grid");

  numbers.forEach(number => {

    const button = document.createElement("button");

    button.className = "number-button";

    button.textContent = number;

    button.addEventListener("click", () => {

      if (number !== nextNumber) {

        button.style.opacity = ".4";

        return;

      }

      addScore(10);

      button.style.visibility = "hidden";

      nextNumber++;

      if (nextNumber > 16) {

        setTimeout(() => {

          if (gameRunning) {

            initNumber();

          }

        }, 400);

      }

    });

    grid.appendChild(button);

  });

}


// ==========================================
// 4. 색깔 구분
// ==========================================

function initColor() {

  const colors = [

    { name: "RED", value: "#b84a3c" },

    { name: "BLUE", value: "#4879a9" },

    { name: "GREEN", value: "#65965b" },

    { name: "YELLOW", value: "#d0a64c" }

  ];

  const answer = colors[
    Math.floor(Math.random() * colors.length)
  ];

  const wrongColors = colors.filter(
    c => c.name !== answer.name
  );

  const choices = [
    answer,
    ...wrongColors.slice(0, 3)
  ];

  choices.sort(() => Math.random() - .5);

  gameArea.innerHTML = `

    <div class="color-word"></div>

    <div class="color-options"></div>

  `;

  const word = gameArea.querySelector(".color-word");

  const options = gameArea.querySelector(".color-options");

  const fakeWord = colors[
    Math.floor(Math.random() * colors.length)
  ];

  word.textContent = fakeWord.name;

  word.style.color = answer.value;

  choices.forEach(color => {

    const button = document.createElement("button");

    button.className = "color-option";

    button.style.background = color.value;

    button.addEventListener("click", () => {

      if (color.name === answer.name) {

        addScore(15);

      } else {

        score = Math.max(0, score - 5);

        gameScoreElement.textContent = score;

      }

      initColor();

    });

    options.appendChild(button);

  });

}


// ==========================================
// 5. 집중력 테스트
// ==========================================

function initFocus() {

  gameArea.innerHTML = "";

  const target = document.createElement("button");

  target.className = "focus-target";

  gameArea.appendChild(target);

  moveTarget();

  target.addEventListener("click", () => {

    addScore(10);

    moveTarget();

  });


  function moveTarget() {

    const areaWidth = gameArea.clientWidth;

    const areaHeight = gameArea.clientHeight;

    const size = 45;

    const x = Math.random() * Math.max(0, areaWidth - size);

    const y = Math.random() * Math.max(0, areaHeight - size);

    target.style.left = x + "px";

    target.style.top = y + "px";

  }

}


// ==========================================
// 이벤트
// ==========================================

document
  .getElementById("startButton")
  .addEventListener("click", () => {

    startGame("reaction");

  });


document
  .querySelectorAll(".game-card")
  .forEach(card => {

    card.addEventListener("click", () => {

      startGame(card.dataset.game);

    });

  });


document
  .getElementById("backButton")
  .addEventListener("click", () => {

    clearGame();

    showScreen(homeScreen);

  });


document
  .getElementById("retryButton")
  .addEventListener("click", () => {

    startGame(currentGame);

  });


document
  .getElementById("menuButton")
  .addEventListener("click", () => {

    showScreen(homeScreen);

  });


document
  .getElementById("resetRecord")
  .addEventListener("click", () => {

    const confirmed = confirm(
      "모든 게임 기록을 초기화할까요?"
    );

    if (!confirmed) return;

    storageData = {

      bestScore: 0,

      played: 0,

      gameBest: {

        reaction: 0,
        memory: 0,
        number: 0,
        color: 0,
        focus: 0

      }

    };

    saveData();

    updateRecords();

  });