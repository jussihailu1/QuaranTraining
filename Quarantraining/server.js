const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const port = 3000;

// DB stuff
var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://dbUser:dbUserPassword@cluster0-j0lfr.azure.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("DB Connected"))
    .catch(err => console.log(err));

// initialize express middleware for handling POST data.
// app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

const Schema = mongoose.Schema;

var challengeSchema = new Schema({
    id: Number,
    name: String,
    image: String
});

var sharedChallengeSchema = new Schema({
    id: Number,
    challengeId: Number,
    challengerId: Number
});

// Initialize the model.
const Challenge = mongoose.model('Challenge', challengeSchema);
const SharedChallenge = mongoose.model('SharedChallenge', sharedChallengeSchema);

// Dit doet ook iets
app.use(bodyParser.urlencoded({ extended: true }));

// Enable CORS (https://enable-cors.org/server.html)
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");  //Door '*' kan alles en iedereen erbij.
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//Confirm that he api is working
app.patch("/api", (req, res) => {
    res.send("QUARANTINE IS COMING");
});

// Challenges -----------------------------------------------------------------

app.get("/challenges", (req, res) => {
    Challenge.find((err, results) => {
        res.json(results);
    })
});

app.post("/challenges", (req, res) => {
    let challenge = new Challenge({ ...req.body });

    challenge.save((err, newChallenge) => {
        res.json({ challenge: newChallenge });
    });
})

app.get("/sharedChallenges", (req, res) => {
    SharedChallenge.find((err, results) => {
        res.json(results);
    })
});

app.post("/sharedChallenges", (req, res) => {
    let sharedChallenge = new SharedChallenge({ ...req.body });

    sharedChallenge.save((err, newSharedChallenge) => {
        res.json({ sharedChallenge: newSharedChallenge });
    });
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));