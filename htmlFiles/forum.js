function main()
{
    setup_goback_button();
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
    creator.innerHTML = forum_data["username"] + " wrote:";
}

function setup_goback_button()
{
    var button = document.getElementById("goBack");

    button.onclick = function()
    {
        window.location.replace("/forums");
    }
}

function textAreaAdjust(o) 
{
    o.style.height = "1px";
    o.style.height = (25+o.scrollHeight)+"px";
}

function get_forum_data(forum_name, forum_creator)
{
    var xhttp = new XMLHttpRequest();
    var location = "/API/FORUM_BY_NAME_AND_CREATOR/{0}&{1}".format(forum_name, forum_creator);

    xhttp.open("GET", location, false);
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

String.prototype.format = function()
{
    a = this;
    for (k in arguments) {
    a = a.replace("{" + k + "}", arguments[k])
    }
    return a
}

main();