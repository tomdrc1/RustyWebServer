function main()
{
    setup_logout_button();
    setup_change_password();
    var username = JSON.parse(get_user_by_cookie())["username"];

    if (is_admin(username))
    {
        setup_users_button();
    }
}

function setup_logout_button()
{
    var logoutButton = document.getElementById("logoutButton");

    logoutButton.onclick = logout
}

function logout()
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

    if (xhttp.status == 401)
    {
        window.location.replace("/unauthorized");
    }
    
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

function setup_change_password()
{
    var changePasswordButton = document.getElementById("changePasswordButton");
    var changePasswordOverlay = document.getElementById("changePasswordOverlay");

    changePasswordButton.onclick = function()
    {
        changePasswordOverlay.style.display = "block";
    }

    document.getElementsByClassName("closeButton")[0].onclick = function()
    {
        changePasswordOverlay.style.display = "none";
    }

    document.getElementsByClassName("submitButton")[0].onclick = function()
    {
        var xhttp = new XMLHttpRequest();
        var password = document.getElementById("newPassword").value;

        xhttp.open("PUT", "/API/CHANGE_PASSWORD", false);
        xhttp.send("{\"password\":\"{0}\"}".format(password));

        if (xhttp.status == 412)
        {
            alert("Your password doesn't meet our requirements!\nYour password should be at least 8 letters long and in english!");
            return;
        }
        else if (xhttp.status == 500)
        {
            alert("We are having trouble with the servers right now, please hang on.");
            return;
        }
        
        logout();
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