class Game {
    constructor() {
        this.resetTitle = createElement("h2");
        this.resetButton = createButton("");

        this.leaderboardTitle = createElement("h2");
        this.runner1 = createElement("h2");
        this.runner2 = createElement("h2");
        this.runner3 = createElement("h2");
        this.runner4 = createElement("h2");

        this.runnerMoving = false;
        this.leftKeyActive = false;
        this.fall = false;
    }
    
    getState(){
        var gameStateRef = database.ref('gameState');
        gameStateRef.on("value", function(data){
            gameState = data.val();
        });
    }
    
    update(state){
        database.ref("/").update({
            gameState: state
        });
    }

    start() {
        player = new Player();
        playerCount = player.getCount();

        form = new Form();
        form.displayer();

        runner1 = createSprite(width/2 - 100, height - 100);
        runner1.addAnimation("running", runner1Img);
        
        runner2 = createSprite(width/2 - 50, height - 100);
        runner2.addAnimation("running", runner2Img);

        runner3 = createSprite(width/2 + 50, height - 100);
        runner3.addAnimation("running", runner3Img);

        runner4 = createSprite(width/2 + 100, height - 100);
        runner4.addAnimation("running", runner4Img);

        runners = [runner1, runner2, runner3, runner4];

        //call water and obstacle group
        //call obstacles positions
        // Adding water sprite in the game
         //Adding obstacles sprite in the game


    }


    addSprites(spriteGroup, numberOfSprites, spriteImage, scale, positions = []) {
        for (var i = 0; i < numberOfSprites; i++) {
          var x, y;
    
          //C41 //SA
          if (positions.length > 0) {
            x = positions[i].x;
            y = positions[i].y;
            spriteImage = positions[i].image;
          } else {
            x = random(width / 2 + 150, width / 2 - 150);
            y = random(-height * 4.5, height - 400);
          }
          var sprite = createSprite(x, y);
          sprite.addImage("sprite", spriteImage);
    
          sprite.scale = scale;
          spriteGroup.add(sprite);
        }
    }
        
    handleElements() {
        form.hide();
        form.titleImg.position(40, 50);
        form.titleImg.class("gameTitleAfterEffect");

        this.resetTitle.html("Reset Game");
        this.resetTitle.class("resetText");
        this.resetTitle.position(width / 2 + 200, 40);
    
        this.resetButton.class("resetButton");
        this.resetButton.position(width / 2 + 230, 100);
    
        this.leadeboardTitle.html("Leaderboard");
        this.leadeboardTitle.class("resetText");
        this.leadeboardTitle.position(width / 3 - 60, 40);
    
        this.runner1.class("leadersText");
        this.runner1.position(width / 3 - 50, 80);
    
        this.runner2.class("leadersText");
        this.runner2.position(width / 3 - 50, 130);

        this.runner3.class("leadersText");
        this.runner3.position(width / 3 - 50, 180);
    
        this.runner4.class("leadersText");
        this.runner4.position(width / 3 - 50, 230);
      }

      handleObstacleCollision(index){
        if(runners[index-1].collide(obstacles)){
    
          if(this.leftKeyActive){
            player.positionX +=100;
          } else{
            player.positionY -=100;
          }
    
          if(player.life> 0){
            player.life -= 185/4;
          }
    
          player.update();
        }
      }

      /*handleCarACollisionwithCarB(index){
        if(index===1){
          if(runners[index-1].collide(runners[1])){
            if(this.leftKeyActive){
              player.positionX +=100;
            } else{
              player.positionY -=100;
            }
    
            if(player.life>0){
              player.life -= 185/4;
            }
    
            player.update();
          }
        }
        if(index===2){
            if(runners[index-1].collide(runners[0])){
              if(this.leftKeyActive){
                player.positionX +=100;
              } else{
                player.positionY -=100;
              }
      
              if(player.life>0){
                player.life -= 185/4;
              }
      
              player.update();
      
            }
          }
        }*/

        play() {
            this.handleElements();
            this.handleResetButton();
        
            Player.getPlayersInfo();
            player.getAtEnd();
        
            if (allPlayers !== undefined) {
              image(track, 0, -height * 5, width, height * 6);
        
              this.showWaterBar();
              this.showLife();
              this.showLeaderboard();
        
              //index of the array
              var index = 0;
              for (var plr in allPlayers) {
                //add 1 to the index for every loop
                index = index + 1;
        
                //use data form the database to display the cars in x and y direction
                var x = allPlayers[plr].positionX;
                var y = height - allPlayers[plr].positionY;
                
                var currentLife = allPlayers[plr].life;
        
                if(currentLife <=0){
                  runners[index-1].changeImage("blast");
                  runners[index-1].scale = 0.03;
                }
        
                runners[index - 1].position.x = x;
                runners[index - 1].position.y = y;
        
                if (index === player.index) {
                  stroke(10);
                  fill("red");
                  ellipse(x, y, 60, 60);
        
                  this.handleFuel(index);
                  this.handlePowerCoins(index);
                  this.handleObstacleCollision(index);
                  
                  /*this.handleCarACollisionwithCarB(index);
                  if(player.life<0){
                    this.blast = true;
                    this.playerMoving = false;
                  }*/
                  
                  // Changing camera position in y direction
                  camera.position.y = cars[index - 1].position.y;
                }
              }
        
              if (this.playerMoving) {
                player.positionY += 5;
                player.update();
              }
        
              // handling keyboard events
              this.handlePlayerControls();
        
              // Finshing Line
              const finshLine = height * 6 - 100;
        
              if (player.positionY > finshLine) {
                gameState = 2;
                player.rank += 1;
                Player.updatePlayersAtEnd(player.rank);
                player.update();
                this.showRank();
              }
        
              drawSprites();
            }
          }

          handleResetButton() {
            this.resetButton.mousePressed(() => {
              database.ref("/").set({
                playerCount: 0,
                gameState: 0,
                players: {},
                playersAtEnd: 0
              });
              window.location.reload();
            });
          }

          showLife() {
            push();
            //image(lifeImage, width / 2 - 130, height - player.positionY - 400, 20, 20);
            fill("white");
            rect(width / 2 - 100, height - player.positionY - 400, 185, 20);
            fill("#f50057");
            rect(width / 2 - 100, height - player.positionY - 400, player.life, 20);
            noStroke();
            pop();
          }

          showWaterBar() {
            push();
            //image(fuelImage, width / 2 - 130, height - player.positionY - 350, 20, 20);
            fill("white");
            rect(width / 2 - 100, height - player.positionY - 350, 185, 20);
            fill("#ffc400");
            rect(width / 2 - 100, height - player.positionY - 350, player.fuel, 20);
            noStroke();
            pop();
          }
        }