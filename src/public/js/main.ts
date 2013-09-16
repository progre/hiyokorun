/// <reference path='../../../lib/easeljs/easeljs.d.ts'/>
/// <reference path='../../../lib/EventEmitter.d.ts'/>
/// <reference path='../../../lib/linq.d.ts'/>

import presenter = require('userinterface/presenter');

var WIDTH = 320 * 1000;
var HEIGHT = WIDTH;

export module main {
    window.addEventListener('load', () => {
        var mainObj = new Main(<HTMLCanvasElement>document.getElementById('canvas'));
        window.addEventListener('resize', () => mainObj.resize());
        mainObj.start();
    });
}

class Main {
    private stage: createjs.Stage;
    private presenterObj: presenter.Presenter;

    constructor(private canvas: HTMLCanvasElement) {
        this.stage = new createjs.Stage(this.canvas);
        this.resize();
        this.presenterObj = new presenter.Presenter(this.stage);
    }

    resize() {
        var size = Math.min(window.innerWidth, window.innerHeight);
        this.canvas.width = size;
        this.canvas.height = size;
        this.stage.scaleX = size / WIDTH;
        this.stage.scaleY = size / HEIGHT;
    }

    start() {
        createjs.Ticker.setFPS(60);
        createjs.Ticker.addListener(() => {
            this.presenterObj.update();
            this.stage.update();
        });
    }
}
