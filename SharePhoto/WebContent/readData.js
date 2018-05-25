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

function readItem(a) {
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
			"userId" : "sharanyamenon0592@gmail.com",
			"userName" : "Sharanya Menon"
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
					.write("				<button id=\"follButton\" class=\"btn btn-default btn-sm\"");
			document.write("					onclick=\"follow(this)\">follow<\/button>");
			document.write("			<\/div>");
			document.write("		<\/div>");
		}

	}

	else {
		for (i = 0; i < data.Item.following.length; i++) {
			var userName = data.Item.following[i].userName;
			var userId = data.Item.following[i].userId;
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
					.write("				<button id=\"unfollButton\" class=\"btn btn-default btn-sm\"");
			document.write("					onclick=\"unfollow(this)\">unfollow<\/button>");
			document.write("			<\/div>");
			document.write("		<\/div>");
		}
	}

	document.write("	<\/div>");
	document.write("<\/div>");
	document.write("<\/body>");
	document.write("<\/html>");

}

function getFollowing() {
	readItem(true);
}

function getFollowers() {
	readItem(false);
}

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