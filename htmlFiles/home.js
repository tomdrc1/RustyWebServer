function main()
{
    setup_logout_button()

    var username = JSON.parse(get_user_by_cookie())["username"];

    if (is_admin(username))
    {
        setup_users_button();
    }
}

function setup_logout_button()
{
    var logoutButton = document.getElementById("logoutButton");

    logoutButton.onclick = function()
    {
        var xhttp = new XMLHttpRequest();

        xhttp.open("POST", "API/LOGOUT", false);
        xhttp.send("{}");
        
        if (xhttp.status == 404)
        {
            alert("You are not logged in");
            return;
        }

        window.location.replace("/");
    }
}

function is_admin(username)
{
    var xhttp = new XMLHttpRequest();

    xhttp.open("GET", "API/IS_ADMIN/{0}".format(username), false);
    xhttp.send();

    return (xhttp.status == 200);
}

function get_user_by_cookie()
{
    var xhttp = new XMLHttpRequest();

    xhttp.open("GET", "/API/USER_BY_AUTH", false);
    xhttp.send();

    return window.atob(xhttp.responseText);
}

function setup_users_button()
{
    var usersButton = document.getElementById("usersButton");
        
    usersButton.style = "display: inline;";

    usersButton.onclick = function()
    {
        window.location.replace("/users");
    }
}

String.prototype.format = function()
{
    a = this;
    for (k in arguments) {
      a = a.replace("{" + k + "}", arguments[k])
    }
    return a
}

main();