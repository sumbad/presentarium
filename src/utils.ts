export function render(tpl: string, el: HTMLElement | ShadowRoot, afterRenderHook?: () => void) {
  el.innerHTML = tpl;

  // TODO: save as a concept
  for (const ref of tpl.matchAll(/rel="(.*)"/gi)) {
    const key = ref.at(1);
    if (key != null) {
      this[key] = el.querySelector(`[${ref.at(0)}]`);
    }
  }

  afterRenderHook?.();
}
