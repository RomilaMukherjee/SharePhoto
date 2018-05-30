var profilevalue = localStorage.getItem('profile');
var finalvalue = JSON.parse(profilevalue);
var googleUserName = finalvalue.ig;
var googleUserId =  finalvalue.U3;

function follow(name) {
	document.getElementById("but").style.color = "red";
	alert(name);
}

function addElement(parentId, elementTag, elementId, html) {
	// Adds an element to the document
	var p = document.getElementById(parentId);
	var newElement = document.createElement(elementTag);
	newElement.setAttribute('id', elementId);
	newElement.innerHTML = html;
	p.appendChild(newElement);
}

function viewProfile(name) {
	var n = name;
	alert(name);
	var t = document.getElementById("div_name").innerHTML;
	alert(t);
}

var followersList = "";
AWS.config.update({
	region : "ap-southeast-1",
});

AWS.config.credentials = new AWS.CognitoIdentityCredentials({
	IdentityPoolId : "ap-southeast-1:af3ff7b8-a334-4e0c-b2df-5dfdf4046147",
	RoleArn : "arn:aws:iam::163612915076:role/Cognito_TeamShareUnauth_Role"
});

var docClient = new AWS.DynamoDB.DocumentClient();
//var profile = googleUser.getBasicProfile();
var followers;
var following;


/* Function : ReadItem
 * Reads the Item from the Dynamo DB
 */
function readItem(a) {
	AWS.config.update({
		region : "ap-southeast-1",
	});

	AWS.config.credentials = new AWS.CognitoIdentityCredentials({
		IdentityPoolId : "ap-southeast-1:af3ff7b8-a334-4e0c-b2df-5dfdf4046147",
		RoleArn : "arn:aws:iam::163612915076:role/Cognito_TeamShareUnauth_Role"
	});

	var docClient = new AWS.DynamoDB.DocumentClient();
	condition = "";
	if (a) {
		condition = "following";
	} else {
		condition = "followers";
	}
	alert(condition);
	var params = {
		TableName : "user",
		Key : {
			"userId" : googleUserId,
			"userName" : googleUserName
//			"userId" : "hersom179@gmail.com",
//			"userName" : "royal hersom"
		},
		ProjectionExpression : condition

	};
	docClient
			.get(
					params,
					function(err, data) {
						if (err) {
							document.getElementById('textarea').innerHTML = "Unable to read item: "
									+ "\n" + JSON.stringify(err, undefined, 2);
						} else {

							followersList = JSON.stringify(data, undefined, 2);
							showOnUI(data, condition);
						}
					});

}

function showOnUI(data, condition) {

	document.write("<!DOCTYPE HTML>");
	document.write("<html>");
	document.write("    <heads>");
	document.write("        <title>Test<\/title>");
	document.write("<meta charset=\"utf-8\">");
	document
			.write("	<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">");
	document.write("	<link rel=\"stylesheet\"");
	document
			.write("		href=\"https:\/\/maxcdn.bootstrapcdn.com\/bootstrap\/3.3.7\/css\/bootstrap.min.css\">");
	document.write("	<script");
	document
			.write("		src=\"https:\/\/ajax.googleapis.com\/ajax\/libs\/jquery\/3.3.1\/jquery.min.js\"><\/script>");
	document.write("	<script");
	document
			.write("		src=\"https:\/\/maxcdn.bootstrapcdn.com\/bootstrap\/3.3.7\/js\/bootstrap.min.js\"><\/script>");
	document.write("	");
	document.write("    <\/head>");
	document.write("<body>");
	document
			.write("<h4 class=\"small-heading more-margin-bottom\">"+condition.toUpperCase() +"<\/h4>");
	document.write("<div class=\"row\">");
	document.write("	<div class=\"col-sm-4\" id=\"main_list\">");

	if (condition.toString() == "followers") {
		for (i = 0; i < data.Item.followers.length; i++) {
			var userName = data.Item.followers[i].userName;
			var userId = data.Item.followers[i].userId;
			alert(userId);
			var buttonIdFol = "follButton" + i;
			var userNameId = "div_name" + i;
			var userIDNo = "userId" + i;
			document.write("		<div class=\"media user-card-sm\">");
			document
					.write("			<a class=\"media-left\" onclick=\"viewProfile(this)\" href=\"#\"> ");
			document
					.write("			<img id=\"profilePic\" class=\"img-circle\" width=\"70\" height=\"70\">");
			document.write("			<\/a>");
			document.write("			<div class=\"media-body\">");

			var nameStr = "				<h4 id=" + userNameId + " onclick=\"viewProfile(this)\" class=\"media-heading\">"
					+ userName + "<\/h4>";
			document.write(nameStr);
			var idStr = "<p id=" + userIDNo + " class=\"text-success\">" + userId + "<\/p>";
			document.write(idStr);
			document.write("			<\/div>");
			document.write("			<div class=\"media-right\">");
			document
					.write("				<button id=" + buttonIdFol + " class=\"btn btn-default btn-sm\"");
			document.write("					onclick=\"follow(this.id)\">Follow<\/button>");
			document.write("			<\/div>");
			document.write("		<\/div>");
		}

	}

	else {
		for (i = 0; i < data.Item.following.length; i++) {
			var userName = data.Item.following[i].userName;
			var userId = data.Item.following[i].userId;
			var buttonId = 'follButton' + i;
			var userNameId = "div_name" + i;
			var userIDNo = "userId" + i;
			document.write("		<div class=\"media user-card-sm\">");
			document
					.write("			<a class=\"media-left\" onclick=\"viewProfile(this)\" href=\"#\"> ");
			document
					.write("			<img id=\"profilePic\" class=\"img-circle\" width=\"70\" height=\"70\">");
			document.write("			<\/a>");
			document.write("			<div class=\"media-body\">");

			var nameStr = "				<h4 id=" + userNameId + " onclick=\"viewProfile(this)\" class=\"media-heading\">"
					+ userName + "<\/h4>";
			document.write(nameStr);
			var idStr = "<p id=" + userIDNo + " class=\"text-success\">" + userId + "<\/p>";
			document.write(idStr);
			document.write("			<\/div>");
			document.write("			<div class=\"media-right\">");
			document
					.write("				<button id=" + buttonId + " class=\"btn btn-default btn-sm\"");
			document.write("					onclick=\"follow(this.id)\">Unfollow<\/button>");
			document.write("			<\/div>");
			document.write("		<\/div>");
		}
	}

	document.write("	<\/div>");
	document.write("<\/div>");
	document.write("<\/body>");
	document.write("<\/html>");

}



/* Function Name : getIndex 
 * Return type : Int
 * retrieve followers / following from the dynamo db, validates for the email and return index.
 */
function getIndex(pToCheckId,pProjectionExpression,pUserID,pUserName,unfollowName){
	// My Following : getIndex(document.getElementById(emailId).innerText,"following",googleUserId,googleUserName);
	AWS.config.update({
		region : "ap-southeast-1",
	});

	AWS.config.credentials = new AWS.CognitoIdentityCredentials({
		IdentityPoolId : "ap-southeast-1:af3ff7b8-a334-4e0c-b2df-5dfdf4046147",
		RoleArn : "arn:aws:iam::163612915076:role/Cognito_TeamShareUnauth_Role"
	});

	var dynamodb = new AWS.DynamoDB();
	var docClient = new AWS.DynamoDB.DocumentClient();
	var followList;
	var index = -1;
	var params = {
		TableName : "user",
		Key : {
			"userId" : pUserID,
			"userName" : pUserName
		},
		ProjectionExpression : pProjectionExpression,
		ReturnValues: 'ALL_NEW',

	};
	docClient.get(params, function(err, data){
	  if(err){
		 console.log(err);
	  } 
	  else{
		  console.log(data);
		  if(pProjectionExpression == "following"){
			  for (i = 0; i < data.Item.following.length; i++) {
					if(data.Item.following[i].userId == pToCheckId){
						removeFromFollowing(i,pToCheckId,unfollowName);
						break
					}
				}
		  }else{
			  for (i = 0; i < data.Item.followers.length; i++) {
					if(data.Item.followers[i].userId == pToCheckId){
						removeFromTheirFollowers(i,pUserID,pUserName);
						break
					}
				}
		  }
		 	
	  }
	});
	return index;
}



function getFollowing() {
	readItem(true);
}

function getFollowers() {
	readItem(false);
}

function follow(button_id) {
	document.getElementById(button_id).style.color = "red";
	if(document.getElementById(button_id).innerText == "Follow" ){ 
		var idNo = button_id.substr(10, 1);
		var nameId = "div_name" + idNo;
		var emailId = "userId" + idNo;
		document.getElementById(button_id).innerText = "Unfollow";
		AddToFollowing(document.getElementById(nameId).innerText,document.getElementById(emailId).innerText);
		}else{
		var idNo = button_id.substr(10, 1);
		var nameId = "div_name" + idNo;
		var emailId = "userId" + idNo;
		document.getElementById(button_id).innerText = "Follow";
		//Call getIndex() -> Email Id the Unfollow,followers/following our mail Id and name
		getIndex(document.getElementById(emailId).innerText,"following",googleUserId,googleUserName,document.getElementById(nameId).innerText);
		}
}



/* Function : removeFromTheirFollowers
 * This Function Removes the User Name and User Id from the followers list of the one logged in person unfollow 
 */
function removeFromTheirFollowers(index, pID , pName){
		var params = {
				  TableName : 'user',
				  Key: {
					  "userId" : pID,
					  "userName" : pName
					},
					UpdateExpression: "remove followers[" + index + "]"
			    };
				console.log("Attempting a conditional delete...");
				docClient.update(params, function(err, data) {
				    if (err) {
				        console.error("Their Followers : Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
				    } else {
				        console.log("DeleteItem succeeded from their Followers:", JSON.stringify(data, null, 2));
				    }
				});
	
}



/*Function : removeFromFollowing
 * On click Unfollow Remove the user from the logged in user's followers list
 */
function removeFromFollowing(index,userId,userName){
//	//DBIndex = getIndex(email,"following",googleUserId,googleUserName);
//	//pass email to check/Remove , Followers / Following , Account NAme & Email ID
			var params = {
			  TableName : 'user',
			  Key: {
				  //TODO : To be profile.getuserid...
				  "userId" : googleUserId,
				  "userName" : googleUserName
				},
				UpdateExpression: "remove following[" + index + "]"
		    };
			console.log("Attempting a conditional delete...");
			docClient.update(params, function(err, data) {
			    if (err) {
			        console.error("Following : Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
			    } else {
			        console.log(" Following : DeleteItem succeeded:", JSON.stringify(data, null, 2));
			        getIndex(googleUserId,"followers",userId,userName,googleUserName);
			    }
			});
}



function AddToFollowing(name,emailID){
	AddToTheirFollowers(name,emailID);
	var DB = new AWS.DynamoDB.DocumentClient()
	var table = "user";
	return DB.update({
        TableName:table,
        Key:{
        	"userId" : googleUserId,
			"userName" : googleUserName
        },
        ReturnValues: 'ALL_NEW',
        UpdateExpression: 'set following = list_append(if_not_exists(following, :empty_list), :array)',
        ExpressionAttributeValues: {
            ':array': [{"userName":name,"userId":emailID}],
            ':empty_list': []
          }
    }).promise()
    
    AddToTheirFollowers(name,emailID)
    
}



function AddToTheirFollowers(name,emailID){
	var DB = new AWS.DynamoDB.DocumentClient()
	var table = "user";
	return DB.update({
        TableName:table,
        Key:{
        	"userId" : emailID,
			"userName" : name
        },
        ReturnValues: 'ALL_NEW',
        UpdateExpression: 'set followers = list_append(if_not_exists(followers, :empty_list), :array)',
        ExpressionAttributeValues: {
            ':array': [{"userName":googleUserName,"userId":googleUserId}],
            ':empty_list': []
          }
    }).promise()
}



function addElement(parentId, elementTag, elementId, html) {
	// Adds an element to the document
	var p = document.getElementById(parentId);
	var newElement = document.createElement(elementTag);
	newElement.setAttribute('id', elementId);
	newElement.innerHTML = html;
	p.appendChild(newElement);
}



function viewProfile(name) {
	var n = name;
	alert(name);
	var t = document.getElementById("div_name").innerHTML;
	alert(t);
}