/// <reference path='../../../lib/easeljs/easeljs.d.ts'/>
/// <reference path='../../../lib/EventEmitter.d.ts'/>

declare var stats;

export module main {
    var WIDTH = 320 * 1000;
    var HEIGHT = WIDTH;
    var canvas: HTMLCanvasElement;
    var stage: createjs.Stage;

    window.onload = function () {
        canvas = <HTMLCanvasElement>document.getElementById('canvas');
        stage = new createjs.Stage(canvas);
        resize();
        stage.addChild();
        window.addEventListener('resize', resize);
        createjs.Ticker.setFPS(60);
        createjs.Ticker.addListener(() => {
            stats.begin();
            update();
            draw();
            stage.update();
            stats.end();
        });
        initDraw();
    };

    function resize() {
        var size = Math.min(window.innerWidth, window.innerHeight);
        canvas.width = size;
        canvas.height = size;
        stage.scaleX = size / WIDTH;
        stage.scaleY = size / HEIGHT;
    }

    function update() {
    }

    function draw() {

    }

    function initDraw() {
        var brand = new createjs.Bitmap('img/brand.png');
        brand.scaleX = 1000;
        brand.scaleY = 1000;
        brand.alpha = 0.0;
        createjs.Tween.get(brand)
            .to({ alpha: 1.0 }, 1000)
            .wait(2000)
            .to({ alpha: 0.0 }, 1000);
        stage.addChild(brand);
    }
}