var $ = require('dragonjs');

module.exports = function (opts) {
    var pos = opts.pos,
        size = opts.size,
        buffer = 5,
        knobSize = $.Dimension(16, 32),
        lane = $.Sprite({
            name: 'slider-lane',
            collisionSets: [
                $.collisions
            ],
            mask: $.Rectangle(
                $.Point(),
                $.Dimension(
                    size.width,
                    size.height - buffer * 2
                )
            ),
            strips: {
                'slider': $.AnimationStrip({
                    sheet: $.SpriteSheet({
                        src: opts.src.lane
                    }),
                    size: $.Dimension(32, 8)
                })
            },
            startingStrip: 'slider',
            pos: $.Point(
                pos.x - size.width / 2,
                pos.y - size.height / 2 + buffer
            ),
            size: $.Dimension(
                size.width,
                size.height - buffer * 2
            ),
            on: {
                'colliding/screentap': function () {
                },
                'colliding/screendrag': function () {
                }
            }
        }),
        knob = $.Sprite({
            name: 'slider-knob',
            collisionSets: [
                $.collisions
            ],
            mask: $.Rectangle(
                $.Point(),
                size
            ),
            strips: {
                'slider': $.AnimationStrip({
                    sheet: $.SpriteSheet({
                        src: opts.src.knob
                    }),
                    size: $.Dimension(8, 16)
                })
            },
            startingStrip: 'slider',
            pos: $.Point(
                pos.x - knobSize.width / 2,
                pos.y - knobSize.height / 2
            ),
            size: knobSize,
            on: {
                'colliding/screentap': function () {
                },
                'colliding/screendrag': function (event) {
                    var value = 20;
                    this.pos.x = event.x - knobSize.width / 2;
                    opts.slide(value);
                }
            }
        });

    return $.ClearSprite().extend({
        load: function (cb) {
            var queue = 2,
                done = function () {
                    queue -= 1;
                    if (!queue) {
                        cb();
                    }
                };
            lane.load(done);
            knob.load(done);
        },
        start: function () {
            lane.start();
            knob.start();
        },
        pause: function () {
            lane.pause();
            knob.start();
        },
        stop: function () {
            lane.stop();
            knob.stop();
        },
        update: function () {
            lane.update();
            knob.update();
        },
        draw: function (ctx) {
            lane.draw(ctx);
            knob.draw(ctx);
        },
        teardown: function () {
            lane.teardown();
            knob.teardown();
        }
    });
};
