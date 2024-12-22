class Mtg {
    constructor(baseUrl = "https://api.magicthegathering.io/v1/") {
        this.baseUrl = baseUrl;
    }

    async loadCards() {
        try {
            const response = await fetch(`${this.baseUrl}cards`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const json = await response.json();
            if (!json.cards) {
                throw new Error("Unexpected response structure");
            }
            return json.cards;
        } catch (error) {
            console.error('Error fetching cards:', error);
            return []; 
        }
    }
}

export { Mtg };
