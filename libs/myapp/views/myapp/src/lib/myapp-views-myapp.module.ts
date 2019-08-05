import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgZorroAntdModule} from 'ng-zorro-antd';
import { TestPageComponent } from './test-page/test-page.component';

@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
    RouterModule.forChild([
      {path: 'test', pathMatch: 'full', component: TestPageComponent},
      { path: '', pathMatch: 'full', redirectTo: 'test' }
    ])
  ],
  declarations: [TestPageComponent]
})
export class MyappViewsMyappModule {}
