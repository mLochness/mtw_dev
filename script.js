jQuery(document).ready(function ($) {

  $(document).on('readystatechange', function () {
    if (document.readyState !== "complete") {
      document.querySelector("body").style.visibility = "hidden";
      document.querySelector("#loader").style.opacity = "1";
    } else {
      document.querySelector("#loader").style.opacity = "0";
      document.querySelector("body").style.visibility = "visible";
      setTimeout(document.querySelector("#loader").style.display = "none", 1750);
    }
  });

  $(".parallax-container:first").addClass("currentLevel");
  $(".para-section:first").addClass("currentSection");

  var vHeight;
  var vWidth;

  let parallaxContainer = $(".parallax-container");
  let scrollIndexMax;
  let prlxLayers = $(".prlxLayer");
  let prlxLayersCount = $(".currentLevel .prlxLayer").length;
  let paraSectionsCount = $(".currentLevel .para-section").length;
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
  var triggersLimit = 15; //scroll distance to push slide


  //event throttling to finish slides
  var ignoreEvents = false;
  var ignoreTime = 750; 
  function ignoreEventsTimeout () {
    ignoreEvents = false;
    console.log("ignoreEventsTimeout fired")
  }

  $(document).on("wheel touchmove", function (e) {

    if (ignoreEvents === false) {

      ++triggers;

      const y = e.originalEvent.deltaY;
      const x = e.originalEvent.deltaX;

      currentLevel = $(".currentLevel");
      prlxLayers = $(".currentLevel .prlxLayer");
      prlxLayersCount = $(".currentLevel .prlxLayer").length;
      curLevelIndex = $(".currentLevel").index();
      currentSection = $(".currentLevel .currentSection");
      curSectionIndex = $(".currentLevel .currentSection").index();
      parallaxContainer = $(".parallax-container.currentLevel");
      paraSectionsCount = $(".currentLevel .para-section").length;
      scrollIndexMax = -100 * (paraSectionsCount - 1);

      //let thisIndex;
      let scrollTrace;

      console.log("deltaY:", Math.abs(e.originalEvent.deltaY), "deltaX:", Math.abs(e.originalEvent.deltaX));
      if (Math.abs(e.originalEvent.deltaY) + Math.abs(e.originalEvent.deltaX) < 5) return;

      if (y < 0 || x < 0) {
        scrollIndex++;
        if (scrollIndex > 0 && !$(parallaxContainer).prev().length) {
          scrollIndex = 0;
        }
        if (y < 1 && triggers > triggersLimit) {
          
          console.log("triggers limit, function LEFT fired -------------");
          triggers = 0;
          if ($(currentSection).prev().length) {
            ignoreEvents = true;
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
            setTimeout(ignoreEventsTimeout, ignoreTime);
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
            ignoreEvents = true;
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
            setTimeout(ignoreEventsTimeout, ignoreTime);

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
      // if (scrollIndex < scrollIndexMax) {
      //   scrollIndex = scrollIndexMax;
      //   scrollTrace = scrollIndexMax * 10;
      // }
      if (scrollIndex < scrollIndexMax && $(parallaxContainer).next().length) {
        ignoreEvents = true;
        var nextLevel = $(currentLevel).next();
        $(currentLevel).removeClass("currentLevel");
        $(nextLevel).addClass("currentLevel");
        $(".currentLevel").css("transform", "translateY(0px)");
        scrollIndex = 0;
        $(currentSection).removeClass("currentSection");
        $(".currentLevel .para-section:first").addClass("currentSection");
        setTimeout(ignoreEventsTimeout, ignoreTime);
      }
      if (scrollIndex > 0 && $(parallaxContainer).prev().length) {
        ignoreEvents = true;
        var prevLevel = $(currentLevel).prev();
        $(currentLevel).removeClass("currentLevel");
        $(prevLevel).addClass("currentLevel");
        $(".currentLevel").css("transform", "translateY(0px)");
        scrollIndex = scrollIndexMax;
        $(currentSection).removeClass("currentSection");
        $(".currentLevel .para-section:last").addClass("currentSection");
        setTimeout(ignoreEventsTimeout, ignoreTime);
      }


      console.log("triggers:", triggers, "scrollIndex:", scrollIndex, "scrollTrace:", scrollTrace);
    }
    console.log("ignoreEventsStatus:", ignoreEvents);
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

