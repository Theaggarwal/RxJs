import { Component, OnInit } from '@angular/core';
import * as Rx from 'rxjs/rx';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css']
})
export class SubjectComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  subject() {
    console.log(' ***** Subject ***** ');
    const subject = new Rx.Subject();

    subject.subscribe({
      next: (v) => console.log('observerA: ' + v)
    });

    subject.next(1);
    subject.next(2);

    subject.subscribe({
      next: (v) => console.log('observerB: ' + v)
    });

    subject.next(3);
    console.log(' ***** Subject ***** ');
  }


  behaviorSubject() {
    console.log(' ***** Behaviour Subject ***** ');
    const subject = new Rx.BehaviorSubject(0); // 0 is the initial value

    subject.subscribe({
      next: (v) => console.log('observerA: ' + v)
    });

    subject.next(1);
    subject.next(2);

    subject.subscribe({
      next: (v) => console.log('observerB: ' + v)
    });

    subject.next(3);
    console.log(' ***** Behaviour Subject ***** ');
  }

  replaySubject() {
    console.log(' ***** replay Subject ***** ');
    // buffer 3 values for new subscribers& no time parameter is specified.
    const subject = new Rx.ReplaySubject(3);

    subject.subscribe({
      next: (v) => console.log('observerA: ' + v)
    });

    subject.next(1);
    subject.next(2);
    subject.next(3);
    subject.next(4);
    subject.subscribe({
      next: (v) => console.log('observerB: ' + v)
    });

    subject.next(5);
    console.log(' ***** replay Subject ***** ');
  }

  asyncSubject() {
    console.log(' ***** Async Subject ***** ');
    const subject = new Rx.AsyncSubject();

    subject.subscribe({
      next: (v) => console.log('observerA: ' + v)
    });

    subject.next(1);
    subject.next(2);
    subject.next(3);
    subject.next(4);

    subject.subscribe({
      next: (v) => console.log('observerB: ' + v)
    });

    subject.next(5);
    subject.complete();
    console.log(' ***** Async Subject ***** ');
  }

  subjectAsObservable() {
    console.log(' ***** Subject As Observable ***** ');
    const subject = new Rx.Subject();
    subject.subscribe({
      next: (v) => console.log('observerA: ' + v)
    });
    subject.subscribe({
      next: (v) => console.log('observerB: ' + v)
    });

    const observable = Rx.Observable.from([1, 2, 3]);
    observable.subscribe(subject); // You can subscribe providing a Subject

    console.log(' ***** Subject As Observable ***** ');
  }

  subjectAsObservable1() {
  }

  multicastObservable() {
    console.log(' ***** Multicast Observable ***** ');
    const source = Rx.Observable.interval(500);
    const subject = new Rx.Subject();
    const multicasted = source.multicast(subject);

    let subscription1, subscription2, subscriptionConnect;
    subscription1 = multicasted.subscribe({
      next: (v) => console.log('observerA: ' + v)
    });
    // We should call `connect()` here, because the first
    // subscriber to `multicasted` is interested in consuming values
    subscriptionConnect = multicasted.connect();

    setTimeout(() => {
      subscription2 = multicasted.subscribe({
        next: (v) => console.log('observerB: ' + v)
      });
    }, 600);
    setTimeout(() => {
      subscription1.unsubscribe();
    }, 1200);

    // We should unsubscribe the shared Observable execution here,
    // because `multicasted` would have no more subscribers after this
    setTimeout(() => {
      subscription2.unsubscribe();
      subscriptionConnect.unsubscribe(); // for the shared Observable execution
    }, 2000);

    console.log(' ***** Multicast Observable ***** ');
  }
}
