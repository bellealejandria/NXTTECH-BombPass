/*// Initialize Firebase
var config = {
    apiKey: "AIzaSyDggdwXC75QRKKZClRa7K2kQKrpXOhZuoQ",
    authDomain: "awesomesiocoholics-40485.firebaseapp.com",
    databaseURL: "https://awesomesiocoholics-40485.firebaseio.com",
    projectId: "awesomesiocoholics-40485",
    storageBucket: "awesomesiocoholics-40485.appspot.com",
    messagingSenderId: "73321800985"
};
firebase.initializeApp(config);*/

//global var
var playerCount = 0;
var playerName = [];
var playerAlive = [];
var playerDead = [];

//functions
function muteAudio() {
	var audioElm = document.getElementById('audio'); audioElm.muted = !audioElm.muted;
}


//Inital State
function setStart(){

  //Remove all icons at the start
  for(ctr = 0; ctr < 4; ctr++){
    $("#player" + (ctr + 1)).hide();
  }
  $("#ready").html("Ready!");

}

//Setup the players needed in the game
function addPlayers(){

  var ctr;
  var database = firebase.database();
  var roomRef = firebase.database().ref("rooms");
  var gameCode = localStorage.getItem("gameCode");

  //Counts all the players in the database and logs their name
  roomRef.once("value", function(snapshot){
    var players = snapshot.child(gameCode).val();

    Object.keys(players).forEach(function(key) {
      if(snapshot.child(gameCode).child(key).child("name").val() != ""){
        console.log(snapshot.child(gameCode).child(key).child("name").val());

        playerName[playerCount] = snapshot.child(gameCode).child(key).child("name").val();
        playerCount++;
      }
    })

    //Removes the player icons not used
    for(ctr = 0; ctr < playerCount; ctr++){
      playerAlive.push("player" + (ctr + 1));
      $("#player" + (ctr + 1)).show();
    }

    //Changes player names
    for(ctr = 0; ctr < playerCount; ctr++){
      $("#playername-" + (ctr + 1)).html(playerName[ctr]);
    }

    //Removes unecessary buttons from players
    var playerBtnCount = playerCount - 1
    for(ctr = 3; ctr > playerBtnCount; ctr--){
      $("#playerbtn" + ctr).hide();
    }

    startGame();
  });

}

function bombExplode(){
  var ctr;

  if($("div").hasClass("it")){
    var tempo = $(".it").attr("id");
    playerDead.push(tempo);

    for(ctr = 0; ctr < playerAlive.length; ctr++){
      if(playerAlive[ctr] == tempo){
        playerAlive.splice(ctr, 1);  
      }
    }

    $(".it").removeClass("it"); 
    $("#" + tempo).hide();
  }
  playerCount--;

}

function bombCounter(){

  var bombTime = Math.floor((Math.random() * 5) + 5);
  var timer = setInterval(function(){
    console.log(bombTime);
    if(bombTime > 0){
      bombTime--;
      console.log(bombTime);
    } else {
      if(playerAlive.length != 1){
        bombExplode();
        randomizeBomb();
        bombCounter(); 
      }
      clearInterval(timer);
    }
  }, 1000)

}

function randomizeBomb(){
  var it;
  var ctr;
  var flag = true;
  var deadCount = playerDead.length;

  console.log(deadCount);

  if(deadCount == 0){
    it = Math.floor((Math.random() * playerCount) + 1);
    $("#player" + it).addClass("active it");
    $("#bmbplayer" + it).html('<img class="img-responsive col-lg-8 col-lg-offset-2" src="assets/img/bomb.png"/>'); 
  } else {
    if(playerAlive.length != 1){
      it = Math.floor((Math.random() * playerAlive.length));

      $("#" + playerAlive[it]).addClass("active it");
      $("#bmb" + playerAlive[it]).html('<img class="img-responsive col-lg-8 col-lg-offset-2" src="assets/img/bomb.png"/>');  
    }     
  }

}

function startGame(){
  $("#ready").html("Last Man Standing!");

  randomizeBomb();
  bombCounter();

}

window.onload = function() {
  var ctr;
	var roomRef = firebase.database().ref("rooms");

  setStart();
  addPlayers();

  console.log(localStorage.getItem("gameCode"));
  console.log(localStorage.getItem("playerName"));

  var changeName = localStorage.getItem("playerName");
  document.getElementById("playerName").innerHTML = changeName;

};
	