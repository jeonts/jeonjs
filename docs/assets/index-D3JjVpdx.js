(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) return;
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) processPreload(link);
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") continue;
      for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
    }
  }).observe(document, {
    childList: true,
    subtree: true
  });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep) return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
class Stack extends Error {
  constructor(message = "", startIndex = 0) {
    super(message);
    this.name = "Stack";
    Object.setPrototypeOf(this, Stack.prototype);
    if (this.stack) {
      const stackLines = this.stack.split("\n");
      const header = stackLines[0];
      const body = stackLines.slice(1 + startIndex);
      this.stack = [header, ...body].join("\n");
    }
  }
}
const callStack = (msg) => {
  return void 0;
};
let OBSERVER;
const setObserver = (value) => OBSERVER = value;
const castArray$1 = (value) => {
  return isArray$1(value) ? value : [value];
};
const castError$1 = (error) => {
  if (error instanceof Error)
    return error;
  if (typeof error === "string")
    return new Error(error);
  return new Error("Unknown error");
};
const { is } = Object;
const { isArray: isArray$1 } = Array;
const isFunction$1 = (value) => {
  return typeof value === "function";
};
const isObject$1 = (value) => {
  return value !== null && typeof value === "object";
};
const isSymbol = (value) => {
  return typeof value === "symbol";
};
const noop$1 = (stack, dispose) => {
  return;
};
const nope = () => {
  return false;
};
const SYMBOL_OBSERVABLE = Symbol("Observable");
const SYMBOL_OBSERVABLE_FROZEN = Symbol("Observable.Frozen");
const SYMBOL_OBSERVABLE_READABLE = Symbol("Observable.Readable");
const SYMBOL_OBSERVABLE_WRITABLE = Symbol("Observable.Writable");
const SYMBOL_STORE = Symbol("Store");
const SYMBOL_STORE_KEYS = Symbol("Store.Keys");
const SYMBOL_STORE_OBSERVABLE = Symbol("Store.Observable");
const SYMBOL_STORE_TARGET = Symbol("Store.Target");
const SYMBOL_STORE_VALUES = Symbol("Store.Values");
const SYMBOL_STORE_UNTRACKED = Symbol("Store.Untracked");
const SYMBOL_SUSPENSE$1 = Symbol("Suspense");
const SYMBOL_UNCACHED = Symbol("Uncached");
const SYMBOL_UNTRACKED = Symbol("Untracked");
const SYMBOL_UNTRACKED_UNWRAPPED = Symbol("Untracked.Unwrapped");
function deepResolve(value) {
  if (isFunction$1(value)) {
    return deepResolve(value());
  }
  if (value instanceof Array) {
    const resolved = new Array(value.length);
    for (let i = 0, l = resolved.length; i < l; i++) {
      resolved[i] = deepResolve(value[i]);
    }
    return resolved;
  } else {
    return value;
  }
}
function frozenFunction() {
  if (arguments.length) {
    throw new Error("A readonly Observable can not be updated");
  } else {
    return this;
  }
}
function readableFunction() {
  if (arguments.length) {
    throw new Error("A readonly Observable can not be updated");
  } else {
    return this.get();
  }
}
function writableFunction(fn) {
  if (arguments.length) {
    if (isFunction$1(fn)) {
      return this.update(fn);
    } else {
      return this.set(fn);
    }
  } else {
    return this.get();
  }
}
const frozen = (value) => {
  const fn = frozenFunction.bind(value);
  fn[SYMBOL_OBSERVABLE] = true;
  fn[SYMBOL_OBSERVABLE_FROZEN] = true;
  return fn;
};
const readable = (value, stack) => {
  value.stack = stack;
  const fn = readableFunction.bind(value);
  fn.valueOf = () => deepResolve(fn);
  fn.toString = () => fn.valueOf().toString();
  fn[SYMBOL_OBSERVABLE] = true;
  fn[SYMBOL_OBSERVABLE_READABLE] = value;
  return fn;
};
const writable = (value, stack) => {
  value.stack = stack;
  const fn = writableFunction.bind(value);
  fn.valueOf = () => deepResolve(fn);
  fn.toString = () => fn.valueOf().toString();
  fn[SYMBOL_OBSERVABLE] = true;
  fn[SYMBOL_OBSERVABLE_WRITABLE] = value;
  return fn;
};
const DIRTY_NO = 0;
const DIRTY_MAYBE_NO = 1;
const DIRTY_MAYBE_YES = 2;
const DIRTY_YES = 3;
frozen(false);
frozen(true);
const UNAVAILABLE = new Proxy({}, new Proxy({}, { get() {
  throw new Error("Unavailable value");
} }));
const UNINITIALIZED = function() {
};
let Scheduler$2 = class Scheduler {
  constructor() {
    this.waiting = [];
    this.counter = 0;
    this.locked = false;
    this.flush = () => {
      if (this.locked)
        return;
      if (this.counter)
        return;
      if (!this.waiting.length)
        return;
      try {
        this.locked = true;
        while (true) {
          const queue = this.waiting;
          if (!queue.length)
            break;
          this.waiting = [];
          for (let i = 0, l = queue.length; i < l; i++) {
            queue[i][0].update(queue[i][1]);
          }
        }
      } finally {
        this.locked = false;
      }
    };
    this.wrap = (fn) => {
      this.counter += 1;
      fn();
      this.counter -= 1;
      this.flush();
    };
    this.schedule = (observer, stack) => {
      this.waiting.push([observer, stack]);
    };
  }
};
const SchedulerSync = new Scheduler$2();
class Observable {
  /* CONSTRUCTOR */
  constructor(value, options2, parent) {
    this.observers = /* @__PURE__ */ new Set();
    this.value = value;
    this.options = options2;
    if (parent) {
      this.parent = parent;
    }
    if ((options2 == null ? void 0 : options2.equals) !== void 0) {
      this.equals = options2.equals || nope;
    }
  }
  /* API */
  get() {
    var _a2, _b2;
    if (!((_a2 = this.parent) == null ? void 0 : _a2.disposed)) {
      (_b2 = this.parent) == null ? void 0 : _b2.update(this.stack);
      OBSERVER == null ? void 0 : OBSERVER.observables.link(this);
    }
    return this.value;
  }
  set(value) {
    var _a2;
    if (((_a2 = this.options) == null ? void 0 : _a2.type) !== void 0) {
      const expectedType = this.options.type;
      if (typeof expectedType === "string" || typeof expectedType === "function") {
        try {
          if (expectedType === "string" || expectedType === String) {
            if (typeof value !== "string") {
              throw new TypeError(`Expected value of type 'string', but received '${typeof value}'`);
            }
          } else if (expectedType === "number" || expectedType === Number) {
            if (typeof value !== "number") {
              throw new TypeError(`Expected value of type 'number', but received '${typeof value}'`);
            }
          } else if (expectedType === "boolean" || expectedType === Boolean) {
            if (typeof value !== "boolean" && typeof value !== "string" && value !== void 0) {
              throw new TypeError(`Expected value of type 'boolean', 'string', or 'undefined' for boolean, but received '${typeof value}'`);
            }
          } else if (expectedType === "function" || expectedType === Function) {
            if (Array.isArray(value) && typeof value[0] === "function") {
            } else if (typeof value === "function") {
            } else {
              throw new TypeError(`Expected value of type 'function' (as [fn] array or direct function), but received '${typeof value}'`);
            }
          } else if (expectedType === "object" || expectedType === Object) {
            if (typeof value !== "object" || value === null) {
              throw new TypeError(`Expected value of type 'object', but received '${typeof value}'`);
            }
          } else if (expectedType === "symbol" || expectedType === Symbol) {
            if (typeof value !== "symbol") {
              throw new TypeError(`Expected value of type 'symbol', but received '${typeof value}'`);
            }
          } else if (expectedType === "bigint" || expectedType === BigInt) {
            if (typeof value !== "bigint") {
              throw new TypeError(`Expected value of type 'bigint', but received '${typeof value}'`);
            }
          } else if (expectedType === "undefined") {
            if (value !== void 0) {
              throw new TypeError(`Expected value of type 'undefined', but received '${typeof value}'`);
            }
          } else if (typeof expectedType === "function") {
            const constructorName = expectedType.name;
            const isBuiltInConstructor = constructorName === "String" || constructorName === "Number" || constructorName === "Boolean" || constructorName === "Function" || constructorName === "Object" || constructorName === "Symbol" || constructorName === "BigInt";
            if (constructorName && !isBuiltInConstructor) {
              if (!(value instanceof expectedType)) {
                throw new TypeError(`Expected value to be instance of '${constructorName}', but received '${typeof value}'`);
              }
            }
          }
        } catch (e) {
          if (!(e instanceof TypeError)) ;
          else {
            throw e;
          }
        }
      }
    }
    const equals = this.equals || is;
    const fresh = this.value === UNINITIALIZED || !equals(value, this.value);
    if (!fresh)
      return value;
    this.value = value;
    this.stack = callStack();
    SchedulerSync.counter += 1;
    this.stale(DIRTY_YES, this.stack);
    SchedulerSync.counter -= 1;
    SchedulerSync.flush();
    return value;
  }
  stale(status, stack) {
    for (const observer of this.observers) {
      if (observer.status !== DIRTY_MAYBE_NO || observer.observables.has(this)) {
        if (observer.sync) {
          observer.status = Math.max(observer.status, status);
          SchedulerSync.schedule(observer, stack);
        } else {
          observer.stale(status, stack);
        }
      }
    }
  }
  update(fn, stack) {
    const value = fn(this.value);
    return this.set(value);
  }
}
const lazyArrayEachRight = (arr, fn) => {
  if (arr instanceof Array) {
    for (let i = arr.length - 1; i >= 0; i--) {
      fn(arr[i]);
    }
  } else if (arr) {
    fn(arr);
  }
};
const lazyArrayPush = (obj, key, value) => {
  const arr = obj[key];
  if (arr instanceof Array) {
    arr.push(value);
  } else if (arr) {
    obj[key] = [arr, value];
  } else {
    obj[key] = value;
  }
};
const lazySetAdd = (obj, key, value) => {
  const set2 = obj[key];
  if (set2 instanceof Set) {
    set2.add(value);
  } else if (set2) {
    if (value !== set2) {
      const s = /* @__PURE__ */ new Set();
      s.add(set2);
      s.add(value);
      obj[key] = s;
    }
  } else {
    obj[key] = value;
  }
};
const lazySetDelete = (obj, key, value) => {
  const set2 = obj[key];
  if (set2 instanceof Set) {
    set2.delete(value);
  } else if (set2 === value) {
    obj[key] = void 0;
  }
};
const lazySetEach = (set2, fn) => {
  if (set2 instanceof Set) {
    for (const value of set2) {
      fn(value);
    }
  } else if (set2) {
    fn(set2);
  }
};
const onCleanup = (cleanup2) => cleanup2.call(cleanup2, callStack());
const onDispose = (owner) => owner.dispose(true);
class Owner {
  constructor() {
    this.disposed = false;
    this.cleanups = void 0;
    this.errorHandler = void 0;
    this.contexts = void 0;
    this.observers = void 0;
    this.roots = void 0;
    this.suspenses = void 0;
  }
  /* API */
  catch(error, silent) {
    var _a2;
    const { errorHandler } = this;
    if (errorHandler) {
      errorHandler(error);
      return true;
    } else {
      if ((_a2 = this.parent) == null ? void 0 : _a2.catch(error, true))
        return true;
      if (silent)
        return false;
      throw error;
    }
  }
  dispose(deep) {
    lazyArrayEachRight(this.contexts, onDispose);
    lazyArrayEachRight(this.observers, onDispose);
    lazyArrayEachRight(this.suspenses, onDispose);
    lazyArrayEachRight(this.cleanups, onCleanup);
    this.cleanups = void 0;
    this.disposed = deep;
    this.errorHandler = void 0;
    this.observers = void 0;
    this.suspenses = void 0;
  }
  get(symbol) {
    var _a2;
    return (_a2 = this.context) == null ? void 0 : _a2[symbol];
  }
  wrap(fn, owner, observer, stack) {
    const ownerPrev = OWNER;
    const observerPrev = OBSERVER;
    setOwner(owner);
    setObserver(observer);
    try {
      return fn(stack);
    } catch (error) {
      this.catch(castError$1(error), false);
      return UNAVAILABLE;
    } finally {
      setOwner(ownerPrev);
      setObserver(observerPrev);
    }
  }
}
class SuperRoot extends Owner {
  constructor() {
    super(...arguments);
    this.context = {};
  }
}
let SUPER_OWNER = new SuperRoot();
let OWNER = SUPER_OWNER;
const setOwner = (value) => OWNER = value;
class ObservablesArray {
  /* CONSTRUCTOR */
  constructor(observer) {
    this.observer = observer;
    this.observables = [];
    this.observablesIndex = 0;
  }
  /* API */
  dispose(deep) {
    if (deep) {
      const { observer, observables } = this;
      for (let i = 0; i < observables.length; i++) {
        observables[i].observers.delete(observer);
      }
    }
    this.observablesIndex = 0;
  }
  postdispose() {
    const { observer, observables, observablesIndex } = this;
    const observablesLength = observables.length;
    if (observablesIndex < observablesLength) {
      for (let i = observablesIndex; i < observablesLength; i++) {
        observables[i].observers.delete(observer);
      }
      observables.length = observablesIndex;
    }
  }
  empty() {
    return !this.observables.length;
  }
  has(observable2) {
    const index = this.observables.indexOf(observable2);
    return index >= 0 && index < this.observablesIndex;
  }
  link(observable2) {
    const { observer, observables, observablesIndex } = this;
    const observablesLength = observables.length;
    if (observablesLength > 0) {
      if (observables[observablesIndex] === observable2) {
        this.observablesIndex += 1;
        return;
      }
      const index = observables.indexOf(observable2);
      if (index >= 0 && index < observablesIndex) {
        return;
      }
      if (observablesIndex < observablesLength - 1) {
        this.postdispose();
      } else if (observablesIndex === observablesLength - 1) {
        observables[observablesIndex].observers.delete(observer);
      }
    }
    observable2.observers.add(observer);
    observables[this.observablesIndex++] = observable2;
    if (observablesIndex === 128) {
      observer.observables = new ObservablesSet(observer, observables);
    }
  }
  update(stack) {
    var _a2;
    const { observables } = this;
    for (let i = 0, l = observables.length; i < l; i++) {
      (_a2 = observables[i].parent) == null ? void 0 : _a2.update(stack);
    }
  }
}
class ObservablesSet {
  /* CONSTRUCTOR */
  constructor(observer, observables) {
    this.observer = observer;
    this.observables = new Set(observables);
  }
  /* API */
  dispose(deep) {
    for (const observable2 of this.observables) {
      observable2.observers.delete(this.observer);
    }
  }
  postdispose() {
    return;
  }
  empty() {
    return !this.observables.size;
  }
  has(observable2) {
    return this.observables.has(observable2);
  }
  link(observable2) {
    const { observer, observables } = this;
    const sizePrev = observables.size;
    observable2.observers.add(observer);
    const sizeNext = observables.size;
    if (sizePrev === sizeNext)
      return;
    observables.add(observable2);
  }
  update(stack) {
    var _a2;
    for (const observable2 of this.observables) {
      (_a2 = observable2.parent) == null ? void 0 : _a2.update(stack);
    }
  }
}
class Observer extends Owner {
  /* CONSTRUCTOR */
  constructor() {
    super();
    this.parent = OWNER;
    this.context = OWNER.context;
    this.status = DIRTY_YES;
    this.observables = new ObservablesArray(this);
    if (OWNER !== SUPER_OWNER) {
      lazyArrayPush(this.parent, "observers", this);
    }
  }
  /* API */
  dispose(deep) {
    this.observables.dispose(deep);
    super.dispose(deep);
  }
  refresh(fn, stack) {
    this.dispose(false);
    this.status = DIRTY_MAYBE_NO;
    try {
      return this.wrap(fn, this, this, stack);
    } finally {
      this.observables.postdispose();
    }
  }
  run(stack) {
    throw new Error("Abstract method");
  }
  stale(status, stack) {
    throw new Error("Abstract method");
  }
  update(stack) {
    if (this.disposed)
      return;
    if (this.status === DIRTY_MAYBE_YES) {
      this.observables.update(stack);
    }
    if (this.status === DIRTY_YES) {
      this.status = DIRTY_MAYBE_NO;
      this.run(stack);
      if (this.status === DIRTY_MAYBE_NO) {
        this.status = DIRTY_NO;
      } else {
        this.update(stack);
      }
    } else {
      this.status = DIRTY_NO;
    }
  }
}
const cleanup = (fn) => {
  lazyArrayPush(OWNER, "cleanups", fn);
};
class Context extends Owner {
  /* CONSTRUCTOR */
  constructor(context2) {
    super();
    this.parent = OWNER;
    this.context = { ...OWNER.context, ...context2 };
    lazyArrayPush(this.parent, "contexts", this);
  }
  /* API */
  wrap(fn, owner, observer, stack) {
    return super.wrap(fn, this, void 0, stack);
  }
}
function context(symbolOrContext, fn) {
  if (isSymbol(symbolOrContext)) {
    return OWNER.context[symbolOrContext];
  } else {
    const stack = callStack();
    return new Context(symbolOrContext).wrap(noop$1, void 0, void 0, stack);
  }
}
class Scheduler2 {
  constructor() {
    this.waiting = [];
    this.locked = false;
    this.queued = false;
    this.flush = (stack) => {
      if (this.locked)
        return;
      if (!this.waiting.length)
        return;
      try {
        this.locked = true;
        while (true) {
          const queue = this.waiting;
          if (!queue.length)
            break;
          this.waiting = [];
          for (let i = 0, l = queue.length; i < l; i++) {
            queue[i][0].update(queue[i][1]);
          }
        }
      } finally {
        this.locked = false;
      }
    };
    this.queue = (stack) => {
      if (this.queued)
        return;
      this.queued = true;
      this.resolve(stack);
    };
    this.resolve = (stack) => {
      queueMicrotask(() => {
        queueMicrotask(() => {
          {
            this.queued = false;
            this.flush(stack);
          }
        });
      });
    };
    this.schedule = (effect2, stack) => {
      this.waiting.push([effect2, stack]);
      this.queue(stack);
    };
  }
}
const Scheduler$1 = new Scheduler2();
class Effect extends Observer {
  /* CONSTRUCTOR */
  constructor(fn, options2) {
    super();
    this.fn = fn;
    if ((options2 == null ? void 0 : options2.suspense) !== false) {
      const suspense = this.get(SYMBOL_SUSPENSE$1);
      if (suspense) {
        this.suspense = suspense;
      }
    }
    if ((options2 == null ? void 0 : options2.sync) === true) {
      this.sync = true;
    }
    const { stack } = options2 ?? { stack: callStack() };
    if ((options2 == null ? void 0 : options2.sync) === "init") {
      this.init = true;
      this.update(stack);
    } else {
      this.schedule(stack);
    }
  }
  /* API */
  run(stack) {
    const result = super.refresh(this.fn, stack);
    if (isFunction$1(result)) {
      lazyArrayPush(this, "cleanups", result);
    }
  }
  schedule(stack) {
    var _a2;
    if ((_a2 = this.suspense) == null ? void 0 : _a2.suspended)
      return;
    if (this.sync) {
      this.update(stack);
    } else {
      Scheduler$1.schedule(this, stack);
    }
  }
  stale(status, stack) {
    const statusPrev = this.status;
    if (statusPrev >= status)
      return;
    this.status = status;
    if (!this.sync || statusPrev !== 2 && statusPrev !== 3) {
      this.schedule(stack);
    }
  }
  update(stack) {
    var _a2;
    if ((_a2 = this.suspense) == null ? void 0 : _a2.suspended)
      return;
    super.update(stack);
  }
}
const effect = (fn, options2) => {
  const effect2 = new Effect(fn, options2);
  const dispose = (stack) => effect2.dispose(true);
  return dispose;
};
const isObservable = (value) => {
  return isFunction$1(value) && SYMBOL_OBSERVABLE in value;
};
function get(value, getFunction = true) {
  const is2 = getFunction ? isFunction$1 : isObservable;
  if (is2(value)) {
    return value();
  } else {
    return value;
  }
}
const isStore = (value) => {
  return isObject$1(value) && SYMBOL_STORE in value;
};
function untrack(fn) {
  if (isFunction$1(fn)) {
    const observerPrev = OBSERVER;
    if (observerPrev) {
      try {
        setObserver(void 0);
        return fn();
      } finally {
        setObserver(observerPrev);
      }
    } else {
      return fn();
    }
  } else {
    return fn;
  }
}
const isBatching = () => {
  return Scheduler$1.queued || Scheduler$1.locked || SchedulerSync.locked;
};
class StoreMap extends Map {
  insert(key, value) {
    super.set(key, value);
    return value;
  }
}
class StoreCleanable {
  constructor() {
    this.count = 0;
  }
  listen() {
    this.count += 1;
    cleanup(this);
  }
  call() {
    this.count -= 1;
    if (this.count)
      return;
    this.dispose();
  }
  dispose() {
  }
}
class StoreKeys extends StoreCleanable {
  constructor(parent, observable2) {
    super();
    this.parent = parent;
    this.observable = observable2;
  }
  dispose() {
    this.parent.keys = void 0;
  }
}
class StoreValues extends StoreCleanable {
  constructor(parent, observable2) {
    super();
    this.parent = parent;
    this.observable = observable2;
  }
  dispose() {
    this.parent.values = void 0;
  }
}
class StoreHas extends StoreCleanable {
  constructor(parent, key, observable2) {
    super();
    this.parent = parent;
    this.key = key;
    this.observable = observable2;
  }
  dispose() {
    var _a2;
    (_a2 = this.parent.has) == null ? void 0 : _a2.delete(this.key);
  }
}
class StoreProperty extends StoreCleanable {
  constructor(parent, key, observable2, node) {
    super();
    this.parent = parent;
    this.key = key;
    this.observable = observable2;
    this.node = node;
  }
  dispose() {
    var _a2;
    (_a2 = this.parent.properties) == null ? void 0 : _a2.delete(this.key);
  }
}
const StoreListenersRegular = {
  /* VARIABLES */
  active: 0,
  listeners: /* @__PURE__ */ new Set(),
  nodes: /* @__PURE__ */ new Set(),
  /* API */
  prepare: (stack) => {
    const { listeners, nodes } = StoreListenersRegular;
    const traversed = /* @__PURE__ */ new Set();
    const traverse = (node) => {
      if (traversed.has(node))
        return;
      traversed.add(node);
      lazySetEach(node.parents, traverse);
      lazySetEach(node.listenersRegular, (listener) => {
        listeners.add(listener);
      });
    };
    nodes.forEach(traverse);
    return () => {
      listeners.forEach((listener) => {
        listener(stack);
      });
    };
  },
  register: (node, stack) => {
    StoreListenersRegular.nodes.add(node);
    StoreScheduler.schedule(stack);
  },
  reset: () => {
    StoreListenersRegular.listeners = /* @__PURE__ */ new Set();
    StoreListenersRegular.nodes = /* @__PURE__ */ new Set();
  }
};
const StoreListenersRoots = {
  /* VARIABLES */
  active: 0,
  nodes: /* @__PURE__ */ new Map(),
  /* API */
  prepare: () => {
    const { nodes } = StoreListenersRoots;
    return () => {
      nodes.forEach((rootsSet, store2) => {
        const roots = Array.from(rootsSet);
        lazySetEach(store2.listenersRoots, (listener) => {
          listener(roots);
        });
      });
    };
  },
  register: (store2, root2, stack) => {
    const roots = StoreListenersRoots.nodes.get(store2) || /* @__PURE__ */ new Set();
    roots.add(root2);
    StoreListenersRoots.nodes.set(store2, roots);
    StoreScheduler.schedule(stack);
  },
  registerWith: (current, parent, key, stack) => {
    if (!parent.parents) {
      const root2 = (current == null ? void 0 : current.store) || untrack(() => parent.store[key]);
      StoreListenersRoots.register(parent, root2, stack);
    } else {
      const traversed = /* @__PURE__ */ new Set();
      const traverse = (node) => {
        if (traversed.has(node))
          return;
        traversed.add(node);
        lazySetEach(node.parents, (parent2) => {
          if (!parent2.parents) {
            StoreListenersRoots.register(parent2, node.store, stack);
          }
          traverse(parent2);
        });
      };
      traverse(current || parent);
    }
  },
  reset: () => {
    StoreListenersRoots.nodes = /* @__PURE__ */ new Map();
  }
};
const StoreScheduler = {
  /* VARIABLES */
  active: false,
  /* API */
  flush: (stack) => {
    const flushRegular = StoreListenersRegular.prepare(stack);
    const flushRoots = StoreListenersRoots.prepare();
    StoreScheduler.reset();
    flushRegular(stack);
    flushRoots(stack);
  },
  flushIfNotBatching: (stack) => {
    if (isBatching()) {
      {
        setTimeout(StoreScheduler.flushIfNotBatching, 0);
      }
    } else {
      StoreScheduler.flush(stack);
    }
  },
  reset: () => {
    StoreScheduler.active = false;
    StoreListenersRegular.reset();
    StoreListenersRoots.reset();
  },
  schedule: (stack) => {
    if (StoreScheduler.active)
      return;
    StoreScheduler.active = true;
    queueMicrotask(() => StoreScheduler.flushIfNotBatching(stack));
  }
};
const NODES = /* @__PURE__ */ new WeakMap();
const SPECIAL_SYMBOLS = /* @__PURE__ */ new Set([SYMBOL_STORE, SYMBOL_STORE_KEYS, SYMBOL_STORE_OBSERVABLE, SYMBOL_STORE_TARGET, SYMBOL_STORE_VALUES]);
const UNREACTIVE_KEYS = /* @__PURE__ */ new Set(["__proto__", "__defineGetter__", "__defineSetter__", "__lookupGetter__", "__lookupSetter__", "prototype", "constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toSource", "toString", "valueOf"]);
const STORE_TRAPS = {
  /* API */
  get: (target, key) => {
    var _a2, _b2;
    const stack = callStack();
    if (SPECIAL_SYMBOLS.has(key)) {
      if (key === SYMBOL_STORE)
        return true;
      if (key === SYMBOL_STORE_TARGET)
        return target;
      if (key === SYMBOL_STORE_KEYS) {
        if (isListenable()) {
          const node2 = getNodeExisting(target);
          node2.keys || (node2.keys = getNodeKeys(node2));
          node2.keys.listen();
          node2.keys.observable.stack = stack;
          node2.keys.observable.get();
        }
        return;
      }
      if (key === SYMBOL_STORE_VALUES) {
        if (isListenable()) {
          const node2 = getNodeExisting(target);
          node2.values || (node2.values = getNodeValues(node2));
          node2.values.listen();
          node2.values.observable.stack = stack;
          node2.values.observable.get();
        }
        return;
      }
      if (key === SYMBOL_STORE_OBSERVABLE) {
        return (key2) => {
          var _a22;
          key2 = typeof key2 === "number" ? String(key2) : key2;
          const node2 = getNodeExisting(target);
          const getter2 = (_a22 = node2.getters) == null ? void 0 : _a22.get(key2);
          if (getter2)
            return getter2.bind(node2.store);
          node2.properties || (node2.properties = new StoreMap());
          const value2 = target[key2];
          const property2 = node2.properties.get(key2) || node2.properties.insert(key2, getNodeProperty(node2, key2, value2));
          const options2 = node2.equals ? { equals: node2.equals } : void 0;
          property2.observable || (property2.observable = getNodeObservable(node2, value2, options2));
          const observable2 = readable(property2.observable, stack);
          return observable2;
        };
      }
    }
    if (UNREACTIVE_KEYS.has(key))
      return target[key];
    const node = getNodeExisting(target);
    const getter = (_a2 = node.getters) == null ? void 0 : _a2.get(key);
    const value = getter || target[key];
    node.properties || (node.properties = new StoreMap());
    const listenable = isListenable();
    const proxiable = isProxiable(value);
    const property = listenable || proxiable ? node.properties.get(key) || node.properties.insert(key, getNodeProperty(node, key, value)) : void 0;
    if (property == null ? void 0 : property.node) {
      lazySetAdd(property.node, "parents", node);
    }
    if (property && listenable) {
      const options2 = node.equals ? { equals: node.equals } : void 0;
      property.listen();
      property.observable || (property.observable = getNodeObservable(node, value, options2));
      property.observable.stack = stack;
      property.observable.get();
    }
    if (getter) {
      return getter.call(node.store);
    } else {
      if (typeof value === "function" && value === Array.prototype[key]) {
        return function() {
          return value.apply(node.store, arguments);
        };
      }
      return ((_b2 = property == null ? void 0 : property.node) == null ? void 0 : _b2.store) || value;
    }
  },
  set: (target, key, value, stack) => {
    var _a2, _b2, _c, _d, _e, _f, _g, _h, _i, _j;
    value = getTarget(value);
    const node = getNodeExisting(target);
    const setter = (_a2 = node.setters) == null ? void 0 : _a2.get(key);
    if (setter) {
      setter.call(node.store, value);
    } else {
      const targetIsArray = isArray$1(target);
      const valuePrev = target[key];
      const hadProperty = !!valuePrev || key in target;
      const equals = node.equals || is;
      if (hadProperty && equals(value, valuePrev) && (key !== "length" || !targetIsArray))
        return true;
      const lengthPrev = targetIsArray && target["length"];
      target[key] = value;
      const lengthNext = targetIsArray && target["length"];
      if (targetIsArray && key !== "length" && lengthPrev !== lengthNext) {
        (_d = (_c = (_b2 = node.properties) == null ? void 0 : _b2.get("length")) == null ? void 0 : _c.observable) == null ? void 0 : _d.set(lengthNext);
      }
      (_e = node.values) == null ? void 0 : _e.observable.set(0);
      if (!hadProperty) {
        (_f = node.keys) == null ? void 0 : _f.observable.set(0);
        (_h = (_g = node.has) == null ? void 0 : _g.get(key)) == null ? void 0 : _h.observable.set(true);
      }
      const property = (_i = node.properties) == null ? void 0 : _i.get(key);
      if (property == null ? void 0 : property.node) {
        lazySetDelete(property.node, "parents", node);
      }
      if (property) {
        (_j = property.observable) == null ? void 0 : _j.set(value);
        property.node = isProxiable(value) ? NODES.get(value) || getNode(value, key, node) : void 0;
      }
      if (property == null ? void 0 : property.node) {
        lazySetAdd(property.node, "parents", node);
      }
      if (StoreListenersRoots.active) {
        StoreListenersRoots.registerWith(property == null ? void 0 : property.node, node, key, stack);
      }
      if (StoreListenersRegular.active) {
        StoreListenersRegular.register(node, stack);
      }
      if (targetIsArray && key === "length") {
        const lengthPrev2 = Number(valuePrev);
        const lengthNext2 = Number(value);
        for (let i = lengthNext2; i < lengthPrev2; i++) {
          if (i in target)
            continue;
          STORE_TRAPS.deleteProperty(target, `${i}`, true);
        }
      }
    }
    return true;
  },
  deleteProperty: (target, key, _force) => {
    var _a2, _b2, _c, _d, _e, _f, _g, _h;
    const hasProperty = key in target;
    if (!_force && !hasProperty)
      return true;
    const deleted = Reflect.deleteProperty(target, key);
    if (!deleted)
      return false;
    const node = getNodeExisting(target);
    const stack = callStack();
    (_a2 = node.getters) == null ? void 0 : _a2.delete(key);
    (_b2 = node.setters) == null ? void 0 : _b2.delete(key);
    (_c = node.keys) == null ? void 0 : _c.observable.set(0);
    (_d = node.values) == null ? void 0 : _d.observable.set(0);
    (_f = (_e = node.has) == null ? void 0 : _e.get(key)) == null ? void 0 : _f.observable.set(false);
    const property = (_g = node.properties) == null ? void 0 : _g.get(key);
    if (StoreListenersRoots.active) {
      StoreListenersRoots.registerWith(property == null ? void 0 : property.node, node, key, stack);
    }
    if (property == null ? void 0 : property.node) {
      lazySetDelete(property.node, "parents", node);
    }
    if (property) {
      (_h = property.observable) == null ? void 0 : _h.set(void 0);
      property.node = void 0;
    }
    if (StoreListenersRegular.active) {
      StoreListenersRegular.register(node, stack);
    }
    return true;
  },
  defineProperty: (target, key, descriptor) => {
    var _a2, _b2, _c, _d, _e, _f, _g, _h;
    const node = getNodeExisting(target);
    const equals = node.equals || is;
    const hadProperty = key in target;
    const descriptorPrev = Reflect.getOwnPropertyDescriptor(target, key);
    const stack = callStack();
    if ("value" in descriptor && isStore(descriptor.value)) {
      descriptor = { ...descriptor, value: getTarget(descriptor.value) };
    }
    if (descriptorPrev && isEqualDescriptor(descriptorPrev, descriptor, equals))
      return true;
    const defined = Reflect.defineProperty(target, key, descriptor);
    if (!defined)
      return false;
    if (!descriptor.get) {
      (_a2 = node.getters) == null ? void 0 : _a2.delete(key);
    } else if (descriptor.get) {
      node.getters || (node.getters = new StoreMap());
      node.getters.set(key, descriptor.get);
    }
    if (!descriptor.set) {
      (_b2 = node.setters) == null ? void 0 : _b2.delete(key);
    } else if (descriptor.set) {
      node.setters || (node.setters = new StoreMap());
      node.setters.set(key, descriptor.set);
    }
    if (hadProperty !== !!descriptor.enumerable) {
      (_c = node.keys) == null ? void 0 : _c.observable.set(0);
    }
    (_e = (_d = node.has) == null ? void 0 : _d.get(key)) == null ? void 0 : _e.observable.set(true);
    const property = (_f = node.properties) == null ? void 0 : _f.get(key);
    if (StoreListenersRoots.active) {
      StoreListenersRoots.registerWith(property == null ? void 0 : property.node, node, key, stack);
    }
    if (property == null ? void 0 : property.node) {
      lazySetDelete(property.node, "parents", node);
    }
    if (property) {
      if ("get" in descriptor) {
        (_g = property.observable) == null ? void 0 : _g.set(descriptor.get);
        property.node = void 0;
      } else {
        const value = descriptor.value;
        (_h = property.observable) == null ? void 0 : _h.set(value);
        property.node = isProxiable(value) ? NODES.get(value) || getNode(value, key, node) : void 0;
      }
    }
    if (property == null ? void 0 : property.node) {
      lazySetAdd(property.node, "parents", node);
    }
    if (StoreListenersRoots.active) {
      StoreListenersRoots.registerWith(property == null ? void 0 : property.node, node, key, stack);
    }
    if (StoreListenersRegular.active) {
      StoreListenersRegular.register(node, stack);
    }
    return true;
  },
  has: (target, key) => {
    if (key === SYMBOL_STORE)
      return true;
    if (key === SYMBOL_STORE_TARGET)
      return true;
    const value = key in target;
    if (isListenable()) {
      const node = getNodeExisting(target);
      node.has || (node.has = new StoreMap());
      const has = node.has.get(key) || node.has.insert(key, getNodeHas(node, key, value));
      has.listen();
      has.observable.stack = callStack();
      has.observable.get();
    }
    return value;
  },
  ownKeys: (target) => {
    const keys = Reflect.ownKeys(target);
    if (isListenable()) {
      const node = getNodeExisting(target);
      node.keys || (node.keys = getNodeKeys(node));
      node.keys.listen();
      node.keys.observable.stack = callStack();
      node.keys.observable.get();
    }
    return keys;
  }
};
const STORE_UNTRACK_TRAPS = {
  /* API */
  has: (target, key) => {
    if (key === SYMBOL_STORE_UNTRACKED)
      return true;
    return key in target;
  }
};
const getNode = (value, key, parent, equals) => {
  if (isStore(value))
    return getNodeExisting(getTarget(value));
  const store2 = isFrozenLike(value, key, parent) ? value : new Proxy(value, STORE_TRAPS);
  const gettersAndSetters = getGettersAndSetters(value);
  const node = { parents: parent, store: store2 };
  if (gettersAndSetters) {
    const { getters, setters } = gettersAndSetters;
    if (getters)
      node.getters = getters;
    if (setters)
      node.setters = setters;
  }
  if (equals === false) {
    node.equals = nope;
  } else if (equals) {
    node.equals = equals;
  } else if (parent == null ? void 0 : parent.equals) {
    node.equals = parent.equals;
  }
  NODES.set(value, node);
  return node;
};
const getNodeExisting = (value) => {
  const node = NODES.get(value);
  if (!node)
    throw new Error("Impossible");
  return node;
};
const getNodeFromStore = (store2) => {
  return getNodeExisting(getTarget(store2));
};
const getNodeKeys = (node) => {
  const observable2 = getNodeObservable(node, 0, { equals: false });
  const keys = new StoreKeys(node, observable2);
  return keys;
};
const getNodeValues = (node) => {
  const observable2 = getNodeObservable(node, 0, { equals: false });
  const values = new StoreValues(node, observable2);
  return values;
};
const getNodeHas = (node, key, value) => {
  const observable2 = getNodeObservable(node, value);
  const has = new StoreHas(node, key, observable2);
  return has;
};
const getNodeObservable = (node, value, options2) => {
  return new Observable(value, options2);
};
const getNodeProperty = (node, key, value) => {
  const observable2 = void 0;
  const propertyNode = isProxiable(value) ? NODES.get(value) || getNode(value, key, node) : void 0;
  const property = new StoreProperty(node, key, observable2, propertyNode);
  node.properties || (node.properties = new StoreMap());
  node.properties.set(key, property);
  return property;
};
const getGettersAndSetters = (value) => {
  if (isArray$1(value))
    return;
  let getters;
  let setters;
  const keys = Object.keys(value);
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i];
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (!descriptor)
      continue;
    const { get: get2, set: set2 } = descriptor;
    if (get2) {
      getters || (getters = new StoreMap());
      getters.set(key, get2);
    }
    if (set2) {
      setters || (setters = new StoreMap());
      setters.set(key, set2);
    }
    if (get2 && !set2) {
      setters || (setters = new StoreMap());
      setters.set(key, throwNoSetterError);
    }
  }
  if (!getters && !setters)
    return;
  return { getters, setters };
};
const getStore = (value, options2) => {
  if (isStore(value))
    return value;
  const node = NODES.get(value) || getNode(value, void 0, void 0, options2 == null ? void 0 : options2.equals);
  return node.store;
};
const getTarget = (value) => {
  if (isStore(value))
    return value[SYMBOL_STORE_TARGET];
  return value;
};
const getUntracked = (value) => {
  if (!isObject$1(value))
    return value;
  if (isUntracked(value))
    return value;
  return new Proxy(value, STORE_UNTRACK_TRAPS);
};
const isEqualDescriptor = (a, b, equals) => {
  return !!a.configurable === !!b.configurable && !!a.enumerable === !!b.enumerable && !!a.writable === !!b.writable && equals(a.value, b.value) && a.get === b.get && a.set === b.set;
};
const isFrozenLike = (value, key, parent) => {
  if (Object.isFrozen(value))
    return true;
  if (!parent || key === void 0)
    return false;
  const target = store.unwrap(parent.store);
  const descriptor = Reflect.getOwnPropertyDescriptor(target, key);
  if ((descriptor == null ? void 0 : descriptor.configurable) || (descriptor == null ? void 0 : descriptor.writable))
    return false;
  return true;
};
const isListenable = () => {
  return !!OBSERVER;
};
const isProxiable = (value) => {
  if (value === null || typeof value !== "object")
    return false;
  if (SYMBOL_STORE in value)
    return true;
  if (SYMBOL_STORE_UNTRACKED in value)
    return false;
  if (isArray$1(value))
    return true;
  const prototype = Object.getPrototypeOf(value);
  if (prototype === null)
    return true;
  return Object.getPrototypeOf(prototype) === null;
};
const isUntracked = (value) => {
  if (value === null || typeof value !== "object")
    return false;
  return SYMBOL_STORE_UNTRACKED in value;
};
const throwNoSetterError = () => {
  throw new TypeError("Cannot set property value of #<Object> which has only a getter");
};
const store = (value, options2) => {
  if (!isObject$1(value))
    return value;
  if (isUntracked(value))
    return value;
  return getStore(value, options2);
};
store.on = (target, listener) => {
  const targets = isStore(target) ? [target] : castArray$1(target);
  const selectors = targets.filter(isFunction$1);
  const nodes = targets.filter(isStore).map(getNodeFromStore);
  StoreListenersRegular.active += 1;
  const stack = callStack();
  const disposers = selectors.map((selector) => {
    let inited = false;
    return effect((stack2) => {
      if (inited) {
        StoreListenersRegular.listeners.add(listener);
        StoreScheduler.schedule(stack2);
      }
      inited = true;
      selector();
    }, { suspense: false, sync: true, stack });
  });
  nodes.forEach((node) => {
    lazySetAdd(node, "listenersRegular", listener);
  });
  return (stack2) => {
    StoreListenersRegular.active -= 1;
    disposers.forEach((disposer) => {
      disposer(stack2);
    });
    nodes.forEach((node) => {
      lazySetDelete(node, "listenersRegular", listener);
    });
  };
};
store._onRoots = (target, listener) => {
  if (!isStore(target))
    return noop$1;
  const node = getNodeFromStore(target);
  if (node.parents)
    throw new Error("Only top-level stores are supported");
  StoreListenersRoots.active += 1;
  lazySetAdd(node, "listenersRoots", listener);
  return () => {
    StoreListenersRoots.active -= 1;
    lazySetDelete(node, "listenersRoots", listener);
  };
};
store.reconcile = /* @__PURE__ */ (() => {
  const getType = (value) => {
    if (isArray$1(value))
      return 1;
    if (isProxiable(value))
      return 2;
    return 0;
  };
  const reconcileOuter = (prev, next) => {
    const uprev = getTarget(prev);
    const unext = getTarget(next);
    reconcileInner(prev, next);
    const prevType = getType(uprev);
    const nextType = getType(unext);
    if (prevType === 1 || nextType === 1) {
      prev.length = next.length;
    }
    return prev;
  };
  const reconcileInner = (prev, next) => {
    const uprev = getTarget(prev);
    const unext = getTarget(next);
    const prevKeys = Object.keys(uprev);
    const nextKeys = Object.keys(unext);
    for (let i = 0, l = nextKeys.length; i < l; i++) {
      const key = nextKeys[i];
      const prevValue = uprev[key];
      const nextValue = unext[key];
      if (!is(prevValue, nextValue)) {
        const prevType = getType(prevValue);
        const nextType = getType(nextValue);
        if (prevType && prevType === nextType) {
          reconcileInner(prev[key], nextValue);
          if (prevType === 1) {
            prev[key].length = nextValue.length;
          }
        } else {
          prev[key] = nextValue;
        }
      } else if (prevValue === void 0 && !(key in uprev)) {
        prev[key] = void 0;
      }
    }
    for (let i = 0, l = prevKeys.length; i < l; i++) {
      const key = prevKeys[i];
      if (!(key in unext)) {
        delete prev[key];
      }
    }
    return prev;
  };
  const reconcile = (prev, next) => {
    return untrack(() => {
      return reconcileOuter(prev, next);
    });
  };
  return reconcile;
})();
store.untrack = (value) => {
  return getUntracked(value);
};
store.unwrap = (value) => {
  return getTarget(value);
};
const _with = () => {
  const owner = OWNER;
  const observer = OBSERVER;
  return (fn, stack) => {
    return owner.wrap(() => fn(), owner, observer, stack);
  };
};
const DIRECTIVES = {};
const SYMBOL_TEMPLATE_ACCESSOR = Symbol("Template.Accessor");
const SYMBOLS_DIRECTIVES = {};
const SYMBOL_CLONE = Symbol("CloneElement");
const SYMBOL_JSX = Symbol("Jsx");
const SYMBOL_DEFAULT = Symbol("Default");
const assign$1 = Object.assign;
const castArray = (value) => {
  return isArray(value) ? value : [value];
};
const flatten = (arr) => {
  for (let i = 0, l = arr.length; i < l; i++) {
    if (!isArray(arr[i])) continue;
    return arr.flat(Infinity);
  }
  return arr;
};
const isArray = (a) => a instanceof Array;
const isBoolean = (value) => {
  return typeof value === "boolean";
};
const isFunction = (value) => {
  return typeof value === "function";
};
const isClass = (fn) => {
  return typeof fn === "function" && /^class\s/.test(Function.prototype.toString.call(fn));
};
const isFunctionReactive = (value) => {
  var _a2, _b2;
  return !(SYMBOL_UNTRACKED in value || SYMBOL_UNTRACKED_UNWRAPPED in value || SYMBOL_OBSERVABLE_FROZEN in value || ((_b2 = (_a2 = value[SYMBOL_OBSERVABLE_READABLE]) == null ? void 0 : _a2.parent) == null ? void 0 : _b2.disposed));
};
const isNil = (value) => {
  return value === null || value === void 0;
};
const isNode = (value) => {
  return value instanceof Node;
};
const isObject$2 = (value) => {
  return typeof value === "object" && value !== null;
};
const isString = (value) => {
  return typeof value === "string";
};
const isSVG = (value) => {
  return !!value["isSVG"];
};
const isSVGElement = /* @__PURE__ */ (() => {
  const svgRe = /^(t(ext$|s)|s[vwy]|g)|^set|tad|ker|p(at|s)|s(to|c$|ca|k)|r(ec|cl)|ew|us|f($|e|s)|cu|n[ei]|l[ty]|[GOP]/;
  const svgCache = {};
  return (element) => {
    const cached = svgCache[element];
    return cached !== void 0 ? cached : svgCache[element] = !element.includes("-") && svgRe.test(element);
  };
})();
const isTemplateAccessor = (value) => {
  return isFunction(value) && SYMBOL_TEMPLATE_ACCESSOR in value;
};
const isVoidChild = (value) => {
  return value === null || value === void 0 || typeof value === "boolean" || typeof value === "symbol";
};
const isPureFunction = (fn) => typeof fn === "function" && !isObservable(fn);
const options = {
  sync: "init",
  stack: void 0
};
const useRenderEffect = (fn, stack) => {
  return effect(fn, { ...options, stack });
};
const useCheapDisposed = () => {
  let disposed = false;
  const get2 = () => disposed;
  const set2 = () => disposed = true;
  cleanup(set2);
  return get2;
};
const useMicrotask = (fn, stack) => {
  const disposed = useCheapDisposed();
  const runWithOwner = _with();
  queueMicrotask(() => {
    if (disposed()) return;
    runWithOwner(fn, stack);
  });
};
const classesToggle = (element, classes, force) => {
  const { className } = element;
  if (isString(className)) {
    if (!className) {
      if (force) {
        element.className = classes;
        return;
      } else {
        return;
      }
    } else if (!force && className === classes) {
      element.className = "";
      return;
    }
  }
  if (classes.includes(" ")) {
    classes.split(" ").forEach((cls) => {
      if (!cls.length) return;
      element.classList.toggle(cls, !!force);
    });
  } else {
    element.classList.toggle(classes, !!force);
  }
};
const NOOP_CHILDREN = [];
const FragmentUtils = {
  make: () => {
    return {
      values: void 0,
      length: 0
    };
  },
  makeWithNode: (node) => {
    return {
      values: node,
      length: 1
    };
  },
  makeWithFragment: (fragment) => {
    return {
      values: fragment,
      fragmented: true,
      length: 1
    };
  },
  getChildrenFragmented: (thiz, children = []) => {
    const { values, length } = thiz;
    if (!length) return children;
    if (values instanceof Array) {
      for (let i = 0, l = values.length; i < l; i++) {
        const value = values[i];
        if (value instanceof Node) {
          children.push(value);
        } else {
          FragmentUtils.getChildrenFragmented(value, children);
        }
      }
    } else {
      if (values instanceof Node) {
        children.push(values);
      } else {
        FragmentUtils.getChildrenFragmented(values, children);
      }
    }
    return children;
  },
  getChildren: (thiz) => {
    if (!thiz.length) return NOOP_CHILDREN;
    if (!thiz.fragmented) return thiz.values;
    if (thiz.length === 1) return FragmentUtils.getChildren(thiz.values);
    return FragmentUtils.getChildrenFragmented(thiz);
  },
  pushFragment: (thiz, fragment) => {
    FragmentUtils.pushValue(thiz, fragment);
    thiz.fragmented = true;
  },
  pushNode: (thiz, node) => {
    FragmentUtils.pushValue(thiz, node);
  },
  pushValue: (thiz, value) => {
    const { values, length } = thiz;
    if (length === 0) {
      thiz.values = value;
    } else if (length === 1) {
      thiz.values = [values, value];
    } else {
      values.push(value);
    }
    thiz.length += 1;
  },
  replaceWithNode: (thiz, node) => {
    thiz.values = node;
    delete thiz.fragmented;
    thiz.length = 1;
  },
  replaceWithFragment: (thiz, fragment) => {
    thiz.values = fragment.values;
    thiz.fragmented = fragment.fragmented;
    thiz.length = fragment.length;
  }
};
const wrapElement = (element) => {
  element[SYMBOL_UNTRACKED_UNWRAPPED] = true;
  return element;
};
const wrapCloneElement = (target, component, props) => {
  target[SYMBOL_CLONE] = { Component: component, props };
  return target;
};
const { createComment, createHTMLNode, createSVGNode, createText, createDocumentFragment } = (() => {
  if (typeof via !== "undefined") {
    const document2 = via.document;
    const createComment2 = document2.createComment;
    const createHTMLNode2 = document2.createElement;
    const createSVGNode2 = (name) => document2.createElementNS("http://www.w3.org/2000/svg", name);
    const createText2 = document2.createTextNode;
    const createDocumentFragment2 = document2.createDocumentFragment;
    return { createComment: createComment2, createHTMLNode: createHTMLNode2, createSVGNode: createSVGNode2, createText: createText2, createDocumentFragment: createDocumentFragment2 };
  } else {
    const createComment2 = document.createComment.bind(document, "");
    const createHTMLNode2 = document.createElement.bind(document);
    const createSVGNode2 = document.createElementNS.bind(document, "http://www.w3.org/2000/svg");
    const createText2 = document.createTextNode.bind(document);
    const createDocumentFragment2 = document.createDocumentFragment.bind(document);
    return { createComment: createComment2, createHTMLNode: createHTMLNode2, createSVGNode: createSVGNode2, createText: createText2, createDocumentFragment: createDocumentFragment2 };
  }
})();
const dummyNode = createComment("");
const beforeDummyWrapper = [dummyNode];
const afterDummyWrapper = [dummyNode];
const diff = (parent, before, after, nextSibling) => {
  if (before === after) return;
  if (before instanceof Node) {
    if (after instanceof Node) {
      if (before.parentNode === parent) {
        parent.replaceChild(after, before);
        return;
      }
    }
    beforeDummyWrapper[0] = before;
    before = beforeDummyWrapper;
  }
  if (after instanceof Node) {
    afterDummyWrapper[0] = after;
    after = afterDummyWrapper;
  }
  const bLength = after.length;
  let aEnd = before.length;
  let bEnd = bLength;
  let aStart = 0;
  let bStart = 0;
  let map = null;
  let removable;
  while (aStart < aEnd || bStart < bEnd) {
    if (aEnd === aStart) {
      const node = bEnd < bLength ? bStart ? after[bStart - 1].nextSibling : after[bEnd - bStart] : nextSibling;
      if (bStart < bEnd) {
        if (node) {
          node.before.apply(node, after.slice(bStart, bEnd));
        } else {
          parent.append.apply(parent, after.slice(bStart, bEnd));
        }
        bStart = bEnd;
      }
    } else if (bEnd === bStart) {
      while (aStart < aEnd) {
        if (!map || !map.has(before[aStart])) {
          removable = before[aStart];
          if (removable.parentNode === parent) {
            parent.removeChild(removable);
          }
        }
        aStart++;
      }
    } else if (before[aStart] === after[bStart]) {
      aStart++;
      bStart++;
    } else if (before[aEnd - 1] === after[bEnd - 1]) {
      aEnd--;
      bEnd--;
    } else if (before[aStart] === after[bEnd - 1] && after[bStart] === before[aEnd - 1]) {
      const node = before[--aEnd].nextSibling;
      parent.insertBefore(
        after[bStart++],
        before[aStart++].nextSibling
      );
      parent.insertBefore(after[--bEnd], node);
      before[aEnd] = after[bEnd];
    } else {
      if (!map) {
        map = /* @__PURE__ */ new Map();
        let i = bStart;
        while (i < bEnd)
          map.set(after[i], i++);
      }
      if (map.has(before[aStart])) {
        const index = map.get(before[aStart]);
        if (bStart < index && index < bEnd) {
          let i = aStart;
          let sequence = 1;
          while (++i < aEnd && i < bEnd && map.get(before[i]) === index + sequence)
            sequence++;
          if (sequence > index - bStart) {
            const node = before[aStart];
            if (bStart < index) {
              if (node) {
                node.before.apply(node, after.slice(bStart, index));
              } else {
                parent.append.apply(parent, after.slice(bStart, index));
              }
              bStart = index;
            }
          } else {
            parent.replaceChild(
              after[bStart++],
              before[aStart++]
            );
          }
        } else
          aStart++;
      } else {
        removable = before[aStart++];
        if (removable.parentNode === parent) {
          parent.removeChild(removable);
        }
      }
    }
  }
  beforeDummyWrapper[0] = dummyNode;
  afterDummyWrapper[0] = dummyNode;
};
const resolveChild = (value, setter, _dynamic = false, stack) => {
  if (isArray(value)) {
    const [values, hasObservables] = resolveArraysAndStatics(value);
    values[SYMBOL_UNCACHED] = value[SYMBOL_UNCACHED];
    setter(values, hasObservables || _dynamic, stack);
  } else if (isFunction(value)) {
    if (!isFunctionReactive(value)) {
      if (value[SYMBOL_OBSERVABLE_READABLE] ?? value[SYMBOL_OBSERVABLE_WRITABLE])
        (value[SYMBOL_OBSERVABLE_READABLE] ?? value[SYMBOL_OBSERVABLE_WRITABLE]).stack = stack;
      const newValue = get(value);
      resolveChild(newValue, setter, _dynamic, stack);
    } else {
      useRenderEffect((stack2) => {
        if (value[SYMBOL_OBSERVABLE_READABLE] ?? value[SYMBOL_OBSERVABLE_WRITABLE])
          (value[SYMBOL_OBSERVABLE_READABLE] ?? value[SYMBOL_OBSERVABLE_WRITABLE]).stack = stack2;
        const newValue = get(value);
        resolveChild(newValue, setter, true, stack2);
      }, stack);
    }
  } else {
    setter(value, _dynamic, stack);
  }
};
const resolveClass = (classes, resolved = {}) => {
  if (isString(classes)) {
    classes.split(/\s+/g).filter(Boolean).filter((cls) => {
      resolved[cls] = true;
    });
  } else if (isFunction(classes)) {
    resolveClass(classes(), resolved);
  } else if (isArray(classes)) {
    classes.forEach((cls) => {
      resolveClass(cls, resolved);
    });
  } else if (classes) {
    for (const key in classes) {
      const value = classes[key];
      const isActive = !!get(value);
      if (!isActive) continue;
      resolved[key] = true;
    }
  }
  return resolved;
};
const resolveStyle = (styles, resolved = {}) => {
  if (isString(styles)) {
    return styles;
  } else if (isFunction(styles)) {
    return resolveStyle(styles(), resolved);
  } else if (isArray(styles)) {
    styles.forEach((style2) => {
      resolveStyle(style2, resolved);
    });
  } else if (styles) {
    for (const key in styles) {
      const value = styles[key];
      resolved[key] = get(value);
    }
  }
  return resolved;
};
const resolveArraysAndStatics = /* @__PURE__ */ (() => {
  const DUMMY_RESOLVED = [];
  const resolveArraysAndStaticsInner = (values, resolved, hasObservables) => {
    for (let i = 0, l = values.length; i < l; i++) {
      const value = values[i];
      const type = typeof value;
      if (type === "string" || type === "number" || type === "bigint") {
        if (resolved === DUMMY_RESOLVED) resolved = values.slice(0, i);
        resolved.push(createText(value));
      } else if (type === "object" && isArray(value)) {
        if (resolved === DUMMY_RESOLVED) resolved = values.slice(0, i);
        hasObservables = resolveArraysAndStaticsInner(value, resolved, hasObservables)[1];
      } else if (type === "function" && isObservable(value)) {
        if (resolved !== DUMMY_RESOLVED) resolved.push(value);
        hasObservables = true;
      } else {
        if (resolved !== DUMMY_RESOLVED) resolved.push(value);
      }
    }
    if (resolved === DUMMY_RESOLVED) resolved = values;
    return [resolved, hasObservables];
  };
  return (values) => {
    return resolveArraysAndStaticsInner(values, DUMMY_RESOLVED, false);
  };
})();
const kebabToCamelCase = (str) => {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
};
const camelToKebabCase = (str) => {
  return str.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
};
const normalizePropertyPath = (path) => {
  if (path.includes("$")) {
    path = path.replace(/\$/g, ".");
  }
  if (path.includes(".")) {
    return path.split(".").map((part) => kebabToCamelCase(part)).join(".");
  }
  return kebabToCamelCase(path);
};
const setNestedAttribute = (element, attributeName, value) => {
  const normalizedPath = normalizePropertyPath(attributeName);
  if (normalizedPath.startsWith("style.")) {
    const styleProperty = normalizedPath.slice(6);
    if (element.style) {
      element.style[styleProperty] = value;
    }
    return;
  }
  if (normalizedPath.includes(".")) {
    const keys = normalizedPath.split(".");
    const lastKey = keys.pop();
    let target = element;
    if (!target.props) {
      target.props = {};
    }
    target = target.props;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (!(key in target) || typeof target[key] !== "object" || target[key] === null) {
        target[key] = {};
      }
      target = target[key];
    }
    if (lastKey) {
      target[lastKey] = value;
    }
    return;
  }
  const propName = kebabToCamelCase(normalizedPath);
  element[propName] = value;
};
const setAttributeStatic = /* @__PURE__ */ (() => {
  const attributesBoolean = /* @__PURE__ */ new Set(["allowfullscreen", "async", "autofocus", "autoplay", "checked", "controls", "default", "disabled", "formnovalidate", "hidden", "indeterminate", "ismap", "loop", "multiple", "muted", "nomodule", "novalidate", "open", "playsinline", "readonly", "required", "reversed", "seamless", "selected"]);
  const attributeCamelCasedRe = /e(r[HRWrv]|[Vawy])|Con|l(e[Tcs]|c)|s(eP|y)|a(t[rt]|u|v)|Of|Ex|f[XYa]|gt|hR|d[Pg]|t[TXYd]|[UZq]/;
  const attributesCache = {};
  const uppercaseRe = /[A-Z]/g;
  const normalizeKeySvg = (key) => {
    return attributesCache[key] || (attributesCache[key] = attributeCamelCasedRe.test(key) ? key : key.replace(uppercaseRe, (char) => `-${char.toLowerCase()}`));
  };
  return (element, key, value) => {
    if (key.includes(".") || key.includes("$")) {
      setNestedAttribute(element, key, value);
      return;
    }
    if (isSVG(element)) {
      key = key === "xlinkHref" || key === "xlink:href" ? "href" : normalizeKeySvg(key);
      if (isNil(value) || value === false && attributesBoolean.has(key)) {
        element.removeAttribute(key);
      } else {
        element.setAttribute(key, String(value));
      }
    } else {
      if (isNil(value) || value === false && attributesBoolean.has(key)) {
        element.removeAttribute(key);
      } else {
        value = value === true ? "" : String(value);
        element.setAttribute(key, value);
      }
    }
  };
})();
const setAttribute = (element, key, value, stack) => {
  if (isFunction(value) && isFunctionReactive(value))
    useRenderEffect(() => {
      var _a2;
      const unwrappedValue = value();
      const { toHtml } = ((_a2 = value[SYMBOL_OBSERVABLE_WRITABLE]) == null ? void 0 : _a2.options) ?? {};
      setAttributeStatic(element, key, toHtml ? toHtml(unwrappedValue) : unwrappedValue);
    }, stack);
  else
    setAttributeStatic(element, key, get(value));
};
const setChildReplacementText = (child, childPrev) => {
  if (childPrev.nodeType === 3) {
    childPrev.nodeValue = child;
    return childPrev;
  } else {
    const parent = childPrev.parentElement;
    if (!parent) throw new Error("Invalid child replacement");
    const textNode = createText(child);
    parent.replaceChild(textNode, childPrev);
    return textNode;
  }
};
const setChildStatic = (parent, fragment, fragmentOnly, child, dynamic, childComp, stack) => {
  if (!dynamic && isVoidChild(child)) return;
  const prev = FragmentUtils.getChildren(fragment);
  const prevIsArray = prev instanceof Array;
  const prevLength = prevIsArray ? prev.length : 1;
  const prevFirst = prevIsArray ? prev[0] : prev;
  const prevLast = prevIsArray ? prev[prevLength - 1] : prev;
  const prevSibling = (prevLast == null ? void 0 : prevLast.nextSibling) || null;
  if (prevLength === 0) {
    const type = typeof child;
    if (type === "string" || type === "number" || type === "bigint") {
      const textNode = createText(child);
      if (!fragmentOnly) {
        parent.appendChild(textNode);
      }
      FragmentUtils.replaceWithNode(fragment, textNode);
      return;
    } else if (type === "object" && child !== null && typeof child.nodeType === "number") {
      const node = child;
      if (!fragmentOnly) {
        parent.insertBefore(node, null);
      }
      FragmentUtils.replaceWithNode(fragment, node);
      return;
    }
  }
  if (prevLength === 1) {
    const type = typeof child;
    if (type === "string" || type === "number" || type === "bigint") {
      const node = setChildReplacementText(String(child), prevFirst);
      FragmentUtils.replaceWithNode(fragment, node);
      return;
    }
  }
  const fragmentNext = FragmentUtils.make();
  const children = isArray(child) ? child : [child];
  for (let i = 0, l = children.length; i < l; i++) {
    const child2 = children[i];
    const type = typeof child2;
    if (type === "string" || type === "number" || type === "bigint") {
      FragmentUtils.pushNode(fragmentNext, createText(child2));
    } else if (type === "object" && child2 !== null && typeof child2.nodeType === "number") {
      FragmentUtils.pushNode(fragmentNext, child2);
    } else if (type === "function") {
      const fragment2 = FragmentUtils.make();
      let childFragmentOnly = !fragmentOnly;
      FragmentUtils.pushFragment(fragmentNext, fragment2);
      resolveChild(child2, (child3, dynamic2, stack2) => {
        const fragmentOnly2 = childFragmentOnly;
        childFragmentOnly = false;
        setChildStatic(parent, fragment2, fragmentOnly2, child3, dynamic2, children[i], stack2);
      }, false, stack);
    }
  }
  let next = FragmentUtils.getChildren(fragmentNext);
  let nextLength = fragmentNext.length;
  if (nextLength === 0 && prevLength === 1 && prevFirst.nodeType === 8) {
    return;
  }
  if (!fragmentOnly && (nextLength === 0 || prevLength === 1 && prevFirst.nodeType === 8 || children[SYMBOL_UNCACHED])) {
    const { childNodes } = parent;
    if (childNodes.length === prevLength) {
      parent.textContent = "";
      if (nextLength === 0) {
        const placeholder = (
          /* childComp[SYMBOL_DOM] = */
          createComment("")
        );
        FragmentUtils.pushNode(fragmentNext, placeholder);
        if (next !== fragmentNext.values) {
          next = placeholder;
          nextLength += 1;
        }
      }
      if (prevSibling) {
        if (next instanceof Array) {
          prevSibling.before.apply(prevSibling, next);
        } else {
          parent.insertBefore(next, prevSibling);
        }
      } else {
        if (next instanceof Array) {
          for (const node of next) parent.appendChild(node);
        } else {
          parent.appendChild(next);
        }
      }
      FragmentUtils.replaceWithFragment(fragment, fragmentNext);
      return;
    }
  }
  if (nextLength === 0) {
    const placeholder = (
      /* childComp[SYMBOL_DOM] = */
      createComment("")
    );
    FragmentUtils.pushNode(fragmentNext, placeholder);
    if (next !== fragmentNext.values) {
      next = placeholder;
      nextLength += 1;
    }
  }
  if (!fragmentOnly) {
    diff(parent, prev, next, prevSibling);
  }
  FragmentUtils.replaceWithFragment(fragment, fragmentNext);
};
const setChild = (parent, child, fragment = FragmentUtils.make(), stack) => {
  const cd = child;
  resolveChild(cd, (child2, dynamic, stack2) => setChildStatic(parent, fragment, false, child2, dynamic, cd, stack2), false, stack);
};
const setClassStatic = classesToggle;
const setClass = (element, key, value, stack) => {
  if (isFunction(value) && isFunctionReactive(value)) {
    useRenderEffect(() => {
      setClassStatic(element, key, value());
    }, stack);
  } else {
    setClassStatic(element, key, get(value));
  }
};
const setClassBooleanStatic = (element, value, key, keyPrev) => {
  if (keyPrev && keyPrev !== true) {
    setClassStatic(element, keyPrev, false);
  }
  if (key && key !== true) {
    setClassStatic(element, key, value);
  }
};
const setClassBoolean = (element, value, key, stack) => {
  if (isFunction(key) && isFunctionReactive(key)) {
    let keyPrev;
    useRenderEffect(() => {
      const keyNext = key();
      setClassBooleanStatic(element, value, keyNext, keyPrev);
      keyPrev = keyNext;
    }, stack);
  } else {
    setClassBooleanStatic(element, value, get(key));
  }
};
const setClassesStatic = (element, object, objectPrev, stack) => {
  if (isString(object)) {
    if (isSVG(element)) {
      element.setAttribute("class", object);
    } else {
      element.className = object;
    }
  } else {
    if (objectPrev) {
      if (isString(objectPrev)) {
        if (objectPrev) {
          if (isSVG(element)) {
            element.setAttribute("class", "");
          } else {
            element.className = "";
          }
        }
      } else if (isArray(objectPrev)) {
        objectPrev = store.unwrap(objectPrev);
        for (let i = 0, l = objectPrev.length; i < l; i++) {
          if (!objectPrev[i]) continue;
          setClassBoolean(element, false, objectPrev[i], stack);
        }
      } else {
        objectPrev = store.unwrap(objectPrev);
        for (const key in objectPrev) {
          if (object && key in object) continue;
          setClass(element, key, false, stack);
        }
      }
    }
    if (isArray(object)) {
      if (isStore(object)) {
        for (let i = 0, l = object.length; i < l; i++) {
          const fn = untrack(() => isFunction(object[i]) ? object[i] : object[SYMBOL_STORE_OBSERVABLE](String(i)));
          setClassBoolean(element, true, fn, stack);
        }
      } else {
        for (let i = 0, l = object.length; i < l; i++) {
          if (!object[i]) continue;
          setClassBoolean(element, true, object[i], stack);
        }
      }
    } else {
      if (isStore(object)) {
        for (const key in object) {
          const fn = untrack(() => isFunction(object[key]) ? object[key] : object[SYMBOL_STORE_OBSERVABLE](key));
          setClass(element, key, fn, stack);
        }
      } else {
        for (const key in object) {
          setClass(element, key, object[key], stack);
        }
      }
    }
  }
};
const setClasses = (element, object, stack) => {
  if (isFunction(object) || isArray(object)) {
    let objectPrev;
    useRenderEffect(() => {
      const objectNext = resolveClass(object);
      setClassesStatic(element, objectNext, objectPrev, stack);
      objectPrev = objectNext;
    }, stack);
  } else {
    setClassesStatic(element, object, null, stack);
  }
};
const setDirective = (element, directive, args) => {
  const symbol = SYMBOLS_DIRECTIVES[directive] || Symbol();
  const data = context(symbol) || DIRECTIVES[symbol];
  if (!data) throw new Error(`Directive "${directive}" not found`);
  const call = () => data.fn(element, ...castArray(args));
  const stack = new Error();
  if (data.immediate) {
    call();
  } else {
    useMicrotask(call, stack);
  }
};
const setEventStatic = /* @__PURE__ */ (() => {
  const delegatedEvents = {
    onauxclick: ["_onauxclick", false],
    onbeforeinput: ["_onbeforeinput", false],
    onclick: ["_onclick", false],
    ondblclick: ["_ondblclick", false],
    onfocusin: ["_onfocusin", false],
    onfocusout: ["_onfocusout", false],
    oninput: ["_oninput", false],
    onkeydown: ["_onkeydown", false],
    onkeyup: ["_onkeyup", false],
    onmousedown: ["_onmousedown", false],
    onmouseup: ["_onmouseup", false]
  };
  const delegate = (event) => {
    const key = `_${event}`;
    document.addEventListener(event.slice(2), (event2) => {
      const targets = event2.composedPath();
      let target = null;
      Object.defineProperty(event2, "currentTarget", {
        configurable: true,
        get() {
          return target;
        }
      });
      for (let i = 0, l = targets.length; i < l; i++) {
        target = targets[i];
        const handler = target[key];
        if (!handler) continue;
        handler(event2);
        if (event2.cancelBubble) break;
      }
      target = null;
    });
  };
  return (element, event, value) => {
    if (event.startsWith("onmiddleclick")) {
      const _value = value;
      event = `onauxclick${event.slice(13)}`;
      value = _value && ((event2) => event2["button"] === 1 && _value(event2));
    }
    const delegated = delegatedEvents[event];
    if (delegated) {
      if (!delegated[1]) {
        delegated[1] = true;
        delegate(event);
      }
      element[delegated[0]] = value;
    } else if (event.endsWith("passive")) {
      const isCapture = event.endsWith("capturepassive");
      const type = event.slice(2, -7 - (isCapture ? 7 : 0));
      const key = `_${event}`;
      const valuePrev = element[key];
      if (valuePrev) element.removeEventListener(type, valuePrev, { capture: isCapture });
      if (value) element.addEventListener(type, value, { passive: true, capture: isCapture });
      element[key] = value;
    } else if (event.endsWith("capture")) {
      const type = event.slice(2, -7);
      const key = `_${event}`;
      const valuePrev = element[key];
      if (valuePrev) element.removeEventListener(type, valuePrev, { capture: true });
      if (value) element.addEventListener(type, value, { capture: true });
      element[key] = value;
    } else {
      element[event] = value;
    }
  };
})();
const setEvent = (element, event, value) => {
  setEventStatic(element, event, value);
};
const setHTMLStatic = (element, value) => {
  element.innerHTML = String(isNil(value) ? "" : value);
};
const setHTML = (element, value, stack) => {
  useRenderEffect(() => {
    setHTMLStatic(element, get(get(value).__html));
  }, stack);
};
const setPropertyStatic = (element, key, value) => {
  const isComment = element instanceof Comment;
  if (key === "tabIndex" && isBoolean(value)) {
    value = value ? 0 : void 0;
  }
  if (key === "value" && !isComment) {
    if (element.tagName === "PROGRESS") {
      value ?? (value = null);
    } else if (element.tagName === "SELECT" && !element["_$inited"]) {
      element["_$inited"] = true;
      queueMicrotask(() => element[key] = value);
    }
  }
  try {
    element[key] = value;
    if (isNil(value) && !isComment) {
      setAttributeStatic(element, key, null);
    }
  } catch {
    if (!isComment)
      setAttributeStatic(element, key, value);
  }
};
const setProperty = (element, key, value, stack) => {
  if (isFunction(value) && isFunctionReactive(value)) {
    useRenderEffect(() => {
      setPropertyStatic(element, key, value());
    }, stack);
  } else {
    setPropertyStatic(element, key, get(value));
  }
};
const setRef = (element, value) => {
  if (isNil(value)) return;
  const values = flatten(castArray(value)).filter(Boolean);
  if (!values.length) return;
  const stack = new Error();
  useMicrotask(() => untrack(() => values.forEach((value2) => value2 == null ? void 0 : value2(element))), stack);
};
const setStyleStatic = /* @__PURE__ */ (() => {
  const propertyNonDimensionalRe = /^(-|f[lo].*[^se]$|g.{5,}[^ps]$|z|o[pr]|(W.{5})?[lL]i.*(t|mp)$|an|(bo|s).{4}Im|sca|m.{6}[ds]|ta|c.*[st]$|wido|ini)/i;
  const propertyNonDimensionalCache = {};
  return (element, key, value) => {
    if (key.charCodeAt(0) === 45) {
      if (isNil(value)) {
        element.style.removeProperty(key);
      } else {
        element.style.setProperty(key, String(value));
      }
    } else if (isNil(value)) {
      element.style[key] = null;
    } else {
      element.style[key] = isString(value) || isObject$2(value) || (propertyNonDimensionalCache[key] || (propertyNonDimensionalCache[key] = propertyNonDimensionalRe.test(key))) ? value : `${value}px`;
    }
  };
})();
const setStyle = (element, key, value, stack) => {
  if (isFunction(value) && isFunctionReactive(value)) {
    useRenderEffect(() => {
      setStyleStatic(element, key, value());
    }, stack);
  } else {
    setStyleStatic(element, key, get(value));
  }
};
const setStylesStatic = (element, object, objectPrev, stack) => {
  if (isString(object)) {
    element.setAttribute("style", object);
  } else {
    if (objectPrev) {
      if (isString(objectPrev)) {
        if (objectPrev) {
          element.style.cssText = "";
        }
      } else {
        objectPrev = store.unwrap(objectPrev);
        for (const key in objectPrev) {
          if (object && key in object) continue;
          setStyleStatic(element, key, null);
        }
      }
    }
    if (isStore(object)) {
      for (const key in object) {
        const fn = untrack(() => isFunction(object[key]) ? object[key] : object[SYMBOL_STORE_OBSERVABLE](key));
        setStyle(element, key, fn, stack);
      }
    } else {
      for (const key in object) {
        setStyle(element, key, object[key], stack);
      }
    }
  }
};
const setStyles = (element, object, stack) => {
  if (isFunction(object) || isArray(object)) {
    let objectPrev;
    useRenderEffect((stack2) => {
      const objectNext = resolveStyle(object);
      setStylesStatic(element, objectNext, objectPrev, stack2);
      objectPrev = objectNext;
    }, stack);
  } else {
    setStylesStatic(element, get(object), null, stack);
  }
};
const setTemplateAccessor = (element, key, value) => {
  if (key === "children") {
    const placeholder = createText("");
    element.insertBefore(placeholder, null);
    value(element, "setChildReplacement", void 0, placeholder);
  } else if (key === "ref") {
    value(element, "setRef");
  } else if (key === "style") {
    value(element, "setStyles");
  } else if (key === "class" || key === "className") {
    if (!isSVG(element)) {
      element.className = "";
    }
    value(element, "setClasses");
  } else if (key === "dangerouslySetInnerHTML") {
    value(element, "setHTML");
  } else if (key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110) {
    value(element, "setEvent", key.toLowerCase());
  } else if (key.charCodeAt(0) === 117 && key.charCodeAt(3) === 58) {
    value(element, "setDirective", key.slice(4));
  } else if (key === "innerHTML" || key === "outerHTML" || key === "textContent" || key === "className") ;
  else if (key in element && !isSVG(element)) {
    value(element, "setProperty", key);
  } else {
    element.setAttribute(key, "");
    value(element, "setAttribute", key);
  }
};
const setProp = (element, key, value, stack) => {
  if (element instanceof Comment || element instanceof Text) {
    if (key === "ref")
      setRef(element, value);
    else if (key in element)
      setProperty(element, key, value, stack);
  } else {
    if (value === void 0) return;
    if (isTemplateAccessor(value)) {
      setTemplateAccessor(element, key, value);
    } else if (key === "children") {
      setChild(element, value, FragmentUtils.make(), stack);
    } else if (key === "ref") {
      setRef(element, value);
    } else if (key === "style") {
      setStyles(element, value, stack);
    } else if (key === "class" || key === "className") {
      setClasses(element, value, stack);
    } else if (key === "dangerouslySetInnerHTML") {
      setHTML(element, value, stack);
    } else if (key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110) {
      setEvent(element, key.toLowerCase(), value);
    } else if (key.charCodeAt(0) === 117 && key.charCodeAt(3) === 58) {
      setDirective(element, key.slice(4), value);
    } else if (key === "innerHTML" || key === "outerHTML" || key === "textContent" || key === "className") ;
    else if (key in element && !isSVG(element)) {
      setProperty(element, key, value, stack);
    } else {
      setAttribute(element, key, value, stack);
    }
  }
};
const setProps = (element, object, stack) => {
  for (const key in object) {
    setProp(element, key, object[key], stack);
  }
};
const wrapJsx = (props) => {
  if (props[SYMBOL_JSX]) return props;
  props[SYMBOL_JSX] = true;
  return props;
};
const isJsx = (props) => !!props[SYMBOL_JSX];
function getProps(component, props) {
  var _a2;
  if (typeof component === "string") {
    const ce = customElements.get(component);
    if (!!ce) {
      const defaultPropsFn = (_a2 = ce.__component__) == null ? void 0 : _a2[SYMBOL_DEFAULT];
      if (!defaultPropsFn) {
        console.error(`Component ${component} is missing default props. Please use the 'defaults' helper function to provide default props.`);
      }
      if (!props) props = defaultPropsFn() ?? {};
    }
  }
  if (!props) props = {};
  return wrapJsx(props);
}
function jsx(component, props, ...children) {
  if (typeof children === "string")
    return wrapCloneElement(createElement(component, props ?? {}, children), component, props);
  props = getProps(component, props);
  if (typeof children === "string")
    Object.assign(props, { children });
  return wrapCloneElement(createElement(component, props, props == null ? void 0 : props.key), component, props);
}
const createElement = (component, _props, ..._children) => {
  const children = _children.length > 1 ? _children : _children.length > 0 ? _children[0] : void 0;
  const hasChildren = !isVoidChild(children);
  const { ...rest } = _props ?? {};
  if (hasChildren && isObject$2(_props) && "children" in _props) {
    throw new Error('Providing "children" both as a prop and as rest arguments is forbidden');
  }
  if (isFunction(component)) {
    const props = hasChildren ? Object.assign(_props, { children }) : _props;
    return wrapElement(() => {
      return untrack(() => isClass(component) ? new component(props) : component.call(component, props));
    });
  } else if (isString(component)) {
    const isSVG2 = isSVGElement(component);
    const isComment = component === "comment";
    const isText = component === "text";
    const createNode = isSVG2 ? createSVGNode : createHTMLNode;
    const create = isComment ? () => createComment(_props.data ?? "") : isText ? () => createText(_props.data ?? "") : createNode;
    return wrapElement(() => {
      const ce = customElements.get(component);
      const child = !!ce ? new ce(_props) : create(component);
      if (isSVG2) child["isSVG"] = true;
      const stack = new Stack();
      untrack(() => {
        if (_props) {
          if (!!ce) {
            const { children: children2, ...np } = _props;
            setProps(child, np, stack);
          } else
            setProps(child, _props, stack);
        }
      });
      return child;
    });
  } else if (isNode(component)) {
    return wrapElement(() => component);
  } else {
    throw new Error("Invalid component");
  }
};
class Root extends Owner {
  /* CONSTRUCTOR */
  constructor(register2) {
    super();
    this.parent = OWNER;
    this.context = OWNER.context;
    if (register2) {
      const suspense = this.get(SYMBOL_SUSPENSE$1);
      if (suspense) {
        this.registered = true;
        lazySetAdd(this.parent, "roots", this);
      }
    }
  }
  /* API */
  dispose(deep) {
    if (this.registered) {
      lazySetDelete(this.parent, "roots", this);
    }
    super.dispose(deep);
  }
  wrap(fn, owner, observer, stack) {
    const dispose = (disposeStack) => this.dispose(true);
    const wrapper = (callStack2) => fn(callStack2, dispose);
    return super.wrap(wrapper, this, void 0, stack);
  }
}
const root = (fn) => {
  const stack = callStack();
  return new Root(true).wrap(fn, void 0, void 0, stack);
};
frozen(-1);
frozen(-1);
function observable(value, options2) {
  const stack = callStack();
  return writable(new Observable(value, options2), stack);
}
const isObservableWritable = (value) => {
  return isFunction$1(value) && SYMBOL_OBSERVABLE_WRITABLE in value;
};
let cachedConstructedSheets = null;
let stylesheetObserver = null;
function convertAllDocumentStylesToConstructed() {
  if (cachedConstructedSheets) {
    return cachedConstructedSheets;
  }
  const constructedSheets = [];
  for (let i = 0; i < document.styleSheets.length; i++) {
    const sheet = document.styleSheets[i];
    try {
      const newSheet = new CSSStyleSheet();
      let allRules = "";
      for (let j = 0; j < sheet.cssRules.length; j++) {
        const rule = sheet.cssRules[j];
        allRules += rule.cssText;
      }
      newSheet.replaceSync(allRules);
      constructedSheets.push(newSheet);
    } catch (e) {
      console.warn("Could not copy stylesheet:", e);
    }
  }
  cachedConstructedSheets = constructedSheets;
  return constructedSheets;
}
function observeStylesheetChanges() {
  if (stylesheetObserver) {
    return;
  }
  stylesheetObserver = new MutationObserver(() => {
    cachedConstructedSheets = null;
  });
  stylesheetObserver.observe(document.head, {
    childList: true,
    subtree: true
  });
  stylesheetObserver.observe(document, {
    childList: true,
    subtree: true
  });
}
function mv(target2, source) {
  const targetValue = target2;
  const sourceValue = source;
  if (typeof targetValue === "string" && typeof sourceValue === "string")
    return `${targetValue} ${sourceValue}`.trim();
  else if (typeof targetValue === "object" && typeof sourceValue === "object")
    return { ...targetValue, ...sourceValue };
  return source;
}
const set = (target2, source, merge2) => {
  if (merge2)
    target2(mv(get(target2), get(source)));
  else
    target2(get(source));
};
const isObject = (obj) => {
  if (obj == void 0) return false;
  if (obj.constructor.name == "Object") {
    return true;
  } else {
    return false;
  }
};
const assign = (target2, source, options2) => {
  if (!source) return target2;
  const { condition: method = "all", copyByRef = true, keepTargetNoObservable = false, track = false, merge: merge2 = [], copyOptions = false } = options2 ?? {};
  const m = merge2.reduce((acc, item) => (acc[item] = true, acc), {});
  const keys = (() => {
    switch (method) {
      case "new":
        return Object.keys(source).filter((key) => !(key in target2));
      case "old":
        return Object.keys(target2).filter((key) => key in source);
      case "empty":
        return Object.keys(source).filter((key) => {
          const targetValue = target2[key];
          const sourceValue = source[key];
          const isTargetEmpty = targetValue === void 0 || targetValue === null || targetValue === 0 || isNaN(targetValue) || targetValue === "" || isArray(targetValue) && targetValue.length === 0;
          const isSourceNonEmpty = !(sourceValue === void 0 || sourceValue === null || sourceValue === 0 || isNaN(sourceValue) || sourceValue === "" || isArray(sourceValue) && sourceValue.length === 0);
          return isTargetEmpty && isSourceNonEmpty;
        });
      default:
        return Object.keys(source);
    }
  })();
  keys.forEach((key) => {
    if (copyByRef) {
      if (isObservable(target2[key])) {
        set(target2[key], source[key], m[key]);
        if (track && isObservable(source[key]))
          effect(() => {
            set(target2[key], source[key], m[key]);
          });
      } else {
        const temp = get(target2[key]);
        target2[key] = isObservable(source[key]) || isFunction(source[key]) ? source[key] : observable(source[key]);
        if (m[key])
          target2[key](mv(temp, get(source[key])));
      }
    } else {
      if (typeof get(source[key]) === "object" && isObject(get(source[key]))) {
        if (isObservable(target2[key])) {
          if (typeof get(target2[key]) === "object")
            assign(get(target2[key]), get(source[key]), options2);
          else {
            target2[key](assign({}, get(source[key]), options2));
            if (track && isObservable(source[key]))
              effect(() => {
                target2[key](assign({}, get(source[key]), options2));
              });
          }
        } else {
          const temp = target2[key];
          target2[key] = keepTargetNoObservable ? assign(m[key] ? temp : {}, get(source[key]), options2) : observable(assign(m[key] ? temp : {}, get(source[key]), options2));
          if (track && isObservable(target2[key]) && isObservable(source[key]))
            effect(() => {
              target2[key](assign(m[key] ? temp : {}, get(source[key]), options2));
            });
        }
      } else {
        if (isObservable(target2[key])) {
          set(target2[key], source[key], m[key]);
          const temp = get(target2[key]);
          if (track && isObservable(source[key]))
            effect(() => target2[key](m[key] ? mv(temp, get(source[key])) : get(source[key])));
        } else {
          const temp = target2[key];
          target2[key] = keepTargetNoObservable ? source[key] : target2[key] = isObservable(source[key]) || isFunction(source[key]) ? source[key] : observable(source[key]);
          if (m[key])
            target2[key](mv(temp, get(source[key])));
          if (track && isObservable(target2[key]) && isObservable(source[key])) {
            if (target2[key] !== source[key])
              effect(() => target2[key](m[key] ? mv(temp, get(source[key])) : get(source[key])));
          }
        }
      }
    }
  });
  return target2;
};
const isJsxProp = (props) => props && props[SYMBOL_JSX];
const make = (obj, options2 = { inplace: false, convertFunction: false }) => {
  const { inplace = false, convertFunction = false } = options2;
  const o = inplace ? obj : { ...obj };
  Object.keys(o).forEach((k) => {
    if (isObservable(o[k])) return;
    if (typeof o[k] === "function" && !convertFunction) return;
    if (convertFunction || typeof o[k] !== "function") {
      o[k] = observable(o[k]);
    }
  });
  return o;
};
const merge = (target2, source) => {
  return assign(target2, source, { condition: "new" });
};
const defaults = (defs, component) => {
  const defFactory = () => {
    const d = defs();
    if (d.children !== void 0 && !isObservable(d.children))
      d.children = observable(d.children);
    if (!d.children)
      d.children = observable();
    return d;
  };
  const compFactory = Object.assign(
    (props) => component(isJsxProp(props) ? merge(make(props, { inplace: true, convertFunction: false }), defFactory()) : props),
    {
      [SYMBOL_DEFAULT]: defFactory
    }
  );
  return compFactory;
};
observeStylesheetChanges();
const setObservableValue = (obj, key, value) => {
  if (isObservable(obj[key])) {
    if (!isObservableWritable(obj[key])) return;
    const observable2 = obj[key];
    const options2 = observable2[SYMBOL_OBSERVABLE_WRITABLE].options;
    const { type, fromHtml } = options2 ?? {};
    if (type) {
      switch (type) {
        case "number":
          obj[key](fromHtml ? fromHtml(value) : Number(value));
          break;
        case "boolean":
          if (fromHtml) {
            obj[key](fromHtml(value));
          } else {
            const lowerValue = value == null ? void 0 : value.toLowerCase();
            obj[key](lowerValue === "true" || lowerValue === "1" || lowerValue === "");
          }
          break;
        case "bigint":
          if (fromHtml) {
            obj[key](fromHtml(value));
          } else {
            try {
              obj[key](BigInt(value));
            } catch (e) {
              obj[key](value);
            }
          }
          break;
        case "object":
          if (fromHtml) {
            obj[key](fromHtml(value));
          } else {
            try {
              obj[key](JSON.parse(value));
            } catch (e) {
              obj[key](value);
            }
          }
          break;
        case "function":
          obj[key](fromHtml ? fromHtml(value) : value);
          break;
        case "symbol":
          obj[key](fromHtml ? fromHtml(value) : Symbol(value));
          break;
        case "undefined":
          obj[key](fromHtml ? fromHtml(value) : void 0);
          break;
        default:
          obj[key](fromHtml ? fromHtml(value) : value);
          break;
      }
    } else {
      obj[key](fromHtml ? fromHtml(value) : value);
    }
  } else {
    obj[key] = value;
  }
};
const setNestedProperty = (obj, path, value) => {
  if (path.startsWith("style.")) {
    const styleProperty = kebabToCamelCase(path.slice(6));
    if (obj.style) {
      obj.style[styleProperty] = value;
    }
    return;
  }
  if (path.includes(".")) {
    const keys = path.split(".").map((key) => kebabToCamelCase(key));
    const lastKey = keys.pop();
    let target2 = obj;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (i === 0 && !(key in target2)) {
        if (!target2.props) {
          target2.props = {};
        }
        if (!(key in target2.props) || typeof target2.props[key] !== "object" || target2.props[key] === null) {
          target2.props[key] = {};
        }
        target2 = target2.props[key];
      } else if (!(key in target2) || typeof target2[key] !== "object" || target2[key] === null) {
        target2[key] = {};
        target2 = target2[key];
      } else {
        target2 = target2[key];
      }
    }
    if (lastKey) {
      setObservableValue(target2, lastKey, value);
    }
    return;
  }
  setObservableValue(obj, kebabToCamelCase(path), value);
};
const customElement = (tagName, component) => {
  var _a2;
  const defaultPropsFn = component[SYMBOL_DEFAULT];
  if (!defaultPropsFn) {
    console.error(`Component ${tagName} is missing default props. Please use the 'defaults' helper function to provide default props.`);
  }
  const C = (_a2 = class extends HTMLElement {
    constructor(props) {
      super();
      this.childs = [];
      this.props = !!props ? props : defaultPropsFn() || {};
      C.observedAttributes = Object.keys(this.props);
      if (!isJsx(this.props)) {
        const shadowRoot = this.attachShadow({ mode: "open", serializable: true });
        if (!(get(this.props.children) instanceof HTMLSlotElement)) {
          this.slots = document.createElement("slot");
          this.props.children(this.slots);
        }
        const ignoreStyle = this.props.ignoreStyle === true;
        if (!ignoreStyle) {
          const allSheets = convertAllDocumentStylesToConstructed();
          shadowRoot.adoptedStyleSheets = allSheets;
        }
        setChild(shadowRoot, createElement(component, this.props), FragmentUtils.make(), callStack());
      } else {
        setChild(this, createElement(component, this.props), FragmentUtils.make(), callStack());
      }
      if (!this.propDict) {
        this.propDict = {};
        Object.keys(this.props).forEach((k) => {
          const c = camelToKebabCase(k);
          this.propDict[c] = k;
          this.propDict[k] = c;
        });
      }
    }
    /**
     * Called when the element is added to the document
     * 
     * Sets up attribute observation and initializes the element.
     */
    connectedCallback() {
      const { observedAttributes } = C;
      const { props: p } = this;
      const aKeys = Object.keys(p).filter((k) => (
        /* !isPureFunction(p[k]) && !isObject(p[k]) && */
        k !== "children" && isObservable(p[k])
      ));
      const rKeys = Object.keys(p).filter((k) => isPureFunction(p[k]) || isObject$2(p[k]));
      rKeys.forEach((k) => this.removeAttribute(k));
      for (const k of aKeys)
        if (!this.attributes[this.propDict[k]] || isJsx(p))
          setProp(this, this.propDict[k], p[k], callStack());
      for (const attr of this.attributes)
        this.attributeChangedCallback1(attr.name, void 0, attr.value);
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((m) => {
          if (m.type === "attributes") {
            const name = m.attributeName;
            const newValue = this.getAttribute(name);
            const oldValue = m.oldValue;
            this.attributeChangedCallback1(name, oldValue, newValue);
          }
        });
      });
      observer.observe(this, { attributes: true, attributeOldValue: true });
    }
    /**
     * Called when the element is removed from the document
     * 
     * Cleans up observers and resources.
     */
    disconnectedCallback() {
    }
    /**
     * Called when an observed attribute changes
     * 
     * Updates the corresponding prop and handles nested properties.
     * 
     * @param name - The name of the changed attribute
     * @param oldValue - The previous value of the attribute
     * @param newValue - The new value of the attribute
     */
    attributeChangedCallback1(name, oldValue, newValue) {
      if (oldValue === newValue) return;
      if (newValue === "[object Object]") return;
      const { props } = this;
      if (name.includes("$") || name.includes(".")) {
        const normalizedPath = normalizePropertyPath(name);
        setNestedProperty(this, normalizedPath, newValue);
        const propName = kebabToCamelCase(name.replace(/\$/g, ".").replace(/\./g, "."));
        setObservableValue(props, propName, newValue);
      } else {
        const propName = kebabToCamelCase(name);
        setObservableValue(this.props, propName, newValue);
      }
    }
  }, _a2.__component__ = component, _a2.observedAttributes = [], _a2);
  const ec = customElements.get(tagName);
  if (!!ec)
    console.warn(`Element ${tagName} already exists. (ignore this in dev env), use ec.__component__ to find target component`);
  else
    customElements.define(tagName, C);
  return C;
};
const ContextProvider = defaults(
  () => ({
    value: observable(void 0),
    children: observable(void 0),
    symbol: observable(void 0)
  }),
  ({ children }) => {
    return children;
  }
);
customElement("context-provider", ContextProvider);
var n = function(t2, s, r, e) {
  var u;
  s[0] = 0;
  for (var h = 1; h < s.length; h++) {
    var p = s[h++], a = s[h] ? (s[0] |= p ? 1 : 2, r[s[h++]]) : s[++h];
    3 === p ? e[0] = a : 4 === p ? e[1] = Object.assign(e[1] || {}, a) : 5 === p ? (e[1] = e[1] || {})[s[++h]] = a : 6 === p ? e[1][s[++h]] += a + "" : p ? (u = t2.apply(a, n(t2, a, r, ["", null])), e.push(u), a[0] ? s[0] |= 2 : (s[h - 2] = 0, s[h] = u)) : e.push(a);
  }
  return e;
}, t = /* @__PURE__ */ new Map();
function htm(s) {
  var r = t.get(this);
  return r || (r = /* @__PURE__ */ new Map(), t.set(this, r)), (r = n(this, r.get(s) || (r.set(s, r = (function(n2) {
    for (var t2, s2, r2 = 1, e = "", u = "", h = [0], p = function(n3) {
      1 === r2 && (n3 || (e = e.replace(/^\s*\n\s*|\s*\n\s*$/g, ""))) ? h.push(0, n3, e) : 3 === r2 && (n3 || e) ? (h.push(3, n3, e), r2 = 2) : 2 === r2 && "..." === e && n3 ? h.push(4, n3, 0) : 2 === r2 && e && !n3 ? h.push(5, 0, true, e) : r2 >= 5 && ((e || !n3 && 5 === r2) && (h.push(r2, 0, e, s2), r2 = 6), n3 && (h.push(r2, n3, 0, s2), r2 = 6)), e = "";
    }, a = 0; a < n2.length; a++) {
      a && (1 === r2 && p(), p(a));
      for (var l = 0; l < n2[a].length; l++) t2 = n2[a][l], 1 === r2 ? "<" === t2 ? (p(), h = [h], r2 = 3) : e += t2 : 4 === r2 ? "--" === e && ">" === t2 ? (r2 = 1, e = "") : e = t2 + e[0] : u ? t2 === u ? u = "" : e += t2 : '"' === t2 || "'" === t2 ? u = t2 : ">" === t2 ? (p(), r2 = 1) : r2 && ("=" === t2 ? (r2 = 5, s2 = e, e = "") : "/" === t2 && (r2 < 5 || ">" === n2[a][l + 1]) ? (p(), 3 === r2 && (h = h[0]), r2 = h, (h = h[0]).push(2, 0, r2), r2 = 0) : " " === t2 || "	" === t2 || "\n" === t2 || "\r" === t2 ? (p(), r2 = 2) : e += t2), 3 === r2 && "!--" === e && (r2 = 4, h = h[0]);
    }
    return p(), h;
  })(s)), r), arguments, [])).length > 1 ? r : r[0];
}
const render = (child, parent) => {
  if (!parent || !(parent instanceof HTMLElement || parent instanceof ShadowRoot)) throw new Error("Invalid parent node");
  parent.textContent = "";
  return root((stack, dispose) => {
    setChild(parent, child, FragmentUtils.make(), stack);
    return () => {
      dispose(stack);
      parent.textContent = "";
    };
  });
};
var _a, _b;
!!((_b = (_a = globalThis.CDATASection) == null ? void 0 : _a.toString) == null ? void 0 : _b.call(_a).match(/^\s*function\s+CDATASection\s*\(\s*\)\s*\{\s*\[native code\]\s*\}\s*$/));
const registry = {};
const h2 = (type, props, ...children) => createElement(registry[type] || type, props, ...children);
const register = (components) => void assign$1(registry, components);
assign$1(htm.bind(h2), { register });
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var prism = { exports: {} };
var hasRequiredPrism;
function requirePrism() {
  if (hasRequiredPrism) return prism.exports;
  hasRequiredPrism = 1;
  (function(module) {
    var _self = typeof window !== "undefined" ? window : typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope ? self : {};
    /**
     * Prism: Lightweight, robust, elegant syntax highlighting
     *
     * @license MIT <https://opensource.org/licenses/MIT>
     * @author Lea Verou <https://lea.verou.me>
     * @namespace
     * @public
     */
    var Prism2 = (function(_self2) {
      var lang = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i;
      var uniqueId = 0;
      var plainTextGrammar = {};
      var _ = {
        /**
         * By default, Prism will attempt to highlight all code elements (by calling {@link Prism.highlightAll}) on the
         * current page after the page finished loading. This might be a problem if e.g. you wanted to asynchronously load
         * additional languages or plugins yourself.
         *
         * By setting this value to `true`, Prism will not automatically highlight all code elements on the page.
         *
         * You obviously have to change this value before the automatic highlighting started. To do this, you can add an
         * empty Prism object into the global scope before loading the Prism script like this:
         *
         * ```js
         * window.Prism = window.Prism || {};
         * Prism.manual = true;
         * // add a new <script> to load Prism's script
         * ```
         *
         * @default false
         * @type {boolean}
         * @memberof Prism
         * @public
         */
        manual: _self2.Prism && _self2.Prism.manual,
        /**
         * By default, if Prism is in a web worker, it assumes that it is in a worker it created itself, so it uses
         * `addEventListener` to communicate with its parent instance. However, if you're using Prism manually in your
         * own worker, you don't want it to do this.
         *
         * By setting this value to `true`, Prism will not add its own listeners to the worker.
         *
         * You obviously have to change this value before Prism executes. To do this, you can add an
         * empty Prism object into the global scope before loading the Prism script like this:
         *
         * ```js
         * window.Prism = window.Prism || {};
         * Prism.disableWorkerMessageHandler = true;
         * // Load Prism's script
         * ```
         *
         * @default false
         * @type {boolean}
         * @memberof Prism
         * @public
         */
        disableWorkerMessageHandler: _self2.Prism && _self2.Prism.disableWorkerMessageHandler,
        /**
         * A namespace for utility methods.
         *
         * All function in this namespace that are not explicitly marked as _public_ are for __internal use only__ and may
         * change or disappear at any time.
         *
         * @namespace
         * @memberof Prism
         */
        util: {
          encode: function encode(tokens) {
            if (tokens instanceof Token) {
              return new Token(tokens.type, encode(tokens.content), tokens.alias);
            } else if (Array.isArray(tokens)) {
              return tokens.map(encode);
            } else {
              return tokens.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ");
            }
          },
          /**
           * Returns the name of the type of the given value.
           *
           * @param {any} o
           * @returns {string}
           * @example
           * type(null)      === 'Null'
           * type(undefined) === 'Undefined'
           * type(123)       === 'Number'
           * type('foo')     === 'String'
           * type(true)      === 'Boolean'
           * type([1, 2])    === 'Array'
           * type({})        === 'Object'
           * type(String)    === 'Function'
           * type(/abc+/)    === 'RegExp'
           */
          type: function(o) {
            return Object.prototype.toString.call(o).slice(8, -1);
          },
          /**
           * Returns a unique number for the given object. Later calls will still return the same number.
           *
           * @param {Object} obj
           * @returns {number}
           */
          objId: function(obj) {
            if (!obj["__id"]) {
              Object.defineProperty(obj, "__id", { value: ++uniqueId });
            }
            return obj["__id"];
          },
          /**
           * Creates a deep clone of the given object.
           *
           * The main intended use of this function is to clone language definitions.
           *
           * @param {T} o
           * @param {Record<number, any>} [visited]
           * @returns {T}
           * @template T
           */
          clone: function deepClone(o, visited) {
            visited = visited || {};
            var clone;
            var id;
            switch (_.util.type(o)) {
              case "Object":
                id = _.util.objId(o);
                if (visited[id]) {
                  return visited[id];
                }
                clone = /** @type {Record<string, any>} */
                {};
                visited[id] = clone;
                for (var key in o) {
                  if (o.hasOwnProperty(key)) {
                    clone[key] = deepClone(o[key], visited);
                  }
                }
                return (
                  /** @type {any} */
                  clone
                );
              case "Array":
                id = _.util.objId(o);
                if (visited[id]) {
                  return visited[id];
                }
                clone = [];
                visited[id] = clone;
                /** @type {Array} */
                /** @type {any} */
                o.forEach(function(v, i) {
                  clone[i] = deepClone(v, visited);
                });
                return (
                  /** @type {any} */
                  clone
                );
              default:
                return o;
            }
          },
          /**
           * Returns the Prism language of the given element set by a `language-xxxx` or `lang-xxxx` class.
           *
           * If no language is set for the element or the element is `null` or `undefined`, `none` will be returned.
           *
           * @param {Element} element
           * @returns {string}
           */
          getLanguage: function(element) {
            while (element) {
              var m = lang.exec(element.className);
              if (m) {
                return m[1].toLowerCase();
              }
              element = element.parentElement;
            }
            return "none";
          },
          /**
           * Sets the Prism `language-xxxx` class of the given element.
           *
           * @param {Element} element
           * @param {string} language
           * @returns {void}
           */
          setLanguage: function(element, language) {
            element.className = element.className.replace(RegExp(lang, "gi"), "");
            element.classList.add("language-" + language);
          },
          /**
           * Returns the script element that is currently executing.
           *
           * This does __not__ work for line script element.
           *
           * @returns {HTMLScriptElement | null}
           */
          currentScript: function() {
            if (typeof document === "undefined") {
              return null;
            }
            if (document.currentScript && document.currentScript.tagName === "SCRIPT" && 1 < 2) {
              return (
                /** @type {any} */
                document.currentScript
              );
            }
            try {
              throw new Error();
            } catch (err) {
              var src = (/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(err.stack) || [])[1];
              if (src) {
                var scripts = document.getElementsByTagName("script");
                for (var i in scripts) {
                  if (scripts[i].src == src) {
                    return scripts[i];
                  }
                }
              }
              return null;
            }
          },
          /**
           * Returns whether a given class is active for `element`.
           *
           * The class can be activated if `element` or one of its ancestors has the given class and it can be deactivated
           * if `element` or one of its ancestors has the negated version of the given class. The _negated version_ of the
           * given class is just the given class with a `no-` prefix.
           *
           * Whether the class is active is determined by the closest ancestor of `element` (where `element` itself is
           * closest ancestor) that has the given class or the negated version of it. If neither `element` nor any of its
           * ancestors have the given class or the negated version of it, then the default activation will be returned.
           *
           * In the paradoxical situation where the closest ancestor contains __both__ the given class and the negated
           * version of it, the class is considered active.
           *
           * @param {Element} element
           * @param {string} className
           * @param {boolean} [defaultActivation=false]
           * @returns {boolean}
           */
          isActive: function(element, className, defaultActivation) {
            var no = "no-" + className;
            while (element) {
              var classList = element.classList;
              if (classList.contains(className)) {
                return true;
              }
              if (classList.contains(no)) {
                return false;
              }
              element = element.parentElement;
            }
            return !!defaultActivation;
          }
        },
        /**
         * This namespace contains all currently loaded languages and the some helper functions to create and modify languages.
         *
         * @namespace
         * @memberof Prism
         * @public
         */
        languages: {
          /**
           * The grammar for plain, unformatted text.
           */
          plain: plainTextGrammar,
          plaintext: plainTextGrammar,
          text: plainTextGrammar,
          txt: plainTextGrammar,
          /**
           * Creates a deep copy of the language with the given id and appends the given tokens.
           *
           * If a token in `redef` also appears in the copied language, then the existing token in the copied language
           * will be overwritten at its original position.
           *
           * ## Best practices
           *
           * Since the position of overwriting tokens (token in `redef` that overwrite tokens in the copied language)
           * doesn't matter, they can technically be in any order. However, this can be confusing to others that trying to
           * understand the language definition because, normally, the order of tokens matters in Prism grammars.
           *
           * Therefore, it is encouraged to order overwriting tokens according to the positions of the overwritten tokens.
           * Furthermore, all non-overwriting tokens should be placed after the overwriting ones.
           *
           * @param {string} id The id of the language to extend. This has to be a key in `Prism.languages`.
           * @param {Grammar} redef The new tokens to append.
           * @returns {Grammar} The new language created.
           * @public
           * @example
           * Prism.languages['css-with-colors'] = Prism.languages.extend('css', {
           *     // Prism.languages.css already has a 'comment' token, so this token will overwrite CSS' 'comment' token
           *     // at its original position
           *     'comment': { ... },
           *     // CSS doesn't have a 'color' token, so this token will be appended
           *     'color': /\b(?:red|green|blue)\b/
           * });
           */
          extend: function(id, redef) {
            var lang2 = _.util.clone(_.languages[id]);
            for (var key in redef) {
              lang2[key] = redef[key];
            }
            return lang2;
          },
          /**
           * Inserts tokens _before_ another token in a language definition or any other grammar.
           *
           * ## Usage
           *
           * This helper method makes it easy to modify existing languages. For example, the CSS language definition
           * not only defines CSS highlighting for CSS documents, but also needs to define highlighting for CSS embedded
           * in HTML through `<style>` elements. To do this, it needs to modify `Prism.languages.markup` and add the
           * appropriate tokens. However, `Prism.languages.markup` is a regular JavaScript object literal, so if you do
           * this:
           *
           * ```js
           * Prism.languages.markup.style = {
           *     // token
           * };
           * ```
           *
           * then the `style` token will be added (and processed) at the end. `insertBefore` allows you to insert tokens
           * before existing tokens. For the CSS example above, you would use it like this:
           *
           * ```js
           * Prism.languages.insertBefore('markup', 'cdata', {
           *     'style': {
           *         // token
           *     }
           * });
           * ```
           *
           * ## Special cases
           *
           * If the grammars of `inside` and `insert` have tokens with the same name, the tokens in `inside`'s grammar
           * will be ignored.
           *
           * This behavior can be used to insert tokens after `before`:
           *
           * ```js
           * Prism.languages.insertBefore('markup', 'comment', {
           *     'comment': Prism.languages.markup.comment,
           *     // tokens after 'comment'
           * });
           * ```
           *
           * ## Limitations
           *
           * The main problem `insertBefore` has to solve is iteration order. Since ES2015, the iteration order for object
           * properties is guaranteed to be the insertion order (except for integer keys) but some browsers behave
           * differently when keys are deleted and re-inserted. So `insertBefore` can't be implemented by temporarily
           * deleting properties which is necessary to insert at arbitrary positions.
           *
           * To solve this problem, `insertBefore` doesn't actually insert the given tokens into the target object.
           * Instead, it will create a new object and replace all references to the target object with the new one. This
           * can be done without temporarily deleting properties, so the iteration order is well-defined.
           *
           * However, only references that can be reached from `Prism.languages` or `insert` will be replaced. I.e. if
           * you hold the target object in a variable, then the value of the variable will not change.
           *
           * ```js
           * var oldMarkup = Prism.languages.markup;
           * var newMarkup = Prism.languages.insertBefore('markup', 'comment', { ... });
           *
           * assert(oldMarkup !== Prism.languages.markup);
           * assert(newMarkup === Prism.languages.markup);
           * ```
           *
           * @param {string} inside The property of `root` (e.g. a language id in `Prism.languages`) that contains the
           * object to be modified.
           * @param {string} before The key to insert before.
           * @param {Grammar} insert An object containing the key-value pairs to be inserted.
           * @param {Object<string, any>} [root] The object containing `inside`, i.e. the object that contains the
           * object to be modified.
           *
           * Defaults to `Prism.languages`.
           * @returns {Grammar} The new grammar object.
           * @public
           */
          insertBefore: function(inside, before, insert, root2) {
            root2 = root2 || /** @type {any} */
            _.languages;
            var grammar = root2[inside];
            var ret = {};
            for (var token in grammar) {
              if (grammar.hasOwnProperty(token)) {
                if (token == before) {
                  for (var newToken in insert) {
                    if (insert.hasOwnProperty(newToken)) {
                      ret[newToken] = insert[newToken];
                    }
                  }
                }
                if (!insert.hasOwnProperty(token)) {
                  ret[token] = grammar[token];
                }
              }
            }
            var old = root2[inside];
            root2[inside] = ret;
            _.languages.DFS(_.languages, function(key, value) {
              if (value === old && key != inside) {
                this[key] = ret;
              }
            });
            return ret;
          },
          // Traverse a language definition with Depth First Search
          DFS: function DFS(o, callback, type, visited) {
            visited = visited || {};
            var objId = _.util.objId;
            for (var i in o) {
              if (o.hasOwnProperty(i)) {
                callback.call(o, i, o[i], type || i);
                var property = o[i];
                var propertyType = _.util.type(property);
                if (propertyType === "Object" && !visited[objId(property)]) {
                  visited[objId(property)] = true;
                  DFS(property, callback, null, visited);
                } else if (propertyType === "Array" && !visited[objId(property)]) {
                  visited[objId(property)] = true;
                  DFS(property, callback, i, visited);
                }
              }
            }
          }
        },
        plugins: {},
        /**
         * This is the most high-level function in Prism’s API.
         * It fetches all the elements that have a `.language-xxxx` class and then calls {@link Prism.highlightElement} on
         * each one of them.
         *
         * This is equivalent to `Prism.highlightAllUnder(document, async, callback)`.
         *
         * @param {boolean} [async=false] Same as in {@link Prism.highlightAllUnder}.
         * @param {HighlightCallback} [callback] Same as in {@link Prism.highlightAllUnder}.
         * @memberof Prism
         * @public
         */
        highlightAll: function(async, callback) {
          _.highlightAllUnder(document, async, callback);
        },
        /**
         * Fetches all the descendants of `container` that have a `.language-xxxx` class and then calls
         * {@link Prism.highlightElement} on each one of them.
         *
         * The following hooks will be run:
         * 1. `before-highlightall`
         * 2. `before-all-elements-highlight`
         * 3. All hooks of {@link Prism.highlightElement} for each element.
         *
         * @param {ParentNode} container The root element, whose descendants that have a `.language-xxxx` class will be highlighted.
         * @param {boolean} [async=false] Whether each element is to be highlighted asynchronously using Web Workers.
         * @param {HighlightCallback} [callback] An optional callback to be invoked on each element after its highlighting is done.
         * @memberof Prism
         * @public
         */
        highlightAllUnder: function(container, async, callback) {
          var env = {
            callback,
            container,
            selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
          };
          _.hooks.run("before-highlightall", env);
          env.elements = Array.prototype.slice.apply(env.container.querySelectorAll(env.selector));
          _.hooks.run("before-all-elements-highlight", env);
          for (var i = 0, element; element = env.elements[i++]; ) {
            _.highlightElement(element, async === true, env.callback);
          }
        },
        /**
         * Highlights the code inside a single element.
         *
         * The following hooks will be run:
         * 1. `before-sanity-check`
         * 2. `before-highlight`
         * 3. All hooks of {@link Prism.highlight}. These hooks will be run by an asynchronous worker if `async` is `true`.
         * 4. `before-insert`
         * 5. `after-highlight`
         * 6. `complete`
         *
         * Some the above hooks will be skipped if the element doesn't contain any text or there is no grammar loaded for
         * the element's language.
         *
         * @param {Element} element The element containing the code.
         * It must have a class of `language-xxxx` to be processed, where `xxxx` is a valid language identifier.
         * @param {boolean} [async=false] Whether the element is to be highlighted asynchronously using Web Workers
         * to improve performance and avoid blocking the UI when highlighting very large chunks of code. This option is
         * [disabled by default](https://prismjs.com/faq.html#why-is-asynchronous-highlighting-disabled-by-default).
         *
         * Note: All language definitions required to highlight the code must be included in the main `prism.js` file for
         * asynchronous highlighting to work. You can build your own bundle on the
         * [Download page](https://prismjs.com/download.html).
         * @param {HighlightCallback} [callback] An optional callback to be invoked after the highlighting is done.
         * Mostly useful when `async` is `true`, since in that case, the highlighting is done asynchronously.
         * @memberof Prism
         * @public
         */
        highlightElement: function(element, async, callback) {
          var language = _.util.getLanguage(element);
          var grammar = _.languages[language];
          _.util.setLanguage(element, language);
          var parent = element.parentElement;
          if (parent && parent.nodeName.toLowerCase() === "pre") {
            _.util.setLanguage(parent, language);
          }
          var code = element.textContent;
          var env = {
            element,
            language,
            grammar,
            code
          };
          function insertHighlightedCode(highlightedCode) {
            env.highlightedCode = highlightedCode;
            _.hooks.run("before-insert", env);
            env.element.innerHTML = env.highlightedCode;
            _.hooks.run("after-highlight", env);
            _.hooks.run("complete", env);
            callback && callback.call(env.element);
          }
          _.hooks.run("before-sanity-check", env);
          parent = env.element.parentElement;
          if (parent && parent.nodeName.toLowerCase() === "pre" && !parent.hasAttribute("tabindex")) {
            parent.setAttribute("tabindex", "0");
          }
          if (!env.code) {
            _.hooks.run("complete", env);
            callback && callback.call(env.element);
            return;
          }
          _.hooks.run("before-highlight", env);
          if (!env.grammar) {
            insertHighlightedCode(_.util.encode(env.code));
            return;
          }
          if (async && _self2.Worker) {
            var worker = new Worker(_.filename);
            worker.onmessage = function(evt) {
              insertHighlightedCode(evt.data);
            };
            worker.postMessage(JSON.stringify({
              language: env.language,
              code: env.code,
              immediateClose: true
            }));
          } else {
            insertHighlightedCode(_.highlight(env.code, env.grammar, env.language));
          }
        },
        /**
         * Low-level function, only use if you know what you’re doing. It accepts a string of text as input
         * and the language definitions to use, and returns a string with the HTML produced.
         *
         * The following hooks will be run:
         * 1. `before-tokenize`
         * 2. `after-tokenize`
         * 3. `wrap`: On each {@link Token}.
         *
         * @param {string} text A string with the code to be highlighted.
         * @param {Grammar} grammar An object containing the tokens to use.
         *
         * Usually a language definition like `Prism.languages.markup`.
         * @param {string} language The name of the language definition passed to `grammar`.
         * @returns {string} The highlighted HTML.
         * @memberof Prism
         * @public
         * @example
         * Prism.highlight('var foo = true;', Prism.languages.javascript, 'javascript');
         */
        highlight: function(text, grammar, language) {
          var env = {
            code: text,
            grammar,
            language
          };
          _.hooks.run("before-tokenize", env);
          if (!env.grammar) {
            throw new Error('The language "' + env.language + '" has no grammar.');
          }
          env.tokens = _.tokenize(env.code, env.grammar);
          _.hooks.run("after-tokenize", env);
          return Token.stringify(_.util.encode(env.tokens), env.language);
        },
        /**
         * This is the heart of Prism, and the most low-level function you can use. It accepts a string of text as input
         * and the language definitions to use, and returns an array with the tokenized code.
         *
         * When the language definition includes nested tokens, the function is called recursively on each of these tokens.
         *
         * This method could be useful in other contexts as well, as a very crude parser.
         *
         * @param {string} text A string with the code to be highlighted.
         * @param {Grammar} grammar An object containing the tokens to use.
         *
         * Usually a language definition like `Prism.languages.markup`.
         * @returns {TokenStream} An array of strings and tokens, a token stream.
         * @memberof Prism
         * @public
         * @example
         * let code = `var foo = 0;`;
         * let tokens = Prism.tokenize(code, Prism.languages.javascript);
         * tokens.forEach(token => {
         *     if (token instanceof Prism.Token && token.type === 'number') {
         *         console.log(`Found numeric literal: ${token.content}`);
         *     }
         * });
         */
        tokenize: function(text, grammar) {
          var rest = grammar.rest;
          if (rest) {
            for (var token in rest) {
              grammar[token] = rest[token];
            }
            delete grammar.rest;
          }
          var tokenList = new LinkedList();
          addAfter(tokenList, tokenList.head, text);
          matchGrammar(text, tokenList, grammar, tokenList.head, 0);
          return toArray(tokenList);
        },
        /**
         * @namespace
         * @memberof Prism
         * @public
         */
        hooks: {
          all: {},
          /**
           * Adds the given callback to the list of callbacks for the given hook.
           *
           * The callback will be invoked when the hook it is registered for is run.
           * Hooks are usually directly run by a highlight function but you can also run hooks yourself.
           *
           * One callback function can be registered to multiple hooks and the same hook multiple times.
           *
           * @param {string} name The name of the hook.
           * @param {HookCallback} callback The callback function which is given environment variables.
           * @public
           */
          add: function(name, callback) {
            var hooks = _.hooks.all;
            hooks[name] = hooks[name] || [];
            hooks[name].push(callback);
          },
          /**
           * Runs a hook invoking all registered callbacks with the given environment variables.
           *
           * Callbacks will be invoked synchronously and in the order in which they were registered.
           *
           * @param {string} name The name of the hook.
           * @param {Object<string, any>} env The environment variables of the hook passed to all callbacks registered.
           * @public
           */
          run: function(name, env) {
            var callbacks = _.hooks.all[name];
            if (!callbacks || !callbacks.length) {
              return;
            }
            for (var i = 0, callback; callback = callbacks[i++]; ) {
              callback(env);
            }
          }
        },
        Token
      };
      _self2.Prism = _;
      function Token(type, content, alias, matchedStr) {
        this.type = type;
        this.content = content;
        this.alias = alias;
        this.length = (matchedStr || "").length | 0;
      }
      Token.stringify = function stringify(o, language) {
        if (typeof o == "string") {
          return o;
        }
        if (Array.isArray(o)) {
          var s = "";
          o.forEach(function(e) {
            s += stringify(e, language);
          });
          return s;
        }
        var env = {
          type: o.type,
          content: stringify(o.content, language),
          tag: "span",
          classes: ["token", o.type],
          attributes: {},
          language
        };
        var aliases = o.alias;
        if (aliases) {
          if (Array.isArray(aliases)) {
            Array.prototype.push.apply(env.classes, aliases);
          } else {
            env.classes.push(aliases);
          }
        }
        _.hooks.run("wrap", env);
        var attributes = "";
        for (var name in env.attributes) {
          attributes += " " + name + '="' + (env.attributes[name] || "").replace(/"/g, "&quot;") + '"';
        }
        return "<" + env.tag + ' class="' + env.classes.join(" ") + '"' + attributes + ">" + env.content + "</" + env.tag + ">";
      };
      function matchPattern(pattern, pos, text, lookbehind) {
        pattern.lastIndex = pos;
        var match = pattern.exec(text);
        if (match && lookbehind && match[1]) {
          var lookbehindLength = match[1].length;
          match.index += lookbehindLength;
          match[0] = match[0].slice(lookbehindLength);
        }
        return match;
      }
      function matchGrammar(text, tokenList, grammar, startNode, startPos, rematch) {
        for (var token in grammar) {
          if (!grammar.hasOwnProperty(token) || !grammar[token]) {
            continue;
          }
          var patterns = grammar[token];
          patterns = Array.isArray(patterns) ? patterns : [patterns];
          for (var j = 0; j < patterns.length; ++j) {
            if (rematch && rematch.cause == token + "," + j) {
              return;
            }
            var patternObj = patterns[j];
            var inside = patternObj.inside;
            var lookbehind = !!patternObj.lookbehind;
            var greedy = !!patternObj.greedy;
            var alias = patternObj.alias;
            if (greedy && !patternObj.pattern.global) {
              var flags = patternObj.pattern.toString().match(/[imsuy]*$/)[0];
              patternObj.pattern = RegExp(patternObj.pattern.source, flags + "g");
            }
            var pattern = patternObj.pattern || patternObj;
            for (var currentNode = startNode.next, pos = startPos; currentNode !== tokenList.tail; pos += currentNode.value.length, currentNode = currentNode.next) {
              if (rematch && pos >= rematch.reach) {
                break;
              }
              var str = currentNode.value;
              if (tokenList.length > text.length) {
                return;
              }
              if (str instanceof Token) {
                continue;
              }
              var removeCount = 1;
              var match;
              if (greedy) {
                match = matchPattern(pattern, pos, text, lookbehind);
                if (!match || match.index >= text.length) {
                  break;
                }
                var from = match.index;
                var to = match.index + match[0].length;
                var p = pos;
                p += currentNode.value.length;
                while (from >= p) {
                  currentNode = currentNode.next;
                  p += currentNode.value.length;
                }
                p -= currentNode.value.length;
                pos = p;
                if (currentNode.value instanceof Token) {
                  continue;
                }
                for (var k = currentNode; k !== tokenList.tail && (p < to || typeof k.value === "string"); k = k.next) {
                  removeCount++;
                  p += k.value.length;
                }
                removeCount--;
                str = text.slice(pos, p);
                match.index -= pos;
              } else {
                match = matchPattern(pattern, 0, str, lookbehind);
                if (!match) {
                  continue;
                }
              }
              var from = match.index;
              var matchStr = match[0];
              var before = str.slice(0, from);
              var after = str.slice(from + matchStr.length);
              var reach = pos + str.length;
              if (rematch && reach > rematch.reach) {
                rematch.reach = reach;
              }
              var removeFrom = currentNode.prev;
              if (before) {
                removeFrom = addAfter(tokenList, removeFrom, before);
                pos += before.length;
              }
              removeRange(tokenList, removeFrom, removeCount);
              var wrapped = new Token(token, inside ? _.tokenize(matchStr, inside) : matchStr, alias, matchStr);
              currentNode = addAfter(tokenList, removeFrom, wrapped);
              if (after) {
                addAfter(tokenList, currentNode, after);
              }
              if (removeCount > 1) {
                var nestedRematch = {
                  cause: token + "," + j,
                  reach
                };
                matchGrammar(text, tokenList, grammar, currentNode.prev, pos, nestedRematch);
                if (rematch && nestedRematch.reach > rematch.reach) {
                  rematch.reach = nestedRematch.reach;
                }
              }
            }
          }
        }
      }
      function LinkedList() {
        var head = { value: null, prev: null, next: null };
        var tail = { value: null, prev: head, next: null };
        head.next = tail;
        this.head = head;
        this.tail = tail;
        this.length = 0;
      }
      function addAfter(list, node, value) {
        var next = node.next;
        var newNode = { value, prev: node, next };
        node.next = newNode;
        next.prev = newNode;
        list.length++;
        return newNode;
      }
      function removeRange(list, node, count) {
        var next = node.next;
        for (var i = 0; i < count && next !== list.tail; i++) {
          next = next.next;
        }
        node.next = next;
        next.prev = node;
        list.length -= i;
      }
      function toArray(list) {
        var array = [];
        var node = list.head.next;
        while (node !== list.tail) {
          array.push(node.value);
          node = node.next;
        }
        return array;
      }
      if (!_self2.document) {
        if (!_self2.addEventListener) {
          return _;
        }
        if (!_.disableWorkerMessageHandler) {
          _self2.addEventListener("message", function(evt) {
            var message = JSON.parse(evt.data);
            var lang2 = message.language;
            var code = message.code;
            var immediateClose = message.immediateClose;
            _self2.postMessage(_.highlight(code, _.languages[lang2], lang2));
            if (immediateClose) {
              _self2.close();
            }
          }, false);
        }
        return _;
      }
      var script = _.util.currentScript();
      if (script) {
        _.filename = script.src;
        if (script.hasAttribute("data-manual")) {
          _.manual = true;
        }
      }
      function highlightAutomaticallyCallback() {
        if (!_.manual) {
          _.highlightAll();
        }
      }
      if (!_.manual) {
        var readyState = document.readyState;
        if (readyState === "loading" || readyState === "interactive" && script && script.defer) {
          document.addEventListener("DOMContentLoaded", highlightAutomaticallyCallback);
        } else {
          if (window.requestAnimationFrame) {
            window.requestAnimationFrame(highlightAutomaticallyCallback);
          } else {
            window.setTimeout(highlightAutomaticallyCallback, 16);
          }
        }
      }
      return _;
    })(_self);
    if (module.exports) {
      module.exports = Prism2;
    }
    if (typeof commonjsGlobal !== "undefined") {
      commonjsGlobal.Prism = Prism2;
    }
    Prism2.languages.markup = {
      "comment": {
        pattern: /<!--(?:(?!<!--)[\s\S])*?-->/,
        greedy: true
      },
      "prolog": {
        pattern: /<\?[\s\S]+?\?>/,
        greedy: true
      },
      "doctype": {
        // https://www.w3.org/TR/xml/#NT-doctypedecl
        pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
        greedy: true,
        inside: {
          "internal-subset": {
            pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/,
            lookbehind: true,
            greedy: true,
            inside: null
            // see below
          },
          "string": {
            pattern: /"[^"]*"|'[^']*'/,
            greedy: true
          },
          "punctuation": /^<!|>$|[[\]]/,
          "doctype-tag": /^DOCTYPE/i,
          "name": /[^\s<>'"]+/
        }
      },
      "cdata": {
        pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
        greedy: true
      },
      "tag": {
        pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
        greedy: true,
        inside: {
          "tag": {
            pattern: /^<\/?[^\s>\/]+/,
            inside: {
              "punctuation": /^<\/?/,
              "namespace": /^[^\s>\/:]+:/
            }
          },
          "special-attr": [],
          "attr-value": {
            pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
            inside: {
              "punctuation": [
                {
                  pattern: /^=/,
                  alias: "attr-equals"
                },
                {
                  pattern: /^(\s*)["']|["']$/,
                  lookbehind: true
                }
              ]
            }
          },
          "punctuation": /\/?>/,
          "attr-name": {
            pattern: /[^\s>\/]+/,
            inside: {
              "namespace": /^[^\s>\/:]+:/
            }
          }
        }
      },
      "entity": [
        {
          pattern: /&[\da-z]{1,8};/i,
          alias: "named-entity"
        },
        /&#x?[\da-f]{1,8};/i
      ]
    };
    Prism2.languages.markup["tag"].inside["attr-value"].inside["entity"] = Prism2.languages.markup["entity"];
    Prism2.languages.markup["doctype"].inside["internal-subset"].inside = Prism2.languages.markup;
    Prism2.hooks.add("wrap", function(env) {
      if (env.type === "entity") {
        env.attributes["title"] = env.content.replace(/&amp;/, "&");
      }
    });
    Object.defineProperty(Prism2.languages.markup.tag, "addInlined", {
      /**
       * Adds an inlined language to markup.
       *
       * An example of an inlined language is CSS with `<style>` tags.
       *
       * @param {string} tagName The name of the tag that contains the inlined language. This name will be treated as
       * case insensitive.
       * @param {string} lang The language key.
       * @example
       * addInlined('style', 'css');
       */
      value: function addInlined(tagName, lang) {
        var includedCdataInside = {};
        includedCdataInside["language-" + lang] = {
          pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
          lookbehind: true,
          inside: Prism2.languages[lang]
        };
        includedCdataInside["cdata"] = /^<!\[CDATA\[|\]\]>$/i;
        var inside = {
          "included-cdata": {
            pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
            inside: includedCdataInside
          }
        };
        inside["language-" + lang] = {
          pattern: /[\s\S]+/,
          inside: Prism2.languages[lang]
        };
        var def = {};
        def[tagName] = {
          pattern: RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g, function() {
            return tagName;
          }), "i"),
          lookbehind: true,
          greedy: true,
          inside
        };
        Prism2.languages.insertBefore("markup", "cdata", def);
      }
    });
    Object.defineProperty(Prism2.languages.markup.tag, "addAttribute", {
      /**
       * Adds an pattern to highlight languages embedded in HTML attributes.
       *
       * An example of an inlined language is CSS with `style` attributes.
       *
       * @param {string} attrName The name of the tag that contains the inlined language. This name will be treated as
       * case insensitive.
       * @param {string} lang The language key.
       * @example
       * addAttribute('style', 'css');
       */
      value: function(attrName, lang) {
        Prism2.languages.markup.tag.inside["special-attr"].push({
          pattern: RegExp(
            /(^|["'\s])/.source + "(?:" + attrName + ")" + /\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,
            "i"
          ),
          lookbehind: true,
          inside: {
            "attr-name": /^[^\s=]+/,
            "attr-value": {
              pattern: /=[\s\S]+/,
              inside: {
                "value": {
                  pattern: /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
                  lookbehind: true,
                  alias: [lang, "language-" + lang],
                  inside: Prism2.languages[lang]
                },
                "punctuation": [
                  {
                    pattern: /^=/,
                    alias: "attr-equals"
                  },
                  /"|'/
                ]
              }
            }
          }
        });
      }
    });
    Prism2.languages.html = Prism2.languages.markup;
    Prism2.languages.mathml = Prism2.languages.markup;
    Prism2.languages.svg = Prism2.languages.markup;
    Prism2.languages.xml = Prism2.languages.extend("markup", {});
    Prism2.languages.ssml = Prism2.languages.xml;
    Prism2.languages.atom = Prism2.languages.xml;
    Prism2.languages.rss = Prism2.languages.xml;
    (function(Prism3) {
      var string = /(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;
      Prism3.languages.css = {
        "comment": /\/\*[\s\S]*?\*\//,
        "atrule": {
          pattern: RegExp("@[\\w-](?:" + /[^;{\s"']|\s+(?!\s)/.source + "|" + string.source + ")*?" + /(?:;|(?=\s*\{))/.source),
          inside: {
            "rule": /^@[\w-]+/,
            "selector-function-argument": {
              pattern: /(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,
              lookbehind: true,
              alias: "selector"
            },
            "keyword": {
              pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
              lookbehind: true
            }
            // See rest below
          }
        },
        "url": {
          // https://drafts.csswg.org/css-values-3/#urls
          pattern: RegExp("\\burl\\((?:" + string.source + "|" + /(?:[^\\\r\n()"']|\\[\s\S])*/.source + ")\\)", "i"),
          greedy: true,
          inside: {
            "function": /^url/i,
            "punctuation": /^\(|\)$/,
            "string": {
              pattern: RegExp("^" + string.source + "$"),
              alias: "url"
            }
          }
        },
        "selector": {
          pattern: RegExp(`(^|[{}\\s])[^{}\\s](?:[^{};"'\\s]|\\s+(?![\\s{])|` + string.source + ")*(?=\\s*\\{)"),
          lookbehind: true
        },
        "string": {
          pattern: string,
          greedy: true
        },
        "property": {
          pattern: /(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,
          lookbehind: true
        },
        "important": /!important\b/i,
        "function": {
          pattern: /(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,
          lookbehind: true
        },
        "punctuation": /[(){};:,]/
      };
      Prism3.languages.css["atrule"].inside.rest = Prism3.languages.css;
      var markup = Prism3.languages.markup;
      if (markup) {
        markup.tag.addInlined("style", "css");
        markup.tag.addAttribute("style", "css");
      }
    })(Prism2);
    Prism2.languages.clike = {
      "comment": [
        {
          pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
          lookbehind: true,
          greedy: true
        },
        {
          pattern: /(^|[^\\:])\/\/.*/,
          lookbehind: true,
          greedy: true
        }
      ],
      "string": {
        pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
        greedy: true
      },
      "class-name": {
        pattern: /(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,
        lookbehind: true,
        inside: {
          "punctuation": /[.\\]/
        }
      },
      "keyword": /\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,
      "boolean": /\b(?:false|true)\b/,
      "function": /\b\w+(?=\()/,
      "number": /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
      "operator": /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
      "punctuation": /[{}[\];(),.:]/
    };
    Prism2.languages.javascript = Prism2.languages.extend("clike", {
      "class-name": [
        Prism2.languages.clike["class-name"],
        {
          pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,
          lookbehind: true
        }
      ],
      "keyword": [
        {
          pattern: /((?:^|\})\s*)catch\b/,
          lookbehind: true
        },
        {
          pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
          lookbehind: true
        }
      ],
      // Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
      "function": /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
      "number": {
        pattern: RegExp(
          /(^|[^\w$])/.source + "(?:" + // constant
          (/NaN|Infinity/.source + "|" + // binary integer
          /0[bB][01]+(?:_[01]+)*n?/.source + "|" + // octal integer
          /0[oO][0-7]+(?:_[0-7]+)*n?/.source + "|" + // hexadecimal integer
          /0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source + "|" + // decimal bigint
          /\d+(?:_\d+)*n/.source + "|" + // decimal number (integer or float) but no bigint
          /(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source) + ")" + /(?![\w$])/.source
        ),
        lookbehind: true
      },
      "operator": /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/
    });
    Prism2.languages.javascript["class-name"][0].pattern = /(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/;
    Prism2.languages.insertBefore("javascript", "keyword", {
      "regex": {
        pattern: RegExp(
          // lookbehind
          // eslint-disable-next-line regexp/no-dupe-characters-character-class
          /((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source + // Regex pattern:
          // There are 2 regex patterns here. The RegExp set notation proposal added support for nested character
          // classes if the `v` flag is present. Unfortunately, nested CCs are both context-free and incompatible
          // with the only syntax, so we have to define 2 different regex patterns.
          /\//.source + "(?:" + /(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source + "|" + // `v` flag syntax. This supports 3 levels of nested character classes.
          /(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source + ")" + // lookahead
          /(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source
        ),
        lookbehind: true,
        greedy: true,
        inside: {
          "regex-source": {
            pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
            lookbehind: true,
            alias: "language-regex",
            inside: Prism2.languages.regex
          },
          "regex-delimiter": /^\/|\/$/,
          "regex-flags": /^[a-z]+$/
        }
      },
      // This must be declared before keyword because we use "function" inside the look-forward
      "function-variable": {
        pattern: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
        alias: "function"
      },
      "parameter": [
        {
          pattern: /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
          lookbehind: true,
          inside: Prism2.languages.javascript
        },
        {
          pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
          lookbehind: true,
          inside: Prism2.languages.javascript
        },
        {
          pattern: /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
          lookbehind: true,
          inside: Prism2.languages.javascript
        },
        {
          pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
          lookbehind: true,
          inside: Prism2.languages.javascript
        }
      ],
      "constant": /\b[A-Z](?:[A-Z_]|\dx?)*\b/
    });
    Prism2.languages.insertBefore("javascript", "string", {
      "hashbang": {
        pattern: /^#!.*/,
        greedy: true,
        alias: "comment"
      },
      "template-string": {
        pattern: /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
        greedy: true,
        inside: {
          "template-punctuation": {
            pattern: /^`|`$/,
            alias: "string"
          },
          "interpolation": {
            pattern: /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
            lookbehind: true,
            inside: {
              "interpolation-punctuation": {
                pattern: /^\$\{|\}$/,
                alias: "punctuation"
              },
              rest: Prism2.languages.javascript
            }
          },
          "string": /[\s\S]+/
        }
      },
      "string-property": {
        pattern: /((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,
        lookbehind: true,
        greedy: true,
        alias: "property"
      }
    });
    Prism2.languages.insertBefore("javascript", "operator", {
      "literal-property": {
        pattern: /((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,
        lookbehind: true,
        alias: "property"
      }
    });
    if (Prism2.languages.markup) {
      Prism2.languages.markup.tag.addInlined("script", "javascript");
      Prism2.languages.markup.tag.addAttribute(
        /on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,
        "javascript"
      );
    }
    Prism2.languages.js = Prism2.languages.javascript;
    (function() {
      if (typeof Prism2 === "undefined" || typeof document === "undefined") {
        return;
      }
      if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
      }
      var LOADING_MESSAGE = "Loading…";
      var FAILURE_MESSAGE = function(status, message) {
        return "✖ Error " + status + " while fetching file: " + message;
      };
      var FAILURE_EMPTY_MESSAGE = "✖ Error: File does not exist or is empty";
      var EXTENSIONS = {
        "js": "javascript",
        "py": "python",
        "rb": "ruby",
        "ps1": "powershell",
        "psm1": "powershell",
        "sh": "bash",
        "bat": "batch",
        "h": "c",
        "tex": "latex"
      };
      var STATUS_ATTR = "data-src-status";
      var STATUS_LOADING = "loading";
      var STATUS_LOADED = "loaded";
      var STATUS_FAILED = "failed";
      var SELECTOR = "pre[data-src]:not([" + STATUS_ATTR + '="' + STATUS_LOADED + '"]):not([' + STATUS_ATTR + '="' + STATUS_LOADING + '"])';
      function loadFile(src, success, error) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", src, true);
        xhr.onreadystatechange = function() {
          if (xhr.readyState == 4) {
            if (xhr.status < 400 && xhr.responseText) {
              success(xhr.responseText);
            } else {
              if (xhr.status >= 400) {
                error(FAILURE_MESSAGE(xhr.status, xhr.statusText));
              } else {
                error(FAILURE_EMPTY_MESSAGE);
              }
            }
          }
        };
        xhr.send(null);
      }
      function parseRange(range) {
        var m = /^\s*(\d+)\s*(?:(,)\s*(?:(\d+)\s*)?)?$/.exec(range || "");
        if (m) {
          var start = Number(m[1]);
          var comma = m[2];
          var end = m[3];
          if (!comma) {
            return [start, start];
          }
          if (!end) {
            return [start, void 0];
          }
          return [start, Number(end)];
        }
        return void 0;
      }
      Prism2.hooks.add("before-highlightall", function(env) {
        env.selector += ", " + SELECTOR;
      });
      Prism2.hooks.add("before-sanity-check", function(env) {
        var pre = (
          /** @type {HTMLPreElement} */
          env.element
        );
        if (pre.matches(SELECTOR)) {
          env.code = "";
          pre.setAttribute(STATUS_ATTR, STATUS_LOADING);
          var code = pre.appendChild(document.createElement("CODE"));
          code.textContent = LOADING_MESSAGE;
          var src = pre.getAttribute("data-src");
          var language = env.language;
          if (language === "none") {
            var extension = (/\.(\w+)$/.exec(src) || [, "none"])[1];
            language = EXTENSIONS[extension] || extension;
          }
          Prism2.util.setLanguage(code, language);
          Prism2.util.setLanguage(pre, language);
          var autoloader = Prism2.plugins.autoloader;
          if (autoloader) {
            autoloader.loadLanguages(language);
          }
          loadFile(
            src,
            function(text) {
              pre.setAttribute(STATUS_ATTR, STATUS_LOADED);
              var range = parseRange(pre.getAttribute("data-range"));
              if (range) {
                var lines = text.split(/\r\n?|\n/g);
                var start = range[0];
                var end = range[1] == null ? lines.length : range[1];
                if (start < 0) {
                  start += lines.length;
                }
                start = Math.max(0, Math.min(start - 1, lines.length));
                if (end < 0) {
                  end += lines.length;
                }
                end = Math.max(0, Math.min(end, lines.length));
                text = lines.slice(start, end).join("\n");
                if (!pre.hasAttribute("data-start")) {
                  pre.setAttribute("data-start", String(start + 1));
                }
              }
              code.textContent = text;
              Prism2.highlightElement(code);
            },
            function(error) {
              pre.setAttribute(STATUS_ATTR, STATUS_FAILED);
              code.textContent = error;
            }
          );
        }
      });
      Prism2.plugins.fileHighlight = {
        /**
         * Executes the File Highlight plugin for all matching `pre` elements under the given container.
         *
         * Note: Elements which are already loaded or currently loading will not be touched by this method.
         *
         * @param {ParentNode} [container=document]
         */
        highlight: function highlight(container) {
          var elements = (container || document).querySelectorAll(SELECTOR);
          for (var i = 0, element; element = elements[i++]; ) {
            Prism2.highlightElement(element);
          }
        }
      };
      var logged = false;
      Prism2.fileHighlight = function() {
        if (!logged) {
          console.warn("Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead.");
          logged = true;
        }
        Prism2.plugins.fileHighlight.highlight.apply(this, arguments);
      };
    })();
  })(prism);
  return prism.exports;
}
var prismExports = requirePrism();
const Prism$1 = /* @__PURE__ */ getDefaultExportFromCjs(prismExports);
Prism.languages.javascript = Prism.languages.extend("clike", {
  "class-name": [
    Prism.languages.clike["class-name"],
    {
      pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,
      lookbehind: true
    }
  ],
  "keyword": [
    {
      pattern: /((?:^|\})\s*)catch\b/,
      lookbehind: true
    },
    {
      pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
      lookbehind: true
    }
  ],
  // Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
  "function": /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
  "number": {
    pattern: RegExp(
      /(^|[^\w$])/.source + "(?:" + // constant
      (/NaN|Infinity/.source + "|" + // binary integer
      /0[bB][01]+(?:_[01]+)*n?/.source + "|" + // octal integer
      /0[oO][0-7]+(?:_[0-7]+)*n?/.source + "|" + // hexadecimal integer
      /0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source + "|" + // decimal bigint
      /\d+(?:_\d+)*n/.source + "|" + // decimal number (integer or float) but no bigint
      /(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source) + ")" + /(?![\w$])/.source
    ),
    lookbehind: true
  },
  "operator": /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/
});
Prism.languages.javascript["class-name"][0].pattern = /(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/;
Prism.languages.insertBefore("javascript", "keyword", {
  "regex": {
    pattern: RegExp(
      // lookbehind
      // eslint-disable-next-line regexp/no-dupe-characters-character-class
      /((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source + // Regex pattern:
      // There are 2 regex patterns here. The RegExp set notation proposal added support for nested character
      // classes if the `v` flag is present. Unfortunately, nested CCs are both context-free and incompatible
      // with the only syntax, so we have to define 2 different regex patterns.
      /\//.source + "(?:" + /(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source + "|" + // `v` flag syntax. This supports 3 levels of nested character classes.
      /(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source + ")" + // lookahead
      /(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source
    ),
    lookbehind: true,
    greedy: true,
    inside: {
      "regex-source": {
        pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
        lookbehind: true,
        alias: "language-regex",
        inside: Prism.languages.regex
      },
      "regex-delimiter": /^\/|\/$/,
      "regex-flags": /^[a-z]+$/
    }
  },
  // This must be declared before keyword because we use "function" inside the look-forward
  "function-variable": {
    pattern: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
    alias: "function"
  },
  "parameter": [
    {
      pattern: /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
      lookbehind: true,
      inside: Prism.languages.javascript
    },
    {
      pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
      lookbehind: true,
      inside: Prism.languages.javascript
    },
    {
      pattern: /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
      lookbehind: true,
      inside: Prism.languages.javascript
    },
    {
      pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
      lookbehind: true,
      inside: Prism.languages.javascript
    }
  ],
  "constant": /\b[A-Z](?:[A-Z_]|\dx?)*\b/
});
Prism.languages.insertBefore("javascript", "string", {
  "hashbang": {
    pattern: /^#!.*/,
    greedy: true,
    alias: "comment"
  },
  "template-string": {
    pattern: /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
    greedy: true,
    inside: {
      "template-punctuation": {
        pattern: /^`|`$/,
        alias: "string"
      },
      "interpolation": {
        pattern: /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
        lookbehind: true,
        inside: {
          "interpolation-punctuation": {
            pattern: /^\$\{|\}$/,
            alias: "punctuation"
          },
          rest: Prism.languages.javascript
        }
      },
      "string": /[\s\S]+/
    }
  },
  "string-property": {
    pattern: /((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,
    lookbehind: true,
    greedy: true,
    alias: "property"
  }
});
Prism.languages.insertBefore("javascript", "operator", {
  "literal-property": {
    pattern: /((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,
    lookbehind: true,
    alias: "property"
  }
});
if (Prism.languages.markup) {
  Prism.languages.markup.tag.addInlined("script", "javascript");
  Prism.languages.markup.tag.addAttribute(
    /on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,
    "javascript"
  );
}
Prism.languages.js = Prism.languages.javascript;
Prism.languages.json = {
  "property": {
    pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,
    lookbehind: true,
    greedy: true
  },
  "string": {
    pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,
    lookbehind: true,
    greedy: true
  },
  "comment": {
    pattern: /\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,
    greedy: true
  },
  "number": /-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,
  "punctuation": /[{}[\],]/,
  "operator": /:/,
  "boolean": /\b(?:false|true)\b/,
  "null": {
    pattern: /\bnull\b/,
    alias: "keyword"
  }
};
Prism.languages.webmanifest = Prism.languages.json;
const style = document.createElement("style");
style.textContent = `
  .editable-div:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }
`;
document.head.appendChild(style);
const App = () => {
  observable(`{
  "function add(a, b)": [
    { "return": { "+": ["@a", "@b"] } }
  ]
}`);
  observable("function sum(a, b) {\n  return a + b;\n}");
  const tsOutput = observable("");
  const jeonOutput = observable("");
  observable("");
  observable('{ "a": 5, "b": 3 }');
  observable(false);
  observable(false);
  const tsElement = observable();
  effect(() => {
    const tse = get(tsElement);
    const tso = get(tsOutput);
    if (!tse) return;
    if (!tso) return;
    try {
      tse.innerHTML = Prism$1.highlight(tso, Prism$1.languages.javascript, "javascript");
    } catch (e) {
      tse.textContent = String(e);
    }
  });
  const jeonElement = observable();
  effect(() => {
    const jse = get(jeonElement);
    const jso = get(jeonOutput);
    if (!jse) return;
    if (!jso) return;
    try {
      const parsed = JSON.parse(jso);
      const formatted = JSON.stringify(parsed, null, 2);
      jse.innerHTML = Prism$1.highlight(formatted, Prism$1.languages.json, "json");
    } catch {
      try {
        jse.innerHTML = Prism$1.highlight(jso, Prism$1.languages.jeon, "jeon");
      } catch (e) {
        jse.textContent = String(e);
      }
    }
  });
};
render(/* @__PURE__ */ jsx(App, {}), document.getElementById("root"));
//# sourceMappingURL=index-D3JjVpdx.js.map
