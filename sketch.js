function setup() {
  createCanvas(800,400);
  createSprite(400, 200, 50, 50);
  var runners, runner1, runner2, runner3, runner4, runners;
var runner1Img, runner2Img, runner3Img, runner4Img;
var canvas;
var database;
var game, player, form;
var track;


function preload (){
   runner1Img = loadAnimation("yellowrun1.png","yellowrun2.png", "yellowrun3.png");
   runner2Img = loadAnimation("bluerun1.png","bluerun2.png", "bluerun3.png");
   runner3Img = loadAnimation("greenrun1.png","greenrun2.png", "greenrun3.png");
   runner4Img = loadAnimation("purplerun1.png","purplerun2.png", "purplerun3.png");
   track = loadImage("track.png");

}






function setup(){
   canvas = createCanvas(windowWidth, windowHeight);
   database = firebase.database();
   game = new Game();
   game.getState();
   game.start();


}

function draw(){
   

   if(playerCount ===4){
      game.update(1);
   }

   if(gameState === 1) {
      game.play();
   }

}
  
}

function draw() {
  background(255,255,255);  
  drawSprites();
}