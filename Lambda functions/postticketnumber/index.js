var AWS = require("aws-sdk");
var docClient= new AWS.DynamoDB.DocumentClient();
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';

//email service
var ses = new AWS.SES({
   region: 'us-east-1'
});

exports.handler = (event, context, callback) => {
  
    //console.log('Context:',event.requestContext);
    //console.log('Context:',event.requestContext.authorizer);
    
//    const username = event.requestContext.authorizer.claims['cognito:username'];

//code for email
     var eParams = {
        Destination: {
            ToAddresses: [event.username]
        },
        Message: {
            Body: {
                Html: {
                	// HTML Format of the email
                	Charset: "UTF-8",
                	Data:
                	  "<html><body><h1>Hey There!</h1><p> Your Ticket purchase is Complete. <br/> <p style='color:red'> Your ticket number is- <b>"+ event.ticket_id +"</b></p>Please check your results after 10 days of purchasing ticket.<br/><br/>All the best!<br/>Online Lottery System<br/>myticketinfo3@gmail.com</body></html>"
                  }
            },
            Subject: {
                Data: "Email from lottery!!!"
            }
        },
        Source: "myticketinfo3@gmail.com"
    };

    console.log('===SENDING EMAIL===');
    var email = ses.sendEmail(eParams, function(err, data){
        if(err) console.log(err);
        else {
            console.log("===EMAIL SENT===");
            console.log(data);


            console.log("EMAIL CODE END");
            console.log('EMAIL: ', email);
            context.succeed(event);

        }
    });

     function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password);
  var crypted = cipher.update(text,'utf8','hex');
  crypted += cipher.final('hex');
  return crypted;
}
    
    
    
    var tableName="ticketsystem";
    var params={
        TableName: tableName,
        Item :{
           "ticket_id": encrypt(event.ticket_id),
            "date" : event.date,
            "User" : event.username
        }
    };
    
    docClient.put(params,function(err,data){
        if(err)
        {
            callback(err);
        }else{
            callback(null,"Successfully updated data");
        }
    });
    
};

