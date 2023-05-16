function verifyPassword() {
    var pw = document.getElementById("password").value;
    var pw2 = document.getElementById("password-rpt").value;
    // check if fields are empty
    if (pw == '') {
        window.alert("Please enter password");
        return false;
    }

    if (pw2 == '') {
        window.alert("Please confirm password");
        return false;
    }

    // min length
    if (pw.length < 8) {
        window.alert("Password length must be at least 8 characters long!")
        return false;
    }

    // max length
    if (pw.length > 15) {
        window.alert("Password length must not exceed 15 characters!")
        return false;
    }

    // check if password matches
    if (pw != pw2) {
        window.alert("Password did not match");
        return false;
    }
    else {
        return true;
    }
}