export class Hiyoko {
    status = new Status();
    constructor(private potential: Potential) {
        this.status.life = potential.life;
    }

    update() {
        this.status.life += this.potential.recoveryPower;
        if (this.status.life > this.potential.life) {
            this.status.life = this.potential.life;
        }
        this.status.x += 2000;
    }
}

export class Status {
    life: number;
    x = 0;
    y = 0;
}

export class Potential {
    speed: number;
    chargeStartDistance: number;
    chargeTime: number;
    jumpHeightWeight: number;
    jumpWidthWeight: number;
    life: number;
    recoveryPower: number;
}
