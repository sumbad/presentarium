import { Define, UmWebComponent } from 'components/um-web.component';

declare const $: any;

import template from './template';

import './um-slide-content';



@Define('um-slide')
export class SlideComponent extends UmWebComponent {
  // static attributes = ['content'];
  // static get observedAttributes() { return this.attributes; }

  content;

  constructor() {
    super(template);

    const html = this.wire();
    this.content = this.innerHTML;
  }


  // connectedCallback() {
  //   super.connectedCallback(SlideComponent.attributes);
  // }

}