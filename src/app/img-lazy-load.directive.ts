import { Directive, OnInit, Input, TemplateRef, ViewContainerRef, ComponentRef, OnDestroy } from '@angular/core';

import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { environment } from './../environments/environment';

import { SpinnerComponent } from './spinner/spinner.component';
import { ImgLazyLoadService } from './services/img-lazy-load.service';

@Directive({
  selector: '[appImgLazyLoad]'
})
export class ImgLazyLoadDirective implements OnInit, OnDestroy {
  // tslint:disable-next-line: no-input-rename
  @Input('appImgLazyLoad') offsetBeforeLoad = environment.imgLazyLoading.offsetBeforeLoad;

  spinnerComp: ComponentRef<SpinnerComponent>;

  get isIntersecting() {
    return this.imgService.isIntersecting(this.spinnerComp.location.nativeElement, this.offsetBeforeLoad);
  }

  destroy: ReplaySubject<any> = new ReplaySubject<any>(1);

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private imgService: ImgLazyLoadService
  ) { }

  ngOnInit() {
    this.spinnerComp = this.imgService.insertSpinner(this.viewContainer);
    this.canLazyLoad() ? this.lazyLoadImage() : this.loadImage();
  }

  ngOnDestroy() {
    this.destroy.next(null);
    this.destroy.complete();
  }

  private canLazyLoad() {
    return !this.isIntersecting;
  }

  private lazyLoadImage() {
    const subscription = this.imgService.scrollResize$
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        if (this.isIntersecting) {
          subscription.unsubscribe();
          this.loadImage();
        }
      });
  }

  private loadImage() {
    this.imgService.loadImage(this.viewContainer, this.templateRef);
  }
}
