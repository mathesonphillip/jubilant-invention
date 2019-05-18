/*! jQuery v3.2.1 | (c) JS Foundation and other contributors | jquery.org/license */
function beginPinch(e) {
  (pinch_scale = cpos.scale), e.preventDefault();
}
function doPinch(e) {
  zoomOnPointWithScale(
    viewport.width / 2,
    viewport.height / 2,
    pinch_scale * e.originalEvent.scale
  ),
    e.preventDefault();
}
function beginDrag(e) {
  (last_coord = first_coord = {
    x: e.pageX ? e.pageX : e.touches[0].pageX,
    y: e.pageY ? e.pageY : e.touches[0].pageY
  }),
    (dragging = !0),
    e.preventDefault();
}
function doDrag(e) {
  if (dragging) {
    var t = {
        x: e.pageX ? e.pageX : e.touches[0].pageX,
        y: e.pageY ? e.pageY : e.touches[0].pageY
      },
      n = { x: t.x - last_coord.x, y: t.y - last_coord.y };
    (last_coord = t),
      (Math.abs(first_coord.x - t.x) > 2 ||
        Math.abs(first_coord.y - t.y) > 2) &&
        (cpos.nohide = !0),
      (cpos.x += n.x),
      (cpos.y += n.y);
    var o = $("#popup").position();
    return (
      $("#popup").css({ left: o.left + n.x, top: o.top + n.y }),
      cpos.swidth * cpos.scale > viewport.width
        ? (cpos.x > 0 && (cpos.x = 0),
          cpos.x + cpos.swidth * cpos.scale < viewport.width &&
            (cpos.x = viewport.width - cpos.swidth * cpos.scale))
        : (cpos.x < 0 && (cpos.x = 0),
          cpos.x + cpos.swidth * cpos.scale > viewport.width &&
            (cpos.x = viewport.width - cpos.swidth * cpos.scale)),
      cpos.sheight * cpos.scale > viewport.height
        ? (cpos.y > 0 && (cpos.y = 0),
          cpos.y + cpos.sheight * cpos.scale < viewport.height &&
            (cpos.y = viewport.height - cpos.sheight * cpos.scale))
        : (cpos.y < 0 && (cpos.y = 0),
          cpos.y + cpos.sheight * cpos.scale > viewport.height &&
            (cpos.y = viewport.height - cpos.sheight * cpos.scale)),
      $(svg).css({ left: cpos.x, top: cpos.y }),
      e.preventDefault(),
      !1
    );
  }
}
function endDrag() {
  (dragging = !1), cpos.nohide || $("#popup").hide(), (cpos.nohide = !1);
}
function doWheel(e) {
  if (dragging) return !1;
  var t = 0;
  e.originalEvent.deltaY
    ? (t = -e.originalEvent.deltaY)
    : e.originalEvent.wheelDelta && (t = -e.originalEvent.wheelDelta),
    t > 1 ? (t = 1) : t < -1 && (t = -1);
  var n = cpos.scale + (cpos.scale * t) / 20;
  zoomOnPointWithScale(e.pageX, e.pageY, n), e.preventDefault();
}
function zoomOnPoint(e) {
  var t = cpos.scale + 1;
  zoomOnPointWithScale(e.pageX, e.pageY, t);
}
function zoomOnCenter() {
  var e = parseFloat($(this).val());
  zoomOnPointWithScale(viewport.width / 2, viewport.height / 2, e);
}
function zoomOnPointWithScale(e, t, n) {
  n < cpos.min_scale && (n = cpos.min_scale),
    n > cpos.max_scale && (n = cpos.max_scale);
  var o = e - ((e - cpos.x) / cpos.scale) * n,
    r = t - ((t - cpos.y) / cpos.scale) * n;
  (cpos.scale = n),
    (cpos.x = o),
    (cpos.y = r),
    svg.css({
      left: cpos.x,
      top: cpos.y,
      width: n * cpos.swidth,
      height: n * cpos.sheight
    });
}
function renderNotes() {
  $("#released").append(
    $("<div class='control close'></div><h1>Release Notes</h1>")
  );
  for (var e = 0; e < releases.length; e++) {
    var t = releases[e],
      n = $("<div class=release></div>");
    n.append(
      $(
        "<div class=version>" +
          (t.version ? "v" + t.version + " | " : "") +
          t.type +
          "</div>"
      )
    ),
      n.append($("<h2>" + t.date + "</h2>")),
      n.append($("<div class=desc>" + t.notes + "</div>")),
      $("#released").append(n);
  }
}
function renderCalendar() {
  $("#calendar").append(
    $("<div class='control close'></div><h1>Delivery Plan</h1>")
  );
  for (var e = [], t = [], n = 0; n < cards.length; n++) {
    var o = cards[n];
    "in development" == o.status && e.push(o),
      "planned" == o.status && t.push(o);
  }
  if (
    (e.sort(function(e, t) {
      return e.estimate < t.estimate ? -1 : e.estimate > t.estimate ? 1 : 0;
    }),
    t.sort(function(e, t) {
      return e.estimate && t.estimate
        ? e.estimate < t.estimate
          ? -1
          : e.estimate > t.estimate
          ? 1
          : 0
        : 0;
    }),
    e.length > 0)
  ) {
    $("#calendar").append("<h2>In Progress</h2>");
    for (var n = 0; n < e.length; n++) {
      var o = e[n],
        r = $("<div class=feature></div>");
      r.append("<h3>" + o.title + "</h3>"),
        r.append("<div class=estimate>" + o.desc + "</div>"),
        $("#calendar").append(r);
    }
  }
  if (e.length > 0)
    for (var i = null, n = 0; n < t.length; n++) {
      var o = t[n];
      if (o.estimate) {
        (null != i && i == o.estimate) ||
          ((i = o.estimate),
          $("#calendar").append("<h2>planned " + quarterly(i) + "</h2>"));
        var r = $("<div class=feature></div>");
        r.append("<h3>" + o.title + "</h3>"),
          r.append("<div class=estimate>" + o.desc + "</div>"),
          $("#calendar").append(r);
      }
    }
}
function quarterly(e) {
  var t = ["", "1st", "2nd", "3rd", "4th"],
    n = e.toLowerCase().split("q");
  return t[n[1]] + " qtr " + n[0];
}
function renderCard(e) {
  var t = $("#popup");
  t.html(""),
    t.append($("<h3>" + e.title + "</h3>")),
    t.append(
      $(
        "<div class=status>" +
          e.status +
          (e.estimate ? " - " + e.estimate : "") +
          "</div>"
      )
    ),
    t.append($("<div class=desc>" + e.desc + "</div>"));
}
function getCard(e) {
  for (var t = 0; t < cards.length; t++)
    if (e.toLowerCase() == cards[t].id.toLowerCase()) return cards[t];
}
!(function(e, t) {
  "use strict";
  "object" == typeof module && "object" == typeof module.exports
    ? (module.exports = e.document
        ? t(e, !0)
        : function(e) {
            if (!e.document)
              throw new Error("jQuery requires a window with a document");
            return t(e);
          })
    : t(e);
})("undefined" != typeof window ? window : this, function(e, t) {
  "use strict";
  function n(e, t) {
    t = t || ne;
    var n = t.createElement("script");
    (n.text = e), t.head.appendChild(n).parentNode.removeChild(n);
  }
  function o(e) {
    var t = !!e && "length" in e && e.length,
      n = ye.type(e);
    return (
      "function" !== n &&
      !ye.isWindow(e) &&
      ("array" === n ||
        0 === t ||
        ("number" == typeof t && t > 0 && t - 1 in e))
    );
  }
  function r(e, t) {
    return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase();
  }
  function i(e, t, n) {
    return ye.isFunction(t)
      ? ye.grep(e, function(e, o) {
          return !!t.call(e, o, e) !== n;
        })
      : t.nodeType
      ? ye.grep(e, function(e) {
          return (e === t) !== n;
        })
      : "string" != typeof t
      ? ye.grep(e, function(e) {
          return se.call(t, e) > -1 !== n;
        })
      : Ce.test(t)
      ? ye.filter(t, e, n)
      : ((t = ye.filter(t, e)),
        ye.grep(e, function(e) {
          return se.call(t, e) > -1 !== n && 1 === e.nodeType;
        }));
  }
  function a(e, t) {
    for (; (e = e[t]) && 1 !== e.nodeType; );
    return e;
  }
  function s(e) {
    var t = {};
    return (
      ye.each(e.match(Ne) || [], function(e, n) {
        t[n] = !0;
      }),
      t
    );
  }
  function u(e) {
    return e;
  }
  function c(e) {
    throw e;
  }
  function l(e, t, n, o) {
    var r;
    try {
      e && ye.isFunction((r = e.promise))
        ? r
            .call(e)
            .done(t)
            .fail(n)
        : e && ye.isFunction((r = e.then))
        ? r.call(e, t, n)
        : t.apply(void 0, [e].slice(o));
    } catch (e) {
      n.apply(void 0, [e]);
    }
  }
  function d() {
    ne.removeEventListener("DOMContentLoaded", d),
      e.removeEventListener("load", d),
      ye.ready();
  }
  function p() {
    this.expando = ye.expando + p.uid++;
  }
  function h(e) {
    return (
      "true" === e ||
      ("false" !== e &&
        ("null" === e
          ? null
          : e === +e + ""
          ? +e
          : Ie.test(e)
          ? JSON.parse(e)
          : e))
    );
  }
  function f(e, t, n) {
    var o;
    if (void 0 === n && 1 === e.nodeType)
      if (
        ((o = "data-" + t.replace(Fe, "-$&").toLowerCase()),
        "string" == typeof (n = e.getAttribute(o)))
      ) {
        try {
          n = h(n);
        } catch (e) {}
        Oe.set(e, t, n);
      } else n = void 0;
    return n;
  }
  function y(e, t, n, o) {
    var r,
      i = 1,
      a = 20,
      s = o
        ? function() {
            return o.cur();
          }
        : function() {
            return ye.css(e, t, "");
          },
      u = s(),
      c = (n && n[3]) || (ye.cssNumber[t] ? "" : "px"),
      l = (ye.cssNumber[t] || ("px" !== c && +u)) && Re.exec(ye.css(e, t));
    if (l && l[3] !== c) {
      (c = c || l[3]), (n = n || []), (l = +u || 1);
      do {
        (i = i || ".5"), (l /= i), ye.style(e, t, l + c);
      } while (i !== (i = s() / u) && 1 !== i && --a);
    }
    return (
      n &&
        ((l = +l || +u || 0),
        (r = n[1] ? l + (n[1] + 1) * n[2] : +n[2]),
        o && ((o.unit = c), (o.start = l), (o.end = r))),
      r
    );
  }
  function g(e) {
    var t,
      n = e.ownerDocument,
      o = e.nodeName,
      r = Be[o];
    return (
      r ||
      ((t = n.body.appendChild(n.createElement(o))),
      (r = ye.css(t, "display")),
      t.parentNode.removeChild(t),
      "none" === r && (r = "block"),
      (Be[o] = r),
      r)
    );
  }
  function m(e, t) {
    for (var n, o, r = [], i = 0, a = e.length; i < a; i++)
      (o = e[i]),
        o.style &&
          ((n = o.style.display),
          t
            ? ("none" === n &&
                ((r[i] = We.get(o, "display") || null),
                r[i] || (o.style.display = "")),
              "" === o.style.display && $e(o) && (r[i] = g(o)))
            : "none" !== n && ((r[i] = "none"), We.set(o, "display", n)));
    for (i = 0; i < a; i++) null != r[i] && (e[i].style.display = r[i]);
    return e;
  }
  function v(e, t) {
    var n;
    return (
      (n =
        "undefined" != typeof e.getElementsByTagName
          ? e.getElementsByTagName(t || "*")
          : "undefined" != typeof e.querySelectorAll
          ? e.querySelectorAll(t || "*")
          : []),
      void 0 === t || (t && r(e, t)) ? ye.merge([e], n) : n
    );
  }
  function b(e, t) {
    for (var n = 0, o = e.length; n < o; n++)
      We.set(e[n], "globalEval", !t || We.get(t[n], "globalEval"));
  }
  function w(e, t, n, o, r) {
    for (
      var i,
        a,
        s,
        u,
        c,
        l,
        d = t.createDocumentFragment(),
        p = [],
        h = 0,
        f = e.length;
      h < f;
      h++
    )
      if ((i = e[h]) || 0 === i)
        if ("object" === ye.type(i)) ye.merge(p, i.nodeType ? [i] : i);
        else if (Ge.test(i)) {
          for (
            a = a || d.appendChild(t.createElement("div")),
              s = (ze.exec(i) || ["", ""])[1].toLowerCase(),
              u = Ve[s] || Ve._default,
              a.innerHTML = u[1] + ye.htmlPrefilter(i) + u[2],
              l = u[0];
            l--;

          )
            a = a.lastChild;
          ye.merge(p, a.childNodes), (a = d.firstChild), (a.textContent = "");
        } else p.push(t.createTextNode(i));
    for (d.textContent = "", h = 0; (i = p[h++]); )
      if (o && ye.inArray(i, o) > -1) r && r.push(i);
      else if (
        ((c = ye.contains(i.ownerDocument, i)),
        (a = v(d.appendChild(i), "script")),
        c && b(a),
        n)
      )
        for (l = 0; (i = a[l++]); ) Xe.test(i.type || "") && n.push(i);
    return d;
  }
  function x() {
    return !0;
  }
  function k() {
    return !1;
  }
  function T() {
    try {
      return ne.activeElement;
    } catch (e) {}
  }
  function A(e, t, n, o, r, i) {
    var a, s;
    if ("object" == typeof t) {
      "string" != typeof n && ((o = o || n), (n = void 0));
      for (s in t) A(e, s, n, o, t[s], i);
      return e;
    }
    if (
      (null == o && null == r
        ? ((r = n), (o = n = void 0))
        : null == r &&
          ("string" == typeof n
            ? ((r = o), (o = void 0))
            : ((r = o), (o = n), (n = void 0))),
      !1 === r)
    )
      r = k;
    else if (!r) return e;
    return (
      1 === i &&
        ((a = r),
        (r = function(e) {
          return ye().off(e), a.apply(this, arguments);
        }),
        (r.guid = a.guid || (a.guid = ye.guid++))),
      e.each(function() {
        ye.event.add(this, t, r, o, n);
      })
    );
  }
  function C(e, t) {
    return r(e, "table") && r(11 !== t.nodeType ? t : t.firstChild, "tr")
      ? ye(">tbody", e)[0] || e
      : e;
  }
  function S(e) {
    return (e.type = (null !== e.getAttribute("type")) + "/" + e.type), e;
  }
  function q(e) {
    var t = ot.exec(e.type);
    return t ? (e.type = t[1]) : e.removeAttribute("type"), e;
  }
  function D(e, t) {
    var n, o, r, i, a, s, u, c;
    if (1 === t.nodeType) {
      if (
        We.hasData(e) &&
        ((i = We.access(e)), (a = We.set(t, i)), (c = i.events))
      ) {
        delete a.handle, (a.events = {});
        for (r in c)
          for (n = 0, o = c[r].length; n < o; n++) ye.event.add(t, r, c[r][n]);
      }
      Oe.hasData(e) &&
        ((s = Oe.access(e)), (u = ye.extend({}, s)), Oe.set(t, u));
    }
  }
  function E(e, t) {
    var n = t.nodeName.toLowerCase();
    "input" === n && Ye.test(e.type)
      ? (t.checked = e.checked)
      : ("input" !== n && "textarea" !== n) ||
        (t.defaultValue = e.defaultValue);
  }
  function N(e, t, o, r) {
    t = ie.apply([], t);
    var i,
      a,
      s,
      u,
      c,
      l,
      d = 0,
      p = e.length,
      h = p - 1,
      f = t[0],
      y = ye.isFunction(f);
    if (y || (p > 1 && "string" == typeof f && !he.checkClone && nt.test(f)))
      return e.each(function(n) {
        var i = e.eq(n);
        y && (t[0] = f.call(this, n, i.html())), N(i, t, o, r);
      });
    if (
      p &&
      ((i = w(t, e[0].ownerDocument, !1, e, r)),
      (a = i.firstChild),
      1 === i.childNodes.length && (i = a),
      a || r)
    ) {
      for (s = ye.map(v(i, "script"), S), u = s.length; d < p; d++)
        (c = i),
          d !== h &&
            ((c = ye.clone(c, !0, !0)), u && ye.merge(s, v(c, "script"))),
          o.call(e[d], c, d);
      if (u)
        for (l = s[s.length - 1].ownerDocument, ye.map(s, q), d = 0; d < u; d++)
          (c = s[d]),
            Xe.test(c.type || "") &&
              !We.access(c, "globalEval") &&
              ye.contains(l, c) &&
              (c.src
                ? ye._evalUrl && ye._evalUrl(c.src)
                : n(c.textContent.replace(rt, ""), l));
    }
    return e;
  }
  function j(e, t, n) {
    for (var o, r = t ? ye.filter(t, e) : e, i = 0; null != (o = r[i]); i++)
      n || 1 !== o.nodeType || ye.cleanData(v(o)),
        o.parentNode &&
          (n && ye.contains(o.ownerDocument, o) && b(v(o, "script")),
          o.parentNode.removeChild(o));
    return e;
  }
  function _(e, t, n) {
    var o,
      r,
      i,
      a,
      s = e.style;
    return (
      (n = n || st(e)),
      n &&
        ((a = n.getPropertyValue(t) || n[t]),
        "" !== a || ye.contains(e.ownerDocument, e) || (a = ye.style(e, t)),
        !he.pixelMarginRight() &&
          at.test(a) &&
          it.test(t) &&
          ((o = s.width),
          (r = s.minWidth),
          (i = s.maxWidth),
          (s.minWidth = s.maxWidth = s.width = a),
          (a = n.width),
          (s.width = o),
          (s.minWidth = r),
          (s.maxWidth = i))),
      void 0 !== a ? a + "" : a
    );
  }
  function P(e, t) {
    return {
      get: function() {
        return e()
          ? void delete this.get
          : (this.get = t).apply(this, arguments);
      }
    };
  }
  function L(e) {
    if (e in ht) return e;
    for (var t = e[0].toUpperCase() + e.slice(1), n = pt.length; n--; )
      if ((e = pt[n] + t) in ht) return e;
  }
  function W(e) {
    var t = ye.cssProps[e];
    return t || (t = ye.cssProps[e] = L(e) || e), t;
  }
  function O(e, t, n) {
    var o = Re.exec(t);
    return o ? Math.max(0, o[2] - (n || 0)) + (o[3] || "px") : t;
  }
  function I(e, t, n, o, r) {
    var i,
      a = 0;
    for (
      i = n === (o ? "border" : "content") ? 4 : "width" === t ? 1 : 0;
      i < 4;
      i += 2
    )
      "margin" === n && (a += ye.css(e, n + Ue[i], !0, r)),
        o
          ? ("content" === n && (a -= ye.css(e, "padding" + Ue[i], !0, r)),
            "margin" !== n &&
              (a -= ye.css(e, "border" + Ue[i] + "Width", !0, r)))
          : ((a += ye.css(e, "padding" + Ue[i], !0, r)),
            "padding" !== n &&
              (a += ye.css(e, "border" + Ue[i] + "Width", !0, r)));
    return a;
  }
  function F(e, t, n) {
    var o,
      r = st(e),
      i = _(e, t, r),
      a = "border-box" === ye.css(e, "boxSizing", !1, r);
    return at.test(i)
      ? i
      : ((o = a && (he.boxSizingReliable() || i === e.style[t])),
        "auto" === i && (i = e["offset" + t[0].toUpperCase() + t.slice(1)]),
        (i = parseFloat(i) || 0) +
          I(e, t, n || (a ? "border" : "content"), o, r) +
          "px");
  }
  function H(e, t, n, o, r) {
    return new H.prototype.init(e, t, n, o, r);
  }
  function R() {
    yt &&
      (!1 === ne.hidden && e.requestAnimationFrame
        ? e.requestAnimationFrame(R)
        : e.setTimeout(R, ye.fx.interval),
      ye.fx.tick());
  }
  function U() {
    return (
      e.setTimeout(function() {
        ft = void 0;
      }),
      (ft = ye.now())
    );
  }
  function $(e, t) {
    var n,
      o = 0,
      r = { height: e };
    for (t = t ? 1 : 0; o < 4; o += 2 - t)
      (n = Ue[o]), (r["margin" + n] = r["padding" + n] = e);
    return t && (r.opacity = r.width = e), r;
  }
  function M(e, t, n) {
    for (
      var o,
        r = (z.tweeners[t] || []).concat(z.tweeners["*"]),
        i = 0,
        a = r.length;
      i < a;
      i++
    )
      if ((o = r[i].call(n, t, e))) return o;
  }
  function B(e, t, n) {
    var o,
      r,
      i,
      a,
      s,
      u,
      c,
      l,
      d = "width" in t || "height" in t,
      p = this,
      h = {},
      f = e.style,
      y = e.nodeType && $e(e),
      g = We.get(e, "fxshow");
    n.queue ||
      ((a = ye._queueHooks(e, "fx")),
      null == a.unqueued &&
        ((a.unqueued = 0),
        (s = a.empty.fire),
        (a.empty.fire = function() {
          a.unqueued || s();
        })),
      a.unqueued++,
      p.always(function() {
        p.always(function() {
          a.unqueued--, ye.queue(e, "fx").length || a.empty.fire();
        });
      }));
    for (o in t)
      if (((r = t[o]), gt.test(r))) {
        if (
          (delete t[o], (i = i || "toggle" === r), r === (y ? "hide" : "show"))
        ) {
          if ("show" !== r || !g || void 0 === g[o]) continue;
          y = !0;
        }
        h[o] = (g && g[o]) || ye.style(e, o);
      }
    if ((u = !ye.isEmptyObject(t)) || !ye.isEmptyObject(h)) {
      d &&
        1 === e.nodeType &&
        ((n.overflow = [f.overflow, f.overflowX, f.overflowY]),
        (c = g && g.display),
        null == c && (c = We.get(e, "display")),
        (l = ye.css(e, "display")),
        "none" === l &&
          (c
            ? (l = c)
            : (m([e], !0),
              (c = e.style.display || c),
              (l = ye.css(e, "display")),
              m([e]))),
        ("inline" === l || ("inline-block" === l && null != c)) &&
          "none" === ye.css(e, "float") &&
          (u ||
            (p.done(function() {
              f.display = c;
            }),
            null == c && ((l = f.display), (c = "none" === l ? "" : l))),
          (f.display = "inline-block"))),
        n.overflow &&
          ((f.overflow = "hidden"),
          p.always(function() {
            (f.overflow = n.overflow[0]),
              (f.overflowX = n.overflow[1]),
              (f.overflowY = n.overflow[2]);
          })),
        (u = !1);
      for (o in h)
        u ||
          (g
            ? "hidden" in g && (y = g.hidden)
            : (g = We.access(e, "fxshow", { display: c })),
          i && (g.hidden = !y),
          y && m([e], !0),
          p.done(function() {
            y || m([e]), We.remove(e, "fxshow");
            for (o in h) ye.style(e, o, h[o]);
          })),
          (u = M(y ? g[o] : 0, o, p)),
          o in g || ((g[o] = u.start), y && ((u.end = u.start), (u.start = 0)));
    }
  }
  function Y(e, t) {
    var n, o, r, i, a;
    for (n in e)
      if (
        ((o = ye.camelCase(n)),
        (r = t[o]),
        (i = e[n]),
        Array.isArray(i) && ((r = i[1]), (i = e[n] = i[0])),
        n !== o && ((e[o] = i), delete e[n]),
        (a = ye.cssHooks[o]) && "expand" in a)
      ) {
        (i = a.expand(i)), delete e[o];
        for (n in i) n in e || ((e[n] = i[n]), (t[n] = r));
      } else t[o] = r;
  }
  function z(e, t, n) {
    var o,
      r,
      i = 0,
      a = z.prefilters.length,
      s = ye.Deferred().always(function() {
        delete u.elem;
      }),
      u = function() {
        if (r) return !1;
        for (
          var t = ft || U(),
            n = Math.max(0, c.startTime + c.duration - t),
            o = n / c.duration || 0,
            i = 1 - o,
            a = 0,
            u = c.tweens.length;
          a < u;
          a++
        )
          c.tweens[a].run(i);
        return (
          s.notifyWith(e, [c, i, n]),
          i < 1 && u
            ? n
            : (u || s.notifyWith(e, [c, 1, 0]), s.resolveWith(e, [c]), !1)
        );
      },
      c = s.promise({
        elem: e,
        props: ye.extend({}, t),
        opts: ye.extend(
          !0,
          { specialEasing: {}, easing: ye.easing._default },
          n
        ),
        originalProperties: t,
        originalOptions: n,
        startTime: ft || U(),
        duration: n.duration,
        tweens: [],
        createTween: function(t, n) {
          var o = ye.Tween(
            e,
            c.opts,
            t,
            n,
            c.opts.specialEasing[t] || c.opts.easing
          );
          return c.tweens.push(o), o;
        },
        stop: function(t) {
          var n = 0,
            o = t ? c.tweens.length : 0;
          if (r) return this;
          for (r = !0; n < o; n++) c.tweens[n].run(1);
          return (
            t
              ? (s.notifyWith(e, [c, 1, 0]), s.resolveWith(e, [c, t]))
              : s.rejectWith(e, [c, t]),
            this
          );
        }
      }),
      l = c.props;
    for (Y(l, c.opts.specialEasing); i < a; i++)
      if ((o = z.prefilters[i].call(c, e, l, c.opts)))
        return (
          ye.isFunction(o.stop) &&
            (ye._queueHooks(c.elem, c.opts.queue).stop = ye.proxy(o.stop, o)),
          o
        );
    return (
      ye.map(l, M, c),
      ye.isFunction(c.opts.start) && c.opts.start.call(e, c),
      c
        .progress(c.opts.progress)
        .done(c.opts.done, c.opts.complete)
        .fail(c.opts.fail)
        .always(c.opts.always),
      ye.fx.timer(ye.extend(u, { elem: e, anim: c, queue: c.opts.queue })),
      c
    );
  }
  function X(e) {
    return (e.match(Ne) || []).join(" ");
  }
  function V(e) {
    return (e.getAttribute && e.getAttribute("class")) || "";
  }
  function G(e, t, n, o) {
    var r;
    if (Array.isArray(t))
      ye.each(t, function(t, r) {
        n || qt.test(e)
          ? o(e, r)
          : G(
              e + "[" + ("object" == typeof r && null != r ? t : "") + "]",
              r,
              n,
              o
            );
      });
    else if (n || "object" !== ye.type(t)) o(e, t);
    else for (r in t) G(e + "[" + r + "]", t[r], n, o);
  }
  function J(e) {
    return function(t, n) {
      "string" != typeof t && ((n = t), (t = "*"));
      var o,
        r = 0,
        i = t.toLowerCase().match(Ne) || [];
      if (ye.isFunction(n))
        for (; (o = i[r++]); )
          "+" === o[0]
            ? ((o = o.slice(1) || "*"), (e[o] = e[o] || []).unshift(n))
            : (e[o] = e[o] || []).push(n);
    };
  }
  function Q(e, t, n, o) {
    function r(s) {
      var u;
      return (
        (i[s] = !0),
        ye.each(e[s] || [], function(e, s) {
          var c = s(t, n, o);
          return "string" != typeof c || a || i[c]
            ? a
              ? !(u = c)
              : void 0
            : (t.dataTypes.unshift(c), r(c), !1);
        }),
        u
      );
    }
    var i = {},
      a = e === Ht;
    return r(t.dataTypes[0]) || (!i["*"] && r("*"));
  }
  function K(e, t) {
    var n,
      o,
      r = ye.ajaxSettings.flatOptions || {};
    for (n in t) void 0 !== t[n] && ((r[n] ? e : o || (o = {}))[n] = t[n]);
    return o && ye.extend(!0, e, o), e;
  }
  function Z(e, t, n) {
    for (var o, r, i, a, s = e.contents, u = e.dataTypes; "*" === u[0]; )
      u.shift(),
        void 0 === o && (o = e.mimeType || t.getResponseHeader("Content-Type"));
    if (o)
      for (r in s)
        if (s[r] && s[r].test(o)) {
          u.unshift(r);
          break;
        }
    if (u[0] in n) i = u[0];
    else {
      for (r in n) {
        if (!u[0] || e.converters[r + " " + u[0]]) {
          i = r;
          break;
        }
        a || (a = r);
      }
      i = i || a;
    }
    if (i) return i !== u[0] && u.unshift(i), n[i];
  }
  function ee(e, t, n, o) {
    var r,
      i,
      a,
      s,
      u,
      c = {},
      l = e.dataTypes.slice();
    if (l[1]) for (a in e.converters) c[a.toLowerCase()] = e.converters[a];
    for (i = l.shift(); i; )
      if (
        (e.responseFields[i] && (n[e.responseFields[i]] = t),
        !u && o && e.dataFilter && (t = e.dataFilter(t, e.dataType)),
        (u = i),
        (i = l.shift()))
      )
        if ("*" === i) i = u;
        else if ("*" !== u && u !== i) {
          if (!(a = c[u + " " + i] || c["* " + i]))
            for (r in c)
              if (
                ((s = r.split(" ")),
                s[1] === i && (a = c[u + " " + s[0]] || c["* " + s[0]]))
              ) {
                !0 === a
                  ? (a = c[r])
                  : !0 !== c[r] && ((i = s[0]), l.unshift(s[1]));
                break;
              }
          if (!0 !== a)
            if (a && e.throws) t = a(t);
            else
              try {
                t = a(t);
              } catch (e) {
                return {
                  state: "parsererror",
                  error: a ? e : "No conversion from " + u + " to " + i
                };
              }
        }
    return { state: "success", data: t };
  }
  var te = [],
    ne = e.document,
    oe = Object.getPrototypeOf,
    re = te.slice,
    ie = te.concat,
    ae = te.push,
    se = te.indexOf,
    ue = {},
    ce = ue.toString,
    le = ue.hasOwnProperty,
    de = le.toString,
    pe = de.call(Object),
    he = {},
    fe = "3.2.1",
    ye = function(e, t) {
      return new ye.fn.init(e, t);
    },
    ge = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
    me = /^-ms-/,
    ve = /-([a-z])/g,
    be = function(e, t) {
      return t.toUpperCase();
    };
  (ye.fn = ye.prototype = {
    jquery: fe,
    constructor: ye,
    length: 0,
    toArray: function() {
      return re.call(this);
    },
    get: function(e) {
      return null == e
        ? re.call(this)
        : e < 0
        ? this[e + this.length]
        : this[e];
    },
    pushStack: function(e) {
      var t = ye.merge(this.constructor(), e);
      return (t.prevObject = this), t;
    },
    each: function(e) {
      return ye.each(this, e);
    },
    map: function(e) {
      return this.pushStack(
        ye.map(this, function(t, n) {
          return e.call(t, n, t);
        })
      );
    },
    slice: function() {
      return this.pushStack(re.apply(this, arguments));
    },
    first: function() {
      return this.eq(0);
    },
    last: function() {
      return this.eq(-1);
    },
    eq: function(e) {
      var t = this.length,
        n = +e + (e < 0 ? t : 0);
      return this.pushStack(n >= 0 && n < t ? [this[n]] : []);
    },
    end: function() {
      return this.prevObject || this.constructor();
    },
    push: ae,
    sort: te.sort,
    splice: te.splice
  }),
    (ye.extend = ye.fn.extend = function() {
      var e,
        t,
        n,
        o,
        r,
        i,
        a = arguments[0] || {},
        s = 1,
        u = arguments.length,
        c = !1;
      for (
        "boolean" == typeof a && ((c = a), (a = arguments[s] || {}), s++),
          "object" == typeof a || ye.isFunction(a) || (a = {}),
          s === u && ((a = this), s--);
        s < u;
        s++
      )
        if (null != (e = arguments[s]))
          for (t in e)
            (n = a[t]),
              (o = e[t]),
              a !== o &&
                (c && o && (ye.isPlainObject(o) || (r = Array.isArray(o)))
                  ? (r
                      ? ((r = !1), (i = n && Array.isArray(n) ? n : []))
                      : (i = n && ye.isPlainObject(n) ? n : {}),
                    (a[t] = ye.extend(c, i, o)))
                  : void 0 !== o && (a[t] = o));
      return a;
    }),
    ye.extend({
      expando: "jQuery" + (fe + Math.random()).replace(/\D/g, ""),
      isReady: !0,
      error: function(e) {
        throw new Error(e);
      },
      noop: function() {},
      isFunction: function(e) {
        return "function" === ye.type(e);
      },
      isWindow: function(e) {
        return null != e && e === e.window;
      },
      isNumeric: function(e) {
        var t = ye.type(e);
        return ("number" === t || "string" === t) && !isNaN(e - parseFloat(e));
      },
      isPlainObject: function(e) {
        var t, n;
        return !(
          !e ||
          "[object Object]" !== ce.call(e) ||
          ((t = oe(e)) &&
            ("function" !=
              typeof (n = le.call(t, "constructor") && t.constructor) ||
              de.call(n) !== pe))
        );
      },
      isEmptyObject: function(e) {
        var t;
        for (t in e) return !1;
        return !0;
      },
      type: function(e) {
        return null == e
          ? e + ""
          : "object" == typeof e || "function" == typeof e
          ? ue[ce.call(e)] || "object"
          : typeof e;
      },
      globalEval: function(e) {
        n(e);
      },
      camelCase: function(e) {
        return e.replace(me, "ms-").replace(ve, be);
      },
      each: function(e, t) {
        var n,
          r = 0;
        if (o(e))
          for (n = e.length; r < n && !1 !== t.call(e[r], r, e[r]); r++);
        else for (r in e) if (!1 === t.call(e[r], r, e[r])) break;
        return e;
      },
      trim: function(e) {
        return null == e ? "" : (e + "").replace(ge, "");
      },
      makeArray: function(e, t) {
        var n = t || [];
        return (
          null != e &&
            (o(Object(e))
              ? ye.merge(n, "string" == typeof e ? [e] : e)
              : ae.call(n, e)),
          n
        );
      },
      inArray: function(e, t, n) {
        return null == t ? -1 : se.call(t, e, n);
      },
      merge: function(e, t) {
        for (var n = +t.length, o = 0, r = e.length; o < n; o++) e[r++] = t[o];
        return (e.length = r), e;
      },
      grep: function(e, t, n) {
        for (var o = [], r = 0, i = e.length, a = !n; r < i; r++)
          !t(e[r], r) !== a && o.push(e[r]);
        return o;
      },
      map: function(e, t, n) {
        var r,
          i,
          a = 0,
          s = [];
        if (o(e))
          for (r = e.length; a < r; a++)
            null != (i = t(e[a], a, n)) && s.push(i);
        else for (a in e) null != (i = t(e[a], a, n)) && s.push(i);
        return ie.apply([], s);
      },
      guid: 1,
      proxy: function(e, t) {
        var n, o, r;
        if (
          ("string" == typeof t && ((n = e[t]), (t = e), (e = n)),
          ye.isFunction(e))
        )
          return (
            (o = re.call(arguments, 2)),
            (r = function() {
              return e.apply(t || this, o.concat(re.call(arguments)));
            }),
            (r.guid = e.guid = e.guid || ye.guid++),
            r
          );
      },
      now: Date.now,
      support: he
    }),
    "function" == typeof Symbol &&
      (ye.fn[Symbol.iterator] = te[Symbol.iterator]),
    ye.each(
      "Boolean Number String Function Array Date RegExp Object Error Symbol".split(
        " "
      ),
      function(e, t) {
        ue["[object " + t + "]"] = t.toLowerCase();
      }
    );
  var we = (function(e) {
    function t(e, t, n, o) {
      var r,
        i,
        a,
        s,
        u,
        c,
        l,
        p = t && t.ownerDocument,
        f = t ? t.nodeType : 9;
      if (
        ((n = n || []),
        "string" != typeof e || !e || (1 !== f && 9 !== f && 11 !== f))
      )
        return n;
      if (
        !o &&
        ((t ? t.ownerDocument || t : U) !== P && _(t), (t = t || P), W)
      ) {
        if (11 !== f && (u = me.exec(e)))
          if ((r = u[1])) {
            if (9 === f) {
              if (!(a = t.getElementById(r))) return n;
              if (a.id === r) return n.push(a), n;
            } else if (p && (a = p.getElementById(r)) && H(t, a) && a.id === r)
              return n.push(a), n;
          } else {
            if (u[2]) return K.apply(n, t.getElementsByTagName(e)), n;
            if (
              (r = u[3]) &&
              k.getElementsByClassName &&
              t.getElementsByClassName
            )
              return K.apply(n, t.getElementsByClassName(r)), n;
          }
        if (k.qsa && !z[e + " "] && (!O || !O.test(e))) {
          if (1 !== f) (p = t), (l = e);
          else if ("object" !== t.nodeName.toLowerCase()) {
            for (
              (s = t.getAttribute("id"))
                ? (s = s.replace(xe, ke))
                : t.setAttribute("id", (s = R)),
                c = S(e),
                i = c.length;
              i--;

            )
              c[i] = "#" + s + " " + h(c[i]);
            (l = c.join(",")), (p = (ve.test(e) && d(t.parentNode)) || t);
          }
          if (l)
            try {
              return K.apply(n, p.querySelectorAll(l)), n;
            } catch (e) {
            } finally {
              s === R && t.removeAttribute("id");
            }
        }
      }
      return D(e.replace(se, "$1"), t, n, o);
    }
    function n() {
      function e(n, o) {
        return (
          t.push(n + " ") > T.cacheLength && delete e[t.shift()],
          (e[n + " "] = o)
        );
      }
      var t = [];
      return e;
    }
    function o(e) {
      return (e[R] = !0), e;
    }
    function r(e) {
      var t = P.createElement("fieldset");
      try {
        return !!e(t);
      } catch (e) {
        return !1;
      } finally {
        t.parentNode && t.parentNode.removeChild(t), (t = null);
      }
    }
    function i(e, t) {
      for (var n = e.split("|"), o = n.length; o--; ) T.attrHandle[n[o]] = t;
    }
    function a(e, t) {
      var n = t && e,
        o =
          n &&
          1 === e.nodeType &&
          1 === t.nodeType &&
          e.sourceIndex - t.sourceIndex;
      if (o) return o;
      if (n) for (; (n = n.nextSibling); ) if (n === t) return -1;
      return e ? 1 : -1;
    }
    function s(e) {
      return function(t) {
        return "input" === t.nodeName.toLowerCase() && t.type === e;
      };
    }
    function u(e) {
      return function(t) {
        var n = t.nodeName.toLowerCase();
        return ("input" === n || "button" === n) && t.type === e;
      };
    }
    function c(e) {
      return function(t) {
        return "form" in t
          ? t.parentNode && !1 === t.disabled
            ? "label" in t
              ? "label" in t.parentNode
                ? t.parentNode.disabled === e
                : t.disabled === e
              : t.isDisabled === e || (t.isDisabled !== !e && Ae(t) === e)
            : t.disabled === e
          : "label" in t && t.disabled === e;
      };
    }
    function l(e) {
      return o(function(t) {
        return (
          (t = +t),
          o(function(n, o) {
            for (var r, i = e([], n.length, t), a = i.length; a--; )
              n[(r = i[a])] && (n[r] = !(o[r] = n[r]));
          })
        );
      });
    }
    function d(e) {
      return e && "undefined" != typeof e.getElementsByTagName && e;
    }
    function p() {}
    function h(e) {
      for (var t = 0, n = e.length, o = ""; t < n; t++) o += e[t].value;
      return o;
    }
    function f(e, t, n) {
      var o = t.dir,
        r = t.next,
        i = r || o,
        a = n && "parentNode" === i,
        s = M++;
      return t.first
        ? function(t, n, r) {
            for (; (t = t[o]); ) if (1 === t.nodeType || a) return e(t, n, r);
            return !1;
          }
        : function(t, n, u) {
            var c,
              l,
              d,
              p = [$, s];
            if (u) {
              for (; (t = t[o]); )
                if ((1 === t.nodeType || a) && e(t, n, u)) return !0;
            } else
              for (; (t = t[o]); )
                if (1 === t.nodeType || a)
                  if (
                    ((d = t[R] || (t[R] = {})),
                    (l = d[t.uniqueID] || (d[t.uniqueID] = {})),
                    r && r === t.nodeName.toLowerCase())
                  )
                    t = t[o] || t;
                  else {
                    if ((c = l[i]) && c[0] === $ && c[1] === s)
                      return (p[2] = c[2]);
                    if (((l[i] = p), (p[2] = e(t, n, u)))) return !0;
                  }
            return !1;
          };
    }
    function y(e) {
      return e.length > 1
        ? function(t, n, o) {
            for (var r = e.length; r--; ) if (!e[r](t, n, o)) return !1;
            return !0;
          }
        : e[0];
    }
    function g(e, n, o) {
      for (var r = 0, i = n.length; r < i; r++) t(e, n[r], o);
      return o;
    }
    function m(e, t, n, o, r) {
      for (var i, a = [], s = 0, u = e.length, c = null != t; s < u; s++)
        (i = e[s]) && ((n && !n(i, o, r)) || (a.push(i), c && t.push(s)));
      return a;
    }
    function v(e, t, n, r, i, a) {
      return (
        r && !r[R] && (r = v(r)),
        i && !i[R] && (i = v(i, a)),
        o(function(o, a, s, u) {
          var c,
            l,
            d,
            p = [],
            h = [],
            f = a.length,
            y = o || g(t || "*", s.nodeType ? [s] : s, []),
            v = !e || (!o && t) ? y : m(y, p, e, s, u),
            b = n ? (i || (o ? e : f || r) ? [] : a) : v;
          if ((n && n(v, b, s, u), r))
            for (c = m(b, h), r(c, [], s, u), l = c.length; l--; )
              (d = c[l]) && (b[h[l]] = !(v[h[l]] = d));
          if (o) {
            if (i || e) {
              if (i) {
                for (c = [], l = b.length; l--; )
                  (d = b[l]) && c.push((v[l] = d));
                i(null, (b = []), c, u);
              }
              for (l = b.length; l--; )
                (d = b[l]) &&
                  (c = i ? ee(o, d) : p[l]) > -1 &&
                  (o[c] = !(a[c] = d));
            }
          } else (b = m(b === a ? b.splice(f, b.length) : b)), i ? i(null, a, b, u) : K.apply(a, b);
        })
      );
    }
    function b(e) {
      for (
        var t,
          n,
          o,
          r = e.length,
          i = T.relative[e[0].type],
          a = i || T.relative[" "],
          s = i ? 1 : 0,
          u = f(
            function(e) {
              return e === t;
            },
            a,
            !0
          ),
          c = f(
            function(e) {
              return ee(t, e) > -1;
            },
            a,
            !0
          ),
          l = [
            function(e, n, o) {
              var r =
                (!i && (o || n !== E)) ||
                ((t = n).nodeType ? u(e, n, o) : c(e, n, o));
              return (t = null), r;
            }
          ];
        s < r;
        s++
      )
        if ((n = T.relative[e[s].type])) l = [f(y(l), n)];
        else {
          if (((n = T.filter[e[s].type].apply(null, e[s].matches)), n[R])) {
            for (o = ++s; o < r && !T.relative[e[o].type]; o++);
            return v(
              s > 1 && y(l),
              s > 1 &&
                h(
                  e
                    .slice(0, s - 1)
                    .concat({ value: " " === e[s - 2].type ? "*" : "" })
                ).replace(se, "$1"),
              n,
              s < o && b(e.slice(s, o)),
              o < r && b((e = e.slice(o))),
              o < r && h(e)
            );
          }
          l.push(n);
        }
      return y(l);
    }
    function w(e, n) {
      var r = n.length > 0,
        i = e.length > 0,
        a = function(o, a, s, u, c) {
          var l,
            d,
            p,
            h = 0,
            f = "0",
            y = o && [],
            g = [],
            v = E,
            b = o || (i && T.find.TAG("*", c)),
            w = ($ += null == v ? 1 : Math.random() || 0.1),
            x = b.length;
          for (
            c && (E = a === P || a || c);
            f !== x && null != (l = b[f]);
            f++
          ) {
            if (i && l) {
              for (
                d = 0, a || l.ownerDocument === P || (_(l), (s = !W));
                (p = e[d++]);

              )
                if (p(l, a || P, s)) {
                  u.push(l);
                  break;
                }
              c && ($ = w);
            }
            r && ((l = !p && l) && h--, o && y.push(l));
          }
          if (((h += f), r && f !== h)) {
            for (d = 0; (p = n[d++]); ) p(y, g, a, s);
            if (o) {
              if (h > 0) for (; f--; ) y[f] || g[f] || (g[f] = J.call(u));
              g = m(g);
            }
            K.apply(u, g),
              c && !o && g.length > 0 && h + n.length > 1 && t.uniqueSort(u);
          }
          return c && (($ = w), (E = v)), y;
        };
      return r ? o(a) : a;
    }
    var x,
      k,
      T,
      A,
      C,
      S,
      q,
      D,
      E,
      N,
      j,
      _,
      P,
      L,
      W,
      O,
      I,
      F,
      H,
      R = "sizzle" + 1 * new Date(),
      U = e.document,
      $ = 0,
      M = 0,
      B = n(),
      Y = n(),
      z = n(),
      X = function(e, t) {
        return e === t && (j = !0), 0;
      },
      V = {}.hasOwnProperty,
      G = [],
      J = G.pop,
      Q = G.push,
      K = G.push,
      Z = G.slice,
      ee = function(e, t) {
        for (var n = 0, o = e.length; n < o; n++) if (e[n] === t) return n;
        return -1;
      },
      te =
        "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
      ne = "[\\x20\\t\\r\\n\\f]",
      oe = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",
      re =
        "\\[" +
        ne +
        "*(" +
        oe +
        ")(?:" +
        ne +
        "*([*^$|!~]?=)" +
        ne +
        "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" +
        oe +
        "))|)" +
        ne +
        "*\\]",
      ie =
        ":(" +
        oe +
        ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" +
        re +
        ")*)|.*)\\)|)",
      ae = new RegExp(ne + "+", "g"),
      se = new RegExp(
        "^" + ne + "+|((?:^|[^\\\\])(?:\\\\.)*)" + ne + "+$",
        "g"
      ),
      ue = new RegExp("^" + ne + "*," + ne + "*"),
      ce = new RegExp("^" + ne + "*([>+~]|" + ne + ")" + ne + "*"),
      le = new RegExp("=" + ne + "*([^\\]'\"]*?)" + ne + "*\\]", "g"),
      de = new RegExp(ie),
      pe = new RegExp("^" + oe + "$"),
      he = {
        ID: new RegExp("^#(" + oe + ")"),
        CLASS: new RegExp("^\\.(" + oe + ")"),
        TAG: new RegExp("^(" + oe + "|[*])"),
        ATTR: new RegExp("^" + re),
        PSEUDO: new RegExp("^" + ie),
        CHILD: new RegExp(
          "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
            ne +
            "*(even|odd|(([+-]|)(\\d*)n|)" +
            ne +
            "*(?:([+-]|)" +
            ne +
            "*(\\d+)|))" +
            ne +
            "*\\)|)",
          "i"
        ),
        bool: new RegExp("^(?:" + te + ")$", "i"),
        needsContext: new RegExp(
          "^" +
            ne +
            "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
            ne +
            "*((?:-\\d)?\\d*)" +
            ne +
            "*\\)|)(?=[^-]|$)",
          "i"
        )
      },
      fe = /^(?:input|select|textarea|button)$/i,
      ye = /^h\d$/i,
      ge = /^[^{]+\{\s*\[native \w/,
      me = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
      ve = /[+~]/,
      be = new RegExp("\\\\([\\da-f]{1,6}" + ne + "?|(" + ne + ")|.)", "ig"),
      we = function(e, t, n) {
        var o = "0x" + t - 65536;
        return o !== o || n
          ? t
          : o < 0
          ? String.fromCharCode(o + 65536)
          : String.fromCharCode((o >> 10) | 55296, (1023 & o) | 56320);
      },
      xe = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
      ke = function(e, t) {
        return t
          ? "\0" === e
            ? "\ufffd"
            : e.slice(0, -1) +
              "\\" +
              e.charCodeAt(e.length - 1).toString(16) +
              " "
          : "\\" + e;
      },
      Te = function() {
        _();
      },
      Ae = f(
        function(e) {
          return !0 === e.disabled && ("form" in e || "label" in e);
        },
        { dir: "parentNode", next: "legend" }
      );
    try {
      K.apply((G = Z.call(U.childNodes)), U.childNodes),
        G[U.childNodes.length].nodeType;
    } catch (e) {
      K = {
        apply: G.length
          ? function(e, t) {
              Q.apply(e, Z.call(t));
            }
          : function(e, t) {
              for (var n = e.length, o = 0; (e[n++] = t[o++]); );
              e.length = n - 1;
            }
      };
    }
    (k = t.support = {}),
      (C = t.isXML = function(e) {
        var t = e && (e.ownerDocument || e).documentElement;
        return !!t && "HTML" !== t.nodeName;
      }),
      (_ = t.setDocument = function(e) {
        var t,
          n,
          o = e ? e.ownerDocument || e : U;
        return o !== P && 9 === o.nodeType && o.documentElement
          ? ((P = o),
            (L = P.documentElement),
            (W = !C(P)),
            U !== P &&
              (n = P.defaultView) &&
              n.top !== n &&
              (n.addEventListener
                ? n.addEventListener("unload", Te, !1)
                : n.attachEvent && n.attachEvent("onunload", Te)),
            (k.attributes = r(function(e) {
              return (e.className = "i"), !e.getAttribute("className");
            })),
            (k.getElementsByTagName = r(function(e) {
              return (
                e.appendChild(P.createComment("")),
                !e.getElementsByTagName("*").length
              );
            })),
            (k.getElementsByClassName = ge.test(P.getElementsByClassName)),
            (k.getById = r(function(e) {
              return (
                (L.appendChild(e).id = R),
                !P.getElementsByName || !P.getElementsByName(R).length
              );
            })),
            k.getById
              ? ((T.filter.ID = function(e) {
                  var t = e.replace(be, we);
                  return function(e) {
                    return e.getAttribute("id") === t;
                  };
                }),
                (T.find.ID = function(e, t) {
                  if ("undefined" != typeof t.getElementById && W) {
                    var n = t.getElementById(e);
                    return n ? [n] : [];
                  }
                }))
              : ((T.filter.ID = function(e) {
                  var t = e.replace(be, we);
                  return function(e) {
                    var n =
                      "undefined" != typeof e.getAttributeNode &&
                      e.getAttributeNode("id");
                    return n && n.value === t;
                  };
                }),
                (T.find.ID = function(e, t) {
                  if ("undefined" != typeof t.getElementById && W) {
                    var n,
                      o,
                      r,
                      i = t.getElementById(e);
                    if (i) {
                      if ((n = i.getAttributeNode("id")) && n.value === e)
                        return [i];
                      for (r = t.getElementsByName(e), o = 0; (i = r[o++]); )
                        if ((n = i.getAttributeNode("id")) && n.value === e)
                          return [i];
                    }
                    return [];
                  }
                })),
            (T.find.TAG = k.getElementsByTagName
              ? function(e, t) {
                  return "undefined" != typeof t.getElementsByTagName
                    ? t.getElementsByTagName(e)
                    : k.qsa
                    ? t.querySelectorAll(e)
                    : void 0;
                }
              : function(e, t) {
                  var n,
                    o = [],
                    r = 0,
                    i = t.getElementsByTagName(e);
                  if ("*" === e) {
                    for (; (n = i[r++]); ) 1 === n.nodeType && o.push(n);
                    return o;
                  }
                  return i;
                }),
            (T.find.CLASS =
              k.getElementsByClassName &&
              function(e, t) {
                if ("undefined" != typeof t.getElementsByClassName && W)
                  return t.getElementsByClassName(e);
              }),
            (I = []),
            (O = []),
            (k.qsa = ge.test(P.querySelectorAll)) &&
              (r(function(e) {
                (L.appendChild(e).innerHTML =
                  "<a id='" +
                  R +
                  "'></a><select id='" +
                  R +
                  "-\r\\' msallowcapture=''><option selected=''></option></select>"),
                  e.querySelectorAll("[msallowcapture^='']").length &&
                    O.push("[*^$]=" + ne + "*(?:''|\"\")"),
                  e.querySelectorAll("[selected]").length ||
                    O.push("\\[" + ne + "*(?:value|" + te + ")"),
                  e.querySelectorAll("[id~=" + R + "-]").length || O.push("~="),
                  e.querySelectorAll(":checked").length || O.push(":checked"),
                  e.querySelectorAll("a#" + R + "+*").length ||
                    O.push(".#.+[+~]");
              }),
              r(function(e) {
                e.innerHTML =
                  "<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";
                var t = P.createElement("input");
                t.setAttribute("type", "hidden"),
                  e.appendChild(t).setAttribute("name", "D"),
                  e.querySelectorAll("[name=d]").length &&
                    O.push("name" + ne + "*[*^$|!~]?="),
                  2 !== e.querySelectorAll(":enabled").length &&
                    O.push(":enabled", ":disabled"),
                  (L.appendChild(e).disabled = !0),
                  2 !== e.querySelectorAll(":disabled").length &&
                    O.push(":enabled", ":disabled"),
                  e.querySelectorAll("*,:x"),
                  O.push(",.*:");
              })),
            (k.matchesSelector = ge.test(
              (F =
                L.matches ||
                L.webkitMatchesSelector ||
                L.mozMatchesSelector ||
                L.oMatchesSelector ||
                L.msMatchesSelector)
            )) &&
              r(function(e) {
                (k.disconnectedMatch = F.call(e, "*")),
                  F.call(e, "[s!='']:x"),
                  I.push("!=", ie);
              }),
            (O = O.length && new RegExp(O.join("|"))),
            (I = I.length && new RegExp(I.join("|"))),
            (t = ge.test(L.compareDocumentPosition)),
            (H =
              t || ge.test(L.contains)
                ? function(e, t) {
                    var n = 9 === e.nodeType ? e.documentElement : e,
                      o = t && t.parentNode;
                    return (
                      e === o ||
                      !(
                        !o ||
                        1 !== o.nodeType ||
                        !(n.contains
                          ? n.contains(o)
                          : e.compareDocumentPosition &&
                            16 & e.compareDocumentPosition(o))
                      )
                    );
                  }
                : function(e, t) {
                    if (t) for (; (t = t.parentNode); ) if (t === e) return !0;
                    return !1;
                  }),
            (X = t
              ? function(e, t) {
                  if (e === t) return (j = !0), 0;
                  var n =
                    !e.compareDocumentPosition - !t.compareDocumentPosition;
                  return (
                    n ||
                    ((n =
                      (e.ownerDocument || e) === (t.ownerDocument || t)
                        ? e.compareDocumentPosition(t)
                        : 1),
                    1 & n ||
                    (!k.sortDetached && t.compareDocumentPosition(e) === n)
                      ? e === P || (e.ownerDocument === U && H(U, e))
                        ? -1
                        : t === P || (t.ownerDocument === U && H(U, t))
                        ? 1
                        : N
                        ? ee(N, e) - ee(N, t)
                        : 0
                      : 4 & n
                      ? -1
                      : 1)
                  );
                }
              : function(e, t) {
                  if (e === t) return (j = !0), 0;
                  var n,
                    o = 0,
                    r = e.parentNode,
                    i = t.parentNode,
                    s = [e],
                    u = [t];
                  if (!r || !i)
                    return e === P
                      ? -1
                      : t === P
                      ? 1
                      : r
                      ? -1
                      : i
                      ? 1
                      : N
                      ? ee(N, e) - ee(N, t)
                      : 0;
                  if (r === i) return a(e, t);
                  for (n = e; (n = n.parentNode); ) s.unshift(n);
                  for (n = t; (n = n.parentNode); ) u.unshift(n);
                  for (; s[o] === u[o]; ) o++;
                  return o
                    ? a(s[o], u[o])
                    : s[o] === U
                    ? -1
                    : u[o] === U
                    ? 1
                    : 0;
                }),
            P)
          : P;
      }),
      (t.matches = function(e, n) {
        return t(e, null, null, n);
      }),
      (t.matchesSelector = function(e, n) {
        if (
          ((e.ownerDocument || e) !== P && _(e),
          (n = n.replace(le, "='$1']")),
          k.matchesSelector &&
            W &&
            !z[n + " "] &&
            (!I || !I.test(n)) &&
            (!O || !O.test(n)))
        )
          try {
            var o = F.call(e, n);
            if (
              o ||
              k.disconnectedMatch ||
              (e.document && 11 !== e.document.nodeType)
            )
              return o;
          } catch (e) {}
        return t(n, P, null, [e]).length > 0;
      }),
      (t.contains = function(e, t) {
        return (e.ownerDocument || e) !== P && _(e), H(e, t);
      }),
      (t.attr = function(e, t) {
        (e.ownerDocument || e) !== P && _(e);
        var n = T.attrHandle[t.toLowerCase()],
          o = n && V.call(T.attrHandle, t.toLowerCase()) ? n(e, t, !W) : void 0;
        return void 0 !== o
          ? o
          : k.attributes || !W
          ? e.getAttribute(t)
          : (o = e.getAttributeNode(t)) && o.specified
          ? o.value
          : null;
      }),
      (t.escape = function(e) {
        return (e + "").replace(xe, ke);
      }),
      (t.error = function(e) {
        throw new Error("Syntax error, unrecognized expression: " + e);
      }),
      (t.uniqueSort = function(e) {
        var t,
          n = [],
          o = 0,
          r = 0;
        if (
          ((j = !k.detectDuplicates),
          (N = !k.sortStable && e.slice(0)),
          e.sort(X),
          j)
        ) {
          for (; (t = e[r++]); ) t === e[r] && (o = n.push(r));
          for (; o--; ) e.splice(n[o], 1);
        }
        return (N = null), e;
      }),
      (A = t.getText = function(e) {
        var t,
          n = "",
          o = 0,
          r = e.nodeType;
        if (r) {
          if (1 === r || 9 === r || 11 === r) {
            if ("string" == typeof e.textContent) return e.textContent;
            for (e = e.firstChild; e; e = e.nextSibling) n += A(e);
          } else if (3 === r || 4 === r) return e.nodeValue;
        } else for (; (t = e[o++]); ) n += A(t);
        return n;
      }),
      (T = t.selectors = {
        cacheLength: 50,
        createPseudo: o,
        match: he,
        attrHandle: {},
        find: {},
        relative: {
          ">": { dir: "parentNode", first: !0 },
          " ": { dir: "parentNode" },
          "+": { dir: "previousSibling", first: !0 },
          "~": { dir: "previousSibling" }
        },
        preFilter: {
          ATTR: function(e) {
            return (
              (e[1] = e[1].replace(be, we)),
              (e[3] = (e[3] || e[4] || e[5] || "").replace(be, we)),
              "~=" === e[2] && (e[3] = " " + e[3] + " "),
              e.slice(0, 4)
            );
          },
          CHILD: function(e) {
            return (
              (e[1] = e[1].toLowerCase()),
              "nth" === e[1].slice(0, 3)
                ? (e[3] || t.error(e[0]),
                  (e[4] = +(e[4]
                    ? e[5] + (e[6] || 1)
                    : 2 * ("even" === e[3] || "odd" === e[3]))),
                  (e[5] = +(e[7] + e[8] || "odd" === e[3])))
                : e[3] && t.error(e[0]),
              e
            );
          },
          PSEUDO: function(e) {
            var t,
              n = !e[6] && e[2];
            return he.CHILD.test(e[0])
              ? null
              : (e[3]
                  ? (e[2] = e[4] || e[5] || "")
                  : n &&
                    de.test(n) &&
                    (t = S(n, !0)) &&
                    (t = n.indexOf(")", n.length - t) - n.length) &&
                    ((e[0] = e[0].slice(0, t)), (e[2] = n.slice(0, t))),
                e.slice(0, 3));
          }
        },
        filter: {
          TAG: function(e) {
            var t = e.replace(be, we).toLowerCase();
            return "*" === e
              ? function() {
                  return !0;
                }
              : function(e) {
                  return e.nodeName && e.nodeName.toLowerCase() === t;
                };
          },
          CLASS: function(e) {
            var t = B[e + " "];
            return (
              t ||
              ((t = new RegExp("(^|" + ne + ")" + e + "(" + ne + "|$)")) &&
                B(e, function(e) {
                  return t.test(
                    ("string" == typeof e.className && e.className) ||
                      ("undefined" != typeof e.getAttribute &&
                        e.getAttribute("class")) ||
                      ""
                  );
                }))
            );
          },
          ATTR: function(e, n, o) {
            return function(r) {
              var i = t.attr(r, e);
              return null == i
                ? "!=" === n
                : !n ||
                    ((i += ""),
                    "=" === n
                      ? i === o
                      : "!=" === n
                      ? i !== o
                      : "^=" === n
                      ? o && 0 === i.indexOf(o)
                      : "*=" === n
                      ? o && i.indexOf(o) > -1
                      : "$=" === n
                      ? o && i.slice(-o.length) === o
                      : "~=" === n
                      ? (" " + i.replace(ae, " ") + " ").indexOf(o) > -1
                      : "|=" === n &&
                        (i === o || i.slice(0, o.length + 1) === o + "-"));
            };
          },
          CHILD: function(e, t, n, o, r) {
            var i = "nth" !== e.slice(0, 3),
              a = "last" !== e.slice(-4),
              s = "of-type" === t;
            return 1 === o && 0 === r
              ? function(e) {
                  return !!e.parentNode;
                }
              : function(t, n, u) {
                  var c,
                    l,
                    d,
                    p,
                    h,
                    f,
                    y = i !== a ? "nextSibling" : "previousSibling",
                    g = t.parentNode,
                    m = s && t.nodeName.toLowerCase(),
                    v = !u && !s,
                    b = !1;
                  if (g) {
                    if (i) {
                      for (; y; ) {
                        for (p = t; (p = p[y]); )
                          if (
                            s
                              ? p.nodeName.toLowerCase() === m
                              : 1 === p.nodeType
                          )
                            return !1;
                        f = y = "only" === e && !f && "nextSibling";
                      }
                      return !0;
                    }
                    if (((f = [a ? g.firstChild : g.lastChild]), a && v)) {
                      for (
                        p = g,
                          d = p[R] || (p[R] = {}),
                          l = d[p.uniqueID] || (d[p.uniqueID] = {}),
                          c = l[e] || [],
                          h = c[0] === $ && c[1],
                          b = h && c[2],
                          p = h && g.childNodes[h];
                        (p = (++h && p && p[y]) || (b = h = 0) || f.pop());

                      )
                        if (1 === p.nodeType && ++b && p === t) {
                          l[e] = [$, h, b];
                          break;
                        }
                    } else if (
                      (v &&
                        ((p = t),
                        (d = p[R] || (p[R] = {})),
                        (l = d[p.uniqueID] || (d[p.uniqueID] = {})),
                        (c = l[e] || []),
                        (h = c[0] === $ && c[1]),
                        (b = h)),
                      !1 === b)
                    )
                      for (
                        ;
                        (p = (++h && p && p[y]) || (b = h = 0) || f.pop()) &&
                        ((s
                          ? p.nodeName.toLowerCase() !== m
                          : 1 !== p.nodeType) ||
                          !++b ||
                          (v &&
                            ((d = p[R] || (p[R] = {})),
                            (l = d[p.uniqueID] || (d[p.uniqueID] = {})),
                            (l[e] = [$, b])),
                          p !== t));

                      );
                    return (b -= r) === o || (b % o == 0 && b / o >= 0);
                  }
                };
          },
          PSEUDO: function(e, n) {
            var r,
              i =
                T.pseudos[e] ||
                T.setFilters[e.toLowerCase()] ||
                t.error("unsupported pseudo: " + e);
            return i[R]
              ? i(n)
              : i.length > 1
              ? ((r = [e, e, "", n]),
                T.setFilters.hasOwnProperty(e.toLowerCase())
                  ? o(function(e, t) {
                      for (var o, r = i(e, n), a = r.length; a--; )
                        (o = ee(e, r[a])), (e[o] = !(t[o] = r[a]));
                    })
                  : function(e) {
                      return i(e, 0, r);
                    })
              : i;
          }
        },
        pseudos: {
          not: o(function(e) {
            var t = [],
              n = [],
              r = q(e.replace(se, "$1"));
            return r[R]
              ? o(function(e, t, n, o) {
                  for (var i, a = r(e, null, o, []), s = e.length; s--; )
                    (i = a[s]) && (e[s] = !(t[s] = i));
                })
              : function(e, o, i) {
                  return (t[0] = e), r(t, null, i, n), (t[0] = null), !n.pop();
                };
          }),
          has: o(function(e) {
            return function(n) {
              return t(e, n).length > 0;
            };
          }),
          contains: o(function(e) {
            return (
              (e = e.replace(be, we)),
              function(t) {
                return (t.textContent || t.innerText || A(t)).indexOf(e) > -1;
              }
            );
          }),
          lang: o(function(e) {
            return (
              pe.test(e || "") || t.error("unsupported lang: " + e),
              (e = e.replace(be, we).toLowerCase()),
              function(t) {
                var n;
                do {
                  if (
                    (n = W
                      ? t.lang
                      : t.getAttribute("xml:lang") || t.getAttribute("lang"))
                  )
                    return (
                      (n = n.toLowerCase()) === e || 0 === n.indexOf(e + "-")
                    );
                } while ((t = t.parentNode) && 1 === t.nodeType);
                return !1;
              }
            );
          }),
          target: function(t) {
            var n = e.location && e.location.hash;
            return n && n.slice(1) === t.id;
          },
          root: function(e) {
            return e === L;
          },
          focus: function(e) {
            return (
              e === P.activeElement &&
              (!P.hasFocus || P.hasFocus()) &&
              !!(e.type || e.href || ~e.tabIndex)
            );
          },
          enabled: c(!1),
          disabled: c(!0),
          checked: function(e) {
            var t = e.nodeName.toLowerCase();
            return (
              ("input" === t && !!e.checked) || ("option" === t && !!e.selected)
            );
          },
          selected: function(e) {
            return (
              e.parentNode && e.parentNode.selectedIndex, !0 === e.selected
            );
          },
          empty: function(e) {
            for (e = e.firstChild; e; e = e.nextSibling)
              if (e.nodeType < 6) return !1;
            return !0;
          },
          parent: function(e) {
            return !T.pseudos.empty(e);
          },
          header: function(e) {
            return ye.test(e.nodeName);
          },
          input: function(e) {
            return fe.test(e.nodeName);
          },
          button: function(e) {
            var t = e.nodeName.toLowerCase();
            return ("input" === t && "button" === e.type) || "button" === t;
          },
          text: function(e) {
            var t;
            return (
              "input" === e.nodeName.toLowerCase() &&
              "text" === e.type &&
              (null == (t = e.getAttribute("type")) ||
                "text" === t.toLowerCase())
            );
          },
          first: l(function() {
            return [0];
          }),
          last: l(function(e, t) {
            return [t - 1];
          }),
          eq: l(function(e, t, n) {
            return [n < 0 ? n + t : n];
          }),
          even: l(function(e, t) {
            for (var n = 0; n < t; n += 2) e.push(n);
            return e;
          }),
          odd: l(function(e, t) {
            for (var n = 1; n < t; n += 2) e.push(n);
            return e;
          }),
          lt: l(function(e, t, n) {
            for (var o = n < 0 ? n + t : n; --o >= 0; ) e.push(o);
            return e;
          }),
          gt: l(function(e, t, n) {
            for (var o = n < 0 ? n + t : n; ++o < t; ) e.push(o);
            return e;
          })
        }
      }),
      (T.pseudos.nth = T.pseudos.eq);
    for (x in { radio: !0, checkbox: !0, file: !0, password: !0, image: !0 })
      T.pseudos[x] = s(x);
    for (x in { submit: !0, reset: !0 }) T.pseudos[x] = u(x);
    return (
      (p.prototype = T.filters = T.pseudos),
      (T.setFilters = new p()),
      (S = t.tokenize = function(e, n) {
        var o,
          r,
          i,
          a,
          s,
          u,
          c,
          l = Y[e + " "];
        if (l) return n ? 0 : l.slice(0);
        for (s = e, u = [], c = T.preFilter; s; ) {
          (o && !(r = ue.exec(s))) ||
            (r && (s = s.slice(r[0].length) || s), u.push((i = []))),
            (o = !1),
            (r = ce.exec(s)) &&
              ((o = r.shift()),
              i.push({ value: o, type: r[0].replace(se, " ") }),
              (s = s.slice(o.length)));
          for (a in T.filter)
            !(r = he[a].exec(s)) ||
              (c[a] && !(r = c[a](r))) ||
              ((o = r.shift()),
              i.push({ value: o, type: a, matches: r }),
              (s = s.slice(o.length)));
          if (!o) break;
        }
        return n ? s.length : s ? t.error(e) : Y(e, u).slice(0);
      }),
      (q = t.compile = function(e, t) {
        var n,
          o = [],
          r = [],
          i = z[e + " "];
        if (!i) {
          for (t || (t = S(e)), n = t.length; n--; )
            (i = b(t[n])), i[R] ? o.push(i) : r.push(i);
          (i = z(e, w(r, o))), (i.selector = e);
        }
        return i;
      }),
      (D = t.select = function(e, t, n, o) {
        var r,
          i,
          a,
          s,
          u,
          c = "function" == typeof e && e,
          l = !o && S((e = c.selector || e));
        if (((n = n || []), 1 === l.length)) {
          if (
            ((i = l[0] = l[0].slice(0)),
            i.length > 2 &&
              "ID" === (a = i[0]).type &&
              9 === t.nodeType &&
              W &&
              T.relative[i[1].type])
          ) {
            if (!(t = (T.find.ID(a.matches[0].replace(be, we), t) || [])[0]))
              return n;
            c && (t = t.parentNode), (e = e.slice(i.shift().value.length));
          }
          for (
            r = he.needsContext.test(e) ? 0 : i.length;
            r-- && ((a = i[r]), !T.relative[(s = a.type)]);

          )
            if (
              (u = T.find[s]) &&
              (o = u(
                a.matches[0].replace(be, we),
                (ve.test(i[0].type) && d(t.parentNode)) || t
              ))
            ) {
              if ((i.splice(r, 1), !(e = o.length && h(i))))
                return K.apply(n, o), n;
              break;
            }
        }
        return (
          (c || q(e, l))(
            o,
            t,
            !W,
            n,
            !t || (ve.test(e) && d(t.parentNode)) || t
          ),
          n
        );
      }),
      (k.sortStable =
        R.split("")
          .sort(X)
          .join("") === R),
      (k.detectDuplicates = !!j),
      _(),
      (k.sortDetached = r(function(e) {
        return 1 & e.compareDocumentPosition(P.createElement("fieldset"));
      })),
      r(function(e) {
        return (
          (e.innerHTML = "<a href='#'></a>"),
          "#" === e.firstChild.getAttribute("href")
        );
      }) ||
        i("type|href|height|width", function(e, t, n) {
          if (!n) return e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2);
        }),
      (k.attributes &&
        r(function(e) {
          return (
            (e.innerHTML = "<input/>"),
            e.firstChild.setAttribute("value", ""),
            "" === e.firstChild.getAttribute("value")
          );
        })) ||
        i("value", function(e, t, n) {
          if (!n && "input" === e.nodeName.toLowerCase()) return e.defaultValue;
        }),
      r(function(e) {
        return null == e.getAttribute("disabled");
      }) ||
        i(te, function(e, t, n) {
          var o;
          if (!n)
            return !0 === e[t]
              ? t.toLowerCase()
              : (o = e.getAttributeNode(t)) && o.specified
              ? o.value
              : null;
        }),
      t
    );
  })(e);
  (ye.find = we),
    (ye.expr = we.selectors),
    (ye.expr[":"] = ye.expr.pseudos),
    (ye.uniqueSort = ye.unique = we.uniqueSort),
    (ye.text = we.getText),
    (ye.isXMLDoc = we.isXML),
    (ye.contains = we.contains),
    (ye.escapeSelector = we.escape);
  var xe = function(e, t, n) {
      for (var o = [], r = void 0 !== n; (e = e[t]) && 9 !== e.nodeType; )
        if (1 === e.nodeType) {
          if (r && ye(e).is(n)) break;
          o.push(e);
        }
      return o;
    },
    ke = function(e, t) {
      for (var n = []; e; e = e.nextSibling)
        1 === e.nodeType && e !== t && n.push(e);
      return n;
    },
    Te = ye.expr.match.needsContext,
    Ae = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i,
    Ce = /^.[^:#\[\.,]*$/;
  (ye.filter = function(e, t, n) {
    var o = t[0];
    return (
      n && (e = ":not(" + e + ")"),
      1 === t.length && 1 === o.nodeType
        ? ye.find.matchesSelector(o, e)
          ? [o]
          : []
        : ye.find.matches(
            e,
            ye.grep(t, function(e) {
              return 1 === e.nodeType;
            })
          )
    );
  }),
    ye.fn.extend({
      find: function(e) {
        var t,
          n,
          o = this.length,
          r = this;
        if ("string" != typeof e)
          return this.pushStack(
            ye(e).filter(function() {
              for (t = 0; t < o; t++) if (ye.contains(r[t], this)) return !0;
            })
          );
        for (n = this.pushStack([]), t = 0; t < o; t++) ye.find(e, r[t], n);
        return o > 1 ? ye.uniqueSort(n) : n;
      },
      filter: function(e) {
        return this.pushStack(i(this, e || [], !1));
      },
      not: function(e) {
        return this.pushStack(i(this, e || [], !0));
      },
      is: function(e) {
        return !!i(
          this,
          "string" == typeof e && Te.test(e) ? ye(e) : e || [],
          !1
        ).length;
      }
    });
  var Se,
    qe = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;
  ((ye.fn.init = function(e, t, n) {
    var o, r;
    if (!e) return this;
    if (((n = n || Se), "string" == typeof e)) {
      if (
        !(o =
          "<" === e[0] && ">" === e[e.length - 1] && e.length >= 3
            ? [null, e, null]
            : qe.exec(e)) ||
        (!o[1] && t)
      )
        return !t || t.jquery ? (t || n).find(e) : this.constructor(t).find(e);
      if (o[1]) {
        if (
          ((t = t instanceof ye ? t[0] : t),
          ye.merge(
            this,
            ye.parseHTML(o[1], t && t.nodeType ? t.ownerDocument || t : ne, !0)
          ),
          Ae.test(o[1]) && ye.isPlainObject(t))
        )
          for (o in t)
            ye.isFunction(this[o]) ? this[o](t[o]) : this.attr(o, t[o]);
        return this;
      }
      return (
        (r = ne.getElementById(o[2])),
        r && ((this[0] = r), (this.length = 1)),
        this
      );
    }
    return e.nodeType
      ? ((this[0] = e), (this.length = 1), this)
      : ye.isFunction(e)
      ? void 0 !== n.ready
        ? n.ready(e)
        : e(ye)
      : ye.makeArray(e, this);
  }).prototype = ye.fn),
    (Se = ye(ne));
  var De = /^(?:parents|prev(?:Until|All))/,
    Ee = { children: !0, contents: !0, next: !0, prev: !0 };
  ye.fn.extend({
    has: function(e) {
      var t = ye(e, this),
        n = t.length;
      return this.filter(function() {
        for (var e = 0; e < n; e++) if (ye.contains(this, t[e])) return !0;
      });
    },
    closest: function(e, t) {
      var n,
        o = 0,
        r = this.length,
        i = [],
        a = "string" != typeof e && ye(e);
      if (!Te.test(e))
        for (; o < r; o++)
          for (n = this[o]; n && n !== t; n = n.parentNode)
            if (
              n.nodeType < 11 &&
              (a
                ? a.index(n) > -1
                : 1 === n.nodeType && ye.find.matchesSelector(n, e))
            ) {
              i.push(n);
              break;
            }
      return this.pushStack(i.length > 1 ? ye.uniqueSort(i) : i);
    },
    index: function(e) {
      return e
        ? "string" == typeof e
          ? se.call(ye(e), this[0])
          : se.call(this, e.jquery ? e[0] : e)
        : this[0] && this[0].parentNode
        ? this.first().prevAll().length
        : -1;
    },
    add: function(e, t) {
      return this.pushStack(ye.uniqueSort(ye.merge(this.get(), ye(e, t))));
    },
    addBack: function(e) {
      return this.add(null == e ? this.prevObject : this.prevObject.filter(e));
    }
  }),
    ye.each(
      {
        parent: function(e) {
          var t = e.parentNode;
          return t && 11 !== t.nodeType ? t : null;
        },
        parents: function(e) {
          return xe(e, "parentNode");
        },
        parentsUntil: function(e, t, n) {
          return xe(e, "parentNode", n);
        },
        next: function(e) {
          return a(e, "nextSibling");
        },
        prev: function(e) {
          return a(e, "previousSibling");
        },
        nextAll: function(e) {
          return xe(e, "nextSibling");
        },
        prevAll: function(e) {
          return xe(e, "previousSibling");
        },
        nextUntil: function(e, t, n) {
          return xe(e, "nextSibling", n);
        },
        prevUntil: function(e, t, n) {
          return xe(e, "previousSibling", n);
        },
        siblings: function(e) {
          return ke((e.parentNode || {}).firstChild, e);
        },
        children: function(e) {
          return ke(e.firstChild);
        },
        contents: function(e) {
          return r(e, "iframe")
            ? e.contentDocument
            : (r(e, "template") && (e = e.content || e),
              ye.merge([], e.childNodes));
        }
      },
      function(e, t) {
        ye.fn[e] = function(n, o) {
          var r = ye.map(this, t, n);
          return (
            "Until" !== e.slice(-5) && (o = n),
            o && "string" == typeof o && (r = ye.filter(o, r)),
            this.length > 1 &&
              (Ee[e] || ye.uniqueSort(r), De.test(e) && r.reverse()),
            this.pushStack(r)
          );
        };
      }
    );
  var Ne = /[^\x20\t\r\n\f]+/g;
  (ye.Callbacks = function(e) {
    e = "string" == typeof e ? s(e) : ye.extend({}, e);
    var t,
      n,
      o,
      r,
      i = [],
      a = [],
      u = -1,
      c = function() {
        for (r = r || e.once, o = t = !0; a.length; u = -1)
          for (n = a.shift(); ++u < i.length; )
            !1 === i[u].apply(n[0], n[1]) &&
              e.stopOnFalse &&
              ((u = i.length), (n = !1));
        e.memory || (n = !1), (t = !1), r && (i = n ? [] : "");
      },
      l = {
        add: function() {
          return (
            i &&
              (n && !t && ((u = i.length - 1), a.push(n)),
              (function t(n) {
                ye.each(n, function(n, o) {
                  ye.isFunction(o)
                    ? (e.unique && l.has(o)) || i.push(o)
                    : o && o.length && "string" !== ye.type(o) && t(o);
                });
              })(arguments),
              n && !t && c()),
            this
          );
        },
        remove: function() {
          return (
            ye.each(arguments, function(e, t) {
              for (var n; (n = ye.inArray(t, i, n)) > -1; )
                i.splice(n, 1), n <= u && u--;
            }),
            this
          );
        },
        has: function(e) {
          return e ? ye.inArray(e, i) > -1 : i.length > 0;
        },
        empty: function() {
          return i && (i = []), this;
        },
        disable: function() {
          return (r = a = []), (i = n = ""), this;
        },
        disabled: function() {
          return !i;
        },
        lock: function() {
          return (r = a = []), n || t || (i = n = ""), this;
        },
        locked: function() {
          return !!r;
        },
        fireWith: function(e, n) {
          return (
            r ||
              ((n = n || []),
              (n = [e, n.slice ? n.slice() : n]),
              a.push(n),
              t || c()),
            this
          );
        },
        fire: function() {
          return l.fireWith(this, arguments), this;
        },
        fired: function() {
          return !!o;
        }
      };
    return l;
  }),
    ye.extend({
      Deferred: function(t) {
        var n = [
            [
              "notify",
              "progress",
              ye.Callbacks("memory"),
              ye.Callbacks("memory"),
              2
            ],
            [
              "resolve",
              "done",
              ye.Callbacks("once memory"),
              ye.Callbacks("once memory"),
              0,
              "resolved"
            ],
            [
              "reject",
              "fail",
              ye.Callbacks("once memory"),
              ye.Callbacks("once memory"),
              1,
              "rejected"
            ]
          ],
          o = "pending",
          r = {
            state: function() {
              return o;
            },
            always: function() {
              return i.done(arguments).fail(arguments), this;
            },
            catch: function(e) {
              return r.then(null, e);
            },
            pipe: function() {
              var e = arguments;
              return ye
                .Deferred(function(t) {
                  ye.each(n, function(n, o) {
                    var r = ye.isFunction(e[o[4]]) && e[o[4]];
                    i[o[1]](function() {
                      var e = r && r.apply(this, arguments);
                      e && ye.isFunction(e.promise)
                        ? e
                            .promise()
                            .progress(t.notify)
                            .done(t.resolve)
                            .fail(t.reject)
                        : t[o[0] + "With"](this, r ? [e] : arguments);
                    });
                  }),
                    (e = null);
                })
                .promise();
            },
            then: function(t, o, r) {
              function i(t, n, o, r) {
                return function() {
                  var s = this,
                    l = arguments,
                    d = function() {
                      var e, d;
                      if (!(t < a)) {
                        if ((e = o.apply(s, l)) === n.promise())
                          throw new TypeError("Thenable self-resolution");
                        (d =
                          e &&
                          ("object" == typeof e || "function" == typeof e) &&
                          e.then),
                          ye.isFunction(d)
                            ? r
                              ? d.call(e, i(a, n, u, r), i(a, n, c, r))
                              : (a++,
                                d.call(
                                  e,
                                  i(a, n, u, r),
                                  i(a, n, c, r),
                                  i(a, n, u, n.notifyWith)
                                ))
                            : (o !== u && ((s = void 0), (l = [e])),
                              (r || n.resolveWith)(s, l));
                      }
                    },
                    p = r
                      ? d
                      : function() {
                          try {
                            d();
                          } catch (e) {
                            ye.Deferred.exceptionHook &&
                              ye.Deferred.exceptionHook(e, p.stackTrace),
                              t + 1 >= a &&
                                (o !== c && ((s = void 0), (l = [e])),
                                n.rejectWith(s, l));
                          }
                        };
                  t
                    ? p()
                    : (ye.Deferred.getStackHook &&
                        (p.stackTrace = ye.Deferred.getStackHook()),
                      e.setTimeout(p));
                };
              }
              var a = 0;
              return ye
                .Deferred(function(e) {
                  n[0][3].add(i(0, e, ye.isFunction(r) ? r : u, e.notifyWith)),
                    n[1][3].add(i(0, e, ye.isFunction(t) ? t : u)),
                    n[2][3].add(i(0, e, ye.isFunction(o) ? o : c));
                })
                .promise();
            },
            promise: function(e) {
              return null != e ? ye.extend(e, r) : r;
            }
          },
          i = {};
        return (
          ye.each(n, function(e, t) {
            var a = t[2],
              s = t[5];
            (r[t[1]] = a.add),
              s &&
                a.add(
                  function() {
                    o = s;
                  },
                  n[3 - e][2].disable,
                  n[0][2].lock
                ),
              a.add(t[3].fire),
              (i[t[0]] = function() {
                return (
                  i[t[0] + "With"](this === i ? void 0 : this, arguments), this
                );
              }),
              (i[t[0] + "With"] = a.fireWith);
          }),
          r.promise(i),
          t && t.call(i, i),
          i
        );
      },
      when: function(e) {
        var t = arguments.length,
          n = t,
          o = Array(n),
          r = re.call(arguments),
          i = ye.Deferred(),
          a = function(e) {
            return function(n) {
              (o[e] = this),
                (r[e] = arguments.length > 1 ? re.call(arguments) : n),
                --t || i.resolveWith(o, r);
            };
          };
        if (
          t <= 1 &&
          (l(e, i.done(a(n)).resolve, i.reject, !t),
          "pending" === i.state() || ye.isFunction(r[n] && r[n].then))
        )
          return i.then();
        for (; n--; ) l(r[n], a(n), i.reject);
        return i.promise();
      }
    });
  var je = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
  (ye.Deferred.exceptionHook = function(t, n) {
    e.console &&
      e.console.warn &&
      t &&
      je.test(t.name) &&
      e.console.warn("jQuery.Deferred exception: " + t.message, t.stack, n);
  }),
    (ye.readyException = function(t) {
      e.setTimeout(function() {
        throw t;
      });
    });
  var _e = ye.Deferred();
  (ye.fn.ready = function(e) {
    return (
      _e.then(e)["catch"](function(e) {
        ye.readyException(e);
      }),
      this
    );
  }),
    ye.extend({
      isReady: !1,
      readyWait: 1,
      ready: function(e) {
        (!0 === e ? --ye.readyWait : ye.isReady) ||
          ((ye.isReady = !0),
          (!0 !== e && --ye.readyWait > 0) || _e.resolveWith(ne, [ye]));
      }
    }),
    (ye.ready.then = _e.then),
    "complete" === ne.readyState ||
    ("loading" !== ne.readyState && !ne.documentElement.doScroll)
      ? e.setTimeout(ye.ready)
      : (ne.addEventListener("DOMContentLoaded", d),
        e.addEventListener("load", d));
  var Pe = function(e, t, n, o, r, i, a) {
      var s = 0,
        u = e.length,
        c = null == n;
      if ("object" === ye.type(n)) {
        r = !0;
        for (s in n) Pe(e, t, s, n[s], !0, i, a);
      } else if (
        void 0 !== o &&
        ((r = !0),
        ye.isFunction(o) || (a = !0),
        c &&
          (a
            ? (t.call(e, o), (t = null))
            : ((c = t),
              (t = function(e, t, n) {
                return c.call(ye(e), n);
              }))),
        t)
      )
        for (; s < u; s++) t(e[s], n, a ? o : o.call(e[s], s, t(e[s], n)));
      return r ? e : c ? t.call(e) : u ? t(e[0], n) : i;
    },
    Le = function(e) {
      return 1 === e.nodeType || 9 === e.nodeType || !+e.nodeType;
    };
  (p.uid = 1),
    (p.prototype = {
      cache: function(e) {
        var t = e[this.expando];
        return (
          t ||
            ((t = {}),
            Le(e) &&
              (e.nodeType
                ? (e[this.expando] = t)
                : Object.defineProperty(e, this.expando, {
                    value: t,
                    configurable: !0
                  }))),
          t
        );
      },
      set: function(e, t, n) {
        var o,
          r = this.cache(e);
        if ("string" == typeof t) r[ye.camelCase(t)] = n;
        else for (o in t) r[ye.camelCase(o)] = t[o];
        return r;
      },
      get: function(e, t) {
        return void 0 === t
          ? this.cache(e)
          : e[this.expando] && e[this.expando][ye.camelCase(t)];
      },
      access: function(e, t, n) {
        return void 0 === t || (t && "string" == typeof t && void 0 === n)
          ? this.get(e, t)
          : (this.set(e, t, n), void 0 !== n ? n : t);
      },
      remove: function(e, t) {
        var n,
          o = e[this.expando];
        if (void 0 !== o) {
          if (void 0 !== t) {
            Array.isArray(t)
              ? (t = t.map(ye.camelCase))
              : ((t = ye.camelCase(t)), (t = t in o ? [t] : t.match(Ne) || [])),
              (n = t.length);
            for (; n--; ) delete o[t[n]];
          }
          (void 0 === t || ye.isEmptyObject(o)) &&
            (e.nodeType ? (e[this.expando] = void 0) : delete e[this.expando]);
        }
      },
      hasData: function(e) {
        var t = e[this.expando];
        return void 0 !== t && !ye.isEmptyObject(t);
      }
    });
  var We = new p(),
    Oe = new p(),
    Ie = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
    Fe = /[A-Z]/g;
  ye.extend({
    hasData: function(e) {
      return Oe.hasData(e) || We.hasData(e);
    },
    data: function(e, t, n) {
      return Oe.access(e, t, n);
    },
    removeData: function(e, t) {
      Oe.remove(e, t);
    },
    _data: function(e, t, n) {
      return We.access(e, t, n);
    },
    _removeData: function(e, t) {
      We.remove(e, t);
    }
  }),
    ye.fn.extend({
      data: function(e, t) {
        var n,
          o,
          r,
          i = this[0],
          a = i && i.attributes;
        if (void 0 === e) {
          if (
            this.length &&
            ((r = Oe.get(i)), 1 === i.nodeType && !We.get(i, "hasDataAttrs"))
          ) {
            for (n = a.length; n--; )
              a[n] &&
                ((o = a[n].name),
                0 === o.indexOf("data-") &&
                  ((o = ye.camelCase(o.slice(5))), f(i, o, r[o])));
            We.set(i, "hasDataAttrs", !0);
          }
          return r;
        }
        return "object" == typeof e
          ? this.each(function() {
              Oe.set(this, e);
            })
          : Pe(
              this,
              function(t) {
                var n;
                if (i && void 0 === t) {
                  if (void 0 !== (n = Oe.get(i, e))) return n;
                  if (void 0 !== (n = f(i, e))) return n;
                } else
                  this.each(function() {
                    Oe.set(this, e, t);
                  });
              },
              null,
              t,
              arguments.length > 1,
              null,
              !0
            );
      },
      removeData: function(e) {
        return this.each(function() {
          Oe.remove(this, e);
        });
      }
    }),
    ye.extend({
      queue: function(e, t, n) {
        var o;
        if (e)
          return (
            (t = (t || "fx") + "queue"),
            (o = We.get(e, t)),
            n &&
              (!o || Array.isArray(n)
                ? (o = We.access(e, t, ye.makeArray(n)))
                : o.push(n)),
            o || []
          );
      },
      dequeue: function(e, t) {
        t = t || "fx";
        var n = ye.queue(e, t),
          o = n.length,
          r = n.shift(),
          i = ye._queueHooks(e, t),
          a = function() {
            ye.dequeue(e, t);
          };
        "inprogress" === r && ((r = n.shift()), o--),
          r &&
            ("fx" === t && n.unshift("inprogress"),
            delete i.stop,
            r.call(e, a, i)),
          !o && i && i.empty.fire();
      },
      _queueHooks: function(e, t) {
        var n = t + "queueHooks";
        return (
          We.get(e, n) ||
          We.access(e, n, {
            empty: ye.Callbacks("once memory").add(function() {
              We.remove(e, [t + "queue", n]);
            })
          })
        );
      }
    }),
    ye.fn.extend({
      queue: function(e, t) {
        var n = 2;
        return (
          "string" != typeof e && ((t = e), (e = "fx"), n--),
          arguments.length < n
            ? ye.queue(this[0], e)
            : void 0 === t
            ? this
            : this.each(function() {
                var n = ye.queue(this, e, t);
                ye._queueHooks(this, e),
                  "fx" === e && "inprogress" !== n[0] && ye.dequeue(this, e);
              })
        );
      },
      dequeue: function(e) {
        return this.each(function() {
          ye.dequeue(this, e);
        });
      },
      clearQueue: function(e) {
        return this.queue(e || "fx", []);
      },
      promise: function(e, t) {
        var n,
          o = 1,
          r = ye.Deferred(),
          i = this,
          a = this.length,
          s = function() {
            --o || r.resolveWith(i, [i]);
          };
        for (
          "string" != typeof e && ((t = e), (e = void 0)), e = e || "fx";
          a--;

        )
          (n = We.get(i[a], e + "queueHooks")) &&
            n.empty &&
            (o++, n.empty.add(s));
        return s(), r.promise(t);
      }
    });
  var He = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
    Re = new RegExp("^(?:([+-])=|)(" + He + ")([a-z%]*)$", "i"),
    Ue = ["Top", "Right", "Bottom", "Left"],
    $e = function(e, t) {
      return (
        (e = t || e),
        "none" === e.style.display ||
          ("" === e.style.display &&
            ye.contains(e.ownerDocument, e) &&
            "none" === ye.css(e, "display"))
      );
    },
    Me = function(e, t, n, o) {
      var r,
        i,
        a = {};
      for (i in t) (a[i] = e.style[i]), (e.style[i] = t[i]);
      r = n.apply(e, o || []);
      for (i in t) e.style[i] = a[i];
      return r;
    },
    Be = {};
  ye.fn.extend({
    show: function() {
      return m(this, !0);
    },
    hide: function() {
      return m(this);
    },
    toggle: function(e) {
      return "boolean" == typeof e
        ? e
          ? this.show()
          : this.hide()
        : this.each(function() {
            $e(this) ? ye(this).show() : ye(this).hide();
          });
    }
  });
  var Ye = /^(?:checkbox|radio)$/i,
    ze = /<([a-z][^\/\0>\x20\t\r\n\f]+)/i,
    Xe = /^$|\/(?:java|ecma)script/i,
    Ve = {
      option: [1, "<select multiple='multiple'>", "</select>"],
      thead: [1, "<table>", "</table>"],
      col: [2, "<table><colgroup>", "</colgroup></table>"],
      tr: [2, "<table><tbody>", "</tbody></table>"],
      td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
      _default: [0, "", ""]
    };
  (Ve.optgroup = Ve.option),
    (Ve.tbody = Ve.tfoot = Ve.colgroup = Ve.caption = Ve.thead),
    (Ve.th = Ve.td);
  var Ge = /<|&#?\w+;/;
  !(function() {
    var e = ne.createDocumentFragment(),
      t = e.appendChild(ne.createElement("div")),
      n = ne.createElement("input");
    n.setAttribute("type", "radio"),
      n.setAttribute("checked", "checked"),
      n.setAttribute("name", "t"),
      t.appendChild(n),
      (he.checkClone = t.cloneNode(!0).cloneNode(!0).lastChild.checked),
      (t.innerHTML = "<textarea>x</textarea>"),
      (he.noCloneChecked = !!t.cloneNode(!0).lastChild.defaultValue);
  })();
  var Je = ne.documentElement,
    Qe = /^key/,
    Ke = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
    Ze = /^([^.]*)(?:\.(.+)|)/;
  (ye.event = {
    global: {},
    add: function(e, t, n, o, r) {
      var i,
        a,
        s,
        u,
        c,
        l,
        d,
        p,
        h,
        f,
        y,
        g = We.get(e);
      if (g)
        for (
          n.handler && ((i = n), (n = i.handler), (r = i.selector)),
            r && ye.find.matchesSelector(Je, r),
            n.guid || (n.guid = ye.guid++),
            (u = g.events) || (u = g.events = {}),
            (a = g.handle) ||
              (a = g.handle = function(t) {
                return void 0 !== ye && ye.event.triggered !== t.type
                  ? ye.event.dispatch.apply(e, arguments)
                  : void 0;
              }),
            t = (t || "").match(Ne) || [""],
            c = t.length;
          c--;

        )
          (s = Ze.exec(t[c]) || []),
            (h = y = s[1]),
            (f = (s[2] || "").split(".").sort()),
            h &&
              ((d = ye.event.special[h] || {}),
              (h = (r ? d.delegateType : d.bindType) || h),
              (d = ye.event.special[h] || {}),
              (l = ye.extend(
                {
                  type: h,
                  origType: y,
                  data: o,
                  handler: n,
                  guid: n.guid,
                  selector: r,
                  needsContext: r && ye.expr.match.needsContext.test(r),
                  namespace: f.join(".")
                },
                i
              )),
              (p = u[h]) ||
                ((p = u[h] = []),
                (p.delegateCount = 0),
                (d.setup && !1 !== d.setup.call(e, o, f, a)) ||
                  (e.addEventListener && e.addEventListener(h, a))),
              d.add &&
                (d.add.call(e, l), l.handler.guid || (l.handler.guid = n.guid)),
              r ? p.splice(p.delegateCount++, 0, l) : p.push(l),
              (ye.event.global[h] = !0));
    },
    remove: function(e, t, n, o, r) {
      var i,
        a,
        s,
        u,
        c,
        l,
        d,
        p,
        h,
        f,
        y,
        g = We.hasData(e) && We.get(e);
      if (g && (u = g.events)) {
        for (t = (t || "").match(Ne) || [""], c = t.length; c--; )
          if (
            ((s = Ze.exec(t[c]) || []),
            (h = y = s[1]),
            (f = (s[2] || "").split(".").sort()),
            h)
          ) {
            for (
              d = ye.event.special[h] || {},
                h = (o ? d.delegateType : d.bindType) || h,
                p = u[h] || [],
                s =
                  s[2] &&
                  new RegExp("(^|\\.)" + f.join("\\.(?:.*\\.|)") + "(\\.|$)"),
                a = i = p.length;
              i--;

            )
              (l = p[i]),
                (!r && y !== l.origType) ||
                  (n && n.guid !== l.guid) ||
                  (s && !s.test(l.namespace)) ||
                  (o && o !== l.selector && ("**" !== o || !l.selector)) ||
                  (p.splice(i, 1),
                  l.selector && p.delegateCount--,
                  d.remove && d.remove.call(e, l));
            a &&
              !p.length &&
              ((d.teardown && !1 !== d.teardown.call(e, f, g.handle)) ||
                ye.removeEvent(e, h, g.handle),
              delete u[h]);
          } else for (h in u) ye.event.remove(e, h + t[c], n, o, !0);
        ye.isEmptyObject(u) && We.remove(e, "handle events");
      }
    },
    dispatch: function(e) {
      var t,
        n,
        o,
        r,
        i,
        a,
        s = ye.event.fix(e),
        u = new Array(arguments.length),
        c = (We.get(this, "events") || {})[s.type] || [],
        l = ye.event.special[s.type] || {};
      for (u[0] = s, t = 1; t < arguments.length; t++) u[t] = arguments[t];
      if (
        ((s.delegateTarget = this),
        !l.preDispatch || !1 !== l.preDispatch.call(this, s))
      ) {
        for (
          a = ye.event.handlers.call(this, s, c), t = 0;
          (r = a[t++]) && !s.isPropagationStopped();

        )
          for (
            s.currentTarget = r.elem, n = 0;
            (i = r.handlers[n++]) && !s.isImmediatePropagationStopped();

          )
            (s.rnamespace && !s.rnamespace.test(i.namespace)) ||
              ((s.handleObj = i),
              (s.data = i.data),
              void 0 !==
                (o = (
                  (ye.event.special[i.origType] || {}).handle || i.handler
                ).apply(r.elem, u)) &&
                !1 === (s.result = o) &&
                (s.preventDefault(), s.stopPropagation()));
        return l.postDispatch && l.postDispatch.call(this, s), s.result;
      }
    },
    handlers: function(e, t) {
      var n,
        o,
        r,
        i,
        a,
        s = [],
        u = t.delegateCount,
        c = e.target;
      if (u && c.nodeType && !("click" === e.type && e.button >= 1))
        for (; c !== this; c = c.parentNode || this)
          if (1 === c.nodeType && ("click" !== e.type || !0 !== c.disabled)) {
            for (i = [], a = {}, n = 0; n < u; n++)
              (o = t[n]),
                (r = o.selector + " "),
                void 0 === a[r] &&
                  (a[r] = o.needsContext
                    ? ye(r, this).index(c) > -1
                    : ye.find(r, this, null, [c]).length),
                a[r] && i.push(o);
            i.length && s.push({ elem: c, handlers: i });
          }
      return (
        (c = this), u < t.length && s.push({ elem: c, handlers: t.slice(u) }), s
      );
    },
    addProp: function(e, t) {
      Object.defineProperty(ye.Event.prototype, e, {
        enumerable: !0,
        configurable: !0,
        get: ye.isFunction(t)
          ? function() {
              if (this.originalEvent) return t(this.originalEvent);
            }
          : function() {
              if (this.originalEvent) return this.originalEvent[e];
            },
        set: function(t) {
          Object.defineProperty(this, e, {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: t
          });
        }
      });
    },
    fix: function(e) {
      return e[ye.expando] ? e : new ye.Event(e);
    },
    special: {
      load: { noBubble: !0 },
      focus: {
        trigger: function() {
          if (this !== T() && this.focus) return this.focus(), !1;
        },
        delegateType: "focusin"
      },
      blur: {
        trigger: function() {
          if (this === T() && this.blur) return this.blur(), !1;
        },
        delegateType: "focusout"
      },
      click: {
        trigger: function() {
          if ("checkbox" === this.type && this.click && r(this, "input"))
            return this.click(), !1;
        },
        _default: function(e) {
          return r(e.target, "a");
        }
      },
      beforeunload: {
        postDispatch: function(e) {
          void 0 !== e.result &&
            e.originalEvent &&
            (e.originalEvent.returnValue = e.result);
        }
      }
    }
  }),
    (ye.removeEvent = function(e, t, n) {
      e.removeEventListener && e.removeEventListener(t, n);
    }),
    (ye.Event = function(e, t) {
      return this instanceof ye.Event
        ? (e && e.type
            ? ((this.originalEvent = e),
              (this.type = e.type),
              (this.isDefaultPrevented =
                e.defaultPrevented ||
                (void 0 === e.defaultPrevented && !1 === e.returnValue)
                  ? x
                  : k),
              (this.target =
                e.target && 3 === e.target.nodeType
                  ? e.target.parentNode
                  : e.target),
              (this.currentTarget = e.currentTarget),
              (this.relatedTarget = e.relatedTarget))
            : (this.type = e),
          t && ye.extend(this, t),
          (this.timeStamp = (e && e.timeStamp) || ye.now()),
          void (this[ye.expando] = !0))
        : new ye.Event(e, t);
    }),
    (ye.Event.prototype = {
      constructor: ye.Event,
      isDefaultPrevented: k,
      isPropagationStopped: k,
      isImmediatePropagationStopped: k,
      isSimulated: !1,
      preventDefault: function() {
        var e = this.originalEvent;
        (this.isDefaultPrevented = x),
          e && !this.isSimulated && e.preventDefault();
      },
      stopPropagation: function() {
        var e = this.originalEvent;
        (this.isPropagationStopped = x),
          e && !this.isSimulated && e.stopPropagation();
      },
      stopImmediatePropagation: function() {
        var e = this.originalEvent;
        (this.isImmediatePropagationStopped = x),
          e && !this.isSimulated && e.stopImmediatePropagation(),
          this.stopPropagation();
      }
    }),
    ye.each(
      {
        altKey: !0,
        bubbles: !0,
        cancelable: !0,
        changedTouches: !0,
        ctrlKey: !0,
        detail: !0,
        eventPhase: !0,
        metaKey: !0,
        pageX: !0,
        pageY: !0,
        shiftKey: !0,
        view: !0,
        char: !0,
        charCode: !0,
        key: !0,
        keyCode: !0,
        button: !0,
        buttons: !0,
        clientX: !0,
        clientY: !0,
        offsetX: !0,
        offsetY: !0,
        pointerId: !0,
        pointerType: !0,
        screenX: !0,
        screenY: !0,
        targetTouches: !0,
        toElement: !0,
        touches: !0,
        which: function(e) {
          var t = e.button;
          return null == e.which && Qe.test(e.type)
            ? null != e.charCode
              ? e.charCode
              : e.keyCode
            : !e.which && void 0 !== t && Ke.test(e.type)
            ? 1 & t
              ? 1
              : 2 & t
              ? 3
              : 4 & t
              ? 2
              : 0
            : e.which;
        }
      },
      ye.event.addProp
    ),
    ye.each(
      {
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
      },
      function(e, t) {
        ye.event.special[e] = {
          delegateType: t,
          bindType: t,
          handle: function(e) {
            var n,
              o = this,
              r = e.relatedTarget,
              i = e.handleObj;
            return (
              (r && (r === o || ye.contains(o, r))) ||
                ((e.type = i.origType),
                (n = i.handler.apply(this, arguments)),
                (e.type = t)),
              n
            );
          }
        };
      }
    ),
    ye.fn.extend({
      on: function(e, t, n, o) {
        return A(this, e, t, n, o);
      },
      one: function(e, t, n, o) {
        return A(this, e, t, n, o, 1);
      },
      off: function(e, t, n) {
        var o, r;
        if (e && e.preventDefault && e.handleObj)
          return (
            (o = e.handleObj),
            ye(e.delegateTarget).off(
              o.namespace ? o.origType + "." + o.namespace : o.origType,
              o.selector,
              o.handler
            ),
            this
          );
        if ("object" == typeof e) {
          for (r in e) this.off(r, t, e[r]);
          return this;
        }
        return (
          (!1 !== t && "function" != typeof t) || ((n = t), (t = void 0)),
          !1 === n && (n = k),
          this.each(function() {
            ye.event.remove(this, e, n, t);
          })
        );
      }
    });
  var et = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,
    tt = /<script|<style|<link/i,
    nt = /checked\s*(?:[^=]|=\s*.checked.)/i,
    ot = /^true\/(.*)/,
    rt = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
  ye.extend({
    htmlPrefilter: function(e) {
      return e.replace(et, "<$1></$2>");
    },
    clone: function(e, t, n) {
      var o,
        r,
        i,
        a,
        s = e.cloneNode(!0),
        u = ye.contains(e.ownerDocument, e);
      if (
        !(
          he.noCloneChecked ||
          (1 !== e.nodeType && 11 !== e.nodeType) ||
          ye.isXMLDoc(e)
        )
      )
        for (a = v(s), i = v(e), o = 0, r = i.length; o < r; o++) E(i[o], a[o]);
      if (t)
        if (n)
          for (i = i || v(e), a = a || v(s), o = 0, r = i.length; o < r; o++)
            D(i[o], a[o]);
        else D(e, s);
      return (
        (a = v(s, "script")), a.length > 0 && b(a, !u && v(e, "script")), s
      );
    },
    cleanData: function(e) {
      for (var t, n, o, r = ye.event.special, i = 0; void 0 !== (n = e[i]); i++)
        if (Le(n)) {
          if ((t = n[We.expando])) {
            if (t.events)
              for (o in t.events)
                r[o] ? ye.event.remove(n, o) : ye.removeEvent(n, o, t.handle);
            n[We.expando] = void 0;
          }
          n[Oe.expando] && (n[Oe.expando] = void 0);
        }
    }
  }),
    ye.fn.extend({
      detach: function(e) {
        return j(this, e, !0);
      },
      remove: function(e) {
        return j(this, e);
      },
      text: function(e) {
        return Pe(
          this,
          function(e) {
            return void 0 === e
              ? ye.text(this)
              : this.empty().each(function() {
                  (1 !== this.nodeType &&
                    11 !== this.nodeType &&
                    9 !== this.nodeType) ||
                    (this.textContent = e);
                });
          },
          null,
          e,
          arguments.length
        );
      },
      append: function() {
        return N(this, arguments, function(e) {
          if (
            1 === this.nodeType ||
            11 === this.nodeType ||
            9 === this.nodeType
          ) {
            C(this, e).appendChild(e);
          }
        });
      },
      prepend: function() {
        return N(this, arguments, function(e) {
          if (
            1 === this.nodeType ||
            11 === this.nodeType ||
            9 === this.nodeType
          ) {
            var t = C(this, e);
            t.insertBefore(e, t.firstChild);
          }
        });
      },
      before: function() {
        return N(this, arguments, function(e) {
          this.parentNode && this.parentNode.insertBefore(e, this);
        });
      },
      after: function() {
        return N(this, arguments, function(e) {
          this.parentNode && this.parentNode.insertBefore(e, this.nextSibling);
        });
      },
      empty: function() {
        for (var e, t = 0; null != (e = this[t]); t++)
          1 === e.nodeType && (ye.cleanData(v(e, !1)), (e.textContent = ""));
        return this;
      },
      clone: function(e, t) {
        return (
          (e = null != e && e),
          (t = null == t ? e : t),
          this.map(function() {
            return ye.clone(this, e, t);
          })
        );
      },
      html: function(e) {
        return Pe(
          this,
          function(e) {
            var t = this[0] || {},
              n = 0,
              o = this.length;
            if (void 0 === e && 1 === t.nodeType) return t.innerHTML;
            if (
              "string" == typeof e &&
              !tt.test(e) &&
              !Ve[(ze.exec(e) || ["", ""])[1].toLowerCase()]
            ) {
              e = ye.htmlPrefilter(e);
              try {
                for (; n < o; n++)
                  (t = this[n] || {}),
                    1 === t.nodeType &&
                      (ye.cleanData(v(t, !1)), (t.innerHTML = e));
                t = 0;
              } catch (e) {}
            }
            t && this.empty().append(e);
          },
          null,
          e,
          arguments.length
        );
      },
      replaceWith: function() {
        var e = [];
        return N(
          this,
          arguments,
          function(t) {
            var n = this.parentNode;
            ye.inArray(this, e) < 0 &&
              (ye.cleanData(v(this)), n && n.replaceChild(t, this));
          },
          e
        );
      }
    }),
    ye.each(
      {
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
      },
      function(e, t) {
        ye.fn[e] = function(e) {
          for (var n, o = [], r = ye(e), i = r.length - 1, a = 0; a <= i; a++)
            (n = a === i ? this : this.clone(!0)),
              ye(r[a])[t](n),
              ae.apply(o, n.get());
          return this.pushStack(o);
        };
      }
    );
  var it = /^margin/,
    at = new RegExp("^(" + He + ")(?!px)[a-z%]+$", "i"),
    st = function(t) {
      var n = t.ownerDocument.defaultView;
      return (n && n.opener) || (n = e), n.getComputedStyle(t);
    };
  !(function() {
    function t() {
      if (s) {
        (s.style.cssText =
          "box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%"),
          (s.innerHTML = ""),
          Je.appendChild(a);
        var t = e.getComputedStyle(s);
        (n = "1%" !== t.top),
          (i = "2px" === t.marginLeft),
          (o = "4px" === t.width),
          (s.style.marginRight = "50%"),
          (r = "4px" === t.marginRight),
          Je.removeChild(a),
          (s = null);
      }
    }
    var n,
      o,
      r,
      i,
      a = ne.createElement("div"),
      s = ne.createElement("div");
    s.style &&
      ((s.style.backgroundClip = "content-box"),
      (s.cloneNode(!0).style.backgroundClip = ""),
      (he.clearCloneStyle = "content-box" === s.style.backgroundClip),
      (a.style.cssText =
        "border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute"),
      a.appendChild(s),
      ye.extend(he, {
        pixelPosition: function() {
          return t(), n;
        },
        boxSizingReliable: function() {
          return t(), o;
        },
        pixelMarginRight: function() {
          return t(), r;
        },
        reliableMarginLeft: function() {
          return t(), i;
        }
      }));
  })();
  var ut = /^(none|table(?!-c[ea]).+)/,
    ct = /^--/,
    lt = { position: "absolute", visibility: "hidden", display: "block" },
    dt = { letterSpacing: "0", fontWeight: "400" },
    pt = ["Webkit", "Moz", "ms"],
    ht = ne.createElement("div").style;
  ye.extend({
    cssHooks: {
      opacity: {
        get: function(e, t) {
          if (t) {
            var n = _(e, "opacity");
            return "" === n ? "1" : n;
          }
        }
      }
    },
    cssNumber: {
      animationIterationCount: !0,
      columnCount: !0,
      fillOpacity: !0,
      flexGrow: !0,
      flexShrink: !0,
      fontWeight: !0,
      lineHeight: !0,
      opacity: !0,
      order: !0,
      orphans: !0,
      widows: !0,
      zIndex: !0,
      zoom: !0
    },
    cssProps: { float: "cssFloat" },
    style: function(e, t, n, o) {
      if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
        var r,
          i,
          a,
          s = ye.camelCase(t),
          u = ct.test(t),
          c = e.style;
        return (
          u || (t = W(s)),
          (a = ye.cssHooks[t] || ye.cssHooks[s]),
          void 0 === n
            ? a && "get" in a && void 0 !== (r = a.get(e, !1, o))
              ? r
              : c[t]
            : ((i = typeof n),
              "string" === i &&
                (r = Re.exec(n)) &&
                r[1] &&
                ((n = y(e, t, r)), (i = "number")),
              void (
                null != n &&
                n === n &&
                ("number" === i &&
                  (n += (r && r[3]) || (ye.cssNumber[s] ? "" : "px")),
                he.clearCloneStyle ||
                  "" !== n ||
                  0 !== t.indexOf("background") ||
                  (c[t] = "inherit"),
                (a && "set" in a && void 0 === (n = a.set(e, n, o))) ||
                  (u ? c.setProperty(t, n) : (c[t] = n)))
              ))
        );
      }
    },
    css: function(e, t, n, o) {
      var r,
        i,
        a,
        s = ye.camelCase(t);
      return (
        ct.test(t) || (t = W(s)),
        (a = ye.cssHooks[t] || ye.cssHooks[s]),
        a && "get" in a && (r = a.get(e, !0, n)),
        void 0 === r && (r = _(e, t, o)),
        "normal" === r && t in dt && (r = dt[t]),
        "" === n || n
          ? ((i = parseFloat(r)), !0 === n || isFinite(i) ? i || 0 : r)
          : r
      );
    }
  }),
    ye.each(["height", "width"], function(e, t) {
      ye.cssHooks[t] = {
        get: function(e, n, o) {
          if (n)
            return !ut.test(ye.css(e, "display")) ||
              (e.getClientRects().length && e.getBoundingClientRect().width)
              ? F(e, t, o)
              : Me(e, lt, function() {
                  return F(e, t, o);
                });
        },
        set: function(e, n, o) {
          var r,
            i = o && st(e),
            a =
              o &&
              I(e, t, o, "border-box" === ye.css(e, "boxSizing", !1, i), i);
          return (
            a &&
              (r = Re.exec(n)) &&
              "px" !== (r[3] || "px") &&
              ((e.style[t] = n), (n = ye.css(e, t))),
            O(e, n, a)
          );
        }
      };
    }),
    (ye.cssHooks.marginLeft = P(he.reliableMarginLeft, function(e, t) {
      if (t)
        return (
          (parseFloat(_(e, "marginLeft")) ||
            e.getBoundingClientRect().left -
              Me(e, { marginLeft: 0 }, function() {
                return e.getBoundingClientRect().left;
              })) + "px"
        );
    })),
    ye.each({ margin: "", padding: "", border: "Width" }, function(e, t) {
      (ye.cssHooks[e + t] = {
        expand: function(n) {
          for (
            var o = 0, r = {}, i = "string" == typeof n ? n.split(" ") : [n];
            o < 4;
            o++
          )
            r[e + Ue[o] + t] = i[o] || i[o - 2] || i[0];
          return r;
        }
      }),
        it.test(e) || (ye.cssHooks[e + t].set = O);
    }),
    ye.fn.extend({
      css: function(e, t) {
        return Pe(
          this,
          function(e, t, n) {
            var o,
              r,
              i = {},
              a = 0;
            if (Array.isArray(t)) {
              for (o = st(e), r = t.length; a < r; a++)
                i[t[a]] = ye.css(e, t[a], !1, o);
              return i;
            }
            return void 0 !== n ? ye.style(e, t, n) : ye.css(e, t);
          },
          e,
          t,
          arguments.length > 1
        );
      }
    }),
    (ye.Tween = H),
    (H.prototype = {
      constructor: H,
      init: function(e, t, n, o, r, i) {
        (this.elem = e),
          (this.prop = n),
          (this.easing = r || ye.easing._default),
          (this.options = t),
          (this.start = this.now = this.cur()),
          (this.end = o),
          (this.unit = i || (ye.cssNumber[n] ? "" : "px"));
      },
      cur: function() {
        var e = H.propHooks[this.prop];
        return e && e.get ? e.get(this) : H.propHooks._default.get(this);
      },
      run: function(e) {
        var t,
          n = H.propHooks[this.prop];
        return (
          this.options.duration
            ? (this.pos = t = ye.easing[this.easing](
                e,
                this.options.duration * e,
                0,
                1,
                this.options.duration
              ))
            : (this.pos = t = e),
          (this.now = (this.end - this.start) * t + this.start),
          this.options.step &&
            this.options.step.call(this.elem, this.now, this),
          n && n.set ? n.set(this) : H.propHooks._default.set(this),
          this
        );
      }
    }),
    (H.prototype.init.prototype = H.prototype),
    (H.propHooks = {
      _default: {
        get: function(e) {
          var t;
          return 1 !== e.elem.nodeType ||
            (null != e.elem[e.prop] && null == e.elem.style[e.prop])
            ? e.elem[e.prop]
            : ((t = ye.css(e.elem, e.prop, "")), t && "auto" !== t ? t : 0);
        },
        set: function(e) {
          ye.fx.step[e.prop]
            ? ye.fx.step[e.prop](e)
            : 1 !== e.elem.nodeType ||
              (null == e.elem.style[ye.cssProps[e.prop]] &&
                !ye.cssHooks[e.prop])
            ? (e.elem[e.prop] = e.now)
            : ye.style(e.elem, e.prop, e.now + e.unit);
        }
      }
    }),
    (H.propHooks.scrollTop = H.propHooks.scrollLeft = {
      set: function(e) {
        e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now);
      }
    }),
    (ye.easing = {
      linear: function(e) {
        return e;
      },
      swing: function(e) {
        return 0.5 - Math.cos(e * Math.PI) / 2;
      },
      _default: "swing"
    }),
    (ye.fx = H.prototype.init),
    (ye.fx.step = {});
  var ft,
    yt,
    gt = /^(?:toggle|show|hide)$/,
    mt = /queueHooks$/;
  (ye.Animation = ye.extend(z, {
    tweeners: {
      "*": [
        function(e, t) {
          var n = this.createTween(e, t);
          return y(n.elem, e, Re.exec(t), n), n;
        }
      ]
    },
    tweener: function(e, t) {
      ye.isFunction(e) ? ((t = e), (e = ["*"])) : (e = e.match(Ne));
      for (var n, o = 0, r = e.length; o < r; o++)
        (n = e[o]),
          (z.tweeners[n] = z.tweeners[n] || []),
          z.tweeners[n].unshift(t);
    },
    prefilters: [B],
    prefilter: function(e, t) {
      t ? z.prefilters.unshift(e) : z.prefilters.push(e);
    }
  })),
    (ye.speed = function(e, t, n) {
      var o =
        e && "object" == typeof e
          ? ye.extend({}, e)
          : {
              complete: n || (!n && t) || (ye.isFunction(e) && e),
              duration: e,
              easing: (n && t) || (t && !ye.isFunction(t) && t)
            };
      return (
        ye.fx.off
          ? (o.duration = 0)
          : "number" != typeof o.duration &&
            (o.duration in ye.fx.speeds
              ? (o.duration = ye.fx.speeds[o.duration])
              : (o.duration = ye.fx.speeds._default)),
        (null != o.queue && !0 !== o.queue) || (o.queue = "fx"),
        (o.old = o.complete),
        (o.complete = function() {
          ye.isFunction(o.old) && o.old.call(this),
            o.queue && ye.dequeue(this, o.queue);
        }),
        o
      );
    }),
    ye.fn.extend({
      fadeTo: function(e, t, n, o) {
        return this.filter($e)
          .css("opacity", 0)
          .show()
          .end()
          .animate({ opacity: t }, e, n, o);
      },
      animate: function(e, t, n, o) {
        var r = ye.isEmptyObject(e),
          i = ye.speed(t, n, o),
          a = function() {
            var t = z(this, ye.extend({}, e), i);
            (r || We.get(this, "finish")) && t.stop(!0);
          };
        return (
          (a.finish = a),
          r || !1 === i.queue ? this.each(a) : this.queue(i.queue, a)
        );
      },
      stop: function(e, t, n) {
        var o = function(e) {
          var t = e.stop;
          delete e.stop, t(n);
        };
        return (
          "string" != typeof e && ((n = t), (t = e), (e = void 0)),
          t && !1 !== e && this.queue(e || "fx", []),
          this.each(function() {
            var t = !0,
              r = null != e && e + "queueHooks",
              i = ye.timers,
              a = We.get(this);
            if (r) a[r] && a[r].stop && o(a[r]);
            else for (r in a) a[r] && a[r].stop && mt.test(r) && o(a[r]);
            for (r = i.length; r--; )
              i[r].elem !== this ||
                (null != e && i[r].queue !== e) ||
                (i[r].anim.stop(n), (t = !1), i.splice(r, 1));
            (!t && n) || ye.dequeue(this, e);
          })
        );
      },
      finish: function(e) {
        return (
          !1 !== e && (e = e || "fx"),
          this.each(function() {
            var t,
              n = We.get(this),
              o = n[e + "queue"],
              r = n[e + "queueHooks"],
              i = ye.timers,
              a = o ? o.length : 0;
            for (
              n.finish = !0,
                ye.queue(this, e, []),
                r && r.stop && r.stop.call(this, !0),
                t = i.length;
              t--;

            )
              i[t].elem === this &&
                i[t].queue === e &&
                (i[t].anim.stop(!0), i.splice(t, 1));
            for (t = 0; t < a; t++)
              o[t] && o[t].finish && o[t].finish.call(this);
            delete n.finish;
          })
        );
      }
    }),
    ye.each(["toggle", "show", "hide"], function(e, t) {
      var n = ye.fn[t];
      ye.fn[t] = function(e, o, r) {
        return null == e || "boolean" == typeof e
          ? n.apply(this, arguments)
          : this.animate($(t, !0), e, o, r);
      };
    }),
    ye.each(
      {
        slideDown: $("show"),
        slideUp: $("hide"),
        slideToggle: $("toggle"),
        fadeIn: { opacity: "show" },
        fadeOut: { opacity: "hide" },
        fadeToggle: { opacity: "toggle" }
      },
      function(e, t) {
        ye.fn[e] = function(e, n, o) {
          return this.animate(t, e, n, o);
        };
      }
    ),
    (ye.timers = []),
    (ye.fx.tick = function() {
      var e,
        t = 0,
        n = ye.timers;
      for (ft = ye.now(); t < n.length; t++)
        (e = n[t])() || n[t] !== e || n.splice(t--, 1);
      n.length || ye.fx.stop(), (ft = void 0);
    }),
    (ye.fx.timer = function(e) {
      ye.timers.push(e), ye.fx.start();
    }),
    (ye.fx.interval = 13),
    (ye.fx.start = function() {
      yt || ((yt = !0), R());
    }),
    (ye.fx.stop = function() {
      yt = null;
    }),
    (ye.fx.speeds = { slow: 600, fast: 200, _default: 400 }),
    (ye.fn.delay = function(t, n) {
      return (
        (t = ye.fx ? ye.fx.speeds[t] || t : t),
        (n = n || "fx"),
        this.queue(n, function(n, o) {
          var r = e.setTimeout(n, t);
          o.stop = function() {
            e.clearTimeout(r);
          };
        })
      );
    }),
    (function() {
      var e = ne.createElement("input"),
        t = ne.createElement("select"),
        n = t.appendChild(ne.createElement("option"));
      (e.type = "checkbox"),
        (he.checkOn = "" !== e.value),
        (he.optSelected = n.selected),
        (e = ne.createElement("input")),
        (e.value = "t"),
        (e.type = "radio"),
        (he.radioValue = "t" === e.value);
    })();
  var vt,
    bt = ye.expr.attrHandle;
  ye.fn.extend({
    attr: function(e, t) {
      return Pe(this, ye.attr, e, t, arguments.length > 1);
    },
    removeAttr: function(e) {
      return this.each(function() {
        ye.removeAttr(this, e);
      });
    }
  }),
    ye.extend({
      attr: function(e, t, n) {
        var o,
          r,
          i = e.nodeType;
        if (3 !== i && 8 !== i && 2 !== i)
          return "undefined" == typeof e.getAttribute
            ? ye.prop(e, t, n)
            : ((1 === i && ye.isXMLDoc(e)) ||
                (r =
                  ye.attrHooks[t.toLowerCase()] ||
                  (ye.expr.match.bool.test(t) ? vt : void 0)),
              void 0 !== n
                ? null === n
                  ? void ye.removeAttr(e, t)
                  : r && "set" in r && void 0 !== (o = r.set(e, n, t))
                  ? o
                  : (e.setAttribute(t, n + ""), n)
                : r && "get" in r && null !== (o = r.get(e, t))
                ? o
                : ((o = ye.find.attr(e, t)), null == o ? void 0 : o));
      },
      attrHooks: {
        type: {
          set: function(e, t) {
            if (!he.radioValue && "radio" === t && r(e, "input")) {
              var n = e.value;
              return e.setAttribute("type", t), n && (e.value = n), t;
            }
          }
        }
      },
      removeAttr: function(e, t) {
        var n,
          o = 0,
          r = t && t.match(Ne);
        if (r && 1 === e.nodeType) for (; (n = r[o++]); ) e.removeAttribute(n);
      }
    }),
    (vt = {
      set: function(e, t, n) {
        return !1 === t ? ye.removeAttr(e, n) : e.setAttribute(n, n), n;
      }
    }),
    ye.each(ye.expr.match.bool.source.match(/\w+/g), function(e, t) {
      var n = bt[t] || ye.find.attr;
      bt[t] = function(e, t, o) {
        var r,
          i,
          a = t.toLowerCase();
        return (
          o ||
            ((i = bt[a]),
            (bt[a] = r),
            (r = null != n(e, t, o) ? a : null),
            (bt[a] = i)),
          r
        );
      };
    });
  var wt = /^(?:input|select|textarea|button)$/i,
    xt = /^(?:a|area)$/i;
  ye.fn.extend({
    prop: function(e, t) {
      return Pe(this, ye.prop, e, t, arguments.length > 1);
    },
    removeProp: function(e) {
      return this.each(function() {
        delete this[ye.propFix[e] || e];
      });
    }
  }),
    ye.extend({
      prop: function(e, t, n) {
        var o,
          r,
          i = e.nodeType;
        if (3 !== i && 8 !== i && 2 !== i)
          return (
            (1 === i && ye.isXMLDoc(e)) ||
              ((t = ye.propFix[t] || t), (r = ye.propHooks[t])),
            void 0 !== n
              ? r && "set" in r && void 0 !== (o = r.set(e, n, t))
                ? o
                : (e[t] = n)
              : r && "get" in r && null !== (o = r.get(e, t))
              ? o
              : e[t]
          );
      },
      propHooks: {
        tabIndex: {
          get: function(e) {
            var t = ye.find.attr(e, "tabindex");
            return t
              ? parseInt(t, 10)
              : wt.test(e.nodeName) || (xt.test(e.nodeName) && e.href)
              ? 0
              : -1;
          }
        }
      },
      propFix: { for: "htmlFor", class: "className" }
    }),
    he.optSelected ||
      (ye.propHooks.selected = {
        get: function(e) {
          var t = e.parentNode;
          return t && t.parentNode && t.parentNode.selectedIndex, null;
        },
        set: function(e) {
          var t = e.parentNode;
          t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex);
        }
      }),
    ye.each(
      [
        "tabIndex",
        "readOnly",
        "maxLength",
        "cellSpacing",
        "cellPadding",
        "rowSpan",
        "colSpan",
        "useMap",
        "frameBorder",
        "contentEditable"
      ],
      function() {
        ye.propFix[this.toLowerCase()] = this;
      }
    ),
    ye.fn.extend({
      addClass: function(e) {
        var t,
          n,
          o,
          r,
          i,
          a,
          s,
          u = 0;
        if (ye.isFunction(e))
          return this.each(function(t) {
            ye(this).addClass(e.call(this, t, V(this)));
          });
        if ("string" == typeof e && e)
          for (t = e.match(Ne) || []; (n = this[u++]); )
            if (((r = V(n)), (o = 1 === n.nodeType && " " + X(r) + " "))) {
              for (a = 0; (i = t[a++]); )
                o.indexOf(" " + i + " ") < 0 && (o += i + " ");
              (s = X(o)), r !== s && n.setAttribute("class", s);
            }
        return this;
      },
      removeClass: function(e) {
        var t,
          n,
          o,
          r,
          i,
          a,
          s,
          u = 0;
        if (ye.isFunction(e))
          return this.each(function(t) {
            ye(this).removeClass(e.call(this, t, V(this)));
          });
        if (!arguments.length) return this.attr("class", "");
        if ("string" == typeof e && e)
          for (t = e.match(Ne) || []; (n = this[u++]); )
            if (((r = V(n)), (o = 1 === n.nodeType && " " + X(r) + " "))) {
              for (a = 0; (i = t[a++]); )
                for (; o.indexOf(" " + i + " ") > -1; )
                  o = o.replace(" " + i + " ", " ");
              (s = X(o)), r !== s && n.setAttribute("class", s);
            }
        return this;
      },
      toggleClass: function(e, t) {
        var n = typeof e;
        return "boolean" == typeof t && "string" === n
          ? t
            ? this.addClass(e)
            : this.removeClass(e)
          : ye.isFunction(e)
          ? this.each(function(n) {
              ye(this).toggleClass(e.call(this, n, V(this), t), t);
            })
          : this.each(function() {
              var t, o, r, i;
              if ("string" === n)
                for (o = 0, r = ye(this), i = e.match(Ne) || []; (t = i[o++]); )
                  r.hasClass(t) ? r.removeClass(t) : r.addClass(t);
              else
                (void 0 !== e && "boolean" !== n) ||
                  ((t = V(this)),
                  t && We.set(this, "__className__", t),
                  this.setAttribute &&
                    this.setAttribute(
                      "class",
                      t || !1 === e ? "" : We.get(this, "__className__") || ""
                    ));
            });
      },
      hasClass: function(e) {
        var t,
          n,
          o = 0;
        for (t = " " + e + " "; (n = this[o++]); )
          if (1 === n.nodeType && (" " + X(V(n)) + " ").indexOf(t) > -1)
            return !0;
        return !1;
      }
    });
  var kt = /\r/g;
  ye.fn.extend({
    val: function(e) {
      var t,
        n,
        o,
        r = this[0];
      return arguments.length
        ? ((o = ye.isFunction(e)),
          this.each(function(n) {
            var r;
            1 === this.nodeType &&
              ((r = o ? e.call(this, n, ye(this).val()) : e),
              null == r
                ? (r = "")
                : "number" == typeof r
                ? (r += "")
                : Array.isArray(r) &&
                  (r = ye.map(r, function(e) {
                    return null == e ? "" : e + "";
                  })),
              ((t =
                ye.valHooks[this.type] ||
                ye.valHooks[this.nodeName.toLowerCase()]) &&
                "set" in t &&
                void 0 !== t.set(this, r, "value")) ||
                (this.value = r));
          }))
        : r
        ? ((t = ye.valHooks[r.type] || ye.valHooks[r.nodeName.toLowerCase()]),
          t && "get" in t && void 0 !== (n = t.get(r, "value"))
            ? n
            : ((n = r.value),
              "string" == typeof n ? n.replace(kt, "") : null == n ? "" : n))
        : void 0;
    }
  }),
    ye.extend({
      valHooks: {
        option: {
          get: function(e) {
            var t = ye.find.attr(e, "value");
            return null != t ? t : X(ye.text(e));
          }
        },
        select: {
          get: function(e) {
            var t,
              n,
              o,
              i = e.options,
              a = e.selectedIndex,
              s = "select-one" === e.type,
              u = s ? null : [],
              c = s ? a + 1 : i.length;
            for (o = a < 0 ? c : s ? a : 0; o < c; o++)
              if (
                ((n = i[o]),
                (n.selected || o === a) &&
                  !n.disabled &&
                  (!n.parentNode.disabled || !r(n.parentNode, "optgroup")))
              ) {
                if (((t = ye(n).val()), s)) return t;
                u.push(t);
              }
            return u;
          },
          set: function(e, t) {
            for (
              var n, o, r = e.options, i = ye.makeArray(t), a = r.length;
              a--;

            )
              (o = r[a]),
                (o.selected = ye.inArray(ye.valHooks.option.get(o), i) > -1) &&
                  (n = !0);
            return n || (e.selectedIndex = -1), i;
          }
        }
      }
    }),
    ye.each(["radio", "checkbox"], function() {
      (ye.valHooks[this] = {
        set: function(e, t) {
          if (Array.isArray(t))
            return (e.checked = ye.inArray(ye(e).val(), t) > -1);
        }
      }),
        he.checkOn ||
          (ye.valHooks[this].get = function(e) {
            return null === e.getAttribute("value") ? "on" : e.value;
          });
    });
  var Tt = /^(?:focusinfocus|focusoutblur)$/;
  ye.extend(ye.event, {
    trigger: function(t, n, o, r) {
      var i,
        a,
        s,
        u,
        c,
        l,
        d,
        p = [o || ne],
        h = le.call(t, "type") ? t.type : t,
        f = le.call(t, "namespace") ? t.namespace.split(".") : [];
      if (
        ((a = s = o = o || ne),
        3 !== o.nodeType &&
          8 !== o.nodeType &&
          !Tt.test(h + ye.event.triggered) &&
          (h.indexOf(".") > -1 &&
            ((f = h.split(".")), (h = f.shift()), f.sort()),
          (c = h.indexOf(":") < 0 && "on" + h),
          (t = t[ye.expando] ? t : new ye.Event(h, "object" == typeof t && t)),
          (t.isTrigger = r ? 2 : 3),
          (t.namespace = f.join(".")),
          (t.rnamespace = t.namespace
            ? new RegExp("(^|\\.)" + f.join("\\.(?:.*\\.|)") + "(\\.|$)")
            : null),
          (t.result = void 0),
          t.target || (t.target = o),
          (n = null == n ? [t] : ye.makeArray(n, [t])),
          (d = ye.event.special[h] || {}),
          r || !d.trigger || !1 !== d.trigger.apply(o, n)))
      ) {
        if (!r && !d.noBubble && !ye.isWindow(o)) {
          for (
            u = d.delegateType || h, Tt.test(u + h) || (a = a.parentNode);
            a;
            a = a.parentNode
          )
            p.push(a), (s = a);
          s === (o.ownerDocument || ne) &&
            p.push(s.defaultView || s.parentWindow || e);
        }
        for (i = 0; (a = p[i++]) && !t.isPropagationStopped(); )
          (t.type = i > 1 ? u : d.bindType || h),
            (l = (We.get(a, "events") || {})[t.type] && We.get(a, "handle")),
            l && l.apply(a, n),
            (l = c && a[c]) &&
              l.apply &&
              Le(a) &&
              ((t.result = l.apply(a, n)),
              !1 === t.result && t.preventDefault());
        return (
          (t.type = h),
          r ||
            t.isDefaultPrevented() ||
            (d._default && !1 !== d._default.apply(p.pop(), n)) ||
            !Le(o) ||
            (c &&
              ye.isFunction(o[h]) &&
              !ye.isWindow(o) &&
              ((s = o[c]),
              s && (o[c] = null),
              (ye.event.triggered = h),
              o[h](),
              (ye.event.triggered = void 0),
              s && (o[c] = s))),
          t.result
        );
      }
    },
    simulate: function(e, t, n) {
      var o = ye.extend(new ye.Event(), n, { type: e, isSimulated: !0 });
      ye.event.trigger(o, null, t);
    }
  }),
    ye.fn.extend({
      trigger: function(e, t) {
        return this.each(function() {
          ye.event.trigger(e, t, this);
        });
      },
      triggerHandler: function(e, t) {
        var n = this[0];
        if (n) return ye.event.trigger(e, t, n, !0);
      }
    }),
    ye.each(
      "blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(
        " "
      ),
      function(e, t) {
        ye.fn[t] = function(e, n) {
          return arguments.length > 0
            ? this.on(t, null, e, n)
            : this.trigger(t);
        };
      }
    ),
    ye.fn.extend({
      hover: function(e, t) {
        return this.mouseenter(e).mouseleave(t || e);
      }
    }),
    (he.focusin = "onfocusin" in e),
    he.focusin ||
      ye.each({ focus: "focusin", blur: "focusout" }, function(e, t) {
        var n = function(e) {
          ye.event.simulate(t, e.target, ye.event.fix(e));
        };
        ye.event.special[t] = {
          setup: function() {
            var o = this.ownerDocument || this,
              r = We.access(o, t);
            r || o.addEventListener(e, n, !0), We.access(o, t, (r || 0) + 1);
          },
          teardown: function() {
            var o = this.ownerDocument || this,
              r = We.access(o, t) - 1;
            r
              ? We.access(o, t, r)
              : (o.removeEventListener(e, n, !0), We.remove(o, t));
          }
        };
      });
  var At = e.location,
    Ct = ye.now(),
    St = /\?/;
  ye.parseXML = function(t) {
    var n;
    if (!t || "string" != typeof t) return null;
    try {
      n = new e.DOMParser().parseFromString(t, "text/xml");
    } catch (e) {
      n = void 0;
    }
    return (
      (n && !n.getElementsByTagName("parsererror").length) ||
        ye.error("Invalid XML: " + t),
      n
    );
  };
  var qt = /\[\]$/,
    Dt = /\r?\n/g,
    Et = /^(?:submit|button|image|reset|file)$/i,
    Nt = /^(?:input|select|textarea|keygen)/i;
  (ye.param = function(e, t) {
    var n,
      o = [],
      r = function(e, t) {
        var n = ye.isFunction(t) ? t() : t;
        o[o.length] =
          encodeURIComponent(e) + "=" + encodeURIComponent(null == n ? "" : n);
      };
    if (Array.isArray(e) || (e.jquery && !ye.isPlainObject(e)))
      ye.each(e, function() {
        r(this.name, this.value);
      });
    else for (n in e) G(n, e[n], t, r);
    return o.join("&");
  }),
    ye.fn.extend({
      serialize: function() {
        return ye.param(this.serializeArray());
      },
      serializeArray: function() {
        return this.map(function() {
          var e = ye.prop(this, "elements");
          return e ? ye.makeArray(e) : this;
        })
          .filter(function() {
            var e = this.type;
            return (
              this.name &&
              !ye(this).is(":disabled") &&
              Nt.test(this.nodeName) &&
              !Et.test(e) &&
              (this.checked || !Ye.test(e))
            );
          })
          .map(function(e, t) {
            var n = ye(this).val();
            return null == n
              ? null
              : Array.isArray(n)
              ? ye.map(n, function(e) {
                  return { name: t.name, value: e.replace(Dt, "\r\n") };
                })
              : { name: t.name, value: n.replace(Dt, "\r\n") };
          })
          .get();
      }
    });
  var jt = /%20/g,
    _t = /#.*$/,
    Pt = /([?&])_=[^&]*/,
    Lt = /^(.*?):[ \t]*([^\r\n]*)$/gm,
    Wt = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
    Ot = /^(?:GET|HEAD)$/,
    It = /^\/\//,
    Ft = {},
    Ht = {},
    Rt = "*/".concat("*"),
    Ut = ne.createElement("a");
  (Ut.href = At.href),
    ye.extend({
      active: 0,
      lastModified: {},
      etag: {},
      ajaxSettings: {
        url: At.href,
        type: "GET",
        isLocal: Wt.test(At.protocol),
        global: !0,
        processData: !0,
        async: !0,
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        accepts: {
          "*": Rt,
          text: "text/plain",
          html: "text/html",
          xml: "application/xml, text/xml",
          json: "application/json, text/javascript"
        },
        contents: { xml: /\bxml\b/, html: /\bhtml/, json: /\bjson\b/ },
        responseFields: {
          xml: "responseXML",
          text: "responseText",
          json: "responseJSON"
        },
        converters: {
          "* text": String,
          "text html": !0,
          "text json": JSON.parse,
          "text xml": ye.parseXML
        },
        flatOptions: { url: !0, context: !0 }
      },
      ajaxSetup: function(e, t) {
        return t ? K(K(e, ye.ajaxSettings), t) : K(ye.ajaxSettings, e);
      },
      ajaxPrefilter: J(Ft),
      ajaxTransport: J(Ht),
      ajax: function(t, n) {
        function o(t, n, o, s) {
          var c,
            p,
            h,
            w,
            x,
            k = n;
          l ||
            ((l = !0),
            u && e.clearTimeout(u),
            (r = void 0),
            (a = s || ""),
            (T.readyState = t > 0 ? 4 : 0),
            (c = (t >= 200 && t < 300) || 304 === t),
            o && (w = Z(f, T, o)),
            (w = ee(f, w, T, c)),
            c
              ? (f.ifModified &&
                  ((x = T.getResponseHeader("Last-Modified")),
                  x && (ye.lastModified[i] = x),
                  (x = T.getResponseHeader("etag")) && (ye.etag[i] = x)),
                204 === t || "HEAD" === f.type
                  ? (k = "nocontent")
                  : 304 === t
                  ? (k = "notmodified")
                  : ((k = w.state), (p = w.data), (h = w.error), (c = !h)))
              : ((h = k), (!t && k) || ((k = "error"), t < 0 && (t = 0))),
            (T.status = t),
            (T.statusText = (n || k) + ""),
            c ? m.resolveWith(y, [p, k, T]) : m.rejectWith(y, [T, k, h]),
            T.statusCode(b),
            (b = void 0),
            d && g.trigger(c ? "ajaxSuccess" : "ajaxError", [T, f, c ? p : h]),
            v.fireWith(y, [T, k]),
            d &&
              (g.trigger("ajaxComplete", [T, f]),
              --ye.active || ye.event.trigger("ajaxStop")));
        }
        "object" == typeof t && ((n = t), (t = void 0)), (n = n || {});
        var r,
          i,
          a,
          s,
          u,
          c,
          l,
          d,
          p,
          h,
          f = ye.ajaxSetup({}, n),
          y = f.context || f,
          g = f.context && (y.nodeType || y.jquery) ? ye(y) : ye.event,
          m = ye.Deferred(),
          v = ye.Callbacks("once memory"),
          b = f.statusCode || {},
          w = {},
          x = {},
          k = "canceled",
          T = {
            readyState: 0,
            getResponseHeader: function(e) {
              var t;
              if (l) {
                if (!s)
                  for (s = {}; (t = Lt.exec(a)); ) s[t[1].toLowerCase()] = t[2];
                t = s[e.toLowerCase()];
              }
              return null == t ? null : t;
            },
            getAllResponseHeaders: function() {
              return l ? a : null;
            },
            setRequestHeader: function(e, t) {
              return (
                null == l &&
                  ((e = x[e.toLowerCase()] = x[e.toLowerCase()] || e),
                  (w[e] = t)),
                this
              );
            },
            overrideMimeType: function(e) {
              return null == l && (f.mimeType = e), this;
            },
            statusCode: function(e) {
              var t;
              if (e)
                if (l) T.always(e[T.status]);
                else for (t in e) b[t] = [b[t], e[t]];
              return this;
            },
            abort: function(e) {
              var t = e || k;
              return r && r.abort(t), o(0, t), this;
            }
          };
        if (
          (m.promise(T),
          (f.url = ((t || f.url || At.href) + "").replace(
            It,
            At.protocol + "//"
          )),
          (f.type = n.method || n.type || f.method || f.type),
          (f.dataTypes = (f.dataType || "*").toLowerCase().match(Ne) || [""]),
          null == f.crossDomain)
        ) {
          c = ne.createElement("a");
          try {
            (c.href = f.url),
              (c.href = c.href),
              (f.crossDomain =
                Ut.protocol + "//" + Ut.host != c.protocol + "//" + c.host);
          } catch (e) {
            f.crossDomain = !0;
          }
        }
        if (
          (f.data &&
            f.processData &&
            "string" != typeof f.data &&
            (f.data = ye.param(f.data, f.traditional)),
          Q(Ft, f, n, T),
          l)
        )
          return T;
        (d = ye.event && f.global),
          d && 0 == ye.active++ && ye.event.trigger("ajaxStart"),
          (f.type = f.type.toUpperCase()),
          (f.hasContent = !Ot.test(f.type)),
          (i = f.url.replace(_t, "")),
          f.hasContent
            ? f.data &&
              f.processData &&
              0 ===
                (f.contentType || "").indexOf(
                  "application/x-www-form-urlencoded"
                ) &&
              (f.data = f.data.replace(jt, "+"))
            : ((h = f.url.slice(i.length)),
              f.data &&
                ((i += (St.test(i) ? "&" : "?") + f.data), delete f.data),
              !1 === f.cache &&
                ((i = i.replace(Pt, "$1")),
                (h = (St.test(i) ? "&" : "?") + "_=" + Ct++ + h)),
              (f.url = i + h)),
          f.ifModified &&
            (ye.lastModified[i] &&
              T.setRequestHeader("If-Modified-Since", ye.lastModified[i]),
            ye.etag[i] && T.setRequestHeader("If-None-Match", ye.etag[i])),
          ((f.data && f.hasContent && !1 !== f.contentType) || n.contentType) &&
            T.setRequestHeader("Content-Type", f.contentType),
          T.setRequestHeader(
            "Accept",
            f.dataTypes[0] && f.accepts[f.dataTypes[0]]
              ? f.accepts[f.dataTypes[0]] +
                  ("*" !== f.dataTypes[0] ? ", " + Rt + "; q=0.01" : "")
              : f.accepts["*"]
          );
        for (p in f.headers) T.setRequestHeader(p, f.headers[p]);
        if (f.beforeSend && (!1 === f.beforeSend.call(y, T, f) || l))
          return T.abort();
        if (
          ((k = "abort"),
          v.add(f.complete),
          T.done(f.success),
          T.fail(f.error),
          (r = Q(Ht, f, n, T)))
        ) {
          if (((T.readyState = 1), d && g.trigger("ajaxSend", [T, f]), l))
            return T;
          f.async &&
            f.timeout > 0 &&
            (u = e.setTimeout(function() {
              T.abort("timeout");
            }, f.timeout));
          try {
            (l = !1), r.send(w, o);
          } catch (e) {
            if (l) throw e;
            o(-1, e);
          }
        } else o(-1, "No Transport");
        return T;
      },
      getJSON: function(e, t, n) {
        return ye.get(e, t, n, "json");
      },
      getScript: function(e, t) {
        return ye.get(e, void 0, t, "script");
      }
    }),
    ye.each(["get", "post"], function(e, t) {
      ye[t] = function(e, n, o, r) {
        return (
          ye.isFunction(n) && ((r = r || o), (o = n), (n = void 0)),
          ye.ajax(
            ye.extend(
              { url: e, type: t, dataType: r, data: n, success: o },
              ye.isPlainObject(e) && e
            )
          )
        );
      };
    }),
    (ye._evalUrl = function(e) {
      return ye.ajax({
        url: e,
        type: "GET",
        dataType: "script",
        cache: !0,
        async: !1,
        global: !1,
        throws: !0
      });
    }),
    ye.fn.extend({
      wrapAll: function(e) {
        var t;
        return (
          this[0] &&
            (ye.isFunction(e) && (e = e.call(this[0])),
            (t = ye(e, this[0].ownerDocument)
              .eq(0)
              .clone(!0)),
            this[0].parentNode && t.insertBefore(this[0]),
            t
              .map(function() {
                for (var e = this; e.firstElementChild; )
                  e = e.firstElementChild;
                return e;
              })
              .append(this)),
          this
        );
      },
      wrapInner: function(e) {
        return ye.isFunction(e)
          ? this.each(function(t) {
              ye(this).wrapInner(e.call(this, t));
            })
          : this.each(function() {
              var t = ye(this),
                n = t.contents();
              n.length ? n.wrapAll(e) : t.append(e);
            });
      },
      wrap: function(e) {
        var t = ye.isFunction(e);
        return this.each(function(n) {
          ye(this).wrapAll(t ? e.call(this, n) : e);
        });
      },
      unwrap: function(e) {
        return (
          this.parent(e)
            .not("body")
            .each(function() {
              ye(this).replaceWith(this.childNodes);
            }),
          this
        );
      }
    }),
    (ye.expr.pseudos.hidden = function(e) {
      return !ye.expr.pseudos.visible(e);
    }),
    (ye.expr.pseudos.visible = function(e) {
      return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
    }),
    (ye.ajaxSettings.xhr = function() {
      try {
        return new e.XMLHttpRequest();
      } catch (e) {}
    });
  var $t = { 0: 200, 1223: 204 },
    Mt = ye.ajaxSettings.xhr();
  (he.cors = !!Mt && "withCredentials" in Mt),
    (he.ajax = Mt = !!Mt),
    ye.ajaxTransport(function(t) {
      var n, o;
      if (he.cors || (Mt && !t.crossDomain))
        return {
          send: function(r, i) {
            var a,
              s = t.xhr();
            if (
              (s.open(t.type, t.url, t.async, t.username, t.password),
              t.xhrFields)
            )
              for (a in t.xhrFields) s[a] = t.xhrFields[a];
            t.mimeType && s.overrideMimeType && s.overrideMimeType(t.mimeType),
              t.crossDomain ||
                r["X-Requested-With"] ||
                (r["X-Requested-With"] = "XMLHttpRequest");
            for (a in r) s.setRequestHeader(a, r[a]);
            (n = function(e) {
              return function() {
                n &&
                  ((n = o = s.onload = s.onerror = s.onabort = s.onreadystatechange = null),
                  "abort" === e
                    ? s.abort()
                    : "error" === e
                    ? "number" != typeof s.status
                      ? i(0, "error")
                      : i(s.status, s.statusText)
                    : i(
                        $t[s.status] || s.status,
                        s.statusText,
                        "text" !== (s.responseType || "text") ||
                          "string" != typeof s.responseText
                          ? { binary: s.response }
                          : { text: s.responseText },
                        s.getAllResponseHeaders()
                      ));
              };
            }),
              (s.onload = n()),
              (o = s.onerror = n("error")),
              void 0 !== s.onabort
                ? (s.onabort = o)
                : (s.onreadystatechange = function() {
                    4 === s.readyState &&
                      e.setTimeout(function() {
                        n && o();
                      });
                  }),
              (n = n("abort"));
            try {
              s.send((t.hasContent && t.data) || null);
            } catch (e) {
              if (n) throw e;
            }
          },
          abort: function() {
            n && n();
          }
        };
    }),
    ye.ajaxPrefilter(function(e) {
      e.crossDomain && (e.contents.script = !1);
    }),
    ye.ajaxSetup({
      accepts: {
        script:
          "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
      },
      contents: { script: /\b(?:java|ecma)script\b/ },
      converters: {
        "text script": function(e) {
          return ye.globalEval(e), e;
        }
      }
    }),
    ye.ajaxPrefilter("script", function(e) {
      void 0 === e.cache && (e.cache = !1), e.crossDomain && (e.type = "GET");
    }),
    ye.ajaxTransport("script", function(e) {
      if (e.crossDomain) {
        var t, n;
        return {
          send: function(o, r) {
            (t = ye("<script>")
              .prop({ charset: e.scriptCharset, src: e.url })
              .on(
                "load error",
                (n = function(e) {
                  t.remove(),
                    (n = null),
                    e && r("error" === e.type ? 404 : 200, e.type);
                })
              )),
              ne.head.appendChild(t[0]);
          },
          abort: function() {
            n && n();
          }
        };
      }
    });
  var Bt = [],
    Yt = /(=)\?(?=&|$)|\?\?/;
  ye.ajaxSetup({
    jsonp: "callback",
    jsonpCallback: function() {
      var e = Bt.pop() || ye.expando + "_" + Ct++;
      return (this[e] = !0), e;
    }
  }),
    ye.ajaxPrefilter("json jsonp", function(t, n, o) {
      var r,
        i,
        a,
        s =
          !1 !== t.jsonp &&
          (Yt.test(t.url)
            ? "url"
            : "string" == typeof t.data &&
              0 ===
                (t.contentType || "").indexOf(
                  "application/x-www-form-urlencoded"
                ) &&
              Yt.test(t.data) &&
              "data");
      if (s || "jsonp" === t.dataTypes[0])
        return (
          (r = t.jsonpCallback = ye.isFunction(t.jsonpCallback)
            ? t.jsonpCallback()
            : t.jsonpCallback),
          s
            ? (t[s] = t[s].replace(Yt, "$1" + r))
            : !1 !== t.jsonp &&
              (t.url += (St.test(t.url) ? "&" : "?") + t.jsonp + "=" + r),
          (t.converters["script json"] = function() {
            return a || ye.error(r + " was not called"), a[0];
          }),
          (t.dataTypes[0] = "json"),
          (i = e[r]),
          (e[r] = function() {
            a = arguments;
          }),
          o.always(function() {
            void 0 === i ? ye(e).removeProp(r) : (e[r] = i),
              t[r] && ((t.jsonpCallback = n.jsonpCallback), Bt.push(r)),
              a && ye.isFunction(i) && i(a[0]),
              (a = i = void 0);
          }),
          "script"
        );
    }),
    (he.createHTMLDocument = (function() {
      var e = ne.implementation.createHTMLDocument("").body;
      return (
        (e.innerHTML = "<form></form><form></form>"), 2 === e.childNodes.length
      );
    })()),
    (ye.parseHTML = function(e, t, n) {
      if ("string" != typeof e) return [];
      "boolean" == typeof t && ((n = t), (t = !1));
      var o, r, i;
      return (
        t ||
          (he.createHTMLDocument
            ? ((t = ne.implementation.createHTMLDocument("")),
              (o = t.createElement("base")),
              (o.href = ne.location.href),
              t.head.appendChild(o))
            : (t = ne)),
        (r = Ae.exec(e)),
        (i = !n && []),
        r
          ? [t.createElement(r[1])]
          : ((r = w([e], t, i)),
            i && i.length && ye(i).remove(),
            ye.merge([], r.childNodes))
      );
    }),
    (ye.fn.load = function(e, t, n) {
      var o,
        r,
        i,
        a = this,
        s = e.indexOf(" ");
      return (
        s > -1 && ((o = X(e.slice(s))), (e = e.slice(0, s))),
        ye.isFunction(t)
          ? ((n = t), (t = void 0))
          : t && "object" == typeof t && (r = "POST"),
        a.length > 0 &&
          ye
            .ajax({ url: e, type: r || "GET", dataType: "html", data: t })
            .done(function(e) {
              (i = arguments),
                a.html(
                  o
                    ? ye("<div>")
                        .append(ye.parseHTML(e))
                        .find(o)
                    : e
                );
            })
            .always(
              n &&
                function(e, t) {
                  a.each(function() {
                    n.apply(this, i || [e.responseText, t, e]);
                  });
                }
            ),
        this
      );
    }),
    ye.each(
      [
        "ajaxStart",
        "ajaxStop",
        "ajaxComplete",
        "ajaxError",
        "ajaxSuccess",
        "ajaxSend"
      ],
      function(e, t) {
        ye.fn[t] = function(e) {
          return this.on(t, e);
        };
      }
    ),
    (ye.expr.pseudos.animated = function(e) {
      return ye.grep(ye.timers, function(t) {
        return e === t.elem;
      }).length;
    }),
    (ye.offset = {
      setOffset: function(e, t, n) {
        var o,
          r,
          i,
          a,
          s,
          u,
          c,
          l = ye.css(e, "position"),
          d = ye(e),
          p = {};
        "static" === l && (e.style.position = "relative"),
          (s = d.offset()),
          (i = ye.css(e, "top")),
          (u = ye.css(e, "left")),
          (c =
            ("absolute" === l || "fixed" === l) &&
            (i + u).indexOf("auto") > -1),
          c
            ? ((o = d.position()), (a = o.top), (r = o.left))
            : ((a = parseFloat(i) || 0), (r = parseFloat(u) || 0)),
          ye.isFunction(t) && (t = t.call(e, n, ye.extend({}, s))),
          null != t.top && (p.top = t.top - s.top + a),
          null != t.left && (p.left = t.left - s.left + r),
          "using" in t ? t.using.call(e, p) : d.css(p);
      }
    }),
    ye.fn.extend({
      offset: function(e) {
        if (arguments.length)
          return void 0 === e
            ? this
            : this.each(function(t) {
                ye.offset.setOffset(this, e, t);
              });
        var t,
          n,
          o,
          r,
          i = this[0];
        return i
          ? i.getClientRects().length
            ? ((o = i.getBoundingClientRect()),
              (t = i.ownerDocument),
              (n = t.documentElement),
              (r = t.defaultView),
              {
                top: o.top + r.pageYOffset - n.clientTop,
                left: o.left + r.pageXOffset - n.clientLeft
              })
            : { top: 0, left: 0 }
          : void 0;
      },
      position: function() {
        if (this[0]) {
          var e,
            t,
            n = this[0],
            o = { top: 0, left: 0 };
          return (
            "fixed" === ye.css(n, "position")
              ? (t = n.getBoundingClientRect())
              : ((e = this.offsetParent()),
                (t = this.offset()),
                r(e[0], "html") || (o = e.offset()),
                (o = {
                  top: o.top + ye.css(e[0], "borderTopWidth", !0),
                  left: o.left + ye.css(e[0], "borderLeftWidth", !0)
                })),
            {
              top: t.top - o.top - ye.css(n, "marginTop", !0),
              left: t.left - o.left - ye.css(n, "marginLeft", !0)
            }
          );
        }
      },
      offsetParent: function() {
        return this.map(function() {
          for (
            var e = this.offsetParent;
            e && "static" === ye.css(e, "position");

          )
            e = e.offsetParent;
          return e || Je;
        });
      }
    }),
    ye.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function(
      e,
      t
    ) {
      var n = "pageYOffset" === t;
      ye.fn[e] = function(o) {
        return Pe(
          this,
          function(e, o, r) {
            var i;
            return (
              ye.isWindow(e)
                ? (i = e)
                : 9 === e.nodeType && (i = e.defaultView),
              void 0 === r
                ? i
                  ? i[t]
                  : e[o]
                : void (i
                    ? i.scrollTo(n ? i.pageXOffset : r, n ? r : i.pageYOffset)
                    : (e[o] = r))
            );
          },
          e,
          o,
          arguments.length
        );
      };
    }),
    ye.each(["top", "left"], function(e, t) {
      ye.cssHooks[t] = P(he.pixelPosition, function(e, n) {
        if (n)
          return (n = _(e, t)), at.test(n) ? ye(e).position()[t] + "px" : n;
      });
    }),
    ye.each({ Height: "height", Width: "width" }, function(e, t) {
      ye.each({ padding: "inner" + e, content: t, "": "outer" + e }, function(
        n,
        o
      ) {
        ye.fn[o] = function(r, i) {
          var a = arguments.length && (n || "boolean" != typeof r),
            s = n || (!0 === r || !0 === i ? "margin" : "border");
          return Pe(
            this,
            function(t, n, r) {
              var i;
              return ye.isWindow(t)
                ? 0 === o.indexOf("outer")
                  ? t["inner" + e]
                  : t.document.documentElement["client" + e]
                : 9 === t.nodeType
                ? ((i = t.documentElement),
                  Math.max(
                    t.body["scroll" + e],
                    i["scroll" + e],
                    t.body["offset" + e],
                    i["offset" + e],
                    i["client" + e]
                  ))
                : void 0 === r
                ? ye.css(t, n, s)
                : ye.style(t, n, r, s);
            },
            t,
            a ? r : void 0,
            a
          );
        };
      });
    }),
    ye.fn.extend({
      bind: function(e, t, n) {
        return this.on(e, null, t, n);
      },
      unbind: function(e, t) {
        return this.off(e, null, t);
      },
      delegate: function(e, t, n, o) {
        return this.on(t, e, n, o);
      },
      undelegate: function(e, t, n) {
        return 1 === arguments.length
          ? this.off(e, "**")
          : this.off(t, e || "**", n);
      }
    }),
    (ye.holdReady = function(e) {
      e ? ye.readyWait++ : ye.ready(!0);
    }),
    (ye.isArray = Array.isArray),
    (ye.parseJSON = JSON.parse),
    (ye.nodeName = r),
    "function" == typeof define &&
      define.amd &&
      define("jquery", [], function() {
        return ye;
      });
  var zt = e.jQuery,
    Xt = e.$;
  return (
    (ye.noConflict = function(t) {
      return (
        e.$ === ye && (e.$ = Xt), t && e.jQuery === ye && (e.jQuery = zt), ye
      );
    }),
    t || (e.jQuery = e.$ = ye),
    ye
  );
});
var svg,
  releases = [
    {
      date: "May 9, 2019",
      version: "1.4.3",
      type: "App",
      notes:
        "+ Be braver with your Saver. You can now set Emojis as your Saver Icons. Nothing like a bit of visual motivation to get you moving towards your saving goals. New bike? Floppy disks? Pet Camel? Whatever you&rsquo;re saving for there is probably an emoji for it. We&rsquo;ve also updated the flow so you can pick your Emoji when you create a saver. \xaf_(\u30c4)_/\xaf<br/>+ New number? No Worries! From now on you won&rsquo;t need to message us to update your digits. You can now update your mobile number in the profile section of the Up tab. Much easier.<br/>+ Hitting the coffee shop back to back, in the space of a few hours? We feel you. Your activity feed will now give you the long and short of it, and similar transactions will be grouped up into a neat little package. Quickly see your grouped spend or roll down to see your itemised list. It&rsquo;s the little things.<br/>+ Take control and define how your Up card is used. Don&rsquo;t want ATM Cash withdrawals? Disable it. Contactless payments? Turn them off. In-store or online purchases in Australia or overseas? Kill &rsquo;em. Configure card is now in the card menu of the Up tab. You&rsquo;re the shot caller. Become who you were born to be."
    },
    {
      date: "Apr 10, 2019",
      type: "Server update",
      notes:
        "Samsung Pay is now supported on Up! MST (Magnetic Secure Transmission) support will be available in June/July."
    },
    {
      date: "Apr 1, 2019",
      version: "1.4.1",
      type: "App",
      notes:
        "+ Why don't you tell us a little about yourself? Your own personal profile section is now here! A happy place where you can set your preferred name and change your email. We've also added timezone support for our pals out West.<br/>+ Phase one of our 'Upcoming' reboot has commenced. You'll notice a new and improved layout so it's easier than ever to track when your Upcoming payments are coming up. For all you data heads out there you can now drill down into a merchant from your Upcoming list to see payments past. This is just a taste of what's to come. Be alert, but not alarmed.<br/>+ You can now access a proof of balance statement to keep all of those governing credit bodies satisfied, or just prove to your mates that you are indeed 'good for it'.<br/>+ Love Siri on the go? Who doesn't! We know we do. You can now ask Siri for your balance directly from your Apple Watch. You'll feel like a boss checking your balance and transferring to Savers right from your wrist."
    },
    {
      date: "Mar 14, 2019",
      version: "1.4.0",
      type: "App",
      notes:
        "+ Let's slip into something more... Wearable. We are very proud to announce Super powered banking, in a super small format. Introducing Up on watchOS!<br/>View your Balance, Savers and Activity feed right there on your wrist. Take security into your own hands and block, or unblock your Up card in an instant... should it mysteriously disappear. For you seasoned watch wearers out there: The Up watchOS app works with handoff and we've thrown in a complication as well.<br/><br/>+ Throw your spare change where it matters - Pull to Save is here. Give your activity screen a mighty pull down to send your spare cents flying to the high heavens and straight into your round-up saver. Warning, this is dangerously addictive."
    },
    {
      date: "Feb 15, 2019",
      version: "1.2.1",
      type: "App",
      notes:
        "+ Don&rsquo;t theorise, just categorise. Outbound payments can now be assigned a spending category. That $40 you chipped in for Julie&rsquo;s going away present last week can now be safely filed under &lsquo;Gifts & Charity&rsquo;. 10 points to you, you generous human.<br/>+ All you category enthusiasts out there will be delighted to know that we&rsquo;ve added some new spending categories. We would like to welcome &lsquo;Hobbies&rsquo; and &lsquo;Investments&rsquo; to the team. Glad to have you on board."
    },
    {
      date: "Feb 5, 2019",
      version: "1.2.0",
      type: "App",
      notes:
        "A smarter way to Afterpay is here! You can now link your Afterpay account with Up.<br/>+ Transactions will appear with correct merchant information. You didn&rsquo;t buy that shirt from Afterpay, you bought it from that super trendy shop. We know that.<br/>+ Smart receipts show exactly what you bought and appear directly in the transaction. <br/>+ Stay on top of your Afterpays by budgeting for each instalment. Up will automatically detect your upcoming instalments and add them to the Upcoming screen. Suddenly 7 Afterpays at once is not so overwhelming.<br/><br/>We also did all the regular bug fixes and improvements."
    },
    {
      date: "Jan 23, 2019",
      version: "1.1.1",
      type: "App",
      notes:
        "'Spellchecker 2000' wasn't turned up to maximum voltage. A couple of typos slipped through the cracks. We tracked them down and corrected these little hiccups. Carry on."
    },
    {
      date: "Jan 21, 2019",
      version: "1.1.0",
      type: "App",
      notes:
        "Dusted out a few cobwebs and gave the flux capacitor a bit of a tune up. Now when this baby reaches 88 miles per hour, you are going to see some minor performance improvements."
    },
    {
      date: "Jan 15, 2019",
      version: "1.0.12",
      type: "App",
      notes:
        "What's new?<br/>+ Don&rsquo;t let the foreign Tax man get you down! Customers who are US citizens or have foreign tax obligations can now get on Up.<br/>+ Your mates who are with other banks can now get a text message letting them know you&rsquo;ve sent money to their PayID from Up. g2g c u soon.<br/><br/>And bug fixes?<br/>+ NSW driver license has now been extended to 10 characters. That's exactly 1 character better than before and is now the same amount as a NSW drivers license number."
    },
    {
      date: "Jan 9, 2019",
      version: "1.0.11",
      type: "App",
      notes:
        "New Year. New You.<br/>New Bank. New Hints.<br/><br/>Up bank accounts usually work better when they have money in them.<br/>We&rsquo;ve added a new hint to remind you and show you how fund your account.<br/>Highlight of the year&hellip;.so far."
    },
    {
      date: "Dec 20, 2018",
      version: "1.0.10",
      type: "App",
      notes:
        "Twas the week before Christmas and it was time to release.<br/>Time to squash bugs, make changes and keep our wheels lined with grease.<br/><br/>Payments have run for days without care,<br/>Yet still, We&rsquo;ve inserted improvements,<br/>Improvements that once were not there.<br/><br/>With more love and care we keep the app humming<br/>A new name is here!<br/>We&rsquo;ve changed &lsquo;Regulars&rsquo; to &lsquo;Upcoming&rsquo;."
    },
    {
      date: "Dec 14, 2018",
      version: "1.0.7",
      type: "App",
      notes:
        "It's like your birthday.. but better. Payments are finally here!<br/>Now you can pay OUT of your Up account, and pay your way IN to people&rsquo;s hearts.<br/>+ The payments screen is now unlocked and will be the happy home for all your payments needs<br/>+ Pay people instantly with support for Osko and PayID<br/>+ Payments in/out are easy to read with conversational style threads, just think of it like a messaging app..but with money<br/>+ Organise, archive and import mobile contacts so you are absolutely certain it was the right Brian that paid you back for drinks the other night<br/>+ Make your money mean something and send every payment with a message and some carefully selected emojis : eggplant :"
    },
    {
      date: "Dec 1, 2018",
      version: "1.0.6",
      type: "App",
      notes:
        "Improvement starts from within.<br/>Fixed up a couple of bits.<br/>The circle of life goes on."
    },
    {
      date: "Nov 22, 2018",
      version: "1.0.5",
      type: "App",
      notes:
        "+ Ready or notch, here it comes! We've added support for the iPhone XR &mdash; and you know what, things have never looked better.<br/>+ We fixed some issues with notifications that included users not getting notifications at all. Notifications have been restored to their former glory.<br/>+ It&rsquo;s the update you&rsquo;ve all been waiting for. We&rsquo;ve updated our sticker app! Slap yourself silly with 5 new designs. Fun for the whole family.<br/>+ We&rsquo;ve tightened the screws, we&rsquo;ve oiled the joints &mdash; our app is all buttered up and smooth as. Breathe easier as you navigate your way through our improved ... er navigation."
    },
    {
      date: "Nov 15, 2018",
      version: "1.0.4",
      type: "App",
      notes:
        "+ Sometimes you just want to know where it all went wrong. Our old error messages weren't very helpful. Knocked up a couple of new error messages so we all feel better when things don't go as planned.<br/>+ We've shed those winter pounds and the app is now 30% smaller."
    },
    {
      date: "Nov 7, 2018",
      version: "1.0.2",
      type: "App",
      notes:
        "+ Let&rsquo;s chat.. about some chat updates. We&rsquo;re talkin&rsquo; about a new layout&hellip; We&rsquo;re talkin&rsquo; about chat archiving&hellip; Did we mention your can upload images now? Send us your screenshots when you find a bug. We also welcome pictures of cats.<br/>+ For all you newbies out there we&rsquo;ve added Apple Pay provisioning to the sign up flow. Live the dream and add your Up card to your Apple Wallet before the plastic arrives! Full bank account and Apple Pay in under 3 minutes. If your a long time upsider and haven&rsquo;t added your card to your wallet. We&rsquo;ve added a shiny new button in Card under the Up tab. Leave your card at home. We got you boo.<br/>+ Can&rsquo;t get post to your address? Don&rsquo;t have a mailbox? Don&rsquo;t stress. You can now add a PO BOX during sign up. We will tell your Up card to wait there for you.<br/>+ See your &lsquo;hot&rsquo; and &lsquo;not-so-hot&rsquo; spots for each month. Monthly summaries now has Location Insights. Easily see that your&rsquo;e spending too much money in that super trendy suburb and maybe stay home for a bit.. have some you time.. You&rsquo;ve earned it."
    },
    {
      date: "Oct 18, 2018",
      version: "1.0.1",
      type: "App",
      notes:
        "+ It's not 1983, no-one remembers people's phone numbers (except maybe your grandma's). Invite a Friend now allows you to pick a contact from your phone's contact list. Radicool!"
    },
    {
      date: "Oct 1, 2018",
      version: "1.0.0",
      type: "App",
      notes:
        "+ \"With a Little Help From My Friends\" by The Beatles was released in 1967 on celebration of 10th International Friendship Day. In 2018 Up released 'Invite a Friend' - You can now select 3 (three) of your closest friends to get early access to Up. There will be no refunds, no re-dos and no extra invites. Choose wisely. Your circle of friends depends on it. Find it under the 'Up' tab in your app.<br/>+ We were 'saving' this one for another release but you guys have been so great we thought we would share early. Say goodbye to Targets..Don't say goodbye to the money in them..thats not leaving...We have re-named Targets to 'Savers' *crowd wildly cheers in celebration*. Great things come to great people. <br/>+ We've never been one to keep secrets.. So we got rid of them! Your secret is now called your 'Passcode'. Really breaking new ground on this one."
    },
    {
      date: "Sep 24, 2018",
      version: "0.4.0",
      type: "App",
      notes:
        "+ Our bosses told us we should 'broaden our horizons'... We weren't sure what they meant by that so we went ahead and fixed up the horizons in app. As you swipe between screens you'll notice everything is perfectly aligned and centred. Try it out! You'll be guaranteed to get a better sleep.<br/>+ Late one afternoon we received an email saying our support team physically can't work 24 hours a day. We noticed we didn't display the support centre open hours in the Support tab. Our team now leave at 5pm AEST and get back to support messages when they get back in at 9am. Don't forget, if your card is lost or stolen, your phone has this great feature that enables you to make voice calls. Turns out we have the same features in our phones. You can do the math..."
    },
    {
      date: "Sep 17, 2018",
      version: "0.3.2",
      type: "App",
      notes:
        "+ Adding to Apple Pay became even easier today with a bit of tinkering under the hood. We made those little square messages at the top of your feed astoundingly better. A great day for all<br/>+ We challenged our resident chief of graphs to give a once over on our Merchant Insights. His love of bar graphs shines through in this update, now you will see monthly spend graphs of every merchant.<br/>+ We've pulled out the old highlighter to make it easier to see some payments that haven't been identified. This is where you come in - help the Up community identify merchants and help yourself to see exactly where your money is going.<br/>+ We're still in the process of unpacking, but managed to clear a space to make way for payments. You'll notice a new tab and screen, and the ability to make payments will be coming soon. Finally you'll be able to pay back all those people you owe. Loan sharks won't be coming after this little fish."
    },
    {
      date: "Aug 24, 2018",
      version: "0.3.1",
      type: "App",
      notes:
        "+ Like a questionable games night partner, we found our hints haven't quite been on point. We fixed our messaging and no longer tell you to add your Up card to your Apple Watch when you don't have one. If you have one, great! Very nice watch. Lucky you.<br/>+ In a whirlwind of class and fineness we've added some new styles when registering a new device. It doesn't stop there, this new look has made its way into a few other nooks and crannies in the app. We hope you enjoy your stay."
    },
    {
      date: "Aug 20, 2018",
      version: "0.3.0",
      type: "App",
      notes:
        "Thanks to everyone for the support of the Up beta! We hear you loud and clear and your feedback is much appreciated<br/>+ Avoid the panic attack and uncontrollable crying when you loose your card. You can now instantly lock your card to stop any unwanted transactions. You can also unlock your card when you find it between the couch cushions.<br/>+ Monthly insights are getting hot. Real hot. You can now drill down and really see how much you're spending on booze instead of groceries. That's helpful information, right?<br/>+ PayID was made for you and me. Sit back, relax and forget your BSB (and account number). PayID is now active for all inbound payments. <br/>+ Our plastic cards are starting to find their way in the world. We also made it a bit easier to follow your cards journey to you!<br/>+ Cover your tracks! We've added device de-registration so you can keep your data secure. Dont worry though, we've made it easy to get back in. Our door is always open."
    },
    {
      date: "Aug 16, 2018",
      version: "0.2.4",
      type: "App",
      notes:
        "They say a small change is as good as a holiday.<br/>+ Minor fixes and improvements."
    },
    {
      date: "Aug 9, 2018",
      version: "0.2.3",
      type: "App",
      notes:
        "It&rsquo;s not the size of your update, it&rsquo;s what you do with it. Got a small fix in to help users who have require login on. All is well with the world."
    },
    {
      date: "Aug 26, 2018",
      version: "0.2.2",
      type: "App",
      notes:
        "Welcome to our newest batch of beta users! We are still polishing parts of the App so your support and feedback is needed now more than ever!<br/>+ We didn't want to lose face so now use yours to unlock the app (don't get touchy - you can use your fingerprint if your phone does that too)<br/>+ Someone kicked out the microphone lead and a few of the new people haven't been able to hear us. Our techs have plugged us back in and Notifications are working for all again. Hoorah!<br/>+ So turns out 'Times New Roman' is not as popular as it used to be. Our expert font team has hand picked a geometric sans serif with unmistakeable character yet universal appeal."
    },
    {
      date: "Jul 9, 2018",
      version: "0.2.1",
      type: "App",
      notes:
        "You wanted the best... Well, we are still working on it.<br/>+ As a welcome to our newest batch of beta users we gave the UI a bit of a tidy up.<br/>+ And for the users that are already here, we called the exterminator to vanquish some bugs.<br/>+ To those still waiting in line, we are coming around with snacks and fizzy drinks while you wait. Hang tight. We will get you through."
    }
  ],
  cards = [
    {
      id: "set_timezone",
      title: "Set Australian Timezone",
      status: "shipped",
      desc: "Set the timezone in Australia your transactions appear in.",
      section: "profile"
    },
    {
      id: "update_email",
      title: "Update email address",
      status: "shipped",
      desc: "Update and confirm your email address with Up.",
      section: "profile"
    },
    {
      id: "update_phone",
      title: "Update phone number",
      status: "shipped",
      desc: "Update and confirm your phone number with Up.",
      section: "profile"
    },
    {
      id: "update_address",
      title: "Update postal address",
      status: "in development",
      desc: "Update your postal address",
      section: "profile"
    },
    {
      id: "update_avatar",
      title: "Update profile picture",
      status: "planned",
      desc: "Set and change your profile pic",
      section: "profile"
    },
    {
      id: "close_account",
      title: "Close your Up account",
      status: "planned",
      desc: "Close your Up account &#128546;",
      section: "profile"
    },
    {
      id: "applepay",
      title: "Apple Pay",
      status: "shipped",
      desc: "Use your iPhone or Apple Watch to make purchases.",
      section: "cards"
    },
    {
      id: "applepay_instant",
      title: "Apple Pay -\xa0Instant Provisioning",
      status: "shipped",
      desc: "Set up Apple Pay before your card arrives.",
      section: "cards"
    },
    {
      id: "googlepay",
      title: "Google Pay",
      status: "shipped",
      desc: "Use your Android device to make purchases.",
      section: "cards"
    },
    {
      id: "googlepay_instant",
      title: "Google Pay -\xa0Instant Provisioning",
      status: "in development",
      desc: "Set up Google Pay before your card arrives.",
      estimate: "2019q2",
      demand: "high",
      section: "cards"
    },
    {
      id: "fitbitpay",
      title: "Fitbit Pay",
      status: "shipped",
      desc: "Use your supported Fitbit device to make purchases.",
      section: "cards"
    },
    {
      id: "garminpay",
      title: "Garmin Pay",
      status: "shipped",
      desc: "Use your supported Garmin device to make purchases.",
      section: "cards"
    },
    {
      id: "samsungpay",
      title: "Samsung Pay",
      status: "shipped",
      desc: "Use your supported Samsung device to make purchases.",
      section: "cards"
    },
    {
      id: "block_card",
      title: "Block Card",
      status: "shipped",
      desc: "Activate or Deactivate your card from the Up app.",
      section: "cards"
    },
    {
      id: "card_controls",
      title: "Card Controls",
      status: "shipped",
      desc: "Fine-grained control over how your Up card can be used.",
      section: "cards"
    },
    {
      id: "report_card",
      title: "Report card lost/stolen",
      status: "in development",
      desc:
        "Ability to use the app to report your card as lost or stolen and have a new card issued.",
      section: "cards"
    },
    {
      id: "virtual_cards",
      title: "Virtual Cards",
      status: "planned",
      desc: "Create single-use or per-merchant card numbers.",
      demand: "med",
      section: "cards"
    },
    {
      id: "card_details",
      title: "In-app Card Details",
      status: "planned",
      desc: "View your card number, expiry and CVV from the Up app.",
      estimate: "2019q3",
      demand: "med",
      section: "cards"
    },
    {
      id: "transactional_account",
      title: "Transactional",
      status: "shipped",
      desc:
        "A transaction account with no monthly fees and a attached debit card.",
      section: "accounts"
    },
    {
      id: "additional_accounts",
      title: "Additional Accounts",
      status: "planned",
      desc: "Ability to create addition transactional accounts.",
      demand: "high",
      section: "accounts"
    },
    {
      id: "joint_accounts",
      title: "Joint Accounts",
      status: "planned",
      desc: "Ability to create an account shared by two people.",
      demand: "high",
      section: "accounts"
    },
    {
      id: "shared_accounts",
      title: "Shared Accounts",
      status: "planned",
      desc: "Ability to create an account shared by two or more people.",
      estimate: "",
      demand: "high",
      section: "accounts"
    },
    {
      id: "high_interest_saver",
      title: "High-Interest Saver",
      status: "shipped",
      desc: "Savings account with no monthly fees and competitive rate.",
      section: "accounts"
    },
    {
      id: "shared_savers",
      title: "Shared Savers",
      status: "planned",
      desc: "Ability to create a Saver shared by two or more people.",
      demand: "med",
      section: "accounts"
    },
    {
      id: "roundups",
      title: "Round-ups",
      status: "shipped",
      desc: "Round up purchases to the nearest dollar and save the change.",
      section: "accounts"
    },
    {
      id: "roundup_options",
      title: "Round-up Options",
      status: "planned",
      estimate: "2019q3",
      desc:
        "Configure round-ups to round up larger amounts as well as whole-dollar purchases.",
      section: "accounts"
    },
    {
      id: "linked_roundups",
      title: "Linked Account Round-ups",
      status: "planned",
      estimate: "2019q3",
      desc: "Round up to external accounts like your mortgage or credit card.",
      section: "accounts"
    },
    {
      id: "deposit_withdrawal",
      title: "Deposit & Withdrawals",
      status: "shipped",
      desc: "Deposit and withdraw money from a Saver.",
      section: "accounts"
    },
    {
      id: "transfer_between",
      title: "Transfer Between Savers",
      status: "planned",
      estimate: "2019q3",
      desc: "Transfer money directly between Savers.",
      section: "accounts"
    },
    {
      id: "automated_transfers",
      title: "Automated Transfers",
      status: "planned",
      estimate: "2019q3",
      desc: "Set up an automated savings plan for each Saver.",
      section: "accounts"
    },
    {
      id: "payanyone",
      title: "Pay Anyone",
      status: "shipped",
      desc:
        "Make payments to other bank accounts via standard bank transfer (sometimes called direct entry).",
      section: "payments"
    },
    {
      id: "osko",
      title: "Osko Payments",
      status: "shipped",
      desc: "Make payments via the new, near real-time Osko payments network.",
      section: "payments"
    },
    {
      id: "scheduled_payments",
      title: "Scheduled Payments",
      status: "in development",
      estimate: "2019q2",
      desc: "Schedule a date in the future for a payment to be sent.",
      section: "payments"
    },
    {
      id: "recurring_payments",
      title: "Recurring Payments",
      status: "in development",
      estimate: "2019q2",
      desc: "Set up payments that repeat at a given frequency",
      section: "payments"
    },
    {
      id: "pay_phone_contacts",
      title: "Pay Phone Contacts",
      status: "shipped",
      desc: "Create payments to contacts from your phone's address book",
      section: "payments"
    },
    {
      id: "contacts_on_up",
      title: "Contacts on Up",
      status: "planned",
      estimate: "2019q3",
      desc:
        "Use your phone's address book to find friends on Up or be notified when they join.",
      section: "payments"
    },
    {
      id: "register_payids",
      title: "Register PayIDs",
      status: "shipped",
      desc: "Register your email and phone number as PayIDs on Up.",
      section: "payments"
    },
    {
      id: "generated_payid",
      title: "Generated PayID",
      status: "shipped",
      desc:
        "A PayID provided on sign-up that can be used to fund your Up account.",
      section: "payments"
    },
    {
      id: "register_up_handle",
      title: "Register Up Handle",
      status: "planned",
      estimate: "2019q3",
      desc:
        'Your Up "username" that makes it easy to get paid by other Upsiders.',
      section: "payments"
    },
    {
      id: "request_money",
      title: "Request Money",
      status: "planned",
      estimate: "2019q3",
      desc: "Request money simply and easily from other Upsiders.",
      section: "payments"
    },
    {
      id: "split_bills",
      title: "Split Bills",
      status: "planned",
      estimate: "",
      desc: "Split bills easily from a receipt with other Upsiders.",
      section: "payments"
    },
    {
      id: "linked_accounts",
      title: "Linked Accounts",
      status: "shipped",
      desc: "Identify your external accounts in Up.",
      section: "payments"
    },
    {
      id: "bpay",
      title: "BPay",
      status: "planned",
      estimate: "2019q3",
      desc: "Support for paying bills with BPay.",
      section: "payments"
    },
    {
      id: "up_on_up_payments",
      title: "Up on Up Payments",
      status: "planned",
      estimate: "2019q3",
      desc: "Enhanced, instant payments to other Upsiders.",
      section: "payments"
    },
    {
      id: "identify_pay",
      title: "Identify Pay/Salary",
      status: "planned",
      estimate: "2019q3",
      desc: "Identify your incoming Pay/Salary.",
      section: "payments"
    },
    {
      id: "auto_transfer_pay",
      title: "Auto Transfer of Pay/Salary",
      status: "planned",
      estimate: "2019q3",
      desc:
        "Automatically transfer a percentage of your pay to Savers when you get paid.",
      section: "payments"
    },
    {
      id: "search_activity",
      title: "Search Activity",
      status: "planned",
      estimate: "",
      desc: "Lightning-fast in-app search of your transactions and activity.",
      section: "activity"
    },
    {
      id: "smart_receipts",
      title: "Smart Receipts",
      status: "shipped",
      desc:
        "Ability to see enhanced data on receipts. Note: big area that we've only just started.",
      section: "activity"
    },
    {
      id: "afterpay",
      title: "Smart Receipts: Afterpay",
      status: "shipped",
      desc:
        "Ability to see enhanced data from Afterpay on receipts, including future payments",
      section: "activity"
    },
    {
      id: "merchant_id",
      title: "Merchant ID",
      status: "shipped",
      desc:
        "Merchant ID system to map your transaction descriptions to real merchants.",
      section: "activity"
    },
    {
      id: "crowdsourced_merchant_id",
      title: "Crowdsourced Identification",
      status: "shipped",
      desc:
        "Customers can help identify merchants and those suggestions can be propagated to all customers.",
      section: "activity"
    },
    {
      id: "transaction_categoriser",
      title: "Transaction Categoriser",
      status: "shipped",
      desc: "Taxonomy of categories than can be applied to transactions.",
      section: "activity"
    },
    {
      id: "tag_transactions",
      title: "Tag Transactions",
      status: "in development",
      desc:
        "Ability for customers to tag transactions with their own categories.",
      section: "activity"
    },
    {
      id: "add_notes_attachments",
      title: "Add txn notes & attachments",
      status: "planned",
      estimate: "",
      desc:
        "Ability for customers to add notes or attached photos/files to transactions.",
      section: "activity"
    },
    {
      id: "monthly_insights",
      title: "Monthly Insights",
      status: "shipped",
      desc: "A monthly report on spending and saving insights.",
      section: "activity"
    },
    {
      id: "compare_months",
      title: "Compare Months",
      status: "planned",
      estimate: "",
      desc: "Ability to easily compare spending and saving between months.",
      section: "activity"
    },
    {
      id: "location_insights",
      title: "Location Insights",
      status: "shipped",
      desc:
        "Reports on key locations of spending. Still much more to do on this.",
      section: "activity"
    },
    {
      id: "budgeting",
      title: "Budgeting",
      status: "planned",
      estimate: "",
      desc:
        "Ability to set spending limits on specific categories or across the board.",
      section: "activity"
    },
    {
      id: "spendable_balance",
      title: "Spendable Balance",
      status: "planned",
      estimate: "",
      desc:
        "A balance figure that takes into account the money you have, spending committments and your pay cycle.",
      section: "activity"
    },
    {
      id: "regulars",
      title: "Regulars",
      status: "shipped",
      desc: "Basic detection of regular recurring charges.",
      section: "upcoming"
    },
    {
      id: "regulars_add",
      title: "Manually Add Regulars",
      status: "in development",
      estimate: "2019q2",
      desc: "Ability to manually add regular charges to Upcoming.",
      section: "upcoming"
    },
    {
      id: "regulars_edit_delete",
      title: "Edit/Delete Regulars",
      status: "in development",
      estimate: "2019q2",
      desc: "Ability to manually edit and delete Regulars.",
      section: "upcoming"
    },
    {
      id: "upcoming_payments",
      title: "Upcoming Payments",
      status: "shipped",
      desc: "Ability to see upcoming scheduled payments.",
      section: "upcoming"
    },
    {
      id: "scheduled_transfers",
      title: "Scheduled Transfers",
      status: "planned",
      estimate: "",
      desc: "Ability to see scheduled savings contributions.",
      section: "upcoming"
    },
    {
      id: "create_conversation",
      title: "Talk to Us",
      status: "shipped",
      desc:
        "Begin an in-app conversation to get help, suggest ideas or file bugs.",
      section: "talktous"
    },
    {
      id: "attach_screenshot",
      title: "Attach Screenshot",
      status: "shipped",
      desc: "Attach a photo or screenshot to a conversation.",
      section: "talktous"
    },
    {
      id: "attach_video",
      title: "Attach Video",
      status: "planned",
      estimate: "",
      desc: "Attach a video to a conversation.",
      section: "talktous"
    },
    {
      id: "attach_transaction",
      title: "Attach Transaction",
      status: "planned",
      estimate: "",
      desc: "Attach a transaction receipt to a conversation.",
      section: "talktous"
    },
    {
      id: "dispute_transaction",
      title: "Dispute Transaction",
      status: "planned",
      estimate: "",
      desc: "Dispute a card payment end-to-end from within the Up app.",
      section: "talktous"
    },
    {
      id: "surveys_updates",
      title: "Surveys & Updates",
      status: "planned",
      estimate: "",
      desc:
        "Support for other kinds of conversations including surveys and updates.",
      section: "talktous"
    },
    {
      id: "ui_iphone",
      title: "iPhone App",
      status: "shipped",
      desc: "Up iPhone application.",
      section: "access_data"
    },
    {
      id: "ui_android",
      title: "Android App",
      status: "shipped",
      desc: "Up Android application.",
      section: "access_data"
    },
    {
      id: "ui_apple_watch",
      title: "Apple Watch App",
      status: "shipped",
      desc: "Up Apple Watch app.",
      section: "access_data"
    },
    {
      id: "ui_tablet",
      title: "Apple Tablet App",
      status: "planned",
      estimate: "",
      desc: "Support for using Up with a native iPad app.",
      section: "access_data"
    },
    {
      id: "ui_web",
      title: "Up Web Interface",
      status: "planned",
      estimate: "",
      desc: "Support for accessing Up through a web browser.",
      section: "access_data"
    },
    {
      id: "file_exports",
      title: "File Exports",
      status: "planned",
      estimate: "",
      desc: "Support for exporting transaction data in a variety of formats.",
      section: "access_data"
    },
    {
      id: "oauth_read",
      title: "OAuth API (read only)",
      status: "planned",
      estimate: "",
      desc:
        "Initial support for an open read-only API using OAuth to authenticate.",
      section: "access_data"
    },
    {
      id: "open_banking",
      title: "Open Banking Support",
      status: "planned",
      estimate: "",
      desc:
        "Support for the Australian Open Banking standards (once they arrive).",
      section: "access_data"
    },
    {
      id: "oauth_write",
      title: "OAuth API (write)",
      status: "planned",
      estimate: "",
      desc: "Support for full control of your Up account via an API.",
      section: "access_data"
    },
    {
      id: "realtime_webhooks",
      title: "Real-time Webhooks",
      status: "planned",
      estimate: "",
      desc:
        "Support for ability to have Up notify your application in real-time of events.",
      section: "access_data"
    }
  ],
  cpos = {
    x: 0,
    y: 0,
    scale: 0,
    swidth: 0,
    sheight: 0,
    min_scale: 0,
    max_scale: 5,
    nohide: !1
  },
  viewport = { width: 0, height: 0 },
  dragging = !1,
  last_coord = { x: 0, y: 0 },
  first_coord = { x: 0, y: 0 },
  pinch_scale = 1;

function test() {
  var e = $("#viewer");
  svg = $("svg");

  var [t, n, o, r] = svg.attr("viewBox").split(" ");
  (cpos.swidth = o),
    (cpos.sheight = r),
    (viewport.width = e.width()),
    (viewport.height = e.height());
  var i = viewport.height / 2,
    a = i / 600;
  cpos.scale = a;
  var s = viewport.width / cpos.swidth,
    u = viewport.height / cpos.sheight;
  (cpos.min_scale = s < u ? s : u),
    (cpos.x = (viewport.width - a * o) / 2),
    svg.css("left", cpos.x),
    svg.css("width", a * o),
    svg.css("height", a * r),
    e.on("mousedown touchstart", beginDrag),
    $(window).on("mouseup touchend", endDrag),
    $(window).on("mousemove touchmove", doDrag),
    e.on("dblclick", zoomOnPoint),
    e.on("gesturestart", beginPinch),
    e.on("gesturechange", doPinch),
    e.on("wheel", doWheel),
    $("#intro,#whiteout").on("mouseup touchend", function() {
      $("#intro,#whiteout").fadeOut();
    }),
    renderNotes(),
    renderCalendar(),
    $(".shipped,.calendar").on("touchstart", function(e) {
      return e.preventDefault(), e.stopPropagation(), !1;
    }),
    $(".shipped").on("touchend mouseup", function(e) {
      return (
        $("#released").toggleClass("show"),
        e.preventDefault(),
        e.stopPropagation(),
        !1
      );
    }),
    $(".calendar").on("touchend mouseup", function(e) {
      return (
        $("#calendar").toggleClass("show"),
        e.preventDefault(),
        e.stopPropagation(),
        !1
      );
    }),
    $(".close").on("touchend mouseup", function(e) {
      return (
        $(this)
          .parent()
          .removeClass("show"),
        e.preventDefault(),
        e.stopPropagation(),
        !1
      );
    }),
    $("svg .feature").on("click touchend", function(e) {
      e.preventDefault(), e.stopPropagation();
      var t = {
        x: last_coord.x - first_coord.x,
        y: last_coord.y - first_coord.y
      };
      return (
        !(Math.abs(t.x) > 2 || Math.abs(t.y) > 2) &&
        (renderCard(getCard($(this).attr("id"))),
        $("#popup")
          .css({ left: last_coord.x - 10, top: last_coord.y - 180 })
          .show(),
        !1)
      );
    });
}
