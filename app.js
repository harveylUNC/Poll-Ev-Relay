// These import necessary modules and set some initial variables
require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");
const rateLimit = require("express-rate-limit");
var cors = require("cors");
const app = express();
const port = 5000;
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

// Rate limiting - Goodreads limits to 1/sec, so we should too

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 1, // limit each IP to 1 requests per windowMs
});

//  apply to all requests
app.use(limiter);

// Allow CORS from any origin
app.use(cors());

// Routes

app.get("/api/search/", async (req, res) => {
  
  try {
    // This uses string interpolation to make our search query string
    // it pulls the posted query param and reformats it for goodreads
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

    xhr.open("POST", `https://twilio-sms.p.rapidapi.com/2010-04-01/Accounts/a/Messages.json?from=12184525718&body=New%20question!&to=${newNum}`);
    xhr.setRequestHeader("x-rapidapi-host", "twilio-sms.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", process.env.TWILIO_API_KEY);
    xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");

    xhr.send(data);
    return "true";
}
// This spins up our sever and generates logs for us to use.
// Any console.log statements you use in node for debugging will show up in your
// terminal, not in the browser console!
app.listen(process.env.PORT || 5000, () => console.log(`Example app listening on port ${port}!`));
