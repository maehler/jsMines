;(function($, window, document, undefined) {

    var MINE = 64;

    $.mines = function(el, options) {
        var base = this;

        // Access to jQuery and DOM versions of the element
        base.$el = $(el);
        base.el = el;

        // Add a reverse reference to the DOM object
        base.$el.data('mines', base);

        base.init = function() {
            base.options = $.extend({}, $.mines.default, options);

            base.gameOver = false;
            base.mineCount = base.options.mines;

            // Check the dimensions
            if (base.options.size.x < 1 || base.options.size.y < 1) {
                console.error('illegal dimensions: (' +
                    base.options.size.x + ',' +
                    base.options.size.y + ')');
                return;
            }

            // Check the number of mines
            if (base.options.mines < 1 ||
                    base.options.mines > (base.options.size.x *
                        base.options.size.y) / 2) {
                console.error('illegal number of mines: ' +
                    base.options.mines);
                return;
            }

            // Create a div for controls
            var $controlEl = $('<div/>').addClass('mines-control');

            $controlEl.append(
                $('<div/>').addClass('mines-mineCount')
                    .append(base.mineCount)
            );

            // Create a div for the board
            base.boardElement = $('<div/>').addClass('mines-board')
                .css({
                    height: (base.options.tileSize.height) * base.options.size.y,
                    width: (base.options.tileSize.width) * base.options.size.x
                });

            base.$el.append($controlEl);
            base.$el.append(base.boardElement);

            // Disable context menu for the board
            base.$el.bind('contextmenu', function() { return false; });

            base.noTiles = base.options.size.x * base.options.size.y;

            base.getBoard(
                base.options.size.x,
                base.options.size.y,
                base.options.mines
            );

            base.buildBoard(base.options.size.x, base.options.size.y);
        }

        base.openField = function(x, y) {
            var xMin = Math.max(x - 1, 0);
            var xMax = Math.min(x + 1, base.options.size.x - 1);
            var yMin = Math.max(y - 1, 0);
            var yMax = Math.min(y + 1, base.options.size.y - 1);
            for (var i = yMin; i <= yMax; i++) {
                for (var j = xMin; j <= xMax; j++) {
                    base.tileBoard[i][j].mousedown();
                }
            }
        }

        base.clickTile = function(event) {
            $tile = $(this);
            if ($tile.hasClass('mines-clicked') || base.gameOver) {
                return;
            }
            if (event.which === 3) {
                $tile.toggleClass('mines-flag');
                return;
            }
            if ($tile.hasClass('mines-flag')) {
                return;
            }
            $tile.addClass('mines-clicked');
            var tileX = $tile.data('x');
            var tileY = $tile.data('y');
            var nMines = base.board[tileY][tileX];
            if (nMines === 0) {
                base.openField(tileX, tileY);
            } else if ((nMines & MINE) !== 0) {
                // Die
                base.showMines();
            } else {
                // Show no. neighboring mines
                $tile.append(base.board[tileY][tileX]);
            }
            base.checkVictory();
        }

        base.showMines = function() {
            base.gameOver = true;
            for (var i = 0; i < base.options.size.y; i++) {
                for (var j = 0; j < base.options.size.x; j++) {
                    if ((base.board[i][j] & MINE) !== 0) {
                        base.tileBoard[i][j].addClass('mines-clicked').append('');
                    }
                }
            }
        }

        base.checkVictory = function() {
            if ($('.mines-clicked').length === base.noTiles - base.options.mines) {
                base.gameOver = true;
            }
        }

        base.incrementNeighbors = function(x, y) {
            for (var i = y - 1; i <= y + 1; i++) {
                for (var j = x - 1; j <= x + 1; j++) {
                    if (j === x && i === y) {
                        continue;
                    }
                    if (j + 1 > base.options.size.x || j < 0) {
                        continue;
                    }
                    if (i + 1 > base.options.size.y || i < 0) {
                        continue;
                    }
                    if ((base.board[i][j] & MINE) !== MINE) {
                        base.board[i][j]++;
                    }
                }
            }
        }

        base.getBoard = function(x, y, mines) {
            base.board = [];
            for (var i = 0; i < y; i++) {
                var row = [];
                for (var j = 0; j < x; j++) {
                    row.push(0);
                }
                base.board.push(row);
            }

            var placedMines = 0;
            while (placedMines < mines) {
                var randX = Math.floor(Math.random() * x);
                var randY = Math.floor(Math.random() * y);
                // If there isn'a a mine at this random position, place it
                if ((MINE & base.board[randY][randX]) === 0) {
                    base.board[randY][randX] = MINE;
                    placedMines++;
                    // Add to all neighbors that aren't mines
                    base.incrementNeighbors(randX, randY);
                }
            }
        }

        base.buildBoard = function(x, y) {
            base.tileBoard = [];
            for (var i = 0; i < y; i++) {
                var row = [];
                for (var j = 0; j < x; j++) {
                    row.push(null);
                }
                base.tileBoard.push(row);
            }
            // Fill the boards with tiles
            for (var y = 0; y < base.options.size.y; y++) {
                for (var x = 0; x < base.options.size.x; x++) {
                    var $tile = $('<div/>')
                        .css(base.options.tileSize)
                        .addClass('mines-tile')
                        .data('x', x)
                        .data('y', y)
                        .mousedown(base.clickTile);
                    base.tileBoard[y][x] = $tile;
                    base.boardElement.append($tile);
                }
            }
        }

        // Run init
        base.init();
    };

    $.mines.default = {
        mines: 10,
        tileSize: {
            height: 20,
            width: 20,
        },
        size: {
            x: 8,
            y: 8
        }
    };

    $.fn.mines = function(options) {
        return this.each(function() {
            (new $.mines(this, options));
        });
    };
})(jQuery, window, document);
