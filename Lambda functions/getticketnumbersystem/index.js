const AWS = require('aws-sdk');
var docClient = new AWS.DynamoDB.DocumentClient();

var tableName="ticketsystem";
var crypto = require('crypto'),
algorithm = 'aes-256-ctr',
password = 'd6F3Efeq';
//email service
var ses = new AWS.SES({
   region: 'us-east-1'
});
var resultData;


exports.handler = (event, context, callback) => {
    
    console.log(event);
    
    function decrypt(text){
      var decipher = crypto.createDecipher(algorithm,password);
      var dec = decipher.update(text,'hex','utf8');
      dec += decipher.final('utf8');
      return dec;
    }
    
    var params=  {
        TableName: tableName,
        FilterExpression: '#date = :date',
        ExpressionAttributeNames: {
            '#date': 'date',
        },
        ExpressionAttributeValues: {
            ':date': event.date,
        },
    };
   console.log(`params=${JSON.stringify(params)}`);    
   docClient.scan(params, function(err, data){
    if(err){
        callback(err, null);
    }else{
        //console.log(data);
        console.log('my data:', data.Items);
        resultData = data.Items[0];
        console.log(`resultData:`, resultData); 
        sendEmailToUser(data.Items[0]);
        callback(null, decrypt(data.Items[0].ticket_id));
   }
   });
   
   function sendEmailToUser(event){
       console.log(event.User);
       var eParams = {
            Destination: {
                ToAddresses: [event.User]
            },
            Message: {
                Body: {
                    Html: {
                	// HTML Format of the email
                	Charset: "UTF-8",
                	Data:
                	  "<html><body><h1 style='color:red'>Congratulations!</h1><p> Winning ticket number for the date " + event.date + " is-<b> "+  decrypt(event.ticket_id) +"</b></p> <p>Please contact our customer support to claim your price.</p></br><br>Hurray!</br>Online Lottery System<br/>myticketinfo3@gmail.com</body></html>"
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
   }
   
    
};
