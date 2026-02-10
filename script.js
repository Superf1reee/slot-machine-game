// Главный файл - инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    console.log('УЁБИЩНОЕ КАЗИНО загружается...');
    
    // Проверяем, есть ли сохранённый пользователь
    const savedUser = localStorage.getItem('casino_user');
    if (savedUser) {
        try {
            const user = JSON.parse(savedUser);
            showGameScreen(user);
        } catch (e) {
            localStorage.removeItem('casino_user');
            showAuthScreen();
        }
    } else {
        showAuthScreen();
    }
    
    // Загружаем оскорбления
    loadInsults();
    
    // Инициализируем игру
    if (typeof initGame === 'function') {
        initGame();
    }
});

function showAuthScreen() {
    document.getElementById('authScreen').style.display = 'block';
    document.getElementById('gameScreen').style.display = 'none';
}

function showGameScreen(user) {
    document.getElementById('authScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'block';
    document.getElementById('currentUser').textContent = user.username;
    
    // Восстанавливаем состояние игры пользователя
    if (typeof loadGameState === 'function') {
        loadGameState(user.username);
    }
}

// Глобальные переменные
window.currentUser = null;
window.gameState = {
    balance: 5000,
    level: 1,
    spins: 0,
    wins: 0,
    losses: 0,
    biggestWin: 0,
    achievements: []
};