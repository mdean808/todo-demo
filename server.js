const http = require('http');
const express = require('express');
const ical = require('node-ical');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const accountSid = 'AC43cb6273bc0586976a4e712af6036621';
const authToken = '1dbbbf7b5c8eddeba74652d68dad6384';
const client = require('twilio')(accountSid, authToken);

var lunchDesc = 'Sorry, there was some error grabbing the lunch menu.'

var express = require('express'), app = express();

app.use(express.static(__dirname));
app.listen(process.env.PORT || 8080);

app.post('/sms', (req, res) => {
    const twiml = new MessagingResponse();
    ical.fromURL('http://www.hpa.edu/calendar/calendar_744_gmt.ics', {}, function(err, data) {
        for (var k in data) {
            if (data[k].summary == 'Lunch') {
                data[k].description.replace(/\\n/g, "");
                lunchDesc = data[k].description;
                twiml.message('Lunch is: \n\n' + lunchDesc);
                res.writeHead(200, { 'Content-Type': 'text/xml' });
                res.end(twiml.toString());
                console.log('successfully sent');
                break;
            }
        }
    });
});
