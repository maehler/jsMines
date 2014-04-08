;(function($, window, document, undefined) {

    var UNTOUCHED = 0;
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

            // Set dimensions of board
            base.$el.css({
                height: (base.options.tileSize.height) * base.options.size.y,
                width: (base.options.tileSize.width) * base.options.size.x
            });

            base.getBoard(
                base.options.size.x,
                base.options.size.y,
                base.options.mines
            );

            // Fill the boards with tiles
            for (var y = 0; y < base.options.size.y; y++) {
                for (var x = 0; x < base.options.size.x; x++) {
                    base.$el.append($('<div/>')
                        .css(base.options.tileSize)
                        .addClass('mines-tile')
                        .data('x', x)
                        .data('y', y)
                        .click(base.clickTile)
                    );
                }
            }
        }

        base.clickTile = function() {
            console.log(this);
            $tile = $(this);
            if ($tile.hasClass('mines-clicked')) {
                return;
            }
            $tile.addClass('mines-clicked');
            $tile.append(base.board[$tile.data('x')][$tile.data('y')]);
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
                    row.push(UNTOUCHED);
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
