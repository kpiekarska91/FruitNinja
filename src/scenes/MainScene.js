import "../../public/style.css";
import Phaser from "phaser";
import {apiUrl, convertMinutesSeconds} from "../main.js";


const HORIZONTAL_POSITION = 'horizontal';
const VERTICAL_POSITION = 'vertical';
const SPEED = 1.4;

export default class MainScene extends Phaser.Scene {
    constructor() {
        super({key: 'MainScene'});
        this.score = 0;
        this.lifesLosts = 0;
        this.chrono = 0;
        this.previousChrono = 0;
        this.lifes = 5;
        this.pointsInput = [];
        this.isCutting = false;
        this.isBomb = false;
        this.delay = 2500;
        this.delayBomb = 4500;
        this.scoreText = 0;
        this.timeText = 0;
        this.fruits = null;
        this.bombs = null;
        this.currentBomb = null;
        this.numberOfFruit = 1;
        this.numberOfBomb = 1;
        this.emmiters = null;
        this.emitterRose = null;
        this.emitterGruszka = null;
        this.emitterBomb = null;
        this.emitterBombLine = null;
        this.emitterBombLineGroup = null;
        this.choice = null;
        this.x = 0;
        this.y = 0;
        this.lifesGroup = null;
        this.line = null;
        this.slashSound = null;
        this.bombSound = null;
        this.endSound = null;
        this.fireworkSound = null;
        this.position = HORIZONTAL_POSITION;
        this.positionAngle = 0;
        this.fruitsCutThisMove = 0;
    }

    preload() {

    }

    create() {
        this.x;
        this.y;
        this.background = this.physics.add.image(0, 0, 'background-game').setOrigin(0, 0);
        this.background.displayWidth = this.game.config.width;
        this.background.displayHeight = this.game.config.height;

        this.speed = this.setSpeed();
        // Init Sounds
        this.slashSound = this.sound.add('slash');
        this.bombSound = this.sound.add('bombSound');
        this.endSound = this.sound.add('endSound');
        this.fireworkSound = this.sound.add('fireworkSound');
        this.fireworkSound.setVolume(0.2);
        this.fireworkSound.setLoop(true);
        this.slashes = this.add.graphics();
        let iconWidth = this.game.config.width / 25;
        let iconSpacing = this.game.config.width / 75;
        // Init fruit and bombs
        this.fruits = this.physics.add.group();
        this.bombs = this.physics.add.group();

        this.resetValues();

        this.scaleFruit = this.getScale();

        this.fruitScore = this.add.sprite(this.game.config.width * 0.03, this.game.config.height * 0.03, 'punkty_bg').setOrigin(0, 0);
        this.fruitScore.displayWidth = this.game.config.width / 4;
        this.fruitScore.scaleY = this.fruitScore.scaleX;

        this.scoreText = this.add.text(this.fruitScore.x + this.fruitScore.displayWidth / 2.5, this.fruitScore.y + this.fruitScore.displayHeight / 2, this.score, {
            font: this.game.scale.gameSize.width / 17 + 'px circularxxbold',
            fill: '#000000'
        }).setOrigin(0.5, 0.5);


        this.timeScore = this.add.sprite(this.fruitScore.displayWidth - this.fruitScore.displayWidth * 0.2, this.game.config.height * 0.03, 'czas_bg').setOrigin(0, 0);
        this.timeScore.displayHeight = this.fruitScore.displayHeight
        this.timeScore.scaleX = this.timeScore.scaleY;
        //
        this.timeText = this.add.text(this.timeScore.x + this.timeScore.displayWidth / 1.8, this.fruitScore.y + this.fruitScore.displayHeight / 2, convertMinutesSeconds(this.chrono), {
            font: this.game.scale.gameSize.width / 17 + 'px circularxxbold',
            fill: '#000000'
        }).setOrigin(0.5, 0.5);


        this.lifesGroup = this.physics.add.group({
            key: 'life',
            repeat: this.lifes - 1,
            displayWidth: 3,
            setXY: {
                x: this.game.config.width - iconWidth - iconSpacing,
                y: this.game.config.height * 0.08,
                stepX: -(iconWidth + iconSpacing)
            },
        });

        this.lifesGroup.children.iterate(life => {
            life.displayWidth = this.game.config.width / 25;
            life.scaleY = life.scaleX;
        });


        this.timerFruit = this.time.addEvent({
            delay: this.delay,
            callback: this.createFruit,
            callbackScope: this,
            loop: true,
            paused: false,
        });


        this.timerBomb = this.time.addEvent({
            delay: this.delayBomb,
            callback: this.createBomb,
            callbackScope: this,
            loop: true,
        });


        this.timer2 = this.time.addEvent({
            delay: 1000,
            callback: this.generalCounter,
            callbackScope: this,
            loop: true,
        });


        this.initEmitters();
        this.createFruit();


        this.timerCutStreakReset = this.time.addEvent({
            delay: 1000,
            callback: this.resetCutStreak,
            callbackScope: this,
            loop: true,
        });
        // emitterRose.stop()
        this.input.on('pointerdown', function (pointer) {
            that.isCutting = true;
        });

        let that = this;
        this.input.on('pointerup', function (pointer) {
            that.isCutting = false;
            that.clearSlash()
        });

        // Update pointer value
        this.input.on('pointermove', function (pointer) {
            if (that.isCutting) {
                that.x = pointer.x;
                that.y = pointer.y;
                that.updateSlashDirection();

            }
        });

        this.input.on('gameout', function (pointer) {
            that.isCutting = false;
            that.clearSlash()
        });
    }

    initEmitters() {
        this.emmiters = this.physics.add.group();

        this.emitterRose = this.add.particles(0, 0, 'roze', {
            frame: ['roza1', 'roza2', 'roza3', 'roza4', 'roza5', 'roza6'],
            lifespan: 2000,
            speed: {min: 100, max: 250},
            scale: {start: this.scaleFruit / 1.2, end: this.scaleFruit / 1.2},
            alpha: {start: 1, end: 0},
            rotate: {start: 0, end: 120},
            gravityY: 200,
            emitting: false
        });
        this.emitterGruszka = this.add.particles(0, 0, 'gruszka', {
            frame: ['gruszka1', 'gruszka2', 'gruszka3', 'gruszka4'],
            lifespan: 2000,
            speed: {min: 100, max: 250},
            scale: {start: this.scaleFruit / 1.4, end: this.scaleFruit / 1.4},
            alpha: {start: 1, end: 0},
            rotate: {start: 0, end: 120},
            gravityY: 200,
            emitting: false
        });


        this.emitterBomb = this.add.particles(0, 0, 'smoke', {
            frame: ['smoke1', 'smoke2', 'smoke3', 'smoke4', 'smoke5', 'smoke6'],
            lifespan: 2000,
            speed: {min: 200, max: 550},
            scale: {start: this.scaleFruit, end: this.scaleFruit},
            alpha: {start: 1, end: 0},
            rotate: {start: 0, end: 120},
            gravityY: 0,
            emitting: false
        });


        this.emitterBombLine = this.add.particles(0, 0, 'flares', {
            frame: 'red',
            color: [0x040d61, 0xfacc22, 0xf89800, 0xf83600, 0x9f0404, 0x4b4a4f, 0x353438, 0x040404],
            lifespan: 200,
            angle: {min: -100, max: -80},
            scale: 0.4,
            speed: {min: 200, max: 300},
            advance: 600,
            alpha: {start: .5, end: 0},
            blendMode: 'ADD',
            gravityY: 400,
            emitting: false
        });

    }

    /**
     * Chrono manager
     */
    generalCounter() {
        this.chrono++;
    }

    /**Reset players values */
    resetValues() {
        this.pointsInput = [];
        this.numberOfFruit = 1;
        this.isCutting = false;
        this.numberOfBomb = 1;
        this.delay = 2500;
        this.lifes = 5;
        this.delayBomb = 4500;
        this.isBomb = false;
        // this.chrono = 0;
        this.speed = this.setSpeed();
        this.score = 0;
        this.lifesLosts = 0;
        this.fruitsCutThisMove = 0;
        if (this.timerCutStreakReset)
            this.timerCutStreakReset.remove(false);
        if (this.timerBomb)
            this.timerBomb.remove(false);
        if (this.timerFruit)
            this.timerFruit.remove(false);
        if (this.timer2)
            this.timer2.remove(false);

    }

    createFruit() {
        for (let i = 0; i < this.numberOfFruit; i++) {
            this.generateFruitWithDelay(i);

        }
    }

    getGravity() {
        const currentGameWidth = this.game.config.width;
        const scaledGravity = [400, 450, 500];

        if (currentGameWidth >= 687) {
            return scaledGravity[0];
        } else if (currentGameWidth >= 500 && currentGameWidth < 687) {
            return scaledGravity[1];
        } else {
            return scaledGravity[2];
        }
    }

    setSpeed() {
        const currentGameWidth = this.game.config.width;
        const scaledGravity = [1.2, 1.2, 1.05];

        if (currentGameWidth >= 687) {
            return scaledGravity[0];
        } else if (currentGameWidth >= 500 && currentGameWidth < 687) {
            return scaledGravity[1];
        } else {
            return scaledGravity[2];
        }
    }

    getScale() {
        const currentGameWidth = this.game.config.width;
        const scaledGravity = [0.00059, 0.00076, 0.00096];

        if (currentGameWidth >= 687) {
            return this.game.config.width * scaledGravity[0];
        } else if (currentGameWidth >= 500 && currentGameWidth < 687) {
            return this.game.config.width * scaledGravity[1];
        } else {
            return this.game.config.width * scaledGravity[2];
        }
    }

    generateFruitWithDelay(index) {
        const keySelection = ['pack_01', 'pack_02', 'pack_03', 'pack_04', 'pack_05', 'pack_06', 'pack_07'];
        let randRotation = Phaser.Math.Between(-5, 5);
        let timeRotation = Phaser.Math.Between(500, 1000);


        setTimeout(() => {
            let scale;
            let randSpeedX = Phaser.Math.Between(0, 100) * this.speed;
            let randSpeedY = Phaser.Math.Between(500, 600) * this.speed;
            let randowXpos = Phaser.Math.Between(0 + 100, this.game.config.width - 250);
            let c = this.fruits.create(
                randowXpos,
                this.game.config.height + this.game.config.height * 0.1,
                keySelection[Phaser.Math.Between(0, 4)]
            );

            scale = this.scaleFruit;
            c.setScale(scale).setScrollFactor(0);
            c.setFrame(0);
            c.setVelocity(randowXpos > this.game.config.width / 2 ? -randSpeedX : randSpeedX, -randSpeedY);
            c.allowGravity = true;
            c.setGravityY(this.getGravity());
            c.setInteractive();
            c.setAngularVelocity(randRotation);
            c.body.immovable = true;
            c.setDepth(1);
        }, timeRotation * (index));
    }

    createBomb() {
        let randRotation = Phaser.Math.Between(-5, 5);
        var randSpeedX = Phaser.Math.Between(0, 100) * this.speed;
        var randSpeedY = Phaser.Math.Between(500, 600) * this.speed;
        var randowXpos = Phaser.Math.Between(0 + 100, this.game.config.width - 250);


        // Stwórz obiekt bomby
        var bomb = this.bombs.create(randowXpos, this.game.config.height + this.game.config.height * 0.1, 'bomb');
        bomb.setScale(this.scaleFruit / 1.7).setScrollFactor(0);
        bomb.setVelocity(bomb.body.x > this.game.config.width / 2 ? -randSpeedX : randSpeedX, -randSpeedY);
        bomb.allowGravity = true;
        bomb.setGravityY(this.getGravity());
        bomb.setInteractive();
        bomb.setAngularVelocity(randRotation);
        bomb.body.immovable = true;
        bomb.setOrigin(0, 0);

        bomb.preFX.addShadow(-20, -30, 0.025, 1, 0x810A08, 50, 0.5); // x, y, decay, power, color, samples, intensity
        bomb.setDepth(3);

        // this.bombs.create(bomb.body.x, bomb.body.y, 'line');
        var xOffset = bomb.body.width * .015;
        var yOffset = bomb.body.height * 0.17;
        this.fireworkSound.play();
        this.emitterBombLine.startFollow(bomb, xOffset, yOffset);
        this.emitterBombLine.start(2000);
        this.emitterBombLine.setDepth(4);

    }

    checkIntersects(fruit, callback, that) {

        let xOffset = fruit.body.width * 0.1;
        let yOffset = fruit.body.height * 0.1;
        let l1 = new Phaser.Geom.Line(
            fruit.body.right - fruit.body.width + xOffset,
            fruit.body.bottom - fruit.body.height + yOffset,
            fruit.body.right - xOffset,
            fruit.body.bottom - yOffset
        );

        let l2 = new Phaser.Geom.Line(
            fruit.body.right - fruit.body.width + xOffset,
            fruit.body.bottom + yOffset,
            fruit.body.right - xOffset,
            fruit.body.bottom - fruit.body.height - yOffset
        );
        l2.angle = 90;

        if (Phaser.Geom.Intersects.LineToLine(that.line, l1) || Phaser.Geom.Intersects.LineToLine(that.line, l2)) {
            if (
                (fruit.texture.key == 'pack_02') |
                (fruit.texture.key == 'pack_01') |
                (fruit.texture.key == 'pack_03') |
                (fruit.texture.key == 'pack_04') |
                (fruit.texture.key == 'pack_05') |
                (fruit.texture.key == 'pack_06') |
                (fruit.texture.key == 'pack_07')
            ) {
                switch (fruit.texture.key) {
                    case 'pack_01':
                        that.movePacks(that.position === HORIZONTAL_POSITION ? 'pack_01' : 'pack_01_vert', fruit, that)
                        that.emitterGruszka.emitParticleAt(fruit.x, fruit.y - fruit.y / 4, 20);
                        break;
                    case 'pack_02':
                        that.movePacks(that.position === HORIZONTAL_POSITION ? 'pack_02' : 'pack_02_vert', fruit, that)
                        that.emitterGruszka.emitParticleAt(fruit.x, fruit.y - fruit.y / 5, 20);
                        break;
                    case 'pack_03':
                        that.movePacks(that.position === HORIZONTAL_POSITION ? 'pack_03' : 'pack_03_vert', fruit, that)
                        that.emitterRose.emitParticleAt(fruit.x, fruit.y - fruit.y / 5, 20);
                        break;
                    case 'pack_04':
                        that.movePacks(that.position === HORIZONTAL_POSITION ? 'pack_04' : 'pack_04_vert', fruit, that)
                        that.emitterRose.emitParticleAt(fruit.x, fruit.y - fruit.y / 5, 20);
                        break;
                    case 'pack_05':
                        that.movePacks(that.position === HORIZONTAL_POSITION ? 'pack_05' : 'pack_05_vert', fruit, that)
                        that.emitterRose.emitParticleAt(fruit.x, fruit.y - fruit.y / 5, 20);
                        break;
                    case 'pack_06':
                        that.movePacks(that.position === HORIZONTAL_POSITION ? 'pack_06' : 'pack_06_vert', fruit, that)
                        that.emitterRose.emitParticleAt(fruit.x, fruit.y - fruit.y / 5, 20);
                        break;
                    case 'pack_07':
                        that.movePacks(that.position === HORIZONTAL_POSITION ? 'pack_07' : 'pack_07_vert', fruit, that)
                        that.emitterRose.emitParticleAt(fruit.x, fruit.y - fruit.y / 5, 20);
                        break;
                }

                let plama = that.add.sprite(fruit.x, fruit.y, 'plama_slash');
                plama.setScale(0)

                that.tweens.add({
                    targets: plama,
                    scale: 1.2,
                    alpha: 0,
                    duration: 1000,
                    ease: 'Linear',
                    repeat: 0,
                    onComplete: function () {
                        plama.destroy();
                    }
                });
                this.slashSound.play();
                this.fruitsCutThisMove++;
                let additionalPoints = Math.max(1, 2 * this.fruitsCutThisMove - 1);

                this.score += additionalPoints;
                this.scoreText.text = this.score;
                // if(this.score>9) {
                //     this.scoreText.x = this.scoreText.x - this.scoreText.x * 0.1
                // }
                // score++;
                // scoreText.text = score;
                if (this.score % 5 == 0) {
                    this.delay = this.delay - 100;
                    this.delayBomb = this.delayBomb - 50;
                    if (this.numberOfFruit < 3)
                        this.numberOfFruit = this.numberOfFruit + 1;
                }

            } else {
                that.fruits.clear(true, true);
                that.isBomb = true;
                that.emitterBomb.emitParticleAt(this.game.config.height / 2, this.game.config.height / 2, 400);
                that.emitterBombLine.stop(true);
                that.bombSound.play();
                // that.emitterBombLine.destroy();
                that.gameOver(true);
            }
            fruit.destroy();
        }
    }

    movePacks(pack, fruit, that) {
        let randRotation = Phaser.Math.Between(10, 30);
        let randSpeedX = Phaser.Math.Between(50, 200);
        let randSpeedY = Phaser.Math.Between(500, 600);

        let emmiter2 = this.emmiters.create(fruit.x, fruit.y, pack, 'part1')
        let emmiter = this.emmiters.create(fruit.x, fruit.y, pack, 'part2')
        emmiter.setScale(that.scaleFruit).setScrollFactor(0);
        emmiter2.setScale(that.scaleFruit).setScrollFactor(0);

        emmiter.setAngularVelocity(randRotation);
        emmiter2.setAngularVelocity(-randRotation);

        emmiter.setVelocity(randSpeedX, -randSpeedY);
        emmiter2.setVelocity(-randSpeedX, -randSpeedY);

        emmiter.allowGravity = true;
        emmiter2.allowGravity = true;

        emmiter.setGravityY(1000);
        emmiter2.setGravityY(1000);
    }

    update() {
        this.handleCutting();
        this.handleFruitsAndBombs();
        this.gameOver();
        this.makeSlashes()

        if (this.chrono !== this.previousChrono) {
            this.previousChrono = this.chrono;
            this.timeText.text = convertMinutesSeconds(this.chrono);
        }
    }

    handleCutting() {
        if (this.isCutting) {
            for (let i = 1; i < this.pointsInput.length; i++) {
                if (this.pointsInput[i] && this.pointsInput[i].x !== undefined) {
                    this.line = new Phaser.Geom.Line(this.pointsInput[i].x, this.pointsInput[i].y, this.pointsInput[i - 1].x, this.pointsInput[i - 1].y);
                    this.fruits.getChildren().forEach(fruit => this.checkIntersects(fruit, null, this));
                    this.bombs.getChildren().forEach(bomb => this.checkIntersects(bomb, null, this));
                }
            }
        }
    }

    handleFruitsAndBombs() {
        this.fruits.getChildren().forEach(function (fruit) {
            if (fruit.body.y > this.game.config.height) {
                this.loseLife()
                this.lifesLosts++;
                fruit.destroy();
            }
        }, this);

        this.bombs.getChildren().forEach(function (bomb) {
            if (bomb.body.y > this.game.config.height + this.game.config.height * 0.1) {
                bomb.destroy();
                this.emitterBombLine.stop(true);
                this.fireworkSound.pause();
            }
            if (bomb.body) {
                this.currentBomb = bomb;
            }
        }, this);

        this.emmiters.getChildren().forEach(function (emmiter) {
            if (emmiter.body.y > this.game.config.height + this.game.config.height * 0.1) {
                emmiter.destroy();
            }
        }, this);


        // if (this.currentBomb && this.currentBomb.body) {
        //     this.emitterBombLine.setPosition(
        //         this.currentBomb.body.x + this.currentBomb.displayWidth / 25,
        //         this.currentBomb.body.y + this.currentBomb.displayHeight / 1.4
        //     );
        //
        //     this.emitterBombLine.setAngle(this.currentBomb.angle);
        //
        //     this.emitterBombLine.emitParticle(1);
        // }
    }


    makeSlashes() {
        if (!this.isCutting) {
            return
        }
        this.pointsInput.push({
            x: this.input.x,
            y: this.input.y
        });
        this.pointsInput = this.pointsInput.splice(this.pointsInput.length - 20, this.pointsInput.length);
        if (this.pointsInput.length < 1 || this.pointsInput[0].x === 0) {
            return;
        }

        this.slashes.clear();
        // this.slashes.fillStyle(0xfff, .5);
        this.slashes.fillStyle(0xFFFFFF, 0.5);
        this.slashes.beginPath();
        this.slashes.moveTo(this.pointsInput[0].x, this.pointsInput[0].y);

        for (let i = 1; i < this.pointsInput.length; i++) {
            this.slashes.lineTo(this.pointsInput[i].x, this.pointsInput[i].y);
        }

        this.slashes.closePath();
        this.slashes.fillPath();
    }

    clearSlash() {
        this.pointsInput = [];
        this.slashes.clear();
        this.slashes = this.add.graphics();
    }

    /**
     * Go to end scene and reset game value if condition are required
     */
    gameOver(isBomb = false) {
        if ((this.lifes <= this.lifesLosts) || isBomb) {
            let score = this.score;
            let chrono = this.chrono;
            this.resetValues();
            let time = isBomb ? 1000 : 0;

            this.fireworkSound.pause();
            setTimeout(() => {
                this.setScore(score, chrono)
                this.chrono = 0;
                this.score = 0;
                this.endSound.play();
                this.emitterGruszka.destroy()
                this.emitterRose.destroy()
                this.emitterBombLine.destroy()
                this.emitterBomb.destroy()
            }, time);


        }
    }

    setScore(score, chrono) {

        let that = this;
        let url = apiUrl + 'score/' + window.user_id + '/' + score + '/' + chrono;

        fetch(url)
            .then(value => {
                that.goToEndScene(score, chrono);
            })
            .catch(error => {
                console.error('Błąd podczas wywoływania API:', error);
            });
    }

    goToEndScene(score, chrono) {
        this.scene.start('EndScene', {score: score, time: chrono, endGame: true});
    }


    loseLife() {
        this.resetAfterLoseLife()
        let life = this.lifesGroup.children.entries[this.lifes - this.lifesLosts - 1];

        if (life) {
            console.log('wchodzi')
            life.setAlpha(0.5);
            this.endSound.play();
        }
    }

    resetAfterLoseLife() {
        // const fx = this.cameras.main.postFX.addBlur();
        // this.tweens.add({
        //     targets: fx,
        //     strength: 2,
        //     repeat: 1,
        //     duration: 500,
        //
        // });
        // this.fruits.clear(true, true);
        //
        // // Usunięcie wszystkich bomb
        // this.bombs.clear(true, true);
        //
        //
        // this.resetValues(false);
    }


    resetCutStreak() {
        this.fruitsCutThisMove = 0;
    }

    updateSlashDirection() {
        if (this.pointsInput.length >= 2) {
            const lastPoint = this.pointsInput[this.pointsInput.length - 2];
            const deltaX = Math.abs(this.x - lastPoint.x);
            const deltaY = Math.abs(this.y - lastPoint.y);
            let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI); // Oblicza kąt w stopniach

            // Normalizacja kąta do zakresu [0, 360)
            if (angle < 0) {
                angle += 360;
            }

            this.positionAngle = angle;

            if (deltaX > deltaY) {
                this.position = HORIZONTAL_POSITION
            } else {
                this.position = VERTICAL_POSITION
            }
        }
    }
}
