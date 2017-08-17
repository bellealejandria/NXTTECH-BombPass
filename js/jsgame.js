//FIREBASE
//STATUS 2 IF DEAD
//STATUS 1 IF HAWAK BOMB
//STATUS 0 WAITING

//READY 1 IF NAKAPASOK NA
//READ 0 IF DI PA

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

  //Counts all the players in the database and logs their name
  roomRef.once("value", function(snapshot){
    var players = snapshot.child("3967A").val();

    ////CHANGE CODE DUN GAWIN NA KUNG ANO UNG NA GENERATE NA GAME CODE(?) KANINA////

    Object.keys(players).forEach(function(key) {
      if(snapshot.child("3967A").child(key).child("name").val() != ""){
        console.log(snapshot.child("3967A").child(key).child("name").val());

        playerName[playerCount] = snapshot.child("3967A").child(key).child("name").val();
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

    //CAN REMOVE PERO WAG MUNA//
    //Removes unecessary buttons from players
    var playerBtnCount = playerCount - 1
    for(ctr = 3; ctr > playerBtnCount; ctr--){
      $("#playerbtn" + ctr).hide();
    }
    //////////////////////////

    ////////////INSERT CODE IF READY LAHAT THEN START GAME////////////////
    //NO IDEA PANO//

    startGame();
  });

}

function bombExplode(){
  var ctr;

  if($("div").hasClass("it")){
    var tempo = $(".it").attr("id");
    playerDead.push(tempo);

    //////////////INSERT CODE UPDATE STATUS OF THE PLAYER HOLDING THE BOMB TO '2'/DEAD////////////
    //SINCE NAKUKUHA NAME PWEDE COMPARE SA FIREBASE UNG VALUE NG NAME SA NAME NG MAY HAWAK NA BOMB THEN CHANGE STATUS TO '2' OR DEAD//

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

      //SET STATUS OF THE PLAYER TO 1 SINCE HAWAK UNG BOMB
      //SINCE NAKUKUHA NAME PWEDE COMPARE SA FIREBASE UNG VALUE NG NAME SA NAME NG MAY HAWAK NA BOMB THEN CHANGE STATUS TO '1' OR BASTA MAY HAWAK BOMB//

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

  console.log(name)

};

//FOR THIS WEB DESKTOP//
//ADD ON UPDATE CHECK MO LANG KUNG NAKANINO UNG BOMB GAMIT UNG STATUS LAGI TAPOS GAYAHIN UNG CODE SA RANDOMIZE BOMB PARA ALAM PANO MO LILIAPT DESIGN DUN SA MAY HAWAK NA BOMB TALAGA//


//FOR MOBILE//
//HIWALAY NA FILE NALANG AND DIFFERENT LINK//
//YUNG SA MOBILE MADALI NALANG BASTA MA-KUHA UNG CODE AND MAKUHA UNG NAME TAPOS MA IAYOS TO//
//ONCLICK MAG WORK LANG IF THIS NAME HAS A STATUS OF 1 OR HOLDING THE BOMB//
//SET THE NUMBER OF BUTTONS BASED ON THE NUMBER OF PLAYERS NA BUHAY PA//