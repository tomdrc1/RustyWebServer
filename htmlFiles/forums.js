function main()
{
    setup_goback_button();
    setup_search_button();
    var json_headers_string = get_headers();
    var json_headers = JSON.parse(json_headers_string);

    setup_headers(json_headers);
    
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

    document.getElementById("submitForumButton").onclick = function()
    {
        var xhttp = new XMLHttpRequest();
        var userdata = JSON.parse(get_user_by_cookie());
        var forumContent = document.getElementById("ForumContent").value.replace(/"/g, '\\$&');
        var forumTitle = document.getElementById("ForumTitle").value.replace(/"/g, '\\$&');;
        var category = document.getElementById("ForumCategory").selectedOptions[0].text.replace(/"/g, '\\$&');
        var currentDate = get_current_date();

        xhttp.open("POST", "/API/CREATE_FORUM", false);
        xhttp.send("{\"name\":\"{0}\", \"author\":\"{1}\", \"date_created\":\"{2}\", \"category\":\"{3}\", \"content\":\"{4}\"}".format(forumTitle, userdata["username"], currentDate, category, forumContent));

        if (xhttp.status == 400)
        {
            alert("Invalid Characters!");
        }
        else if (xhttp.status == 409)
        {
            alert("You already have a forum named \"{0}\"".format(forumTitle));
        }
        else if (xhttp.status == 500)
        {
            alert("We currently have trouble with our servers, please hang on");
        }
        else if (xhttp.status == 404)
        {
            alert("Empty field!");
        }
        else if (xhttp.status == 406)
        {
            alert("Please select a category!");
        }
        else if (xhttp.status == 201)
        {
            window.location.replace("/forum?{0}&{1}".format(forumTitle.replace(/\\/g, ''), userdata["username"]));
        }
    }
}

function setup_headers(json_headers)
{
    var forumsTable = document.getElementById("forums-list");
    
    var rows_length = forumsTable.rows.length;
    for (var i = 1; i < rows_length; ++i)
    {
        forumsTable.deleteRow(-1);
    }
    
    for (var i = 0; i < json_headers.length; ++i)
    {
        var row = forumsTable.insertRow();
        row.classList.add("zoom-in");
        row.onclick = function()
        {
            load_forum(this)
        };

        var name = row.insertCell();
        var username = row.insertCell();
        var date_created = row.insertCell();

        name.innerHTML = json_headers[i]["name"];
        username.innerHTML = json_headers[i]["username"];
        date_created.innerHTML = json_headers[i]["date_created"];
    }
    console.log(forumsTable.rows.length);
}

function load_forum(tableRow)
{
    window.location.replace("/forum?{0}&{1}".format(tableRow.cells[0].innerHTML, tableRow.cells[1].innerHTML));
}

function get_headers()
{
    var xhttp = new XMLHttpRequest();

    xhttp.open("GET", "/API/FORUM_HEADERS", false);
    xhttp.send();

    if (xhttp.status == 401)
    {
        window.location.replace("/unauthorized");
    }
    return xhttp.responseText;
}

function setup_goback_button()
{
    var button = document.getElementById("goBack");

    button.onclick = function()
    {
        window.location.replace("/home");
    }
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

function setup_search_button()
{
    var title_search_button = document.getElementById("titleSearchButton");
    var category_selection = document.getElementById("categorySearch");

    title_search_button.onclick = function()
    {
        var title_search_box = document.getElementById("titleSearch");
        var xhttp = new XMLHttpRequest();

        xhttp.open("GET", "/API/FORUM_HEADERS_BY_SEARCH/{0}&{1}".format(title_search_box.value, category_selection.value), false);
        xhttp.send();

        var json_headers = JSON.parse(xhttp.responseText);

        setup_headers(json_headers);
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