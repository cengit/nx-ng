// tslint:disable:no-console class-name
import { Injectable, Inject } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
  HttpEvent,
} from '@angular/common/http';

import { isNil } from 'lodash';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { tap, catchError } from 'rxjs/operators';

import { jQueryLikeParamSerializer } from './http.utils';

export interface ICommonResponse<T> {
  result: number;
  msg: string;
  data?: T;
}

export type HttpObserve = 'body' | 'events' | 'response';

export const throwObservableError = (error: any) =>
  ErrorObservable.create(error.json ? error.json() : error);

export const getData = ({ data }) => data;

/**
 * 封装 HttpClient，主要解决：
 * - 优化 HttpClient 在参数上的便利性
 * - 统一实现 loading
 */
@Injectable({
  providedIn: 'root',
})
export class _HttpClient {
  constructor(private http: HttpClient) {}

  private _loading = false;

  private begin() {
    // console.time('http');
    this._loading = true;
  }

  private end() {
    // console.timeEnd('http');
    this._loading = false;
  }

  /** 是否正在加载中 */
  get loading(): boolean {
    return this._loading;
  }

  parseParams(params: any): HttpParams {
    let ret = new HttpParams();
    if (params) {
      Object.keys(params)
        .filter(key => !isNil(params[key]))
        .forEach(key => {
          const val = params[key];
          if (Array.isArray(val)) {
            val.forEach(item => {
              ret = ret.append(key, item);
            });
          } else {
            ret = ret.set(key, val);
          }
        });
    }
    return ret;
  }

  appliedUrl(url: string, params?: any) {
    if (!params) return url;
    let realUrl = url;
    realUrl += ~realUrl.indexOf('?') ? '&' : '?';
    Object.keys(params).forEach(key => {
      realUrl += `${key}=${params[key]}`;
    });
    return realUrl;
  }

  /**
   * GET：返回一个 `string` 类型
   */
  get(
    url: string,
    params: any,
    options: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: 'body';
      reportProgress?: boolean;
      responseType: 'text';
      withCredentials?: boolean;
    },
  ): Observable<string>;

  /**
   * GET：返回一个 `JSON` 类型
   */
  get(
    url: string,
    params: any,
    options: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe: 'response';
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    },
  ): Observable<HttpResponse<Object>>;

  /**
   * GET：返回一个 `any` 类型
   */
  get(
    url: string,
    params?: any,
    options?: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: HttpObserve;
      reportProgress?: boolean;
      responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
      withCredentials?: boolean;
    },
  ): Observable<any>;

  /**
   * GET 请求
   */
  get(
    url: string,
    params: any,
    options: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: HttpObserve;
      reportProgress?: boolean;
      responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
      withCredentials?: boolean;
    },
  ): Observable<any> {
    return this.request(
      'GET',
      url,
      Object.assign(
        {
          params,
        },
        options,
      ),
    );
  }

  /**
   * POST 请求
   */
  post(
    url: string,
    config: {
      body?: any; // application/json
      formdata?: any; // application/x-www-form-urlencoded
      params?: any; // url params
      options?: {
        headers?: HttpHeaders | { [header: string]: string | string[] };
        observe?: HttpObserve;
        reportProgress?: boolean;
        responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
        withCredentials?: boolean;
      };
    },
  ): Observable<any> {
    let { body: postBody, options: postOptions = {} } = config;
    const optionHeaders: any = postOptions.headers || {};
    if (config.formdata) {
      const dType = Object.prototype.toString.call(config.formdata);
      if (dType === '[object FormData]') {
        this.begin();
        const formDataOptions: any = { headers: optionHeaders };
        if (config.params) {
          formDataOptions.params = config.params;
        }
        return this.http.post(url, config.formdata, formDataOptions).pipe(
          tap(res => this.end()),
          catchError(res => {
            this.end();
            return ErrorObservable.create(res);
          }),
        );
      }
      postBody = jQueryLikeParamSerializer(config.formdata);
      postOptions = {
        ...config.options,
        headers: new HttpHeaders(optionHeaders).set(
          'Content-Type',
          'application/x-www-form-urlencoded;charset=utf-8',
        ),
      };
    } else if (config.body) {
      postBody = JSON.stringify(config.body);
      postOptions = {
        ...config.options,
        headers: new HttpHeaders(optionHeaders).set(
          'Content-Type',
          'application/json;charset=utf-8',
        ),
      };
    }
    return this.request(
      'POST',
      url,
      Object.assign(
        {
          body: postBody,
          params: config.params,
        },
        postOptions,
      ),
    );
  }

  /**
   * DELETE：返回一个 `string` 类型
   */
  delete(
    url: string,
    params: any,
    options: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: 'body';
      reportProgress?: boolean;
      responseType: 'text';
      withCredentials?: boolean;
    },
  ): Observable<string>;

  /**
   * POST：返回一个 `JSON` 类型
   */
  delete(
    url: string,
    params: any,
    options: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe: 'response';
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    },
  ): Observable<HttpResponse<Object>>;

  /**
   * POST：返回一个 `any` 类型
   */
  delete(
    url: string,
    params?: any,
    options?: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: HttpObserve;
      reportProgress?: boolean;
      responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
      withCredentials?: boolean;
    },
  ): Observable<any>;

  /**
   * POST 请求
   */
  delete(
    url: string,
    params: any,
    options: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      observe?: HttpObserve;
      reportProgress?: boolean;
      responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
      withCredentials?: boolean;
    },
  ): Observable<any> {
    return this.request(
      'DELETE',
      url,
      Object.assign(
        {
          params,
        },
        options,
      ),
    );
  }

  /**
   * `jsonp` 请求
   *
   * @param string url URL地址
   * @param * [params] 请求参数
   * @param string [callbackParam] CALLBACK值，默认：JSONP_CALLBACK
   */
  jsonp(
    url: string,
    params?: any,
    callbackParam: string = 'JSONP_CALLBACK',
  ): Observable<any> {
    return this.http.jsonp(this.appliedUrl(url, params), callbackParam).pipe(
      tap(() => this.end()),
      catchError(res => {
        this.end();
        return res;
      }),
    );
  }

  /**
   * `patch` 请求
   *
   * @param string url URL地址
   * @param * [body] 请求参数
   */
  patch(url: string, body?: any, params?: any): Observable<any> {
    return this.request(
      'PATCH',
      url,
      Object.assign({
        params,
        body: body || null,
      }),
    );
  }

  /**
   * `put` 请求
   *
   * @param string url URL地址
   * @param * [body] 请求参数
   */
  put(url: string, body?: any, params?: any): Observable<any> {
    return this.request(
      'PUT',
      url,
      Object.assign({
        params,
        body: body || null,
      }),
    );
  }

  /**
   * `request` 请求
   *
   * @param string method 请求方法类型
   * @param string url URL地址
   * @param * [options] 参数
   */
  request(
    method: string,
    url: string,
    options?: {
      body?: any;
      headers?:
        | HttpHeaders
        | {
            [header: string]: string | string[];
          };
      observe?: HttpObserve;
      params?:
        | HttpParams
        | {
            [param: string]: string | string[];
          };
      responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
      reportProgress?: boolean;
      withCredentials?: boolean;
    },
  ): Observable<any> {
    this.begin();
    if (options) {
      if (options.params) options.params = this.parseParams(options.params);
    }
    return this.http.request(method, url, options).pipe(
      tap(res => this.end()),
      catchError(res => {
        this.end();
        return ErrorObservable.create(res);
      }),
    );
  }
}
