import Phaser from "phaser";

export default class EndScene extends Phaser.Scene {
    constructor() {
        super('EndScene');
        this.sortedTop;
        this.uniqueUserIds;
        this.userPlace = 0;
        this.currentPage = 1;
        this.resultsPerPage = 10;
        this.allResults = [];
    }

    init(data) {
        this.score = data.score;
        this.time = data.time;
        this.endGame = data.endGame;
    }

    preload() {
        this.load.image('background-score', 'assets/bg/menu_bg.jpg');
        this.load.image("button", "assets/btn/restart_btn.png");
    }

    createElements() {
        let preloadScene = this.scene.get('PreloadScene');
        let currentLanguage = preloadScene.currentLanguage;
        let stringsLanguage = preloadScene.stringsLanguage;

        const {width, height} = this.game.config;

        this.background = this.physics.add.image(0, 0, 'background-score').setOrigin(0, 0);
        this.background.displayWidth = this.game.config.width;
        this.background.displayHeight = this.game.config.height;
        this.add.text(
            this.game.scale.gameSize.width / 2,
            this.game.scale.gameSize.height / 2,
            stringsLanguage.ranking,
            {
                font: this.game.scale.gameSize.width / 20 + 'px circularxxbold',
                fill: '#fff',
                lineSpacing: 10
            }
        ).setOrigin(0.5, 0.5).setAlign('center');


        const button = this.createButton(this.endGame ? stringsLanguage.btnRestart : stringsLanguage.btnPlay, 'zagraj_btn_v2', 'MainScene', width - width / 5, height - height / 17, width, height, 0);
        const buttonMenu = this.createButton(stringsLanguage.btnMenu, 'menu_btn_v2', 'MenuScene', width - button.displayWidth - width / 8.5, height - height / 17, width, height, 0);


    }

    create() {
        this.createElements()


    }

    createButton = (text, texture, sceneName, x, y, width, height, offset = 0) => {
        const button = this.add.image(x, y, texture)
            .setOrigin(0.5, 0.5)
            .setDisplaySize(0, height / 13)
            .setInteractive()
            .on("pointerdown", () => this.goToScene(sceneName));

        button.scaleX = button.scaleY;

        this.add.text(button.x - offset, button.y, text, {
            font: width / 24 + 'px circularxxbold',
            fill: '#000000'
        }).setOrigin(0.5, 0.5);

        return button;
    };

    goToScene(scene) {
        this.scene.start(scene);
    }

}


