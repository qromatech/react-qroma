// export const selectMany = <TIn, TOut>(f) => { 
//   return (acc,b) => {
//       return acc.concat(f(b))
//   }
// }


// declare global {
//   interface Array<T> {
//       selectMany<TIn, TOut>(selectListFn: (t: TIn) => TOut[]): TOut[];
//   }
// }

// Array.prototype.selectMany = function <TIn, TOut>( selectListFn: (t: TIn) => TOut[]): TOut[] {
//   return this.reduce((out, inx) => {
//       out.push(...selectListFn(inx));
//       return out;
//   }, new Array<TOut>());
// }


// export { };