main();

function main()
{
    is_authorized();

    var forumsTable = document.getElementById("forums-list");
    var json_headers_string = get_headers();
    var json_headers = JSON.parse(json_headers_string);

    for (let i = 0; i < json_headers.length; ++i)
    {
        var row = forumsTable.insertRow();

        var name = row.insertCell();
        var username = row.insertCell();
        var date_created = row.insertCell();

        name.innerHTML = json_headers[i]["name"];
        username.innerHTML = json_headers[i]["username"];
        date_created.innerHTML = json_headers[i]["date_created"];
    }

    var createForumButton = document.getElementById("createForumButton");
    var createForumOverlay = document.getElementById("createForumOverlay");

    createForumButton.onclick = function()
    {
        createForumOverlay.style.display = "block";
    }

    document.getElementsByClassName("closeButton")[0].onclick = function()
    {
        createForumOverlay.style.display = "none";
    }

    document.getElementsByClassName("submitButton")[0].onclick = function()
    {
        var xhttp = new XMLHttpRequest();
        var userdata = JSON.parse(get_user_by_cookie());
        var forumContent = document.getElementById("ForumContent").value;
        var forumTitle = document.getElementById("ForumTitle").value;
        var category = document.getElementById("ForumCategory").selectedOptions[0].text
        var currentDate = get_current_date();

        xhttp.open("POST", "/API/CREATE_FORUM", false);
        xhttp.send("{\"name\":\"{0}\", \"username\":\"{1}\", \"date_created\":\"{2}\", \"category\":\"{3}\", \"content\":\"{4}\"}".format(forumTitle, userdata["username"], currentDate, category, forumContent));
    }
}

function get_headers()
{
    var xhttp = new XMLHttpRequest();

    xhttp.open("GET", "/API/FORUM_HEADERS", false);
    xhttp.send();

    return xhttp.responseText;
}

function get_user_by_cookie()
{
    var xhttp = new XMLHttpRequest();

    xhttp.open("GET", "/API/USER_BY_AUTH", false);
    xhttp.send();

    return window.atob(xhttp.responseText);
}

function get_current_date()
{
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;

    return today.toString();
}

function is_authorized()
{
    var xhttp = new XMLHttpRequest();

    xhttp.open("GET", "/API/IS_AUTHORIZED", false);
    xhttp.send();

    if (xhttp.status == 401)
    {
        window.location.replace("/unauthorized.html")
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