jQuery(document).ready(function($) {
var vHeight;
var vWidth;
//let paraSectionsCount = document.querySelector(".para-section").length;
let paraSectionsCount = $(".para-section").length;
let paralaxMaxVscroll;
getWindowSize();
//document.querySelector(".para-section").classList.add("current");
$(".para-section:first").addClass("current");

function getWindowSize() {
  vHeight = document.documentElement.clientHeight;
  document.documentElement.style.setProperty("--vHeight", `${vHeight}px`);
  vWidth = document.documentElement.clientWidth;
  document.documentElement.style.setProperty("--vWidth", `${vWidth}px`);
  paralaxMaxVscroll = (paraSectionsCount - 1) * vWidth;
  // set top parallax layer width:
  $(".prlxLayer:last").css( "width", "" + paraSectionsCount * vWidth * 1.5 + "px" );
  console.log("window width/height:", vWidth, "/", vHeight);
  console.log(
    "paraSectionsCount:",
    paraSectionsCount,
    "paralaxMaxVscroll:",
    paralaxMaxVscroll
  );
}

//let prlxContainer = $("#parallax-container");
let prlxContainer = document.getElementById("parallax-container");
let prlxLayers = $(".prlxLayer");
let scrollIndex = 0;
currentPosition = $(".contentLayer").position().left;
//let currentSectionOffset = currentPosition.offsetLeft;
//let currentSectionOffset = $(".contentLayer").position().left ;
prlxContainer.addEventListener( "wheel", function (e) {
//$(prlxContainer).on('wheel', function (e) {
    const y = e.deltaY;

    if (y < 0) {
      scrollIndex++;
      if (scrollIndex > 0) {
        scrollIndex = 0;
      }
    } else {
    /* 
     if (y < 30) {
        scrollIndex = -1 * vWidth / 20 * 3;
    } 
 */
      scrollIndex--;
    }

    for (let i = 0; i < prlxLayers.length; i++) {
     //prlxLayers[i].style.transform = 'translateX(-' + (window.pageYOffset * i / prlxLayers.length) + 'px)';
      prlxLayers[i].style.transform = "translateX(" + ((scrollIndex * i * 20) / prlxLayers.length) + "px)";
      //console.log("scrollIndex:", scrollIndex);
     //console.log("currentPosition:", currentPosition);
    }
  },
  false
);

// *************************************************************

// fix for page freezing on window resize
function asyncProxy(fn, options, ctx) {
  //  Author: yanick.rochon@gmail.com  //  License: MIT
  var timer = null;
  var counter = 0;
  var _call = function (args) {
    counter = 0;

    fn.apply(ctx, args);
  };

  ctx = ctx || window;
  options = $.extend(
    {
      delay: 0,
      stack: Infinity
    },
    options
  );

  return function () {
    counter++;

    // prevent calling the delayed function multiple times
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    if (counter >= options.stack) {
      _call(arguments);
    } else {
      var args = arguments;

      timer = setTimeout(function () {
        timer = null;
        _call(args);
      }, options.delay);
    }
  };
}

var holdResize = asyncProxy(
  function (event) {
    getWindowSize();
  },
  {
    delay: 250
  }
);

$(window).on("resize", holdResize);



})