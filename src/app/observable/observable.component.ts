import { Component, OnInit } from '@angular/core';

import * as Rx from 'rxjs/rx';

@Component({
  selector: 'app-observable',
  templateUrl: './observable.component.html',
  styleUrls: ['./observable.component.css']
})
export class ObservableComponent implements OnInit {

  constructor() { }

  ngOnInit() {

  }

  example() {
    console.log(' ***** Observable ***** ');
    const observable = Rx.Observable.create(function (observer) {
      observer.next(1);
      observer.next(2);
      observer.next(3);
      setTimeout(() => {
        observer.next(4);
        observer.complete();
      }, 1000);
    });

    console.log('just before subscribe');
    observable.subscribe({
      next: x => console.log('got value ' + x),
      error: err => console.error('wrong occurred: ' + err),
      complete: () => console.log('done'),
    });
    console.log('just after subscribe');

    console.log('just before subscribe2');
    observable.subscribe({
      next: x => console.log('got value2 ' + x),
      error: err => console.error('wrong occurred2: ' + err),
      complete: () => console.log('done2'),
    });
    console.log('just after subscribe2');
    console.log(' ***** Observable ***** ');
  }

  usingObserverObject() {

    const observable = Rx.Observable.create(function (observer) {
      observer.next(1);
      observer.next(2);
      observer.next(3);
      setTimeout(() => {
        observer.next(4);
        observer.complete();
      }, 1000);
    });

    observable.subscribe(
      // observer Object.
      {
        next: x => console.log('Observer got a next value: ' + x),
        error: err => console.error('Observer got an error: ' + err),
        complete: () => console.log('Observer got a complete notification'),
      });
  }

}
