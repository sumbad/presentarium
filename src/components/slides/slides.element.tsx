import { EG } from '@web-companions/gfc';
import { setStyle } from '@web-companions/h';
import { render } from 'utils';
import * as Velocity from 'velocity-animate';
import 'velocity-animate/velocity.ui';

const html = String.raw;

export const slidesElement = EG()(function* () {
  const $ = this.attachShadow({ mode: 'open' });
  // let slides: string;
  let animatingType: 'next' | 'prev';
  let delta: any;
  let nextArrow: Element;
  let prevArrow: Element;
  let verticalNav: any;
  let sectionsAvailable: Element[];
  let animating: boolean;
  let actual: number;
  let scrollThreshold: number;
  let animationType: string;
  let hijacking: string;
  let lastScrollTop = 0;
  let scrollDirectionType: 'down' | 'up';

  requestAnimationFrame(() => {
    setStyle(require('./slides.style.scss'), $);
    // setStyle(require('./style.scss'), ;

    // special stiles for um-slide component
    // const commonStyle = document.createElement('style');
    // commonStyle.textContent = require('./common.scss');

    // insertBefore(commonStyle, firstChild);

    // const html = wire();
    // slides = innerHTML;

    // scrollAnimation = scrollAnimation.bind(;
    // nextSection = nextSection.bind(;
    // prevSection = prevSection.bind(;
    // keyboardEventListener = keyboardEventListener.bind(;

    // super.connectedCallback(SlidesComponent.attributes);

    //variables
    hijacking = 'off'; ///$('body').data('hijacking');
    animationType = 'gallery'; //'scaleDown';///$('body').data('animation');
    scrollThreshold = 5;
    actual = 1;
    animating = false;

    sectionsAvailable = Array.from(this.querySelectorAll('um-slide')); //wire() `${{ html: slides }}`;

    // this.next();
    // wait until presentation render will finish
    setTimeout(() => {
      registerEffectVelocity();
    });

    // sectionsAvailable = sectionsAvailable.childNodes;
    // $('.cd-section');

    verticalNav = $.querySelector('.cd-vertical-nav'); //$('.cd-vertical-nav');
    prevArrow = verticalNav.querySelector('a.cd-prev'); //verticalNav.find('a.cd-prev')[0];
    nextArrow = verticalNav.querySelector('a.cd-next'); //verticalNav.find('a.cd-next')[0];

    //check the media query and bind corresponding events
    let MQ = deviceType();
    let bindToggle = false;

    bindEvents(MQ, true);

    // TODO: use a separate function and add removeEventListener
    window.addEventListener('resize', () => {
      MQ = deviceType();
      bindEvents(MQ, bindToggle);
      if (MQ == 'mobile') bindToggle = true;
      if (MQ == 'desktop') bindToggle = false;
    });
  });

  const bindEvents = (MQ, bool) => {
    if (MQ == 'desktop' && bool) {
      //bind the animation to the window scroll event, arrows click and keyboard
      // if (hijacking == 'on') {
      //   // initHijacking();
      //   // window.addEventListener('DOMMouseScroll mousewheel', scrollHijacking.bind();
      // } else {
      scrollAnimation();
      window.addEventListener('scroll', scrollAnimation);
      // }

      prevArrow.addEventListener('click', prevSection);
      nextArrow.addEventListener('click', nextSection);

      document.addEventListener('keydown', keyboardEventListener);
      //set navigation arrows visibility
      checkNavigation();
    } else if (MQ == 'mobile') {
      //reset and unbind
      resetSectionStyle();
      // window.removeEventListener('DOMMouseScroll mousewheel', scrollHijacking.bind();
      // window.removeEventListener('scroll', scrollAnimation);
      // prevArrow.removeEventListener('click', prevSection.bind();
      // nextArrow.removeEventListener('click', nextSection.bind();
      // document.removeEventListener('keydown', keyboardEventListener.bind();
    }
  };

  function keyboardEventListener(event) {
    if (event.which === 40 && !nextArrow.classList.contains('inactive')) {
      event.preventDefault();
      nextSection();
    } else if (
      event.which === 38 &&
      !prevArrow.classList.contains('inactive')
      //   || (prevArrow.classList.contains('inactive') && $(window).scrollTop() != (sectionsAvailable as any).eq(0).offset().top)
    ) {
      event.preventDefault();
      prevSection();
    }
  }

  /**
   * normal scroll - use requestAnimationFrame (if defined) to optimize performance
   */
  function scrollAnimation() {
    let st = window.screenY || window.pageYOffset || document.documentElement.scrollTop;
    if (st > lastScrollTop) {
      scrollDirectionType = 'down';
    } else {
      scrollDirectionType = 'up';
    }
    lastScrollTop = st;

    //normal scroll - use requestAnimationFrame (if defined) to optimize performance
    !window.requestAnimationFrame ? animateSection() : window.requestAnimationFrame(() => animateSection());
  }

  function animateSection() {
    let windowHeight = window.innerHeight;

    sectionsAvailable.forEach((actualBlock: Element) => {
      let offset = -actualBlock.getBoundingClientRect().top;

      //according to animation type and window scroll, define animation parameters
      var animationValues = setSectionAnimation(offset, windowHeight, animationType);

      const sectionBlock = actualBlock.shadowRoot!.lastElementChild!!;
      
      transformSection(
        sectionBlock,
        animationValues[0],
        animationValues[1],
        animationValues[2],
        animationValues[3],
        animationValues[4]
      );

      // console.log(actualBlock);
      // console.log('offset < windowHeight ' + (offset < windowHeight));
      // console.log('offset >= 0 ' + (offset >= 0));
      // console.log('offset', offset);
      // console.log('windowHeight', windowHeight);

      // (offset >= 0 && offset < windowHeight) ? actualBlock.setAttribute('visible', '') : actualBlock.removeAttribute('visible');

      Math.abs(offset) < windowHeight ? actualBlock.setAttribute('visible', '') : actualBlock.removeAttribute('visible');
    });

    checkNavigation();
  }

  /**
   * Transform sections - normal scroll
   *
   * @param element
   * @param translateY
   * @param scaleValue
   * @param rotateXValue
   * @param opacityValue
   * @param boxShadow
   */
  function transformSection(element: Element, translateY, scaleValue, rotateXValue, opacityValue, boxShadow) {
    // console.log(translateY)
    Velocity(
      element,
      {
        translateY: translateY, //+ 'vh',
        scale: scaleValue,
        rotateX: rotateXValue,
        opacity: opacityValue,
        boxShadowBlur: boxShadow, //+ 'px',
        translateZ: 0,
      },
      0
    );
    // element.velocity({
    //   translateY: translateY + 'vh',
    //   scale: scaleValue,
    //   rotateX: rotateXValue,
    //   opacity: opacityValue,
    //   boxShadowBlur: boxShadow + 'px',
    //   translateZ: 0,
    // }, 0);
  }

  // initHijacking() {
  //   // initialize section style - scrollhijacking
  //   var visibleSection = sectionsAvailable.filter('.visible'),
  //     topSection = visibleSection.prevAll('.cd-section'),
  //     bottomSection = visibleSection.nextAll('.cd-section'),
  //     animationParams = selectAnimation(animationType, false),
  //     animationVisible = animationParams[0],
  //     animationTop = animationParams[1],
  //     animationBottom = animationParams[2];

  //   visibleSection.children('div').velocity(animationVisible, 1, () => {
  //     visibleSection.css('opacity', 1);
  //     topSection.css('opacity', 1);
  //     bottomSection.css('opacity', 1);
  //   });
  //   topSection.children('div').velocity(animationTop, 0);
  //   bottomSection.children('div').velocity(animationBottom, 0);
  // }

  function scrollHijacking(event) {
    // on mouse scroll - check if animate section
    if (event.originalEvent.detail < 0 || event.originalEvent.wheelDelta > 0) {
      delta--;
      Math.abs(delta) >= scrollThreshold && prevSection();
    } else {
      delta++;
      delta >= scrollThreshold && nextSection();
    }
    return false;
  }

  /**
   * Go to previous section
   * @param event
   */
  function prevSection(event?) {
    typeof event !== 'undefined' && event.preventDefault();
    let visibleSectionIndex = sectionsAvailable.map((element) => element.hasAttribute('visible')).lastIndexOf(true);
    let visibleSection: Element = sectionsAvailable[visibleSectionIndex];
    let prevSection: Element = sectionsAvailable[visibleSectionIndex - 1];

    const middleScroll = hijacking == 'off' && visibleSection.getBoundingClientRect().top !== 0 ? true : false;
    if (middleScroll && animating && animatingType === 'next') {
      visibleSectionIndex++;
      visibleSection = sectionsAvailable[visibleSectionIndex];
      prevSection = sectionsAvailable[visibleSectionIndex - 1];
    }

    if (prevSection) {
      animatingType = 'prev';
      const animationParams = selectAnimation(animationType, middleScroll, 'prev');

      scrollingToSection(visibleSection, prevSection, {
        visible: animationParams[0],
        goTo: animationParams[2],
        duration: animationParams[3],
        easing: animationParams[4],
      });
    }
  }

  /**
   * Go to the next slide
   * @param event
   */
  function nextSection(event?) {
    typeof event !== 'undefined' && event.preventDefault();

    let visibleSectionIndex = sectionsAvailable.findIndex((element) => {
      return element.hasAttribute('visible');
    });
    let visibleSection: Element = sectionsAvailable[visibleSectionIndex];
    let nextSection: Element = sectionsAvailable[visibleSectionIndex + 1];

    const middleScroll = hijacking == 'off' && visibleSection.getBoundingClientRect().top !== 0 ? true : false;

    if (middleScroll && animating && animatingType === 'prev') {
      visibleSectionIndex--;
      visibleSection = sectionsAvailable[visibleSectionIndex];
      nextSection = sectionsAvailable[visibleSectionIndex + 1];
    }

    if (nextSection) {
      animatingType = 'next';
      const animationParams = selectAnimation(animationType, middleScroll, 'next');
      scrollingToSection(visibleSection, nextSection, {
        visible: animationParams[0],
        goTo: animationParams[1],
        duration: animationParams[3],
        easing: animationParams[4],
      });
    }
  }

  function scrollingToSection(visibleSection, gotoSection, anim: { visible; goTo; duration; easing }) {
    if (!animating) {
      // console.log(anim)
      unbindScroll(gotoSection, anim.duration);
      animating = true;
      // console.log('animating start')
      Velocity(visibleSection.shadowRoot!.lastElementChild!, anim.goTo, anim.duration, anim.easing);
      Velocity(gotoSection.shadowRoot!.lastElementChild!, anim.visible, anim.duration, anim.easing, () => {
        // console.log('animating stop')
        if (animating) {
          visibleSection.removeAttribute('visible');
          gotoSection.setAttribute('visible', '');
          if (hijacking == 'off') window.addEventListener('scroll', scrollAnimation);

          animating = false;
          checkNavigation();
        }
      });

      actual = actual + 1;
    } else {
      // setTimeout(() => {
      animating = false;
      // }, anim.duration);

      (sectionsAvailable as Element[]).forEach((element) => {
        Velocity(element, 'finish', true);
        Velocity(element.shadowRoot!.lastElementChild!, 'finish', true);
      });
      visibleSection.removeAttribute('visible');
      gotoSection.setAttribute('visible', '');
      unbindScroll(gotoSection, 100);
      if (hijacking == 'off') window.addEventListener('scroll', scrollAnimation);
    }
    // visibleSection.removeAttribute('visible');
    // gotoSection.setAttribute('visible', '');

    resetScroll();
  }

  /**
   * If clicking on navigation - unbind scroll and animate using custom velocity animation
   *
   * @param section
   * @param time
   */
  function unbindScroll(section, time) {
    if (hijacking == 'off') {
      window.removeEventListener('scroll', scrollAnimation);

      Velocity(section, 'scroll', { duration: time });

      // (animationType == 'catch')
      //   ? $('body, html').scrollTop(section.offset().top)
      //   : Velocity(section, 'scroll', { duration: time });
      // // : Velocity(section, 'scroll', { duration: time, queue: false });
    }
  }

  function resetScroll() {
    delta = 0;
    checkNavigation();
  }

  /**
   * Update navigation arrows visibility
   */
  function checkNavigation() {
    sectionsAvailable[0].hasAttribute('visible') ? prevArrow.classList.add('inactive') : prevArrow.classList.remove('inactive');
    sectionsAvailable[sectionsAvailable.length - 1].hasAttribute('visible')
      ? nextArrow.classList.add('inactive')
      : nextArrow.classList.remove('inactive');

    // (sectionsAvailable.filter('.visible').is(':first-of-type'))
    //   ? prevArrow.addClass('inactive')
    //   : prevArrow.removeClass('inactive');
    // (sectionsAvailable.filter('.visible').is(':last-of-type'))
    //   ? nextArrow.addClass('inactive')
    //   : nextArrow.removeClass('inactive');
  }

  /**
   * On mobile - remove style applied
   */
  function resetSectionStyle() {
    (sectionsAvailable as Element[]).forEach((element) => {
      (element.shadowRoot!.lastElementChild! as Element).setAttribute('style', '');
    });
    // with jQuery
    // ('div').each(() => {
    //   $(.attr('style', '');
    // });
  }

  /**
   * Detect if desktop/mobile
   */
  function deviceType() {
    return 'desktop';
    // window.getComputedStyle(<HTMLBodyElement>document.querySelector('body'), '::before').
    //   getPropertyValue('content').replace(/"/g, "").replace(/'/g, "");
  }

  /**
   * Select section animation - scrollhijacking
   *
   * @param animationName
   * @param middleScroll
   * @param direction
   */
  function selectAnimation(animationName, middleScroll, direction?) {
    var animationVisible = 'translateNone',
      animationTop = 'translateUp',
      animationBottom = 'translateDown',
      easing = 'ease',
      animDuration = 800;

    switch (animationName) {
      case 'scaleDown':
        animationTop = 'scaleDown';
        easing = 'easeInCubic';
        break;
      case 'rotate':
        if (hijacking == 'off') {
          animationTop = 'rotation.scroll';
          animationBottom = 'translateNone';
        } else {
          animationTop = 'rotation';
          easing = 'easeInCubic';
        }
        break;
      case 'gallery':
        animDuration = 1500;
        if (middleScroll) {
          animationTop = 'scaleDown.moveUp.scroll';
          animationVisible = 'scaleUp.moveUp.scroll';
          animationBottom = 'scaleDown.moveDown.scroll';
        } else {
          animationVisible = direction == 'next' ? 'scaleUp.moveUp' : 'scaleUp.moveDown';
          animationTop = 'scaleDown.moveUp';
          animationBottom = 'scaleDown.moveDown';
        }
        break;
      case 'catch':
        animationVisible = 'translateUp.delay';
        break;
      case 'opacity':
        animDuration = 700;
        animationTop = 'hide.scaleUp';
        animationBottom = 'hide.scaleDown';
        break;
      case 'fixed':
        animationTop = 'translateNone';
        easing = 'easeInCubic';
        break;
      case 'parallax':
        animationTop = 'translateUp.half';
        easing = 'easeInCubic';
        break;
    }

    return [animationVisible, animationTop, animationBottom, animDuration, easing];
  }

  /**
   * Select section animation - normal scroll
   *
   * @param sectionOffset
   * @param windowHeight
   * @param animationName
   */
  function setSectionAnimation(sectionOffset, windowHeight, animationName) {
    // select section animation - normal scroll
    var scale = 1,
      translateY = 100,
      rotateX = '0deg',
      opacity = 1,
      boxShadowBlur = 0;

    if (sectionOffset >= -windowHeight && sectionOffset <= 0) {
      // console.log('section entering the viewport')

      // section entering the viewport
      translateY = -sectionOffset; //* 100 / windowHeight;

      switch (animationName) {
        case 'scaleDown':
          scale = 1;
          opacity = 1;

          break;
        case 'rotate':
          translateY = 0;
          break;
        case 'gallery':
          if (sectionOffset >= -windowHeight && sectionOffset < -0.9 * windowHeight) {
            scale = -sectionOffset / windowHeight;
            translateY = -sectionOffset; //* 100 / windowHeight;
            boxShadowBlur = 400 * (1 + sectionOffset / windowHeight);
          } else if (sectionOffset >= -0.9 * windowHeight && sectionOffset < -0.1 * windowHeight) {
            scale = 0.9;
            translateY = -(9 / 8) * (sectionOffset + 0.1 * windowHeight); //* 100 / windowHeight;
            boxShadowBlur = 40;
          } else {
            scale = 1 + sectionOffset / windowHeight;
            translateY = 0;
            boxShadowBlur = (-400 * sectionOffset) / windowHeight;
          }
          break;
        case 'catch':
          if (sectionOffset >= -windowHeight && sectionOffset < -0.75 * windowHeight) {
            translateY = windowHeight; //100;
            boxShadowBlur = (1 + sectionOffset / windowHeight) * 160;
          } else {
            translateY = -(10 / 7.5) * sectionOffset; //* 100 / windowHeight;
            boxShadowBlur = (-160 * sectionOffset) / (3 * windowHeight);
          }
          break;
        case 'opacity':
          translateY = 0;
          scale = ((sectionOffset + 5 * windowHeight) * 0.2) / windowHeight;
          opacity = (sectionOffset + windowHeight) / windowHeight;
          break;
      }
    } else if (sectionOffset > 0 && sectionOffset <= windowHeight) {
      // console.log('section leaving the viewport - still has the .visible class')

      //section leaving the viewport - still has the '.visible' class
      translateY = -sectionOffset; //* 100 / windowHeight;

      switch (animationName) {
        case 'scaleDown':
          scale = 1 - (sectionOffset * 0.3) / windowHeight;
          opacity = 1 - sectionOffset / windowHeight;
          translateY = 0;
          boxShadowBlur = 40 * (sectionOffset / windowHeight);

          break;
        case 'rotate':
          opacity = 1 - sectionOffset / windowHeight;
          rotateX = (sectionOffset * 90) / windowHeight + 'deg';
          translateY = 0;
          break;
        case 'gallery':
          if (sectionOffset >= 0 && sectionOffset < 0.1 * windowHeight) {
            scale = (windowHeight - sectionOffset) / windowHeight;
            translateY = -sectionOffset; //-(sectionOffset / windowHeight) * 100;
            boxShadowBlur = (400 * sectionOffset) / windowHeight;
          } else if (sectionOffset >= 0.1 * windowHeight && sectionOffset < 0.9 * windowHeight) {
            scale = 0.9;
            translateY = -(9 / 8) * (sectionOffset - (0.1 * windowHeight) / 9); //* 100 / windowHeight;
            boxShadowBlur = 40;
          } else {
            scale = sectionOffset / windowHeight;
            translateY = -windowHeight; //-100;
            boxShadowBlur = 400 * (1 - sectionOffset / windowHeight);
          }
          break;
        case 'catch':
          if (sectionOffset >= 0 && sectionOffset < windowHeight / 2) {
            boxShadowBlur = (sectionOffset * 80) / windowHeight;
          } else {
            boxShadowBlur = 80 * (1 - sectionOffset / windowHeight);
          }
          break;
        case 'opacity':
          translateY = 0;
          scale = ((sectionOffset + 5 * windowHeight) * 0.2) / windowHeight;
          opacity = (windowHeight - sectionOffset) / windowHeight;
          break;
        case 'fixed':
          translateY = 0;
          break;
        case 'parallax':
          translateY = -sectionOffset * 0.5; //50 / windowHeight;
          break;
      }
    } else if (sectionOffset < -windowHeight) {
      // console.log('section not yet visible')
      //section not yet visible
      translateY = windowHeight; //100;

      switch (animationName) {
        case 'scaleDown':
          scale = 1;
          opacity = 1;
          break;
        case 'gallery':
          scale = 1;
          break;
        case 'opacity':
          translateY = 0;
          scale = 0.8;
          opacity = 0;
          break;
      }
    } else {
      // console.log('section not visible anymore')
      //section not visible anymore
      translateY = -windowHeight; //-100;

      switch (animationName) {
        case 'scaleDown':
          scale = 0;
          opacity = 0.7;
          translateY = 0;
          break;
        case 'rotate':
          translateY = 0;
          rotateX = '90deg';
          break;
        case 'gallery':
          scale = 1;
          break;
        case 'opacity':
          translateY = 0;
          scale = 1.2;
          opacity = 0;
          break;
        case 'fixed':
          translateY = 0;
          break;
        case 'parallax':
          translateY = -windowHeight / 2; //-50;
          break;
      }
    }

    return [translateY, scale, rotateX, opacity, boxShadowBlur];
  }

  /**
   *  Register effects for Velocity.js library
   */
  const registerEffectVelocity = () => {
    const sectionHeight = this.querySelector('um-slide')!.getBoundingClientRect().height;

    Velocity.RegisterEffect('translateUp', {
      defaultDuration: 1,
      calls: [[{ translateY: -sectionHeight }, 1]],
    });
    Velocity.RegisterEffect('translateDown', {
      defaultDuration: 1,
      calls: [[{ translateY: sectionHeight }, 1]],
    });
    Velocity.RegisterEffect('translateNone', {
      defaultDuration: 1,
      calls: [[{ translateY: 0, opacity: 1, scale: 1, rotateX: 0, boxShadowBlur: 0 }, 1]],
    });

    //scale down
    Velocity.RegisterEffect('scaleDown', {
      defaultDuration: 1,
      calls: [[{ opacity: 0, scale: 0.7, boxShadowBlur: '40px' }, 1]],
    });
    //rotation
    // Velocity
    //   .RegisterEffect("rotation", {
    //     defaultDuration: 1,
    //     calls: [
    //       [{ opacity: '0', rotateX: '90', translateY: '-100%' }, 1]
    //     ]
    //   });
    // Velocity
    //   .RegisterEffect("rotation.scroll", {
    //     defaultDuration: 1,
    //     calls: [
    //       [{ opacity: '0', rotateX: '90', translateY: 0 }, 1]
    //     ]
    //   });
    //gallery
    Velocity.RegisterEffect('scaleDown.moveUp', {
      defaultDuration: 1,
      calls: [
        [{ translateY: -sectionHeight * 0.1, scale: 0.9, boxShadowBlur: 40 }, 0.2],
        [{ translateY: -sectionHeight }, 0.6],
        [{ translateY: -sectionHeight, scale: 1, boxShadowBlur: 0 }, 0.2],
      ],
      reset: { scale: 1 },
    });
    Velocity.RegisterEffect('scaleDown.moveUp.scroll', {
      defaultDuration: 1,
      calls: [
        [{ translateY: -sectionHeight, scale: 0.9, boxShadowBlur: 40 }, 0.6],
        [{ translateY: -sectionHeight, scale: 1, boxShadowBlur: 0 }, 0.4],
      ],
      reset: { scale: 1 },
    });
    Velocity.RegisterEffect('scaleUp.moveUp', {
      defaultDuration: 1,
      calls: [
        [{ translateY: sectionHeight * 0.9, scale: 0.9, boxShadowBlur: 40 }, 0.2],
        [{ translateY: 0 }, 0.6],
        [{ translateY: 0, scale: 1, boxShadowBlur: 0 }, 0.2],
      ],
      reset: { scale: 1 },
    });
    Velocity.RegisterEffect('scaleUp.moveUp.scroll', {
      defaultDuration: 1,
      calls: [
        [{ translateY: 0, scale: 0.9, boxShadowBlur: 40 }, 0.6],
        [{ translateY: 0, scale: 1, boxShadowBlur: 0 }, 0.4],
      ],
      reset: { scale: 1 },
    });
    Velocity.RegisterEffect('scaleDown.moveDown', {
      defaultDuration: 1,
      calls: [
        [{ translateY: sectionHeight * 0.1, scale: 0.9, boxShadowBlur: 40 }, 0.2],
        [{ translateY: sectionHeight }, 0.6],
        [{ translateY: sectionHeight, scale: 1, boxShadowBlur: 0 }, 0.2],
      ],
      reset: { scale: 1 },
    });
    Velocity.RegisterEffect('scaleDown.moveDown.scroll', {
      defaultDuration: 1,
      calls: [
        [{ translateY: sectionHeight, scale: 0.9, boxShadowBlur: 40 }, 0.6],
        [{ translateY: sectionHeight, scale: 1, boxShadowBlur: 0 }, 0.4],
      ],
      reset: { scale: 1 },
    });
    Velocity.RegisterEffect('scaleUp.moveDown', {
      defaultDuration: 1,
      calls: [
        [{ translateY: -sectionHeight * 0.9, scale: 0.9, boxShadowBlur: 40 }, 0.2],
        [{ translateY: 0 }, 0.6],
        [{ translateY: 0, scale: 1, boxShadowBlur: 0 }, 0.2],
      ],
      reset: { scale: 1 },
    });
    // //catch up
    // Velocity
    //   .RegisterEffect("translateUp.delay", {
    //     defaultDuration: 1,
    //     calls: [
    //       [{ translateY: '0%' }, 0.8, { delay: 100 }],
    //     ]
    //   });
    // //opacity
    // Velocity
    //   .RegisterEffect("hide.scaleUp", {
    //     defaultDuration: 1,
    //     calls: [
    //       [{ opacity: '0', scale: '1.2' }, 1]
    //     ]
    //   });
    // Velocity
    //   .RegisterEffect("hide.scaleDown", {
    //     defaultDuration: 1,
    //     calls: [
    //       [{ opacity: '0', scale: '0.8' }, 1]
    //     ]
    //   });
    // //parallax
    // Velocity
    //   .RegisterEffect("translateUp.half", {
    //     defaultDuration: 1,
    //     calls: [
    //       [{ translateY: '-50%' }, 1]
    //     ]
    //   });
  };

  while (true) {
    yield render.call(
      this,
      <>
        <article rel="refBlockWithSlides">
          <slot></slot>
        </article>

        <nav>
          <ul class="cd-vertical-nav">
            <li>
              <a href="#0" class="cd-prev inactive">
                Next
              </a>
            </li>
            <li>
              <a href="#0" class="cd-next">
                Prev
              </a>
            </li>
          </ul>
        </nav>
      </>,
      $
    );
  }
});
