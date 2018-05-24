/**
 *API to fetch login details from gmail authentication
 */

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

  //The ID token you need to pass to your backend:
  var id_token = googleUser.getAuthResponse().id_token;
  $(".g-signin2").css("display","none");
  $(".data").css("display","block");
  $("#profilePic").attr('src',profile.getImageUrl());
  $("#pName").text(profile.getName());
  
  
   //Call API to persist the userInformation to DB
  saveUserProfileToDynamoDB(profile);
	
}



/**
 * API to save user profile in database
 * @param profile
 * @returns
 */
function saveUserProfileToDynamoDB(profile){
	
	AWS.config.update({
		  region: "ap-southeast-1",
	});
	  	
  	AWS.config.credentials = new AWS.CognitoIdentityCredentials({
		  IdentityPoolId: "ap-southeast-1:af3ff7b8-a334-4e0c-b2df-5dfdf4046147",
		  RoleArn: "arn:aws:iam::163612915076:role/Cognito_TeamShareUnauth_Role"
	});
  	
  	var dynamodb = new AWS.DynamoDB();
  	var docClient = new AWS.DynamoDB.DocumentClient();
	var currentDate = new Date();
	console.log(currentDate);
	var params = {
        TableName :"user",
        Item:{
        	"userId":profile.getEmail(),
            "userName":profile.getName(),
            "loginTimeStamp":currentDate,
            "visitCount":1
         }
	};
	docClient.put(params, function(err, data) {
	      if (err) {
	          console.log("Error occurred while saving user profile");
	      } else {
	    	  console.log("Add item successfully to user profile");
	      }
	});
}


/**
 * API to sign out of google
 * @returns
 */
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
    	 $(".g-signin2").css("display","block");
    	  $(".data").css("display","none");
    	  $(".button_div").css("display","none");
    	  
     
    });
}
