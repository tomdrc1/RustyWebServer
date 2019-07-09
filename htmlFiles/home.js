main();

function main()
{
    is_authorized();
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