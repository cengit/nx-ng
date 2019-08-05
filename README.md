# nx-system
基于 nx + angular 8.0 + nz-zorro 8.x 的项目架子。
初始化建立了一个app：myapp + 一个lib

>* 封装了 http 请求与 interceptor 拦截器
>* 设置了 proxy 代理
>* 设置了 gitlab-ci.yml 持续集成
>* 设置了打包后的依赖上传至7牛CDN
>* 设置了HMR热加载

## 启动项目

```sh
$ yarn install
$ yarn ng serve myapp
```
## 模块说明

| App        | Lib   |  说明  |
| --------   | -----:  | :----:  |
| myapp | myapp |  demo app与lib|
|  --   | layout |  布局相关内容     |
| --    |backend|  http请求与拦截器相关   |
| --    |shared|  整个项目共享组件、指令、管道   |

## 开发指南

假设我们要开发一个名为 `demo` 的应用。

### 创建 app 和 lib
创建App：`yarn ng g @nrwl/angular:application demo --routing --style=less`。添加参数 `--dry-run` （或 `-d` 简写）来查看当前操作将会创建的文件
创建Lib：`yarn ng g lib demo --routing --lazy --parent-module=apps/demo/src/app/app.module.ts --directory=demo/views`。

修改 `angular.json`：

```diff
{
  "projects": {
    "myapp": {
      "architect": {
        "build": {
          "options": {
+             "styles": ["styles/styles.less"], // 引用公共样式
          },
          "configurations": {
            "production": {
+              "baseHref": "/",
+              "deployUrl": "//static.xxxxx.com/fx_system/apps/myapp/"
            }
          }
        },
        "serve": {
          "options": {
+            "port": 5001, // 这里每个 app 的端口不一样
+            "proxyConfig": "proxy.conf.js",
          }
        }
      }
    }
  }
}
```

**deployUrl** 是静态文件的存放地址，CI 构建时的 `build` stage 将会打包至 CDN 服务器，部署只需 html 文件即可。

2.  移除 **demo** 应用的 `app.component.html` 中默认的内容，替换成

```html
<fx-system-main-layout curAppName="demo"></fx-system-main-layout>
```

并修改 **demo** app module，引入 `LayoutModule`：

```diff
+ import { LayoutModule } from '@fx-system/layout';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
+   LayoutModule,
    RouterModule.forRoot([], { initialNavigation: 'enabled' }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```
**注意：**在 app module 不再需要引入nz-zorro相关模块、Interceptor（拦截器）等模块，这些模块已经在 LayoutModule 引入，每个app只要导入LayoutModule就足够了。

### 创建 services
1.  使用 `lib` schematic 新建一个名为 **services** 的 lib，`yarn ng g lib services --directory=demo`。

2.  导入 `DemoServicesModule` 到 **demo** lib module，导入路径使用 `@fx-system/demo/services`。

```diff
+ import { DemoServicesModule } from '@seego-admin/@fx-system/demo/services';

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    RouterModule.forChild(([]),
+   DemoServicesModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

### 公共模块
1. shared: 公共组件、指令、管道，请放这里

2. libs/backend: http请求与拦截器相关
```ts
import {
  _HttpClient,
  ICommonResponse,
  getData,
  throwObservableError,
} from '@fx-system/backend';
```
某些请求不需要拦截可以在这里设置：libs\backend\src\lib\http.options.ts
```ts
export const DEFAULT_HTTP_TOPTIONS: HTTPOptions = {
  go_login_ignores: [/http\:\/\/localhost\:3020\/api\/test/],
  notification_ignores: [/http\:\/\/localhost\:3020\/api\/test/],
  interceptor_ignores: [
    /http\:\/\/localhost\:3020\/api\/test/,
    /dapi\//
  ],
};
```
### 配置模块热替换（HMR）

每个app可以设置HMR，具体配置方法请查看 [Configure Hot Module Replacement](https://github.com/angular/angular-cli/wiki/stories-configure-hmr).
myapp已经设置好HMR，可以参考。

### 关于nx

说白了就是：用monorepo的形式，组建大型前端项目，方便多人协助开发的前端脚手架，支持的前端（库）框架有：Angular、React、Web Component

Nx is a set of extensible dev tools for monorepos, which helps you develop like Google, Facebook, and Microsoft.

It has first-class support for many frontend and backend technologies, so its documentation comes in multiple flavours.

官网：https://nx.dev/