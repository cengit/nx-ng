import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';

import { LayoutModule } from '@fx-system/layout';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    LayoutModule,
    RouterModule.forRoot(
      [
        {
          path: 'myapp',
          loadChildren: () =>
            import('@fx-system/myapp/views/myapp').then(
              module => module.MyappViewsMyappModule
            )
        }
      ],
      { initialNavigation: 'enabled' }
    )
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
