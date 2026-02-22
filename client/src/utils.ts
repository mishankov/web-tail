function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function smoothScroll(element: Element): void {
  element.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
}

export {
  escapeRegExp,
  smoothScroll,
};
