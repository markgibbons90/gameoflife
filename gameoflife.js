(function() {

    // The element in which we will create the grid
    var gridContainer = document.getElementById('grid');

    // Set some inital variables
    // The width and height of grid
    var gridSize = 20;
    // The number of inital live cells
    var initialLiveCells = 100;
    // The interval between evolutions in milliseconds
    var interval = 1000;

    // Create the grid with the inital values
    var grid = createGrid(gridSize, gridSize, gridContainer);

    // Listen to click event on Go button and initiate the process with the selected params
    document.getElementById('initiate').addEventListener('click', initiate);

    function initiate() {
        gridSize = document.getElementById('grid-size').value;
        initialLiveCells = document.getElementById('inital-live-cells').value;
        interval = document.getElementById('interval').value;

        grid = createGrid(gridSize, gridSize, gridContainer);
        randomStart(initialLiveCells, grid);
        console.log(interval);
        evolve(interval);
    }

    // Maybe need to unset interval somehow...

    /**
     * Re-compute all the live or dead cells at each interval.
     * @param  {int} interval
     *   Time between each evolution
     */
    function evolve(interval) {
        console.log(interval);
        setInterval(function() {
            for (var i = 0; i < grid.length; i++) {
                var cell = grid[i];
                cell.currentNeighbours = cell.neighbours.map(function(neighbour) {
                    alive = neighbour ? neighbour.getAttribute('data-alive') === 'true' : false;
                    return {alive: alive};
                });
            }
            for (var i = 0; i < grid.length; i++) {
                var cell = grid[i];
                if (cell.getAttribute('data-alive') === 'true') {
                    if (!survives(cell)) {
                        cell.setAttribute('data-alive', 'false');
                    }
                } else {
                    if (spawns(cell)) {
                        cell.setAttribute('data-alive', 'true');
                    }
                }
            }
        }, interval);
    }

    /**
     * Create the blank grid.
     * @param  {int} cols
     *   The number of columns
     * @param  {int} rows
     *   The number of rows
     * @param  {DOMElement} container
     *   The element in which to insert the grid
     * @return {array}
     *   Array containing rows containing references to all the cells
     */
    function createGrid(cols, rows, container) {
        // Clear the container
        container.innerHTML = '';

        var grid = [];

        for (var i = 0; i < rows; i++) {
            // Create the row
            var row = document.createElement('div');

            row.className = 'row';
            container.appendChild(row);

            for (var j = 0; j < cols; j++) {
                // Create the cell
                var cell = document.createElement('div');

                cell.className = 'cell';
                cell.id = '' + i + '-' + j;
                cell.setAttribute('data-row', i);
                cell.setAttribute('data-col', j);
                cell.setAttribute('data-alive', 'false');

                // Append the cell to the row
                row.appendChild(cell);
                // Put the cell in the grid array
                grid.push(cell);
            }
        }
        // Now that the grid is created, get all the cells' neighbours and attach to cells
        for (var i = 0; i < cols * rows; i++) {
            grid[i].neighbours = getNeighbours(grid[i], gridSize, grid);
        }
        return grid;
    }

    /**
     * Initiate the grid with a number of randomly placed live cells.
     * @param  {int} initialAlive
     *   The inital number of live cells
     * @param  {array} grid
     *   The grid
     */
    function randomStart(initialAlive, grid) {
        var size = grid.length;
        var initialCells = generateUniqueRandomNumbersArray(0, size - 1 , initialAlive);
        for (var i = 0; i < initialCells.length; i++) {
            var id = initialCells[i];
            grid[id].setAttribute('data-alive', 'true');
        }
    }

    /**
     * Generate an array of unique random numbers.
     * @param  {int} min
     *   The lower limit
     * @param  {int} max
     *   The upper limit
     * @param  {int} size
     *   The length of the array you wish to generate
     * @return {array}
     *   The array of random numbers
     */
    function generateUniqueRandomNumbersArray(min, max, size) {
        var numbersArray = [];
        while (numbersArray.length < size) {
            var random = getRandomInt(min, max);
            if (numbersArray.indexOf(random) < 0) {
                numbersArray.push(random);
            }
        }
        return numbersArray;
    }

    /**
     * Returns a random integer between an upper and lower limit.
     * @param  {int} min
     *   The lower limit
     * @param  {int} max
     *   The upper limit
     * @return {int}
     *   A random integer
     */
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    /**
     * Returns whether a cell will survive or not based on its current neighbours.
     * @param  {DOMElement} cell
     *   The cell
     * @return {bool}
     *   Whether or not the cell will survive
     */
    function survives(cell) {
        var liveNeighbours = 0;
        for (var i = 0; i < cell.currentNeighbours.length; i++) {
            if (cell.currentNeighbours[i] && cell.currentNeighbours[i].alive) {
                liveNeighbours++;
            }
        }
        if (liveNeighbours === 2 || liveNeighbours === 3) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Returns whether a dead cell will spawn a live cell based on its current neighbours.
     * @param  {DOMElement} cell
     *   The cell
     * @return {bool}
     *   Whether or not the cell will spawn a live cell
     */
    function spawns(cell) {
        var liveNeighbours = 0;
        for (var i = 0; i < cell.currentNeighbours.length; i++) {
            if (cell.currentNeighbours[i] && cell.currentNeighbours[i].alive) {
                liveNeighbours++;
            }
        }
        if (liveNeighbours === 3) {
            return true;
        }
        return false;
    }

    /**
     * Returns a cell's 8 neighbours.
     * @param  {DOMElement} cell
     *   The cell
     * @param  {int} gridSize
     *   The grid width/height
     * @param  {array} grid
     *   Array containing all the grid elements
     * @return {array}
     *   Array containing cell's neighbours
     */
    function getNeighbours(cell, gridSize, grid) {
        var row = parseInt(cell.getAttribute('data-row'));
        var col = parseInt(cell.getAttribute('data-col'));
        // If top row
        var rowAbove = (row === 0) ? (gridSize - 1) : (row - 1);
        // If bottom row
        var rowBelow = (row === gridSize - 1) ? 0 : (row + 1);
        // If leftmost column
        var columToTheLeft = (col === 0) ? (gridSize - 1) : (col - 1);
        // If rightmost column
        var columnToTheRight = (col === gridSize - 1) ? 0 : (col + 1);

        var neighbours = [
            grid[getIndexFromCoordinates(rowAbove, columToTheLeft, gridSize)],
            grid[getIndexFromCoordinates(rowAbove, col, gridSize)],
            grid[getIndexFromCoordinates(rowAbove, columnToTheRight, gridSize)],
            grid[getIndexFromCoordinates(row, columToTheLeft, gridSize)],
            grid[getIndexFromCoordinates(row, columnToTheRight, gridSize)],
            grid[getIndexFromCoordinates(rowBelow, columToTheLeft, gridSize)],
            grid[getIndexFromCoordinates(rowBelow, col, gridSize)],
            grid[getIndexFromCoordinates(rowBelow, columnToTheRight, gridSize)]
        ];
        return neighbours;
    }

    /**
     * Returns a cell's index from its coordinates.
     * @param  {int} row
     *   The row the cell is in
     * @param  {int} col
     *   The column the cell is in
     * @param  {int} numCols
     *   The number of columns
     * @return {int}
     *   The index of the cell
     */
    function getIndexFromCoordinates(row, col, numCols) {
        return row * numCols + col;
    }

})();
