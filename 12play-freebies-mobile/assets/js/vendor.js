function getUrlVars() {
  var vars = [],
    hash;
  var hashes = window.location.href
    .slice(window.location.href.indexOf("?") + 1)
    .split("&");
  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split("=");
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }
  return vars;
}


/**
 * 
 * ANIMATION SHOW SECTION
 * 
*/
$(function() {
  
  AOS.init({
    // Global settings:
    disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
    startEvent: 'DOMContentLoaded', // name of the event dispatched on the document, that AOS should initialize on
    initClassName: 'aos-init', // class applied after initialization
    animatedClassName: 'aos-animate', // class applied on animation
    useClassNames: true, // if true, will add content of `data-aos` as classes on scroll
    disableMutationObserver: true, // disables automatic mutations' detections (advanced)
    debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
    throttleDelay: 0, // the delay on throttle used while scrolling the page (advanced)
    
  
    // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
    offset: 0, // offset (in px) from the original trigger point
    delay: 0, // values from 0 to 3000, with step 50ms
    duration: 2000, // values from 0 to 3000, with step 50ms
    easing: 'ease', // default easing for AOS animations
    once: true, // whether animation should happen only once - while scrolling down
    mirror: true, // whether elements should animate out while scrolling past them
    anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation
  
  });
});

/**
 * 
 * END ANIMATION SHOW SECTION
 * 
*/


/**
 * SCROLL TEXT
 *
 */

//this is the useful function to scroll a text inside an element...
function startScrolling(scroller_obj, velocity, start_from) {
  //bind animation  inside the scroller element
  scroller_obj
    .bind("marquee", function (event, c) {
      //text to scroll
      var ob = $(this);
      //scroller width
      var sw = parseInt(ob.closest(".text-animated").width());
      //text width
      var tw = parseInt(ob.width());
      //text left position relative to the offset parent
      var tl = parseInt(ob.position().left);
      //velocity converted to calculate duration
      var v = velocity > 0 && velocity < 100 ? (100 - velocity) * 1000 : 5000;
      //same velocity for different text's length in relation with duration
      var dr = (v * tw) / sw + v;
      //is it scrolling from right or left?
      switch (start_from) {
        case "right":
          //   console.log('here')
          //is it the first time?
          if (typeof c == "undefined") {
            //if yes, start from the absolute right
            ob.css({
              left: sw,
            });
            sw = -tw;
          } else {
            //else calculate destination position
            sw = tl - (tw + sw);
          }
          break;
        default:
          if (typeof c == "undefined") {
            //start from the absolute left
            ob.css({
              left: -tw,
            });
          } else {
            //else calculate destination position
            sw += tl + tw;
          }
      }
      //attach animation to scroller element and start it by a trigger
      ob.animate(
        {
          left: sw,
        },
        {
          duration: dr,
          easing: "linear",
          complete: function () {
            ob.trigger("marquee");
          },
          step: function () {
            //check if scroller limits are reached
            if (start_from == "right") {
              if (parseInt(ob.position().left) < -parseInt(ob.width())) {
                //we need to stop and restart animation
                ob.stop();
                ob.trigger("marquee");
              }
            } else {
              if (
                parseInt(ob.position().left) > parseInt(ob.parent().width())
              ) {
                ob.stop();
                ob.trigger("marquee");
              }
            }
          },
        }
      );
    })
    .trigger("marquee");
  //pause scrolling animation on mouse over
  scroller_obj.mouseover(function () {
    $(this).stop();
  });
  //resume scrolling animation on mouse out
  scroller_obj.mouseout(function () {
    $(this).trigger("marquee", ["resume"]);
  });
}

$(function () {
  $(".text-animated").each(function (i, obj) {
    if ($(this).find(".text-overflow").width() > $(this).width()) {
      //settings to pass to function
      var scroller = $(this).find(".text-overflow"); // element(s) to scroll
      var scrolling_velocity = 95; // 1-99
      var scrolling_from = "right"; // 'right' or 'left'
      //call the function and start to scroll..
      startScrolling(scroller, scrolling_velocity, scrolling_from);
    }
  });
});

/**
 * END SCROLL TEXT
 *
 */




 function copyFunction(id) {
  /* Get the text field */
  var copyText = document.getElementById(id);

  /* Select the text field */
  copyText.select();
  copyText.setSelectionRange(0, 99999); /* For mobile devices */

   /* Copy the text inside the text field */
  navigator.clipboard.writeText(copyText.value);

  var toastCopyEl = document.getElementById('copiedToast')
  var toastCopyList = bootstrap.Toast.getOrCreateInstance(toastCopyEl)
  toastCopyList.show()
}



console.log('vendor.jsaaa')