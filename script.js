jQuery(document).on('readystatechange', function () {
  if (document.readyState !== "complete") {
    console.log("readystate:", document.readyState)
    $("#loader").css("opacity", "1");
  } else {
    console.log("readystate:", document.readyState)
    $("#loader").animate({ "opacity": 0 }, 500);
    setTimeout(removeLoader, 1000);
  }
});

function removeLoader() {
  $("#loader").css("display", "none");
}

jQuery(document).ready(function ($) {

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
  let scrollTrace;

  getWindowSize();

  function getWindowSize() {
    vHeight = document.documentElement.clientHeight;
    document.documentElement.style.setProperty("--vHeight", `${vHeight}px`);
    vWidth = document.documentElement.clientWidth;
    document.documentElement.style.setProperty("--vWidth", `${vWidth}px`);

    paraSectionsCount = $(".currentLevel .para-section").length;
    scrollIndexMax = -100 * (paraSectionsCount - 1);

    // set parallax layers width:
    $(prlxLayers).each(function () {
      thisIndex = $(this).index();
      $(this).css("width", (thisIndex + 1) * vWidth + (thisIndex * vWidth) + "px");
    })

    setParalaxContainerPosition();

    // count moveUnits for fitting sections in viewport:
    moveUnit = vWidth / prlxLayersCount;
    centUnit = vWidth / 100;
  }


  // fired wheel/touchmove or swipe events counter
  var triggers = 0;
  var triggersLimit = 9; //scroll distance to push slide


  //event throttling while slide animation
  var ignoreEvents = false;
  var ignoreTime = 1500; // time to wait
  function ignoreEventsTimeout() {
    ignoreEvents = false;
    console.log("ignoreEventsStatus:", ignoreEvents);
  }

  function setParalaxContainerPosition() {
    let levelMoveSpeed = 500; // duration of vertical level switch animation
    curParConIndex = $(".currentLevel").index();

    $(".parallax-container").each(function () {
      thisIndex = $(this).index();
      if (thisIndex > curParConIndex) {
        $(this).animate({ "top": vHeight + "px" }, levelMoveSpeed);
      }
      if (thisIndex === curParConIndex) {
        $(this).animate({ "top": 0 + "px" }, levelMoveSpeed);
      }
      if (thisIndex < curParConIndex) {
        $(this).animate({ "top": -vHeight + "px" }, levelMoveSpeed);
      }
    })
    paraSectionsCount = $(".currentLevel .para-section").length;
    scrollIndexMax = -100 * (paraSectionsCount - 1);
    contentLayerIndex = $(".currentLevel #contentLayer").index();
    prlxRatio = 1 / contentLayerIndex;

  }

  //move sections left/right/home
  function sectionMove(current, direction) {
    currentSection = $(".currentLevel .currentSection");
    curSectionIndex = $(".currentLevel .currentSection").index();
    var curPrlxLayers = $(".currentLevel .prlxLayer");

    if (direction === "left") {
      var nextSection = $(currentSection).next();
      scrollTrace = -vWidth * (curSectionIndex + 1);
      $(curPrlxLayers).each(function () {
        thisIndex = $(this).index();
        $(this).css("transform", "translateX(" + (scrollTrace * (thisIndex) * prlxRatio) + "px)");
      });
      scrollIndex = -100 * (curSectionIndex + 1);
      $(currentSection).removeClass("currentSection");
      $(nextSection).addClass("currentSection");
    }
    if (direction === "right") {
      var prevSection = $(currentSection).prev();
      scrollTrace = -vWidth * (curSectionIndex - 1);
      $(curPrlxLayers).each(function () {
        thisIndex = $(this).index();
        $(this).css("transform", "translateX(" + (scrollTrace * (thisIndex) * prlxRatio) + "px)");
      });
      scrollIndex = -100 * (curSectionIndex - 1);
      $(currentSection).removeClass("currentSection");
      $(prevSection).addClass("currentSection");
    }
    if (direction === "home") {
      //prlxLayers = $(".currentLevel .prlxLayer");
      scrollTrace = 0;
      $(curPrlxLayers).each(function () {
        thisIndex = $(this).index();
        $(this).css("transform", "translateX(0px)");
      });
      scrollIndex = 0;
      $(".currentSection").removeClass("currentSection");
      $(".currentLevel .para-section:first").addClass("currentSection");
    }
    if ($(".parallax-container:first .para-section:first").hasClass("currentSection")) {
      $(".site-branding").css("transform", "scale(0)");
    } else {
      $(".site-branding").css("transform", "scale(1)");
    }
    triggers = 0;
    setTimeout(ignoreEventsTimeout, ignoreTime);

    console.log('sectionMove:', direction, 'curLevel:', $(".currentLevel").index(), 'curSection:', $(".currentSection").index(), "scrollTrace", scrollTrace);
    console.log("triggers:", triggers, "scrollIndex:", scrollIndex, "scrollIndexMax:", scrollIndexMax, "scrollTrace:", scrollTrace);
  };


  //move levels up/down
  function levelMove(current, direction) {
    currentSection = $(".currentLevel .currentSection");
    currentLevel = $(".currentLevel");
    ignoreEvents = true;
    if (direction === "up") {
      var nextLevel = $(currentLevel).next();
      $(currentLevel).removeClass("currentLevel");
      $(nextLevel).addClass("currentLevel");
      setParalaxContainerPosition();
      $(currentSection).removeClass("currentSection");
      $(".currentLevel .para-section:first").addClass("currentSection");
      scrollIndex = 0;
      scrollTrace = 0;
      $(".currentLevel .prlxLayer").each(function () {
        $(this).css("transform", "translateX(0px)");
      })
    }
    if (direction === "down") {
      var prevLevel = $(currentLevel).prev();
      $(currentLevel).removeClass("currentLevel");
      $(prevLevel).addClass("currentLevel");
      setParalaxContainerPosition();
      $(currentSection).removeClass("currentSection");
      $(".currentLevel .para-section:last").addClass("currentSection");
      scrollIndex = scrollIndexMax;
      curSectionIndex = $(".currentLevel .currentSection").index();
      scrollTrace = -vWidth * (curSectionIndex);
      $(prlxLayers).each(function () {
        thisIndex = $(this).index();
        $(this).css("transform", "translateX(" + (scrollTrace * (thisIndex) * prlxRatio) + "px)");
      });
    }
    triggers = 0;
    setTimeout(ignoreEventsTimeout, ignoreTime);

    console.log('levelMove:', direction, 'curLevel:', $(".currentLevel").index(), 'curSection:', $(".currentSection").index(), "scrollTrace", scrollTrace);
    console.log("triggers:", triggers, "scrollIndex:", scrollIndex, "scrollIndexMax:", scrollIndexMax, "scrollTrace:", scrollTrace);
  };



  $(document).on("wheel", function (e) {

    if (ignoreEvents === true) {
      return;
    }

    ++triggers;

    const y = e.originalEvent.deltaY;
    const x = e.originalEvent.deltaX;

    //prlxLayers = $(".currentLevel .prlxLayer");
    prlxLayersCount = $(".currentLevel .prlxLayer").length;
    curLevelIndex = $(".currentLevel").index();
    parallaxContainer = $(".parallax-container.currentLevel");
    paraSectionsCount = $(".currentLevel .para-section").length;
    scrollIndexMax = -100 * (paraSectionsCount - 1);
    //console.log("paraSectionsCount:", paraSectionsCount);


    //throttle inertia scrolls:
    //console.log("deltaY:", Math.abs(e.originalEvent.deltaY), "deltaX:", Math.abs(e.originalEvent.deltaX));
    if (Math.abs(e.originalEvent.deltaY) + Math.abs(e.originalEvent.deltaX) < 2) return;

    if (y < 0 || x < 0) {
      scrollIndex++;  //scroll Up or Left
      if (scrollIndex > 0 && !$(parallaxContainer).prev().length) {
        console.log("no previous LEVELS");
      }
      if (triggers > triggersLimit) {
        ignoreEvents = true;
        triggers = 0;
        if ($(".currentSection").prev().length) {
          sectionMove($(".currentSection"), "right");
        }
      }
      if (scrollIndex > 0 && $(parallaxContainer).prev().length) {
        levelMove($(".currentLevel"), "down");
      }
      if (scrollIndex > 0) {
        scrollIndex = 0;
      }
      setTimeout(ignoreEventsTimeout, ignoreTime);

    }
    if (y > 0 || x > 0) {
      scrollIndex--; //scroll Down or Right
      if (triggers > triggersLimit && $(".currentSection").next().length) {
        ignoreEvents = true;
        sectionMove($(".currentSection"), "left");
        setTimeout(ignoreEventsTimeout, ignoreTime);
      }
      if (scrollIndex < scrollIndexMax && $(parallaxContainer).next().length) {
        ignoreEvents = true;
        levelMove($(".currentLevel"), "up");
        setTimeout(ignoreEventsTimeout, ignoreTime);
      }
    }

    if (0 > scrollIndex && scrollIndex > scrollIndexMax) {
      scrollTrace = scrollIndex * centUnit;
      $(prlxLayers).each(function () {
        thisIndex = $(this).index();
        $(this).css("transform", "translateX(" + (scrollTrace * thisIndex * prlxRatio) + "px)");
      });
    }

    console.log("triggers:", triggers, "scrollIndex:", scrollIndex, "scrollIndexMax:", scrollIndexMax, "scrollTrace:", scrollTrace);
  });




  // ********  TOUCHscreen  **************************************

  const scene = document.querySelector(".scene");
  var dragYstart,
    dragXstart,
    dragYcurrent,
    dragXcurrent,
    dragYstop,
    dragXstop,
    dragYoffset,
    dragXoffset,
    curLevelPosition,
    curSectionPosition = 0,
    dragY = 0,
    dragX = 0,
    isDragging = false,
    draggingY = 0,
    draggingX = 0,
    dragYlock = false,
    dragXlock = false,
    dragTrigger = 15; // dragging distance to trigger move function

  document.addEventListener("pointerdown", pointerDown);
  document.addEventListener("pointerup", pointerUp);
  document.addEventListener("pointercancel", pointerUp);
  document.addEventListener("pointerleave", pointerUp);
  document.addEventListener("pointerout", pointerUp);

  function pointerDown(e) {
    dragYstart = e.clientY;
    dragXstart = e.clientX;
    curLevelPosition = ($(".currentLevel").index()) * vHeight;
    curSectionPosition = ($(".currentLevel .currentSection").index()) * vWidth;
    isDragging = true;
    document.addEventListener("pointermove", pointerMove);
    console.log("dragXstart:",dragXstart,"\ndragYstart:",dragYstart);
  }

  function pointerMove(e) {
    dragYcurrent = e.clientY;
    dragXcurrent = e.clientX;
    if (isDragging = true) {
      XorYdrag();
      scene.classList.add("grabbing");
    }
  }

  function pointerUp(e) {
    
    dragYstop = e.clientY;
    dragYoffset = dragYstart - dragYstop;
    dragXstop = e.clientX;
    dragXoffset = dragXstart - dragXstop;

    //dragging prevents firing on click
    if (dragX > dragTrigger || dragY > dragTrigger) {
      if ($(".currentLevel .currentSection").prev().length) {
        sectionMove($(".currentSection"), "right");
      }
      else if (!$(".currentLevel .currentSection").prev().length && $(".currentLevel").prev().length) {
        levelMove($(".currentLevel"), "down");
        scrollIndex = scrollIndexMax;
      }
    }

    if (dragX < -dragTrigger || dragY < -dragTrigger) {
      if ($(".currentLevel .currentSection").next().length) {
        sectionMove($(".currentSection"), "left");
      }
      else if (!$(".currentLevel .currentSection").next().length && $(".currentLevel").next().length) {
        levelMove($(".currentLevel"), "up");
        scrollIndex = 0;
      }
    }

    isDragging = false;
    dragYlock = false;
    dragXlock = false;

    document.removeEventListener("pointermove", pointerMove);
    scene.classList.remove("grabbing");

    console.log("dragXstop:",dragXstop,"\ndragYstop:",dragYstop);
    console.log("dragX:", dragX, "dragXoffset:", dragXoffset, "\ndragY:", dragY, "dragYoffset:", dragYoffset);

    dragX = 0;
    dragXoffset = 0;
    dragY = 0;
    dragYoffset = 0;

  }

  //dragging in one axis at a time
  function XorYdrag() {
    if (ignoreEvents === true) {
      return;
    }
    draggingY = Math.abs(dragYcurrent - dragYstart);
    draggingX = Math.abs(dragXcurrent - dragXstart);
    if (draggingY > dragTrigger && dragXlock === false) {
      dragYlock = true;
      dragYPosition();
    }
    else if (draggingX > dragTrigger && dragYlock === false) {
      dragXlock = true;
      dragXPosition()
    }
  }

  function dragYPosition() {
    dragY = dragYcurrent - dragYstart;
    if (dragY > 0) {
      if (!$(".currentLevel").prev().length && $(".para-section:first").hasClass("currentSection")) {
        console.log("nothing before this..");
        return;
      }
      else if (!$(".currentLevel .currentSection").prev().length) {
        console.log("no dragging this to right");
        return;
      }
    }

    // prevent dragging right if last section
    if (!$(".currentLevel .currentSection").next().length && !$(".currentLevel").next().length) {
      console.log("nothing after this..");
      return;
    }

    $(prlxLayers).each(function () {
      thisIndex = $(this).index();
      $(this).css("transform", "translateX(" + ((-curSectionPosition + dragY) * thisIndex * prlxRatio) + "px)");
    });

    console.log("draggingY:", draggingY);
  }

  function dragXPosition() {
    dragX = dragXcurrent - dragXstart;
    // prevent dragging left if first section
    if (dragX > 0) {
      if (!$(".currentLevel").prev().length && $(".para-section:first").hasClass("currentSection")) {
        console.log("nothing before this..");
        return;
      }
      else if (!$(".currentLevel .currentSection").prev().length) {
        console.log("no dragging this to right");
        return;
      }
    }

    // prevent dragging right if last section
    if (!$(".currentLevel .currentSection").next().length && !$(".currentLevel").next().length) {
      console.log("nothing after this..");
      //return;
    }

    $(prlxLayers).each(function () {
      thisIndex = $(this).index();
      $(this).css("transform", "translateX(" + ((-curSectionPosition + dragX) * thisIndex * prlxRatio) + "px)");
    });

    console.log("draggingX:", draggingX);
  }

  // *************************************************************

  //custom cursor: 
  var cursor = $(".cursor");
  $("html, *").css("cursor", "none");

  $(window).mousemove(function (e) {
    cursor.css({
      top: e.clientY - cursor.height() / 8,
      left: e.clientX - cursor.width() / 8
    });
  });

  $(window)
    .mouseleave(function () {
      cursor.css({
        opacity: "0"
      });
    })
    .mouseenter(function () {
      cursor.css({
        opacity: "1"
      });
    });

  $("a, button")
    .mouseenter(function () {
      cursor.css(
        "background-image", "url(https://magic.sernato.sk/wp-content/uploads/2024/06/cursor2.png)"
      );
    })
    .mouseleave(function () {
      cursor.css(
        "background-image", "url(https://magic.sernato.sk/wp-content/uploads/2024/06/cursor1.png)"
      );
    });

  // assign ID to levels:
  $(".parallax-container").each(function () {
    var thisIndex = $(this).index();
    $(this).attr('id', ('level' + (thisIndex + 1)));
  });


  // navigation links:
  $(".navLink").each(function () {
    $(this).on("click", function () {

      let link = $(this).attr("href");
      let thisLevel = $(link);
      $(".currentLevel").removeClass("currentLevel");
      $(thisLevel).addClass("currentLevel");
      //go to first section:

      setParalaxContainerPosition();
      sectionMove($(".currentSection"), "home");
    })
  })



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
    });
    scrollIndex = -100 * (curSectionIndex - 1);
  };

})

