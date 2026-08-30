Parse.initialize("i3tzTVEHYEb1EjCo1cyNzHQNz3Ft0oyHX0gjmzD2",
		             "zkfZmh3TNVCZlBK2hRL3SOva8iBn4ezEUP8JSVg4");
Parse.serverURL = "https://parseapi.back4app.com/";

// Option 1: Create a new user
const user = new Parse.User();
user.set("username", "mib");
user.set("password", "DNRC7867");
user.set("email", "b4a@mib.8shield.net");

user.signUp().then(() => {
  // Now save GameScore
  const gameScore = new Parse.Object("GameScore");
  gameScore.set("score", 1945);
  gameScore.set("playerName", "Donald Poutine");
  gameScore.set("cheatMode", false);
  return gameScore.save();
}).then((result) => {
  console.log('Created object:', result.id);
}).catch(error => console.error('Error:', error.message));