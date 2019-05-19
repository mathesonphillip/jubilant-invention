/* eslint-disable */
/*! jQuery v3.2.1 | (c) JS Foundation and other contributors | jquery.org/license */
function beginPinch(e) {
  // console.log("TCL: beginPinch -> e", e);
  pinch_scale = currentPos.scale;
  e.preventDefault();
}

function doPinch(e) {
  // console.log("TCL: doPinch -> e", e);
  zoomOnPointWithScale(
    viewport.width / 2,
    viewport.height / 2,
    pinch_scale * e.originalEvent.scale
  );
  e.preventDefault();
}

//
function beginDrag(e) {
  // console.log("TCL: beginDrag -> e", e);
  try {
    (last_coord = first_coord = {
      x: e.pageX ? e.pageX : e.touches[0].pageX,
      y: e.pageY ? e.pageY : e.touches[0].pageY
    }),
      (dragging = true),
      e.preventDefault();
  } catch (error) {
    // console.log("TCL: beginDrag -> error", error);
  }
}

// FIX: Bug in here with drag functions
//TCL: doDrag -> error TypeError: Cannot read property '0' of undefined
// Seems like function trieds to center screen again.
// Poorly implemented
function doDrag(e) {
  if (dragging) {
    try {
      // Dont understand
      let t = {
        x: e.pageX ? e.pageX : e.touches[0].pageX,
        y: e.pageY ? e.pageY : e.touches[0].pageY
      };
      // Dont understand
      let n = {
        x: t.x - last_coord.x,
        y: t.y - last_coord.y
      };
      // Dont understand
      (last_coord = t),
        (Math.abs(first_coord.x - t.x) > 2 ||
          Math.abs(first_coord.y - t.y) > 2) &&
          (currentPos.nohide = true),
        (currentPos.x += n.x),
        (currentPos.y += n.y);

      //TODO: Rename Vars
      let screenWidth = viewport.width;
      let screenHeight = viewport.height;
      let zoomScale = currentPos.scale;
      let imageWidth = currentPos.swidth;
      let imageHeight = currentPos.sheight;
      let popupPos = $("#popup").position();

      let imageOffset = {
        x: currentPos.x,
        y: currentPos.y
      };

      //update location of popup
      $("#popup").css({ left: popupPos.left + n.x, top: popupPos.top + n.y });

      // Update location of svg
      $(svg).css({ left: imageOffset.x, top: imageOffset.y });
      e.preventDefault();
    } catch (error) {
      console.error(error);
    }
  }
}

function endDrag(e) {
  // console.log("TCL: endDrag -> e", e);
  dragging = false;
  if (!currentPos.nohide) {
    $("#popup").hide();
  }
  currentPos.nohide = false;
}

function doWheel(e) {
  // if (dragging) return false;
  var t = 0;
  e.originalEvent.deltaY
    ? (t = -e.originalEvent.deltaY)
    : e.originalEvent.wheelDelta && (t = -e.originalEvent.wheelDelta),
    t > 1 ? (t = 1) : t < -1 && (t = -1);
  var n = currentPos.scale + (currentPos.scale * t) / 20;
  zoomOnPointWithScale(e.pageX, e.pageY, n), e.preventDefault();
}

function zoomOnPoint(e) {
  var t = currentPos.scale + 1;
  zoomOnPointWithScale(e.pageX, e.pageY, t);
}

function zoomOnPointWithScale(e, t, n) {
  // console.log("zoomScale:", currentPos.scale);
  n < currentPos.min_scale && (n = currentPos.min_scale),
    n > currentPos.max_scale && (n = currentPos.max_scale);
  var o = e - ((e - currentPos.x) / currentPos.scale) * n,
    r = t - ((t - currentPos.y) / currentPos.scale) * n;
  (currentPos.scale = n),
    (currentPos.x = o),
    (currentPos.y = r),
    svg.css({
      left: currentPos.x,
      top: currentPos.y,
      width: n * currentPos.swidth,
      height: n * currentPos.sheight
    });
}

function renderCard(card) {
  console.log("TCL: renderCard -> card", card);
  let t = $("#popup");
  t.html("");
  t.append($("<h3>" + card.title + "</h3>"));
  t.append(
    $(
      "<div class=status>" +
        card.status +
        (card.estimate ? " - " + card.estimate : "") +
        "</div>"
    )
  );
  t.append($("<div class=desc>" + card.desc + "</div>"));
}

function getCard(cards, e) {
  console.log("TCL: getCard");
  for (let index = 0; index < cards.length; index++) {
    const element = cards[index];
    try {
      console.error(e);

      if (e.toLowerCase() == element.id.toLowerCase()) {
        console.log("TCL: getCard -> element", element);
        return element;
      }
    } catch (error) {
      console.error(error);
    }
  }
}

let svg = null;
let currentPos = {
  x: 0,
  y: 0,
  scale: 0,
  swidth: 0,
  sheight: 0,
  min_scale: 0.5,
  max_scale: 50,
  nohide: false
};

let viewport = { width: 0, height: 0 };
// TODO: Need to remove this var. Yuk
let dragging = false;
let last_coord = { x: 0, y: 0 };
let first_coord = { x: 0, y: 0 };
let pinch_scale = 1;

// ###################################################################
// ###################################################################
// ###################################################################
// ###################################################################

export function main(items) {
  const cards = items.items;
  var viewer = $("#viewer");
  svg = $("svg");

  // extract width and heigh from SVG
  let [t, n, width, height] = svg.attr("viewBox").split(" ");
  currentPos.swidth = width;
  currentPos.sheight = height;

  // extract width and heigh from wrapper
  viewport.width = viewer.width();
  viewport.height = viewer.height();

  let i = viewport.height / 2;
  let a = i / 600;
  currentPos.scale = a;

  let s = viewport.width / currentPos.swidth;
  let u = viewport.height / currentPos.sheight;

  // Logic here to best fit display to screen
  // TODO: fix names
  // if (s < u) {
  //   currentPos.min_scale = s;
  // } else {
  //   currentPos.min_scale = u;
  // }
  currentPos.min_scale = currentPos.min_scale / 2;
  // console.log("TCL: main -> currentPos.min_scale", currentPos.min_scale);

  currentPos.x = (viewport.width - a * width) / 2;
  svg.css("left", currentPos.x);
  // console.log("TCL: main -> currentPos.x", currentPos.x);
  svg.css("width", a * width);
  // console.log("TCL: main -> a * width", a * width);
  svg.css("height", a * height);
  // console.log("TCL: main -> a * height", a * height);

  viewer.on("mouseup touchend", endDrag);
  viewer.on("mousemove touchmove", doDrag);

  viewer.on("mousedown touchstart", beginDrag);
  viewer.on("dblclick", zoomOnPoint);
  viewer.on("gesturestart", beginPinch);
  viewer.on("gesturechange", doPinch);
  viewer.on("wheel", doWheel);

  //TODO: Need to fix the logging around clicking on an svg element and checking for id
  $("path").on("click", function(event) {
    let id = $(this).attr("id");
    console.log("TCL: main -> id", id);

    event.preventDefault();
    event.stopPropagation();

    //No idea what this is...
    var t = {
      x: last_coord.x - first_coord.x,
      y: last_coord.y - first_coord.y
    };

    if (id) {
      if (!(Math.abs(t.x) > 2 || Math.abs(t.y) > 2)) {
        let card = getCard(cards, id);
        if (card != null) {
          renderCard(card);
          $("#popup")
            .css({ left: last_coord.x - 10, top: last_coord.y - 180 })
            .show();
        } else {
          console.log("No card for this click");
        }
      }
    }
  });

  //TODO: Work on how to better implement
  $("svg .feature").on("click", function(event) {
    let id = $(this).attr("id");
    console.log("TCL: main -> id", id);

    event.preventDefault();
    event.stopPropagation();

    //No idea what this is...
    var t = {
      x: last_coord.x - first_coord.x,
      y: last_coord.y - first_coord.y
    };

    if (id) {
      if (!(Math.abs(t.x) > 2 || Math.abs(t.y) > 2)) {
        let card = getCard(cards, id);
        if (card != null) {
          renderCard(card);
          $("#popup")
            .css({ left: last_coord.x - 10, top: last_coord.y - 180 })
            .show();
        } else {
          console.log("No card for this click");
        }
      }
    }
  });
}
