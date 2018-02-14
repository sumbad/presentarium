import { Define, UmWebComponent } from 'components/um-web.component';

import template from './template';


@Define('um-slide-content')
export class SlideContentComponent extends UmWebComponent {


  constructor() {
    super(template, '', true);
  }
}