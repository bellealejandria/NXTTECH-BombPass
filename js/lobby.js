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

//functions
function muteAudio() {
	var audioElm = document.getElementById('audio'); audioElm.muted = !audioElm.muted;
}

function generateGameCode() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

function createRoom(gameCode){
	var roomsRef = firebase.database().ref("rooms/" + gameCode);

	roomsRef.child("startGame").set("0");
	roomsRef.child("player1").child("name").set("");
	roomsRef.child("player1").child("status").set("0");
	roomsRef.child("player1").child("ready").set("0");

	roomsRef.child("player2").child("name").set("");
	roomsRef.child("player2").child("status").set("0");
	roomsRef.child("player2").child("ready").set("0");

	roomsRef.child("player3").child("name").set("");
	roomsRef.child("player3").child("status").set("0");
	roomsRef.child("player3").child("ready").set("0");

	roomsRef.child("player4").child("name").set("");
	roomsRef.child("player4").child("status").set("0");
	roomsRef.child("player4").child("ready").set("0");
}

function updateReady(){
	localGameCode = localStorage.getItem("gameCode");
	playerName = localStorage.getItem("playerName");
	var gameRef = firebase.database().ref("rooms/" + localGameCode);

	gameRef.once("value").then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
        var key = childSnapshot.key; //player1, player2, player3, player4
        var childData = snapshot.child(key).child("name").val(); //player-name

        	if(childData === playerName){
        		gameRef.child(key).update({ready: "1"});

				$("#readyBtn").hide();
				$("#waitInfo").show();

				return true;
			}
        });
	});
}

window.onload = function() {

	if(screen.width > 480){		
		var gameCode = generateGameCode();
		document.getElementById("gameCode").innerHTML = gameCode;
		createRoom(gameCode);
	}
	else{
		localGameCode = localStorage.getItem("gameCode");
		playerName = localStorage.getItem("playerName");
		var roomRef = firebase.database().ref("rooms/" + localGameCode);
		var gameRef = roomRef.child("startGame");

		gameRef.on('value', function (snap) {
        	if(snap.val() === "1"){
        		window.location = "game.html";
        	}
    	});
		
	}
	
	
}