$(document).ready(function() {
    // set to light mode if nothing found in cache, else set to cached theme mode
    if (localStorage.getItem("12pMode") === null) {
        localStorage["12pMode"] = "light";
    }

    document.documentElement.setAttribute("data-theme", localStorage["12pMode"]);
});