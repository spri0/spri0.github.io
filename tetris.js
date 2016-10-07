
n(document) {
    var Keys = {
        LEFT:   37,
        UP:     38,
        RIGHT:  39,
        DOWN:   40,
        A:      'A'.charCodeAt(0),
        a:      'a'.charCodeAt(0),
        Z:      'Z'.charCodeAt(0),
        z:      'z'.charCodeAt(0),
        DOT:    '.'.charCodeAt(0),
        COMMA:  ','.charCodeAt(0)
    };

    var Rotation = {
        RIGHT: [[0, 1], [-1, 0]],
        LEFT:  [[0, -1], [1, 0]],
        
        apply: function(point, rotation) {
            // multiply vector (x, y) by rotation matrix.
            return [
                point[0] * rotation[0][0] + point[1] * rotation[0][1],
                point[0] * rotation[1][0] + point[1] * rotation[1][1]
            ];
        }
    };

    var tetrominoes = [
        [[0, 1], [1, 1], [1, 0]],
        [[1, 0], [1, 1], [0, 1]],
        [[1], [1], [1], [1]],
        [[1, 0], [1, 0], [1, 1]],
        [[0, 1], [0, 1], [1, 1]],
        [[1, 1], [1, 1]],
        [[0, 1], [1, 1], [0, 1]]
    ];
    
    function iterateGrid(grid, fn) {
        for (var dx = 0; dx < grid.length; dx ++) {
            for (var dy = 0; dy < grid[dx].length; dy++) {
                fn(dx, dy, grid[dx][dy]);
            }
        }
    }

    function mergeToGrid(grid, piece) {
        iterateGrid(piece.type, function(x, y, v) {
            if (v) {
                grid[piece.x + x][piece.y + y] = 1;
            }
        });
    }

    function randomPiece() {
        return tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
    }

    function clonePiece(piece) {
        var ret = {x: piece.x, y: piece.y, type: []};
        iterateGrid(piece.type, function(x, y, v) {
            if (typeof ret.type[x] === 'undefined') {
                ret.type[x] = [];
            }
            ret.type[x][y] = v;
        });
        return ret;
    }

    var kill = false;
    var gridSize = [10, 15], startX = 0;
    var grid = [];
    var piece = {}, queue = [randomPiece()], canvas;

    function spawnPiece() {
        piece.x = startX;
        piece.y = -1;
        piece.type = queue.shift();
        
        queue.push(randomPiece());
    }

    function isCollision(piece, gridB) {
        var ret = false;
        iterateGrid(piece.type, function(x, y, v) {
            if (v && !ret) {
                var realX = x + piece.x;
                var realY = y + piece.y;
                
                if (
                    realX >= gridSize[0]
                    || realX < 0
                    || realY >= gridSize[1] 
                    || gridB[x+piece.x][y + piece.y]
                ) {
                    ret = true;
                }
            }
        });
        return ret;
    }

    function deleteRow(grid, row) {
        var newGrid = [];
        for (var x = 0; x < gridSize[0]; x++) {
            newGrid[x] = [0];
        }
        
        iterateGrid(grid, function(x, y, v) {
            if (y < row) {
                newGrid[x][y+1] = v;
            } else if (y > row) {
                newGrid[x][y] = v;
            }
        });
        return newGrid;
    }

    function checkRows(grid) {
        for (var y = 0; y < gridSize[1]; y++) {
            var isFull = true;
            for (var x = 0; x < gridSize[0]; x ++) {
                isFull &= grid[x][y];
            }
            if (isFull) {
                grid = deleteRow(grid, y);
            }
        }
        return grid;
    }

    function fallDown() {
        var tmp = clonePiece(piece);
        if (isCollision(piece, grid)) {
            gameover();
        }

        tmp.y ++;
        
        if(isCollision(tmp, grid)) {
            mergeToGrid(grid, piece);
            grid = checkRows(grid);
            spawnPiece();
        } else {
            piece = tmp;
        }
    }

    function rotatePiece(piece, rotation) {
        var origin = [piece.x, piece.y];
        
        var points = [];
        iterateGrid(piece.type, function(x, y, v) {
            points.push(
                [Rotation.apply([x, y], rotation), v]
            );
        });
        var minX = points[0][0][0];
        var minY = points[0][0][1];
        
        var i;

        for (i = 1; i < points.length; i ++) {
            minX = Math.min(points[i][0][0], minX);
            minY = Math.min(points[i][0][1], minY);
        }
        
        // rebase the coordinates in the origin of the piece.
        piece.type = [];
        for (i = 0; i < points.length; i ++) {
            points[i][0][0] -= minX;
            points[i][0][1] -= minY;
            if (typeof piece.type[points[i][0][0]] === 'undefined') {
                piece.type[points[i][0][0]] = [];
            }
            piece.type[points[i][0][0]][points[i][0][1]] = points[i][1];
        }
    }

    function keyHandler (e) {
        var handled = false;

        var ghost = clonePiece(piece);
        
        switch (e.keyCode || e.charCode) {
            case Keys.LEFT:
            case Keys.COMMA:
                handled = true;
                ghost.x --;
                break;
            case Keys.DOT:
            case Keys.RIGHT:
                handled = true;
                ghost.x ++;
                break;
            case Keys.UP:
            case Keys.a: case Keys.A:
                handled = true;
                rotatePiece(ghost, Rotation.RIGHT);
                break;
            case Keys.z: case Keys.Z:
                handled = true;
                rotatePiece(ghost, Rotation.LEFT);
                break;
            case Keys.DOWN:
                handled = true;
                ghost.y ++;
                break;
        }
        if (!isCollision(ghost, grid)) {
            piece = ghost;
        }
        
        if (handled) {
            e.preventDefault();
        }
    }

    function paint() {
        if (kill) {
            return;
        }
        // set the character to paint in the viewport grid
        function drawXY(x, y, ch) {
            if (y >= 0 && x >= 0 && x < viewPort[0] && y < viewPort[1]) {
                var offset = y * (viewPort[0] + 1) + x; 
                t = t.substr(0, offset) + ch + t.substr(offset +1);
            }
        }

        var t = '', x, y, viewPort = [40, 40];
        
        // build the viewport string
        for (y = 0; y < viewPort[1]; y ++) {
            for (x = 0; x < viewPort[0]; x ++) {
                t += " ";
            }
            t += "\n";
        }


        // layout the board
        iterateGrid(grid, function (x, y, v) {
            if (v) {
                drawXY(x, y, '#');
            } else {
                drawXY(x, y, '.');
            }
        });
        
        // paint the current piece
        if (piece.type) {
            iterateGrid(piece.type, function(x, y, v) {
                if (v) {
                    drawXY(x + piece.x, y + piece.y, 'X');
                }
            });
        }
        
        // draw the next piece in queue
        for (var px = 0; px < queue[0].length; px ++) {
            for (var py = 0; py < queue[0][px].length; py ++) {
                if (queue[0][px][py]) {
                    drawXY(gridSize[0] + 2 + px, py + 2, 'O');
                } 
            }
        }
        
        // paint the canvas.
        canvas.innerHTML = t;
        setTimeout(arguments.callee, 20);
    }

    function heartbeat() {
        if (kill) {
            return;
        }
        fallDown();
        setTimeout(arguments.callee, 300);
    }


    function gameover() {
        kill = true;
        alert("Game over :(");
    }


    return {
        'init': function (document) {
            // initialize grid with zeroes
            for (var x = 0; x < gridSize[0]; x ++) {
                grid[x] = [];
                for (var y = 0; y < gridSize[1]; y ++) {
                    grid[x][y]= 0;
                }
            }

            console.log(document, canvas);
            canvas = document.getElementById('canvas');
            document.onkeypress = keyHandler;
        },
        'run': function () {
            paint();
            spawnPiece();
            heartbeat();
        }
    };
})();

