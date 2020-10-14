// These import necessary modules and set some initial variables
require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");
const rateLimit = require("express-rate-limit");
var cors = require("cors");
const app = express();
const port = 5000;
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const limiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 1, 
});

//  apply to all requests
app.use(limiter);

// Allow CORS from any origin
app.use(cors());

// Routes

app.get("/api/search/", async (req, res) => {
  
  try {

    let pNumber = `${req.query.q}`;

    pNumber = req.query.q;
    console.log("hi");
    console.log(pNumber);
    
    const response = await sendText(pNumber);
    const working = await response;

    return res.json({
      success: true,
      
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

function sendText(newNum){
  var data = null;

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            console.log(this.responseText);
        };
    });

    xhr.open("POST", `https://twilio-sms.p.rapidapi.com/2010-04-01/Accounts/a/Messages.json?from=12184525718&body=New%20%Poll%20Everywhere%20question!&to=${newNum}`);
    xhr.setRequestHeader("x-rapidapi-host", "twilio-sms.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", process.env.TWILIO_API_KEY);
    xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");

    xhr.send(data);
    return "true";
}

app.listen(process.env.PORT || 5000, () => console.log(`Example app listening on port ${port}!`));
