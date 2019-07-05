main();

function main()
{
    var loginOverlay = document.getElementById("loginOverlay");
    var span = document.getElementsByClassName("closeButton")[0];
    var loginButton = document.getElementById("loginButton");

    if (sessionStorage.getItem('status') != "loggedIn")
    {
        loginButton.style.display = "inline-block";
    }

    loginButton.onclick = function()
    {
        loginOverlay.style.display = "block";
    }

    document.getElementsByClassName("submitButton")[0].onclick = function()
    {
        var isLoginSuccessful = true;

        $.post("http://83.130.85.23/LOGIN", {
            username: "TheDiamondOr",
            password: "pwd"
        },
        function(data, status){
            alert("Data: " + data + "\nStatus: " + status);
        });
        if (!isLoginSuccessful)
        {
            return;
        }

        sessionStorage.setItem('status','loggedIn');
        window.location.replace("/");
    }

    span.onclick = function()
    {
        loginOverlay.style.display = "none";
        console.log(sessionStorage.getItem('status'));
    }

    window.onclick = function(event)
    {
        if (event.target == loginOverlay)
        {
            loginOverlay.style.display = "none";
        }
    }
}