import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainLayoutComponent } from './main-layout/main-layout.component';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import {
  DefaultInterceptor,
  DEFAULT_HTTP_TOPTIONS,
  DEFAULT_HTTP_TOPTIONS_TOKEN,
} from '@fx-system/backend';

// nz-zorro
import { NgZorroAntdModule, NZ_I18N, NZ_ICONS, zh_CN } from 'ng-zorro-antd';
/** 配置 angular i18n **/
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';
import { SeegoLinkAdminComponent } from './seego-link-admin/seego-link-admin.component';

registerLocaleData(zh);
const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(
  key => antDesignIcons[key],
);

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    NgZorroAntdModule,
    BrowserAnimationsModule
  ],
  exports: [MainLayoutComponent],
  declarations: [MainLayoutComponent,SeegoLinkAdminComponent],
  providers: [
    { provide: NZ_ICONS, useValue: icons },
    { provide: NZ_I18N, useValue: zh_CN },
    { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true },
    { provide: DEFAULT_HTTP_TOPTIONS_TOKEN, useValue: DEFAULT_HTTP_TOPTIONS }
  ]
})
export class LayoutModule {}
