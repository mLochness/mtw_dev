jQuery(document).ready(function ($) {

  $(".parallax-container:first").addClass("currentLevel");
  $(".para-section:first").addClass("currentSection");

  var vHeight;
  var vWidth;
  let parallaxContainer = $(".parallax-container");
  let paraSectionsCount = $(".currentLevel .para-section").length;
  let scrollIndexMax;
  let prlxLayers = $(".currentLevel .prlxLayer");
  let prlxLayersCount = $(".currentLevel .prlxLayer").length;
  let contentLayerIndex = $(".currentLevel #contentLayer").index();
  let prlxRatio = 1 / contentLayerIndex //parallax speed according to content layer
  let scrollIndex = 0;

  //disable click events on parallax layers over content layer:
  $(".prlxLayer").each(function () {
    if ($(this).index() > contentLayerIndex) {
      $(this).css("pointer-events", "none");
    }
  });

  let moveUnit;
  let centUnit;

  console.log("contentLayerIndex:", contentLayerIndex);
  console.log("prlxLayersCount:", prlxLayersCount);

  getWindowSize();

  function getWindowSize() {
    vHeight = document.documentElement.clientHeight;
    document.documentElement.style.setProperty("--vHeight", `${vHeight}px`);
    vWidth = document.documentElement.clientWidth;
    document.documentElement.style.setProperty("--vWidth", `${vWidth}px`);

    scrollIndexMax = -100 * (paraSectionsCount - 1);

    $(parallaxContainer).each(function () {
      thisIndex = $(this).index();
      $(this).css("transform", "translateY(" + thisIndex * vHeight + "px)");
    })
    ////////////////////////////////////////////////////////////////////
    // set parallax layers width:
    // $(prlxLayers).each(function () {
    //   let layerSectionRatio = paraSectionsCount - contentLayerIndex;
    //   console.log("layerSectionRatio", layerSectionRatio);
    //   thisIndex = $(this).index();
    //   $(this).css("width", (thisIndex + layerSectionRatio) * vWidth + "px");
    // })
    //test setup:
    $(prlxLayers).each(function () {
      thisIndex = $(this).index();
      $(this).css("width", (thisIndex + paraSectionsCount) * vWidth + "px");
    })
    //////////////////////////////////////////////////////////////////////////


    // count moveUnits for fitting sections in viewport:
    moveUnit = vWidth / prlxLayersCount;
    centUnit = vWidth / 100;
    console.log("window width/height:", vWidth, "/", vHeight);
    console.log("paraSectionsCount:", paraSectionsCount, "scrollIndexMax:", scrollIndexMax);
    console.log("moveUnit:", moveUnit, "px");
  }


  // fired wheel/touchmove or swipe events counter
  var triggers = 0;
  var triggersLimit = 8; //scroll distance to push slide


  // position reference container id: #contentLayer
  $(document).on("wheel touchmove", function (e) {
    ++triggers;

    const y = e.originalEvent.deltaY;
    const x = e.originalEvent.deltaX;

    let currentLevel = $(".currentLevel");
    let curLevelIndex = $(".currentLevel").index();
    let currentSection = $(".currentLevel .currentSection");
    let curSectionIndex = $(".currentLevel .currentSection").index();
    let thisIndex;
    let scrollTrace;

    //console.log("deltaY:", Math.abs(e.originalEvent.deltaY), "deltaX:", Math.abs(e.originalEvent.deltaX));
    if (Math.abs(e.originalEvent.deltaY) + Math.abs(e.originalEvent.deltaX) < 5) return;

    if (y < 0 || x < 0) {
      scrollIndex++;
      if (scrollIndex > 0) {
        scrollIndex = 0;
      }
      if (y < 1 && triggers > triggersLimit) {
        console.log("triggers limit, function LEFT fired -------------");
        triggers = 0;
        if ($(currentSection).prev().length) {
          var prevSection = $(currentSection).prev();
          scrollTrace = -vWidth * (curSectionIndex - 1);
          $(prlxLayers).each(function () {
            thisIndex = $(this).index();
            $(this).css("transform", "translateX(" + (scrollTrace * (thisIndex) * prlxRatio) + "px)");
            console.log("LEFT -> layer", thisIndex, "offset: ", scrollTrace * (thisIndex) * prlxRatio);
          });
          scrollIndex = -100 * (curSectionIndex - 1);
          $(currentSection).removeClass("currentSection");
          $(prevSection).addClass("currentSection");
          triggers = 0;
        }
        else {
          scrollIndex = 0;
        }
      }
    }
    if (y > 0 || x > 0) {
      scrollIndex--;
      if (y > 1 && triggers > triggersLimit) {
        console.log("triggers limit, function RIGHT fired -------------");
        //triggers = 0;
        if ($(currentSection).next().length) {
          var nextSection = $(currentSection).next();
          scrollTrace = -vWidth * (curSectionIndex + 1);
          $(prlxLayers).each(function () {
            thisIndex = $(this).index();
            $(this).css("transform", "translateX(" + (scrollTrace * (thisIndex) * prlxRatio) + "px)");
            console.log("RIGHT -> layer", thisIndex, "offset: ", (scrollTrace * (thisIndex) * prlxRatio));
          });
          scrollIndex = -100 * (curSectionIndex + 1);
          $(currentSection).removeClass("currentSection");
          $(nextSection).addClass("currentSection");

        }
        triggers = 0;
      }
    }

    if (scrollIndex > scrollIndexMax) {
      scrollTrace = scrollIndex * centUnit;
      $(prlxLayers).each(function () {
        thisIndex = $(this).index();
        $(this).css("transform", "translateX(" + (scrollTrace * thisIndex * prlxRatio) + "px)");
        //console.log("SCROLL -> layer", thisIndex, "offset: ",(scrollTrace * (thisIndex ) * prlxRatio));

      });
    }
    if (scrollIndex < scrollIndexMax) {
      scrollIndex = scrollIndexMax;
      scrollTrace = scrollIndexMax * 10;
    }
    // if (scrollIndex < scrollIndexMax && $(parallaxContainer).next().length) {
    //   var nextLevel = $(currentLevel).next();
    //       $(currentLevel).removeClass("currentLevel");
    //       $(nextLevel).addClass("currentLevel");
    //       $(".currentLevel").css("transform", "translateY(0px)");
    //   scrollIndex = -100 * (curSectionIndex + 1);
    //       $(currentSection).removeClass("currentSection");
    //       $(".currentLevel .para-section:first").addClass("currentSection");
    // }

    console.log("triggers:", triggers, "scrollIndex:", scrollIndex, "scrollTrace:", scrollTrace);

  });

  // *************************************************************

  //animate elements if in viewport:
  const animImage = document.querySelectorAll('.animImage')
  observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animateMe');
      } else {
        entry.target.classList.remove('animateMe');
      }
    });
  });
  animImage.forEach(animImage => {
    observer.observe(animImage);
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
      alignSectionAfterResize();
    },
    {
      delay: 250
    }
  );

  $(window).on("resize", holdResize);

  // aligning to viewport after window resize:
  function alignSectionAfterResize() {
    curSectionIndex = $(".currentSection").index();

    scrollTrace = -vWidth * (curSectionIndex);
    $(prlxLayers).each(function () {
      thisIndex = $(this).index();
      $(this).css("transform", "translateX(" + (scrollTrace * thisIndex * prlxRatio) + "px)");
      console.log("LEFT -> layer", thisIndex, "offset: ", $(this).offset().left);
    });
    scrollIndex = -100 * (curSectionIndex - 1);
  };

})


