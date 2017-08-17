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


function checkRoom(gameCode){
	var roomRef = firebase.database().ref("rooms/" + gameCode);
	var checker;
	roomRef.on('value', function(snapshot) {
	   if (snapshot.exists())
	      checker = true;
	   else
	      checker = false;
	});

	return checker;
}

function startMobile(){
	var name = document.getElementById('name').value;
	var gameCode = document.getElementById('gameCode').value;
	var gameRef = firebase.database().ref("rooms/" + gameCode);

	if(checkRoom(gameCode)){
		gameRef.once("value").then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
            var key = childSnapshot.key; //player1, player2, player3, player4
            var childData = snapshot.child(key).child("name").val(); //name

            	if(!childData){
            		gameRef.child(key).update({name: name, ready: "0", status: "0"});
					window.location = "lobby.html";
					return true;
				}
            });
		});
	}
}
	

window.onload = function() {

};
	
