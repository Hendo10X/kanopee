import { jsx as d, jsxs as w } from "react/jsx-runtime";
import * as N from "react";
import U, { useCallback as I, useState as R, useRef as V, useMemo as D, useEffect as P } from "react";
import { flushSync as q } from "react-dom";
import { buildTree as X, buildNodeMap as Y, flattenTree as G } from "@kanopee/core";
function C(l, r, e) {
  let t = e.initialDeps ?? [], s, n = !0;
  function i() {
    var o, a, u;
    let f;
    e.key && ((o = e.debug) != null && o.call(e)) && (f = Date.now());
    const c = l();
    if (!(c.length !== t.length || c.some((p, M) => t[M] !== p)))
      return s;
    t = c;
    let h;
    if (e.key && ((a = e.debug) != null && a.call(e)) && (h = Date.now()), s = r(...c), e.key && ((u = e.debug) != null && u.call(e))) {
      const p = Math.round((Date.now() - f) * 100) / 100, M = Math.round((Date.now() - h) * 100) / 100, v = M / 16, y = (x, E) => {
        for (x = String(x); x.length < E; )
          x = " " + x;
        return x;
      };
      console.info(
        `%c⏱ ${y(M, 5)} /${y(p, 5)} ms`,
        `
            font-size: .6rem;
            font-weight: bold;
            color: hsl(${Math.max(
          0,
          Math.min(120 - 120 * v, 120)
        )}deg 100% 31%);`,
        e == null ? void 0 : e.key
      );
    }
    return e != null && e.onChange && !(n && e.skipInitialOnChange) && e.onChange(s), n = !1, s;
  }
  return i.updateDeps = (o) => {
    t = o;
  }, i;
}
function k(l, r) {
  if (l === void 0)
    throw new Error("Unexpected undefined");
  return l;
}
const J = (l, r) => Math.abs(l - r) < 1.01, Q = (l, r, e) => {
  let t;
  return function(...s) {
    l.clearTimeout(t), t = l.setTimeout(() => r.apply(this, s), e);
  };
}, L = (l) => {
  const { offsetWidth: r, offsetHeight: e } = l;
  return { width: r, height: e };
}, Z = (l) => l, ee = (l) => {
  const r = Math.max(l.startIndex - l.overscan, 0), e = Math.min(l.endIndex + l.overscan, l.count - 1), t = [];
  for (let s = r; s <= e; s++)
    t.push(s);
  return t;
}, te = (l, r) => {
  const e = l.scrollElement;
  if (!e)
    return;
  const t = l.targetWindow;
  if (!t)
    return;
  const s = (i) => {
    const { width: o, height: a } = i;
    r({ width: Math.round(o), height: Math.round(a) });
  };
  if (s(L(e)), !t.ResizeObserver)
    return () => {
    };
  const n = new t.ResizeObserver((i) => {
    const o = () => {
      const a = i[0];
      if (a != null && a.borderBoxSize) {
        const u = a.borderBoxSize[0];
        if (u) {
          s({ width: u.inlineSize, height: u.blockSize });
          return;
        }
      }
      s(L(e));
    };
    l.options.useAnimationFrameWithResizeObserver ? requestAnimationFrame(o) : o();
  });
  return n.observe(e, { box: "border-box" }), () => {
    n.unobserve(e);
  };
}, j = {
  passive: !0
}, W = typeof window > "u" ? !0 : "onscrollend" in window, se = (l, r) => {
  const e = l.scrollElement;
  if (!e)
    return;
  const t = l.targetWindow;
  if (!t)
    return;
  let s = 0;
  const n = l.options.useScrollendEvent && W ? () => {
  } : Q(
    t,
    () => {
      r(s, !1);
    },
    l.options.isScrollingResetDelay
  ), i = (f) => () => {
    const { horizontal: c, isRtl: g } = l.options;
    s = c ? e.scrollLeft * (g && -1 || 1) : e.scrollTop, n(), r(s, f);
  }, o = i(!0), a = i(!1);
  e.addEventListener("scroll", o, j);
  const u = l.options.useScrollendEvent && W;
  return u && e.addEventListener("scrollend", a, j), () => {
    e.removeEventListener("scroll", o), u && e.removeEventListener("scrollend", a);
  };
}, ne = (l, r, e) => {
  if (r != null && r.borderBoxSize) {
    const t = r.borderBoxSize[0];
    if (t)
      return Math.round(
        t[e.options.horizontal ? "inlineSize" : "blockSize"]
      );
  }
  return l[e.options.horizontal ? "offsetWidth" : "offsetHeight"];
}, ie = (l, {
  adjustments: r = 0,
  behavior: e
}, t) => {
  var s, n;
  const i = l + r;
  (n = (s = t.scrollElement) == null ? void 0 : s.scrollTo) == null || n.call(s, {
    [t.options.horizontal ? "left" : "top"]: i,
    behavior: e
  });
};
class oe {
  constructor(r) {
    this.unsubs = [], this.scrollElement = null, this.targetWindow = null, this.isScrolling = !1, this.scrollState = null, this.measurementsCache = [], this.itemSizeCache = /* @__PURE__ */ new Map(), this.laneAssignments = /* @__PURE__ */ new Map(), this.pendingMeasuredCacheIndexes = [], this.prevLanes = void 0, this.lanesChangedFlag = !1, this.lanesSettling = !1, this.scrollRect = null, this.scrollOffset = null, this.scrollDirection = null, this.scrollAdjustments = 0, this.elementsCache = /* @__PURE__ */ new Map(), this.now = () => {
      var e, t, s;
      return ((s = (t = (e = this.targetWindow) == null ? void 0 : e.performance) == null ? void 0 : t.now) == null ? void 0 : s.call(t)) ?? Date.now();
    }, this.observer = /* @__PURE__ */ (() => {
      let e = null;
      const t = () => e || (!this.targetWindow || !this.targetWindow.ResizeObserver ? null : e = new this.targetWindow.ResizeObserver((s) => {
        s.forEach((n) => {
          const i = () => {
            const o = n.target, a = this.indexFromElement(o);
            if (!o.isConnected) {
              this.observer.unobserve(o);
              return;
            }
            this.shouldMeasureDuringScroll(a) && this.resizeItem(
              a,
              this.options.measureElement(o, n, this)
            );
          };
          this.options.useAnimationFrameWithResizeObserver ? requestAnimationFrame(i) : i();
        });
      }));
      return {
        disconnect: () => {
          var s;
          (s = t()) == null || s.disconnect(), e = null;
        },
        observe: (s) => {
          var n;
          return (n = t()) == null ? void 0 : n.observe(s, { box: "border-box" });
        },
        unobserve: (s) => {
          var n;
          return (n = t()) == null ? void 0 : n.unobserve(s);
        }
      };
    })(), this.range = null, this.setOptions = (e) => {
      Object.entries(e).forEach(([t, s]) => {
        typeof s > "u" && delete e[t];
      }), this.options = {
        debug: !1,
        initialOffset: 0,
        overscan: 1,
        paddingStart: 0,
        paddingEnd: 0,
        scrollPaddingStart: 0,
        scrollPaddingEnd: 0,
        horizontal: !1,
        getItemKey: Z,
        rangeExtractor: ee,
        onChange: () => {
        },
        measureElement: ne,
        initialRect: { width: 0, height: 0 },
        scrollMargin: 0,
        gap: 0,
        indexAttribute: "data-index",
        initialMeasurementsCache: [],
        lanes: 1,
        isScrollingResetDelay: 150,
        enabled: !0,
        isRtl: !1,
        useScrollendEvent: !1,
        useAnimationFrameWithResizeObserver: !1,
        laneAssignmentMode: "estimate",
        ...e
      };
    }, this.notify = (e) => {
      var t, s;
      (s = (t = this.options).onChange) == null || s.call(t, this, e);
    }, this.maybeNotify = C(
      () => (this.calculateRange(), [
        this.isScrolling,
        this.range ? this.range.startIndex : null,
        this.range ? this.range.endIndex : null
      ]),
      (e) => {
        this.notify(e);
      },
      {
        key: process.env.NODE_ENV !== "production" && "maybeNotify",
        debug: () => this.options.debug,
        initialDeps: [
          this.isScrolling,
          this.range ? this.range.startIndex : null,
          this.range ? this.range.endIndex : null
        ]
      }
    ), this.cleanup = () => {
      this.unsubs.filter(Boolean).forEach((e) => e()), this.unsubs = [], this.observer.disconnect(), this.rafId != null && this.targetWindow && (this.targetWindow.cancelAnimationFrame(this.rafId), this.rafId = null), this.scrollState = null, this.scrollElement = null, this.targetWindow = null;
    }, this._didMount = () => () => {
      this.cleanup();
    }, this._willUpdate = () => {
      var e;
      const t = this.options.enabled ? this.options.getScrollElement() : null;
      if (this.scrollElement !== t) {
        if (this.cleanup(), !t) {
          this.maybeNotify();
          return;
        }
        this.scrollElement = t, this.scrollElement && "ownerDocument" in this.scrollElement ? this.targetWindow = this.scrollElement.ownerDocument.defaultView : this.targetWindow = ((e = this.scrollElement) == null ? void 0 : e.window) ?? null, this.elementsCache.forEach((s) => {
          this.observer.observe(s);
        }), this.unsubs.push(
          this.options.observeElementRect(this, (s) => {
            this.scrollRect = s, this.maybeNotify();
          })
        ), this.unsubs.push(
          this.options.observeElementOffset(this, (s, n) => {
            this.scrollAdjustments = 0, this.scrollDirection = n ? this.getScrollOffset() < s ? "forward" : "backward" : null, this.scrollOffset = s, this.isScrolling = n, this.scrollState && this.scheduleScrollReconcile(), this.maybeNotify();
          })
        ), this._scrollToOffset(this.getScrollOffset(), {
          adjustments: void 0,
          behavior: void 0
        });
      }
    }, this.rafId = null, this.getSize = () => this.options.enabled ? (this.scrollRect = this.scrollRect ?? this.options.initialRect, this.scrollRect[this.options.horizontal ? "width" : "height"]) : (this.scrollRect = null, 0), this.getScrollOffset = () => this.options.enabled ? (this.scrollOffset = this.scrollOffset ?? (typeof this.options.initialOffset == "function" ? this.options.initialOffset() : this.options.initialOffset), this.scrollOffset) : (this.scrollOffset = null, 0), this.getFurthestMeasurement = (e, t) => {
      const s = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map();
      for (let i = t - 1; i >= 0; i--) {
        const o = e[i];
        if (s.has(o.lane))
          continue;
        const a = n.get(
          o.lane
        );
        if (a == null || o.end > a.end ? n.set(o.lane, o) : o.end < a.end && s.set(o.lane, !0), s.size === this.options.lanes)
          break;
      }
      return n.size === this.options.lanes ? Array.from(n.values()).sort((i, o) => i.end === o.end ? i.index - o.index : i.end - o.end)[0] : void 0;
    }, this.getMeasurementOptions = C(
      () => [
        this.options.count,
        this.options.paddingStart,
        this.options.scrollMargin,
        this.options.getItemKey,
        this.options.enabled,
        this.options.lanes,
        this.options.laneAssignmentMode
      ],
      (e, t, s, n, i, o, a) => (this.prevLanes !== void 0 && this.prevLanes !== o && (this.lanesChangedFlag = !0), this.prevLanes = o, this.pendingMeasuredCacheIndexes = [], {
        count: e,
        paddingStart: t,
        scrollMargin: s,
        getItemKey: n,
        enabled: i,
        lanes: o,
        laneAssignmentMode: a
      }),
      {
        key: !1
      }
    ), this.getMeasurements = C(
      () => [this.getMeasurementOptions(), this.itemSizeCache],
      ({
        count: e,
        paddingStart: t,
        scrollMargin: s,
        getItemKey: n,
        enabled: i,
        lanes: o,
        laneAssignmentMode: a
      }, u) => {
        if (!i)
          return this.measurementsCache = [], this.itemSizeCache.clear(), this.laneAssignments.clear(), [];
        if (this.laneAssignments.size > e)
          for (const h of this.laneAssignments.keys())
            h >= e && this.laneAssignments.delete(h);
        this.lanesChangedFlag && (this.lanesChangedFlag = !1, this.lanesSettling = !0, this.measurementsCache = [], this.itemSizeCache.clear(), this.laneAssignments.clear(), this.pendingMeasuredCacheIndexes = []), this.measurementsCache.length === 0 && !this.lanesSettling && (this.measurementsCache = this.options.initialMeasurementsCache, this.measurementsCache.forEach((h) => {
          this.itemSizeCache.set(h.key, h.size);
        }));
        const f = this.lanesSettling ? 0 : this.pendingMeasuredCacheIndexes.length > 0 ? Math.min(...this.pendingMeasuredCacheIndexes) : 0;
        this.pendingMeasuredCacheIndexes = [], this.lanesSettling && this.measurementsCache.length === e && (this.lanesSettling = !1);
        const c = this.measurementsCache.slice(0, f), g = new Array(o).fill(
          void 0
        );
        for (let h = 0; h < f; h++) {
          const p = c[h];
          p && (g[p.lane] = h);
        }
        for (let h = f; h < e; h++) {
          const p = n(h), M = this.laneAssignments.get(h);
          let v, y;
          const x = a === "estimate" || u.has(p);
          if (M !== void 0 && this.options.lanes > 1) {
            v = M;
            const b = g[v], O = b !== void 0 ? c[b] : void 0;
            y = O ? O.end + this.options.gap : t + s;
          } else {
            const b = this.options.lanes === 1 ? c[h - 1] : this.getFurthestMeasurement(c, h);
            y = b ? b.end + this.options.gap : t + s, v = b ? b.lane : h % this.options.lanes, this.options.lanes > 1 && x && this.laneAssignments.set(h, v);
          }
          const E = u.get(p), A = typeof E == "number" ? E : this.options.estimateSize(h), z = y + A;
          c[h] = {
            index: h,
            start: y,
            size: A,
            end: z,
            key: p,
            lane: v
          }, g[v] = h;
        }
        return this.measurementsCache = c, c;
      },
      {
        key: process.env.NODE_ENV !== "production" && "getMeasurements",
        debug: () => this.options.debug
      }
    ), this.calculateRange = C(
      () => [
        this.getMeasurements(),
        this.getSize(),
        this.getScrollOffset(),
        this.options.lanes
      ],
      (e, t, s, n) => this.range = e.length > 0 && t > 0 ? le({
        measurements: e,
        outerSize: t,
        scrollOffset: s,
        lanes: n
      }) : null,
      {
        key: process.env.NODE_ENV !== "production" && "calculateRange",
        debug: () => this.options.debug
      }
    ), this.getVirtualIndexes = C(
      () => {
        let e = null, t = null;
        const s = this.calculateRange();
        return s && (e = s.startIndex, t = s.endIndex), this.maybeNotify.updateDeps([this.isScrolling, e, t]), [
          this.options.rangeExtractor,
          this.options.overscan,
          this.options.count,
          e,
          t
        ];
      },
      (e, t, s, n, i) => n === null || i === null ? [] : e({
        startIndex: n,
        endIndex: i,
        overscan: t,
        count: s
      }),
      {
        key: process.env.NODE_ENV !== "production" && "getVirtualIndexes",
        debug: () => this.options.debug
      }
    ), this.indexFromElement = (e) => {
      const t = this.options.indexAttribute, s = e.getAttribute(t);
      return s ? parseInt(s, 10) : (console.warn(
        `Missing attribute name '${t}={index}' on measured element.`
      ), -1);
    }, this.shouldMeasureDuringScroll = (e) => {
      var t;
      if (!this.scrollState || this.scrollState.behavior !== "smooth")
        return !0;
      const s = this.scrollState.index ?? ((t = this.getVirtualItemForOffset(this.scrollState.lastTargetOffset)) == null ? void 0 : t.index);
      if (s !== void 0 && this.range) {
        const n = Math.max(
          this.options.overscan,
          Math.ceil((this.range.endIndex - this.range.startIndex) / 2)
        ), i = Math.max(0, s - n), o = Math.min(
          this.options.count - 1,
          s + n
        );
        return e >= i && e <= o;
      }
      return !0;
    }, this.measureElement = (e) => {
      if (!e) {
        this.elementsCache.forEach((i, o) => {
          i.isConnected || (this.observer.unobserve(i), this.elementsCache.delete(o));
        });
        return;
      }
      const t = this.indexFromElement(e), s = this.options.getItemKey(t), n = this.elementsCache.get(s);
      n !== e && (n && this.observer.unobserve(n), this.observer.observe(e), this.elementsCache.set(s, e)), (!this.isScrolling || this.scrollState) && this.shouldMeasureDuringScroll(t) && this.resizeItem(t, this.options.measureElement(e, void 0, this));
    }, this.resizeItem = (e, t) => {
      var s;
      const n = this.measurementsCache[e];
      if (!n) return;
      const i = this.itemSizeCache.get(n.key) ?? n.size, o = t - i;
      o !== 0 && (((s = this.scrollState) == null ? void 0 : s.behavior) !== "smooth" && (this.shouldAdjustScrollPositionOnItemSizeChange !== void 0 ? this.shouldAdjustScrollPositionOnItemSizeChange(n, o, this) : n.start < this.getScrollOffset() + this.scrollAdjustments) && (process.env.NODE_ENV !== "production" && this.options.debug && console.info("correction", o), this._scrollToOffset(this.getScrollOffset(), {
        adjustments: this.scrollAdjustments += o,
        behavior: void 0
      })), this.pendingMeasuredCacheIndexes.push(n.index), this.itemSizeCache = new Map(this.itemSizeCache.set(n.key, t)), this.notify(!1));
    }, this.getVirtualItems = C(
      () => [this.getVirtualIndexes(), this.getMeasurements()],
      (e, t) => {
        const s = [];
        for (let n = 0, i = e.length; n < i; n++) {
          const o = e[n], a = t[o];
          s.push(a);
        }
        return s;
      },
      {
        key: process.env.NODE_ENV !== "production" && "getVirtualItems",
        debug: () => this.options.debug
      }
    ), this.getVirtualItemForOffset = (e) => {
      const t = this.getMeasurements();
      if (t.length !== 0)
        return k(
          t[H(
            0,
            t.length - 1,
            (s) => k(t[s]).start,
            e
          )]
        );
    }, this.getMaxScrollOffset = () => {
      if (!this.scrollElement) return 0;
      if ("scrollHeight" in this.scrollElement)
        return this.options.horizontal ? this.scrollElement.scrollWidth - this.scrollElement.clientWidth : this.scrollElement.scrollHeight - this.scrollElement.clientHeight;
      {
        const e = this.scrollElement.document.documentElement;
        return this.options.horizontal ? e.scrollWidth - this.scrollElement.innerWidth : e.scrollHeight - this.scrollElement.innerHeight;
      }
    }, this.getOffsetForAlignment = (e, t, s = 0) => {
      if (!this.scrollElement) return 0;
      const n = this.getSize(), i = this.getScrollOffset();
      t === "auto" && (t = e >= i + n ? "end" : "start"), t === "center" ? e += (s - n) / 2 : t === "end" && (e -= n);
      const o = this.getMaxScrollOffset();
      return Math.max(Math.min(o, e), 0);
    }, this.getOffsetForIndex = (e, t = "auto") => {
      e = Math.max(0, Math.min(e, this.options.count - 1));
      const s = this.getSize(), n = this.getScrollOffset(), i = this.measurementsCache[e];
      if (!i) return;
      if (t === "auto")
        if (i.end >= n + s - this.options.scrollPaddingEnd)
          t = "end";
        else if (i.start <= n + this.options.scrollPaddingStart)
          t = "start";
        else
          return [n, t];
      if (t === "end" && e === this.options.count - 1)
        return [this.getMaxScrollOffset(), t];
      const o = t === "end" ? i.end + this.options.scrollPaddingEnd : i.start - this.options.scrollPaddingStart;
      return [
        this.getOffsetForAlignment(o, t, i.size),
        t
      ];
    }, this.scrollToOffset = (e, { align: t = "start", behavior: s = "auto" } = {}) => {
      const n = this.getOffsetForAlignment(e, t), i = this.now();
      this.scrollState = {
        index: null,
        align: t,
        behavior: s,
        startedAt: i,
        lastTargetOffset: n,
        stableFrames: 0
      }, this._scrollToOffset(n, { adjustments: void 0, behavior: s }), this.scheduleScrollReconcile();
    }, this.scrollToIndex = (e, {
      align: t = "auto",
      behavior: s = "auto"
    } = {}) => {
      e = Math.max(0, Math.min(e, this.options.count - 1));
      const n = this.getOffsetForIndex(e, t);
      if (!n)
        return;
      const [i, o] = n, a = this.now();
      this.scrollState = {
        index: e,
        align: o,
        behavior: s,
        startedAt: a,
        lastTargetOffset: i,
        stableFrames: 0
      }, this._scrollToOffset(i, { adjustments: void 0, behavior: s }), this.scheduleScrollReconcile();
    }, this.scrollBy = (e, { behavior: t = "auto" } = {}) => {
      const s = this.getScrollOffset() + e, n = this.now();
      this.scrollState = {
        index: null,
        align: "start",
        behavior: t,
        startedAt: n,
        lastTargetOffset: s,
        stableFrames: 0
      }, this._scrollToOffset(s, { adjustments: void 0, behavior: t }), this.scheduleScrollReconcile();
    }, this.getTotalSize = () => {
      var e;
      const t = this.getMeasurements();
      let s;
      if (t.length === 0)
        s = this.options.paddingStart;
      else if (this.options.lanes === 1)
        s = ((e = t[t.length - 1]) == null ? void 0 : e.end) ?? 0;
      else {
        const n = Array(this.options.lanes).fill(null);
        let i = t.length - 1;
        for (; i >= 0 && n.some((o) => o === null); ) {
          const o = t[i];
          n[o.lane] === null && (n[o.lane] = o.end), i--;
        }
        s = Math.max(...n.filter((o) => o !== null));
      }
      return Math.max(
        s - this.options.scrollMargin + this.options.paddingEnd,
        0
      );
    }, this._scrollToOffset = (e, {
      adjustments: t,
      behavior: s
    }) => {
      this.options.scrollToFn(e, { behavior: s, adjustments: t }, this);
    }, this.measure = () => {
      this.itemSizeCache = /* @__PURE__ */ new Map(), this.laneAssignments = /* @__PURE__ */ new Map(), this.notify(!1);
    }, this.setOptions(r);
  }
  scheduleScrollReconcile() {
    if (!this.targetWindow) {
      this.scrollState = null;
      return;
    }
    this.rafId == null && (this.rafId = this.targetWindow.requestAnimationFrame(() => {
      this.rafId = null, this.reconcileScroll();
    }));
  }
  reconcileScroll() {
    if (!this.scrollState || !this.scrollElement) return;
    if (this.now() - this.scrollState.startedAt > 5e3) {
      this.scrollState = null;
      return;
    }
    const t = this.scrollState.index != null ? this.getOffsetForIndex(this.scrollState.index, this.scrollState.align) : void 0, s = t ? t[0] : this.scrollState.lastTargetOffset, n = 1, i = s !== this.scrollState.lastTargetOffset;
    if (!i && J(s, this.getScrollOffset())) {
      if (this.scrollState.stableFrames++, this.scrollState.stableFrames >= n) {
        this.scrollState = null;
        return;
      }
    } else
      this.scrollState.stableFrames = 0, i && (this.scrollState.lastTargetOffset = s, this.scrollState.behavior = "auto", this._scrollToOffset(s, {
        adjustments: void 0,
        behavior: "auto"
      }));
    this.scheduleScrollReconcile();
  }
}
const H = (l, r, e, t) => {
  for (; l <= r; ) {
    const s = (l + r) / 2 | 0, n = e(s);
    if (n < t)
      l = s + 1;
    else if (n > t)
      r = s - 1;
    else
      return s;
  }
  return l > 0 ? l - 1 : 0;
};
function le({
  measurements: l,
  outerSize: r,
  scrollOffset: e,
  lanes: t
}) {
  const s = l.length - 1, n = (a) => l[a].start;
  if (l.length <= t)
    return {
      startIndex: 0,
      endIndex: s
    };
  let i = H(
    0,
    s,
    n,
    e
  ), o = i;
  if (t === 1)
    for (; o < s && l[o].end < e + r; )
      o++;
  else if (t > 1) {
    const a = Array(t).fill(0);
    for (; o < s && a.some((f) => f < e + r); ) {
      const f = l[o];
      a[f.lane] = f.end, o++;
    }
    const u = Array(t).fill(e + r);
    for (; i >= 0 && u.some((f) => f >= e); ) {
      const f = l[i];
      u[f.lane] = f.start, i--;
    }
    i = Math.max(0, i - i % t), o = Math.min(s, o + (t - 1 - o % t));
  }
  return { startIndex: i, endIndex: o };
}
const B = typeof document < "u" ? N.useLayoutEffect : N.useEffect;
function re({
  useFlushSync: l = !0,
  ...r
}) {
  const e = N.useReducer(() => ({}), {})[1], t = {
    ...r,
    onChange: (n, i) => {
      var o;
      l && i ? q(e) : e(), (o = r.onChange) == null || o.call(r, n, i);
    }
  }, [s] = N.useState(
    () => new oe(t)
  );
  return s.setOptions(t), B(() => s._didMount(), []), B(() => s._willUpdate()), s;
}
function ae(l) {
  return re({
    observeElementRect: te,
    observeElementOffset: se,
    scrollToFn: ie,
    ...l
  });
}
function ce(l) {
  const r = l instanceof Date ? l : new Date(l);
  if (isNaN(r.getTime())) return String(l);
  const t = Date.now() - r.getTime(), s = Math.floor(t / 1e3), n = Math.floor(s / 60), i = Math.floor(n / 60), o = Math.floor(i / 24);
  return s < 60 ? "just now" : n < 60 ? `${n}m ago` : i < 24 ? `${i}h ago` : o < 7 ? `${o}d ago` : r.toLocaleDateString(void 0, { month: "short", day: "numeric", year: "numeric" });
}
function he(l) {
  return l.split(/\s+/).slice(0, 2).map((r) => {
    var e;
    return ((e = r[0]) == null ? void 0 : e.toUpperCase()) ?? "";
  }).join("");
}
function de({ author: l, avatarUrl: r, className: e, style: t }) {
  return /* @__PURE__ */ d(
    "div",
    {
      className: ["canopy-avatar", e].filter(Boolean).join(" "),
      "aria-hidden": "true",
      style: t,
      children: r ? /* @__PURE__ */ d("img", { src: r, alt: l, loading: "lazy" }) : he(l)
    }
  );
}
function ue({ author: l, timestamp: r, className: e }) {
  const t = r instanceof Date ? r.toISOString() : String(r);
  return /* @__PURE__ */ w("div", { className: ["canopy-header", e].filter(Boolean).join(" "), children: [
    /* @__PURE__ */ d("span", { className: "canopy-author", children: l }),
    /* @__PURE__ */ d(
      "time",
      {
        className: "canopy-timestamp",
        dateTime: t,
        title: new Date(t).toLocaleString(),
        children: ce(r)
      }
    )
  ] });
}
function fe({ children: l, className: r }) {
  return /* @__PURE__ */ d("p", { className: ["canopy-body", r].filter(Boolean).join(" "), children: l });
}
function me({
  commentId: l,
  isLiked: r = !1,
  likeCount: e = 0,
  hasChildren: t = !1,
  isCollapsed: s = !1,
  childCount: n = 0,
  onLike: i,
  onReplyClick: o,
  onCollapse: a,
  className: u
}) {
  const f = I(() => {
    i == null || i(l, !r);
  }, [i, l, r]), c = I(() => {
    a == null || a(l, !s);
  }, [a, l, s]);
  return /* @__PURE__ */ w(
    "div",
    {
      className: ["canopy-actions", u].filter(Boolean).join(" "),
      role: "group",
      "aria-label": "Comment actions",
      children: [
        i && /* @__PURE__ */ w(
          "button",
          {
            className: "canopy-action canopy-action--like",
            onClick: f,
            "aria-pressed": r,
            "aria-label": r ? "Unlike" : "Like",
            children: [
              /* @__PURE__ */ d(
                "svg",
                {
                  width: "14",
                  height: "14",
                  viewBox: "0 0 24 24",
                  fill: r ? "currentColor" : "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  "aria-hidden": "true",
                  children: /* @__PURE__ */ d("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" })
                }
              ),
              e > 0 && /* @__PURE__ */ d("span", { children: e })
            ]
          }
        ),
        o && /* @__PURE__ */ w(
          "button",
          {
            className: "canopy-action canopy-action--reply",
            onClick: o,
            "aria-label": "Reply",
            children: [
              /* @__PURE__ */ w(
                "svg",
                {
                  width: "14",
                  height: "14",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  "aria-hidden": "true",
                  children: [
                    /* @__PURE__ */ d("polyline", { points: "9 17 4 12 9 7" }),
                    /* @__PURE__ */ d("path", { d: "M20 18v-2a4 4 0 0 0-4-4H4" })
                  ]
                }
              ),
              "Reply"
            ]
          }
        ),
        t && a && /* @__PURE__ */ d(
          "button",
          {
            className: "canopy-action canopy-action--collapse",
            onClick: c,
            "aria-expanded": !s,
            "aria-label": s ? `Show ${n} ${n === 1 ? "reply" : "replies"}` : "Collapse replies",
            children: s ? /* @__PURE__ */ w("span", { className: "canopy-collapsed-hint", children: [
              n,
              " ",
              n === 1 ? "reply" : "replies"
            ] }) : /* @__PURE__ */ d("span", { children: "Collapse" })
          }
        )
      ]
    }
  );
}
function ge({
  replyingTo: l,
  onSubmit: r,
  onCancel: e,
  className: t
}) {
  const [s, n] = R(""), [i, o] = R(!1), a = V(null), u = I(async () => {
    const c = s.trim();
    if (c) {
      o(!0);
      try {
        await r(c), n("");
      } finally {
        o(!1);
      }
    }
  }, [s, r]), f = I(
    (c) => {
      (c.metaKey || c.ctrlKey) && c.key === "Enter" && (c.preventDefault(), u()), c.key === "Escape" && e();
    },
    [u, e]
  );
  return /* @__PURE__ */ w(
    "form",
    {
      className: ["canopy-reply-form", t].filter(Boolean).join(" "),
      onSubmit: (c) => {
        c.preventDefault(), u();
      },
      "aria-label": `Reply to ${l}`,
      children: [
        /* @__PURE__ */ d(
          "textarea",
          {
            ref: a,
            className: "canopy-reply-input",
            value: s,
            onChange: (c) => n(c.target.value),
            onKeyDown: f,
            placeholder: `Reply to ${l}… (⌘↵ to submit)`,
            rows: 3,
            disabled: i,
            autoFocus: !0
          }
        ),
        /* @__PURE__ */ w("div", { className: "canopy-reply-actions", children: [
          /* @__PURE__ */ d(
            "button",
            {
              type: "button",
              className: "canopy-reply-cancel",
              onClick: e,
              disabled: i,
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ d(
            "button",
            {
              type: "submit",
              className: "canopy-reply-submit",
              disabled: !s.trim() || i,
              children: i ? "Posting…" : "Reply"
            }
          )
        ] })
      ]
    }
  );
}
const pe = U.memo(function({
  item: r,
  indentWidth: e,
  onReply: t,
  onLike: s,
  onCollapse: n
}) {
  const { comment: i, depth: o, hasChildren: a, isCollapsed: u, childCount: f } = r, [c, g] = R(!1), h = I(
    async (p) => {
      await (t == null ? void 0 : t(i.id, p)), g(!1);
    },
    [t, i.id]
  );
  return /* @__PURE__ */ d(
    "div",
    {
      className: "canopy-row",
      style: { paddingLeft: o * e },
      "data-depth": o,
      "data-comment-id": i.id,
      children: /* @__PURE__ */ w(
        "div",
        {
          className: "canopy-comment",
          "data-has-children": a || void 0,
          "data-collapsed": u || void 0,
          children: [
            /* @__PURE__ */ d(de, { author: i.author, avatarUrl: i.avatarUrl }),
            /* @__PURE__ */ w("div", { className: "canopy-content", children: [
              /* @__PURE__ */ d(ue, { author: i.author, timestamp: i.timestamp }),
              /* @__PURE__ */ d(fe, { children: i.body }),
              /* @__PURE__ */ d(
                me,
                {
                  commentId: i.id,
                  isLiked: i.isLiked,
                  likeCount: i.likeCount,
                  hasChildren: a,
                  isCollapsed: u,
                  childCount: f,
                  onLike: s,
                  onReplyClick: t ? () => g((p) => !p) : void 0,
                  onCollapse: n
                }
              ),
              c && /* @__PURE__ */ d(
                ge,
                {
                  replyingTo: i.author,
                  onSubmit: h,
                  onCancel: () => g(!1)
                }
              )
            ] })
          ]
        }
      )
    }
  );
});
function xe({
  comments: l,
  indentWidth: r = 24,
  height: e,
  estimatedRowHeight: t = 80,
  emptyState: s,
  className: n,
  style: i,
  defaultCollapsed: o,
  collapsed: a,
  onReply: u,
  onLike: f,
  onCollapse: c,
  onScrollEnd: g,
  renderItem: h
}) {
  var T;
  const [p, M] = R(
    () => new Set(o ?? [])
  ), v = a !== void 0, y = v ? new Set(a) : p, x = I(
    (m, S) => {
      v || M((K) => {
        const _ = new Set(K);
        return S ? _.add(m) : _.delete(m), _;
      }), c == null || c(m, S);
    },
    [v, c]
  ), { forest: E, nodeMap: A } = D(() => {
    const m = X(l), S = Y(m);
    return { forest: m, nodeMap: S };
  }, [l]), z = D(
    () => G(E, y),
    [E, y]
  ), b = V(null), O = ae({
    count: z.length,
    getScrollElement: () => b.current,
    estimateSize: () => t,
    overscan: 5
  }), F = O.getVirtualItems();
  if (P(() => {
    if (!g) return;
    const m = b.current;
    if (!m) return;
    function S() {
      m && m.scrollTop + m.clientHeight >= m.scrollHeight - 40 && (g == null || g());
    }
    return m.addEventListener("scroll", S, { passive: !0 }), () => m.removeEventListener("scroll", S);
  }, [g]), l.length === 0)
    return /* @__PURE__ */ d(
      "div",
      {
        className: ["canopy-thread", n].filter(Boolean).join(" "),
        style: i,
        role: "region",
        "aria-label": "Comments",
        children: s ?? /* @__PURE__ */ d("div", { className: "canopy-empty", children: "No comments yet. Be the first!" })
      }
    );
  const $ = O.getTotalSize();
  return /* @__PURE__ */ d(
    "div",
    {
      className: ["canopy-thread", n].filter(Boolean).join(" "),
      style: i,
      role: "region",
      "aria-label": "Comments",
      children: /* @__PURE__ */ d(
        "div",
        {
          ref: b,
          className: "canopy-scroll",
          style: e !== void 0 ? { height: e } : void 0,
          tabIndex: -1,
          children: /* @__PURE__ */ d("div", { style: { height: $, position: "relative" }, children: /* @__PURE__ */ d(
            "div",
            {
              style: {
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${((T = F[0]) == null ? void 0 : T.start) ?? 0}px)`
              },
              children: F.map((m) => {
                const S = z[m.index];
                return /* @__PURE__ */ d(
                  "div",
                  {
                    "data-index": m.index,
                    ref: O.measureElement,
                    children: h ? h(S) : /* @__PURE__ */ d(
                      pe,
                      {
                        item: S,
                        indentWidth: r,
                        onReply: u,
                        onLike: f,
                        onCollapse: x
                      }
                    )
                  },
                  S.comment.id
                );
              })
            }
          ) })
        }
      )
    }
  );
}
export {
  me as CommentActions,
  de as CommentAvatar,
  fe as CommentBody,
  ue as CommentHeader,
  ge as CommentReplyForm,
  pe as CommentRow,
  xe as CommentThread
};
//# sourceMappingURL=index.js.map
