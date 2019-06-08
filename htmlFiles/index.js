import * as wasm from "./wasm_file.js"

main();

async function main()
{
    await wasm.init();
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
        console.log(wasm.calc_primes(200));
    }

    window.onclick = function(event)
    {
        if (event.target == loginOverlay)
        {
        loginOverlay.style.display = "none";
        }
    }

    console.log(await wasm.calc(500));
}