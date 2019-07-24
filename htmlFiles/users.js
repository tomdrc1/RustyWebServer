var user_overlay = document.getElementById("userOverlay");

function main()
{
    setup_goback_button();
    setup_user_serach();
    var username = JSON.parse(get_user_by_cookie())["username"];
    if (!is_admin(username))
    {
        window.location.replace("/unauthorized");
    }

    var users = JSON.parse(get_users());
    setup_users_table(users);

}

function setup_goback_button()
{
    var button = document.getElementById("goBack");

    button.onclick = function()
    {
        window.location.replace("/home");
    }
}

function setup_users_table(users)
{
    var users_table = document.getElementById("users-list");

    var rows_length = users_table.rows.length;
    for (var i = 1; i < rows_length; ++i)
    {
        users_table.deleteRow(-1);
    }

    for (var i = 0; i < users.length; ++i)
    {
        var row = users_table.insertRow();

        row.classList.add("zoom-in");

        row.onclick = function()
        {
            user_menu(this);
        };

        var name = row.insertCell();

        name.innerHTML = users[i];
    }
}

function setup_user_serach()
{
    var user_search_button = document.getElementById("userSearchButton");

    user_search_button.onclick = function()
    {
        var user_search_box = document.getElementById("userSearch");
        var xhttp = new XMLHttpRequest();

        xhttp.open("GET", "/API/USERS_BY_QUERY/{0}".format(user_search_box.value), false);
        xhttp.send();

        var users = JSON.parse(xhttp.responseText);

        setup_users_table(users);
    }
}

function user_menu(tableRow)
{   
    user_overlay.style.display = "block";
    var username = tableRow.cells[0].innerHTML;

    var delete_user_button = document.getElementById("deleteUserButton");
    delete_user_button.innerHTML = "Delete {0}".format(username);
    delete_user_button.onclick = function()
    {
        var xhttp = new XMLHttpRequest();

        xhttp.open("DELETE", "API/USER/{0}".format(username), false);
        xhttp.send();
        
        if (xhttp.status == 401)
        {
            alert("You can't delete an admin!");
        }

        else if (xhttp.status == 200)
        {
            alert("You have deleted {0} successfuly!".format(username));
            window.location.reload();
        }
        
    }

    var user_data = document.getElementById("userdata");
    user_data.innerHTML = "What would you like to do with {0}?".format(username);
}

document.getElementsByClassName("closeButton")[0].onclick = function()
{
    user_overlay.style.display = "none";
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

function get_users()
{
    var xhttp = new XMLHttpRequest();

    xhttp.open("GET", "/API/USERS", false);
    xhttp.send();

    return xhttp.responseText;
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