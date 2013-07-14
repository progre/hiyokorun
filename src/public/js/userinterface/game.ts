import entity = require('domain/entity/entity');
import hiyoko = require('domain/entity/hiyoko');

export = Game;
class Game {
    container = new createjs.Container(); // 320000 x 320000
    private worldView = new WorldView();
    private meterText = new createjs.Text('1000m', '20px sans-serif', '#888');

    constructor() {
        this.container.addChild(whiteWall());
        this.container.addChild(this.worldView.container);
        this.container.addChild(this.meterText);
        this.meterText.y = 300 * 1000;
        this.meterText.scaleX = 1000;
        this.meterText.scaleY = 1000;
    }

    createWorld() {
        if (this.worldView !== null) {
            this.container.removeChild(this.worldView.container);
        }
        this.worldView = new WorldView();
        this.container.addChild(this.worldView.container);
    }

    update() {
        this.worldView.update();
        if (this.worldView.isEnd()) {
            this.createWorld();
        }
        this.meterText.text = (this.worldView.center / 10000 | 0) + ' cm';
    }
}

class WorldView {
    container = new createjs.Container();
    center = 0;
    private hiyokos: HiyokoView[] = [];
    private grounds: GroundView[] = [];

    constructor() {
        this.container.y = 200 * 1000;

        entity.GroundFactory.create(0, 1000).forEach(x => {
            this.grounds.push(new GroundView(x));
        });
        this.hiyokos = hiyoko.HiyokoFactory.createNew()
            .map(x => new HiyokoView(x));
        this.hiyokos.forEach(
            x => this.container.addChild(x.animation));
    }

    update() {
        var groundModels = this.grounds.map(x => x.model);
        Enumerable.from(this.hiyokos)
            .where(x => x.model.status.state !== hiyoko.State.DEAD)
            .forEach(x => x.update(groundModels));
        this.pan();
    }

    isEnd() {
        return this.hiyokos.every(x => x.model.status.state === hiyoko.State.DEAD);
    }

    getFastest() {
        return Enumerable.from(this.hiyokos)
            .where(x => x.model.status.state !== hiyoko.State.DEAD)
            .orderBy(x => -x.model.status.x)
            .firstOrDefault();
    }

    pan() {
        var firstestHiyoko = this.getFastest();
        if (firstestHiyoko == null)
            return;
        var firstest = firstestHiyoko.model.status.x;
        if (firstest < this.center)
            this.center -= (this.center - firstest) / 2;
        else if (firstest > this.center)
            this.center += (firstest - this.center) / 2;
        this.container.x = this.center + 160 * 1000;

        this.grounds.forEach(x => {
            if (this.isVisible(x.model.begin, x.model.end))
                this.container.addChild(x.shape);
            else
                this.container.removeChild(x.shape);
        });
    }

    isVisible(begin: number, end: number) {
        var screenBegin = this.center - 160 * 1000;
        var screenEnd = this.center + 160 * 1000;
        return screenEnd >= begin && begin >= screenBegin ||
            screenEnd >= end && end >= screenBegin ||
            end >= screenEnd && screenBegin >= begin;
    }
}

function whiteWall() {
    var bg = new createjs.Shape();
    bg.graphics.beginFill('#fff').drawRect(0, 0, 320000, 320000);
    return bg;
}

class HiyokoView {
    animation: createjs.BitmapAnimation;
    currentState = hiyoko.State.WALK;

    constructor(public model: hiyoko.Hiyoko) {
        var spriteSheet = {
            images: ['/img/hiyoco_nomal_full.png'],
            frames: { width: 32, height: 32 },
            animations: {
                'walk': [2, 3, null, 8],
                'charge': 1,
                'air': 3,
                'fall': 4
            }
        };
        var ss = new createjs.SpriteSheet(spriteSheet);
        this.animation = new createjs.BitmapAnimation(ss);
        this.animation.scaleX = 1000;
        this.animation.scaleY = 1000;
        this.animation.gotoAndPlay('walk');
    }

    update(grounds: entity.Ground[]) {
        this.model.update(grounds);
        if (this.currentState !== this.model.status.state) {
            this.currentState = this.model.status.state;
            this.animation.gotoAndPlay(toAnimationName(this.currentState));
        }
        this.animation.x = -this.model.status.x - 16 * 1000;
        this.animation.y = -this.model.status.y - 31 * 1000;
    }
}

class GroundView {
    shape = new createjs.Shape();

    constructor(public model: entity.Ground) {
        var width = this.model.end - this.model.begin;
        this.shape.graphics.beginFill('#000').drawRect(
            -this.model.end, -this.model.height,
            width, 320000);
    }
}

function toAnimationName(state: hiyoko.State) {
    switch (state) {
        case hiyoko.State.WALK: return 'walk';
        case hiyoko.State.CHARGE: return 'charge';
        case hiyoko.State.AIR: return 'air';
        case hiyoko.State.FALL: return 'fall';
        default: return '';
    }
}
