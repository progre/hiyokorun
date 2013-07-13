import hiyoko = require('domain/entity/hiyoko');

export = Game;
class Game {
    container = new createjs.Container();
    private hiyokos: HiyokoView[] = [];
    private center = 0;

    constructor() {
        this.container.addChild(whiteWall());
        for (var i = 0; i < 20; i++) {
            this.hiyokos.push(new HiyokoView());
        }
        var i = 0;
        this.hiyokos.forEach(x => {
            x.animation.x += i++; // ‰ŠúˆÊ’u‚ð‚¿‚å‚Á‚Æ‚¸‚ç‚·
            this.container.addChild(x.animation);
        });
    }

    update() {
        this.hiyokos.forEach(x => x.update());
        this.pan();
    }

    private pan() {
        var firstest = this.getFastest().model.status.x;
        if (firstest < this.center)
            this.center -= (this.center - firstest) /2;
        else if (firstest > this.center)
            this.center += (firstest - this.center) / 2;
        this.container.x = this.center;
    }

    private getFastest() {
        return Enumerable.from(this.hiyokos)
            .orderBy(x => x.model.status.x)
            .first();
    }
}

function whiteWall() {
    var bg = new createjs.Shape();
    bg.graphics.beginFill('#fff').drawRect(0, 0, 320000, 320000);
    return bg;
}

class HiyokoView {

    model = new hiyoko.Hiyoko(new hiyoko.Potential());
    animation: createjs.BitmapAnimation;

    constructor() {
        var spriteSheet = {
            images: ['/img/hiyoco_nomal_full.png'],
            frames: { width: 32, height: 32 },
            animations: {
                walk: [2, 3, null, 8],
                stamp: [0, 0],
                jump: [3, 3]
            }
        };
        var ss = new createjs.SpriteSheet(spriteSheet);
        var character = new createjs.BitmapAnimation(ss);
        character.scaleX = 1000;
        character.scaleY = 1000;
        character.gotoAndPlay('walk');
        this.animation = character;
    }

    update() {
        this.model.update();
        this.animation.x = 300 * 1000 - this.model.status.x;
        this.animation.y = 200 * 1000 - this.model.status.y;
    }
}
