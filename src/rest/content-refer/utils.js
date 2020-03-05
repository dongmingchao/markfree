function contentParse(children, refer) {
  const ret = [];
  for (const each of children) {
    let one = each;
    if (one.constructor.name === "Array") {
      one = contentParse(one, refer);
    }
    while (one.content !== undefined) {
      const ref = refer[one.content];
      one = ref;
    }
    if (one.title) {
      const t = one.title;
      if (t.constructor.name === "Array") {
        one.title = contentParse(t, refer);
      }
    }
    if (one.children) {
      one.children = contentParse(one.children, refer);
    }
    ret.push(one);
  }
  return ret;
}
