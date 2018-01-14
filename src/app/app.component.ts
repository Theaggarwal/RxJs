import { Component, OnInit } from '@angular/core';

import * as Rx from 'rxjs/rx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor() {
  }

  ngOnInit() {
    // this.javascriptCode();
    this.clickCounter();
  }

  javascriptCode() {
    let count = 0;
    const button = document.querySelector('button');
    button.addEventListener('click', () => console.log(`Clicked ${++count} times`));
  }

  clickCounter() {
    const button = document.querySelector('button');
    Rx.Observable.fromEvent(button, 'click')
      .scan((count: number) => count + 1, 0)
      .subscribe(count => console.log(`Clicked ${count} times`));

    // add the mouse x position for every click after 1000ms
    Rx.Observable.fromEvent(button, 'click')
      .throttleTime(1000)
      .map((event: any) => event.clientX)
      .scan((count, clientX) => count + clientX, 0)
      .subscribe(count => console.log('position: ' + count + ' '));

  }
}
