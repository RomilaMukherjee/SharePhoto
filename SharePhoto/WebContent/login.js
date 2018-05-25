/**
 *API to fetch login details from gmail authentication
 */

var useremail;

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); 
  useremail= profile.getEmail();// This is null if the 'email' scope is not present.

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
			TableName : "user",
			Item : {
				"userId" : profile.getEmail(),
				"userName" : profile.getName(),
				"loginTimeStamp" : currentDate,
				"visitCount" : 1,
				"followers" : [ {
					"userName" : "abc1",
					"userId" : "abc1@gmail.com"
				}, {
					"userName" : "abc2",
					"userId" : "abc2@gmail.com"
				}, {
					"userName" : "abc3",
					"userId" : "abc3@gmail.com"
				}, {
					"userName" : "abc4",
					"userId" : "abc4@gmail.com"
				} ],
				"following" : [ {
					"userName" : "abc5",
					"userId" : "abc5@gmail.com"
				}, {
					"userName" : "abc6",
					"userId" : "abc6@gmail.com"
				}, {
					"userName" : "abc7",
					"userId" : "abc7@gmail.com"
				}, {
					"userName" : "abc8",
					"userId" : "abc8@gmail.com"
				} ]

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


/**
 * Update image on display while uploading
 */

function readURL(input) {
	  if (input.files && input.files[0]) {
	    var reader = new FileReader();

	    reader.onload = function(e) {
	      $('#profile-img-tag').attr('src', e.target.result);
	    }

	    reader.readAsDataURL(input.files[0]);
	  }
	}

/**
 * API to upload Pic to S3
 */

function uploadPic(){
	AWS.config.region = 'ap-southeast-1'; // 1. Enter your region

    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: 'ap-southeast-1:f3f71977-40d1-4531-93c1-91b813b1d8a4' // 2. Enter your identity pool
    });

    AWS.config.credentials.get(function(err) {
      if (err) alert(err);
      console.log(AWS.config.credentials);
    });

  var bucketName = 'snap-nus'; // Enter your bucket name
  var bucket = new AWS.S3({
      params: {
          Bucket: bucketName
      }
  });

  var fileChooser = document.getElementById('file-chooser');
  var button = document.getElementById('upload-button');
  var results = document.getElementById('results');
  button.addEventListener('click', function() {

      var file = fileChooser.files[0];

      if (file) {

          results.innerHTML = '';
          var objKey = useremail + '/' + file.name;
          var params = {
              Key: objKey,
              ContentType: file.type,
              Body: file,
              ACL: 'public-read'
          };

          bucket.putObject(params, function(err, data) {
              if (err) {
                  results.innerHTML = 'ERROR: ' + err;
              } else {
                  listObjs();
              }
          });
      } else {
          results.innerHTML = 'Nothing to upload.';
      }
  }, false);
  $('#modaldialog').hide();	
}

  function listObjs() {
      var prefix = useremail;
      bucket.listObjects({
          Prefix: prefix
      }, function(err, data) {
          if (err) {
              results.innerHTML = 'ERROR: ' + err;
          } else {
              var objKeys = "";
              data.Contents.forEach(function(obj) {
                  objKeys += obj.Key + "<br>";
              });
              results.innerHTML = objKeys;
          }
      });
  }