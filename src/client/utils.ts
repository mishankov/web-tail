function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

function smoothScroll(element: Element) {
  element.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
}

export { escapeRegExp, smoothScroll };
