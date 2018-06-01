/**
 *API to fetch login details from gmail authentication
 */

var useremail,username;
var following = [];
var preferences_list = [];
var recommendation_list =[];

//Initialize the Amazon Cognito credentials provider
AWS.config.region = 'us-east-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:d640cf23-7fca-44bc-9af0-dd362df3b1c9',
});

var dynamodb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();
var table = "user";

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
	  username=finalvalue.ig;
	  populatePreferences();
	  return finalvalue;
}


/**
 * API to save user profile in database
 * @param profile
 * @returns
 */
function  saveUserProfileToDynamoDB(profile){
	
	
	/*AWS.config.region = 'us-east-1'; // 1. Enter your region
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: 'us-east-1:087ddfbd-715d-4afc-899b-8ac79d68eb91' // 2. Enter your identity pool

    });
	 */  
	var currentDate = new Date();
	
	//Check whether user exist in database
	var isExistingUser=false;
    
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
        	
			if(!isExistingUser){
		
				var paramsForCreate = {
						TableName :"user",
						Item:{
							"userId":profile.getEmail(),
							"userName":profile.getName(),
							"loginTimeStamp":currentDate,
							"visitCount":1,
							"preferences":"abc",
							"userProfile":profile.getImageUrl()
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
			//TODO remove this
			
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
           }
       });
   } else {
       alert('Nothing to upload.');
   }

   
           
$('#modaldialog').hide(); 

}

 

	function populateFollowingList()
	{		
		
		var params = {
			TableName : "user",
			Key : {
				"userId" : useremail,
				"userName" : username

			},
			ProjectionExpression : "following"
	
		};
		docClient
				.get(
						params,
						function(err, data) {
							if (err) {
								console.log(err,err.stack);
							} else {
	
								for (var i = 0; i < data.Item.following.length; i++) 
								{
									following[i]=data.Item.following[i].userId;
									console.log(i+" "+following[i]);

								}
								ListReco(following,preferences_list);
							}
						});

	}

	//var preferences_list = [];

	function populatePreferences()
	{
		var params = {
    	TableName : "user",
    	Key : {
			"userId" : useremail,
			"userName" : username

    		},
    	ProjectionExpression : "preferences"

  			};
		docClient
			.get(
				params,
				function(err, data) {
					if (err) {
					console.log(err);
					} else {
					for(var i =0;i<data.Item.preferences.length;i++)
					{
						preferences_list[data.Item.preferences[i].Value] = true;
					}
					populateFollowingList();
					}
				});


	}

	function recommendations(bucketname, bucket,key,preferences_map)
	{
		var params = {
			Bucket: bucketname,
			Key: key
		};
		bucket.getObjectTagging(params, function(err,data)
		{	
			
			if (err) console.log(err, err.stack); // an error occurred
				   else{// successful response
						var match =0;
					   for(var i =0;i<data.TagSet.length;i++)
					   {	console.log(data.TagSet[i].Value);
							if(preferences_map[data.TagSet[i].Value] == true)
								match++;
					   }
					   //Change this to minimum nuber of matches to show for recommendation
					   if(match > 0)
					   {
						   recommendation_list[recommendation_list.length] = 'https://s3.amazonaws.com/snapsnus2/'+key;
						   //console.log("Image Recommended "+key );
						   console.log(recommendation_list);
						   //Show this image in recommendation pane

					   }
				   }         
		});

	}
	function ListReco(listOfFollowing,preferences_map)
	{
		var BucketName = 'snapsnus2';
		var s3Bucket = new AWS.S3({
			params: {
				Bucket: BucketName
			}
		});
	
		for(var i = 0;i<listOfFollowing.length;i++)
		{
			var prefix = listOfFollowing[i];
			var params = {
				Bucket: BucketName,
				Prefix: prefix
			};
			s3Bucket.listObjects(params, function(err, data) {
				if (err) {
					results.innerHTML = 'ERROR: ' + err;
				} else {
					
					data.Contents.forEach(function(obj) {
						recommendations(BucketName,s3Bucket,obj.Key,preferences_map);
					});
					
				}
			});
	  
			
		}

	}

  
  /**
   * API to Get Image List from S3
   */
  function getImage(profileid)
  {   	    
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

  
function AddToPreferences(attribute)
{
		var DB = new AWS.DynamoDB.DocumentClient();

		var table = "user";

		// Add to prefernces only if previoulsy non existent
		console.log("Inside adding pref "+preferences_list[attribute]);
		if(preferences_list[attribute] != true)
		{
			return DB.update({
			TableName:table,
			Key:{
				"userId" : useremail,
				"userName" : username
			},
			ReturnValues: 'ALL_NEW',
			UpdateExpression: 'set preferences = list_append(if_not_exists(preferences, :empty_list), :array)',
			ExpressionAttributeValues: {
				':array': [{"Value":attribute}],
				':empty_list': []
				}
		}).promise()

		}
		
}
var attributes = [];

function onLikeEvent(bucketname, bucket,key)
 {

  var params = {
      Bucket: bucketname,
      Key: key
	};

    bucket.getObjectTagging(params, function(err,data)
    { 
      
      if (err) console.log(err, err.stack); // an error occurred
           else{// successful response
              
             for(var i =0;i<data.TagSet.length;i++)
			 {  attributes[i] = data.TagSet[i].Value;
				AddToPreferences(attributes[i]);
              
			 }
			 console.log("Attributes "+attributes);
             //AddToPreferences(attributes);
            
           }         
    });


 }

 function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;
  
	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
  
	  // Pick a remaining element...
	  randomIndex = Math.floor(Math.random() * currentIndex);
	  currentIndex -= 1;
  
	  // And swap it with the current element.
	  temporaryValue = array[currentIndex];
	  array[currentIndex] = array[randomIndex];
	  array[randomIndex] = temporaryValue;
	}
  
	return array;
  }

  function createDiv(){
	recommendation_list = shuffle(recommendation_list);
	var d = document.getElementById('items');
	console.log("in creatediv");
  for(var i=0;i<recommendation_list.length;i++)
  {
    var iDiv =document.createElement('div');
    iDiv.id = 'list'+i;
    iDiv.className = "col-sm-6 col-md-3 col-lg-3 web";
    var src = recommendation_list[i];
   // var child = "<div class='portfolio-item'><div class='hover-bg'> <a href="+src+" rel=`prettyPhoto`><img src="+src+" class='img-responsive' alt='Project Title'> </a> </div></div>";
	var child = '<div class="portfolio-item"><div class="hover-bg"> <a href='+src+" rel=prettyPhoto"+'><img src='+src+' class="img-responsive" alt="Project Title"> </a> </div></div>';
	iDiv.innerHTML = child;

    d.append(iDiv); 
  }
}
   
  
  var prefers = [];
  //TODO : Remove this dummy method


  /**
   * API to redirect to
   * Search Profile for 
   * different users
   * @param elemVar
   * @returns
   */
  function redirectProfilePage(elemVar){
		var profileEmail = document.getElementById('resource_name').value;
		window.location.href =  "SearchProfile.html?profileId="+profileEmail;
  }
  
  
  
  //API to get the user profile for the searching profile
  function getUserprofile(profileId)
  {
	  var profile;
	  var params = {
				TableName : "user",
				Key : {
					"userId" : profileId,
	                "userName":"sharanya menon"
				},
				ProjectionExpression : "userProfile"

			};
		docClient.get(params,function(err, data) {
								if (err) {
									console.log("Error occurred");
								} else {
									profile = JSON.stringify(data, undefined, 2);
									console.log(data);
									if (data.Item.userProfile != "") {
										var src = data.Item.userProfile;
										 $("#profilePic").attr('src',src);
										  $("#pName").text("Sharanya Menon");
									}
								}
							});
		
	  
  }
  