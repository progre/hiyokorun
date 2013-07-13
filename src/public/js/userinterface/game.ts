export = Game;
class Game {
    container = new createjs.Container();
    private hiyokos: Hiyoko[] = [];

    constructor() {
        this.container.scaleX = 1000;
        this.container.scaleY = 1000;
        for (var i = 0; i < 20; i++) {
            this.hiyokos.push(new Hiyoko());
        }
        var i = 0;
        this.hiyokos.forEach(x => {
            x.animation.x += i++;
            this.container.addChild(x.animation);
        });
    }

    update() {
        this.hiyokos.forEach(x => {
            x.update();
        });
    }
}

class Hiyoko {
    model: { x: number; y: number };
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
        character.gotoAndPlay('walk');
        this.animation = character;
    }
    update() {
    }
}
