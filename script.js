document.addEventListener('DOMContentLoaded', () => {
    let cars = [
        {type: 'peach', value: 100},
        {type: 'lemon', value: 50},
        // Add more cars as needed
    ];

    let averagePrice = calculateAveragePrice(cars);

    function calculateAveragePrice(cars) {
        return cars.reduce((sum, car) => sum + car.value, 0) / cars.length;
    }

    function simulateMarketRound() {
        cars = cars.filter(car => car.value <= averagePrice);
        averagePrice = calculateAveragePrice(cars);
        console.log(cars, averagePrice);
        // Update your visualization here
    }

    document.getElementById('simulateRound').addEventListener('click', simulateMarketRound);
});
