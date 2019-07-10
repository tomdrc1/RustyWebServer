function main()
{
    var forum_args = window.location.href.split('?')[1].split("&");
    
    var forum_name = forum_args[0];
    var forum_creator = forum_args[1];

    get_forum_data(forum_name, forum_creator);
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