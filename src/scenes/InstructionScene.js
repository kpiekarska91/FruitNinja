import "../../public/style.css";
import Phaser from "phaser";

export default class InstructionScene extends Phaser.Scene {
    constructor() {
        super('InstructionScene');
    }

    preload() {
    }

    create() {

        let preloadScene = this.scene.get('PreloadScene');
        let currentLanguage = preloadScene.currentLanguage;
        let stringsLanguage = preloadScene.stringsLanguage;


        const {width, height} = this.game.config;

        // Tło
        this.background = this.add.image(0, 0, 'instruction-bg').setOrigin(0, 0);
        this.background.displayWidth = width;
        this.background.displayHeight = height;


        this.add.text(width / 2, height / 6.5, stringsLanguage.title, {
            font: width / 14 + 'px circularxxbold',
            fill: '#fff'
        }).setOrigin(0.5, 0.5);

        this.addInstructionText(width, height, stringsLanguage);

        const instructionType = this.isMobile() ? 'instruction-mobile-icons' : 'instruction-desktop-icons';

        this.instruction = this.add.image(width / 4, height / 2, instructionType).setOrigin(0.5, 0.5);
        this.instruction.displayHeight = height - height / 2.1;
        this.instruction.scaleX = this.instruction.scaleY;


        // this.addButtons(width, height, stringsLanguage);

        const button = this.createButton(stringsLanguage.btnPlay, 'zagraj_btn_v2', 'MainScene', width - width / 5, height - height/17, width, height,0);
        const buttonMenu = this.createButton(stringsLanguage.btnMenu, 'menu_btn_v2', 'MenuScene', width - button.displayWidth - width/8.5, height - height/17, width, height,0);


    }

    isMobile() {
        const mobileRegex = /Android|webOS|iPhone`|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        return mobileRegex.test(navigator.userAgent);
    }

    goToScene(scene) {
        this.scene.start(scene);
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
    addInstructionText(width, height, stringsLanguage) {
        this.add.text(width / 2.5, height / 4.35, this.isMobile() ? stringsLanguage.rules_part_1_mobile : stringsLanguage.rules_part_1_desktop, {
            font: width / 28 + 'px circularxxbold',
            fill: '#fff',
            wordWrap: {width: width / 2.2, useAdvancedWrap: false},
            wrap: {
                mode: 'word'
            }
        }).setOrigin(0, 0).setAlign('left');

        this.add.text(width / 2.5, height / 2.6, stringsLanguage.rules_part_2, {
            font: width / 28 + 'px circularxxbold',
            fill: '#fff',
            wordWrap: {width: width / 2, useAdvancedWrap: false},
            wrap: {
                mode: 'word'
            }
        }).setOrigin(0, 0).setAlign('left');

        this.add.text(width / 2.5, height / 1.85, stringsLanguage.rules_part_3, {
            font: width / 28 + 'px circularxxbold',
            fill: '#fff',
            wordWrap: {width: width / 2, useAdvancedWrap: false},
            wrap: {
                mode: 'word'
            }
        }).setOrigin(0, 0).setAlign('left');

        this.add.text(width / 2.5, height / 1.54, stringsLanguage.rules_part_4, {
            font: width / 28 + 'px circularxxbold',
            fill: '#fff',
            wordWrap: {width: width / 2, useAdvancedWrap: false},
            wrap: {
                mode: 'word'
            }
        }).setOrigin(0, 0).setAlign('left');
    }
}
