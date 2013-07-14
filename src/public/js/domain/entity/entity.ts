import utils = require('domain/service/utils');

export class Ground {
    constructor(
        public begin: number,
        public end: number,
        public height: number) {
    }
}

export class GroundFactory {
    private constructor() {
    }

    static create(start: number, count: number) {
        var prev: Ground = null;
        return Enumerable.range(start, count).select(x => {
            var next: Ground;
            if (prev == null) {
                next = new Ground(-100 * 1000, 320 * 1000, 0);
            } else {
                var begin = prev.end + (32 + utils.randomRange(0, x)) * 1000;
                var end = begin + utils.randomRange(64 * 1000, 200 * 1000);
                var low = Math.max(-100, -x) * 1000;
                var high = Math.min(x, 200) * 1000;
                var height = utils.randomRange(low, high);
                next = new Ground(begin, end, height);
            }
            prev = next;
            return next;
        }).toArray();
    }
}
