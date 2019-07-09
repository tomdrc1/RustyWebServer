main();

function main()
{
    var loginOverlay = document.getElementById("loginOverlay");
    var loginButton = document.getElementById("loginButton");
    var signupButton = document.getElementById("signupButton");
    var signupOverlay = document.getElementById("signupOverlay");

    loginButton.onclick = function()
    {
        loginOverlay.style.display = "block";
    }

    signupButton.onclick = function()
    {
        signupOverlay.style.display = "block";
    }

    //Login
    document.getElementsByClassName("submitButton")[0].onclick = function()
    {
        var xhttp = new XMLHttpRequest();
        var username = document.getElementById("loginUsername").value;
        var password = document.getElementById("loginPassword").value;

        xhttp.open("POST", "/API/LOGIN", false);
        xhttp.send("{\"username\":\"" + username + "\", \"password\":\"" + password + "\"}");

        if (xhttp.status == 404 || xhttp.status == 401)
        {
            alert("Username or password is incorrect!");
            return;
        }
        
        document.cookie = JSON.parse(xhttp.responseText)["token"];
        window.location.replace("/home.html");
    }

    //Register
    document.getElementsByClassName("submitButton")[1].onclick = function()
    {
        var xhttp = new XMLHttpRequest();
        var username = document.getElementById("signupUsername").value;
        var password = document.getElementById("signupPassword").value;
        var email = document.getElementById("signupEmail").value;

        xhttp.open("POST", "/API/REGISTER", false);
        xhttp.send("{\"username\":\"" + username + "\", \"password\":\"" + password + "\", \"email\":\"" + email + "\"}");

        if (xhttp.status != 201)
        {
            return;
        }

        window.location.replace("/");
    }

    document.getElementsByClassName("closeButton")[0].onclick = function()
    {
        loginOverlay.style.display = "none";
    }

    document.getElementsByClassName("closeButton")[1].onclick = function()
    {
        signupOverlay.style.display = "none";
    }
}