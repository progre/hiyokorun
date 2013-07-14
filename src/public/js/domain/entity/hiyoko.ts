import utils = require('domain/service/utils');
import entity = require('domain/entity/entity');

var GRAVITY = 300;

export class Hiyoko {
    status = new Status();
    private groundIndex = 0;

    constructor(public potential: Potential) {
        this.status.life = potential.life;
    }

    update(grounds: entity.Ground[]) {
        // 体力
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
        if (grounds.length > this.groundIndex + 1)
            this.hitProcess(grounds[this.groundIndex], grounds[this.groundIndex + 1]);
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
                this.status.velocity -= GRAVITY; // 重力
                this.status.y += this.status.velocity;
                break;
        }
    }

    hitProcess(ground: entity.Ground, nextGround: entity.Ground) {
        switch (this.status.state) {
            case State.WALK:
                var distanceToCliff = ground.end - this.status.x;
                if (distanceToCliff <= this.potential.chargeStartDistance) {
                    this.status.state = State.CHARGE;
                }
                break;
            case State.CHARGE:
                if (this.status.time >= this.potential.chargeTime) {
                    this.status.time = 0;
                    this.jump(nextGround);
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
                if (ground.height >= prevY) { // 横からぶつかった
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

    jump(ground: entity.Ground) {
        this.status.velocity = range(
            GRAVITY + 1,
            this.potential.jumpPower
            + this.potential.jumpHeightWeight * (ground.height - this.status.y)
            + this.potential.jumpWidthWeight * (ground.begin - this.status.x),
            this.potential.chargeWeight * this.potential.chargeTime);
        this.status.state = State.AIR;
    }

    private on(ground: entity.Ground) {
        return ground.end > this.status.x + 8 && this.status.x - 8 >= ground.begin;
    }
}

function range(min: number, value: number, max: number) {
    return Math.max(min, Math.min(value, max));
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
        public jumpPower: number,
        public chargeStartDistance: number,
        public chargeTime: number,
        public chargeWeight: number,
        public jumpHeightWeight: number,
        public jumpWidthWeight: number,
        public life: number,
        public recoveryPower: number) {
    }
}

export class HiyokoFactory {
    static createNew() {
        return Enumerable.repeat(null, 20).select(x => {
            var hiyoko = new Hiyoko(createPotential());
            hiyoko.status.x = utils.randomRange(-50 * 1000, 50 * 1000);
            return hiyoko;
        }).toArray();
    }

    static createNext(hiyokos: Hiyoko[]): Hiyoko[] {
        return select(hiyokos)
            .shuffle()
            .buffer(2)
            .select((x: Hiyoko[]) => crossover(x[0].potential, x[1].potential))
            .selectMany(x => x)
            .select(x => new Hiyoko(x))
            .toArray();
    }
}

function select(hiyokos: Hiyoko[]) {
    // トーナメント形式で淘汰する
    return Enumerable.from(hiyokos)
        .shuffle()
        .buffer(2)
        .select((x: Hiyoko[]) => Enumerable.from(x)
            .orderBy(y => y.status.x).first());
}

function createPotential() {
    return new Potential(
        utils.randomRange(2900, 3000),
        utils.randomRange(0, 1000),
        utils.randomRange(3 * 1000, 30 * 1000),
        utils.randomRange(1, 2),
        utils.randomRange(1, 10000),
        utils.randomRange(0, 0.04 * 2),
        utils.randomRange(0, 0.07 * 2),
        utils.randomRange(1, 100),
        utils.randomRange(0, 100));
}

function crossover(p1: Potential, p2: Potential) {
    if (Math.random() < 0.005) { // 突然変異
        p1 = createPotential();
    }
    var selector = Enumerable.generate(() => Math.random() >= 0.5, 9).toArray();
    return [
        new Potential(
            selector[0] ? p1.speed : p2.speed,
            selector[1] ? p1.jumpPower : p2.jumpPower,
            selector[2] ? p1.chargeStartDistance : p2.chargeStartDistance,
            selector[3] ? p1.chargeTime : p2.chargeTime,
            selector[4] ? p1.chargeWeight : p2.chargeWeight,
            selector[5] ? p1.jumpHeightWeight : p2.jumpHeightWeight,
            selector[6] ? p1.jumpWidthWeight : p2.jumpWidthWeight,
            selector[7] ? p1.life : p2.life,
            selector[8] ? p1.recoveryPower : p2.recoveryPower
            ),
        new Potential(
            !selector[0] ? p1.speed : p2.speed,
            !selector[1] ? p1.jumpPower : p2.jumpPower,
            !selector[2] ? p1.chargeStartDistance : p2.chargeStartDistance,
            !selector[3] ? p1.chargeTime : p2.chargeTime,
            !selector[4] ? p1.chargeWeight : p2.chargeWeight,
            !selector[5] ? p1.jumpHeightWeight : p2.jumpHeightWeight,
            !selector[6] ? p1.jumpWidthWeight : p2.jumpWidthWeight,
            !selector[7] ? p1.life : p2.life,
            !selector[8] ? p1.recoveryPower : p2.recoveryPower
            )
    ];
}