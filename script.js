jQuery(document).ready(function ($) {

  var vHeight;
  var vWidth;

  //let paraSectionsCount = document.querySelector(".para-section").length;
  let paraSectionsCount = $(".para-section").length;
  let paralaxMaxVoffset;
  let prlxContainer = $("#parallax-container");
  let prlxLayers = $(".prlxLayer");
  let prlxLayersCount = $(".prlxLayer").length;
  let prlxSpeed = 10 //parallax speed
  let scrollIndex = 0;
  let currentPosition = 0;
  let contentLayer = $("#contentLayer");
  let contentLayerIndex = $("#contentLayer").index();
  let moveUnit;
  //let pushLimit;

  console.log("contentLayerIndex:", contentLayerIndex);
  console.log("prlxLayersCount:", prlxLayersCount);


  getWindowSize();
  //document.querySelector(".para-section").classList.add("current");
  $(".para-section:first").addClass("current");

  function getWindowSize() {
    vHeight = document.documentElement.clientHeight;
    document.documentElement.style.setProperty("--vHeight", `${vHeight}px`);
    vWidth = document.documentElement.clientWidth;
    document.documentElement.style.setProperty("--vWidth", `${vWidth}px`);

    paralaxMaxVoffset = (paraSectionsCount - 1) * vWidth;
    // set the sensitivity of scroll takeover
    //pushLimit = vWidth / 10;

    // set top parallax layer width:
    //$(".prlxLayer:last").css("width", "" + paraSectionsCount * vWidth * 1.5 + "px");
    // count moveUnits for fitting sections in viewport:
    moveUnit = vWidth / paraSectionsCount;
    //sectionUnit = moveUnit * contentLayerIndex;
    console.log("window width/height:", vWidth, "/", vHeight);
    console.log("paraSectionsCount:", paraSectionsCount, "paralaxMaxVoffset:", paralaxMaxVoffset);
  }
  // fired wheel/touchmove or swipe events counter
  var triggers = 0;
  // position reference container id: #contentLayer
  $(prlxContainer).on("wheel touchmove", function (e) {
    ++triggers;

    //const y = e.deltaY;
    const y = e.originalEvent.deltaY;
    const x = e.originalEvent.deltaX;
    currentPosition = $("#contentLayer").position().left;
    current = $(".current");
    curSectionIndex = $(".current").index() + 1;

    if (y < 0 || x < 0) {
      scrollIndex++;
      if (scrollIndex > 0) {
        scrollIndex = 0;
      }
      if (y < 1 && triggers > 5 ) {
        console.log("triggers limit, function LEFT fired -------------");
        triggers = 0;
        if ($(current).prev().length) {
          var prevSection = $(current).prev();
          $(prlxLayers).each(function () {
            let thisIndex = $(this).index();
            $(this).css("transform", "translateX(" + (moveUnit * (thisIndex + 1) * -1 * (curSectionIndex - 1)) + "px)");
            console.log("curSectionIndex - 2:", curSectionIndex - 2);
          });
          $(current).removeClass("current");
          $(prevSection).addClass("current");
        }
      }
    }
    if (y > 0 || x > 0) {
      scrollIndex--;
      if (y > 1 && triggers > 5) {
        console.log("triggers limit, function RIGHT fired -------------");
        triggers = 0;
        if ($(current).next().length) {
          var nextSection = $(current).next();
          $(prlxLayers).each(function () {
            let thisIndex = $(this).index();
            $(this).css("transform", "translateX(" + (-moveUnit * (thisIndex + 1) * curSectionIndex) + "px)");
          });
          $(current).removeClass("current");
          $(nextSection).addClass("current");
        }
      }
    }
    $(prlxLayers).each(function () {
      let thisIndex = $(this).index();
      $(this).css("transform", "translateX(" + (scrollIndex * thisIndex * prlxSpeed) + "px)");
    });



    // for (let i = 0; i < prlxLayers.length; i++) {
    //   //prlxLayers[i].style.transform = 'translateX(-' + (window.pageYOffset * i / prlxLayers.length) + 'px)';
    //   prlxLayers[i].style.transform =
    //     "translateX(" + ((scrollIndex * i * 20) / prlxLayers.length) + "px)";
    // }
    // console.log("deltaY:", y, "deltaX:", x);
    console.log("scrollIndex:", scrollIndex);
    // console.log("currentPosition:", currentPosition);
  });



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

