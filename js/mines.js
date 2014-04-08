;(function($, window, document, undefined) {

    var UNTOUCHED = 0;
    var MINE = -1;

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
                height: (base.options.tileStyle.height) * base.options.size.y,
                width: (base.options.tileStyle.width) * base.options.size.x
            });

            // Fill the boards with tiles
            for (var y = 0; y < base.options.size.y; y++) {
                for (var x = 0; x < base.options.size.x; x++) {
                    base.$el.append($('<div/>', {
                        class: 'tile'
                    }).css(base.options.tileStyle));
                }
            }
        }

        // Run init
        base.init();
    };

    $.mines.default = {
        mines: 10,
        tileStyle: {
            'box-sizing': 'border-box',
            height: 20,
            width: 20,
            'background-color': '#CCC',
            margin: 0,
            'border-style': 'solid',
            'border-width': 3,
            'border-bottom-color': '#999',
            'border-right-color': '#999',
            'border-left-color': '#EEE',
            'border-top-color': '#EEE'
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
