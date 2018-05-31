/**
 *API to fetch login details from gmail authentication
 */

var useremail;
var following = [];
var preferences_list = [];
var recommendation_list =[];
populatePreferences();

 


function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); 
  useremail= profile.getEmail();// This is null if the 'email' scope is not present.

  //The ID token you need to pass to your backend:
  var id_token = googleUser.getAuthResponse().id_token;
  
  //Call API to persist the userInformation to DB
  saveUserProfileToDynamoDB(profile);
 
 /*if(profileSaved==true){
	location.replace("Home.html");
	  if(profile != undefined){
		  localStorage.setItem('profile', JSON.stringify(profile)); 
		  window.location.href =  "Home.html";
	  }else{
		  window.location.href =  "Home.html";
	  }

  }*/
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
function  saveUserProfileToDynamoDB(profile){
	
		// Initialize the Amazon Cognito credentials provider
	AWS.config.region = 'us-east-1'; // Region
	AWS.config.credentials = new AWS.CognitoIdentityCredentials({
		IdentityPoolId: 'us-east-1:d640cf23-7fca-44bc-9af0-dd362df3b1c9',
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
	//TODO remove this test reco call
	testReco();
	//ListReco(following,preferences_list);

		// Initialize the Amazon Cognito credentials provider
	AWS.config.region = 'us-east-1'; // Region
	AWS.config.credentials = new AWS.CognitoIdentityCredentials({
		IdentityPoolId: 'us-east-1:d640cf23-7fca-44bc-9af0-dd362df3b1c9',
	});
    AWS.config.credentials.get(function(err) {
      if (err) alert(err);
      console.log(AWS.config.credentials);
    });

  var bucketName = 'snapsnus2'; // Enter your bucket name
  var bucket = new AWS.S3({
      params: {
          Bucket: bucketName
      }
  });

  var fileChooser = document.getElementById('file-chooser');
  var button = document.getElementById('upload-button');
  var results = document.getElementById('results');
  var file = fileChooser.files[0];

      if (file) {

          results.innerHTML = '';
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
                  results.innerHTML = 'ERROR: ' + err;
              } else {
				  alert("Image uploaded successfully!");
				  //testReco();
				  DetectLabels(bucketName,bucket,useremail + '/' + file.name);
				  
				 // getLabels(bucketName,bucket,useremail + '/' +'pexels-photo-170811.jpeg');
			
              }
          });
      } else {
          results.innerHTML = 'Nothing to upload.';
      }
   
      
              
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
  
  // Machine Learning APi to get preferences of the image
  
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
	

	

	//var following = [];
	function populateFollowingList()
	{
				
				// Initialize the Amazon Cognito credentials provider
		AWS.config.region = 'us-east-1'; // Region
		AWS.config.credentials = new AWS.CognitoIdentityCredentials({
			IdentityPoolId: 'us-east-1:d640cf23-7fca-44bc-9af0-dd362df3b1c9',
		});
		var docClient = new AWS.DynamoDB.DocumentClient();
		
		var params = {
			TableName : "user",
			Key : {
				"userId" : "tosvoyager43@gmail.com",
				"userName" : "Toshi Mishra"
	//			"userId" : "hersom179@gmail.com",
	//			"userName" : "royal hersom"
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
		console.log("populatePreferences called");
				// Initialize the Amazon Cognito credentials provider
		AWS.config.region = 'us-east-1'; // Region
		AWS.config.credentials = new AWS.CognitoIdentityCredentials({
			IdentityPoolId: 'us-east-1:d640cf23-7fca-44bc-9af0-dd362df3b1c9',
		});
		var docClient = new AWS.DynamoDB.DocumentClient();
		var params = {
    	TableName : "user",
    	Key : {
			"userId" : "tosvoyager43@gmail.com",
			"userName" : "Toshi Mishra"
	//      "userId" : "hersom179@gmail.com",
	//      "userName" : "royal hersom"
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

  
  function getImage()
  {
	// Initialize the Amazon Cognito credentials provider
		AWS.config.region = 'us-east-1'; // Region
		AWS.config.credentials = new AWS.CognitoIdentityCredentials({
			IdentityPoolId: 'us-east-1:d640cf23-7fca-44bc-9af0-dd362df3b1c9',
		});

	    AWS.config.credentials.get(function(err) {
	      if (err) alert(err);
	      console.log(AWS.config.credentials);
	    });
	  var s3Bucket = new AWS.S3({
	      params: {
	          Bucket: 'snapsnus2'
	      }
	  });
	  var urlParams = {Bucket: 'snapsnus2', Key: 'testing'};
	  s3Bucket.getSignedUrl('getObject', urlParams, function(err, url){
	    console.log('the url of the image is', url);
	  })
	  
	  var params = {Bucket: 'snapsnus2'};
	  s3Bucket.listObjects(params, function(err, data){
	    var bucketContents = data.Contents;
	      for (var i = 0; i < bucketContents.length; i++){
	        var urlParams = {Bucket: 'snapsnus2', Key: bucketContents[i].Key};
	          s3.getSignedUrl('getObject',urlParams, function(err, url){
	            console.log('the url of the image is', url);
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
				// Initialize the Amazon Cognito credentials provider
		AWS.config.region = 'us-east-1'; // Region
		AWS.config.credentials = new AWS.CognitoIdentityCredentials({
			IdentityPoolId: 'us-east-1:d640cf23-7fca-44bc-9af0-dd362df3b1c9',
		});
		var DB = new AWS.DynamoDB.DocumentClient();

		var table = "user";

		
		// Add to prefernces only if previoulsy non existent
		console.log("Inside adding pref "+preferences_list[attribute]);
		if(preferences_list[attribute] != true)
		{
			return DB.update({
			TableName:table,
			Key:{
				"userId" : "tosvoyager43@gmail.com",
					"userName" : "Toshi Mishra"
		//          "userId" : "hersom179@gmail.com",
		//      "userName" : "royal hersom"
		//            "userId": profile.getEmail(),
		//            "userName":profile.getName()
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
	AWS.config.region = 'us-east-1'; // Region
		AWS.config.credentials = new AWS.CognitoIdentityCredentials({
			IdentityPoolId: 'us-east-1:d640cf23-7fca-44bc-9af0-dd362df3b1c9',
		});
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

  for(var i=0;i<recommendation_list.length;i++)
  {
    var iDiv =document.createElement('div');
    iDiv.id = 'list'+i;
    iDiv.className = "col-sm-6 col-md-3 col-lg-3 web";
    var src = recommendation_list[i];
    var child = "<div class='portfolio-item'><div class='hover-bg'> <a href="+src+"rel='prettyPhoto'><img src="+src+" class='img-responsive' alt='Project Title'> </a> </div></div>";
	iDiv.innerHTML = child;

    d.append(iDiv); 
  }
}
   
  
  var prefers = [];
  //TODO : Remove this dummy method

 function testReco()
  {
	  attributes[0] = "Car";
	  //AddToPreferences(attributes);
			// Initialize the Amazon Cognito credentials provider
		AWS.config.region = 'us-east-1'; // Region
		AWS.config.credentials = new AWS.CognitoIdentityCredentials({
			IdentityPoolId: 'us-east-1:d640cf23-7fca-44bc-9af0-dd362df3b1c9',
		});
	  var s3Bucket = new AWS.S3({
		params: {
			Bucket: 'snapsnus2'
		}
	});
	console.log(preferences_list);
	//onLikeEvent('snapsnus2',s3Bucket,"tosvoyager43@gmail.com/brand-business-cellphone-204611.jpg");

	//populateFollowingList();
   // populatePreferences();

	//following[0] = "dharith5@gmail.com";
	//following[1] = "tosvoyager43@gmail.com"
	//preferences_list["Computer"] = 'true';
	// prefers["Outdoors"] = 'true';
	// prefers["Car"] = 'true';
	// prefers["Mountain"] = 'true';
	// prefers["Transportation"] = 'true';
	//ListReco(following,preferences_list);
	recommendation_list = shuffle(recommendation_list);
	console.log(recommendation_list);
  }

  