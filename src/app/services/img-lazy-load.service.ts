import { Injectable, Inject, ComponentFactoryResolver, ViewContainerRef, TemplateRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { merge, fromEvent } from 'rxjs';
import { auditTime } from 'rxjs/operators';

import { WINDOW } from './window.service';
import { SpinnerComponent } from '../spinner/spinner.component';

@Injectable({
  providedIn: 'root'
})
export class ImgLazyLoadService {
  private spinnerCompFactory = this.factoryResolver.resolveComponentFactory(SpinnerComponent);

  get windowBottom() {
    return this.window.pageYOffset + this.document.documentElement.clientHeight;
  }

  scrollResize$ = merge(
      fromEvent(this.window, 'scroll'),
      fromEvent(this.window, 'resize')
    )
    .pipe(auditTime(100));

  constructor(
    @Inject(WINDOW) private window: Window,
    @Inject(DOCUMENT) private document: Document,
    private factoryResolver: ComponentFactoryResolver,
  ) { }

  getElTop(el: HTMLElement) {
    return el.getBoundingClientRect().top + this.window.pageYOffset;
  }

  isIntersecting(el: HTMLElement, pxOffset: number) {
    const elTop = this.getElTop(el);
    const windowBottom = this.windowBottom;

    return (elTop - windowBottom) < pxOffset;
  }

  insertSpinner(viewContainer: ViewContainerRef) {
    return viewContainer.createComponent(this.spinnerCompFactory, 0);
  }

  removeSpinner(viewContainer: ViewContainerRef) {
    const spinnerIndex = 0;
    viewContainer.remove(spinnerIndex);
  }

  loadImage(viewContainer: ViewContainerRef, imageTemplate: TemplateRef<any>, fadeinSecs = 4) {
    const imgEl: HTMLImageElement = viewContainer.createEmbeddedView(imageTemplate).rootNodes[0];

    imgEl.style.display = 'none';

    imgEl.onload = () => {
      this.removeSpinner(viewContainer);
      imgEl.style.display = 'initial';

      if (fadeinSecs > 0) {
        imgEl.style.animation = `image-fadein ${fadeinSecs}s`;
      }
    };
  }
}
