import { Mtg } from "./api/mtg";
import { ColorStats } from "./widgets/colorStats";
import { ManaCostStats } from "./widgets/manaCostStats";

document.addEventListener("DOMContentLoaded", setup);

let allCards = []; // Store all cards for searching
let deck = {}; // Store deck as an object with card names as keys and counts as values

function setup() {
    const mtg = new Mtg();
    mtg.loadCards()
        .then((cards) => {
            allCards = cards; // Store cards for future reference
            renderCardList(cards);
            new ColorStats().buildStats(document.getElementById("colorStats"), deck);
            new ManaCostStats().buildStats(document.getElementById("manaStats"), deck);
        });

    // Search functionality
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
        listItem.addEventListener('click', () => displayCardDetails(card)); // Display card details on click
        list.appendChild(listItem);
    });

    menu.innerHTML = ''; // Clear previous list
    menu.appendChild(list);
}

function displayCardDetails(card) {
    const cardsContainer = document.getElementById('cardsContainer');
    cardsContainer.innerHTML = `
        <h1>${card.name}</h1>
        <img src="${card.imageUrl}" alt="${card.name}" />
        <p>${card.text}</p>
        <button id="addCardButton">Add to Deck</button>
    `;

    document.getElementById('addCardButton').addEventListener('click', () => addCardToDeck(card));
}

function addCardToDeck(card) {
    const cardName = card.name;

    // Check if the card is a land or if we already have 4 copies
    if (deck[cardName]) {
        if (deck[cardName] >= 4 && card.type !== 'Land') {
            alert("You cannot add more than 4 copies of a card (except lands).");
            return;
        }
        deck[cardName]++;
    } else {
        deck[cardName] = 1; // Add new card to the deck
    }

    updateDeckDisplay();
    updateStats();
}

function removeCardFromDeck(card) {
    const cardName = card.name;
    if (deck[cardName]) {
        deck[cardName]--;
        if (deck[cardName] <= 0) {
            delete deck[cardName]; // Remove card from deck if count is 0
        }
        updateDeckDisplay();
        updateStats();
    }
}

function updateDeckDisplay() {
    const cardsContainer = document.getElementById('cardsContainer');
    const deckDisplay = document.createElement('div');
    deckDisplay.innerHTML = '<h2>Your Deck</h2>';

    for (const [name, count] of Object.entries(deck)) {
        const cardElement = document.createElement('div');
        cardElement.innerHTML = `${name} (x${count}) <button onclick="removeCardFromDeck({name: '${name}'})">Remove</button>`;
        deckDisplay.appendChild(cardElement);
    }

    cardsContainer.appendChild(deckDisplay);
}

function updateStats() {
    new ColorStats().buildStats(document.getElementById("colorStats"), deck);
    new ManaCostStats().buildStats(document.getElementById("manaStats"), deck);
}
