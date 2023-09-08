// tslint:disable:ban-types
// Using a class here for better compatibility with TS files importing Some
export class Some {
    constructor(value) {
        this.value = value;
    }
    toJSON() {
        return this.value;
    }
    // Don't add "Some" for consistency with erased options
    toString() {
        return String(this.value);
    }
    GetHashCode() {
        return structuralHash(this.value);
    }
    Equals(other) {
        if (other == null) {
            return false;
        }
        else {
            return equals(this.value, other instanceof Some ? other.value : other);
        }
    }
    CompareTo(other) {
        if (other == null) {
            return 1;
        }
        else {
            return compare(this.value, other instanceof Some ? other.value : other);
        }
    }
}
export function value(x) {
    if (x == null) {
        throw new Error("Option has no value");
    }
    else {
        return x instanceof Some ? x.value : x;
    }
}
export function isArrayLike(x) {
    return Array.isArray(x) || ArrayBuffer.isView(x);
}
export function isIterable(x) {
    return x != null && typeof x === "object" && Symbol.iterator in x;
}
export function isEnumerable(x) {
    return x != null && typeof x.GetEnumerator === "function";
}
export function isComparer(x) {
    return x != null && typeof x.Compare === "function";
}
export function isComparable(x) {
    return x != null && typeof x.CompareTo === "function";
}
export function isEquatable(x) {
    return x != null && typeof x.Equals === "function";
}
export function isHashable(x) {
    return x != null && typeof x.GetHashCode === "function";
}
export function isDisposable(x) {
    return x != null && typeof x.Dispose === "function";
}
export function disposeSafe(x) {
    if (isDisposable(x)) {
        x.Dispose();
    }
}
export function defaultOf() {
    return null;
}
export function sameConstructor(x, y) {
    var _a, _b;
    return ((_a = Object.getPrototypeOf(x)) === null || _a === void 0 ? void 0 : _a.constructor) === ((_b = Object.getPrototypeOf(y)) === null || _b === void 0 ? void 0 : _b.constructor);
}
export class Enumerable {
    constructor(en) {
        this.en = en;
    }
    GetEnumerator() { return this.en; }
    [Symbol.iterator]() {
        return this;
    }
    next() {
        const hasNext = this.en["System.Collections.IEnumerator.MoveNext"]();
        const current = hasNext ? this.en["System.Collections.Generic.IEnumerator`1.get_Current"]() : undefined;
        return { done: !hasNext, value: current };
    }
}
export class Enumerator {
    constructor(iter) {
        this.iter = iter;
        this.current = defaultOf();
    }
    ["System.Collections.Generic.IEnumerator`1.get_Current"]() {
        return this.current;
    }
    ["System.Collections.IEnumerator.get_Current"]() {
        return this.current;
    }
    ["System.Collections.IEnumerator.MoveNext"]() {
        const cur = this.iter.next();
        this.current = cur.value;
        return !cur.done;
    }
    ["System.Collections.IEnumerator.Reset"]() {
        throw new Error("JS iterators cannot be reset");
    }
    Dispose() {
        return;
    }
}
export function toEnumerable(e) {
    if (isEnumerable(e)) {
        return e;
    }
    else {
        return new Enumerable(new Enumerator(e[Symbol.iterator]()));
    }
}
export function getEnumerator(e) {
    if (isEnumerable(e)) {
        return e.GetEnumerator();
    }
    else {
        return new Enumerator(e[Symbol.iterator]());
    }
}
export function toIterator(en) {
    return {
        [Symbol.iterator]() {
            return this;
        },
        next() {
            const hasNext = en["System.Collections.IEnumerator.MoveNext"]();
            const current = hasNext ? en["System.Collections.Generic.IEnumerator`1.get_Current"]() : undefined;
            return { done: !hasNext, value: current };
        },
    };
}
export function enumerableToIterator(e) {
    return toIterator(toEnumerable(e).GetEnumerator());
}
export class Comparer {
    constructor(f) {
        this.Compare = f || compare;
    }
}
export function comparerFromEqualityComparer(comparer) {
    // Sometimes IEqualityComparer also implements IComparer
    if (isComparer(comparer)) {
        return new Comparer(comparer.Compare);
    }
    else {
        return new Comparer((x, y) => {
            const xhash = comparer.GetHashCode(x);
            const yhash = comparer.GetHashCode(y);
            if (xhash === yhash) {
                return comparer.Equals(x, y) ? 0 : -1;
            }
            else {
                return xhash < yhash ? -1 : 1;
            }
        });
    }
}
export function assertEqual(actual, expected, msg) {
    if (!equals(actual, expected)) {
        throw Object.assign(new Error(msg || `Expected: ${expected} - Actual: ${actual}`), {
            actual,
            expected,
        });
    }
}
export function assertNotEqual(actual, expected, msg) {
    if (equals(actual, expected)) {
        throw Object.assign(new Error(msg || `Expected: ${expected} - Actual: ${actual}`), {
            actual,
            expected,
        });
    }
}
export class Lazy {
    constructor(factory) {
        this.factory = factory;
        this.isValueCreated = false;
    }
    get Value() {
        if (!this.isValueCreated) {
            this.createdValue = this.factory();
            this.isValueCreated = true;
        }
        return this.createdValue;
    }
    get IsValueCreated() {
        return this.isValueCreated;
    }
}
export function lazyFromValue(v) {
    return new Lazy(() => v);
}
export function padWithZeros(i, length) {
    let str = i.toString(10);
    while (str.length < length) {
        str = "0" + str;
    }
    return str;
}
export function padLeftAndRightWithZeros(i, lengthLeft, lengthRight) {
    let str = i.toString(10);
    while (str.length < lengthLeft) {
        str = "0" + str;
    }
    while (str.length < lengthRight) {
        str = str + "0";
    }
    return str;
}
export function dateOffset(date) {
    const date1 = date;
    return typeof date1.offset === "number"
        ? date1.offset
        : (date.kind === 1 /* DateKind.UTC */
            ? 0 : date.getTimezoneOffset() * -60000);
}
export function int16ToString(i, radix) {
    i = i < 0 && radix != null && radix !== 10 ? 0xFFFF + i + 1 : i;
    return i.toString(radix);
}
export function int32ToString(i, radix) {
    i = i < 0 && radix != null && radix !== 10 ? 0xFFFFFFFF + i + 1 : i;
    return i.toString(radix);
}
export class ObjectRef {
    static id(o) {
        if (!ObjectRef.idMap.has(o)) {
            ObjectRef.idMap.set(o, ++ObjectRef.count);
        }
        return ObjectRef.idMap.get(o);
    }
}
ObjectRef.idMap = new WeakMap();
ObjectRef.count = 0;
export function stringHash(s) {
    let i = 0;
    let h = 5381;
    const len = s.length;
    while (i < len) {
        h = (h * 33) ^ s.charCodeAt(i++);
    }
    return h;
}
export function numberHash(x) {
    return x * 2654435761 | 0;
}
// From https://stackoverflow.com/a/37449594
export function combineHashCodes(hashes) {
    if (hashes.length === 0) {
        return 0;
    }
    return hashes.reduce((h1, h2) => {
        return ((h1 << 5) + h1) ^ h2;
    });
}
export function physicalHash(x) {
    if (x == null) {
        return 0;
    }
    switch (typeof x) {
        case "boolean":
            return x ? 1 : 0;
        case "number":
            return numberHash(x);
        case "string":
            return stringHash(x);
        default:
            return numberHash(ObjectRef.id(x));
    }
}
export function identityHash(x) {
    if (isHashable(x)) {
        return x.GetHashCode();
    }
    else {
        return physicalHash(x);
    }
}
export function dateHash(x) {
    return x.getTime();
}
export function arrayHash(x) {
    const len = x.length;
    const hashes = new Array(len);
    for (let i = 0; i < len; i++) {
        hashes[i] = structuralHash(x[i]);
    }
    return combineHashCodes(hashes);
}
export function structuralHash(x) {
    var _a;
    if (x == null) {
        return 0;
    }
    switch (typeof x) {
        case "boolean":
            return x ? 1 : 0;
        case "number":
            return numberHash(x);
        case "string":
            return stringHash(x);
        default: {
            if (isHashable(x)) {
                return x.GetHashCode();
            }
            else if (isArrayLike(x)) {
                return arrayHash(x);
            }
            else if (x instanceof Date) {
                return dateHash(x);
            }
            else if (((_a = Object.getPrototypeOf(x)) === null || _a === void 0 ? void 0 : _a.constructor) === Object) {
                // TODO: check call-stack to prevent cyclic objects?
                const hashes = Object.values(x).map((v) => structuralHash(v));
                return combineHashCodes(hashes);
            }
            else {
                // Classes don't implement GetHashCode by default, but must use identity hashing
                return numberHash(ObjectRef.id(x));
                // return stringHash(String(x));
            }
        }
    }
}
// Intended for custom numeric types, like long or decimal
export function fastStructuralHash(x) {
    return stringHash(String(x));
}
// Intended for declared types that may or may not implement GetHashCode
export function safeHash(x) {
    // return x == null ? 0 : isHashable(x) ? x.GetHashCode() : numberHash(ObjectRef.id(x));
    return identityHash(x);
}
export function equalArraysWith(x, y, eq) {
    if (x == null) {
        return y == null;
    }
    if (y == null) {
        return false;
    }
    if (x.length !== y.length) {
        return false;
    }
    for (let i = 0; i < x.length; i++) {
        if (!eq(x[i], y[i])) {
            return false;
        }
    }
    return true;
}
export function equalArrays(x, y) {
    return equalArraysWith(x, y, equals);
}
function equalObjects(x, y) {
    const xKeys = Object.keys(x);
    const yKeys = Object.keys(y);
    if (xKeys.length !== yKeys.length) {
        return false;
    }
    xKeys.sort();
    yKeys.sort();
    for (let i = 0; i < xKeys.length; i++) {
        if (xKeys[i] !== yKeys[i] || !equals(x[xKeys[i]], y[yKeys[i]])) {
            return false;
        }
    }
    return true;
}
export function equals(x, y) {
    var _a;
    if (x === y) {
        return true;
    }
    else if (x == null) {
        return y == null;
    }
    else if (y == null) {
        return false;
    }
    else if (isEquatable(x)) {
        return x.Equals(y);
    }
    else if (isArrayLike(x)) {
        return isArrayLike(y) && equalArrays(x, y);
    }
    else if (typeof x !== "object") {
        return false;
    }
    else if (x instanceof Date) {
        return (y instanceof Date) && compareDates(x, y) === 0;
    }
    else {
        return ((_a = Object.getPrototypeOf(x)) === null || _a === void 0 ? void 0 : _a.constructor) === Object && equalObjects(x, y);
    }
}
export function compareDates(x, y) {
    let xtime;
    let ytime;
    // DateTimeOffset and DateTime deals with equality differently.
    if ("offset" in x && "offset" in y) {
        xtime = x.getTime();
        ytime = y.getTime();
    }
    else {
        xtime = x.getTime() + dateOffset(x);
        ytime = y.getTime() + dateOffset(y);
    }
    return xtime === ytime ? 0 : (xtime < ytime ? -1 : 1);
}
export function comparePrimitives(x, y) {
    return x === y ? 0 : (x < y ? -1 : 1);
}
export function compareArraysWith(x, y, comp) {
    if (x == null) {
        return y == null ? 0 : 1;
    }
    if (y == null) {
        return -1;
    }
    if (x.length !== y.length) {
        return x.length < y.length ? -1 : 1;
    }
    for (let i = 0, j = 0; i < x.length; i++) {
        j = comp(x[i], y[i]);
        if (j !== 0) {
            return j;
        }
    }
    return 0;
}
export function compareArrays(x, y) {
    return compareArraysWith(x, y, compare);
}
function compareObjects(x, y) {
    const xKeys = Object.keys(x);
    const yKeys = Object.keys(y);
    if (xKeys.length !== yKeys.length) {
        return xKeys.length < yKeys.length ? -1 : 1;
    }
    xKeys.sort();
    yKeys.sort();
    for (let i = 0, j = 0; i < xKeys.length; i++) {
        const key = xKeys[i];
        if (key !== yKeys[i]) {
            return key < yKeys[i] ? -1 : 1;
        }
        else {
            j = compare(x[key], y[key]);
            if (j !== 0) {
                return j;
            }
        }
    }
    return 0;
}
export function compare(x, y) {
    var _a;
    if (x === y) {
        return 0;
    }
    else if (x == null) {
        return y == null ? 0 : -1;
    }
    else if (y == null) {
        return 1;
    }
    else if (isComparable(x)) {
        return x.CompareTo(y);
    }
    else if (isArrayLike(x)) {
        return isArrayLike(y) ? compareArrays(x, y) : -1;
    }
    else if (typeof x !== "object") {
        return x < y ? -1 : 1;
    }
    else if (x instanceof Date) {
        return y instanceof Date ? compareDates(x, y) : -1;
    }
    else {
        return ((_a = Object.getPrototypeOf(x)) === null || _a === void 0 ? void 0 : _a.constructor) === Object ? compareObjects(x, y) : -1;
    }
}
export function min(comparer, x, y) {
    return comparer(x, y) < 0 ? x : y;
}
export function max(comparer, x, y) {
    return comparer(x, y) > 0 ? x : y;
}
export function clamp(comparer, value, min, max) {
    return (comparer(value, min) < 0) ? min : (comparer(value, max) > 0) ? max : value;
}
export function createAtom(value) {
    let atom = value;
    return (...args) => {
        if (args.length === 0) {
            return atom;
        }
        else {
            atom = args[0];
        }
    };
}
export function createObj(fields) {
    const obj = {};
    for (const kv of fields) {
        obj[kv[0]] = kv[1];
    }
    return obj;
}
export function jsOptions(mutator) {
    const opts = {};
    mutator(opts);
    return opts;
}
export function round(value, digits = 0) {
    const m = Math.pow(10, digits);
    const n = +(digits ? value * m : value).toFixed(8);
    const i = Math.floor(n);
    const f = n - i;
    const e = 1e-8;
    const r = (f > 0.5 - e && f < 0.5 + e) ? ((i % 2 === 0) ? i : i + 1) : Math.round(n);
    return digits ? r / m : r;
}
export function sign(x) {
    return x > 0 ? 1 : x < 0 ? -1 : 0;
}
export function unescapeDataString(s) {
    // https://stackoverflow.com/a/4458580/524236
    return decodeURIComponent((s).replace(/\+/g, "%20"));
}
export function escapeDataString(s) {
    return encodeURIComponent(s).replace(/!/g, "%21")
        .replace(/'/g, "%27")
        .replace(/\(/g, "%28")
        .replace(/\)/g, "%29")
        .replace(/\*/g, "%2A");
}
export function escapeUriString(s) {
    return encodeURI(s);
}
// ICollection.Clear and Count members can be called on Arrays
// or Dictionaries so we need a runtime check (see #1120)
export function count(col) {
    if (isArrayLike(col)) {
        return col.length;
    }
    else {
        let count = 0;
        for (const _ of col) {
            count++;
        }
        return count;
    }
}
export function clear(col) {
    if (isArrayLike(col)) {
        col.splice(0);
    }
    else {
        col.clear();
    }
}
const CURRIED = Symbol("curried");
export function uncurry(arity, f) {
    // f may be a function option with None value
    if (f == null) {
        return f;
    }
    const f2 = value(f);
    if (f2.length > 1) {
        return f2;
    }
    const uncurried = (...args) => {
        let res = f2;
        for (let i = 0; i < arity; i++) {
            res = res(args[i]);
        }
        return res;
    };
    uncurried[CURRIED] = f2;
    return uncurried;
}
function _curry(args, arity, f) {
    return (arg) => arity === 1
        ? f(...args.concat([arg]))
        // Note it's important to generate a new args array every time
        // because a partially applied function can be run multiple times
        : _curry(args.concat([arg]), arity - 1, f);
}
export function curry(arity, f) {
    if (f == null) {
        return f;
    }
    const f2 = value(f);
    if (f2.length === 1) {
        return f2;
    }
    else if (CURRIED in f2) {
        return f2[CURRIED];
    }
    else {
        return _curry([], arity, f2);
    }
}
export function checkArity(arity, f) {
    return f.length > arity
        ? (...args1) => (...args2) => f.apply(undefined, args1.concat(args2))
        : f;
}
export function partialApply(arity, f, args) {
    if (f == null) {
        return undefined;
    }
    else if (CURRIED in f) {
        f = f[CURRIED];
        for (let i = 0; i < args.length; i++) {
            f = f(args[i]);
        }
        return f;
    }
    else {
        return _curry(args, arity, f);
    }
}
export function mapCurriedArgs(fn, mappings) {
    function mapArg(fn, arg, mappings, idx) {
        const mapping = mappings[idx];
        if (mapping !== 0) {
            const expectedArity = mapping[0];
            const actualArity = mapping[1];
            if (expectedArity > 1) {
                arg = curry(expectedArity, arg);
            }
            if (actualArity > 1) {
                arg = uncurry(actualArity, arg);
            }
        }
        const res = fn(arg);
        if (idx + 1 === mappings.length) {
            return res;
        }
        else {
            return (arg) => mapArg(res, arg, mappings, idx + 1);
        }
    }
    return (arg) => mapArg(fn, arg, mappings, 0);
}
// More performant method to copy arrays, see #2352
export function copyToArray(source, sourceIndex, target, targetIndex, count) {
    if (ArrayBuffer.isView(source) && ArrayBuffer.isView(target)) {
        target.set(source.subarray(sourceIndex, sourceIndex + count), targetIndex);
    }
    else {
        for (let i = 0; i < count; ++i) {
            target[targetIndex + i] = source[sourceIndex + i];
        }
    }
}
