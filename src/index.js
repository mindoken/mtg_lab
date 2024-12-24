import { Mtg } from "./api/mtg.js";
import { ColorStats } from "./widgets/colorStats.js";
import { ManaCostStats } from "./widgets/manaCostStats.js";

document.addEventListener("DOMContentLoaded", setup);

let allCards = []; // Хранит все карты для поиска
let deck = {}; // Хранит колоду в виде объекта с именами карт в качестве ключей и их количеством в качестве значений
const manaCostStats = new ManaCostStats(); // Создаем экземпляр ManaCostStats

function setup() {
    const mtg = new Mtg();
    mtg.loadCards()
        .then((cards) => {
            allCards = cards; // Сохраняем карты для будущего использования
            renderCardList(cards);
            updateStats();
        });

    // Функциональность поиска
    document.getElementById('searchInput').addEventListener('input', function () {
        const searchTerm = this.value.toLowerCase();
        const filteredCards = allCards.filter(card => card.name.toLowerCase().includes(searchTerm));
        renderCardList(filteredCards);
    });
}

function renderCardList(cards) {
    const menu = document.getElementById('listContainer');
    const list = document.createElement('ul');

    cards.forEach(card => {
        const listItem = document.createElement('li');
        listItem.innerHTML = card.name;
        listItem.addEventListener('click', () => displayCardDetails(card)); // Отображение деталей карты по клику
        list.appendChild(listItem);
    });

    menu.innerHTML = ''; // Очищаем предыдущий список
    menu.appendChild(list);
}

function displayCardDetails(card) {
    const cardsContainer = document.getElementById('cardsContainer');
    cardsContainer.innerHTML = `
        <div class="card-details">
            <h1>${card.name}</h1>
            <img src="${card.imageUrl}" alt="${card.name}" />
            <p><strong>Тип:</strong> ${card.type}</p>
            <p><strong>Описание:</strong> ${card.text}</p>
            <p><strong>Мана стоимость:</strong> ${card.manaCost || 'Нет'}</p>
            <p><strong>Цвета:</strong> ${card.colors ? card.colors.join(', ') : 'Бесцветный'}</p>
            <button id="addCardButton">Добавить в колоду</button>
            <button id="removeCardButton" style="display: none;">Удалить из колоды</button>
        </div>
    `;

    // Показать или скрыть кнопку удаления в зависимости от того, есть ли карта в колоде
    const addCardButton = document.getElementById('addCardButton');
    const removeCardButton = document.getElementById('removeCardButton');

    // Обновляем состояние кнопок в зависимости от наличия карты в колоде
    if (deck[card.name]) {
        addCardButton.style.display = 'none';
        removeCardButton.style.display = 'inline-block';
    } else {
        addCardButton.style.display = 'inline-block';
        removeCardButton.style.display = 'none';
    }

    // Добавляем обработчики событий для кнопок
    addCardButton.onclick = () => addCardToDeck(card);
    removeCardButton.onclick = () => {
        removeCardFromDeck(card);
        displayCardDetails(card); // Обновляем отображение деталей карты после удаления
    };
}

function addCardToDeck(card) {
    const cardName = card.name;

    // Проверяем, является ли карта землёй или у нас уже есть 4 копии
    if (deck[cardName]) {
        if (deck[cardName] >= 4 && card.type !== 'Land') {
            alert("Вы не можете добавить более 4 копий карты (кроме земель).");
            return;
        }
        deck[cardName]++;
    } else {
        deck[cardName] = 1; // Добавляем новую карту в колоду
    }

    updateDeckDisplay();
    updateStats();
}

function removeCardFromDeck(card) {
    const cardName = card.name;
    if (deck[cardName]) {
        deck[cardName]--;
        if (deck[cardName] <= 0) {
            delete deck[cardName]; // Удаляем карту из колоды, если количество равно 0
        }
        updateDeckDisplay(); // Обновляем отображение колоды сразу после удаления
        updateStats(); // Обновляем статистику
    }
}

function updateDeckDisplay() {
    const cardsContainer = document.getElementById('cardsContainer');
    const deckDisplay = document.createElement('div');
    deckDisplay.innerHTML = '<h2>Ваша колода</h2>';

    for (const [name, count] of Object.entries(deck)) {
        const cardElement = document.createElement('div');
        cardElement.innerHTML = `${name} (x${count}) <button onclick="removeCardFromDeck({name: '${name}'})">Удалить</button>`;
        deckDisplay.appendChild(cardElement);
    }

    // Очищаем предыдущий вывод колоды перед обновлением
    cardsContainer.innerHTML = ''; 
    cardsContainer.appendChild(deckDisplay);
}

function updateStats() {
    manaCostStats.buildStats('#manaStats', deck); // Обновляем график распределения маны
    new ColorStats().buildStats(document.getElementById("colorStats"), deck); // Обновляем график распределения цветов
}
