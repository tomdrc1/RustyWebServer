function main()
{
    setup_goback_button();
    setup_comment_area();
    setup_comment_button();
    setup_delete_button();
    var forum_args = window.location.href.split('?')[1].split("&");
    
    var forum_name = forum_args[0];
    var forum_creator = forum_args[1];

    document.title = decodeURI(forum_name);

    var forum_data = JSON.parse(get_forum_data(forum_name, forum_creator));
    var content = document.getElementById("contentText");
    content.innerHTML = forum_data["content"];
    textAreaAdjust(content);

    var title = document.getElementById("title");
    title.innerHTML = forum_data["name"];
    title.style.textDecoration = "underline";

    var creator = document.getElementById("creator");
    creator.innerHTML = forum_data["author"] + " wrote:";

    var created_time = document.getElementById("createdTime");
    created_time.innerHTML = "Originally posted at: " + forum_data["date_created"];

    var comments = JSON.parse(get_forum_comments());
    var container = document.getElementsByClassName("container")[0];

    for (var i = 0; i < comments.length; ++i)
    {
        var commented = document.createElement("div");
        commented.style = "text-align: left;"
        commented.innerHTML = comments[i]["author"] + " commented:";

        container.appendChild(commented);

        var comment_area = document.createElement("textarea");
        comment_area.className = "contentTextarea";
        comment_area.readOnly = true;
        comment_area.value = comments[i]["content"];

        container.appendChild(comment_area);

        var date_created = document.createElement("div");
        date_created.style = "text-align: left;"
        date_created.innerHTML = "Originally commented at: " + comments[i]["date_created"];

        container.appendChild(date_created);

        var line_break = document.createElement("hr");
        container.appendChild(line_break);

        var space = document.createElement("br");
        space.style = "line-height: 40px;";
        container.appendChild(space);
    }
}

function get_forum_comments()
{
    var xhttp = new XMLHttpRequest();
    var forum_args = window.location.href.split('?')[1].split("&");
    
    var forum_name = forum_args[0];
    var forum_creator = forum_args[1];

    var forum_id = get_forum_id(forum_name, forum_creator);

    xhttp.open("GET", "/API/FORUM_COMMENTS/{0}".format(forum_id), false);
    xhttp.send();

    return xhttp.responseText;
}

function setup_goback_button()
{
    var button = document.getElementById("goBack");

    button.onclick = function()
    {
        window.location.replace("/forums");
    }
}

function setup_comment_area()
{
    var commentArea = document.getElementById("commentArea");

    commentArea.onkeyup = function()
    {
        textAreaAdjust(this);
    }
}

function setup_delete_button()
{
    var deleteButton = document.getElementById("deleteForumButton");

    var forum_args = window.location.href.split('?')[1].split("&");
    
    var forum_name = forum_args[0];
    var forum_creator = forum_args[1];

    var current_user = JSON.parse(get_user_by_cookie())["username"];

    if (forum_creator != current_user && !is_admin(current_user))
    {
        return;
    }

    deleteButton.style.display = "inline";

    deleteButton.onclick = function()
    {
        var xhttp = new XMLHttpRequest();

        xhttp.open("DELETE", "API/DELETE_FORUM/{0}&{1}".format(forum_name, forum_creator), false);
        xhttp.send();
        
        if (xhttp.status == 401)
        {
            alert("You have no authority to delete this post!");
        }

        if (xhttp.status == 200)
        {
            window.location.replace("/forums");
        }
    }
    
}

function is_admin(username)
{
    var xhttp = new XMLHttpRequest();

    xhttp.open("GET", "API/IS_ADMIN/{0}".format(username), false);
    xhttp.send();

    return (xhttp.status == 200);
}

function setup_comment_button()
{
    var commentButton = document.getElementById("commentButton");

    commentButton.onclick = function()
    {
        var forum_args = window.location.href.split('?')[1].split("&");
    
        var forum_name = forum_args[0];
        var forum_creator = forum_args[1];

        var forum_id = get_forum_id(forum_name, forum_creator);
        var date = get_current_date();
        var author = JSON.parse(get_user_by_cookie())["username"];
        var content = document.getElementById("commentArea").value.replace(/"/g, '\\$&');

        var xhttp = new XMLHttpRequest();
        
        xhttp.open("POST", "/API/CREATE_FORUM_COMMENT", false);
        xhttp.send("{\"author\":\"{0}\", \"content\":\"{1}\", \"date_created\":\"{2}\", \"forum_id\":{3}}".format(author, content, date, forum_id));
        
        if (xhttp.status == 404)
        {
            alert("Empty field!");
        }
        else if (xhttp.status == 400)
        {
            alert("Invalid data!");
        }
        else if (xhttp.status == 500)
        {
            alert("We currently have trouble with our servers, please hang on");
        }

        location.reload();
    }
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

function textAreaAdjust(o) 
{
    o.style.height = "1px";
    o.style.height = (25+o.scrollHeight)+"px";
}

function get_forum_data(forum_name, forum_creator)
{
    var xhttp = new XMLHttpRequest();

    xhttp.open("GET", "/API/FORUM_BY_NAME_AND_CREATOR/{0}&{1}".format(forum_name, forum_creator), false);
    xhttp.send();

    if (xhttp.status == 401)
    {
        window.location.replace("/unauthorized");
    }
    else if (xhttp.status == 400)
    {
        alert("Invalid characters!");
        return;
    }

    return xhttp.responseText;
}

function get_forum_id(forum_name, forum_creator)
{
    var xhttp = new XMLHttpRequest();

    xhttp.open("GET", "/API/FORUM_ID/{0}&{1}".format(forum_name, forum_creator), false);
    xhttp.send();

    if (xhttp.status == 401)
    {
        window.location.replace("/unauthorized");
    }

    var json_data = JSON.parse(xhttp.responseText);
    return json_data["id"];
}

String.prototype.format = function()
{
    a = this;
    for (k in arguments) {
    a = a.replace("{" + k + "}", arguments[k])
    }
    return a
}

function get_user_by_cookie()
{
    var xhttp = new XMLHttpRequest();

    xhttp.open("GET", "/API/USER_BY_AUTH", false);
    xhttp.send();

    return window.atob(xhttp.responseText);
}

main();