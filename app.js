const express = require("express");
const bodyParse = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

const port = process.env.PORT || 3000;

app.use(express.static("public")); 
app.use(bodyParse.urlencoded({extended : true}));

app.get("/",function(req,res){
    res.sendFile(__dirname + "/signup.html");
})

app.post("/",function(req,res){
    const fName = req.body.fName;
    const lName = req.body.lName;
    const email = req.body.email;

    const data = {
        members : [
            {
                email_address : email,
                status : "subscribed",
                merge_fields : {
                    FNAME : fName,
                    LNAME : lName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us12.api.mailchimp.com/3.0/lists/894467e4e0";

    const options = {
        method: "post",
        auth: "rudra:afe61124e679e5ac370fc0ef44b12566-us12"
    }
    const request = https.request(url, options, function(response){

        if(response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        
        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
})

app.post("/failure", function(req,res){
      res.redirect("/");
})

app.listen(port ,function(){
    console.log("Server is running on port " + port);
})



