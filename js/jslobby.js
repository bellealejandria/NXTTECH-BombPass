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

function createRoom(){
	var gameCode = document.getElementById('gameCode').innerHTML;

	var roomsRef = firebase.database().ref("rooms/" + gameCode);
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


window.onload = function() {
	
	document.getElementById("status").innerHTML = config.databaseURL;	
	document.getElementById("gameCode").innerHTML = generateGameCode();

	if(screen.width > 480)
		createRoom();
	
}