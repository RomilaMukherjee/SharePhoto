var profilevalue = localStorage.getItem('profile');
var finalvalue = JSON.parse(profilevalue);
var googleUserName = finalvalue.ig;
var googleUserId = finalvalue.U3;
var otherProfileId;
var otherProfileName;

function follow(name) {
	document.getElementById("but").style.color = "red";
	/*alert(name);*/
}

function addElement(parentId, elementTag, elementId, html) {
	// Adds an element to the document
	var p = document.getElementById(parentId);
	var newElement = document.createElement(elementTag);
	newElement.setAttribute('id', elementId);
	newElement.innerHTML = html;
	p.appendChild(newElement);
}

/*
 * function viewProfile(name) { var n = name; alert(name); var t =
 * document.getElementById("divname_").innerHTML; alert(t); }
 */

var followersList = "";


var docClient = new AWS.DynamoDB.DocumentClient();
//var profile = googleUser.getBasicProfile();
var followers;
var following;


/* Function : ReadItem
 * Reads the Item from the Dynamo DB
 */
function readItem(a) {
	// Initialize the Amazon Cognito credentials provider
	AWS.config.region = 'us-east-1'; // Region
	AWS.config.credentials = new AWS.CognitoIdentityCredentials({
		IdentityPoolId: 'us-east-1:d640cf23-7fca-44bc-9af0-dd362df3b1c9',
	});

	var docClient = new AWS.DynamoDB.DocumentClient();
	condition = "";
	if (a) {
		condition = "following";
	} else {
		condition = "followers";
	}
	/*alert(condition);*/
	var params = {
		TableName : "user",
		Key : {
			"userId" : googleUserId,
			"userName" : googleUserName
//			"userId" : "hersom179@gmail.com",
//			"userName" : "royal hersom"
		},
		ProjectionExpression : "followers, following"

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

	document.write("<meta name=\"description\" content=\"\">");
	document.write("<meta name=\"author\" content=\"\">");
	document.write("");
	document.write("<!-- Favicons");
	document.write("    ================================================== -->");
	document.write("<link rel=\"shortcut icon\" href=\"img\/favicon.ico\" type=\"image\/x-icon\">");
	document.write("<link rel=\"apple-touch-icon\" href=\"img\/apple-touch-icon.png\">");
	document.write("<link rel=\"apple-touch-icon\" sizes=\"72x72\" href=\"img\/apple-touch-icon-72x72.png\">");
	document.write("<link rel=\"apple-touch-icon\" sizes=\"114x114\" href=\"img\/apple-touch-icon-114x114.png\">");
	document.write("");
	document.write("<!-- Bootstrap -->");
	document.write("<link rel=\"stylesheet\" type=\"text\/css\"  href=\"css\/bootstrap.css\">");
	document.write("<link rel=\"stylesheet\" type=\"text\/css\" href=\"fonts\/font-awesome\/css\/font-awesome.css\">");
	document.write("");
	document.write("<!-- Stylesheet");
	document.write("    ================================================== -->");
	document.write("<link rel=\"stylesheet\" type=\"text\/css\"  href=\"css\/style1.css\">");
	document.write("<link rel=\"stylesheet\" type=\"text\/css\" href=\"css\/prettyPhoto.css\">");
	document.write("<link href=\"http:\/\/fonts.googleapis.com\/css?family=Open+Sans:400,700,800,600,300\" rel=\"stylesheet\" type=\"text\/css\">");
	document.write("");
	document.write("	<script src=\"https:\/\/sdk.amazonaws.com\/js\/aws-sdk-2.1.12.min.js\"><\/script>");
	document.write("	<script src=\"https:\/\/sdk.amazonaws.com\/js\/aws-sdk-2.16.0.min.js\"><\/script>");
	document.write("	<script type=\"text\/javascript\" src=\"login.js\"><\/script>");
	document.write("	<script src=\"https:\/\/ajax.googleapis.com\/ajax\/libs\/jquery\/3.3.1\/jquery.min.js\"><\/script>");
	document.write("	<script src=\"https:\/\/apis.google.com\/js\/platform.js\" async defer><\/script>");
	document.write("	");
	document.write("<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->");
	document.write("<!-- WARNING: Respond.js doesn't work if you view the page via file:\/\/ -->");
	document.write("<!--[if lt IE 9]>");
	document.write("      <script src=\"https:\/\/oss.maxcdn.com\/html5shiv\/3.7.2\/html5shiv.min.js\"><\/script>");
	document.write("      <script src=\"https:\/\/oss.maxcdn.com\/respond\/1.4.2\/respond.min.js\"><\/script>");
	document.write("    <![endif]-->");
	document.write("<\/head>");
	document.write("");
	document.write("<!-- Navigation -->");
	document.write("<nav id=\"menu\" class=\"navbar navbar-default navbar-fixed-top\">");
	document.write("  <div class=\"container\"> ");
	document.write("    <!-- Brand and toggle get grouped for better mobile display -->");
	document.write("    <div class=\"navbar-header\">");
	document.write("      <button type=\"button\" class=\"navbar-toggle collapsed\" data-toggle=\"collapse\" data-target=\"#bs-example-navbar-collapse-1\"> <span class=\"sr-only\">Toggle navigation<\/span> <span class=\"icon-bar\"><\/span> <span class=\"icon-bar\"><\/span> <span class=\"icon-bar\"><\/span> <\/button>");
	document.write("      <a class=\"navbar-brand page-scroll\" href=\"#page-top\"><i class=\"fa fa-moon-o fa-rotate-90\"><\/i> Snap Share<\/a> <\/div>");
	document.write("    ");
	document.write("    <!-- Collect the nav links, forms, and other content for toggling -->");
	document.write("    <div class=\"collapse navbar-collapse\" id=\"bs-example-navbar-collapse-1\">");
	document.write("    ");
	document.write("      <ul class=\"nav navbar-nav navbar-right\">");
	document.write("      ");
	document.write("        <li><a href=\"Home.html\" class=\"page-scroll\">Home<\/a><\/li>");
	document.write("        <li><a href=\"MyProfile.html\" class=\"page-scroll\">My Profile<\/a><\/li>");
	document.write("        <li><a href=\"index.html\" class=\"page-scroll\" onClick=\"return signOut();\">SignOut<\/a><\/li>");
	document.write("      <\/ul>");
	document.write("      ");
	document.write("    <\/div>");
	document.write("    <!-- \/.navbar-collapse --> ");
	document.write("  <\/div>");
	document.write("  <!-- \/.container-fluid --> ");
	document.write("<\/nav>");
	document.write("<!-- Header -->");
	
	document.write("<script type=\"text\/javascript\" src=\"js\/jquery.1.11.1.js\"><\/script> ");
	document.write("<script type=\"text\/javascript\" src=\"js\/bootstrap.js\"><\/script> ");
	document.write("<script type=\"text\/javascript\" src=\"js\/SmoothScroll.js\"><\/script> ");
	document.write("<script type=\"text\/javascript\" src=\"js\/jquery.prettyPhoto.js\"><\/script> ");
	document.write("<script type=\"text\/javascript\" src=\"js\/jquery.isotope.js\"><\/script> ");
	document.write("<script type=\"text\/javascript\" src=\"js\/jqBootstrapValidation.js\"><\/script> ");
	document.write("<script type=\"text\/javascript\" src=\"js\/contact_me.js\"><\/script> ");
	document.write("<script type=\"text\/javascript\" src=\"js\/main.js\"><\/script>");

	
	document.write("<h4 class=\"small-heading more-margin-bottom\">"
			+ condition.toUpperCase() + "<\/h4>");
	document.write("<div class=\"row\">");
	document.write("	<div class=\"col-sm-4\" id=\"main_list\">");

	if (condition.toString() == "followers") {
		if(data!=undefined && data.Item.followers.length>0){
			for (i = 0; i < data.Item.followers.length; i++) {
				var userName = data.Item.followers[i].userName;
				var userId = data.Item.followers[i].userId;
				var isFollwing = checkIfPresentInFollowing(data, userId);
				var ButtonString;
				if (isFollwing) {
					ButtonString = "UNFOLLOW";
				} else {
					ButtonString = "FOLLOW";
				}

				/*alert(userId);*/
				var buttonIdFol = "follButton" + i;
				var userNameId = "divname_" + i;
				var userIDNo = "userId_" + i;
				document.write("		<div class=\"media user-card-sm\">");
				document
						.write("			<a class=\"media-left\" href=\"#\"> ");
				document
						.write("			<img id=\"profilePic\" class=\"img-circle\" width=\"70\" height=\"70\">");
				document.write("			<\/a>");
				document.write("			<div class=\"media-body\">");

				var nameStr = "				<h4 id=" + userNameId
						+ " onclick=\"viewProfile(this)\" class=\"media-heading\">"
						+ userName + "<\/h4>";
				document.write(nameStr);
				var idStr = "<p id=" + userIDNo + " class=\"text-success\">"
						+ userId + "<\/p>";
				document.write(idStr);
				document.write("			<\/div>");
				document.write("			<div class=\"media-right\">");
				document.write("				<button id=" + buttonIdFol
						+ " class=\"btn btn-default btn-sm\"");
				document.write("					onclick=\"follow(this.id)\">" + ButtonString
						+ "<\/button>");
				document.write("			<\/div>");
				document.write("		<\/div>");
			}
		}else{
			///
		}
	}

	else {
		if(data!=undefined && data.Item.following.length>0){
			for (i = 0; i < data.Item.following.length; i++) {
				var userName = data.Item.following[i].userName;
				var userId = data.Item.following[i].userId;
				var buttonId = 'follButton' + i;
				var userNameId = "divname_" + i;
				var userIDNo = "userId_" + i;
				document.write("		<div class=\"media user-card-sm\">");
				document
						.write("			<a class=\"media-left\" href=\"#\"> ");
				document
						.write("			<img id=\"profilePic\" class=\"img-circle\" width=\"70\" height=\"70\">");
				document.write("			<\/a>");
				document.write("			<div class=\"media-body\">");

				var nameStr = "				<h4 id=" + userNameId
						+ " onclick=\"viewProfile(this)\" class=\"media-heading\">"
						+ userName + "<\/h4>";
				document.write(nameStr);
				var idStr = "<p id=" + userIDNo + " class=\"text-success\">"
						+ userId + "<\/p>";
				document.write(idStr);
				document.write("			<\/div>");
				document.write("			<div class=\"media-right\">");
				document.write("				<button id=" + buttonId
						+ " class=\"btn btn-default btn-sm\"");
				document
						.write("					onclick=\"follow(this.id)\">Unfollow<\/button>");
				document.write("			<\/div>");
				document.write("		<\/div>");
			}
		}else{
			///
		}
	}

	document.write("	<\/div>");
	document.write("<\/div>");
	
	
	document.write("<meta charset=\"utf-8\">");
	document.write("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">");
	document.write("<link rel=\"stylesheet\" type=\"text\/css\"  href=\"css\/bootstrap.css\">");
	document.write("<link rel=\"stylesheet\" type=\"text\/css\" href=\"fonts\/font-awesome\/css\/font-awesome.css\">");
	document.write("<\/head>");
	document.write("<!-- Stylesheet");
	document.write("    ================================================== -->");
	document.write("<link rel=\"stylesheet\" type=\"text\/css\"  href=\"css\/style1.css\">");
	document.write("");
	document.write("<div id=\"footer\">");
	document.write("  <div class=\"container text-center\">");
	document.write("    <div class=\"fnav\">");
	document.write("      <p>2016 Snap Share.<\/p>");
	document.write("    <\/div>");
	document.write("  <\/div>");
	document.write("<\/div>");


	document.write("<\/body>");
	document.write("<\/html>");

}

function checkIfPresentInFollowing(data, userId) {
	var isinFollowing = false;
	for (ind = 0; ind < data.Item.following.length; ind++) {
		if (data.Item.following[ind].userId == userId) {
			isinFollowing = true;
			break;
		}
	}
	return isinFollowing;

}

function viewProfile(userName) {
	otherProfileName = userName.textContent;
	var id = userName.id.split("_").pop();
	var elementId= "userId_"+id;
	otherProfileId = document.getElementById(elementId).textContent;
	localStorage.setItem('otherProfileId', otherProfileId);
	window.location.href =  "SearchProfile.html?profileId="+otherProfileId;
//	window.location.href = "SearchProfile.html";
}

function getOtherProfileDetails() {
	var userid;
	userid = localStorage.getItem('otherProfileId');
	return userid;
}

/*
 * Function Name : getIndex Return type : Int retrieve followers / following
 * from the dynamo db, validates for the email and return index.
 */
function getIndex(pToCheckId, pProjectionExpression, pUserID, pUserName,
		unfollowName) {
	// My Following :
	// getIndex(document.getElementById(emailId).innerText,"following",googleUserId,googleUserName);
	// Initialize the Amazon Cognito credentials provider
	AWS.config.region = 'us-east-1'; // Region
	AWS.config.credentials = new AWS.CognitoIdentityCredentials({
		IdentityPoolId : 'us-east-1:d640cf23-7fca-44bc-9af0-dd362df3b1c9',
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
	if (document.getElementById(button_id).innerText == "FOLLOW") {
		var idNo = button_id.substr(10, 1);
		var nameId = "divname_" + idNo;
		var emailId = "userId_" + idNo;
		document.getElementById(button_id).innerText = "UNFOLLOW";
		AddToFollowing(document.getElementById(nameId).innerText, document
				.getElementById(emailId).innerText);
	} else {
		var idNo = button_id.substr(10, 1);
		var nameId = "divname_" + idNo;
		var emailId = "userId_" + idNo;
		document.getElementById(button_id).innerText = "FOLLOW";
		// Call getIndex() -> Email Id the Unfollow,followers/following our mail
		// Id and name
		getIndex(document.getElementById(emailId).innerText, "following",
				googleUserId, googleUserName,
				document.getElementById(nameId).innerText);
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

function AddToFollowing(name, emailID) {
	AddToTheirFollowers(name, emailID);
	var DB = new AWS.DynamoDB.DocumentClient()
	var table = "user";
	return DB.update({
						TableName : table,
						Key : {
							"userId" : googleUserId,
							"userName" : googleUserName
						},
						ReturnValues : 'ALL_NEW',
						UpdateExpression : 'set following = list_append(if_not_exists(following, :empty_list), :array)',
						ExpressionAttributeValues : {
            ':array': [{"userName":name,"userId":emailID}],
							':empty_list' : []
						}
					}).promise()

	AddToTheirFollowers(name, emailID)

}

function AddToTheirFollowers(name, emailID) {
	var DB = new AWS.DynamoDB.DocumentClient()
	var table = "user";
	return DB.update({
						TableName : table,
						Key : {
							"userId" : emailID,
							"userName" : name
						},
						ReturnValues : 'ALL_NEW',
						UpdateExpression : 'set followers = list_append(if_not_exists(followers, :empty_list), :array)',
						ExpressionAttributeValues : {
            ':array': [{"userName":googleUserName,"userId":googleUserId}],
							':empty_list' : []
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

/*
 * function viewProfile(name) { var n = name; alert(name); var t =
 * document.getElementById("divname_").innerHTML; alert(t); }
 */
var preferences_list = [];
preferences_list["Car"] = 'true';
preferences_list["car0"] = 'true';
function AddToPreferences(attributes)
{
	var DB = new AWS.DynamoDB.DocumentClient();

	var table = "user";

for(var i =0;i<attributes.length;i++)
{
		// Add to prefernces only if previoulsy non existent
		console.log(attributes[i]);
  if(preferences_list[attributes[i]] != 'true')
							{
	   return DB.update({
								TableName : table,
								Key : {
									"userId" : "toshimishra5@gmail.com",
									"userName" : "Toshi Mishra"
								// "userId" : "hersom179@gmail.com",
								// "userName" : "royal hersom"
								// "userId": profile.getEmail(),
								// "userName":profile.getName()
								},
								ReturnValues : 'ALL_NEW',
								UpdateExpression : 'set preferences = list_append(if_not_exists(preferences, :empty_list), :array)',
								ExpressionAttributeValues : {
		  ':array': [{"Value":attributes[i]}],
									':empty_list' : []
								}
							}).promise()

		}
	}
}

function getPrefernces()
{

	var params = {
		TableName : "user",
		Key : {
			"userId" : "toshimishra5@gmail.com",
			"userName" : "Toshi Mishra"
		// "userId" : "hersom179@gmail.com",
		// "userName" : "royal hersom"
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
				preferences_list[data.Item.preferences[i].Value] = 'true';
			}
			console.log(preferences_list);
			var attr = [];
			attr[0] = "Scooter";
			AddToPreferences(attr);
		}
	});

}
