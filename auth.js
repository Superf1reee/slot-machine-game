// Система авторизации (очень простая, для лохов)
document.addEventListener('DOMContentLoaded', function() {
    const registerBtn = document.getElementById('registerBtn');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (registerBtn) {
        registerBtn.addEventListener('click', registerUser);
    }
    
    if (loginBtn) {
        loginBtn.addEventListener('click', loginUser);
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logoutUser);
    }
});

function registerUser() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    if (!username || !password) {
        showAuthMessage('Заполни все поля, дебил!', 'error');
        return;
    }
    
    if (username.length < 3) {
        showAuthMessage('Имя слишком короткое, как твой хуй!', 'error');
        return;
    }
    
    if (password.length < 3) {
        showAuthMessage('Пароль слишком простой, идиот!', 'error');
        return;
    }
    
    // Проверяем, есть ли уже такой пользователь
    const existingUsers = JSON.parse(localStorage.getItem('casino_users') || '{}');
    
    if (existingUsers[username]) {
        showAuthMessage('Такой лох уже существует!', 'error');
        return;
    }
    
    // Создаём нового пользователя
    const newUser = {
        username: username,
        password: btoa(password), // Очень "безопасно", да
        createdAt: new Date().toISOString(),
        stats: {
            balance: 5000,
            level: 1,
            spins: 0,
            wins: 0,
            losses: 0,
            biggestWin: 0,
            achievements: []
        }
    };
    
    // Сохраняем пользователя
    existingUsers[username] = newUser;
    localStorage.setItem('casino_users', JSON.stringify(existingUsers));
    localStorage.setItem('casino_user', JSON.stringify(newUser));
    
    showAuthMessage('Аккаунт создан, добро пожаловать в ад, ' + username + '!', 'success');
    
    setTimeout(() => {
        window.currentUser = newUser;
        showGameScreen(newUser);
    }, 1000);
}

function loginUser() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    if (!username || !password) {
        showAuthMessage('Введи данные, кретин!', 'error');
        return;
    }
    
    const existingUsers = JSON.parse(localStorage.getItem('casino_users') || '{}');
    const user = existingUsers[username];
    
    if (!user) {
        showAuthMessage('Такого лоха не существует!', 'error');
        return;
    }
    
    if (user.password !== btoa(password)) {
        showAuthMessage('Неверный пароль, идиот!', 'error');
        return;
    }
    
    localStorage.setItem('casino_user', JSON.stringify(user));
    showAuthMessage('С возвращением, ' + username + '!', 'success');
    
    setTimeout(() => {
        window.currentUser = user;
        showGameScreen(user);
    }, 1000);
}

function logoutUser() {
    localStorage.removeItem('casino_user');
    window.currentUser = null;
    showAuthScreen();
    showAuthMessage('Вышел из аккаунта. Возвращайся, когда проебёшь ещё денег!', 'info');
}

function showAuthMessage(message, type) {
    const messageDiv = document.getElementById('authMessage');
    messageDiv.textContent = message;
    messageDiv.style.color = type === 'error' ? '#ff0055' : 
                           type === 'success' ? '#00ffaa' : '#ffcc00';
    
    // Автоматически скрываем сообщение через 5 секунд
    setTimeout(() => {
        messageDiv.textContent = '';
    }, 5000);
}