import { Component, OnInit, Input } from '@angular/core';
// @ts-ignore
import menuConfig from './menu.json'; // 菜单配置

@Component({
  selector: 'fx-system-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {

  constructor() { }
  @Input() curAppName: string;
  menuData: any [] = menuConfig;
  ngOnInit() {
  }

}
