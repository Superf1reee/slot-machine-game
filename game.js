// Основная игровая логика
let gameState = {
    balance: 5000,
    currentBet: 500,
    spinsCount: 0,
    winsCount: 0,
    lossesCount: 0,
    biggestWin: 0,
    playerLevel: 1,
    unlockedCombinations: new Set(),
    achievements: new Set(),
    isSpinning: false,
    isAutoSpinning: false,
    autoSpinInterval: null
};

// Символы с увеличенным шансом выигрыша
const symbols = [
    '🍒', '🍒', '🍒', '🍒', // Вишня - самый частый
    '🍋', '🍋', '🍋',
    '🍉', '🍉', '🍉',
    '🍊', '🍊',
    '🍇', '🍇',
    '⭐', '⭐',
    '💎',
    '7️⃣',
    '🔔',
    '💖',
    '🍀',
    '⚡'
];

// Комбинации с увеличенными шансами
const combinations = [
    { symbols: ['🍒', '🍒', '🍒'], name: "ТРИ ВИШНИ", multiplier: 3, chance: 0.1 },
    { symbols: ['🍋', '🍋', '🍋'], name: "ТРИ ЛИМОНА", multiplier: 4, chance: 0.08 },
    { symbols: ['🍉', '🍉', '🍉'], name: "ТРИ АРБУЗА", multiplier: 5, chance: 0.07 },
    { symbols: ['🍊', '🍊', '🍊'], name: "ТРИ АПЕЛЬСИНА", multiplier: 6, chance: 0.06 },
    { symbols: ['🍇', '🍇', '🍇'], name: "ТРИ ВИНОГРАДА", multiplier: 8, chance: 0.05 },
    { symbols: ['⭐', '⭐', '⭐'], name: "ТРИ ЗВЕЗДЫ", multiplier: 10, chance: 0.04 },
    { symbols: ['💎', '💎', '💎'], name: "ТРИ АЛМАЗА", multiplier: 25, chance: 0.02 },
    { symbols: ['7️⃣', '7️⃣', '7️⃣'], name: "ТРИ СЕМЁРКИ", multiplier: 50, chance: 0.01 },
    { symbols: ['🔔', '🔔', '🔔'], name: "ТРИ КОЛОКОЛА", multiplier: 15, chance: 0.03 },
    { symbols: ['💖', '💖', '💖'], name: "ТРИ СЕРДЦА", multiplier: 12, chance: 0.035 },
    { symbols: ['🍀', '🍀', '🍀'], name: "ТРИ КЛЕВЕРА", multiplier: 20, chance: 0.025 },
    { symbols: ['⚡', '⚡', '⚡'], name: "ТРИ МОЛНИИ", multiplier: 18, chance: 0.03 },
    
    // Комбинации с 4 символами
    { symbols: ['🍒', '🍒', '🍒', '🍒'], name: "ЧЕТЫРЕ ВИШНИ", multiplier: 8, chance: 0.02 },
    { symbols: ['💎', '💎', '💎', '💎'], name: "ЧЕТЫРЕ АЛМАЗА", multiplier: 100, chance: 0.005 },
    
    // Комбинации с 5 символами (очень редкие)
    { symbols: ['💎', '💎', '💎', '💎', '💎'], name: "ПЯТЬ АЛМАЗОВ", multiplier: 500, chance: 0.001 },
    { symbols: ['7️⃣', '7️⃣', '7️⃣', '7️⃣', '7️⃣'], name: "ПЯТЬ СЕМЁРОК", multiplier: 1000, chance: 0.0005 }
];

// Достижения
const achievements = [
    { id: 'first_spin', name: "ПЕРВЫЙ ПРОЕБ", icon: "🎰", description: "Сделал первый спин" },
    { id: 'first_win', name: "ПЕРВАЯ ПОБЕДА", icon: "🏆", description: "Выиграл первый раз" },
    { id: 'big_win', name: "КРУТОЙ ЧУВАК", icon: "💰", description: "Выиграл больше 5000 денег" },
    { id: 'jackpot', name: "ДЖЕКПОТЕР", icon: "💎", description: "Выиграл джекпот" },
    { id: 'addicted', name: "ЗАВИСИМЫЙ", icon: "😵", description: "Сделал 100 спинов" },
    { id: 'rich_bitch', name: "БОГАТЫЙ ПИДОР", icon: "👑", description: "Накопил 100000 денег" },
    { id: 'loser', name: "ПРОФЕССИОНАЛЬНЫЙ ЛУЗЕР", icon: "💩", description: "Проиграл 10000 денег" },
    { id: 'cheater', name: "ЧИТЕР", icon: "🕵️", description: "Использовал все читы" }
];

// Массив оскорблений (часть в этом файле, остальные в insults.json)
const insults = {
    spinning: [
        "КРУТИСЬ СУКА КРУТИСЬ...",
        "ЖДИ ДОЛБОЁБ ЖДИ...",
        "СЛОТЫ ГРУЗЯТ ТВОЙ КОШМАР...",
        "ЕЩЕ СЕКУНДУ ПИЗДЕЦА...",
        "БАРАБАНЫ ЕБАШАТ В ХУЙ...",
        "ПОЧТИ... ПОЧТИ... БЛЯТЬ...",
        "ТЕРПЕНИЕ ЛОХА...",
        "ВРАЩЕНИЕ ТВОЕЙ ЖИЗНИ..."
    ],
    
    losing: [
        "ПРОИГРАЛ! ИДИ В ЖОПУ!",
        "СЛИЛ БАБКИ! ЛОШАРА!",
        "ВСЁ ПРОЕБАЛ! ДЕБИЛ!",
        "ДАЖЕ СЛОТЫ ТЕБЯ НЕНАВИДЯТ!",
        "ТЫ РОЖДЕН ДЛЯ ПОРАЖЕНИЙ!",
        "ВЫИГРЫША НЕТ! ТОЛЬКО ПИЗДА!",
        "ПРОЕБАЛ КАК ПОСЛЕДНИЙ ЛОХ!",
        "МАМКИНЫ ДЕНЬГИ ПРОДРОЧИЛ?",
        "НИЩИЙ ОПЯТЬ НИЩИЙ!",
        "ДАЖЕ ОБЕЗЬЯНА ИГРАЕТ ЛУЧШЕ!"
    ],
    
    winning: [
        "ПОВЕЗЛО УРОДУ!",
        "ВЫИГРАЛ! НО ВСЁ РАВНО ЛОХ!",
        "ДАЖЕ СВИНЬЯ НАЙДЁТ ЖЁЛУДЬ!",
        "УДАЧА ДЕБИЛА!",
        "ВЫИГРАЛ ГРОШИ! ГОРДИСЬ!",
        "ПОБЕДА СЛУЧАЙНОГО ИДИОТА!",
        "ЗАБЕРИ СВОИ ГРЯЗНЫЕ ДЕНЬГИ!",
        "ВЫИГРАЛ, НО УМА НЕ ПРИБАВИЛОСЬ!"
    ],
    
    jackpot: [
        "ЕБАТЬ! ДЖЕКПОТ!",
        "ДАЖЕ ТАКОЙ ДАУН МОЖЕТ ВЫИГРАТЬ!",
        "МИЛЛИОНЕР-ЛОХ! ПОЗДРАВЛЯЮ!",
        "ДЖЕКПОТ! КУПИ СЕБЕ МОЗГИ!",
        "УДАЧА ИДИОТА! ТЫ ВЫИГРАЛ ВСЁ!",
        "МЕГАДЖЕКПОТ! ТЕБЕ ПРОСТО ПОВЕЗЛО!"
    ]
};

function initGame() {
    loadGameState();
    renderCombinations();
    renderAchievements();
    updateUI();
    
    // Разблокируем первые комбинации
    combinations.slice(0, 5).forEach(combo => {
        gameState.unlockedCombinations.add(combo);
    });
    
    // Назначаем обработчики
    document.getElementById('spinButton').addEventListener('click', spinSlots);
}

function loadGameState() {
    if (!window.currentUser) return;
    
    const savedState = localStorage.getItem(`casino_game_${window.currentUser.username}`);
    if (savedState) {
        try {
            const parsed = JSON.parse(savedState);
            gameState = { ...gameState, ...parsed };
            
            // Восстанавливаем Set'ы
            gameState.unlockedCombinations = new Set(parsed.unlockedCombinations || []);
            gameState.achievements = new Set(parsed.achievements || []);
        } catch (e) {
            console.error('Ошибка загрузки состояния:', e);
        }
    }
}

function saveGameState() {
    if (!window.currentUser) return;
    
    const stateToSave = {
        ...gameState,
        unlockedCombinations: Array.from(gameState.unlockedCombinations),
        achievements: Array.from(gameState.achievements)
    };
    
    localStorage.setItem(`casino_game_${window.currentUser.username}`, JSON.stringify(stateToSave));
}

function updateUI() {
    document.getElementById('balanceAmount').textContent = gameState.balance;
    document.getElementById('currentBet').textContent = gameState.currentBet;
    document.getElementById('spinsCount').textContent = gameState.spinsCount;
    document.getElementById('winsCount').textContent = gameState.winsCount;
    document.getElementById('lossesCount').textContent = gameState.lossesCount;
    document.getElementById('biggestWin').textContent = gameState.biggestWin;
    document.getElementById('playerLevel').textContent = gameState.playerLevel;
    
    const spinBtn = document.getElementById('spinButton');
    spinBtn.disabled = gameState.isSpinning || gameState.balance < gameState.currentBet;
}

function changeBet(amount) {
    const newBet = gameState.currentBet + amount;
    if (newBet >= 100 && newBet <= gameState.balance) {
        gameState.currentBet = newBet;
        showInsult(`СТАВКА ${newBet}! СМЕЛО ДЛЯ ДАУНА!`);
        updateUI();
    }
}

function maxBet() {
    gameState.currentBet = Math.min(5000, gameState.balance);
    showInsult("ВСЁ НА КОН! ТЫ ИЛИ ГЕРОЙ ИЛИ ПИДОР!");
    updateUI();
}

function spinSlots() {
    if (gameState.isSpinning || gameState.balance < gameState.currentBet) return;
    
    gameState.balance -= gameState.currentBet;
    gameState.spinsCount++;
    gameState.isSpinning = true;
    
    // Проверяем достижения
    checkAchievements();
    
    updateUI();
    
    // Анимация
    const slots = ['slot1', 'slot2', 'slot3', 'slot4', 'slot5'];
    let spinCounter = 0;
    
    const spinInterval = setInterval(() => {
        spinCounter++;
        
        // Показываем разные оскорбления во время крутки
        if (spinCounter % 2 === 0) {
            showRandomInsult('spinning');
        }
        
        // Анимируем слоты
        slots.forEach(id => {
            const slot = document.getElementById(id);
            slot.classList.add('spinning');
            slot.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        });
        
        // Останавливаем через 3 секунды
        if (spinCounter >= 30) {
            clearInterval(spinInterval);
            
            // Генерируем результаты
            const results = generateResults();
            
            // Останавливаем анимацию
            slots.forEach((id, index) => {
                const slot = document.getElementById(id);
                slot.classList.remove('spinning');
                slot.textContent = results[index];
            });
            
            // Проверяем выигрыш
            checkWin(results);
            gameState.isSpinning = false;
            updateUI();
            saveGameState();
            
            // Автоспин
            if (gameState.isAutoSpinning && gameState.balance >= gameState.currentBet) {
                setTimeout(spinSlots, 1000);
            }
        }
    }, 100);
}

function generateResults() {
    const results = [];
    
    // Увеличиваем шансы на выигрыш
    const shouldWin = Math.random() < 0.4; // 40% шанс на выигрыш
    
    if (shouldWin && gameState.unlockedCombinations.size > 0) {
        // Выбираем случайную разблокированную комбинацию
        const combos = Array.from(gameState.unlockedCombinations);
        const winCombo = combos[Math.floor(Math.random() * combos.length)];
        
        // Заполняем результаты комбинацией
        for (let i = 0; i < 5; i++) {
            if (i < winCombo.symbols.length) {
                results.push(winCombo.symbols[i]);
            } else {
                results.push(symbols[Math.floor(Math.random() * symbols.length)]);
            }
        }
    } else {
        // Случайные символы
        for (let i = 0; i < 5; i++) {
            results.push(symbols[Math.floor(Math.random() * symbols.length)]);
        }
    }
    
    return results;
}

function checkWin(results) {
    let winAmount = 0;
    let winCombo = null;
    
    // Проверяем все разблокированные комбинации
    for (const combo of gameState.unlockedCombinations) {
        const comboLength = combo.symbols.length;
        
        for (let i = 0; i <= results.length - comboLength; i++) {
            const slice = results.slice(i, i + comboLength);
            if (JSON.stringify(slice) === JSON.stringify(combo.symbols)) {
                winCombo = combo;
                winAmount = gameState.currentBet * combo.multiplier;
                break;
            }
        }
        
        if (winCombo) break;
    }
    
    if (winCombo) {
        // ВЫИГРЫШ
        gameState.balance += winAmount;
        gameState.winsCount++;
        
        if (winAmount > gameState.biggestWin) {
            gameState.biggestWin = winAmount;
            unlockAchievement('big_win');
        }
        
        if (winCombo.multiplier >= 100) {
            unlockAchievement('jackpot');
            showRandomInsult('jackpot');
        } else {
            showRandomInsult('winning');
        }
        
        // Разблокировка следующей комбинации
        const currentIndex = combinations.indexOf(winCombo);
        if (currentIndex < combinations.length - 1) {
            const nextCombo = combinations[currentIndex + 1];
            if (!gameState.unlockedCombinations.has(nextCombo)) {
                gameState.unlockedCombinations.add(nextCombo);
                showInsult(`РАЗБЛОКИРОВАНА КОМБИНАЦИЯ: ${nextCombo.name}!`);
                renderCombinations();
            }
        }
        
        // Повышение уровня
        if (gameState.winsCount % 5 === 0) {
            gameState.playerLevel++;
            showInsult(`ПОВЫШЕНИЕ УРОВНЯ! ТЕПЕРЬ ТЫ УРОВЕНЬ ${gameState.playerLevel}!`);
        }
        
        showInsult(`${winCombo.name}! ВЫИГРЫШ: ${winAmount} ДЕНЕГ!`);
        
    } else {
        // ПРОИГРЫШ
        gameState.lossesCount++;
        showRandomInsult('losing');
        
        // Разблокировка достижения для лузера
        if (gameState.lossesCount >= 10) {
            unlockAchievement('loser');
        }
    }
    
    // Разблокировка достижений
    if (gameState.spinsCount === 1) unlockAchievement('first_spin');
    if (gameState.winsCount === 1) unlockAchievement('first_win');
    if (gameState.spinsCount >= 100) unlockAchievement('addicted');
    if (gameState.balance >= 100000) unlockAchievement('rich_bitch');
}

function renderCombinations() {
    const list = document.getElementById('combinationsList');
    list.innerHTML = '';
    
    combinations.forEach(combo => {
        const isUnlocked = gameState.unlockedCombinations.has(combo);
        
        const div = document.createElement('div');
        div.className = 'combo-item';
        div.style.opacity = isUnlocked ? '1' : '0.3';
        
        div.innerHTML = `
            <div class="combo-symbols">${combo.symbols.join('')}</div>
            <div class="combo-info">
                <div class="combo-name">${combo.name}</div>
                <div class="combo-multiplier">x${combo.multiplier}</div>
            </div>
            <div>${isUnlocked ? '✅' : '🔒'}</div>
        `;
        
        list.appendChild(div);
    });
}

function renderAchievements() {
    const list = document.getElementById('achievementsList');
    list.innerHTML = '';
    
    achievements.forEach(ach => {
        const isUnlocked = gameState.achievements.has(ach.id);
        
        const div = document.createElement('div');
        div.className = `achievement ${isUnlocked ? 'unlocked' : ''}`;
        
        div.innerHTML = `
            <div class="achievement-icon">${ach.icon}</div>
            <div class="achievement-name">${ach.name}</div>
            <div class="achievement-desc">${ach.description}</div>
        `;
        
        list.appendChild(div);
    });
}

function checkAchievements() {
    // Проверка достижений выполняется в других функциях
}

function unlockAchievement(achievementId) {
    if (!gameState.achievements.has(achievementId)) {
        gameState.achievements.add(achievementId);
        const achievement = achievements.find(a => a.id === achievementId);
        if (achievement) {
            showInsult(`ДОСТИЖЕНИЕ РАЗБЛОКИРОВАНО: ${achievement.name}!`);
            renderAchievements();
        }
    }
}

// Функции оскорблений
function showInsult(text) {
    const display = document.getElementById('insultDisplay');
    display.textContent = text;
    
    // Анимация
    display.style.animation = 'none';
    setTimeout(() => {
        display.style.animation = 'insultPulse 1s infinite';
    }, 10);
}

function showRandomInsult(type) {
    const array = insults[type] || insults.losing;
    const insult = array[Math.floor(Math.random() * array.length)];
    showInsult(insult);
}

function insultMeMore() {
    const allTypes = ['spinning', 'losing', 'winning', 'jackpot'];
    const randomType = allTypes[Math.floor(Math.random() * allTypes.length)];
    showRandomInsult(randomType);
}

// Читы
function cheatMoney() {
    gameState.balance += 10000;
    unlockAchievement('cheater');
    showInsult("ЧИТ: ДОБАВЛЕНО 10000 ДЕНЕГ! ТЫ ЖУЛИК!");
    updateUI();
    saveGameState();
}

function cheatJackpot() {
    const slots = ['slot1', 'slot2', 'slot3', 'slot4', 'slot5'];
    slots.forEach((id, index) => {
        document.getElementById(id).textContent = '💎';
    });
    
    const winAmount = gameState.currentBet * 500;
    gameState.balance += winAmount;
    gameState.winsCount++;
    gameState.biggestWin = Math.max(gameState.biggestWin, winAmount);
    
    unlockAchievement('jackpot');
    unlockAchievement('cheater');
    showInsult("ЧИТЕРСКИЙ ДЖЕКПОТ! 500x! ТЫ ОБМАНЩИК!");
    updateUI();
    saveGameState();
}

function cheatLoseAll() {
    gameState.balance = 0;
    unlockAchievement('cheater');
    showInsult("ЧИТ: ВСЁ ПРОЕБАНО! ТИПИЧНЫЙ ЛОХ!");
    updateUI();
    saveGameState();
}

function toggleAutoSpin() {
    if (gameState.isAutoSpinning) {
        clearInterval(gameState.autoSpinInterval);
        gameState.isAutoSpinning = false;
        showInsult("АВТО-СПИН ВЫКЛЮЧЕН! РУКИ ОТДОХНУЛИ!");
    } else {
        if (gameState.balance < gameState.currentBet) {
            showInsult("НЕТ ДЕНЕГ ДЛЯ АВТО-СПИНА, БЕДНЯК!");
            return;
        }
        gameState.isAutoSpinning = true;
        showInsult("АВТО-СПИН ВКЛЮЧЕН! СИДИ И СМОТРИ КАК ПРОЕБЫВАЕШЬ!");
        spinSlots();
    }
}

function resetGame() {
    if (!confirm("Точно хочешь начать сначала, дебил? Все твои достижения сбросятся!")) {
        return;
    }
    
    gameState = {
        balance: 5000,
        currentBet: 500,
        spinsCount: 0,
        winsCount: 0,
        lossesCount: 0,
        biggestWin: 0,
        playerLevel: 1,
        unlockedCombinations: new Set(),
        achievements: new Set(),
        isSpinning: false,
        isAutoSpinning: false,
        autoSpinInterval: null
    };
    
    // Разблокируем первые комбинации
    combinations.slice(0, 5).forEach(combo => {
        gameState.unlockedCombinations.add(combo);
    });
    
    const slots = ['slot1', 'slot2', 'slot3', 'slot4', 'slot5'];
    const defaultSymbols = ['🍒', '🍋', '🍉', '⭐', '💎'];
    slots.forEach((id, index) => {
        document.getElementById(id).textContent = defaultSymbols[index];
    });
    
    renderCombinations();
    renderAchievements();
    showInsult("ИГРА СБРОШЕНА! НАЧНИ СНАЧАЛА, ДЕБИЛ!");
    updateUI();
    saveGameState();
}

// Загрузка оскорблений из JSON
function loadInsults() {
    // Можно загрузить из insults.json, но для простоты оставим в коде
    console.log("Оскорбления загружены, готов унижать лохов!");
}

// Экспортируем функции в глобальную область видимости
window.changeBet = changeBet;
window.maxBet = maxBet;
window.spinSlots = spinSlots;
window.cheatMoney = cheatMoney;
window.cheatJackpot = cheatJackpot;
window.cheatLoseAll = cheatLoseAll;
window.toggleAutoSpin = toggleAutoSpin;
window.insultMeMore = insultMeMore;
window.resetGame = resetGame;
window.initGame = initGame;
window.loadGameState = loadGameState;