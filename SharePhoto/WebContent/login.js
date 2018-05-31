/**
 *API to fetch login details from gmail authentication
 */

var useremail;

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); 
  useremail= profile.getEmail();// This is null if the 'email' scope is not present.

  //The ID token you need to pass to your backend:
  var id_token = googleUser.getAuthResponse().id_token;
  
  //Call API to persist the userInformation to DB
  saveUserProfileToDynamoDB(profile);
}


function getprofiledetails(){
	var profilevalue = localStorage.getItem('profile');
	var finalvalue = JSON.parse(profilevalue);
	  $("#profilePic").attr('src',finalvalue.Paa);
	  $("#pName").text(finalvalue.ig);
	  useremail= finalvalue.U3;
	  return finalvalue;
	  
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
function  saveUserProfileToDynamoDB(profile){
	
	AWS.config.update({
		  region: "ap-southeast-1",
	});
	  	
  	AWS.config.credentials = new AWS.CognitoIdentityCredentials({
		  IdentityPoolId: "ap-southeast-1:af3ff7b8-a334-4e0c-b2df-5dfdf4046147",
		  RoleArn: "arn:aws:iam::163612915076:role/Cognito_TeamShareUnauth_Role"
	});
  	
	
	/*AWS.config.region = 'us-east-1'; // 1. Enter your region
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: 'us-east-1:087ddfbd-715d-4afc-899b-8ac79d68eb91' // 2. Enter your identity pool

    });
*/  var dynamodb = new AWS.DynamoDB();
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
    	isExistingUser=false;
        if (err) {
            console.log("Error occurred");
        	isExistingUser =false;
        	
        	/**Insert user if not exist************/
        	isExistingUser =false;
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
							  location.replace("Home.html");
							  if(profile != undefined){
								  localStorage.setItem('profile', JSON.stringify(profile)); 
								  window.location.href =  "Home.html";
							  }else{
								  window.location.href =  "Home.html";
							  }
						  }
					});
		
			}
        } else {
            console.log("Update Successful");
            isExistingUser =true;
            location.replace("Home.html");
	      	  
            if(profile != undefined){
	      		  localStorage.setItem('profile', JSON.stringify(profile)); 
	      		  window.location.href =  "Home.html";
	      	}else{
	      		  window.location.href =  "Home.html";
	      	}
        }
    });
   return true;
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
	  }
	}

/**
 * API to upload Pic to S3
 */
function uploadPic(){
	   AWS.config.region = 'us-east-1'; // Region
	    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
	        IdentityPoolId: 'us-east-1:d640cf23-7fca-44bc-9af0-dd362df3b1c9',
	    });

 AWS.config.credentials.get(function(err) {
   if (err) alert(err);
   console.log(AWS.config.credentials);
 });

var bucketName = 'snapsnus2'; 
var bucket = new AWS.S3({
   params: {
       Bucket: bucketName
   }
});

var fileChooser = document.getElementById('file-chooser');
var button = document.getElementById('upload-button');
var file = fileChooser.files[0];

   if (file) {

       var objKey = useremail + '/' + file.name;
       console.log(objKey);
       var params = {
           Key: objKey,
           ContentType: file.type,
           Body: file,
           ACL: 'public-read'
       };

       bucket.putObject(params, function(err, data) {
           if (err) {
               console.log(err);
           } else {
               alert("Image uploaded successfully!");
               DetectLabels(bucketName,bucket,useremail + '/' + file.name);
           }
       });
   } else {
       alert('Nothing to upload.');
   }

   
           
$('#modaldialog').hide(); 

}

 
/**
 * API to invoke machine learning inbuilt API for 
 * detecting labels
 * @param bucketname
 * @param bucket
 * @param key
 * @returns
 */
  
  function DetectLabels(bucketname, bucket,key) {

	     var rekognition = new AWS.Rekognition();

	     var params = {
	         Image: {
	          S3Object: {
	           Bucket: bucketname,
	           Name: key
	          }
	         },

	         MaxLabels: 25,
	         MinConfidence: 70

	        };
	     rekognition.detectLabels(params, function (err, data) {
	     if (err) console.log(err, err.stack); // an error occurred
	     else {
	       var tags = [];
	         for (var i = 0; i < data.Labels.length; i++) {    
	           tags[i] = {Key: "Attribute"+i,Value:data.Labels[i].Name}      
	         }
	         var params = {
	          Bucket: bucketname,
	          Key: key,
	           Tagging: {
	           TagSet:tags
	          }
	         };
	       
	         bucket.putObjectTagging(params, function(err, data) {

	               if (err) console.log(err, err.stack); // an error occurred
	               else     console.log(data);           // successful response
	               /*
	               data = {
	                VersionId: "null"
	               }
	               */
	             }); 
	         
	     }

	    });
	     


	}
  
  /**
   * API to Get Image List from S3
   */
  function getImage(profileid)
  {
	   AWS.config.region = 'us-east-1'; // Region

	    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
	        IdentityPoolId: 'us-east-1:d640cf23-7fca-44bc-9af0-dd362df3b1c9',
	    });

	    AWS.config.credentials.get(function(err) {
	      if (err) alert(err);
	      console.log(AWS.config.credentials);
	    });
	    
	    var bucketName = 'snapsnus2';
	  var s3Bucket = new AWS.S3({
	      params: {
	          Bucket: bucketName
	      }
	  });
	  
	  var params = {
        Bucket: bucketName, 
        Prefix :profileid
      };
	  
 s3Bucket.listObjects(params, function(err, data) {
   if (err) console.log(err, err.stack); // an error occurred
   else     console.log(data);  
  
   
    var curImage = document.getElementById('currentImg');
	var textDiv = document.getElementById('rightText');	
	
	    var bucketContents = data.Contents;
	      for (var i = 0; i < bucketContents.length; i++){
	        var urlParams = {Bucket: 'snapsnus2', Key: bucketContents[i].Key};
	        s3Bucket.getSignedUrl('getObject',urlParams, function(err, url){	        	
	            console.log('the url of the image is', url);
	            curImage.alt=urlParams.Key;
	            curImage.src=url;
				rightText.href=url;  
                rightText.append(curImage);
                $('#imageview').append(rightText);             
          	     });	       
	      }
	  });
  }
  
  function searchProfile(searchString){
	  
	  var cloudsearch = new AWS.CloudSearch();
	  cloudsearch.buildSuggesters(params, function (err, data) {
	    if (err) console.log(err, err.stack); // an error occurred
	    else     console.log(data);           // successful response
	  });
	  
	  
  }
