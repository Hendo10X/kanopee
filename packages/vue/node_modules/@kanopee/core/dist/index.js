function h(c) {
  const o = /* @__PURE__ */ new Map(), e = [];
  for (const n of c)
    o.set(n.id, { ...n, children: [] });
  for (const n of c) {
    const t = o.get(n.id), i = n.parentId;
    i != null && o.has(i) ? o.get(i).children.push(t) : e.push(t);
  }
  return e;
}
function d(c, o, e = 0) {
  const n = [];
  for (const t of c) {
    const i = o.has(t.id), r = t.children.length > 0;
    if (n.push({
      comment: t,
      depth: e,
      hasChildren: r,
      isCollapsed: i,
      childCount: t.children.length
    }), !i && r) {
      const s = d(t.children, o, e + 1);
      for (const f of s)
        n.push(f);
    }
  }
  return n;
}
function l(c, o, e) {
  const n = new Set(e);
  function t(i) {
    n.add(i);
    const r = o.get(i);
    if (r)
      for (const s of r.children)
        t(s.id);
  }
  return t(c), n;
}
function a(c) {
  const o = /* @__PURE__ */ new Map();
  function e(n) {
    o.set(n.id, n);
    for (const t of n.children)
      e(t);
  }
  for (const n of c)
    e(n);
  return o;
}
function u(c, o, e) {
  const n = o.get(c);
  if (!n || e.has(c)) return 0;
  let t = 0;
  for (const i of n.children)
    t += 1 + u(i.id, o, e);
  return t;
}
export {
  a as buildNodeMap,
  h as buildTree,
  l as collapseSubtree,
  u as countVisibleDescendants,
  d as flattenTree
};
//# sourceMappingURL=index.js.map
