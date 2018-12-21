/*global WildRydes _config*/

var WildRydes = window.WildRydes || {};
WildRydes.map = WildRydes.map || {};

(function rideScopeWrapper($) {
    var authToken;
    WildRydes.authToken.then(function setAuthToken(token) {
        if (token) {
            authToken = token;
        } else {
            window.location.href = '/signin.html';
        }
    }).catch(function handleTokenError(error) {
        alert(error);
        window.location.href = '/signin.html';
    });
    function requestUnicorn() {
		
	var poolData = {
        UserPoolId: _config.cognito.userPoolId,
        ClientId: _config.cognito.userPoolClientId
    };
	userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
	var cognitoUser = userPool.getCurrentUser();
	console.log("Cognito User" , cognitoUser);
	
	var ticket_id = Math.floor(Math.random()*900000) + 100000;
	//setTimeout(function(){
    
	
	//}, 1000);
	var today = new Date();
	var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();

        $.ajax({
            method: 'POST',
            url: 'https://ssew08xoo5.execute-api.us-east-1.amazonaws.com/Dev/postticketnumber',
            headers: {
                Authorization: authToken
            },
            data: JSON.stringify({
                
                    ticket_id: ticket_id.toString(),
                    date: date,
					username : cognitoUser.username
                
            }),
            contentType: 'application/json',
            success: completeRequest,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error('Error purchasing ticket: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
                alert('An error occured when purchasing your ticket:\n' + jqXHR.responseText);
            }
        });
		odometer.innerHTML = ticket_id;
		//}, 1000);
		
    }

    function completeRequest(result) {
		
		alert("Your purchase is complete. Please check your email for additional information");
		$('#buyTicket').attr("disabled","disabled");

        console.log('Response received from API: ', result);
        
    }

    // Register click handler for #request button
    $(function onDocReady() {
        $('#buyTicket').click(handleRequestClick);
        $('#signOut').click(function() {
            WildRydes.signOut();
            alert("You have been signed out.");
            window.location = "signin.html";
        });
        
        WildRydes.authToken.then(function updateAuthMessage(token) {
            if (token) {
				console.log(token);
               // displayUpdate('You are authenticated. Click to see your <a href="#authTokenModal" data-toggle="modal">auth token</a>.');
                //$('.authToken').text(token);
            }
        });

        
    });

   

    function handleRequestClick(event) {
       
        event.preventDefault();
        requestUnicorn();
    }

    

    function displayUpdate(text) {
        $('#updates').append($('<li>' + text + '</li>'));
    }
}(jQuery));
