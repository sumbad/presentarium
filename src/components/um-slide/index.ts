import { Define, UmWebComponent } from 'components/um-web.component';

import template from './template';
import './um-slide-content';



@Define('um-slide')
export class SlideComponent extends UmWebComponent {
  content;


  constructor() {
    super(template);

    this.content = this.innerHTML;
  }
}