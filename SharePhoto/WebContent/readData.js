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

function readItem(a) {
//	getFollowersList();
//	getFollowingList();
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
			"userId" : "ms.romila@gmail.com",
			"userName" : "Romila Mukherjee"
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
			var buttonId = 'unfollButton' + i;
			document.write("		<div class=\"media user-card-sm\">");
			document
					.write("			<a class=\"media-left\" onclick=\"viewProfile(this)\" href=\"#\"> ");
			document
					.write("			<img id=\"profilePic\" class=\"img-circle\" width=\"70\" height=\"70\">");
			document.write("			<\/a>");
			document.write("			<div class=\"media-body\">");

			var nameStr = "				<h4 id=\"div_name\" onclick=\"viewProfile(this)\" class=\"media-heading\">"
					+ userName + "<\/h4>";
			document.write(nameStr);
			var idStr = "<p class=\"text-success\">" + userId + "<\/p>";
			document.write(idStr);
			document.write("			<\/div>");
			document.write("			<div class=\"media-right\">");
			document
					.write("				<button id=" + buttonId + " class=\"btn btn-default btn-sm\"");
			document.write("					onclick=\"unfollow(this.id)\">unfollow<\/button>");
			document.write("			<\/div>");
			document.write("		<\/div>");
		}
	}

	document.write("	<\/div>");
	document.write("<\/div>");
	document.write("<\/body>");
	document.write("<\/html>");

}

function getFollowersList(){
	var params = {
		TableName : "user",
		Key : {
			"userId" : "ms.romila@gmail.com",
			"userName" : "Romila Mukherjee"
//			"userId" : "hersom179@gmail.com",
//			"userName" : "royal hersom"
		},
		ProjectionExpression : "followers"

	};
	docClient
			.get(
					params,
					function(err, data) {
						if (err) {
							document.getElementById('textarea').innerHTML = "Unable to read item: "
									+ "\n" + JSON.stringify(err, undefined, 2);
						} else {

							followersList = data;
								//JSON.stringify(data, undefined, 2);
						}
					});
	
//	    var val = "ms.romila@gmail.com"
//		var index = followersList.Item.followers.findIndex(function(item, i){
//		  return item.userId === val
//		});

//		console.log(followersList);
//	var followers = JSON.parse(followersList);
//	var index = labels.indexOf('ms.romila@gmail.com');
}
function getFollowingList(){
	var params = {
		TableName : "user",
		Key : {
			"userId" : "ms.romila@gmail.com",
			"userName" : "Romila Mukherjee"
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
							document.getElementById('textarea').innerHTML = "Unable to read item: "
									+ "\n" + JSON.stringify(err, undefined, 2);
						} else {

							followersList = JSON.stringify(data, undefined, 2);
						}
					});
}

function getFollowing() {
	readItem(true);
}

function getFollowers() {
	readItem(false);
}

function follow(button_id) {
	var idNo = button_id.substr(10, 1);
	var nameId = "div_name" + idNo;
	var emailId = "userId" + idNo;
	document.getElementById(button_id).style.color = "red";
	if(document.getElementById(button_id).innerText == "Follow" ){ 
		document.getElementById(button_id).innerText = "Unfollow";
		AddToFollowing(document.getElementById(nameId).innerText,document.getElementById(emailId).innerText);
		}else{
		document.getElementById(button_id).innerText = "Follow add";
		removeFromFollowers(document.getElementById(nameId).innerText,document.getElementById(emailId).innerText,idNo);		
	}
}

/* This Function Removes the User Name and User Id from the followers list of the one logged in person unfollow 
 * Return : Nothing
 */
function removeFromTheirFollowers(Name , email, No){
	var params = {
			  TableName : 'user',
			  Key: {
				  "userId" : email,
				  "userName" : Name
				},
				ConditionExpression: "followers["+No+"].userId = :name",
				UpdateExpression: "remove followers["+No+"]",
				ExpressionAttributeValues: { ":name": email  }
		    };
			console.log("Attempting a conditional delete...");
			docClient.update(params, function(err, data) {
			    if (err) {
			        console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
			    } else {
			        console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
			    }
			});
		//Add the to Following
}

function removeFromFollowers(Name , email, No){
	array = [{"userName":Name,"userId":email}];
	var params = {
			  TableName : 'user',
			  Key: {
//				  "userId" : "hersom179@gmail.com",
//				  "userName" : "royal hersom"
				  "userId" : "ms.romila@gmail.com",
				  "userName" : "Romila Mukherjee"
				},
//				ConditionExpression: "following["+No+"].userId = :name",
//
//				UpdateExpression: "remove following["+No+"]",
				UpdateExpression: "remove followers.name",
				//data.Fruits = data.Fruits.filter(val => ((val.Name == "name" && val.family != "C") ||  (val.Name != "name" && val.family == "C")));
				//UpdateExpression: "followers = followers.filter(val=>(userId = :name))",
				//UpdateExpression: "remove followers WHERE userId = :name",
				ExpressionAttributeValues: { ":name": email  }
				//ExpressionAttributeValues: { ":array": array  }
		    };
			console.log("Attempting a conditional delete...");
			docClient.update(params, function(err, data) {
			    if (err) {
			        console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
			    } else {
			        console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
			    }
			});
		//Add the to Following
}

function AddToFollowing(name,emailID){
	AddToTheirFollowers(name,emailID);
	var DB = new AWS.DynamoDB.DocumentClient()
	var table = "user";
	return DB.update({
        TableName:table,
        Key:{
        	"userId" : "ms.romila@gmail.com",
			"userName" : "Romila Mukherjee"
//        	"userId" : "hersom179@gmail.com",
//			"userName" : "royal hersom"
//            "userId": profile.getEmail(),
//            "userName":profile.getName()
        },
        ReturnValues: 'ALL_NEW',
        UpdateExpression: 'set following = list_append(if_not_exists(following, :empty_list), :array)',
        ExpressionAttributeValues: {
            ':array': [{"userName":name,"userId":emailID}],
            ':empty_list': []
          }
    }).promise()
    
    
}

function AddToTheirFollowers(name,emailID){
	var DB = new AWS.DynamoDB.DocumentClient()
	var table = "user";
	return DB.update({
        TableName:table,
        Key:{
        	"userId" : emailID,
			"userName" : name
//            "userId": profile.getEmail(),
//            "userName":profile.getName()
        },
        ReturnValues: 'ALL_NEW',
        UpdateExpression: 'set followers = list_append(if_not_exists(followers, :empty_list), :array)',
        ExpressionAttributeValues: {
            ':array': [{"userName":profile.getEmail(),"userId":profile.getName()}],
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