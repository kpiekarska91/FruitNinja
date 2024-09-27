import "../../public/style.css";
import Phaser from "phaser";

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload() {
     }

    create() {

        let preloadScene = this.scene.get('PreloadScene');
        let currentLanguage = preloadScene.currentLanguage;
        let stringsLanguage = preloadScene.stringsLanguage;


        const {width, height} = this.game.config;

        this.background = this.physics.add.image(0, 0, 'background-menu').setOrigin(0, 0);
        this.background.displayWidth = width;
        this.background.displayHeight = height;

        const createButton = (text, sceneName, yOffset) => {
            const button = this.add.image(width / 2, height / 2 + yOffset, "menu_btn")
                .setOrigin(0.5, 0.5)
                .setInteractive()
                .on("pointerdown", () => this.goToScene(sceneName));

            button.displayWidth = width / 2;
            button.scaleY = button.scaleX;

            this.add.text(button.x, button.y, text, {
                font: width / 27 + 'px circularxxbold',
                fill: '#000000'
            }).setOrigin(0.5, 0.5);

            return button;
        };

        const buttonRanking = createButton(stringsLanguage.btnRank, 'EndScene', 0);
        createButton(stringsLanguage.btnRules, 'InstructionScene', -buttonRanking.displayHeight - buttonRanking.displayHeight / 2);
        createButton(stringsLanguage.btnPlay, 'MainScene', buttonRanking.displayHeight + buttonRanking.displayHeight / 2);
    }

    goToScene(scene) {
            this.scene.start(scene);
    }
}
