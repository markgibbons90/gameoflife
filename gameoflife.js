(function() {

    var gridContainer = document.getElementById('grid');

    var gridSize = 30;

    var grid = createGrid(gridSize, gridSize, gridContainer);

    // randomStart(100, grid);
    grid[45].alive = true;
    grid[45].className += ' alive';
    grid[75].alive = true;
    grid[75].className += ' alive';
    grid[105].alive = true;
    grid[105].className += ' alive';

    var counter = 0;

    // Need to create a snapshot of neighbours rather than a reference to the objects

    setInterval(function() {
        for (var i = 0; i < grid.length; i++) {
            // var cell = grid[i];
            // cell.currentNeighbours = cell.neighbours.map(function(neighbour) {
            //     console.log(neighbour);
            //     return {alive: neighbour.alive};
            // });
        }
        for (var i = 0; i < grid.length; i++) {
            var cell = grid[i];
            if (cell.alive) {
                if (!survives(cell)) {
                    cell.alive = false;
                    cell.className.replace('alive', '');
                }
            } else {
                if (spawns(cell)) {
                    cell.alive = true;
                    cell.className += ' alive';
                }
            }
        }
    }, 2000);

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
                cell.attributes['data-row'] = i;
                cell.attributes['data-col'] = j;
                cell.alive = false;

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

    function randomStart(initial, grid) {
        var size = grid.length;
        var initialCells = generateUniqueRandomNumbersArray(0, size - 1 ,initial);
        for (var i = 0; i < initialCells.length; i++) {
            var id = initialCells[i];
            grid[id].className += ' alive';
            grid[id].alive = true;
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
        }
        return false;
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
