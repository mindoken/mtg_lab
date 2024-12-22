import * as d3 from "d3";

class ColorStats {
    buildStats(element, deck) {
        const data = this.calculateColorDistribution(deck);
        // Clear previous stats
        d3.select(element).selectAll("*").remove();

        const width = 200;
        const height = 200;
        const radius = Math.min(width, height) / 2;

        const color = d3.scaleOrdinal()
            .domain(data.map(d => d.color))
            .range(['#F0E68C', '#4682B4', '#2F4F4F', '#B22222', '#228B22', '#A9A9A9']);

        const pie = d3.pie()
            .value(d => d.count)
            .sort(null);

        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);

        const label = document.createElement('label');
        label.textContent = "Deck Mana Color Distribution";
        label.classList.add("colorLabel");
        element.appendChild(label);

        const svg = d3.select(element)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`);

        const arcs = svg.selectAll("arc")
            .data(pie(data))
            .enter()
            .append("g")
            .attr("class", "arc");

        arcs.append("path")
            .attr("d", arc)
            .attr("fill", d => color(d.data.color));
    }

    calculateColorDistribution(deck) {
        const colorCount = {
            'White': 0,
            'Blue': 0,
            'Black': 0,
            'Red': 0,
            'Green': 0,
            'Colorless': 0
        };

        for (const cardName in deck) {
            const card = allCards.find(c => c.name === cardName);
            if (card) {
                const count = deck[cardName];
                if (card.colors) {
                    card.colors.forEach(color => {
                        colorCount[color] += count;
                    });
                } else {
                    colorCount['Colorless'] += count;
                }
            }
        }

        return Object.entries(colorCount).map(([color, count]) => ({ color, count }));
    }
}

export { ColorStats };
