import React, { useEffect } from 'react';
import Phaser from 'phaser';

const gameContainerStyle = {
  width: '800px',
  height: '600px',
  margin: '0 auto',
  border: '2px solid #000',
  backgroundColor: '#87CEEB', // Sky blue background
};

const Game = ({ onGameOver, onScoreUpdate }) => {
  useEffect(() => {
    let game;

    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: 'game-container',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 300 },
          debug: true // Set debug to true for better visibility
        }
      },
      scene: {
        preload: preload,
        create: create,
        update: update
      }
    };

    game = new Phaser.Game(config);

    function preload() {
      this.load.image('background', 'assets/background.png'); // Ensure the path is correct
      this.load.image('bidoof', 'assets/bidoof.png'); // Updated to a single image
      this.load.image('oranBerry', 'assets/oranBerry.png'); // Ensure the path is correct
    }

    function create() {
      // Create a repeating background
      this.background = this.add.tileSprite(400, 300, 800, 600, 'background');

      // Create invisible ground using graphics
      const groundGraphics = this.add.graphics();
      groundGraphics.fillStyle(0x000000, 0); // Set fill color to transparent
      groundGraphics.fillRect(0, 568, 800, 32); // Create a rectangle

      this.ground = this.physics.add.staticGroup();
      this.ground.create(400, 584, 'ground').setScale(2).refreshBody();

      // Player (Bidoof)
      this.player = this.physics.add.sprite(100, 450, 'bidoof');
      this.player.setBounce(0.2);
      this.player.setCollideWorldBounds(true);
      this.physics.add.collider(this.player, this.ground);

      // Log to verify Bidoof sprite creation
      console.log('Bidoof created:', this.player);

      // Collectibles (Oran Berries)
      this.oranBerries = this.physics.add.group({
        key: 'oranBerry',
        repeat: 0,
        setXY: { x: 800, y: 0, stepX: 70 }
      });

      this.physics.add.collider(this.oranBerries, this.ground);
      this.physics.add.overlap(this.player, this.oranBerries, collectOranBerry, null, this);

      // Player controls
      this.cursors = this.input.keyboard.createCursorKeys();

      // Add a new Oran Berry every 2 seconds
      this.time.addEvent({
        delay: 2000,
        callback: addOranBerry,
        callbackScope: this,
        loop: true
      });

      // Ensure camera is following the player
      this.cameras.main.startFollow(this.player);
      this.cameras.main.setZoom(1); // Adjust zoom level if needed
    }

    function update() {
      // Scroll background
      this.background.tilePositionX += 2;

      // Reset player's horizontal velocity
      this.player.setVelocityX(0);

      // Player controls
      if (this.cursors.left.isDown) {
        this.player.setVelocityX(-160);
      } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(160);
      }

      if (this.cursors.up.isDown && this.player.body.touching.down) {
        this.player.setVelocityY(-330);
      }

      // Check for game over condition
      if (this.player.y > this.sys.game.config.height) {
        onGameOver();
        this.scene.restart();
      }
    }

    function collectOranBerry(player, oranBerry) {
      oranBerry.disableBody(true, true);
      onScoreUpdate(prev => prev + 10);
    }

    function addOranBerry() {
      const x = Phaser.Math.Between(800, 1600);
      const y = Phaser.Math.Between(0, 500);
      const oranBerry = this.oranBerries.create(x, y, 'oranBerry');
      oranBerry.setBounce(0.5);
    }

    return () => {
      if (game) {
        game.destroy(true);
        game = null;
      }
    };
  }, [onGameOver, onScoreUpdate]);

  return <div id="game-container" style={gameContainerStyle}></div>;
};

export default Game;
