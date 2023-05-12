let home_score = 0;
let away_score = 0;
// form validation
function validate(form) {
    if (!confirm("Are you sure the game is over?")) {
        return false;
    }
    document.getElementById("home_team_form").value = document.getElementById("home_team").innerHTML;
    document.getElementById("home_manager_form").value = document.getElementById("home_manager").innerHTML;
    document.getElementById("away_team_form").value = document.getElementById("away_team").innerHTML;
    document.getElementById("away_manager_form").value = document.getElementById("away_manager").innerHTML;
    document.getElementById("final_score").value = `${home_score}-${away_score}`;
    return true;
}
// increase goal
function increaseScore(team) {
    if (team === "home") {
        home_score += 1;
        document.getElementById("home_score").innerHTML = home_score;
    } else if (team === "away") {
        away_score += 1;
        document.getElementById("away_score").innerHTML = away_score;
    }
}
// decrease goal
function decreaseScore(team) {
    if (team === "home") {
        if (home_score > 0) {
            home_score -= 1;
        }
        document.getElementById("home_score").innerHTML = home_score;
    } else if (team === "away") {
        if (away_score > 0) {
            away_score -= 1;
        }
        document.getElementById("away_score").innerHTML = away_score;
    }
}
