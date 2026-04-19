import { jsx as h, jsxs as M } from "react/jsx-runtime";
import * as A from "react";
import U, { useState as N, useRef as V, useCallback as R, useMemo as F, useEffect as K } from "react";
import { flushSync as P } from "react-dom";
import { buildTree as q, buildNodeMap as X, flattenTree as Y } from "@kanopee/core";
function k(r, l, e) {
  let t = e.initialDeps ?? [], s, i = !0;
  function n() {
    var o, a, d;
    let u;
    e.key && ((o = e.debug) != null && o.call(e)) && (u = Date.now());
    const f = r();
    if (!(f.length !== t.length || f.some((v, b) => t[b] !== v)))
      return s;
    t = f;
    let c;
    if (e.key && ((a = e.debug) != null && a.call(e)) && (c = Date.now()), s = l(...f), e.key && ((d = e.debug) != null && d.call(e))) {
      const v = Math.round((Date.now() - u) * 100) / 100, b = Math.round((Date.now() - c) * 100) / 100, y = b / 16, w = (x, O) => {
        for (x = String(x); x.length < O; )
          x = " " + x;
        return x;
      };
      console.info(
        `%c⏱ ${w(b, 5)} /${w(v, 5)} ms`,
        `
            font-size: .6rem;
            font-weight: bold;
            color: hsl(${Math.max(
          0,
          Math.min(120 - 120 * y, 120)
        )}deg 100% 31%);`,
        e == null ? void 0 : e.key
      );
    }
    return e != null && e.onChange && !(i && e.skipInitialOnChange) && e.onChange(s), i = !1, s;
  }
  return n.updateDeps = (o) => {
    t = o;
  }, n;
}
function T(r, l) {
  if (r === void 0)
    throw new Error("Unexpected undefined");
  return r;
}
const G = (r, l) => Math.abs(r - l) < 1.01, J = (r, l, e) => {
  let t;
  return function(...s) {
    r.clearTimeout(t), t = r.setTimeout(() => l.apply(this, s), e);
  };
}, D = (r) => {
  const { offsetWidth: l, offsetHeight: e } = r;
  return { width: l, height: e };
}, Q = (r) => r, Z = (r) => {
  const l = Math.max(r.startIndex - r.overscan, 0), e = Math.min(r.endIndex + r.overscan, r.count - 1), t = [];
  for (let s = l; s <= e; s++)
    t.push(s);
  return t;
}, ee = (r, l) => {
  const e = r.scrollElement;
  if (!e)
    return;
  const t = r.targetWindow;
  if (!t)
    return;
  const s = (n) => {
    const { width: o, height: a } = n;
    l({ width: Math.round(o), height: Math.round(a) });
  };
  if (s(D(e)), !t.ResizeObserver)
    return () => {
    };
  const i = new t.ResizeObserver((n) => {
    const o = () => {
      const a = n[0];
      if (a != null && a.borderBoxSize) {
        const d = a.borderBoxSize[0];
        if (d) {
          s({ width: d.inlineSize, height: d.blockSize });
          return;
        }
      }
      s(D(e));
    };
    r.options.useAnimationFrameWithResizeObserver ? requestAnimationFrame(o) : o();
  });
  return i.observe(e, { box: "border-box" }), () => {
    i.unobserve(e);
  };
}, W = {
  passive: !0
}, j = typeof window > "u" ? !0 : "onscrollend" in window, te = (r, l) => {
  const e = r.scrollElement;
  if (!e)
    return;
  const t = r.targetWindow;
  if (!t)
    return;
  let s = 0;
  const i = r.options.useScrollendEvent && j ? () => {
  } : J(
    t,
    () => {
      l(s, !1);
    },
    r.options.isScrollingResetDelay
  ), n = (u) => () => {
    const { horizontal: f, isRtl: p } = r.options;
    s = f ? e.scrollLeft * (p && -1 || 1) : e.scrollTop, i(), l(s, u);
  }, o = n(!0), a = n(!1);
  e.addEventListener("scroll", o, W);
  const d = r.options.useScrollendEvent && j;
  return d && e.addEventListener("scrollend", a, W), () => {
    e.removeEventListener("scroll", o), d && e.removeEventListener("scrollend", a);
  };
}, se = (r, l, e) => {
  if (l != null && l.borderBoxSize) {
    const t = l.borderBoxSize[0];
    if (t)
      return Math.round(
        t[e.options.horizontal ? "inlineSize" : "blockSize"]
      );
  }
  return r[e.options.horizontal ? "offsetWidth" : "offsetHeight"];
}, ne = (r, {
  adjustments: l = 0,
  behavior: e
}, t) => {
  var s, i;
  const n = r + l;
  (i = (s = t.scrollElement) == null ? void 0 : s.scrollTo) == null || i.call(s, {
    [t.options.horizontal ? "left" : "top"]: n,
    behavior: e
  });
};
class ie {
  constructor(l) {
    this.unsubs = [], this.scrollElement = null, this.targetWindow = null, this.isScrolling = !1, this.scrollState = null, this.measurementsCache = [], this.itemSizeCache = /* @__PURE__ */ new Map(), this.laneAssignments = /* @__PURE__ */ new Map(), this.pendingMeasuredCacheIndexes = [], this.prevLanes = void 0, this.lanesChangedFlag = !1, this.lanesSettling = !1, this.scrollRect = null, this.scrollOffset = null, this.scrollDirection = null, this.scrollAdjustments = 0, this.elementsCache = /* @__PURE__ */ new Map(), this.now = () => {
      var e, t, s;
      return ((s = (t = (e = this.targetWindow) == null ? void 0 : e.performance) == null ? void 0 : t.now) == null ? void 0 : s.call(t)) ?? Date.now();
    }, this.observer = /* @__PURE__ */ (() => {
      let e = null;
      const t = () => e || (!this.targetWindow || !this.targetWindow.ResizeObserver ? null : e = new this.targetWindow.ResizeObserver((s) => {
        s.forEach((i) => {
          const n = () => {
            const o = i.target, a = this.indexFromElement(o);
            if (!o.isConnected) {
              this.observer.unobserve(o);
              return;
            }
            this.shouldMeasureDuringScroll(a) && this.resizeItem(
              a,
              this.options.measureElement(o, i, this)
            );
          };
          this.options.useAnimationFrameWithResizeObserver ? requestAnimationFrame(n) : n();
        });
      }));
      return {
        disconnect: () => {
          var s;
          (s = t()) == null || s.disconnect(), e = null;
        },
        observe: (s) => {
          var i;
          return (i = t()) == null ? void 0 : i.observe(s, { box: "border-box" });
        },
        unobserve: (s) => {
          var i;
          return (i = t()) == null ? void 0 : i.unobserve(s);
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
        getItemKey: Q,
        rangeExtractor: Z,
        onChange: () => {
        },
        measureElement: se,
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
    }, this.maybeNotify = k(
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
          this.options.observeElementOffset(this, (s, i) => {
            this.scrollAdjustments = 0, this.scrollDirection = i ? this.getScrollOffset() < s ? "forward" : "backward" : null, this.scrollOffset = s, this.isScrolling = i, this.scrollState && this.scheduleScrollReconcile(), this.maybeNotify();
          })
        ), this._scrollToOffset(this.getScrollOffset(), {
          adjustments: void 0,
          behavior: void 0
        });
      }
    }, this.rafId = null, this.getSize = () => this.options.enabled ? (this.scrollRect = this.scrollRect ?? this.options.initialRect, this.scrollRect[this.options.horizontal ? "width" : "height"]) : (this.scrollRect = null, 0), this.getScrollOffset = () => this.options.enabled ? (this.scrollOffset = this.scrollOffset ?? (typeof this.options.initialOffset == "function" ? this.options.initialOffset() : this.options.initialOffset), this.scrollOffset) : (this.scrollOffset = null, 0), this.getFurthestMeasurement = (e, t) => {
      const s = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
      for (let n = t - 1; n >= 0; n--) {
        const o = e[n];
        if (s.has(o.lane))
          continue;
        const a = i.get(
          o.lane
        );
        if (a == null || o.end > a.end ? i.set(o.lane, o) : o.end < a.end && s.set(o.lane, !0), s.size === this.options.lanes)
          break;
      }
      return i.size === this.options.lanes ? Array.from(i.values()).sort((n, o) => n.end === o.end ? n.index - o.index : n.end - o.end)[0] : void 0;
    }, this.getMeasurementOptions = k(
      () => [
        this.options.count,
        this.options.paddingStart,
        this.options.scrollMargin,
        this.options.getItemKey,
        this.options.enabled,
        this.options.lanes,
        this.options.laneAssignmentMode
      ],
      (e, t, s, i, n, o, a) => (this.prevLanes !== void 0 && this.prevLanes !== o && (this.lanesChangedFlag = !0), this.prevLanes = o, this.pendingMeasuredCacheIndexes = [], {
        count: e,
        paddingStart: t,
        scrollMargin: s,
        getItemKey: i,
        enabled: n,
        lanes: o,
        laneAssignmentMode: a
      }),
      {
        key: !1
      }
    ), this.getMeasurements = k(
      () => [this.getMeasurementOptions(), this.itemSizeCache],
      ({
        count: e,
        paddingStart: t,
        scrollMargin: s,
        getItemKey: i,
        enabled: n,
        lanes: o,
        laneAssignmentMode: a
      }, d) => {
        if (!n)
          return this.measurementsCache = [], this.itemSizeCache.clear(), this.laneAssignments.clear(), [];
        if (this.laneAssignments.size > e)
          for (const c of this.laneAssignments.keys())
            c >= e && this.laneAssignments.delete(c);
        this.lanesChangedFlag && (this.lanesChangedFlag = !1, this.lanesSettling = !0, this.measurementsCache = [], this.itemSizeCache.clear(), this.laneAssignments.clear(), this.pendingMeasuredCacheIndexes = []), this.measurementsCache.length === 0 && !this.lanesSettling && (this.measurementsCache = this.options.initialMeasurementsCache, this.measurementsCache.forEach((c) => {
          this.itemSizeCache.set(c.key, c.size);
        }));
        const u = this.lanesSettling ? 0 : this.pendingMeasuredCacheIndexes.length > 0 ? Math.min(...this.pendingMeasuredCacheIndexes) : 0;
        this.pendingMeasuredCacheIndexes = [], this.lanesSettling && this.measurementsCache.length === e && (this.lanesSettling = !1);
        const f = this.measurementsCache.slice(0, u), p = new Array(o).fill(
          void 0
        );
        for (let c = 0; c < u; c++) {
          const v = f[c];
          v && (p[v.lane] = c);
        }
        for (let c = u; c < e; c++) {
          const v = i(c), b = this.laneAssignments.get(c);
          let y, w;
          const x = a === "estimate" || d.has(v);
          if (b !== void 0 && this.options.lanes > 1) {
            y = b;
            const S = p[y], C = S !== void 0 ? f[S] : void 0;
            w = C ? C.end + this.options.gap : t + s;
          } else {
            const S = this.options.lanes === 1 ? f[c - 1] : this.getFurthestMeasurement(f, c);
            w = S ? S.end + this.options.gap : t + s, y = S ? S.lane : c % this.options.lanes, this.options.lanes > 1 && x && this.laneAssignments.set(c, y);
          }
          const O = d.get(v), I = typeof O == "number" ? O : this.options.estimateSize(c), z = w + I;
          f[c] = {
            index: c,
            start: w,
            size: I,
            end: z,
            key: v,
            lane: y
          }, p[y] = c;
        }
        return this.measurementsCache = f, f;
      },
      {
        key: process.env.NODE_ENV !== "production" && "getMeasurements",
        debug: () => this.options.debug
      }
    ), this.calculateRange = k(
      () => [
        this.getMeasurements(),
        this.getSize(),
        this.getScrollOffset(),
        this.options.lanes
      ],
      (e, t, s, i) => this.range = e.length > 0 && t > 0 ? oe({
        measurements: e,
        outerSize: t,
        scrollOffset: s,
        lanes: i
      }) : null,
      {
        key: process.env.NODE_ENV !== "production" && "calculateRange",
        debug: () => this.options.debug
      }
    ), this.getVirtualIndexes = k(
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
      (e, t, s, i, n) => i === null || n === null ? [] : e({
        startIndex: i,
        endIndex: n,
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
        const i = Math.max(
          this.options.overscan,
          Math.ceil((this.range.endIndex - this.range.startIndex) / 2)
        ), n = Math.max(0, s - i), o = Math.min(
          this.options.count - 1,
          s + i
        );
        return e >= n && e <= o;
      }
      return !0;
    }, this.measureElement = (e) => {
      if (!e) {
        this.elementsCache.forEach((n, o) => {
          n.isConnected || (this.observer.unobserve(n), this.elementsCache.delete(o));
        });
        return;
      }
      const t = this.indexFromElement(e), s = this.options.getItemKey(t), i = this.elementsCache.get(s);
      i !== e && (i && this.observer.unobserve(i), this.observer.observe(e), this.elementsCache.set(s, e)), (!this.isScrolling || this.scrollState) && this.shouldMeasureDuringScroll(t) && this.resizeItem(t, this.options.measureElement(e, void 0, this));
    }, this.resizeItem = (e, t) => {
      var s;
      const i = this.measurementsCache[e];
      if (!i) return;
      const n = this.itemSizeCache.get(i.key) ?? i.size, o = t - n;
      o !== 0 && (((s = this.scrollState) == null ? void 0 : s.behavior) !== "smooth" && (this.shouldAdjustScrollPositionOnItemSizeChange !== void 0 ? this.shouldAdjustScrollPositionOnItemSizeChange(i, o, this) : i.start < this.getScrollOffset() + this.scrollAdjustments) && (process.env.NODE_ENV !== "production" && this.options.debug && console.info("correction", o), this._scrollToOffset(this.getScrollOffset(), {
        adjustments: this.scrollAdjustments += o,
        behavior: void 0
      })), this.pendingMeasuredCacheIndexes.push(i.index), this.itemSizeCache = new Map(this.itemSizeCache.set(i.key, t)), this.notify(!1));
    }, this.getVirtualItems = k(
      () => [this.getVirtualIndexes(), this.getMeasurements()],
      (e, t) => {
        const s = [];
        for (let i = 0, n = e.length; i < n; i++) {
          const o = e[i], a = t[o];
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
        return T(
          t[H(
            0,
            t.length - 1,
            (s) => T(t[s]).start,
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
      const i = this.getSize(), n = this.getScrollOffset();
      t === "auto" && (t = e >= n + i ? "end" : "start"), t === "center" ? e += (s - i) / 2 : t === "end" && (e -= i);
      const o = this.getMaxScrollOffset();
      return Math.max(Math.min(o, e), 0);
    }, this.getOffsetForIndex = (e, t = "auto") => {
      e = Math.max(0, Math.min(e, this.options.count - 1));
      const s = this.getSize(), i = this.getScrollOffset(), n = this.measurementsCache[e];
      if (!n) return;
      if (t === "auto")
        if (n.end >= i + s - this.options.scrollPaddingEnd)
          t = "end";
        else if (n.start <= i + this.options.scrollPaddingStart)
          t = "start";
        else
          return [i, t];
      if (t === "end" && e === this.options.count - 1)
        return [this.getMaxScrollOffset(), t];
      const o = t === "end" ? n.end + this.options.scrollPaddingEnd : n.start - this.options.scrollPaddingStart;
      return [
        this.getOffsetForAlignment(o, t, n.size),
        t
      ];
    }, this.scrollToOffset = (e, { align: t = "start", behavior: s = "auto" } = {}) => {
      const i = this.getOffsetForAlignment(e, t), n = this.now();
      this.scrollState = {
        index: null,
        align: t,
        behavior: s,
        startedAt: n,
        lastTargetOffset: i,
        stableFrames: 0
      }, this._scrollToOffset(i, { adjustments: void 0, behavior: s }), this.scheduleScrollReconcile();
    }, this.scrollToIndex = (e, {
      align: t = "auto",
      behavior: s = "auto"
    } = {}) => {
      e = Math.max(0, Math.min(e, this.options.count - 1));
      const i = this.getOffsetForIndex(e, t);
      if (!i)
        return;
      const [n, o] = i, a = this.now();
      this.scrollState = {
        index: e,
        align: o,
        behavior: s,
        startedAt: a,
        lastTargetOffset: n,
        stableFrames: 0
      }, this._scrollToOffset(n, { adjustments: void 0, behavior: s }), this.scheduleScrollReconcile();
    }, this.scrollBy = (e, { behavior: t = "auto" } = {}) => {
      const s = this.getScrollOffset() + e, i = this.now();
      this.scrollState = {
        index: null,
        align: "start",
        behavior: t,
        startedAt: i,
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
        const i = Array(this.options.lanes).fill(null);
        let n = t.length - 1;
        for (; n >= 0 && i.some((o) => o === null); ) {
          const o = t[n];
          i[o.lane] === null && (i[o.lane] = o.end), n--;
        }
        s = Math.max(...i.filter((o) => o !== null));
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
    }, this.setOptions(l);
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
    const t = this.scrollState.index != null ? this.getOffsetForIndex(this.scrollState.index, this.scrollState.align) : void 0, s = t ? t[0] : this.scrollState.lastTargetOffset, i = 1, n = s !== this.scrollState.lastTargetOffset;
    if (!n && G(s, this.getScrollOffset())) {
      if (this.scrollState.stableFrames++, this.scrollState.stableFrames >= i) {
        this.scrollState = null;
        return;
      }
    } else
      this.scrollState.stableFrames = 0, n && (this.scrollState.lastTargetOffset = s, this.scrollState.behavior = "auto", this._scrollToOffset(s, {
        adjustments: void 0,
        behavior: "auto"
      }));
    this.scheduleScrollReconcile();
  }
}
const H = (r, l, e, t) => {
  for (; r <= l; ) {
    const s = (r + l) / 2 | 0, i = e(s);
    if (i < t)
      r = s + 1;
    else if (i > t)
      l = s - 1;
    else
      return s;
  }
  return r > 0 ? r - 1 : 0;
};
function oe({
  measurements: r,
  outerSize: l,
  scrollOffset: e,
  lanes: t
}) {
  const s = r.length - 1, i = (a) => r[a].start;
  if (r.length <= t)
    return {
      startIndex: 0,
      endIndex: s
    };
  let n = H(
    0,
    s,
    i,
    e
  ), o = n;
  if (t === 1)
    for (; o < s && r[o].end < e + l; )
      o++;
  else if (t > 1) {
    const a = Array(t).fill(0);
    for (; o < s && a.some((u) => u < e + l); ) {
      const u = r[o];
      a[u.lane] = u.end, o++;
    }
    const d = Array(t).fill(e + l);
    for (; n >= 0 && d.some((u) => u >= e); ) {
      const u = r[n];
      d[u.lane] = u.start, n--;
    }
    n = Math.max(0, n - n % t), o = Math.min(s, o + (t - 1 - o % t));
  }
  return { startIndex: n, endIndex: o };
}
const B = typeof document < "u" ? A.useLayoutEffect : A.useEffect;
function re({
  useFlushSync: r = !0,
  ...l
}) {
  const e = A.useReducer(() => ({}), {})[1], t = {
    ...l,
    onChange: (i, n) => {
      var o;
      r && n ? P(e) : e(), (o = l.onChange) == null || o.call(l, i, n);
    }
  }, [s] = A.useState(
    () => new ie(t)
  );
  return s.setOptions(t), B(() => s._didMount(), []), B(() => s._willUpdate()), s;
}
function le(r) {
  return re({
    observeElementRect: ee,
    observeElementOffset: te,
    scrollToFn: ne,
    ...r
  });
}
function ae(r) {
  const l = r instanceof Date ? r : new Date(r);
  if (isNaN(l.getTime())) return String(r);
  const t = Date.now() - l.getTime(), s = Math.floor(t / 1e3), i = Math.floor(s / 60), n = Math.floor(i / 60), o = Math.floor(n / 24);
  return s < 60 ? "just now" : i < 60 ? `${i}m ago` : n < 24 ? `${n}h ago` : o < 7 ? `${o}d ago` : l.toLocaleDateString(void 0, { month: "short", day: "numeric", year: "numeric" });
}
function ce(r) {
  return r.split(/\s+/).slice(0, 2).map((l) => {
    var e;
    return ((e = l[0]) == null ? void 0 : e.toUpperCase()) ?? "";
  }).join("");
}
const he = U.memo(function({
  item: l,
  indentWidth: e,
  onReply: t,
  onLike: s,
  onCollapse: i
}) {
  const { comment: n, depth: o, hasChildren: a, isCollapsed: d, childCount: u } = l, [f, p] = N(!1), [c, v] = N(""), [b, y] = N(!1), w = V(null), x = o * e, O = R(() => {
    s == null || s(n.id, !n.isLiked);
  }, [s, n.id, n.isLiked]), I = R(() => {
    i == null || i(n.id, !d);
  }, [i, n.id, d]), z = R(() => {
    p(!0), requestAnimationFrame(() => {
      var m;
      return (m = w.current) == null ? void 0 : m.focus();
    });
  }, []), S = R(() => {
    p(!1), v("");
  }, []), C = R(async () => {
    const m = c.trim();
    if (!(!m || !t)) {
      y(!0);
      try {
        await t(n.id, m), v(""), p(!1);
      } finally {
        y(!1);
      }
    }
  }, [c, t, n.id]), _ = R(
    (m) => {
      (m.metaKey || m.ctrlKey) && m.key === "Enter" && (m.preventDefault(), C()), m.key === "Escape" && S();
    },
    [C, S]
  );
  return /* @__PURE__ */ h(
    "div",
    {
      className: "canopy-row",
      style: { paddingLeft: x },
      "data-depth": o,
      "data-comment-id": n.id,
      children: /* @__PURE__ */ M(
        "div",
        {
          className: "canopy-comment",
          "data-has-children": a || void 0,
          "data-collapsed": d || void 0,
          children: [
            /* @__PURE__ */ h("div", { className: "canopy-avatar", "aria-hidden": "true", children: n.avatarUrl ? /* @__PURE__ */ h("img", { src: n.avatarUrl, alt: n.author, loading: "lazy" }) : ce(n.author) }),
            /* @__PURE__ */ M("div", { className: "canopy-content", children: [
              /* @__PURE__ */ M("div", { className: "canopy-header", children: [
                /* @__PURE__ */ h("span", { className: "canopy-author", children: n.author }),
                /* @__PURE__ */ h(
                  "time",
                  {
                    className: "canopy-timestamp",
                    dateTime: n.timestamp instanceof Date ? n.timestamp.toISOString() : String(n.timestamp),
                    title: new Date(n.timestamp).toLocaleString(),
                    children: ae(n.timestamp)
                  }
                )
              ] }),
              /* @__PURE__ */ h("p", { className: "canopy-body", children: n.body }),
              /* @__PURE__ */ M("div", { className: "canopy-actions", role: "group", "aria-label": "Comment actions", children: [
                s && /* @__PURE__ */ M(
                  "button",
                  {
                    className: "canopy-action canopy-action--like",
                    onClick: O,
                    "aria-pressed": n.isLiked ?? !1,
                    "aria-label": n.isLiked ? "Unlike" : "Like",
                    children: [
                      /* @__PURE__ */ h(de, { filled: n.isLiked ?? !1 }),
                      (n.likeCount ?? 0) > 0 && /* @__PURE__ */ h("span", { children: n.likeCount })
                    ]
                  }
                ),
                t && /* @__PURE__ */ M(
                  "button",
                  {
                    className: "canopy-action canopy-action--reply",
                    onClick: z,
                    "aria-label": "Reply",
                    children: [
                      /* @__PURE__ */ h(ue, {}),
                      "Reply"
                    ]
                  }
                ),
                a && i && /* @__PURE__ */ M(
                  "button",
                  {
                    className: "canopy-action canopy-action--collapse",
                    onClick: I,
                    "aria-expanded": !d,
                    "aria-label": d ? `Show ${u} ${u === 1 ? "reply" : "replies"}` : "Collapse replies",
                    children: [
                      d ? /* @__PURE__ */ h(me, {}) : /* @__PURE__ */ h(fe, {}),
                      d ? /* @__PURE__ */ M("span", { className: "canopy-collapsed-hint", children: [
                        u,
                        " ",
                        u === 1 ? "reply" : "replies"
                      ] }) : /* @__PURE__ */ h("span", { children: "Collapse" })
                    ]
                  }
                )
              ] }),
              f && /* @__PURE__ */ M(
                "form",
                {
                  className: "canopy-reply-form",
                  onSubmit: (m) => {
                    m.preventDefault(), C();
                  },
                  "aria-label": `Reply to ${n.author}`,
                  children: [
                    /* @__PURE__ */ h(
                      "textarea",
                      {
                        ref: w,
                        className: "canopy-reply-input",
                        value: c,
                        onChange: (m) => v(m.target.value),
                        onKeyDown: _,
                        placeholder: `Reply to ${n.author}… (⌘↵ to submit)`,
                        rows: 3,
                        disabled: b
                      }
                    ),
                    /* @__PURE__ */ M("div", { className: "canopy-reply-actions", children: [
                      /* @__PURE__ */ h(
                        "button",
                        {
                          type: "button",
                          className: "canopy-reply-cancel",
                          onClick: S,
                          disabled: b,
                          children: "Cancel"
                        }
                      ),
                      /* @__PURE__ */ h(
                        "button",
                        {
                          type: "submit",
                          className: "canopy-reply-submit",
                          disabled: !c.trim() || b,
                          children: b ? "Posting…" : "Reply"
                        }
                      )
                    ] })
                  ]
                }
              )
            ] })
          ]
        }
      )
    }
  );
});
function de({ filled: r }) {
  return /* @__PURE__ */ h(
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
      children: /* @__PURE__ */ h("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" })
    }
  );
}
function ue() {
  return /* @__PURE__ */ M(
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
        /* @__PURE__ */ h("polyline", { points: "9 17 4 12 9 7" }),
        /* @__PURE__ */ h("path", { d: "M20 18v-2a4 4 0 0 0-4-4H4" })
      ]
    }
  );
}
function fe() {
  return /* @__PURE__ */ h(
    "svg",
    {
      width: "12",
      height: "12",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2.5",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      children: /* @__PURE__ */ h("polyline", { points: "18 15 12 9 6 15" })
    }
  );
}
function me() {
  return /* @__PURE__ */ h(
    "svg",
    {
      width: "12",
      height: "12",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2.5",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      children: /* @__PURE__ */ h("polyline", { points: "6 9 12 15 18 9" })
    }
  );
}
function Se({
  comments: r,
  indentWidth: l = 24,
  height: e,
  estimatedRowHeight: t = 80,
  emptyState: s,
  className: i,
  style: n,
  defaultCollapsed: o,
  collapsed: a,
  onReply: d,
  onLike: u,
  onCollapse: f,
  onScrollEnd: p
}) {
  var m;
  const [c, v] = N(
    () => new Set(o ?? [])
  ), b = a !== void 0, y = b ? new Set(a) : c, w = R(
    (g, E) => {
      b || v(($) => {
        const L = new Set($);
        return E ? L.add(g) : L.delete(g), L;
      }), f == null || f(g, E);
    },
    [b, f]
  ), { forest: x, nodeMap: O } = F(() => {
    const g = q(r), E = X(g);
    return { forest: g, nodeMap: E };
  }, [r]), I = F(
    () => Y(x, y),
    [x, y]
  ), z = V(null), S = le({
    count: I.length,
    getScrollElement: () => z.current,
    estimateSize: () => t,
    overscan: 5
  }), C = S.getVirtualItems();
  if (K(() => {
    if (!p) return;
    const g = z.current;
    if (!g) return;
    function E() {
      g && g.scrollTop + g.clientHeight >= g.scrollHeight - 40 && (p == null || p());
    }
    return g.addEventListener("scroll", E, { passive: !0 }), () => g.removeEventListener("scroll", E);
  }, [p]), r.length === 0)
    return /* @__PURE__ */ h(
      "div",
      {
        className: ["canopy-thread", i].filter(Boolean).join(" "),
        style: n,
        role: "region",
        "aria-label": "Comments",
        children: s ?? /* @__PURE__ */ h("div", { className: "canopy-empty", children: "No comments yet. Be the first!" })
      }
    );
  const _ = S.getTotalSize();
  return /* @__PURE__ */ h(
    "div",
    {
      className: ["canopy-thread", i].filter(Boolean).join(" "),
      style: n,
      role: "region",
      "aria-label": "Comments",
      children: /* @__PURE__ */ h(
        "div",
        {
          ref: z,
          className: "canopy-scroll",
          style: e !== void 0 ? { height: e } : void 0,
          tabIndex: -1,
          children: /* @__PURE__ */ h("div", { style: { height: _, position: "relative" }, children: /* @__PURE__ */ h(
            "div",
            {
              style: {
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${((m = C[0]) == null ? void 0 : m.start) ?? 0}px)`
              },
              children: C.map((g) => {
                const E = I[g.index];
                return /* @__PURE__ */ h(
                  "div",
                  {
                    "data-index": g.index,
                    ref: S.measureElement,
                    children: /* @__PURE__ */ h(
                      he,
                      {
                        item: E,
                        indentWidth: l,
                        onReply: d,
                        onLike: u,
                        onCollapse: w
                      }
                    )
                  },
                  E.comment.id
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
  Se as CommentThread
};
//# sourceMappingURL=index.js.map
