//FIREBASE
//STATUS 2 IF DEAD
//STATUS 1 IF HAWAK BOMB
//STATUS 0 WAITING

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDggdwXC75QRKKZClRa7K2kQKrpXOhZuoQ",
    authDomain: "awesomesiocoholics-40485.firebaseapp.com",
    databaseURL: "https://awesomesiocoholics-40485.firebaseio.com",
    projectId: "awesomesiocoholics-40485",
    storageBucket: "awesomesiocoholics-40485.appspot.com",
    messagingSenderId: "73321800985"
};
firebase.initializeApp(config);

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
  var gameCode = localStorage.getItem("gameCode");
  var gameRef = firebase.database().ref("rooms/" + gameCode);

  gameRef.once("value").then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var key = childSnapshot.key; //player1, player2, player3, player4
      var childData = snapshot.child(key).child("name").val(); //name

      if(childData){
        console.log(childData);
        playerName[playerCount] = childData;
        playerCount++;

      }
    });

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
 

    startGame();
  });


}

function bombExplode(){
  var ctr;
  var gameCode = localStorage.getItem("gameCode");

  if($("div").hasClass("it")){
    var tempo = $(".it").attr("id");
    playerDead.push(tempo);

    firebase.database().ref("rooms/" + gameCode).child(tempo).update({status : "2"})

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

  var bombTime = Math.floor((Math.random() * 15) + 10);
  var timer = setInterval(function(){
  var gameCode = localStorage.getItem("gameCode");

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
  var gameCode = localStorage.getItem("gameCode");

  console.log(deadCount);

  if(deadCount == 0){
    it = Math.floor((Math.random() * playerCount) + 1);

    console.log(gameCode);
  	console.log(it);

  	firebase.database().ref("rooms/" + gameCode).child("player" + it).update({status : "1"})

    $("#player" + it).addClass("active it");
    $("#bmbplayer" + it).addClass("active2");
    $("#bmbplayer" + it).html('<img class="img-responsive col-lg-8 col-lg-offset-2" src="assets/img/bomb.png"/>'); 



  } else {
    if(playerAlive.length != 1){
      it = Math.floor((Math.random() * playerAlive.length));

      console.log(gameCode);
      console.log(playerAlive[it]);

      firebase.database().ref("rooms/" + gameCode).child(playerAlive[it]).update({status : "1"})

      //SET STATUS OF THE PLAYER TO 1 SINCE HAWAK UNG BOMB
      //SINCE NAKUKUHA NAME PWEDE COMPARE SA FIREBASE UNG VALUE NG NAME SA NAME NG MAY HAWAK NA BOMB THEN CHANGE STATUS TO '1' OR BASTA MAY HAWAK BOMB//

      $("#" + playerAlive[it]).addClass("active it");
      $("#bmb" + playerAlive[it]).addClass("active2");
      $("#bmb" + playerAlive[it]).html('<img class="img-responsive col-lg-8 col-lg-offset-2" src="assets/img/bomb.png"/>');  
    }     
  }

}

function startGame(){
	var gameCode = localStorage.getItem("gameCode");

  $("#ready").html("Last Man Standing!");

	var player1 = firebase.database().ref("rooms/" + gameCode).child("player1");
			
	player1.on("value", function(snapshot) {
		var childData = snapshot.child("name").val(); 

			console.log("ENTER 1")
		if(childData){
			var status = snapshot.child("status").val();

			if(status == "1"){
				$(".active").removeClass("active");
				$(".it").removeClass("it");

				$("#player1").addClass('active it');
				$(".active2").html("");
				$(".active2").removeClass("active2")
				$("#bmbplayer1").addClass("active2");
				$("#bmbplayer1").html('<img class="img-responsive col-lg-8 col-lg-offset-2" src="assets/img/bomb.png"/>'); 
			}
		}
	});

	var player2 = firebase.database().ref("rooms/" + gameCode).child("player2");
			
	player2.on("value", function(snapshot) {
		var childData = snapshot.child("name").val(); 
		if(childData){
			var status = snapshot.child("status").val();

			if(status == "1"){
				$(".active").removeClass("active");
				$(".it").removeClass("it");

				$("#player2").addClass('active it');
				$(".active2").html("");
				$(".active2").removeClass("active2")
				$("#bmbplayer2").addClass("active2");
				$("#bmbplayer2").html('<img class="img-responsive col-lg-8 col-lg-offset-2" src="assets/img/bomb.png"/>'); 
			}
		}
	});

	var player3 = firebase.database().ref("rooms/" + gameCode).child("player3");
			
	player3.on("value", function(snapshot) {
		var childData = snapshot.child("name").val(); 
		if(childData){
			var status = snapshot.child("status").val();

			if(status == "1"){
				$(".active").removeClass("active");
				$(".it").removeClass("it");

				$("#player3").addClass('active it');
				$(".active2").html("");
				$(".active2").removeClass("active2")

				$("#bmbplayer3").addClass("active2");
				$("#bmbplayer3").html('<img class="img-responsive col-lg-8 col-lg-offset-2" src="assets/img/bomb.png"/>'); 
			}
		}
	});

	var player4 = firebase.database().ref("rooms/" + gameCode).child("player4");
			
	player4.on("value", function(snapshot) {
		var childData = snapshot.child("name").val(); 
		if(childData){
			var status = snapshot.child("status").val();

			if(status == "1"){
				$(".active").removeClass("active");
				$(".it").removeClass("it");

				$("#player4").addClass('active it');
				$(".active2").html("");
				$(".active2").removeClass("active2")

				$("#bmbplayer4").addClass("active2");
				$("#bmbplayer4").html('<img class="img-responsive col-lg-8 col-lg-offset-2" src="assets/img/bomb.png"/>'); 
			}
		}
	});



  randomizeBomb();
  bombCounter();

}

window.onload = function() {
  var ctr;
  var roomRef = firebase.database().ref("rooms");
  var gameCode = localStorage.getItem("gameCode");
  

  	if(screen.width > 480){	
	    setStart();
	    addPlayers();
	} else {
		var changeName = localStorage.getItem("playerName");
		document.getElementById("playerName").innerHTML = changeName;	
		var playerName2 = []
		var gameRef = firebase.database().ref("rooms/" + gameCode);

		  gameRef.once("value").then(function(snapshot) {
		    snapshot.forEach(function(childSnapshot) {
		      var key = childSnapshot.key; //player1, player2, player3, player4
		      var childData = snapshot.child(key).child("name").val(); //name

		      if(childData){
		        playerName2[playerCount] = childData;
		      }
		    });


		    for(ctr = 0; ctr < 4; ctr++){
		      if(changeName != playerName2[ctr])
		      	$("#btnPlayerName" + (ctr + 1)).html(playerName2[ctr]);
		    }

		    for(ctr = 0; ctr < 4; ctr++){
		      	var t = $("#btnPlayerName" + (ctr + 1)).html();

		      	if(t == "tempo"){
		      		$("#btnPlayerName" + (ctr + 1)).hide();
		      	}
		    }
		 

		    startGame();
		  });
	}


};

//FOR THIS WEB DESKTOP//
//ADD ON UPDATE CHECK MO LANG KUNG NAKANINO UNG BOMB GAMIT UNG STATUS LAGI TAPOS GAYAHIN UNG CODE SA RANDOMIZE BOMB PARA ALAM PANO MO LILIAPT DESIGN DUN SA MAY HAWAK NA BOMB TALAGA//


//FOR MOBILE//
//HIWALAY NA FILE NALANG AND DIFFERENT LINK//
//YUNG SA MOBILE MADALI NALANG BASTA MA-KUHA UNG CODE AND MAKUHA UNG NAME TAPOS MA IAYOS TO//
//ONCLICK MAG WORK LANG IF THIS NAME HAS A STATUS OF 1 OR HOLDING THE BOMB//
//SET THE NUMBER OF BUTTONS BASED ON THE NUMBER OF PLAYERS NA BUHAY PA//