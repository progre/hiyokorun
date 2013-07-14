import utils = require('domain/service/utils');
import entity = require('domain/entity/entity');

var GRAVITY = 300;

export class Hiyoko {
    status = new Status();
    private groundIndex = 0;

    constructor(private potential: Potential) {
        this.status.life = potential.life;
    }

    update(grounds: entity.Ground[]) {
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

    hitProcess(ground: entity.Ground) {
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

    private on(ground: entity.Ground) {
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

export module HiyokoFactory {
    export function createNew() {
        return Enumerable.repeat(null, 20).select(x => {
            var hiyoko = new Hiyoko(new Potential(
                utils.randomRange(2500, 3000),
                utils.randomRange(0, 100 * 1000),
                utils.randomRange(0, 10),
                utils.randomRange(0, 10000000000),
                utils.randomRange(0, 1),
                utils.randomRange(0, 1),
                utils.randomRange(1, 100),
                utils.randomRange(0, 100)))
            hiyoko.status.x = utils.randomRange(-10 * 1000, 10 * 1000);
            return hiyoko;
        }).toArray();
    }
}
