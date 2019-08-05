import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpSentEvent,
  HttpHeaderResponse,
  HttpProgressEvent,
  HttpResponse,
  HttpUserEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { NzNotificationService } from 'ng-zorro-antd';

import { DEFAULT_HTTP_TOPTIONS_TOKEN } from './http.options';

/**
 * 默认HTTP拦截器，其注册细节见 `app.module.ts`
 */
@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
  codeMessage = {
    200: '服务器成功返回请求的数据',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据,的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器',
    502: '网关错误',
    503: '服务不可用，服务器暂时过载或维护',
    504: '网关超时',
  };

  private httpOptions = this.injector.get(DEFAULT_HTTP_TOPTIONS_TOKEN);

  constructor(private router: Router, private injector: Injector) {}

  get msg(): NzNotificationService {
    return this.injector.get(NzNotificationService);
  }

  private goLogin(req: HttpRequest<any>) {
    if (!this.isIgnored(this.httpOptions.go_login_ignores, req)) {
      const seller_from = 0;
      window.location.href = `/auth.html#!/entry${
        seller_from ? `?seller_from=${seller_from}` : ''
      }`;
    }
  }

  private checkStatus(response, req: HttpRequest<any>) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    if (response.status === 401) {
      return this.goLogin(req);
    }

    // 优先使用error中的msg，没有的话再用默认文案
    const errortext = response.error && response.error.msg ? response.error.msg : this.codeMessage[response.status] || response.statusText;
    if (!this.isIgnored(this.httpOptions.notification_ignores, req)) {
      this.msg.error(`提示`, errortext);
    }
    const error = new Error(errortext);
    error['response'] = response;
    ErrorObservable.create(error);
  }

  isIgnored(ignores: RegExp[], req: HttpRequest<any>): boolean {
    let flag = false;
    if (ignores && ignores.length > 0) {
      for (const item of ignores) {
        if (item.test(req.url)) {
          flag = true;
        }
      }
    }
    return flag;
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<
    | HttpSentEvent
    | HttpHeaderResponse
    | HttpProgressEvent
    | HttpResponse<any>
    | HttpUserEvent<any>
    | any
  > {
    if (this.isIgnored(this.httpOptions.interceptor_ignores, req)) {
      return next.handle(req);
    }

    const url = req.url;
    const newReq = req.clone({ url });
    // req.headers.set("ULS_TOKEN","1234567890");

    return next.handle(newReq).pipe(
      mergeMap((event: any) => {
        // 统一对请求错误处理
        if (event instanceof HttpResponse && event.status === 200) {
          if (Object.hasOwnProperty.call(event.body, 'result')) {
            if (event.body.result !== 1) {
              return ErrorObservable.create(event);
            }
          } else {
            return ErrorObservable.create(event);
          }
        }
        // 若一切都正常，则后续操作
        return Observable.create(observer => observer.next(event));
      }),
      catchError((response: HttpResponse<any>) => {
        // 业务处理：一些通用操作
        switch (response.status) {
          case 401:
            this.goLogin(req);
            break;
          case 200:
            // 业务层级错误处理
            if (Object.hasOwnProperty.call(response.body, 'result')) {
              switch (response.body.result) {
                case 101:
                  this.goLogin(req);
                  break;
                case 404: // 没有创建小电铺
                  this.router.navigateByUrl('/shop/guide?show_type=1');
                  break;
                default:
                  const errortext = Object.hasOwnProperty.call(
                    response.body,
                    'msg',
                  )
                    ? response.body.msg
                    : JSON.stringify(response.body);
                  this.msg.error(
                    // `请求错误: ${response.url}`,
                    `提示`,
                    errortext,
                  );
              }
            }
            break;
          default:
            this.checkStatus(response, req);
        }
        // 以错误的形式结束本次请求
        return ErrorObservable.create(event);
      }),
    );
  }
}
