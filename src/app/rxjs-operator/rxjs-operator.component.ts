import { Component, OnInit } from '@angular/core';

import * as Rx from 'rxjs/rx';

@Component({
  selector: 'app-rxjs-operator',
  templateUrl: './rxjs-operator.component.html',
  styleUrls: ['./rxjs-operator.component.css']
})
export class RxjsOperatorComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  combineLatest() {
    // Combine two timer Observables
    const firstTimer = Rx.Observable.timer(0, 1000); // emit 0, 1, 2... after every second, starting from now
    const secondTimer = Rx.Observable.timer(500, 1000); // emit 0, 1, 2... after every second, starting 0,5s from now
    const combinedTimers = Rx.Observable.combineLatest(firstTimer, secondTimer);
    combinedTimers.subscribe(value => console.log(value));
    // Logs
    // [0, 0] after 0.5s
    // [1, 0] after 1s
    // [1, 1] after 1.5s
    // [2, 1] after 2s

    // Combine an array of Observables
    const observables = [1, 5, 10].map(
      n => Rx.Observable.of(n).delay(n * 1000).startWith(0) // emit 0 and then emit n after n seconds
    );
    const combined = Rx.Observable.combineLatest(observables);
    combined.subscribe(value => console.log(value));
    // Logs
    // [0, 0, 0] immediately
    // [1, 0, 0] after 1s
    // [1, 5, 0] after 5s
    // [1, 5, 10] after 10s

    // Use project function to dynamically calculate the Body-Mass Index
    const weight = Rx.Observable.of(70, 72, 76, 79, 75);
    const height = Rx.Observable.of(1.76, 1.77, 1.78);
    const bmi = Rx.Observable.combineLatest(weight, height, (w, h) => w / (h * h));
    bmi.subscribe(x => console.log('BMI is ' + x));
    // With output to console:
    // BMI is 24.212293388429753
    // BMI is 23.93948099205209
    // BMI is 23.671253629592222
  }

  concat() {
    // Concatenate a timer counting from 0 to 3 with a synchronous sequence from 1 to 10
    const timer = Rx.Observable.interval(1000).take(4);
    const sequence = Rx.Observable.range(1, 10);
    const result = Rx.Observable.concat(timer, sequence);
    result.subscribe(x => console.log(x));
    // results in:
    // 0 -1000ms-> 1 -1000ms-> 2 -1000ms-> 3 -immediate-> 1 ... 10

    // Concatenate an array of 3 Observables
    const timer1 = Rx.Observable.interval(1000).take(10);
    const timer2 = Rx.Observable.interval(2000).take(6);
    const timer3 = Rx.Observable.interval(500).take(10);
    const result2 = Rx.Observable.concat([timer1, timer2, timer3]); // note that array is passed
    result2.subscribe(x => console.log(x));
    // results in the following: (Prints to console sequentially)
    // -1000ms-> 0 -1000ms-> 1 -1000ms-> ... 9
    // -2000ms-> 0 -2000ms-> 1 -2000ms-> ... 5
    // -500ms-> 0 -500ms-> 1 -500ms-> ... 9

    // Concatenate the same Observable to repeat it
    const timerr = Rx.Observable.interval(1000).take(2);

    Rx.Observable.concat(timerr, timerr) // concating the same Observable!
      .subscribe(
      value => console.log(value),
      err => { },
      () => console.log('...and it is done!')
      );

    // Logs:
    // 0 after 1s
    // 1 after 2s
    // 0 after 3s
    // 1 after 4s
    // "...and it is done!" also after 4s
  }

  defer() {
    // Subscribe to either an Observable of clicks or an Observable of interval, at random
    const clicksOrInterval = Rx.Observable.defer(function () {
      if (Math.random() > 0.5) {
        return Rx.Observable.fromEvent(document, 'click');
      } else {
        return Rx.Observable.interval(1000);
      }
    });
    clicksOrInterval.subscribe(x => console.log(x));

    // Results in the following behavior:
    // If the result of Math.random() is greater than 0.5 it will listen
    // for clicks anywhere on the "document"; when document is clicked it
    // will log a MouseEvent object to the console. If the result is less
    // than 0.5 it will emit ascending numbers, one every second(1000ms).
  }

  from() {
    // Converts an array to an Observable
    const array = [10, 20, 30];
    const result = Rx.Observable.from(array);
    result.subscribe(x => console.log(x));
    // Results in the following:
    // 10 20 30

    // // Convert an infinite iterable (from a generator) to an Observable
    // function* generateDoubles(seed) {
    //   let i = seed;
    //   while (true) {
    //     yield i;
    //     i = 2 * i; // double it
    //   }
    // }

    // const iterator = generateDoubles(3);
    // const result2 = Rx.Observable.from(iterator).take(10);
    // result2.subscribe(x => console.log(x));
    // // Results in the following:
    // // 3 6 12 24 48 96 192 384 768 1536
  }

  fromEvent() {
    // Emits clicks happening on the DOM document
    const clicks = Rx.Observable.fromEvent(document, 'click');
    clicks.subscribe(x => console.log(x));
    // Results in:
    // MouseEvent object logged to console everytime a click
    // occurs on the document.
  }

  merge() {
    // Merge together two Observables: 1s interval and clicks
    const clicks = Rx.Observable.fromEvent(document, 'click');
    const timer = Rx.Observable.interval(1000);
    const clicksOrTimer = Rx.Observable.merge(clicks, timer);
    clicksOrTimer.subscribe(x => console.log(x));
    // Results in the following:
    // timer will emit ascending values, one every second(1000ms) to console
    // clicks logs MouseEvents to console everytime the "document" is clicked
    // Since the two streams are merged you see these happening
    // as they occur.

    // Merge together 3 Observables, but only 2 run concurrently
    const timer1 = Rx.Observable.interval(1000).take(10);
    const timer2 = Rx.Observable.interval(2000).take(6);
    const timer3 = Rx.Observable.interval(500).take(10);
    const concurrent = 2; // the argument
    const merged = Rx.Observable.merge(timer1, timer2, timer3, concurrent);
    merged.subscribe(x => console.log(x));
    // Results in the following:
    // - First timer1 and timer2 will run concurrently
    // - timer1 will emit a value every 1000ms for 10 iterations
    // - timer2 will emit a value every 2000ms for 6 iterations
    // - after timer1 hits it's max iteration, timer2 will
    //   continue, and timer3 will start to run concurrently with timer2
    // - when timer2 hits it's max iteration it terminates, and
    //   timer3 will continue to emit a value every 500ms until it is complete.
  }

  mergeMap() {
    // Map and flatten each letter to an Observable ticking every 1 second
    const letters = Rx.Observable.of('a', 'b', 'c');
    const result = letters.mergeMap(x =>
      Rx.Observable.interval(1000).map(i => x + i)
    );
    result.subscribe(x => console.log(x));
    // Results in the following:
    // a0
    // b0
    // c0
    // a1
    // b1
    // c1
    // continues to list a,b,c with respective ascending integers
  }

  mergeMapTo() {
    // For each click event, start an interval Observable ticking every 1 second
    const clicks = Rx.Observable.fromEvent(document, 'click');
    const result = clicks.mergeMapTo(Rx.Observable.interval(1000));
    result.subscribe(x => console.log(x));
  }

  throttle() {
    // Emit clicks at a rate of at most one click per second
    const clicks = Rx.Observable.fromEvent(document, 'click');
    const result = clicks.throttle(ev => Rx.Observable.interval(1000));
    result.subscribe(x => console.log(x));
  }

  throttleTime() {
    // Emit clicks at a rate of at most one click per second
    const clicks = Rx.Observable.fromEvent(document, 'click');
    const result = clicks.throttleTime(1000);
    result.subscribe(x => console.log(x));
  }

  debounce() {
    // Emit the most recent click after a burst of clicks
    const clicks = Rx.Observable.fromEvent(document, 'click');
    const result = clicks.debounce(() => Rx.Observable.interval(1000));
    result.subscribe(x => console.log(x));
  }

  debounceTime() {
    // Emit the most recent click after a burst of clicks
    const clicks = Rx.Observable.fromEvent(document, 'click');
    const result = clicks.debounceTime(1000);
    result.subscribe(x => console.log(x));
  }

  withLatestFrom() {
    // On every click event, emit an array with the latest timer event plus the click event
    const clicks = Rx.Observable.fromEvent(document, 'click');
    const timer = Rx.Observable.interval(1000);
    const result = clicks.withLatestFrom(timer);
    result.subscribe(x => console.log(x));
  }

  interval() {
    // Emits ascending numbers, one every second (1000ms)
    const numbers = Rx.Observable.interval(1000);
    numbers.subscribe(x => console.log(x));
  }

  timer() {
    // Emits ascending numbers, one every second (1000ms), starting after 3 seconds
    const numbers = Rx.Observable.timer(3000, 1000);
    numbers.subscribe(x => console.log(x));

    // Emits one number after five seconds
    const numbers2 = Rx.Observable.timer(5000);
    numbers2.subscribe(x => console.log(x));
  }

  buffer() {
    // On every click, emit array of most recent interval events
    const clicks = Rx.Observable.fromEvent(document, 'click');
    const interval = Rx.Observable.interval(1000);
    const buffered = interval.buffer(clicks);
    buffered.subscribe(x => console.log(x));
  }

  bufferWhen() {
    // Emit an array of the last clicks every [1-5] random seconds
    const clicks = Rx.Observable.fromEvent(document, 'click');
    const buffered = clicks.bufferWhen(() =>
      Rx.Observable.interval(1000 + Math.random() * 4000)
    );
    buffered.subscribe(x => console.log(x));
  }

  count() {
    // Counts how many odd numbers are there between 1 and 7
    const numbers = Rx.Observable.range(1, 7);
    const result = numbers.count(i => i % 2 === 1);
    result.subscribe(x => console.log(x));

    // Counts how many seconds have passed before the first click happened
    const seconds = Rx.Observable.interval(1000);
    const clicks = Rx.Observable.fromEvent(document, 'click');
    const secondsBeforeClick = seconds.takeUntil(clicks);
    const result2 = secondsBeforeClick.count();
    result2.subscribe(x => console.log(x));
  }

  max() {
    // Get the maximal value of a series of numbers
    Rx.Observable.of(5, 4, 7, 2, 8)
      .max()
      .subscribe(x => console.log(x)); // -> 8

    Rx.Observable.of<Person>(
      { age: 7, name: 'Foo' },
      { age: 5, name: 'Bar' },
      { age: 9, name: 'Beer' })
      .max<Person>((a: Person, b: Person) => a.age < b.age ? -1 : 1)
      .subscribe((x: Person) => console.log(x.name)); // -> 'Beer'
  }

  do() {
    // Map every every click to the clientX position of that click, while also logging the click event
    const clicks = Rx.Observable.fromEvent(document, 'click');
    const positions = clicks
      .do(ev => console.log(ev))
      .map(ev => ev.clientX);
    positions.subscribe(x => console.log(x));
  }

  takeLast() {
    // Take the last 3 values of an Observable with many values
    const many = Rx.Observable.range(1, 100);
    const lastThree = many.takeLast(3);
    lastThree.subscribe(x => console.log(x));
  }

  distinct() {
    // A simple example with numbers
    const s = Rx.Observable.of(1, 1, 2, 2, 2, 1, 2, 3, 4, 3, 2, 1)
      .distinct()
      .subscribe(x => console.log(x)); // 1, 2, 3, 4

    // An example using a keySelector function
    const s2 = Rx.Observable.of<Person>(
      { age: 4, name: 'Foo' },
      { age: 7, name: 'Bar' },
      { age: 5, name: 'Foo' })
      .distinct((p: Person) => p.name)
      .subscribe(x => console.log(x));
    // displays:
    // { age: 4, name: 'Foo' }
    // { age: 7, name: 'Bar' }
  }

  distinctUntilChanged() {
    // simple example with numbers
    Rx.Observable.of(1, 1, 2, 2, 2, 1, 1, 2, 3, 3, 4)
      .distinctUntilChanged()
      .subscribe(x => console.log(x)); // 1, 2, 1, 2, 3, 4

    // An example using a compare function
    Rx.Observable.of<Person>(
      { age: 4, name: 'Foo' },
      { age: 7, name: 'Bar' },
      { age: 5, name: 'Foo' },
      { age: 6, name: 'Foo' })
      .distinctUntilChanged((p: Person, q: Person) => p.name === q.name)
      .subscribe(x => console.log(x));
    // displays:
    // { age: 4, name: 'Foo' }
    // { age: 7, name: 'Bar' }
    // { age: 5, name: 'Foo' }
  }

  min() {
    //  Get the minimal value of a series of numbers
    Rx.Observable.of(5, 4, 7, 2, 8)
      .min()
      .subscribe(x => console.log(x)); // -> 2

    Rx.Observable.of<Person>({ age: 7, name: 'Foo' },
      { age: 5, name: 'Bar' },
      { age: 9, name: 'Beer' })
      .min<Person>((a: Person, b: Person) => a.age < b.age ? -1 : 1)
      .subscribe((x: Person) => console.log(x.name)); // -> 'Bar'
  }

  reduce() {
    // Count the number of click events that happened in 5 seconds
    const clicksInFiveSeconds = Rx.Observable.fromEvent(document, 'click')
      .takeUntil(Rx.Observable.interval(5000));
    const ones = clicksInFiveSeconds.mapTo(1);
    const seed = 0;
    const count = ones.reduce((acc, one) => acc + one, seed);
    count.subscribe(x => console.log(x));
  }

  defaultIfEmpty() {
    // If no clicks happen in 5 seconds, then emit "no clicks"
    const clicks = Rx.Observable.fromEvent(document, 'click');
    const clicksBeforeFive = clicks.takeUntil(Rx.Observable.interval(5000));
    const result = clicksBeforeFive.defaultIfEmpty('no clicks');
    result.subscribe(x => console.log(x));
  }

  every() {
    // A simple example emitting true if all elements are less than 5, false otherwise
    Rx.Observable.of(1, 2, 3, 4, 5, 6)
      .every(x => x < 5)
      .subscribe(x => console.log(x)); // -> false
  }

  find() {
    // Find and emit the first click that happens on a DIV element
    const clicks = Rx.Observable.fromEvent(document, 'click');
    const result = clicks.find((ev: any) => ev.target.tagName === 'DIV');
    result.subscribe(x => console.log(x));
  }

  findIndex() {
    // Emit the index of first click that happens on a DIV element
    const clicks = Rx.Observable.fromEvent(document, 'click');
    const result = clicks.findIndex((ev: any) => ev.target.tagName === 'DIV');
    result.subscribe(x => console.log(x));
  }

  first() {
    // Emit only the first click that happens on the DOM
    const clicks = Rx.Observable.fromEvent(document, 'click');
    const result = clicks.first();
    result.subscribe(x => console.log(x));

    // Emits the first click that happens on a DIV
    const clicks2 = Rx.Observable.fromEvent(document, 'click');
    const result2 = clicks.first((ev: any) => ev.target.tagName === 'DIV');
    result2.subscribe(x => console.log(x));
  }
}

interface Person {
  age: number;
  name: string;
}
