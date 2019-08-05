import { InjectionToken } from '@angular/core';

export const DEFAULT_HTTP_TOPTIONS_TOKEN = new InjectionToken<HTTPOptions>(
  'DEFAULT_HTTP_TOPTIONS_TOKEN',
);

export interface HTTPOptions {
  /**
   * 忽略认证失败跳转登录页的 URL 地址列表
   */
  go_login_ignores: RegExp[];
  /**
   * 忽略请求报错全局展示提示信息的 URL 地址列表
   */
  notification_ignores: RegExp[];
  /**
   * 忽略拦截器内所有规则的 URL 地址列表
   */
  interceptor_ignores: RegExp[];
}

export const DEFAULT_HTTP_TOPTIONS: HTTPOptions = {
  go_login_ignores: [/http\:\/\/localhost\:3020\/api\/test/],
  notification_ignores: [/http\:\/\/localhost\:3020\/api\/test/],
  interceptor_ignores: [
    /http\:\/\/localhost\:3020\/api\/test/,
    /dapi\//
  ],
};
