(function() {

    var gridContainer = document.getElementById('grid');
    var gridSize = 30;
    var grid = createGrid(gridSize, gridSize, gridContainer);

    randomStart(200, grid);

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
    }, 500);

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
            grid[i].neighbours = getNeighbours(i, gridSize, grid);
        }
        return grid;
    }

    /**
     * Initiate the grid with a number of randomly placed live cells.
     * @param  {int} initialAlive The inital number of live cells
     * @param  {array} grid       The grid
     */
    function randomStart(initialAlive, grid) {
        var size = grid.length;
        var initialCells = generateUniqueRandomNumbersArray(0, size - 1 , initialAlive);
        for (var i = 0; i < initialCells.length; i++) {
            var id = initialCells[i];
            grid[id].setAttribute('data-alive', 'true');
        }
    }

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

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

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

    function getNeighbours(id, gridSize, grid) {
        var neighbours = [
            grid[id - gridSize - 1],
            grid[id - gridSize],
            grid[id - gridSize + 1],
            grid[id - 1],
            grid[id + 1],
            grid[id + gridSize - 1],
            grid[id + gridSize],
            grid[id + gridSize + 1]
        ];
        return neighbours;
    }

})();
