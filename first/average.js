const express = require('express');
const app = express();
const port = 9876;

const staticData = {
    'p': [2, 3, 5, 7, 11, 13, 17, 19, 23, 29],
    'f': [0, 1, 1, 2, 3, 5, 8, 13, 21, 34],
    'e': [2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
    'r': [9, 7, 5, 2, 8, 3, 1, 6, 4, 10]
};

let numbersWindow = [];

const calculateAverage = (numbers) => {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return parseFloat((sum / numbers.length).toFixed(2));
};

app.get('/numbers/:numberId', (req, res) => {
    const numberId = req.params.numberId;
    const fetchedNumbers = staticData[numberId] || [];
    const newNumbers = fetchedNumbers.filter(num => !numbersWindow.includes(num));

    // Update the window state
    numbersWindow = [...numbersWindow, ...newNumbers];
    if (numbersWindow.length > 10) {
        numbersWindow.splice(0, numbersWindow.length - 10);
    }

    // Update the response
    const response = {
        windowPrevState: numbersWindow.slice(0, -newNumbers.length), // Previous state before adding new numbers
        windowCurrState: numbersWindow,
        numbers: newNumbers,
        avg: calculateAverage(numbersWindow)
    };

    res.json(response);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
