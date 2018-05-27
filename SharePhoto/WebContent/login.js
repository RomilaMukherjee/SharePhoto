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
  location.replace("Home.html");
  if(profile != undefined)
	  {
	  localStorage.setItem('profile', JSON.stringify(profile)); 
  window.location.href =  "Home.html";}
  else
	  {
	  window.location.href =  "Home.html";
  }
 
    
   //Call API to persist the userInformation to DB
  saveUserProfileToDynamoDB(profile);
  
	
}

function getprofiledetails(){
	var profilevalue = localStorage.getItem('profile');
	var finalvalue = JSON.parse(profilevalue);
	  $("#profilePic").attr('src',finalvalue.Paa);
	  $("#pName").text(finalvalue.ig);
	  useremail= finalvalue.U3;
	  
}

function myFunction() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";

        }
    }
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
	
	//Check whether user exist in database
	var isExistingUser=false;
	var table = "user";
    
	var paramsForUpdate = {
        TableName:table,
        Key:{
            "userId": profile.getEmail(),
            "userName":profile.getName()
        },
        UpdateExpression: "set visitCount = visitCount + :counter",
        ExpressionAttributeValues:{":counter":1},
        ReturnValues:"UPDATED_NEW"
    };
    docClient.update(paramsForUpdate, function(err, data) {
    	isExistingUser =true;
        if (err) {
            console.log("Error occurred");
        	isExistingUser =false;
        } else {
            console.log("Update Successful");
            isExistingUser =true;
        }
        
        if(!isExistingUser){
    		var paramsForCreate = {
    		        TableName :"user",
    		        Item:{
    		        	"userId":profile.getEmail(),
    		            "userName":profile.getName(),
    		            "loginTimeStamp":currentDate,
    		            "visitCount":1,
    		            "userProfile":profile.getImageUrl(),
    		            "followers" : [ {
    						"userName" : "Romila Mukherjee",
    						"userId" : "ms.romila@gmail. com"
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
    			docClient.put(paramsForCreate, function(err, data) {
    			      if (err) {
    			          console.log("Error occurred while saving user profile");
    			      } else {
    			    	  console.log("Add item successfully to user profile");
    			      }
    			});

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
	    alert(useremail);
	  }
	}

/**
 * API to upload Pic to S3
 */

function uploadPic(){
	AWS.config.region = 'us-east-1'; // 1. Enter your region

    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: 'us-east-1:6a0ee5aa-6f58-4e07-a313-473b446ab385' // 2. Enter your identity pool
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
  $('#page-top').style.display="block"; 

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