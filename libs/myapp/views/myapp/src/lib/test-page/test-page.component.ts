import { Component, OnInit } from '@angular/core';
import { _HttpClient, ICommonResponse } from '@fx-system/backend';

@Component({
  selector: 'fx-system-test-page',
  templateUrl: './test-page.component.html',
  styleUrls: ['./test-page.component.css']
})
export class TestPageComponent implements OnInit {

  constructor(private http:_HttpClient) { }

  ngOnInit() {
  }

  getData(){
    this.http.get('/api/xxxx').subscribe( data => {
      console.log("data=",data);
    })
  }

}
