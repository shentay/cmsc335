fetch('/html/navbar.html')
.then(res => res.text())
.then(text => {
    let navbar = document.getElementById("navbar-placeholder");
    navbar.innerHTML = text;
});