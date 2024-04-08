
// Variables for the economic model and simulation state
let marketSize = 100;
let priceLemons = 10;
let pricePeaches = 20;
let qualityPeaches = 30;
let qualityLemons = 10;
let eta = 0.5; // Probability of encountering a peach
let mode = "symmetric"; // symmetric or asymmetric
let myp5; // This will hold the p5 instance

let gridStates; // Array to store the state of each cell
let simulationRunning = false;
// Update the market size display
document.getElementById("marketSize").oninput = function () {
    marketSize = parseInt(this.value);
    document.getElementById("marketSizeValue").innerText = this.value;
    resetSimulation();
};
document.getElementById("priceLemons").oninput = function () {
    priceLemons = parseInt(this.value);
    document.getElementById("priceLemonsValue").innerText = this.value;
};
document.getElementById("pricePeaches").oninput = function () {
    pricePeaches = parseInt(this.value);
    document.getElementById("pricePeachesValue").innerText = this.value;
};
document.getElementById("qualityPeaches").oninput = function () {
    qualityPeaches = parseInt(this.value);
    document.getElementById("qualityPeachesValue").innerText = this.value;
};
document.getElementById("qualityLemons").oninput = function () {
    qualityLemons = parseInt(this.value);
    document.getElementById("qualityLemonsValue").innerText = this.value;
};

document.getElementById("modeSelect").onchange = function () {
    mode = this.value;
};

// p5.js simulation setup
myp5 = new p5(function (sketch) {
    let gridSize;

    sketch.setup = function () {
        let canvas = sketch.createCanvas(300, 300);
        canvas.parent("simulation");
        gridSize = Math.sqrt(marketSize);
        gridStates = Array(gridSize)
            .fill()
            .map(() => Array(gridSize).fill(null));
        sketch.frameRate(10); // Adjust the simulation speed
        sketch.noLoop(); // Start with the simulation stopped
    };

    sketch.draw = function () {
        sketch.background(255);
        let cellSize = sketch.width / gridSize;
        simulateMarket(sketch, gridSize, cellSize); // Run the simulation logic
    };

    // Expose the sketch's loop control methods for external use
    sketch.startLoop = function () {
        sketch.loop();
    };

    sketch.stopLoop = function () {
        sketch.noLoop();
    };

    sketch.reset = function () {
        gridSize = Math.sqrt(marketSize);
        gridStates = Array(gridSize)
            .fill()
            .map(() => Array(gridSize).fill(null));
        sketch.resizeCanvas(300, 300);
        sketch.loop();
    };
});

// Reset simulation when market size changes
function resetSimulation() {
    myp5.reset();
}
document
    .getElementById("resetSimulation")
    .addEventListener("click", function () {
        resetSimulation();
    });
function resetSimulation() {
    // Stop the simulation if it's running
    simulationRunning = false;
    myp5.noLoop();

    // Reset the simulation state variables
    marketSize = 100;
    priceLemons = 10;
    pricePeaches = 20;
    qualityPeaches = 30;
    qualityLemons = 10;
    eta = 0.5;
    mode = "symmetric";
    peachesSold = 0;
    lemonsSold = 0;
    simulationTime = 0;
    currentPrice = 0;

    // Reset the sliders and dropdowns to their initial values
    document.getElementById("marketSize").value = marketSize;
    document.getElementById("priceLemons").value = priceLemons;
    document.getElementById("pricePeaches").value = pricePeaches;
    document.getElementById("qualityPeaches").value = qualityPeaches;
    document.getElementById("qualityLemons").value = qualityLemons;
    document.getElementById("modeSelect").value = mode;

    // Reset displayed values
    document.getElementById("marketSizeValue").innerText = marketSize;
    document.getElementById("priceLemonsValue").innerText = priceLemons;
    document.getElementById("pricePeachesValue").innerText = pricePeaches;
    document.getElementById("qualityPeachesValue").innerText =
        qualityPeaches;
    document.getElementById("qualityLemonsValue").innerText = qualityLemons;

    // Reset the simulation grid
    gridSize = Math.sqrt(marketSize);
    gridStates = Array(gridSize)
        .fill()
        .map(() => Array(gridSize).fill(null));

    // Reset the graph
    myChart.data.labels = [];
    myChart.data.datasets.forEach((dataset) => {
        dataset.data = [];
    });
    myChart.update();

    // Update button text
    document.getElementById("toggleSimulation").innerText =
        "Start Simulation";
}

// Button logic to toggle simulation
document
    .getElementById("toggleSimulation")
    .addEventListener("click", function () {
        simulationRunning = !simulationRunning;
        this.innerText = simulationRunning
            ? "Stop Simulation"
            : "Start Simulation";
        if (simulationRunning) {
            console.clear();
            // Log parameters to the console when starting the simulation
            console.log("Starting Simulation with Parameters:");
            console.log("Market Size:", marketSize);
            console.log("Price of Lemons:", priceLemons);
            console.log("Price of Peaches:", pricePeaches);
            console.log("Quality of Peaches:", qualityPeaches);
            console.log("Quality of Lemons:", qualityLemons);
            console.log("Probability of Encountering a Peach (eta):", eta);
            console.log("Information Mode:", mode);

            myp5.startLoop();
        } else {
            myp5.stopLoop();
        }
    });

// Function to simulate a single market slot
function simulateSlot(sketch, x, y, cellSize) {
    if (!gridStates[x][y]) {
        // If cell is not yet initialized, set it to lemon or peach
        gridStates[x][y] = Math.random() < eta ? "peach" : "lemon";
    }

    let state = gridStates[x][y];

    // Draw the slot based on its state
    switch (state) {
        case "lemon":
            sketch.fill(255, 255, 0); // Yellow for lemon
            break;
        case "peach":
            sketch.fill(255, 105, 180); // Pink for peach
            break;
        case "empty":
            sketch.fill(255); // White for empty
            break;
    }
    sketch.rect(x * cellSize, y * cellSize, cellSize, cellSize);

    // Implement sale logic here
    // For example, let's say a sale happens with a certain probability
    // Sale logic, occurs only when the simulation is running
    if (simulationRunning && state !== "empty") {
        // Implement sale logic here
        let sell = false;
        if (mode === "symmetric") {
            // In symmetric mode, use equilibrium price symmetric to decide
            sell = Math.random() < 0.5; // Simplified for illustration
        } else {
            // In asymmetric mode, use equilibrium price asymmetric to decide
            sell =
                (state === "lemon" && priceLemons <= currentPrice) ||
                (state === "peach" && pricePeaches <= currentPrice);
        }

        if (sell) {
            if (state === "lemon") {
                lemonsSold++;
            } else {
                peachesSold++;
            }
            gridStates[x][y] = "empty"; // Mark the cell as empty after a sale
        }
    }
}



// Variables for tracking sales
let peachesSold = 0;
let lemonsSold = 0;
let simulationTime = 0;
let currentPrice;

function calculateAndUpdateConsumerExpectedPrice() {
    // Assuming you have a function to calculate the equilibrium price called 'calculateEquilibriumPrice'
    let consumerExpectedPrice = calculateEquilibriumPrice(); // Implement this function based on your logic

    // Update the display
    updateConsumerExpectedPriceDisplay(consumerExpectedPrice);
}

function updateConsumerExpectedPriceDisplay(price) {
    let priceBox = document.getElementById("priceBox");
    priceBox.textContent = `Consumer Expected Price: ${price.toFixed(2)}`;
}

// Function to update the Chart.js graph
function updateGraph() {
    myChart.data.labels.push(simulationTime); // Assuming simulationTime tracks the simulation time
    myChart.data.datasets[0].data.push(peachesSold); // Peaches sold
    myChart.data.datasets[1].data.push(lemonsSold); // Lemons sold
    myChart.data.datasets[2].data.push(currentPrice); // Market price

    myChart.update(); // Update the chart with new data
}

// Update the market simulation based on the economic model
function updateMarketSimulation() {
    // Update market parameters based on the economic model
    // This is where you would implement the logic of price negotiation, utility calculations, etc.
    // The results of these calculations would then influence the drawing in the p5.js sketch
    // ...

    // Update graph with new data
    updateGraph();
}

// Utility functions for peaches and lemons
function utilityPeaches() {
    return qualityPeaches; // Assuming a simple utility function
}

function utilityLemons() {
    return qualityLemons; // Assuming a simple utility function
}

// Calculate expected utility
function calculateExpectedUtility(eta) {
    return eta * utilityPeaches() + (1 - eta) * utilityLemons();
}

// Determine equilibrium price under symmetric information
function equilibriumPriceSymmetric(eta) {
    return calculateExpectedUtility(eta);
}

// Determine equilibrium price under asymmetric information
// PI - THE MODEL IS WRONG NEAR HERE
function equilibriumPriceAsymmetric(eta, pSymmetric) {
    let pLemons = priceLemons;
    let pPeaches = pricePeaches;

    // Calculate the utility for the worst and best quality goods.
    let utilityOfLemons = utilityLemons();
    let utilityOfPeaches = utilityPeaches();

    // Check if the symmetric equilibrium price is lower than the price of peaches
    let indicator = pSymmetric > pPeaches ? 1 : 0;

    // Calculate the asymmetric equilibrium price
    let pAsymmetric =
        eta * (utilityOfPeaches - utilityOfLemons) * indicator +
        utilityOfLemons;

    return pAsymmetric;
}

// Update market prices based on the current mode
function updateMarketPrices() {
    let pSymmetric = equilibriumPriceSymmetric(eta);

    if (mode === "symmetric") {
        currentPrice = pSymmetric;
    } else {
        // Asymmetric mode
        currentPrice = equilibriumPriceAsymmetric(eta, pSymmetric);
    }

    // Update prices of lemons and peaches
    priceLemons = currentPrice;
    pricePeaches = currentPrice * (qualityPeaches / qualityLemons);

    // Additional logic to reflect the changes in the simulation and graph
    updateGraph();
    // ...
}

// Simulation loop
function simulateMarket(sketch, gridSize, cellSize) {
    // Increment simulation time with each call
    simulationTime++;
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            simulateSlot(sketch, x, y, cellSize); // Simulate each cell
        }
    }

    // Run the simulation for each time step
    // Update eta, prices, qualities, and other parameters as the market evolves
    updateMarketPrices();

    // Logic to simulate buying and selling activities
    // Update peachesSold and lemonsSold accordingly
    // ...

    // Update graph based on the current state of the market
    updateGraph();
}