class Card {
    constructor(name, imageUrl, text, manaCost) {
        this.name = name;
        this.imageUrl = imageUrl;
        this.text = text;
        this.manaCost = manaCost;
        this.count = 1; // Добавлено поле count для отслеживания количества карт в колоде
    }
}


class Deck {
    constructor() {
        this.cards = {}; // Используем словарь для подсчёта количества карт
    }

    addCard(card) {
        if (!this.cards[card.name]) {
            this.cards[card.name] = 0;
        }
        if (card.name.includes("Plains") || card.name.includes("Island") || card.name.includes("Swamp") || card.name.includes("Mountain") || card.name.includes("Forest")) {
            this.cards[card.name]++;
        } else if (this.cards[card.name] < 4) {
            this.cards[card.name]++;
        }
    }

    removeCard(card) {
        if (this.cards[card.name] > 0) {
            this.cards[card.name]--;
            if (this.cards[card.name] === 0) {
                delete this.cards[card.name];
            }
        }
    }

    getCards() {
        return Object.entries(this.cards).map(([name, count]) => ({ name, count }));
    }
}

export { Card, Deck };