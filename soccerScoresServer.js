const path = require("path");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
let portNumber = 3000;  
require("dotenv").config({ path: path.resolve(__dirname, 'credentials/.env') }) 
const userName = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;
const databaseAndCollection = {db: process.env.MONGO_DB_NAME, collection: process.env.MONGO_COLLECTION};
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${userName}:${password}@cluster0.tsbctmh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// checking number of arguments is valid
process.stdin.setEncoding("utf8");
if (process.argv.length == 3) {
    portNumber = process.argv[2];
    
} else if (process.argv.length > 3) {
    process.stdout.write(`Usage supermarketServer.js portNumber`);
    process.exit(1);
} else {
    portNumber = 3000;
}

// app configuration
app.set("views", path.resolve(__dirname, "templates"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:false}));

// getting the index page
app.get("/", (request, response) => {
    response.render("index");
});

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

// getting the newgame page
app.get("/newgame", (request, response) => {
    const variables = {
        localhost: `http://localhost:${portNumber}/newgame`
    };
    response.render("newgame", variables);
});

// starting the game
app.post("/newgame", (request, response) => {
    let {home_manager, home_team, away_manager, away_team} = request.body;
    const variables = {
        home_manager: home_manager,
        home_team: home_team,
        away_manager: away_manager,
        away_team: away_team,
        localhost: `http://localhost:${portNumber}/scoreboard`
    };
    response.render("scoreboard", variables);
});

// sending the results to the server
app.post("/scoreboard", async (request, response) => {
    let {home_team, home_manager, away_team, away_manager, final_score} = request.body;
    const game_results = {
        home_team: home_team,
        away_team: away_team,
        home_manager: home_manager,
        away_manager: away_manager,
        final_score: final_score
    }
    await client.connect();
    await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).insertOne(game_results);
    await client.close();
    response.render("scoreboardConfirmation", game_results);
});

// getting the history page
app.get("/history", (request, response) => {
    const variables = {
        localhost: `http://localhost:${portNumber}/history`
    };
    response.render("history", variables);
});

// getting play history
app.post("/history", async (request, response) => {
    let {manager} = request.body;
        
    // find all plays with manager
    await client.connect();
    const cursor = client.db(databaseAndCollection.db).collection(databaseAndCollection.collection)
    .find({$or: [{home_manager: manager}, {away_manager: manager}]});
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
    // get all games
    await client.connect();
    const cursor = client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).find({});
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
});

// command line interpreter
app.listen(portNumber); 
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