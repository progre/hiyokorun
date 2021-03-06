import Game = require('userinterface/game');

export class Presenter {
    frame = -1;
    scene: createjs.DisplayObject;
    sceneType: SceneType = null;
    game = new Game();

    constructor(private stage: createjs.Stage) {
    }

    update() {
        if (this.frame === -1) {
            this.changeScene(SceneType.GAME);
        }
        if (this.sceneType === SceneType.GAME) {
            this.game.update();
        }
    }

    changeScene(sceneType: SceneType) {
        if (this.scene !== null) {
            this.stage.removeChild(this.scene);
        }
        switch (sceneType) {
            case SceneType.BRAND:
                this.scene = getBrandScene(this);
                break;
            case SceneType.TITLE:
                this.scene = getTitleScene(this);
                break;
            case SceneType.GAME:
                this.scene = this.game.container;
                break;
        }
        this.frame = 0;
        this.sceneType = sceneType;
        this.stage.addChild(this.scene);
    }
}

export enum SceneType {
    BRAND, TITLE, GAME
}


function getBrandScene(presenter: Presenter) {
    var brand = new createjs.Bitmap('img/brand.png');
    brand.scaleX = 1000;
    brand.scaleY = 1000;
    brand.alpha = 0.0;
    createjs.Tween.get(brand)
        .to({ alpha: 1.0 }, 1000)
        .wait(2000)
        .to({ alpha: 0.0 }, 1000)
        .call(tweenObject => {
            presenter.changeScene(SceneType.TITLE);
        });
    return brand;
}

function getTitleScene(presenter: Presenter) {
    var title = new createjs.Bitmap('img/title.png');
    title.scaleX = 1000;
    title.scaleY = 1000;
    title.alpha = 0.0;
    createjs.Tween.get(title)
        .to({ alpha: 1.0 }, 250)
        .call(tweenObject => {
            presenter.changeScene(SceneType.GAME);
        });
    return title;
}