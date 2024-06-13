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
    }

    function create() {
      // Create a repeating background
      this.background = this.add.tileSprite(400, 300, 800, 600, 'background');

      // Create invisible ground using graphics
      const groundGraphics = this.add.graphics();
      groundGraphics.fillStyle(0x000000, 0); // Set fill color to transparent
      groundGraphics.fillRect(0, 568, 800, 32); // Create a rectangle

      const groundTexture = groundGraphics.generateTexture('ground');
      groundGraphics.destroy();

      const ground = this.physics.add.staticImage(400, 584, 'ground');
      ground.displayWidth = 800; // Ensure the ground covers the width
      ground.refreshBody();

      // Player (Bidoof)
      this.player = this.physics.add.sprite(100, 450, 'bidoof');
      this.player.setCollideWorldBounds(true);
      this.physics.add.collider(this.player, ground);

      // Log to verify Bidoof sprite creation
      console.log('Bidoof created:', this.player);

      // Obstacles
      this.obstacles = this.physics.add.group();
      this.physics.add.collider(this.obstacles, ground);
      this.physics.add.collider(this.player, this.obstacles, hitObstacle, null, this);

      // Player controls
      this.cursors = this.input.keyboard.createCursorKeys();

      // Log to verify keyboard input creation
      console.log('Cursors created:', this.cursors);

      // Add a new obstacle every 2 seconds
      this.time.addEvent({
        delay: 2000,
        callback: addObstacle,
        callbackScope: this,
        loop: true
      });

      // Ensure camera is following the player
      this.cameras.main.startFollow(this.player);
      this.cameras.main.setZoom(1); // Adjust zoom level if needed
    }

    function update() {
      // Scroll background
      this.background.tilePositionX += 5;

      // Constantly move the player to the right
      this.player.setVelocityX(160);

      // Log the state of the player and inputs
      console.log('Player Y:', this.player.y);
      console.log('Up key is down:', this.cursors.up.isDown);
      console.log('Player is touching the ground:', this.player.body.touching.down);

      // Player controls
      if (this.cursors.up.isDown && this.player.body.touching.down) {
        console.log('Jump!');
        this.player.setVelocityY(-330);
      }

      // Check for game over condition
      if (this.player.y > this.sys.game.config.height) {
        onGameOver();
        this.scene.restart();
      }
    }

    function hitObstacle(player, obstacle) {
      onGameOver();
      this.scene.restart();
    }

    function addObstacle() {
      const x = Phaser.Math.Between(800, 1600);
      const obstacle = this.add.graphics();
      obstacle.fillStyle(0xff0000, 1); // Red color for the obstacle
      obstacle.fillRect(0, 0, 50, 50); // 50x50 pixel obstacle
      const obstacleTexture = obstacle.generateTexture('obstacleTexture');
      const obstacleSprite = this.obstacles.create(x, 550, 'obstacleTexture');
      obstacleSprite.setVelocityX(-200);
      obstacleSprite.setImmovable(true);
      obstacle.destroy(); // Destroy the temporary graphics object
    }

    // Ensure the game canvas is focused
    const handleFocus = () => {
      game.canvas.tabIndex = 1;
      game.canvas.focus();
    };

    // Add focus event listener
    window.addEventListener('click', handleFocus);

    return () => {
      if (game) {
        game.destroy(true);
        game = null;
      }
      // Remove focus event listener
      window.removeEventListener('click', handleFocus);
    };
  }, [onGameOver, onScoreUpdate]);

  return <div id="game-container" style={gameContainerStyle}></div>;
};

export default Game;
