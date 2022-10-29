import { EG } from '@web-companions/gfc';
import { setStyle } from '@web-companions/h';
import { render } from 'utils';

// TODO: include by default inside babel-plugin-transform-jsx-to-tt or add as a function in @web-companions/h
const html = String.raw;

export const slideElement = EG()(function* (params) {
  const $ = this.attachShadow({ mode: 'open' });
  const content = this.innerHTML;

  setStyle(require('./slide.style.scss'), $);

  while (true) {
    yield render(
      <section>
        <slot></slot>
      </section>,
      $
    );
  }
});
