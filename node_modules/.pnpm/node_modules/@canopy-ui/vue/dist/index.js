import { defineComponent as B, computed as d, ref as f, openBlock as n, createElementBlock as i, normalizeStyle as L, createElementVNode as o, Fragment as D, createTextVNode as M, toDisplayString as h, unref as $, createCommentVNode as b, withModifiers as E, withDirectives as N, vModelText as j, nextTick as I, onMounted as U, normalizeClass as V, renderList as z, createBlock as K } from "vue";
import { buildTree as W, flattenTree as O } from "@kanopee/core";
function A(l) {
  const e = l instanceof Date ? l : new Date(l);
  if (isNaN(e.getTime())) return String(l);
  const k = Date.now() - e.getTime(), g = Math.floor(k / 1e3), r = Math.floor(g / 60), c = Math.floor(r / 60), v = Math.floor(c / 24);
  return g < 60 ? "just now" : r < 60 ? `${r}m ago` : c < 24 ? `${c}h ago` : v < 7 ? `${v}d ago` : e.toLocaleDateString(void 0, { month: "short", day: "numeric", year: "numeric" });
}
function F(l) {
  return l.split(/\s+/).slice(0, 2).map((e) => {
    var a;
    return ((a = e[0]) == null ? void 0 : a.toUpperCase()) ?? "";
  }).join("");
}
const P = ["data-depth", "data-comment-id"], q = ["data-has-children", "data-collapsed"], G = {
  class: "canopy-avatar",
  "aria-hidden": "true"
}, J = ["src", "alt"], Q = { class: "canopy-content" }, X = { class: "canopy-header" }, Y = { class: "canopy-author" }, Z = ["datetime", "title"], ee = { class: "canopy-body" }, te = {
  class: "canopy-actions",
  role: "group",
  "aria-label": "Comment actions"
}, ae = ["aria-pressed", "aria-label"], le = ["fill"], oe = { key: 0 }, ne = ["aria-expanded", "aria-label"], ie = {
  key: 0,
  width: "12",
  height: "12",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2.5",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, se = {
  key: 1,
  width: "12",
  height: "12",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2.5",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, de = {
  key: 2,
  class: "canopy-collapsed-hint"
}, re = { key: 3 }, ce = ["aria-label"], ue = ["placeholder", "disabled"], pe = { class: "canopy-reply-actions" }, he = ["disabled"], ve = ["disabled"], me = /* @__PURE__ */ B({
  __name: "CommentRow",
  props: {
    item: {},
    indentWidth: { default: 24 },
    onReply: {},
    onLike: {},
    onCollapse: {}
  },
  setup(l) {
    const e = l, a = d(() => e.item.comment), k = d(() => e.item.depth), g = d(() => e.item.hasChildren), r = d(() => e.item.isCollapsed), c = d(() => e.item.childCount), v = d(() => {
      const t = a.value.timestamp;
      return t instanceof Date ? t.toISOString() : String(t);
    }), m = f(!1), u = f(""), p = f(!1), C = f();
    function _() {
      var t;
      (t = e.onLike) == null || t.call(e, a.value.id, !a.value.isLiked);
    }
    function S() {
      var t;
      (t = e.onCollapse) == null || t.call(e, a.value.id, !r.value);
    }
    async function T() {
      var t;
      m.value = !0, await I(), (t = C.value) == null || t.focus();
    }
    function x() {
      m.value = !1, u.value = "";
    }
    async function R() {
      const t = u.value.trim();
      if (!(!t || !e.onReply)) {
        p.value = !0;
        try {
          await e.onReply(a.value.id, t), u.value = "", m.value = !1;
        } finally {
          p.value = !1;
        }
      }
    }
    function y(t) {
      (t.metaKey || t.ctrlKey) && t.key === "Enter" && (t.preventDefault(), R()), t.key === "Escape" && x();
    }
    return (t, s) => (n(), i("div", {
      class: "canopy-row",
      style: L({ paddingLeft: `${k.value * l.indentWidth}px` }),
      "data-depth": k.value,
      "data-comment-id": a.value.id
    }, [
      o("div", {
        class: "canopy-comment",
        "data-has-children": g.value ? "" : void 0,
        "data-collapsed": r.value ? "" : void 0
      }, [
        o("div", G, [
          a.value.avatarUrl ? (n(), i("img", {
            key: 0,
            src: a.value.avatarUrl,
            alt: a.value.author,
            loading: "lazy"
          }, null, 8, J)) : (n(), i(D, { key: 1 }, [
            M(h($(F)(a.value.author)), 1)
          ], 64))
        ]),
        o("div", Q, [
          o("div", X, [
            o("span", Y, h(a.value.author), 1),
            o("time", {
              class: "canopy-timestamp",
              datetime: v.value,
              title: new Date(a.value.timestamp).toLocaleString()
            }, h($(A)(a.value.timestamp)), 9, Z)
          ]),
          o("p", ee, h(a.value.body), 1),
          o("div", te, [
            l.onLike ? (n(), i("button", {
              key: 0,
              class: "canopy-action canopy-action--like",
              "aria-pressed": a.value.isLiked ?? !1,
              "aria-label": a.value.isLiked ? "Unlike" : "Like",
              onClick: _
            }, [
              (n(), i("svg", {
                width: "14",
                height: "14",
                viewBox: "0 0 24 24",
                fill: a.value.isLiked ? "currentColor" : "none",
                stroke: "currentColor",
                "stroke-width": "2",
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
                "aria-hidden": "true"
              }, [...s[1] || (s[1] = [
                o("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" }, null, -1)
              ])], 8, le)),
              (a.value.likeCount ?? 0) > 0 ? (n(), i("span", oe, h(a.value.likeCount), 1)) : b("", !0)
            ], 8, ae)) : b("", !0),
            l.onReply ? (n(), i("button", {
              key: 1,
              class: "canopy-action canopy-action--reply",
              "aria-label": "Reply",
              onClick: T
            }, [...s[2] || (s[2] = [
              o("svg", {
                width: "14",
                height: "14",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2",
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
                "aria-hidden": "true"
              }, [
                o("polyline", { points: "9 17 4 12 9 7" }),
                o("path", { d: "M20 18v-2a4 4 0 0 0-4-4H4" })
              ], -1),
              M(" Reply ", -1)
            ])])) : b("", !0),
            g.value && l.onCollapse ? (n(), i("button", {
              key: 2,
              class: "canopy-action canopy-action--collapse",
              "aria-expanded": !r.value,
              "aria-label": r.value ? `Show ${c.value} ${c.value === 1 ? "reply" : "replies"}` : "Collapse replies",
              onClick: S
            }, [
              r.value ? (n(), i("svg", ie, [...s[3] || (s[3] = [
                o("polyline", { points: "6 9 12 15 18 9" }, null, -1)
              ])])) : (n(), i("svg", se, [...s[4] || (s[4] = [
                o("polyline", { points: "18 15 12 9 6 15" }, null, -1)
              ])])),
              r.value ? (n(), i("span", de, h(c.value) + " " + h(c.value === 1 ? "reply" : "replies"), 1)) : (n(), i("span", re, "Collapse"))
            ], 8, ne)) : b("", !0)
          ]),
          m.value ? (n(), i("form", {
            key: 0,
            class: "canopy-reply-form",
            "aria-label": `Reply to ${a.value.author}`,
            onSubmit: E(R, ["prevent"])
          }, [
            N(o("textarea", {
              ref_key: "textareaRef",
              ref: C,
              class: "canopy-reply-input",
              "onUpdate:modelValue": s[0] || (s[0] = (w) => u.value = w),
              placeholder: `Reply to ${a.value.author}… (⌘↵ to submit)`,
              rows: 3,
              disabled: p.value,
              onKeydown: y
            }, null, 40, ue), [
              [j, u.value]
            ]),
            o("div", pe, [
              o("button", {
                type: "button",
                class: "canopy-reply-cancel",
                disabled: p.value,
                onClick: x
              }, " Cancel ", 8, he),
              o("button", {
                type: "submit",
                class: "canopy-reply-submit",
                disabled: !u.value.trim() || p.value
              }, h(p.value ? "Posting…" : "Reply"), 9, ve)
            ])
          ], 40, ce)) : b("", !0)
        ])
      ], 8, q)
    ], 12, P));
  }
}), ye = {
  key: 0,
  class: "canopy-empty"
}, H = 5, ge = /* @__PURE__ */ B({
  __name: "CommentThread",
  props: {
    comments: {},
    indentWidth: { default: 24 },
    height: {},
    estimatedRowHeight: { default: 80 },
    emptyStateText: { default: "No comments yet. Be the first!" },
    className: { default: "" },
    defaultCollapsed: { default: () => [] },
    collapsed: {},
    onReply: {},
    onLike: {},
    onCollapse: {},
    onScrollEnd: {}
  },
  setup(l) {
    const e = l, a = f(new Set(e.defaultCollapsed)), k = d(() => e.collapsed !== void 0), g = d(
      () => k.value ? new Set(e.collapsed) : a.value
    );
    function r(y, t) {
      var s;
      if (!k.value) {
        const w = new Set(a.value);
        t ? w.add(y) : w.delete(y), a.value = w;
      }
      (s = e.onCollapse) == null || s.call(e, y, t);
    }
    const c = d(() => W(e.comments)), v = d(() => O(c.value, g.value)), m = f(), u = f(0), p = f(0), C = d(
      () => Math.max(0, Math.floor(u.value / e.estimatedRowHeight) - H)
    ), _ = d(
      () => Math.min(
        v.value.length,
        Math.ceil((u.value + p.value) / e.estimatedRowHeight) + H
      )
    ), S = d(() => v.value.slice(C.value, _.value)), T = d(() => C.value * e.estimatedRowHeight), x = d(
      () => Math.max(0, (v.value.length - _.value) * e.estimatedRowHeight)
    );
    function R(y) {
      const t = y.currentTarget;
      u.value = t.scrollTop, p.value = t.clientHeight, e.onScrollEnd && t.scrollTop + t.clientHeight >= t.scrollHeight - 40 && e.onScrollEnd();
    }
    return U(() => {
      m.value && (p.value = m.value.clientHeight);
    }), (y, t) => (n(), i("div", {
      class: V(["canopy-thread", l.className]),
      role: "region",
      "aria-label": "Comments"
    }, [
      l.comments.length === 0 ? (n(), i("div", ye, h(l.emptyStateText), 1)) : (n(), i("div", {
        key: 1,
        ref_key: "scrollEl",
        ref: m,
        class: "canopy-scroll",
        style: L(l.height !== void 0 ? { height: `${l.height}px` } : void 0),
        tabindex: "-1",
        onScroll: R
      }, [
        o("div", {
          style: L({ paddingTop: `${T.value}px`, paddingBottom: `${x.value}px` })
        }, [
          (n(!0), i(D, null, z(S.value, (s) => (n(), K(me, {
            key: s.comment.id,
            item: s,
            "indent-width": l.indentWidth,
            "on-reply": l.onReply,
            "on-like": l.onLike,
            "on-collapse": r
          }, null, 8, ["item", "indent-width", "on-reply", "on-like"]))), 128))
        ], 4)
      ], 36))
    ], 2));
  }
});
export {
  me as CommentRow,
  ge as CommentThread
};
