import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {MongoClient, ServerApiVersion} from 'mongodb';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail } from "firebase/auth";

// mongodb authorization
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, 'credentials/.env') });  
const userName = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;
const databaseAndCollection = {db: process.env.MONGO_DB_NAME, collection: process.env.MONGO_COLLECTION};
const uri = `mongodb+srv://${userName}:${password}@cluster0.tsbctmh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// firebase authorization
const firebaseConfig = {
  apiKey: "AIzaSyC_aaj6TYHo0Np7n2EkrThwHeKeGNkPnYQ",
  authDomain: "undici-a9895.firebaseapp.com",
  projectId: "undici-a9895",
  storageBucket: "undici-a9895.appspot.com",
  messagingSenderId: "889383959635",
  appId: "1:889383959635:web:8eaedfd62f59c83705daa6",
  measurementId: "G-ZCQ8VCYBVD"
};
const firebase = initializeApp(firebaseConfig);
const auth = getAuth(firebase);
let useruid = null;
// helper functions
function setUid(uid) {
    useruid = uid;
}

// checking number of arguments is valid
let portNumber = 3000;
process.stdin.setEncoding("utf8");
if (process.argv.length == 3) {
    portNumber = process.argv[2];
    
} else if (process.argv.length > 3) {
    process.stdout.write(`Usage supermarketServer.js portNumber`);
    process.exit(1);
}

// app configuration
const app = express();
app.set("views", path.resolve(__dirname, "templates"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:false}));

// authentication side
// getting the index page
app.get("/", async (request, response) => {
    const variables = {
        message: ""
    };
    response.render("index", variables);
});

// adding user to the firebase
app.post("/register", async (request, response) => {
    let {email, password} = request.body;
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        setUid(user.uid);
        response.render("home");
    })
    .catch((error) => {
        let errorMessage;
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = `Email address provided is already in use!`;
                break;
            case 'auth/weak-password':
                errorMessage = 'Password is not strong enough!';
                break;
            default:
                errorMessage = error.message;
                break;
        }
        const variables = {
            message: errorMessage
        };
        response.render("index", variables);
    });
    
});

// getting the login page
app.get("/login", async (request, response) => {
    const variables = {
        message: ""
    };
    response.render("login", variables);
});

// logging in with user and checking if user exists
app.post("/login", (request, response) => {
    let {email, password} = request.body;
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        setUid(user.uid);
        response.render("home");
    })
    .catch((error) => {
        let errorMessage;
        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage = `Invalid email address!`
                break;
            case 'auth/wrong-password':
                errorMessage = `Invalid password!`;
                break;
            default:
                errorMessage = error.message;
                break;
        }
        const variables = {
            message: errorMessage
        };
        response.render("login", variables);
    });    
});

app.get("/reset", (request, response) => {
    const variables = {
        message: ""
    };
    response.render("reset", variables);
});

// reset password
app.post("/reset", (request, response) => {
    let {email} = request.body;
    sendPasswordResetEmail(auth, email)
    .then(() => {
        // Password reset email sent!
        response.render("resetConfirmation")
    })
    .catch((error) => {
        let errorMessage;
        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage = `Invalid email address!`;
                break;
            default:
                errorMessage = error.message;
                break;
        }
        const variables = {
            message: errorMessage
        };
        response.render("reset", variables);
    });
});

// logging out the user
app.get("/logout", (request, response) => {
    signOut(auth)
    .then(() => {
        const variables = {
            message: ""
        };
        setUid(null);
        response.render("login", variables);
    })
    .catch((error) => {
        const errorMessage = error.message;
        const variables = {
            message: errorMessage
        };
        response.render("login", variables);
    });
});

// getting the home page
app.get("/home", (request, response) => {
    if (useruid) {
        response.render("home");
    } else {
        const variables = {
            message: "Please Create An Account"
        };
        response.render("index", variables);
    }
});

// live table data side
// api data
let url;
const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': 'f663110788mshb3be327584236f3p14fe51jsn93d1de1c24fc',
        'X-RapidAPI-Host': 'livescore6.p.rapidapi.com'
    }
};

// getting the premier league table page
app.get("/prem", async (request, response) => {
    url = 'https://livescore6.p.rapidapi.com/leagues/v2/get-table?Category=soccer&Ccd=england&Scd=premier-league';
    const resp = await fetch(url, options);
    const result = await resp.text();
    const json_obj = JSON.parse(result);
    let tableHTML = "<table class='league-tables'>"
    tableHTML += "<tr><th>Position</th><th>Club</th><th>P</th><th>W</th><th>D</th><th>L</th><th>Pts</th><th>GD</th></tr>"
    for (let team of json_obj.LeagueTable.L[0].Tables[0].team) {
        tableHTML += `<tr><td>${team.rnk}</td><td>${team.Tnm}</td><td>${team.pld}</td><td>${team.win}</td><td>${team.drw}</td><td>${team.lst}</td><td>${team.pts}</td><td>${team.gd}</td></tr>`
    }
    tableHTML += "</table>"
    const variables = {
        table: tableHTML
    };
    response.render("prem", variables);
});

// getting the la liga table page
app.get("/laliga", async (request, response) => {
    url = 'https://livescore6.p.rapidapi.com/leagues/v2/get-table?Category=soccer&Ccd=spain&Scd=laliga-santander';
    const resp = await fetch(url, options);
    const result = await resp.text();
    const json_obj = JSON.parse(result);
    let tableHTML = "<table class='league-tables'>"
    tableHTML += "<tr><th>Position</th><th>Club</th><th>P</th><th>W</th><th>D</th><th>L</th><th>Pts</th><th>GD</th></tr>"
    for (let team of json_obj.LeagueTable.L[0].Tables[0].team) {
        tableHTML += `<tr><td>${team.rnk}</td><td>${team.Tnm}</td><td>${team.pld}</td><td>${team.win}</td><td>${team.drw}</td><td>${team.lst}</td><td>${team.pts}</td><td>${team.gd}</td></tr>`
    }
    tableHTML += "</table>"
    const variables = {
        table: tableHTML
    };
    response.render("laliga", variables);
});

// getting the seria table page
app.get("/serie", async (request, response) => {
    url = 'https://livescore6.p.rapidapi.com/leagues/v2/get-table?Category=soccer&Ccd=italy&Scd=serie-a';
    const resp = await fetch(url, options);
    const result = await resp.text();
    let json_obj = JSON.parse(result);
    let tableHTML = "<table class='league-tables'>"
    tableHTML += "<tr><th>Position</th><th>Club</th><th>P</th><th>W</th><th>D</th><th>L</th><th>Pts</th><th>GD</th></tr>"
    for (let team of json_obj.LeagueTable.L[0].Tables[0].team) {
        tableHTML += `<tr><td>${team.rnk}</td><td>${team.Tnm}</td><td>${team.pld}</td><td>${team.win}</td><td>${team.drw}</td><td>${team.lst}</td><td>${team.pts}</td><td>${team.gd}</td></tr>`
    }
    tableHTML += "</table>"
    const variables = {
        table: tableHTML
    };
    response.render("serie", variables);
});

// getting the bundesliga table page
app.get("/bundesliga", async (request, response) => {
    url = 'https://livescore6.p.rapidapi.com/leagues/v2/get-table?Category=soccer&Ccd=germany&Scd=bundesliga';
    const resp = await fetch(url, options);
    const result = await resp.text();
    let json_obj = JSON.parse(result);
    let tableHTML = "<table class='league-tables'>"
    tableHTML += "<tr><th>Position</th><th>Club</th><th>P</th><th>W</th><th>D</th><th>L</th><th>Pts</th><th>GD</th></tr>"
    for (let team of json_obj.LeagueTable.L[0].Tables[0].team) {
        tableHTML += `<tr><td>${team.rnk}</td><td>${team.Tnm}</td><td>${team.pld}</td><td>${team.win}</td><td>${team.drw}</td><td>${team.lst}</td><td>${team.pts}</td><td>${team.gd}</td></tr>`
    }
    tableHTML += "</table>"
    const variables = {
        table: tableHTML
    };
    response.render("bundesliga", variables);
});

// getting the ligueone page
app.get("/ligueone", async (request, response) => {
    url = 'https://livescore6.p.rapidapi.com/leagues/v2/get-table?Category=soccer&Ccd=france&Scd=ligue-1';
    const resp = await fetch(url, options);
    const result = await resp.text();
    let json_obj = JSON.parse(result);
    let tableHTML = "<table class='league-tables'>"
    tableHTML += "<tr><th>Position</th><th>Club</th><th>P</th><th>W</th><th>D</th><th>L</th><th>Pts</th><th>GD</th></tr>"
    for (let team of json_obj.LeagueTable.L[0].Tables[0].team) {
        tableHTML += `<tr><td>${team.rnk}</td><td>${team.Tnm}</td><td>${team.pld}</td><td>${team.win}</td><td>${team.drw}</td><td>${team.lst}</td><td>${team.pts}</td><td>${team.gd}</td></tr>`
    }
    tableHTML += "</table>"
    const variables = {
        table: tableHTML
    };
    response.render("ligueone", variables);
});

// UND1C! side
// getting the newgame page
app.get("/newgame", (request, response) => {
    if (useruid) {
        const variables = {
            localhost: `/newgame`
        };
        response.render("newgame", variables);
    } else {
        const variables = {
            localhost: `/register`,
            message: "Please Create An Account"
        };
        response.render("index", variables);
    }
});

// starting the game
app.post("/newgame", (request, response) => {
    let {home_manager, home_team, away_manager, away_team} = request.body;
    const variables = {
        home_manager: home_manager,
        home_team: home_team,
        away_manager: away_manager,
        away_team: away_team,
        localhost: `/scoreboard`
    };
    response.render("scoreboard", variables);
});

// sending the results to the server
app.post("/scoreboard", async (request, response) => {
    let {home_team, home_manager, away_team, away_manager, final_score} = request.body;
    const game_results = {
        useruid: useruid,
        home_team: home_team,
        away_team: away_team,
        home_manager: home_manager,
        away_manager: away_manager,
        final_score: final_score
    };
    await client.connect();
    await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).insertOne(game_results);
    await client.close();
    response.render("scoreboardConfirmation", game_results);
});

// getting the history page
app.get("/history", (request, response) => {
    if (useruid) {
        const variables = {
            localhost: `/history`
        };
        response.render("history", variables);
    } else {
        const variables = {
            localhost: `/register`,
            message: "Please Create An Account"
        };
        response.render("index", variables);
    }
});

// getting play history
app.post("/history", async (request, response) => {
    let {manager} = request.body;
        
    // find all plays with manager
    await client.connect();
    const cursor = client.db(databaseAndCollection.db).collection(databaseAndCollection.collection)
    .find({$and: [{useruid: useruid ,$or: [{home_manager: manager}, {away_manager: manager}]}]});
    const result = await cursor.toArray();
    await client.close();
    let resultTableHTML;   
    if (result.length === 0) {
        resultTableHTML = "<strong>No Results Found!</strong>";
    } else {
        resultTableHTML = "<table class='search-results'> <tr><th>Home Manager</th><th>Score</th><th>Away Manager</th></tr>";
        result.forEach(element => {
            resultTableHTML += `<tr><td>${element.home_manager}</td><td>${element.home_team} ${element.final_score} ${element.away_team}</td><td>${element.away_manager}</td></tr>`;
        });
        resultTableHTML += "</table>";
    }
    
    const variables = {
        results: resultTableHTML
    };
    response.render("historyResults", variables);
});

// show all games played
app.get("/all", async (request, response) => {
    if (useruid) {
        // get all games
        await client.connect();
        const cursor = client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).find({useruid: useruid});
        const result = await cursor.toArray();
        await client.close();
        let resultTableHTML = "<table class='search-results'> <tr><th>Home Manager</th><th>Score</th><th>Away Manager</th></tr>";
        result.forEach(element => {
            resultTableHTML += `<tr><td>${element.home_manager}</td><td>${element.home_team} ${element.final_score} ${element.away_team}</td><td>${element.away_manager}</td></tr>`;
        });
        resultTableHTML += "</table>";
        const variables = {
            results: resultTableHTML
        };
        response.render("all", variables);
    } else {
        const variables = {
            localhost: `/register`,
            message: "Please Create An Account"
        };
        response.render("index", variables);
    }
});

// command line interpreter
const server = http.createServer(app);
server.listen(portNumber, () => {
    console.log(`Web server started and running at http://localhost:${portNumber}`);
    process.stdout.write("Stop to shutdown the server: ");
    process.stdin.on('readable', () => {
        let dataInput = process.stdin.read();
        while (dataInput !== null) {
            let command = dataInput.trim();
            if (command === "stop") {
                console.log("Shutting down the server");
                process.exit(0);
            } else {
                console.log(`Invalid command: ${command}`);
            }
            process.stdout.write("Stop to shutdown the server: ");
            dataInput = process.stdin.read();
        }
    });
}); 


