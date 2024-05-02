$(document).ready(function () {
  if (
    localStorage.getItem("lang") === null ||
    (localStorage.getItem("lang") != "en" &&
      localStorage.getItem("lang") != "cn")
  )
    localStorage.lang = "en";
  // changeText(localStorage["lang"], false);
  if (localStorage["login"] == "true") {
    $(".sidebar-Logout").each(function () {
      $(this).hide();
    });
  } else {
    $(".sidebar-Login").each(function () {
      $(this).hide();
    });
  }
  // $(".chgLang").click(function () {
  //   var lang = "en";
  //   if (localStorage["lang"] == "en") lang = "cn";
  //   localStorage["lang"] = lang;
  //   changeText(lang);
  // });
  // switch night mode / light mode text on sidebar
  // if (localStorage.mode == "light") {
  //   document.getElementById("night-mode").style.display = "inline-block";
  //   document.getElementById("light-mode").style.display = "none";
  //   document.getElementById("light-mode-img").style.display = "none";
  //   document.getElementById("night-mode-img").style.display = "inline-block";
  // } else {
  //   document.getElementById("night-mode").style.display = "none";
  //   document.getElementById("light-mode").style.display = "inline-block";
  //   document.getElementById("light-mode-img").style.display = "inline-block";
  //   document.getElementById("night-mode-img").style.display = "none";
  // }
  // toggle light/dark mode
  $(".chgMode").click(function (e) {
    var mode = "light";
    if (localStorage["mode"] == "light") {
      mode = "dark";
    }
    localStorage["mode"] = mode;
    document.documentElement.setAttribute("data-theme", mode);
    // switch night mode / light mode text on sidebar
    if (localStorage.mode == "light") {
      document.getElementById("night-mode").style.display = "inline-block";
      document.getElementById("light-mode").style.display = "none";
      document.getElementById("light-mode-img").style.display = "none";
      document.getElementById("night-mode-img").style.display = "inline-block";
    } else {
      document.getElementById("night-mode").style.display = "none";
      document.getElementById("light-mode").style.display = "inline-block";
      document.getElementById("light-mode-img").style.display = "inline-block";
      document.getElementById("night-mode-img").style.display = "none";
    }
  });
});
