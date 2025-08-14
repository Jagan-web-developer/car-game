 // Game variables
        let score = 0;
        let gameSpeed = 2;
        let gameRunning = true;
        let obstacles = [];
        let keysPressed = {};
        
        // DOM elements
        const playerCar = document.getElementById('player-car');
        const gameContainer = document.getElementById('game-container');
        const scoreDisplay = document.getElementById('score');
        const gameOverDisplay = document.getElementById('game-over');
        const finalScoreDisplay = document.getElementById('final-score');
        const restartBtn = document.getElementById('restart-btn');
        
        // Player car position
        let playerX = 130;
        const playerY = 410;
        
        // Event listeners
        document.addEventListener('keydown', (e) => {
            keysPressed[e.key] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            keysPressed[e.key] = false;
        });
        
        restartBtn.addEventListener('click', restartGame);
        
        // Game loop
        function gameLoop() {
            if (gameRunning) {
                movePlayer();
                updateObstacles();
                spawnObstacle();
                checkCollisions();
                updateScore();
                requestAnimationFrame(gameLoop);
            }
        }
        
        // Move player car based on keyboard input
        function movePlayer() {
            if (keysPressed['ArrowLeft'] && playerX > 60) {
                playerX -= 5;
            }
            if (keysPressed['ArrowRight'] && playerX < 220) {
                playerX += 5;
            }
            playerCar.style.left = playerX + 'px';
        }
        
        // Create new obstacles
        function spawnObstacle() {
            if (Math.random() < 0.02) {
                const obstacle = document.createElement('div');
                obstacle.className = 'obstacle';
                const lane = Math.floor(Math.random() * 3);
                const obstacleX = 60 + lane * 70;
                obstacle.style.left = obstacleX + 'px';
                obstacle.style.top = '-70px';
                gameContainer.appendChild(obstacle);
                
                obstacles.push({
                    element: obstacle,
                    x: obstacleX,
                    y: -70,
                    speed: 2 + Math.random() * 2
                });
            }
        }
        
        // Update obstacle positions
        function updateObstacles() {
            for (let i = obstacles.length - 1; i >= 0; i--) {
                const obstacle = obstacles[i];
                obstacle.y += obstacle.speed;
                obstacle.element.style.top = obstacle.y + 'px';
                
                // Remove obstacles that are off screen
                if (obstacle.y > 500) {
                    gameContainer.removeChild(obstacle.element);
                    obstacles.splice(i, 1);
                    score++;
                }
            }
        }
        
        // Check for collisions
        function checkCollisions() {
            const playerRect = playerCar.getBoundingClientRect();
            
            for (const obstacle of obstacles) {
                const obstacleRect = obstacle.element.getBoundingClientRect();
                
                if (
                    playerRect.left < obstacleRect.right &&
                    playerRect.right > obstacleRect.left &&
                    playerRect.top < obstacleRect.bottom &&
                    playerRect.bottom > obstacleRect.top
                ) {
                    endGame();
                    break;
                }
            }
        }
        
        // Update score display
        function updateScore() {
            scoreDisplay.textContent = `Score: ${score}`;
            // Increase game speed as score increases
            gameSpeed = 2 + Math.floor(score / 10) * 0.5;
        }
        
        // End the game
        function endGame() {
            gameRunning = false;
            finalScoreDisplay.textContent = score;
            gameOverDisplay.style.display = 'block';
        }
        
        // Restart the game
        function restartGame() {
            // Clear obstacles
            for (const obstacle of obstacles) {
                gameContainer.removeChild(obstacle.element);
            }
            obstacles = [];
            
            // Reset player position
            playerX = 130;
            playerCar.style.left = playerX + 'px';
            
            // Reset score and speed
            score = 0;
            gameSpeed = 2;
            
            // Hide game over display
            gameOverDisplay.style.display = 'none';
            
            // Start game
            gameRunning = true;
            gameLoop();
        }
        
        // Start the game
        gameLoop();