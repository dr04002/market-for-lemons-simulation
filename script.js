function calculateUtility(value) {
    // Placeholder for the utility function, could be as simple as a direct proportion.
    return value;
}

function calculateExpectedUtilityForBuyer(averagePrice, probabilityPeach) {
    // Using the formula Ue = ηU(p) + (1 - η)U(ℓ)
    return probabilityPeach * calculateUtility(averagePrice) + (1 - probabilityPeach) * calculateUtility(averagePrice / 2); // assuming lemon value is half
}

function calculateSymmetricAveragePrice(cars, probabilityPeach) {
    // Using the formula P*sym = ηU(p) + (1 - η)U(ℓ)
    let peachUtility = calculateUtility(calculateAveragePrice(cars.filter(car => car.type === 'peach')));
    let lemonUtility = calculateUtility(calculateAveragePrice(cars.filter(car => car.type === 'lemon')));
    return probabilityPeach * peachUtility + (1 - probabilityPeach) * lemonUtility;
}

function sellDecision(car, averagePrice) {
    // If the car is a peach and the average price is less than its value, don't sell.
    if (car.type === 'peach' && averagePrice < car.value) return false;
    // If the car is a lemon, we can include more complex logic if needed.
    // For now, sell if the price is at least as much as the lemon's value.
    return averagePrice >= car.value;
}

function simulateMarketRound() {
    let probabilityPeach = calculateProbabilityPeach(cars);
    cars = cars.filter(car => sellDecision(car, averagePrice));
    averagePrice = calculateAveragePrice(cars);
    console.log(cars, averagePrice);
    // Update your visualization here
}

function calculateProbabilityPeach(cars) {
    // Calculate the probability of encountering a peach in the market.
    let peachCount = cars.filter(car => car.type === 'peach').length;
    return peachCount / cars.length;
}
