const d = 1;
// Pure functions
type Sum = (a: number) => (b: number) => number;
const sum: Sum = (a: number) => (b: number) => a + b;
const normalSum = (a: number, b: number): number => a + b;

type Increment = (a: number) => number;
const increment: Increment = (a: number): number => a + 1;
const increaseByOne: Increment = sum(1);

type ToString = (a: number) => string;
const toStr: ToString = (a: number): string => "" + a;

// Composition
type Compose = (a: Function) => (b: Function) => (arg1: number) => any;
const compose: Compose = (a: Function) => (b: Function) => (arg1: number) =>
  b(a(arg1));

type Compose2 = <A, B, C>(
  a: (arg1: A) => B,
  b: (arg1: B) => C
) => (arg1: A) => C;
const compose2: Compose2 = (a, b) => (arg1) => b(a(arg1));

type IncrementThenToString = (a: number) => string;
const incrementThenToString: IncrementThenToString = compose(increment)(toStr);
console.log(incrementThenToString(d));
console.log(d);

// Partial application
// Currying
type Curry = <A, B, C>(
  a: (arg1: A, arg2: B) => C
) => (arg1: A) => (arg2: B) => C;
const curry: Curry = (a) => (arg1) => (arg2) => a(arg1, arg2);
const sum2 = curry(normalSum);
console.log(sum2(1)(2));

type Curry2 = <A, B, C>(
  a: (arg1: A) => (arg2: B) => C
) => (arg1: A) => (arg2: B) => C;
const curry2: Curry2 = (a) => (arg1) => (arg2) => a(arg1)(arg2);

console.log(curry2(sum)(1)(2));

// RECURSION
const arr = [1, 2, 3, 4, 5];
const sumAll = (arr: number[]): number => {
  if (arr.length === 0) return 0;
  const [head, ...tail] = arr;
  return head + sumAll(tail);
};
console.log(sumAll(arr));

// Option, maybe and null values
type Option<A> = Some<A> | None;
interface Some<A> {
  _tag: "Some";
  value: A;
}

interface None {
  _tag: "None";
}

const some = <A>(value: A): Option<A> => ({ _tag: "Some", value });
const none: Option<never> = { _tag: "None" };

const isNone = <A>(option: Option<A>): option is None => option._tag === "None";

type DivideByTwo = (a: number) => Option<number>;
const divideByTwo: DivideByTwo = (a) => (a === 0 ? none : some(a / 2));

console.log(divideByTwo(7));
console.log(some(1));

const divideByTwoThenIncrement = compose2(divideByTwo, (a: Option<number>) =>
  isNone(a) ? none : some(increment(a.value))
);

console.log(divideByTwoThenIncrement(2));
console.log(divideByTwoThenIncrement(3));
console.log(divideByTwoThenIncrement(0));

// EITHER

type Either<E, A> = Left<E> | Right<A>;
interface Left<E> {
  readonly _tag: "Left";
  readonly left: E;
}

interface Right<A> {
  readonly _tag: "Right";
  readonly right: A;
}

const left = <E, A = never>(e: E): Either<E, A> => ({ _tag: "Left", left: e });
const right = <A, E = never>(a: A): Either<E, A> => ({
  _tag: "Right",
  right: a,
});

const divideByTwoIfEven = (num: number): Either<string, number> => {
  if (num === 0) return left("Cannot divide by zero");
  if (num % 2 !== 0) return left("Cannot divide by odd number");
  return right(num / 2);
};

console.log(divideByTwoIfEven(2));
console.log(divideByTwoIfEven(3));
console.log(divideByTwoIfEven(0));

const resolvedPromise = new Promise((resolve, reject) => resolve(1));
const rejectedPromise = new Promise((resolve, reject) => reject("error"));

const resolvedPromise2 = new Promise((resolve, reject) => resolve(1));
const resolvedPromise3 = new Promise((resolve, reject) => resolve(1));
const resolvedPromise4 = new Promise((resolve, reject) => resolve(1));

// line under will make all other promises rejected
// const all = Promise.all([resolvedPromise, resolvedPromise2, resolvedPromise3, resolvedPromise4, rejectedPromise]);
const all = Promise.all([
  resolvedPromise,
  resolvedPromise2,
  resolvedPromise3,
  resolvedPromise4,
]);

console.log(resolvedPromise);

// should go to catch block
(async () => {
  try {
    const res = await all;
    console.log(res);
    const result = await rejectedPromise;
    // this line will never be reached since the promise is rejected
    console.log(result);
  } catch (e) {
    console.log(e);
  }
})();

// should go resolve
(async () => {
  try {
    const result = await resolvedPromise;
    console.log(result);
  } catch (e) {
    console.log(e);
  }
})();
