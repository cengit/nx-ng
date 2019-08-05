import { Component, Input, HostListener } from '@angular/core';
import { Router, UrlTree } from '@angular/router';

@Component({
  selector: '[seego-link-admin]',
  templateUrl: './seego-link-admin.component.html',
  styleUrls: ['./seego-link-admin.component.less']
})
export class SeegoLinkAdminComponent {
  @Input() curAppName: string;
  @Input() bindAppName: string;
  @Input() url: string;
  @Input() queryParams: any;
  @Input() fragment: any;

  constructor(private router: Router) {}

  @HostListener('click', ['$event.target'])
  onClick(a: HTMLElement) {
    if (!this.url) {
      return;
    }

    const urlTree: UrlTree = this.router.parseUrl(this.url);
    if (this.queryParams) {
      /**
       * 支持同时设置两种uery：url query + queryParams，如下配置最后url为：/myapp/test?a=123&name=haha
       * { "url": "/myapp/test?a=123", "queryParams": {"name":"haha"} }
       */
      urlTree.queryParams = { ...this.queryParams, ...urlTree.queryParams };
    }
    if (this.fragment) {
      urlTree.fragment = this.fragment;
    }
    if (this.curAppName === this.bindAppName) {
      this.router.navigateByUrl(urlTree);
    } else {
      location.href = this.router.serializeUrl(urlTree);
    }
  }
}
