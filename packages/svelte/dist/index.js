var Oe = Object.defineProperty;
var Ie = (t, e, n) => e in t ? Oe(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var oe = (t, e, n) => Ie(t, typeof e != "symbol" ? e + "" : e, n);
import { buildTree as Ue, buildNodeMap as Ae, flattenTree as Pe } from "@kanopee/core";
import { onMount as Ke } from "svelte";
function z() {
}
function Le(t) {
  return t();
}
function de() {
  return /* @__PURE__ */ Object.create(null);
}
function J(t) {
  t.forEach(Le);
}
function Me(t) {
  return typeof t == "function";
}
function Ee(t, e) {
  return t != t ? e == e : t !== e || t && typeof t == "object" || typeof t == "function";
}
let le;
function ce(t, e) {
  return t === e ? !0 : (le || (le = document.createElement("a")), le.href = e, t === le.href);
}
function qe(t) {
  return Object.keys(t).length === 0;
}
function p(t, e) {
  t.appendChild(e);
}
function N(t, e, n) {
  t.insertBefore(e, n || null);
}
function M(t) {
  t.parentNode && t.parentNode.removeChild(t);
}
function v(t) {
  return document.createElement(t);
}
function $(t) {
  return document.createElementNS("http://www.w3.org/2000/svg", t);
}
function A(t) {
  return document.createTextNode(t);
}
function I() {
  return A(" ");
}
function ze() {
  return A("");
}
function V(t, e, n, l) {
  return t.addEventListener(e, n, l), () => t.removeEventListener(e, n, l);
}
function i(t, e, n) {
  n == null ? t.removeAttribute(e) : t.getAttribute(e) !== n && t.setAttribute(e, n);
}
function Ve(t) {
  return Array.from(t.childNodes);
}
function q(t, e) {
  e = "" + e, t.data !== e && (t.data = /** @type {string} */
  e);
}
function me(t, e) {
  t.value = e ?? "";
}
function Z(t, e, n, l) {
  n == null ? t.style.removeProperty(e) : t.style.setProperty(e, n, "");
}
let ue;
function te(t) {
  ue = t;
}
const Y = [], fe = [];
let x = [];
const he = [], Fe = /* @__PURE__ */ Promise.resolve();
let re = !1;
function Ge() {
  re || (re = !0, Fe.then(Te));
}
function se(t) {
  x.push(t);
}
const ae = /* @__PURE__ */ new Set();
let X = 0;
function Te() {
  if (X !== 0)
    return;
  const t = ue;
  do {
    try {
      for (; X < Y.length; ) {
        const e = Y[X];
        X++, te(e), Je(e.$$);
      }
    } catch (e) {
      throw Y.length = 0, X = 0, e;
    }
    for (te(null), Y.length = 0, X = 0; fe.length; ) fe.pop()();
    for (let e = 0; e < x.length; e += 1) {
      const n = x[e];
      ae.has(n) || (ae.add(n), n());
    }
    x.length = 0;
  } while (Y.length);
  for (; he.length; )
    he.pop()();
  re = !1, ae.clear(), te(t);
}
function Je(t) {
  if (t.fragment !== null) {
    t.update(), J(t.before_update);
    const e = t.dirty;
    t.dirty = [-1], t.fragment && t.fragment.p(t.ctx, e), t.after_update.forEach(se);
  }
}
function Qe(t) {
  const e = [], n = [];
  x.forEach((l) => t.indexOf(l) === -1 ? e.push(l) : n.push(l)), n.forEach((l) => l()), x = e;
}
const ie = /* @__PURE__ */ new Set();
let G;
function Ne() {
  G = {
    r: 0,
    c: [],
    p: G
    // parent group
  };
}
function De() {
  G.r || J(G.c), G = G.p;
}
function ee(t, e) {
  t && t.i && (ie.delete(t), t.i(e));
}
function ne(t, e, n, l) {
  if (t && t.o) {
    if (ie.has(t)) return;
    ie.add(t), G.c.push(() => {
      ie.delete(t), l && (n && t.d(1), l());
    }), t.o(e);
  } else l && l();
}
function _e(t) {
  return (t == null ? void 0 : t.length) !== void 0 ? t : Array.from(t);
}
function Xe(t, e) {
  ne(t, 1, 1, () => {
    e.delete(t.key);
  });
}
function Ye(t, e, n, l, a, o, r, c, m, f, d, s) {
  let u = t.length, g = o.length, b = u;
  const R = {};
  for (; b--; ) R[t[b].key] = b;
  const w = [], C = /* @__PURE__ */ new Map(), W = /* @__PURE__ */ new Map(), B = [];
  for (b = g; b--; ) {
    const k = s(a, o, b), _ = n(k);
    let D = r.get(_);
    D ? B.push(() => D.p(k, e)) : (D = f(_, k), D.c()), C.set(_, w[b] = D), _ in R && W.set(_, Math.abs(b - R[_]));
  }
  const P = /* @__PURE__ */ new Set(), L = /* @__PURE__ */ new Set();
  function H(k) {
    ee(k, 1), k.m(c, d), r.set(k.key, k), d = k.first, g--;
  }
  for (; u && g; ) {
    const k = w[g - 1], _ = t[u - 1], D = k.key, j = _.key;
    k === _ ? (d = k.first, u--, g--) : C.has(j) ? !r.has(D) || P.has(D) ? H(k) : L.has(j) ? u-- : W.get(D) > W.get(j) ? (L.add(D), H(k)) : (P.add(j), u--) : (m(_, r), u--);
  }
  for (; u--; ) {
    const k = t[u];
    C.has(k.key) || m(k, r);
  }
  for (; g; ) H(w[g - 1]);
  return J(B), w;
}
function Ze(t) {
  t && t.c();
}
function He(t, e, n) {
  const { fragment: l, after_update: a } = t.$$;
  l && l.m(e, n), se(() => {
    const o = t.$$.on_mount.map(Le).filter(Me);
    t.$$.on_destroy ? t.$$.on_destroy.push(...o) : J(o), t.$$.on_mount = [];
  }), a.forEach(se);
}
function je(t, e) {
  const n = t.$$;
  n.fragment !== null && (Qe(n.after_update), J(n.on_destroy), n.fragment && n.fragment.d(e), n.on_destroy = n.fragment = null, n.ctx = []);
}
function xe(t, e) {
  t.$$.dirty[0] === -1 && (Y.push(t), Ge(), t.$$.dirty.fill(0)), t.$$.dirty[e / 31 | 0] |= 1 << e % 31;
}
function We(t, e, n, l, a, o, r = null, c = [-1]) {
  const m = ue;
  te(t);
  const f = t.$$ = {
    fragment: null,
    ctx: [],
    // state
    props: o,
    update: z,
    not_equal: a,
    bound: de(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(e.context || (m ? m.$$.context : [])),
    // everything else
    callbacks: de(),
    dirty: c,
    skip_bound: !1,
    root: e.target || m.$$.root
  };
  r && r(f.root);
  let d = !1;
  if (f.ctx = n ? n(t, e.props || {}, (s, u, ...g) => {
    const b = g.length ? g[0] : u;
    return f.ctx && a(f.ctx[s], f.ctx[s] = b) && (!f.skip_bound && f.bound[s] && f.bound[s](b), d && xe(t, s)), u;
  }) : [], f.update(), d = !0, J(f.before_update), f.fragment = l ? l(f.ctx) : !1, e.target) {
    if (e.hydrate) {
      const s = Ve(e.target);
      f.fragment && f.fragment.l(s), s.forEach(M);
    } else
      f.fragment && f.fragment.c();
    e.intro && ee(t.$$.fragment), He(t, e.target, e.anchor), Te();
  }
  te(m);
}
class Be {
  constructor() {
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    oe(this, "$$");
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    oe(this, "$$set");
  }
  /** @returns {void} */
  $destroy() {
    je(this, 1), this.$destroy = z;
  }
  /**
   * @template {Extract<keyof Events, string>} K
   * @param {K} type
   * @param {((e: Events[K]) => void) | null | undefined} callback
   * @returns {() => void}
   */
  $on(e, n) {
    if (!Me(n))
      return z;
    const l = this.$$.callbacks[e] || (this.$$.callbacks[e] = []);
    return l.push(n), () => {
      const a = l.indexOf(n);
      a !== -1 && l.splice(a, 1);
    };
  }
  /**
   * @param {Partial<Props>} props
   * @returns {void}
   */
  $set(e) {
    this.$$set && !qe(e) && (this.$$.skip_bound = !0, this.$$set(e), this.$$.skip_bound = !1);
  }
}
const $e = "4";
typeof window < "u" && (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add($e);
function pe(t) {
  const e = t instanceof Date ? t : new Date(t);
  if (isNaN(e.getTime())) return String(t);
  const l = Date.now() - e.getTime(), a = Math.floor(l / 1e3), o = Math.floor(a / 60), r = Math.floor(o / 60), c = Math.floor(r / 24);
  return a < 60 ? "just now" : o < 60 ? `${o}m ago` : r < 24 ? `${r}h ago` : c < 7 ? `${c}d ago` : e.toLocaleDateString(void 0, { month: "short", day: "numeric", year: "numeric" });
}
function ge(t) {
  return t.split(/\s+/).slice(0, 2).map((e) => {
    var n;
    return ((n = e[0]) == null ? void 0 : n.toUpperCase()) ?? "";
  }).join("");
}
function et(t) {
  let e = ge(
    /*comment*/
    t[7].author
  ) + "", n;
  return {
    c() {
      n = A(e);
    },
    m(l, a) {
      N(l, n, a);
    },
    p(l, a) {
      a & /*comment*/
      128 && e !== (e = ge(
        /*comment*/
        l[7].author
      ) + "") && q(n, e);
    },
    d(l) {
      l && M(n);
    }
  };
}
function tt(t) {
  let e, n, l;
  return {
    c() {
      e = v("img"), ce(e.src, n = /*comment*/
      t[7].avatarUrl) || i(e, "src", n), i(e, "alt", l = /*comment*/
      t[7].author), i(e, "loading", "lazy");
    },
    m(a, o) {
      N(a, e, o);
    },
    p(a, o) {
      o & /*comment*/
      128 && !ce(e.src, n = /*comment*/
      a[7].avatarUrl) && i(e, "src", n), o & /*comment*/
      128 && l !== (l = /*comment*/
      a[7].author) && i(e, "alt", l);
    },
    d(a) {
      a && M(e);
    }
  };
}
function ye(t) {
  let e, n, l, a, o, r, c, m, f, d = (
    /*comment*/
    (t[7].likeCount ?? 0) > 0 && be(t)
  );
  return {
    c() {
      e = v("button"), n = $("svg"), l = $("path"), o = I(), d && d.c(), i(l, "d", "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"), i(n, "width", "14"), i(n, "height", "14"), i(n, "viewBox", "0 0 24 24"), i(n, "fill", a = /*comment*/
      t[7].isLiked ? "currentColor" : "none"), i(n, "stroke", "currentColor"), i(n, "stroke-width", "2"), i(n, "stroke-linecap", "round"), i(n, "stroke-linejoin", "round"), i(n, "aria-hidden", "true"), i(e, "class", "canopy-action canopy-action--like"), i(e, "aria-pressed", r = /*comment*/
      t[7].isLiked ?? !1), i(e, "aria-label", c = /*comment*/
      t[7].isLiked ? "Unlike" : "Like");
    },
    m(s, u) {
      N(s, e, u), p(e, n), p(n, l), p(e, o), d && d.m(e, null), m || (f = V(
        e,
        "click",
        /*handleLike*/
        t[12]
      ), m = !0);
    },
    p(s, u) {
      u & /*comment*/
      128 && a !== (a = /*comment*/
      s[7].isLiked ? "currentColor" : "none") && i(n, "fill", a), /*comment*/
      (s[7].likeCount ?? 0) > 0 ? d ? d.p(s, u) : (d = be(s), d.c(), d.m(e, null)) : d && (d.d(1), d = null), u & /*comment*/
      128 && r !== (r = /*comment*/
      s[7].isLiked ?? !1) && i(e, "aria-pressed", r), u & /*comment*/
      128 && c !== (c = /*comment*/
      s[7].isLiked ? "Unlike" : "Like") && i(e, "aria-label", c);
    },
    d(s) {
      s && M(e), d && d.d(), m = !1, f();
    }
  };
}
function be(t) {
  let e, n = (
    /*comment*/
    t[7].likeCount + ""
  ), l;
  return {
    c() {
      e = v("span"), l = A(n);
    },
    m(a, o) {
      N(a, e, o), p(e, l);
    },
    p(a, o) {
      o & /*comment*/
      128 && n !== (n = /*comment*/
      a[7].likeCount + "") && q(l, n);
    },
    d(a) {
      a && M(e);
    }
  };
}
function ke(t) {
  let e, n, l;
  return {
    c() {
      e = v("button"), e.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 17 4 12 9 7"></polyline><path d="M20 18v-2a4 4 0 0 0-4-4H4"></path></svg>
            Reply`, i(e, "class", "canopy-action canopy-action--reply"), i(e, "aria-label", "Reply");
    },
    m(a, o) {
      N(a, e, o), n || (l = V(
        e,
        "click",
        /*openReply*/
        t[14]
      ), n = !0);
    },
    p: z,
    d(a) {
      a && M(e), n = !1, l();
    }
  };
}
function we(t) {
  let e, n, l, a, o;
  function r(f, d) {
    return (
      /*isCollapsed*/
      f[8] ? lt : nt
    );
  }
  let c = r(t), m = c(t);
  return {
    c() {
      e = v("button"), m.c(), i(e, "class", "canopy-action canopy-action--collapse"), i(e, "aria-expanded", n = !/*isCollapsed*/
      t[8]), i(e, "aria-label", l = /*isCollapsed*/
      t[8] ? `Show ${/*childCount*/
      t[9]} ${/*childCount*/
      t[9] === 1 ? "reply" : "replies"}` : "Collapse replies");
    },
    m(f, d) {
      N(f, e, d), m.m(e, null), a || (o = V(
        e,
        "click",
        /*handleCollapseToggle*/
        t[13]
      ), a = !0);
    },
    p(f, d) {
      c === (c = r(f)) && m ? m.p(f, d) : (m.d(1), m = c(f), m && (m.c(), m.m(e, null))), d & /*isCollapsed*/
      256 && n !== (n = !/*isCollapsed*/
      f[8]) && i(e, "aria-expanded", n), d & /*isCollapsed, childCount*/
      768 && l !== (l = /*isCollapsed*/
      f[8] ? `Show ${/*childCount*/
      f[9]} ${/*childCount*/
      f[9] === 1 ? "reply" : "replies"}` : "Collapse replies") && i(e, "aria-label", l);
    },
    d(f) {
      f && M(e), m.d(), a = !1, o();
    }
  };
}
function nt(t) {
  let e, n, l, a;
  return {
    c() {
      e = $("svg"), n = $("polyline"), l = I(), a = v("span"), a.textContent = "Collapse", i(n, "points", "18 15 12 9 6 15"), i(e, "width", "12"), i(e, "height", "12"), i(e, "viewBox", "0 0 24 24"), i(e, "fill", "none"), i(e, "stroke", "currentColor"), i(e, "stroke-width", "2.5"), i(e, "stroke-linecap", "round"), i(e, "stroke-linejoin", "round"), i(e, "aria-hidden", "true");
    },
    m(o, r) {
      N(o, e, r), p(e, n), N(o, l, r), N(o, a, r);
    },
    p: z,
    d(o) {
      o && (M(e), M(l), M(a));
    }
  };
}
function lt(t) {
  let e, n, l, a, o, r, c = (
    /*childCount*/
    t[9] === 1 ? "reply" : "replies"
  ), m;
  return {
    c() {
      e = $("svg"), n = $("polyline"), l = I(), a = v("span"), o = A(
        /*childCount*/
        t[9]
      ), r = I(), m = A(c), i(n, "points", "6 9 12 15 18 9"), i(e, "width", "12"), i(e, "height", "12"), i(e, "viewBox", "0 0 24 24"), i(e, "fill", "none"), i(e, "stroke", "currentColor"), i(e, "stroke-width", "2.5"), i(e, "stroke-linecap", "round"), i(e, "stroke-linejoin", "round"), i(e, "aria-hidden", "true"), i(a, "class", "canopy-collapsed-hint");
    },
    m(f, d) {
      N(f, e, d), p(e, n), N(f, l, d), N(f, a, d), p(a, o), p(a, r), p(a, m);
    },
    p(f, d) {
      d & /*childCount*/
      512 && q(
        o,
        /*childCount*/
        f[9]
      ), d & /*childCount*/
      512 && c !== (c = /*childCount*/
      f[9] === 1 ? "reply" : "replies") && q(m, c);
    },
    d(f) {
      f && (M(e), M(l), M(a));
    }
  };
}
function ve(t) {
  let e, n, l, a, o, r, c, m, f, d = (
    /*isSubmitting*/
    t[6] ? "Posting…" : "Reply"
  ), s, u, g, b, R;
  return {
    c() {
      e = v("form"), n = v("textarea"), a = I(), o = v("div"), r = v("button"), c = A("Cancel"), m = I(), f = v("button"), s = A(d), i(n, "class", "canopy-reply-input"), i(n, "placeholder", l = "Reply to " + /*comment*/
      t[7].author + "… (⌘↵ to submit)"), i(n, "rows", 3), n.disabled = /*isSubmitting*/
      t[6], i(r, "type", "button"), i(r, "class", "canopy-reply-cancel"), r.disabled = /*isSubmitting*/
      t[6], i(f, "type", "submit"), i(f, "class", "canopy-reply-submit"), f.disabled = u = !/*replyBody*/
      t[5].trim() || /*isSubmitting*/
      t[6], i(o, "class", "canopy-reply-actions"), i(e, "class", "canopy-reply-form"), i(e, "aria-label", g = "Reply to " + /*comment*/
      t[7].author);
    },
    m(w, C) {
      N(w, e, C), p(e, n), me(
        n,
        /*replyBody*/
        t[5]
      ), p(e, a), p(e, o), p(o, r), p(r, c), p(o, m), p(o, f), p(f, s), b || (R = [
        V(
          n,
          "input",
          /*textarea_input_handler*/
          t[19]
        ),
        V(
          n,
          "keydown",
          /*handleKeyDown*/
          t[16]
        ),
        V(
          r,
          "click",
          /*cancelReply*/
          t[15]
        ),
        V(
          e,
          "submit",
          /*handleSubmit*/
          t[17]
        )
      ], b = !0);
    },
    p(w, C) {
      C & /*comment*/
      128 && l !== (l = "Reply to " + /*comment*/
      w[7].author + "… (⌘↵ to submit)") && i(n, "placeholder", l), C & /*isSubmitting*/
      64 && (n.disabled = /*isSubmitting*/
      w[6]), C & /*replyBody*/
      32 && me(
        n,
        /*replyBody*/
        w[5]
      ), C & /*isSubmitting*/
      64 && (r.disabled = /*isSubmitting*/
      w[6]), C & /*isSubmitting*/
      64 && d !== (d = /*isSubmitting*/
      w[6] ? "Posting…" : "Reply") && q(s, d), C & /*replyBody, isSubmitting*/
      96 && u !== (u = !/*replyBody*/
      w[5].trim() || /*isSubmitting*/
      w[6]) && (f.disabled = u), C & /*comment*/
      128 && g !== (g = "Reply to " + /*comment*/
      w[7].author) && i(e, "aria-label", g);
    },
    d(w) {
      w && M(e), b = !1, J(R);
    }
  };
}
function it(t) {
  let e, n, l, a, o, r, c, m = (
    /*comment*/
    t[7].author + ""
  ), f, d, s, u = pe(
    /*comment*/
    t[7].timestamp
  ) + "", g, b, R, w, C, W = (
    /*comment*/
    t[7].body + ""
  ), B, P, L, H, k, _, D, j, K;
  function F(y, T) {
    return (
      /*comment*/
      y[7].avatarUrl ? tt : et
    );
  }
  let Q = F(t), U = Q(t), h = (
    /*onLike*/
    t[2] && ye(t)
  ), S = (
    /*onReply*/
    t[1] && ke(t)
  ), E = (
    /*hasChildren*/
    t[10] && /*onCollapse*/
    t[3] && we(t)
  ), O = (
    /*replyOpen*/
    t[4] && ve(t)
  );
  return {
    c() {
      e = v("div"), n = v("div"), l = v("div"), U.c(), a = I(), o = v("div"), r = v("div"), c = v("span"), f = A(m), d = I(), s = v("time"), g = A(u), w = I(), C = v("p"), B = A(W), P = I(), L = v("div"), h && h.c(), H = I(), S && S.c(), k = I(), E && E.c(), _ = I(), O && O.c(), i(l, "class", "canopy-avatar"), i(l, "aria-hidden", "true"), i(c, "class", "canopy-author"), i(s, "class", "canopy-timestamp"), i(s, "datetime", b = /*comment*/
      t[7].timestamp instanceof Date ? (
        /*comment*/
        t[7].timestamp.toISOString()
      ) : String(
        /*comment*/
        t[7].timestamp
      )), i(s, "title", R = new Date(
        /*comment*/
        t[7].timestamp
      ).toLocaleString()), i(r, "class", "canopy-header"), i(C, "class", "canopy-body"), i(L, "class", "canopy-actions"), i(L, "role", "group"), i(L, "aria-label", "Comment actions"), i(o, "class", "canopy-content"), i(n, "class", "canopy-comment"), i(n, "data-has-children", D = /*hasChildren*/
      t[10] ? "" : void 0), i(n, "data-collapsed", j = /*isCollapsed*/
      t[8] ? "" : void 0), i(e, "class", "canopy-row"), Z(
        e,
        "padding-left",
        /*depth*/
        t[11] * /*indentWidth*/
        t[0] + "px"
      ), i(
        e,
        "data-depth",
        /*depth*/
        t[11]
      ), i(e, "data-comment-id", K = /*comment*/
      t[7].id);
    },
    m(y, T) {
      N(y, e, T), p(e, n), p(n, l), U.m(l, null), p(n, a), p(n, o), p(o, r), p(r, c), p(c, f), p(r, d), p(r, s), p(s, g), p(o, w), p(o, C), p(C, B), p(o, P), p(o, L), h && h.m(L, null), p(L, H), S && S.m(L, null), p(L, k), E && E.m(L, null), p(o, _), O && O.m(o, null);
    },
    p(y, [T]) {
      Q === (Q = F(y)) && U ? U.p(y, T) : (U.d(1), U = Q(y), U && (U.c(), U.m(l, null))), T & /*comment*/
      128 && m !== (m = /*comment*/
      y[7].author + "") && q(f, m), T & /*comment*/
      128 && u !== (u = pe(
        /*comment*/
        y[7].timestamp
      ) + "") && q(g, u), T & /*comment*/
      128 && b !== (b = /*comment*/
      y[7].timestamp instanceof Date ? (
        /*comment*/
        y[7].timestamp.toISOString()
      ) : String(
        /*comment*/
        y[7].timestamp
      )) && i(s, "datetime", b), T & /*comment*/
      128 && R !== (R = new Date(
        /*comment*/
        y[7].timestamp
      ).toLocaleString()) && i(s, "title", R), T & /*comment*/
      128 && W !== (W = /*comment*/
      y[7].body + "") && q(B, W), /*onLike*/
      y[2] ? h ? h.p(y, T) : (h = ye(y), h.c(), h.m(L, H)) : h && (h.d(1), h = null), /*onReply*/
      y[1] ? S ? S.p(y, T) : (S = ke(y), S.c(), S.m(L, k)) : S && (S.d(1), S = null), /*hasChildren*/
      y[10] && /*onCollapse*/
      y[3] ? E ? E.p(y, T) : (E = we(y), E.c(), E.m(L, null)) : E && (E.d(1), E = null), /*replyOpen*/
      y[4] ? O ? O.p(y, T) : (O = ve(y), O.c(), O.m(o, null)) : O && (O.d(1), O = null), T & /*hasChildren*/
      1024 && D !== (D = /*hasChildren*/
      y[10] ? "" : void 0) && i(n, "data-has-children", D), T & /*isCollapsed*/
      256 && j !== (j = /*isCollapsed*/
      y[8] ? "" : void 0) && i(n, "data-collapsed", j), T & /*depth, indentWidth*/
      2049 && Z(
        e,
        "padding-left",
        /*depth*/
        y[11] * /*indentWidth*/
        y[0] + "px"
      ), T & /*depth*/
      2048 && i(
        e,
        "data-depth",
        /*depth*/
        y[11]
      ), T & /*comment*/
      128 && K !== (K = /*comment*/
      y[7].id) && i(e, "data-comment-id", K);
    },
    i: z,
    o: z,
    d(y) {
      y && M(e), U.d(), h && h.d(), S && S.d(), E && E.d(), O && O.d();
    }
  };
}
function ot(t, e, n) {
  let l, a, o, r, c, { item: m } = e, { indentWidth: f = 24 } = e, { onReply: d = void 0 } = e, { onLike: s = void 0 } = e, { onCollapse: u = void 0 } = e, g = !1, b = "", R = !1;
  function w() {
    s == null || s(l.id, !l.isLiked);
  }
  function C() {
    u == null || u(l.id, !r);
  }
  function W() {
    n(4, g = !0);
  }
  function B() {
    n(4, g = !1), n(5, b = "");
  }
  async function P() {
    const _ = b.trim();
    if (!(!_ || !d)) {
      n(6, R = !0);
      try {
        await d(l.id, _), n(5, b = ""), n(4, g = !1);
      } finally {
        n(6, R = !1);
      }
    }
  }
  function L(_) {
    (_.metaKey || _.ctrlKey) && _.key === "Enter" && (_.preventDefault(), P()), _.key === "Escape" && B();
  }
  function H(_) {
    _.preventDefault(), P();
  }
  function k() {
    b = this.value, n(5, b);
  }
  return t.$$set = (_) => {
    "item" in _ && n(18, m = _.item), "indentWidth" in _ && n(0, f = _.indentWidth), "onReply" in _ && n(1, d = _.onReply), "onLike" in _ && n(2, s = _.onLike), "onCollapse" in _ && n(3, u = _.onCollapse);
  }, t.$$.update = () => {
    t.$$.dirty & /*item*/
    262144 && n(7, { comment: l, depth: a, hasChildren: o, isCollapsed: r, childCount: c } = m, l, (n(11, a), n(18, m)), (n(10, o), n(18, m)), (n(8, r), n(18, m)), (n(9, c), n(18, m)));
  }, [
    f,
    d,
    s,
    u,
    g,
    b,
    R,
    l,
    r,
    c,
    o,
    a,
    w,
    C,
    W,
    B,
    L,
    H,
    m,
    k
  ];
}
class at extends Be {
  constructor(e) {
    super(), We(this, e, ot, it, Ee, {
      item: 18,
      indentWidth: 0,
      onReply: 1,
      onLike: 2,
      onCollapse: 3
    });
  }
}
function Ce(t, e, n) {
  const l = t.slice();
  return l[29] = e[n], l;
}
function ft(t) {
  let e, n, l = [], a = /* @__PURE__ */ new Map(), o, r, c, m, f = _e(
    /*visibleItems*/
    t[10]
  );
  const d = (s) => (
    /*item*/
    s[29].comment.id
  );
  for (let s = 0; s < f.length; s += 1) {
    let u = Ce(t, f, s), g = d(u);
    a.set(g, l[s] = Se(g, u));
  }
  return {
    c() {
      e = v("div"), n = v("div");
      for (let s = 0; s < l.length; s += 1)
        l[s].c();
      Z(
        n,
        "padding-top",
        /*paddingTop*/
        t[9] + "px"
      ), Z(
        n,
        "padding-bottom",
        /*paddingBottom*/
        t[8] + "px"
      ), i(e, "class", "canopy-scroll"), i(e, "style", o = /*height*/
      t[2] !== void 0 ? `height: ${/*height*/
      t[2]}px` : void 0), i(e, "tabindex", "-1");
    },
    m(s, u) {
      N(s, e, u), p(e, n);
      for (let g = 0; g < l.length; g += 1)
        l[g] && l[g].m(n, null);
      t[27](e), r = !0, c || (m = V(
        e,
        "scroll",
        /*handleScroll*/
        t[12]
      ), c = !0);
    },
    p(s, u) {
      u[0] & /*visibleItems, indentWidth, onReply, onLike, handleCollapse*/
      3170 && (f = _e(
        /*visibleItems*/
        s[10]
      ), Ne(), l = Ye(l, u, d, 1, s, f, a, n, Xe, Se, null, Ce), De()), (!r || u[0] & /*paddingTop*/
      512) && Z(
        n,
        "padding-top",
        /*paddingTop*/
        s[9] + "px"
      ), (!r || u[0] & /*paddingBottom*/
      256) && Z(
        n,
        "padding-bottom",
        /*paddingBottom*/
        s[8] + "px"
      ), (!r || u[0] & /*height*/
      4 && o !== (o = /*height*/
      s[2] !== void 0 ? `height: ${/*height*/
      s[2]}px` : void 0)) && i(e, "style", o);
    },
    i(s) {
      if (!r) {
        for (let u = 0; u < f.length; u += 1)
          ee(l[u]);
        r = !0;
      }
    },
    o(s) {
      for (let u = 0; u < l.length; u += 1)
        ne(l[u]);
      r = !1;
    },
    d(s) {
      s && M(e);
      for (let u = 0; u < l.length; u += 1)
        l[u].d();
      t[27](null), c = !1, m();
    }
  };
}
function rt(t) {
  let e, n;
  return {
    c() {
      e = v("div"), n = A(
        /*emptyStateText*/
        t[3]
      ), i(e, "class", "canopy-empty");
    },
    m(l, a) {
      N(l, e, a), p(e, n);
    },
    p(l, a) {
      a[0] & /*emptyStateText*/
      8 && q(
        n,
        /*emptyStateText*/
        l[3]
      );
    },
    i: z,
    o: z,
    d(l) {
      l && M(e);
    }
  };
}
function Se(t, e) {
  let n, l, a;
  return l = new at({
    props: {
      item: (
        /*item*/
        e[29]
      ),
      indentWidth: (
        /*indentWidth*/
        e[1]
      ),
      onReply: (
        /*onReply*/
        e[5]
      ),
      onLike: (
        /*onLike*/
        e[6]
      ),
      onCollapse: (
        /*handleCollapse*/
        e[11]
      )
    }
  }), {
    key: t,
    first: null,
    c() {
      n = ze(), Ze(l.$$.fragment), this.first = n;
    },
    m(o, r) {
      N(o, n, r), He(l, o, r), a = !0;
    },
    p(o, r) {
      e = o;
      const c = {};
      r[0] & /*visibleItems*/
      1024 && (c.item = /*item*/
      e[29]), r[0] & /*indentWidth*/
      2 && (c.indentWidth = /*indentWidth*/
      e[1]), r[0] & /*onReply*/
      32 && (c.onReply = /*onReply*/
      e[5]), r[0] & /*onLike*/
      64 && (c.onLike = /*onLike*/
      e[6]), l.$set(c);
    },
    i(o) {
      a || (ee(l.$$.fragment, o), a = !0);
    },
    o(o) {
      ne(l.$$.fragment, o), a = !1;
    },
    d(o) {
      o && M(n), je(l, o);
    }
  };
}
function st(t) {
  let e, n, l, a, o;
  const r = [rt, ft], c = [];
  function m(f, d) {
    return (
      /*comments*/
      f[0].length === 0 ? 0 : 1
    );
  }
  return n = m(t), l = c[n] = r[n](t), {
    c() {
      e = v("div"), l.c(), i(e, "class", a = "canopy-thread " + /*className*/
      t[4]), i(e, "role", "region"), i(e, "aria-label", "Comments");
    },
    m(f, d) {
      N(f, e, d), c[n].m(e, null), o = !0;
    },
    p(f, d) {
      let s = n;
      n = m(f), n === s ? c[n].p(f, d) : (Ne(), ne(c[s], 1, 1, () => {
        c[s] = null;
      }), De(), l = c[n], l ? l.p(f, d) : (l = c[n] = r[n](f), l.c()), ee(l, 1), l.m(e, null)), (!o || d[0] & /*className*/
      16 && a !== (a = "canopy-thread " + /*className*/
      f[4])) && i(e, "class", a);
    },
    i(f) {
      o || (ee(l), o = !0);
    },
    o(f) {
      ne(l), o = !1;
    },
    d(f) {
      f && M(e), c[n].d();
    }
  };
}
const Re = 5;
function ut(t, e, n) {
  let l, a, o, r, c, m, f, d, s, { comments: u = [] } = e, { indentWidth: g = 24 } = e, { height: b = void 0 } = e, { estimatedRowHeight: R = 80 } = e, { emptyStateText: w = "No comments yet. Be the first!" } = e, { className: C = "" } = e, { defaultCollapsed: W = [] } = e, { collapsed: B = void 0 } = e, { onReply: P = void 0 } = e, { onLike: L = void 0 } = e, { onCollapse: H = void 0 } = e, { onScrollEnd: k = void 0 } = e, _ = new Set(W);
  function D(h, S) {
    if (!l) {
      const E = new Set(_);
      S ? E.add(h) : E.delete(h), n(18, _ = E);
    }
    H == null || H(h, S);
  }
  let j, K = 0, F = 0;
  function Q(h) {
    const S = h.currentTarget;
    n(19, K = S.scrollTop), n(20, F = S.clientHeight), k && S.scrollTop + S.clientHeight >= S.scrollHeight - 40 && k();
  }
  Ke(() => {
    j && n(20, F = j.clientHeight);
  });
  function U(h) {
    fe[h ? "unshift" : "push"](() => {
      j = h, n(7, j);
    });
  }
  return t.$$set = (h) => {
    "comments" in h && n(0, u = h.comments), "indentWidth" in h && n(1, g = h.indentWidth), "height" in h && n(2, b = h.height), "estimatedRowHeight" in h && n(13, R = h.estimatedRowHeight), "emptyStateText" in h && n(3, w = h.emptyStateText), "className" in h && n(4, C = h.className), "defaultCollapsed" in h && n(14, W = h.defaultCollapsed), "collapsed" in h && n(15, B = h.collapsed), "onReply" in h && n(5, P = h.onReply), "onLike" in h && n(6, L = h.onLike), "onCollapse" in h && n(16, H = h.onCollapse), "onScrollEnd" in h && n(17, k = h.onScrollEnd);
  }, t.$$.update = () => {
    t.$$.dirty[0] & /*collapsed*/
    32768 && n(26, l = B !== void 0), t.$$.dirty[0] & /*isControlled, collapsed, internalCollapsed*/
    67403776 && n(24, a = l ? new Set(B) : _), t.$$.dirty[0] & /*comments*/
    1 && n(25, o = Ue(u)), t.$$.dirty[0] & /*forest*/
    33554432 && Ae(o), t.$$.dirty[0] & /*forest, activeCollapsed*/
    50331648 && n(22, r = Pe(o, a)), t.$$.dirty[0] & /*scrollTop, estimatedRowHeight*/
    532480 && n(23, c = Math.max(0, Math.floor(K / R) - Re)), t.$$.dirty[0] & /*flatItems, scrollTop, containerHeight, estimatedRowHeight*/
    5775360 && n(21, m = Math.min(r.length, Math.ceil((K + F) / R) + Re)), t.$$.dirty[0] & /*flatItems, startIdx, endIdx*/
    14680064 && n(10, f = r.slice(c, m)), t.$$.dirty[0] & /*startIdx, estimatedRowHeight*/
    8396800 && n(9, d = c * R), t.$$.dirty[0] & /*flatItems, endIdx, estimatedRowHeight*/
    6299648 && n(8, s = Math.max(0, (r.length - m) * R));
  }, [
    u,
    g,
    b,
    w,
    C,
    P,
    L,
    j,
    s,
    d,
    f,
    D,
    Q,
    R,
    W,
    B,
    H,
    k,
    _,
    K,
    F,
    m,
    r,
    c,
    a,
    o,
    l,
    U
  ];
}
class ht extends Be {
  constructor(e) {
    super(), We(
      this,
      e,
      ut,
      st,
      Ee,
      {
        comments: 0,
        indentWidth: 1,
        height: 2,
        estimatedRowHeight: 13,
        emptyStateText: 3,
        className: 4,
        defaultCollapsed: 14,
        collapsed: 15,
        onReply: 5,
        onLike: 6,
        onCollapse: 16,
        onScrollEnd: 17
      },
      null,
      [-1, -1]
    );
  }
}
export {
  at as CommentRow,
  ht as CommentThread
};
