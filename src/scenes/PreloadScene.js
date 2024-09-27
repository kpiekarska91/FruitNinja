import "../../public/style.css";
import Phaser from "phaser";
import {apiUrl, game} from '../main.js';
import axios from 'axios';
export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    preload() {
        this.load.image('background', 'assets/bg/start_bg.jpg');
        this.load.image("button", "assets/btn/zagraj_btn.png");
        this.load.image("menu_btn", "assets/btn/menu_btn.png");

        this.load.image("zagraj_btn_v2", "assets/btn/zagraj_btn_v2_no_text.png");
        this.load.image("restart_btn_v2", "assets/btn/restart_btn_v2.png");
        this.load.image("menu_btn_v2", "assets/btn/menu_btn_v2_no_text.png");
        this.load.image("paginacja_btn", "assets/btn/paginacja_btn.png");

        this.load.image('instruction-bg', 'assets/instruction/instructions-bg.jpg');
        this.load.image('instruction-desktop', 'assets/instruction/jti-fruit-ninja-instructions-desktop.png');
        this.load.image('instruction-mobile', 'assets/instruction/jti-fruit-ninja-instructions-mobile.png');
        this.load.image('instruction-mobile2', 'assets/instruction/jti-fruit-ninja-instructions-mobile-2.png');


        this.load.image('instruction-desktop-icons', 'assets/instruction/jti-fruit-ninja-instructions-icons-desktop.png');
        this.load.image('instruction-mobile-icons', 'assets/instruction/jti-fruit-ninja-instructions-icons-mobile.png');


        this.load.image('background-game', 'assets/bg/bg.jpg');
        this.load.image('background-menu', 'assets/bg/menu_bg.jpg');
        this.load.atlas('roze', 'assets/explode/roze.png', 'assets/explode/rose.json');
        this.load.atlas('gruszka', 'assets/explode/gruszka_mieta.png', 'assets/explode/gruszka_mieta.json');
        this.load.atlas('smoke', 'assets/explode/smoke.png', 'assets/explode/smoke.json');

        this.load.image('plama_slash', 'assets/explode/plama_slash.png');
        this.load.image('smoke', 'assets/explode/smoke.png');


        // 1 / 2 / 3 / 5 / 4

        this.load.atlas('pack_01', 'assets/paczki/packs_bronze_cut_1.png', 'assets/paczki/packs.json');
        this.load.atlas('pack_01_02', 'assets/paczki/packs_bronze_cut_2.png', 'assets/paczki/packs.json');
        this.load.atlas('pack_01_vert', 'assets/paczki/packs_bronze_cut_3.png', 'assets/paczki/packs.json');
        this.load.atlas('pack_01_03', 'assets/paczki/packs_bronze_cut_5.png', 'assets/paczki/packs.json');
        this.load.atlas('pack_01_04', 'assets/paczki/packs_bronze_cut_4.png', 'assets/paczki/packs.json');

        this.load.atlas('pack_02_vert', 'assets/paczki/packs_garnet_cut_1.png', 'assets/paczki/packs.json');
        this.load.atlas('pack_02', 'assets/paczki/packs_garnet_cut_3.png', 'assets/paczki/packs.json');

        this.load.atlas('pack_03_vert', 'assets/paczki/packs_gold_cut_1.png', 'assets/paczki/packs.json');
        this.load.atlas('pack_03', 'assets/paczki/packs_gold_cut_3.png', 'assets/paczki/packs.json');

        this.load.atlas('pack_04_vert', 'assets/paczki/packs_silver_cut_1.png', 'assets/paczki/packs.json');
        this.load.atlas('pack_04', 'assets/paczki/packs_silver_cut_3.png', 'assets/paczki/packs.json');

        this.load.atlas('pack_05_vert', 'assets/paczki/packs_tan_cut_1.png', 'assets/paczki/packs.json');
        this.load.atlas('pack_05', 'assets/paczki/packs_tan_cut_3.png', 'assets/paczki/packs.json');

        this.load.atlas('pack_06_vert', 'assets/paczki/packs_teal_cut_1.png', 'assets/paczki/packs.json');
        this.load.atlas('pack_06', 'assets/paczki/packs_teal_cut_3.png', 'assets/paczki/packs.json');

        this.load.atlas('pack_07_vert', 'assets/paczki/packs_yellow-cut_1.png', 'assets/paczki/packs.json');
        this.load.atlas('pack_07', 'assets/paczki/packs_yellow-cut_1.png', 'assets/paczki/packs.json');


        this.load.image('punkty_bg', 'assets/elements/punkty_bg.png');
        this.load.image('czas_bg', 'assets/elements/czas_bg.png');
        this.load.image('life', 'assets/elements/device_zycie.png');
        this.load.image('bomb', 'assets/explode/dynamit_bez_cienia.png');
        this.load.audio('fireworkSound', ['assets/sfx/firework.wav']);
        this.load.audio('slash', ['assets/sfx/slash.wav']);
        this.load.audio('endSound', ['assets/music/end.mp3']);
        this.load.audio('bombSound', ['assets/music/explosion_bomb.wav']);
        this.load.image('line', 'assets/elements/line.png');
        this.load.atlas('flares', 'assets/explode/flares.png', 'assets/explode/flares.json');


        this.load.json('config', './config.json');
    }

    /**
     * Create the game objects (images, groups, sprites and animations).
     */
    create() {
        let configData = this.cache.json.get('config');
        this.currentLanguage = configData.language;
        if (configData.languages[this.currentLanguage]) {
            this.stringsLanguage = configData.languages[this.currentLanguage];
        } else {
             this.stringsLanguage = configData.languages['en'];
        }


        const {width, height} = this.game.config;

        this.add.text(0, 0, 0, {
            font: this.game.scale.gameSize.width / 14 + 'px circularxxbold',
            fill: '#000000'
        }).setAlpha(0)
        this.add.text(0, 0, 0, {
            font: this.game.scale.gameSize.width / 14 + 'px circularxxregular',
            fill: '#000000'
        }).setAlpha(0)
        this.callInitApi();

    }

    callInitApiLocal() {
        let urlObject = new URL(window.location.href);
        let userId = urlObject.searchParams.get('id');
        let initUrl = apiUrl + 'init/' + userId;

        axios.get(initUrl)
            .then(response => {
                const value = response.data;
                window.user_id = value.user._id;
                game.scene.start('MenuScene');
            })
            .catch(error => {
                console.error('Błąd podczas wywoływania API:', error);
            });
    }

    callInitApiProduction() {
        window.jticonnexus.init()
            .then(function (value) {
                console.log(value)
                if (typeof value.user != "undefined") {
                    window.user_id = value.user._id;
                    window.nick = value.user.firstname;
                    game.scene.start('MenuScene');
                } else {
                    console.error('Błąd podczas wywoływania API:', value);
                    return;
                }
            })
            .catch(function (e) {
                console.log('e', e);
            });
    }

    callInitApi() {
            this.callInitApiLocal();

    }

}
