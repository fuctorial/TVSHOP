// script.js

// Функция для обновления приветственного текста
function updateWelcomeText() {
    const welcomeText = document.getElementById('welcome-text');
    const username = localStorage.getItem('username');
    if (username) {
        welcomeText.textContent = `Добро пожаловать, ${username}!`;
        document.getElementById('auth-links').style.display = 'none';
        document.getElementById('logout-button').style.display = 'block';
    } else {
        welcomeText.textContent = 'Добро пожаловать, гость!';
        document.getElementById('auth-links').style.display = 'block';
        document.getElementById('logout-button').style.display = 'none';
    }
}

// Функция для выхода из системы
function logout() {
    localStorage.removeItem('username');
    updateWelcomeText();
}

// Функция для подтверждения покупки
function confirmPurchase(productName, price) {
    let confirmation = confirm(`Вы хотите купить ${productName} за ${price}?`);
    alert(confirmation ? 'Спасибо за покупку!' : 'Вы отменили покупку.');
}

// Функция для добавления товара в корзину
function addToCart(productName, price) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({ name: productName, price });
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Товар добавлен в корзину');
    console.log("Состояние корзины:", cart);
}

// Обработчик для кнопок "Купить" и "Добавить в корзину"
document.addEventListener('DOMContentLoaded', function () {
    // Обновление приветственного текста
    updateWelcomeText();

    // Обработчик выхода
    document.getElementById('logout-button').addEventListener('click', logout);

    // Обработчики кнопок "Купить" и "Добавить в корзину"
    document.querySelectorAll('.buy-button').forEach(button => {
        button.addEventListener('click', function () {
            let productSection = this.closest('section');
            let productName = productSection.querySelector('h2').textContent;
            let price = productSection.querySelector('p strong').textContent;
            confirmPurchase(productName, price);
        });
    });

    document.querySelectorAll('.add-to-cart-button').forEach(button => {
        button.addEventListener('click', function () {
            let productSection = this.closest('section');
            let productName = productSection.querySelector('h2').textContent;
            let price = productSection.querySelector('p strong').textContent;
            addToCart(productName, price);
        });
    });

    // Подсвечивание текущей страницы в навигации
    highlightCurrentPage();

    // Инициализация карты Yandex, если элемент существует
    const mapElement = document.getElementById("map");
    if (mapElement) {
        ymaps.ready(initYandexMap);
    }
});

// Подсветка текущей страницы в навигации
function highlightCurrentPage() {
    document.querySelectorAll('nav ul li a').forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add('active');
        }
    });
}

// Инициализация карты Yandex
function initYandexMap() {
    console.log("Инициализация карты началась");
    const myMap = new ymaps.Map("map", {
        center: [59.916363, 30.315955],
        zoom: 10
    });

    const myPlacemark = new ymaps.Placemark([59.916363, 30.315955], {
        hintContent: 'Наш офис',
        balloonContent: 'Здесь мы находимся!'
    });

    myMap.geoObjects.add(myPlacemark);
}

// Функция для отправки данных на сервер
function sendDataToServer(username, password) {
    fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.id) {
            alert('Регистрация прошла успешно!');
            document.getElementById('auth-modal').style.display = 'none';
            document.getElementById('register-form').reset();
        } else {
            alert('Ошибка: ' + data.error);
        }
    })
    .catch(error => console.error('Ошибка:', error));
}
