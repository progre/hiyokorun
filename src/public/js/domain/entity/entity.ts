var GRAVITY = 300;

export class Hiyoko {
    status = new Status();
    private groundIndex = 0;

    constructor(private potential: Potential) {
        this.status.life = potential.life;
    }

    update(grounds: Ground[]) {
        // ëÃóÕ
        this.status.life += this.potential.recoveryPower;
        if (this.status.life > this.potential.life) {
            this.status.life = this.potential.life;
        }

        if (!this.on(grounds[this.groundIndex])) {
            var i = this.groundIndex + 1;
            if (grounds.length > i && this.on(grounds[i])) {
                this.groundIndex = i;
            }
        }
        this.move();
        this.hitProcess(grounds[this.groundIndex]);
    }

    move() {
        switch (this.status.state) {
            case State.WALK:
            case State.CHARGE:
            case State.AIR:
                this.status.x += this.potential.speed;
                break;
        }
        switch (this.status.state) {
            case State.AIR:
            case State.FALL:
                this.status.velocity -= GRAVITY; // èdóÕ
                this.status.y += this.status.velocity;
                break;
        }
    }

    hitProcess(ground: Ground) {
        switch (this.status.state) {
            case State.WALK:
                var distanceToCliff = ground.end - this.status.x;
                if (distanceToCliff <= this.potential.chargeStartDistance) {
                    this.status.state = State.CHARGE;
                }
                break;
            case State.CHARGE:
                if (this.status.time >= this.potential.chargeTime) {
                    this.jump();
                    break;
                }
                this.status.time++;
                break;
            case State.AIR:
                if (!this.on(ground))
                    break;
                if (ground.height < this.status.y)
                    break;
                var prevY = this.status.y - this.status.velocity;
                if (ground.height >= prevY) { // â°Ç©ÇÁÇ‘Ç¬Ç©Ç¡ÇΩ
                    this.status.x = ground.begin - 8;
                    this.status.state = State.FALL;
                    break;
                }
                this.status.y = ground.height;
                this.status.state = State.WALK;
                break;
            case State.FALL:
                if (this.status.y < -320 * 1000) {
                    this.status.state = State.DEAD;
                }
                break;
        }
    }

    jump() {
        var jumpPower = Math.min(
            this.potential.chargeWeight * this.potential.chargeTime,
            this.potential.jumpHeightWeight * 1 * 1000//todo
            + this.potential.jumpWidthWeight * 10 * 1000//todo
            );
        this.status.velocity = jumpPower;
        this.status.state = State.AIR;
    }

    private on(ground: Ground) {
        return ground.end > this.status.x + 8 && this.status.x - 8 >= ground.begin;
    }
}

export class Status {
    life: number;
    x = 0;
    y = 0;
    velocity = 0;
    state = State.WALK;
    time = 0;
}

export enum State {
    WALK, CHARGE, AIR, FALL, DEAD
}

function isAir(state: State) {
    return state === State.AIR || state === State.FALL;
}

export class Potential {
    constructor(
        public speed: number,
        public chargeStartDistance: number,
        public chargeTime: number,
        public chargeWeight: number,
        public jumpHeightWeight: number,
        public jumpWidthWeight: number,
        public life: number,
        public recoveryPower: number) {
    }
}

export class Ground {
    constructor(
        public begin: number,
        public end: number,
        public height: number) {
    }
}

export module HiyokoFactory {
    export function createNew() {
        return Enumerable.repeat(null, 20).select(x => {
            var hiyoko = new Hiyoko(new Potential(
                randomRange(2500, 3000),
                randomRange(0, 100 * 1000),
                randomRange(0, 10),
                randomRange(0, 10000000000),
                randomRange(0, 1),
                randomRange(0, 1),
                randomRange(1, 100),
                randomRange(0, 100)))
            hiyoko.status.x = randomRange(-10 * 1000, 10 * 1000);
            return hiyoko;
        }).toArray();
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
                var begin = prev.end + 32 * 1000 + randomRange(0, x);
                var end = begin + randomRange(64 * 1000, 200 * 1000);
                var low = Math.max(-100, -x) * 1000;
                var high = Math.min(x, 200) * 1000;
                var height = randomRange(low, high);
                next = new Ground(begin, end, height);
            }
            prev = next;
            return next;
        }).toArray();
    }
}

function randomRange(begin: number, end: number) {
    return begin + Math.random() * (end - begin);
}