(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __reExport = (target, module, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
    }
    return target;
  };
  var __toModule = (module) => {
    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
  };
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };

  // ../../node_modules/url-join/lib/url-join.js
  var require_url_join = __commonJS({
    "../../node_modules/url-join/lib/url-join.js"(exports, module) {
      (function(name, context, definition) {
        if (typeof module !== "undefined" && module.exports)
          module.exports = definition();
        else if (typeof define === "function" && define.amd)
          define(definition);
        else
          context[name] = definition();
      })("urljoin", exports, function() {
        function normalize(strArray) {
          var resultArray = [];
          if (strArray.length === 0) {
            return "";
          }
          if (typeof strArray[0] !== "string") {
            throw new TypeError("Url must be a string. Received " + strArray[0]);
          }
          if (strArray[0].match(/^[^/:]+:\/*$/) && strArray.length > 1) {
            var first = strArray.shift();
            strArray[0] = first + strArray[0];
          }
          if (strArray[0].match(/^file:\/\/\//)) {
            strArray[0] = strArray[0].replace(/^([^/:]+):\/*/, "$1:///");
          } else {
            strArray[0] = strArray[0].replace(/^([^/:]+):\/*/, "$1://");
          }
          for (var i = 0; i < strArray.length; i++) {
            var component = strArray[i];
            if (typeof component !== "string") {
              throw new TypeError("Url must be a string. Received " + component);
            }
            if (component === "") {
              continue;
            }
            if (i > 0) {
              component = component.replace(/^[\/]+/, "");
            }
            if (i < strArray.length - 1) {
              component = component.replace(/[\/]+$/, "");
            } else {
              component = component.replace(/[\/]+$/, "/");
            }
            resultArray.push(component);
          }
          var str = resultArray.join("/");
          str = str.replace(/\/(\?|&|#[^!])/g, "$1");
          var parts = str.split("?");
          str = parts.shift() + (parts.length > 0 ? "?" : "") + parts.join("&");
          return str;
        }
        return function() {
          var input;
          if (typeof arguments[0] === "object") {
            input = arguments[0];
          } else {
            input = [].slice.call(arguments);
          }
          return normalize(input);
        };
      });
    }
  });

  // node_modules/fp-ts/lib/number.js
  var require_number = __commonJS({
    "node_modules/fp-ts/lib/number.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Field = exports.MonoidProduct = exports.MonoidSum = exports.SemigroupProduct = exports.SemigroupSum = exports.MagmaSub = exports.Show = exports.Bounded = exports.Ord = exports.Eq = exports.isNumber = void 0;
      var isNumber2 = function(u) {
        return typeof u === "number";
      };
      exports.isNumber = isNumber2;
      exports.Eq = {
        equals: function(first, second) {
          return first === second;
        }
      };
      exports.Ord = {
        equals: exports.Eq.equals,
        compare: function(first, second) {
          return first < second ? -1 : first > second ? 1 : 0;
        }
      };
      exports.Bounded = {
        equals: exports.Eq.equals,
        compare: exports.Ord.compare,
        top: Infinity,
        bottom: -Infinity
      };
      exports.Show = {
        show: function(n) {
          return JSON.stringify(n);
        }
      };
      exports.MagmaSub = {
        concat: function(first, second) {
          return first - second;
        }
      };
      exports.SemigroupSum = {
        concat: function(first, second) {
          return first + second;
        }
      };
      exports.SemigroupProduct = {
        concat: function(first, second) {
          return first * second;
        }
      };
      exports.MonoidSum = {
        concat: exports.SemigroupSum.concat,
        empty: 0
      };
      exports.MonoidProduct = {
        concat: exports.SemigroupProduct.concat,
        empty: 1
      };
      exports.Field = {
        add: exports.SemigroupSum.concat,
        zero: 0,
        mul: exports.SemigroupProduct.concat,
        one: 1,
        sub: exports.MagmaSub.concat,
        degree: function(_) {
          return 1;
        },
        div: function(first, second) {
          return first / second;
        },
        mod: function(first, second) {
          return first % second;
        }
      };
    }
  });

  // node_modules/fp-ts/lib/function.js
  var require_function = __commonJS({
    "node_modules/fp-ts/lib/function.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.getEndomorphismMonoid = exports.not = exports.SK = exports.hole = exports.pipe = exports.untupled = exports.tupled = exports.absurd = exports.decrement = exports.increment = exports.tuple = exports.flow = exports.flip = exports.constVoid = exports.constUndefined = exports.constNull = exports.constFalse = exports.constTrue = exports.constant = exports.unsafeCoerce = exports.identity = exports.apply = exports.getRing = exports.getSemiring = exports.getMonoid = exports.getSemigroup = exports.getBooleanAlgebra = void 0;
      var getBooleanAlgebra = function(B) {
        return function() {
          return {
            meet: function(x, y) {
              return function(a) {
                return B.meet(x(a), y(a));
              };
            },
            join: function(x, y) {
              return function(a) {
                return B.join(x(a), y(a));
              };
            },
            zero: function() {
              return B.zero;
            },
            one: function() {
              return B.one;
            },
            implies: function(x, y) {
              return function(a) {
                return B.implies(x(a), y(a));
              };
            },
            not: function(x) {
              return function(a) {
                return B.not(x(a));
              };
            }
          };
        };
      };
      exports.getBooleanAlgebra = getBooleanAlgebra;
      var getSemigroup = function(S) {
        return function() {
          return {
            concat: function(f, g) {
              return function(a) {
                return S.concat(f(a), g(a));
              };
            }
          };
        };
      };
      exports.getSemigroup = getSemigroup;
      var getMonoid = function(M) {
        var getSemigroupM = exports.getSemigroup(M);
        return function() {
          return {
            concat: getSemigroupM().concat,
            empty: function() {
              return M.empty;
            }
          };
        };
      };
      exports.getMonoid = getMonoid;
      var getSemiring = function(S) {
        return {
          add: function(f, g) {
            return function(x) {
              return S.add(f(x), g(x));
            };
          },
          zero: function() {
            return S.zero;
          },
          mul: function(f, g) {
            return function(x) {
              return S.mul(f(x), g(x));
            };
          },
          one: function() {
            return S.one;
          }
        };
      };
      exports.getSemiring = getSemiring;
      var getRing = function(R) {
        var S = exports.getSemiring(R);
        return {
          add: S.add,
          mul: S.mul,
          one: S.one,
          zero: S.zero,
          sub: function(f, g) {
            return function(x) {
              return R.sub(f(x), g(x));
            };
          }
        };
      };
      exports.getRing = getRing;
      var apply = function(a) {
        return function(f) {
          return f(a);
        };
      };
      exports.apply = apply;
      function identity(a) {
        return a;
      }
      exports.identity = identity;
      exports.unsafeCoerce = identity;
      function constant(a) {
        return function() {
          return a;
        };
      }
      exports.constant = constant;
      exports.constTrue = /* @__PURE__ */ constant(true);
      exports.constFalse = /* @__PURE__ */ constant(false);
      exports.constNull = /* @__PURE__ */ constant(null);
      exports.constUndefined = /* @__PURE__ */ constant(void 0);
      exports.constVoid = exports.constUndefined;
      function flip(f) {
        return function(b, a) {
          return f(a, b);
        };
      }
      exports.flip = flip;
      function flow(ab, bc, cd, de, ef, fg, gh, hi, ij) {
        switch (arguments.length) {
          case 1:
            return ab;
          case 2:
            return function() {
              return bc(ab.apply(this, arguments));
            };
          case 3:
            return function() {
              return cd(bc(ab.apply(this, arguments)));
            };
          case 4:
            return function() {
              return de(cd(bc(ab.apply(this, arguments))));
            };
          case 5:
            return function() {
              return ef(de(cd(bc(ab.apply(this, arguments)))));
            };
          case 6:
            return function() {
              return fg(ef(de(cd(bc(ab.apply(this, arguments))))));
            };
          case 7:
            return function() {
              return gh(fg(ef(de(cd(bc(ab.apply(this, arguments)))))));
            };
          case 8:
            return function() {
              return hi(gh(fg(ef(de(cd(bc(ab.apply(this, arguments))))))));
            };
          case 9:
            return function() {
              return ij(hi(gh(fg(ef(de(cd(bc(ab.apply(this, arguments)))))))));
            };
        }
        return;
      }
      exports.flow = flow;
      function tuple() {
        var t2 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          t2[_i] = arguments[_i];
        }
        return t2;
      }
      exports.tuple = tuple;
      function increment(n) {
        return n + 1;
      }
      exports.increment = increment;
      function decrement(n) {
        return n - 1;
      }
      exports.decrement = decrement;
      function absurd(_) {
        throw new Error("Called `absurd` function which should be uncallable");
      }
      exports.absurd = absurd;
      function tupled(f) {
        return function(a) {
          return f.apply(void 0, a);
        };
      }
      exports.tupled = tupled;
      function untupled(f) {
        return function() {
          var a = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            a[_i] = arguments[_i];
          }
          return f(a);
        };
      }
      exports.untupled = untupled;
      function pipe(a, ab, bc, cd, de, ef, fg, gh, hi) {
        switch (arguments.length) {
          case 1:
            return a;
          case 2:
            return ab(a);
          case 3:
            return bc(ab(a));
          case 4:
            return cd(bc(ab(a)));
          case 5:
            return de(cd(bc(ab(a))));
          case 6:
            return ef(de(cd(bc(ab(a)))));
          case 7:
            return fg(ef(de(cd(bc(ab(a))))));
          case 8:
            return gh(fg(ef(de(cd(bc(ab(a)))))));
          case 9:
            return hi(gh(fg(ef(de(cd(bc(ab(a))))))));
          default:
            var ret = arguments[0];
            for (var i = 1; i < arguments.length; i++) {
              ret = arguments[i](ret);
            }
            return ret;
        }
      }
      exports.pipe = pipe;
      exports.hole = absurd;
      var SK = function(_, b) {
        return b;
      };
      exports.SK = SK;
      function not(predicate) {
        return function(a) {
          return !predicate(a);
        };
      }
      exports.not = not;
      var getEndomorphismMonoid = function() {
        return {
          concat: function(first, second) {
            return flow(first, second);
          },
          empty: identity
        };
      };
      exports.getEndomorphismMonoid = getEndomorphismMonoid;
    }
  });

  // node_modules/fp-ts/lib/Apply.js
  var require_Apply = __commonJS({
    "node_modules/fp-ts/lib/Apply.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.sequenceS = exports.sequenceT = exports.getApplySemigroup = exports.apS = exports.apSecond = exports.apFirst = exports.ap = void 0;
      var function_1 = require_function();
      function ap(F, G) {
        return function(fa) {
          return function(fab) {
            return F.ap(F.map(fab, function(gab) {
              return function(ga) {
                return G.ap(gab, ga);
              };
            }), fa);
          };
        };
      }
      exports.ap = ap;
      function apFirst(A) {
        return function(second) {
          return function(first) {
            return A.ap(A.map(first, function(a) {
              return function() {
                return a;
              };
            }), second);
          };
        };
      }
      exports.apFirst = apFirst;
      function apSecond(A) {
        return function(second) {
          return function(first) {
            return A.ap(A.map(first, function() {
              return function(b) {
                return b;
              };
            }), second);
          };
        };
      }
      exports.apSecond = apSecond;
      function apS(F) {
        return function(name, fb) {
          return function(fa) {
            return F.ap(F.map(fa, function(a) {
              return function(b) {
                var _a;
                return Object.assign({}, a, (_a = {}, _a[name] = b, _a));
              };
            }), fb);
          };
        };
      }
      exports.apS = apS;
      function getApplySemigroup(F) {
        return function(S) {
          return {
            concat: function(first, second) {
              return F.ap(F.map(first, function(x) {
                return function(y) {
                  return S.concat(x, y);
                };
              }), second);
            }
          };
        };
      }
      exports.getApplySemigroup = getApplySemigroup;
      function curried(f, n, acc) {
        return function(x) {
          var combined = Array(acc.length + 1);
          for (var i = 0; i < acc.length; i++) {
            combined[i] = acc[i];
          }
          combined[acc.length] = x;
          return n === 0 ? f.apply(null, combined) : curried(f, n - 1, combined);
        };
      }
      var tupleConstructors = {
        1: function(a) {
          return [a];
        },
        2: function(a) {
          return function(b) {
            return [a, b];
          };
        },
        3: function(a) {
          return function(b) {
            return function(c) {
              return [a, b, c];
            };
          };
        },
        4: function(a) {
          return function(b) {
            return function(c) {
              return function(d) {
                return [a, b, c, d];
              };
            };
          };
        },
        5: function(a) {
          return function(b) {
            return function(c) {
              return function(d) {
                return function(e) {
                  return [a, b, c, d, e];
                };
              };
            };
          };
        }
      };
      function getTupleConstructor(len) {
        if (!tupleConstructors.hasOwnProperty(len)) {
          tupleConstructors[len] = curried(function_1.tuple, len - 1, []);
        }
        return tupleConstructors[len];
      }
      function sequenceT(F) {
        return function() {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
          }
          var len = args.length;
          var f = getTupleConstructor(len);
          var fas = F.map(args[0], f);
          for (var i = 1; i < len; i++) {
            fas = F.ap(fas, args[i]);
          }
          return fas;
        };
      }
      exports.sequenceT = sequenceT;
      function getRecordConstructor(keys) {
        var len = keys.length;
        switch (len) {
          case 1:
            return function(a) {
              var _a;
              return _a = {}, _a[keys[0]] = a, _a;
            };
          case 2:
            return function(a) {
              return function(b) {
                var _a;
                return _a = {}, _a[keys[0]] = a, _a[keys[1]] = b, _a;
              };
            };
          case 3:
            return function(a) {
              return function(b) {
                return function(c) {
                  var _a;
                  return _a = {}, _a[keys[0]] = a, _a[keys[1]] = b, _a[keys[2]] = c, _a;
                };
              };
            };
          case 4:
            return function(a) {
              return function(b) {
                return function(c) {
                  return function(d) {
                    var _a;
                    return _a = {}, _a[keys[0]] = a, _a[keys[1]] = b, _a[keys[2]] = c, _a[keys[3]] = d, _a;
                  };
                };
              };
            };
          case 5:
            return function(a) {
              return function(b) {
                return function(c) {
                  return function(d) {
                    return function(e) {
                      var _a;
                      return _a = {}, _a[keys[0]] = a, _a[keys[1]] = b, _a[keys[2]] = c, _a[keys[3]] = d, _a[keys[4]] = e, _a;
                    };
                  };
                };
              };
            };
          default:
            return curried(function() {
              var args = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
              }
              var r = {};
              for (var i = 0; i < len; i++) {
                r[keys[i]] = args[i];
              }
              return r;
            }, len - 1, []);
        }
      }
      function sequenceS(F) {
        return function(r) {
          var keys = Object.keys(r);
          var len = keys.length;
          var f = getRecordConstructor(keys);
          var fr = F.map(r[keys[0]], f);
          for (var i = 1; i < len; i++) {
            fr = F.ap(fr, r[keys[i]]);
          }
          return fr;
        };
      }
      exports.sequenceS = sequenceS;
    }
  });

  // node_modules/fp-ts/lib/Chain.js
  var require_Chain = __commonJS({
    "node_modules/fp-ts/lib/Chain.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.bind = exports.chainFirst = void 0;
      function chainFirst(M) {
        return function(f) {
          return function(first) {
            return M.chain(first, function(a) {
              return M.map(f(a), function() {
                return a;
              });
            });
          };
        };
      }
      exports.chainFirst = chainFirst;
      function bind(M) {
        return function(name, f) {
          return function(ma) {
            return M.chain(ma, function(a) {
              return M.map(f(a), function(b) {
                var _a;
                return Object.assign({}, a, (_a = {}, _a[name] = b, _a));
              });
            });
          };
        };
      }
      exports.bind = bind;
    }
  });

  // node_modules/fp-ts/lib/Eq.js
  var require_Eq = __commonJS({
    "node_modules/fp-ts/lib/Eq.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.eqDate = exports.eqNumber = exports.eqString = exports.eqBoolean = exports.eq = exports.strictEqual = exports.getStructEq = exports.getTupleEq = exports.Contravariant = exports.getMonoid = exports.getSemigroup = exports.eqStrict = exports.URI = exports.contramap = exports.tuple = exports.struct = exports.fromEquals = void 0;
      var function_1 = require_function();
      var fromEquals = function(equals) {
        return {
          equals: function(x, y) {
            return x === y || equals(x, y);
          }
        };
      };
      exports.fromEquals = fromEquals;
      var struct = function(eqs) {
        return exports.fromEquals(function(first, second) {
          for (var key in eqs) {
            if (!eqs[key].equals(first[key], second[key])) {
              return false;
            }
          }
          return true;
        });
      };
      exports.struct = struct;
      var tuple = function() {
        var eqs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          eqs[_i] = arguments[_i];
        }
        return exports.fromEquals(function(first, second) {
          return eqs.every(function(E, i) {
            return E.equals(first[i], second[i]);
          });
        });
      };
      exports.tuple = tuple;
      var contramap_ = function(fa, f) {
        return function_1.pipe(fa, exports.contramap(f));
      };
      var contramap = function(f) {
        return function(fa) {
          return exports.fromEquals(function(x, y) {
            return fa.equals(f(x), f(y));
          });
        };
      };
      exports.contramap = contramap;
      exports.URI = "Eq";
      exports.eqStrict = {
        equals: function(a, b) {
          return a === b;
        }
      };
      var empty = {
        equals: function() {
          return true;
        }
      };
      var getSemigroup = function() {
        return {
          concat: function(x, y) {
            return exports.fromEquals(function(a, b) {
              return x.equals(a, b) && y.equals(a, b);
            });
          }
        };
      };
      exports.getSemigroup = getSemigroup;
      var getMonoid = function() {
        return {
          concat: exports.getSemigroup().concat,
          empty
        };
      };
      exports.getMonoid = getMonoid;
      exports.Contravariant = {
        URI: exports.URI,
        contramap: contramap_
      };
      exports.getTupleEq = exports.tuple;
      exports.getStructEq = exports.struct;
      exports.strictEqual = exports.eqStrict.equals;
      exports.eq = exports.Contravariant;
      exports.eqBoolean = exports.eqStrict;
      exports.eqString = exports.eqStrict;
      exports.eqNumber = exports.eqStrict;
      exports.eqDate = {
        equals: function(first, second) {
          return first.valueOf() === second.valueOf();
        }
      };
    }
  });

  // node_modules/fp-ts/lib/Functor.js
  var require_Functor = __commonJS({
    "node_modules/fp-ts/lib/Functor.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.getFunctorComposition = exports.bindTo = exports.flap = exports.map = void 0;
      var function_1 = require_function();
      function map(F, G) {
        return function(f) {
          return function(fa) {
            return F.map(fa, function(ga) {
              return G.map(ga, f);
            });
          };
        };
      }
      exports.map = map;
      function flap(F) {
        return function(a) {
          return function(fab) {
            return F.map(fab, function(f) {
              return f(a);
            });
          };
        };
      }
      exports.flap = flap;
      function bindTo(F) {
        return function(name) {
          return function(fa) {
            return F.map(fa, function(a) {
              var _a;
              return _a = {}, _a[name] = a, _a;
            });
          };
        };
      }
      exports.bindTo = bindTo;
      function getFunctorComposition(F, G) {
        var _map = map(F, G);
        return {
          map: function(fga, f) {
            return function_1.pipe(fga, _map(f));
          }
        };
      }
      exports.getFunctorComposition = getFunctorComposition;
    }
  });

  // node_modules/fp-ts/lib/internal.js
  var require_internal = __commonJS({
    "node_modules/fp-ts/lib/internal.js"(exports) {
      "use strict";
      var __spreadArray = exports && exports.__spreadArray || function(to, from) {
        for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
          to[j] = from[i];
        return to;
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.fromReadonlyNonEmptyArray = exports.has = exports.emptyRecord = exports.emptyReadonlyArray = exports.tail = exports.head = exports.isNonEmpty = exports.singleton = exports.right = exports.left = exports.isRight = exports.isLeft = exports.some = exports.none = exports.isSome = exports.isNone = void 0;
      var isNone = function(fa) {
        return fa._tag === "None";
      };
      exports.isNone = isNone;
      var isSome = function(fa) {
        return fa._tag === "Some";
      };
      exports.isSome = isSome;
      exports.none = { _tag: "None" };
      var some = function(a) {
        return { _tag: "Some", value: a };
      };
      exports.some = some;
      var isLeft = function(ma) {
        return ma._tag === "Left";
      };
      exports.isLeft = isLeft;
      var isRight = function(ma) {
        return ma._tag === "Right";
      };
      exports.isRight = isRight;
      var left = function(e) {
        return { _tag: "Left", left: e };
      };
      exports.left = left;
      var right = function(a) {
        return { _tag: "Right", right: a };
      };
      exports.right = right;
      var singleton = function(a) {
        return [a];
      };
      exports.singleton = singleton;
      var isNonEmpty = function(as) {
        return as.length > 0;
      };
      exports.isNonEmpty = isNonEmpty;
      var head = function(as) {
        return as[0];
      };
      exports.head = head;
      var tail = function(as) {
        return as.slice(1);
      };
      exports.tail = tail;
      exports.emptyReadonlyArray = [];
      exports.emptyRecord = {};
      exports.has = Object.prototype.hasOwnProperty;
      var fromReadonlyNonEmptyArray = function(as) {
        return __spreadArray([as[0]], as.slice(1));
      };
      exports.fromReadonlyNonEmptyArray = fromReadonlyNonEmptyArray;
    }
  });

  // node_modules/fp-ts/lib/Ord.js
  var require_Ord = __commonJS({
    "node_modules/fp-ts/lib/Ord.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ordDate = exports.ordNumber = exports.ordString = exports.ordBoolean = exports.ord = exports.getDualOrd = exports.getTupleOrd = exports.between = exports.clamp = exports.max = exports.min = exports.geq = exports.leq = exports.gt = exports.lt = exports.equals = exports.trivial = exports.Contravariant = exports.getMonoid = exports.getSemigroup = exports.URI = exports.contramap = exports.reverse = exports.tuple = exports.fromCompare = exports.equalsDefault = void 0;
      var Eq_1 = require_Eq();
      var function_1 = require_function();
      var equalsDefault = function(compare2) {
        return function(first, second) {
          return first === second || compare2(first, second) === 0;
        };
      };
      exports.equalsDefault = equalsDefault;
      var fromCompare = function(compare2) {
        return {
          equals: exports.equalsDefault(compare2),
          compare: function(first, second) {
            return first === second ? 0 : compare2(first, second);
          }
        };
      };
      exports.fromCompare = fromCompare;
      var tuple = function() {
        var ords = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          ords[_i] = arguments[_i];
        }
        return exports.fromCompare(function(first, second) {
          var i = 0;
          for (; i < ords.length - 1; i++) {
            var r = ords[i].compare(first[i], second[i]);
            if (r !== 0) {
              return r;
            }
          }
          return ords[i].compare(first[i], second[i]);
        });
      };
      exports.tuple = tuple;
      var reverse = function(O) {
        return exports.fromCompare(function(first, second) {
          return O.compare(second, first);
        });
      };
      exports.reverse = reverse;
      var contramap_ = function(fa, f) {
        return function_1.pipe(fa, exports.contramap(f));
      };
      var contramap = function(f) {
        return function(fa) {
          return exports.fromCompare(function(first, second) {
            return fa.compare(f(first), f(second));
          });
        };
      };
      exports.contramap = contramap;
      exports.URI = "Ord";
      var getSemigroup = function() {
        return {
          concat: function(first, second) {
            return exports.fromCompare(function(a, b) {
              var ox = first.compare(a, b);
              return ox !== 0 ? ox : second.compare(a, b);
            });
          }
        };
      };
      exports.getSemigroup = getSemigroup;
      var getMonoid = function() {
        return {
          concat: exports.getSemigroup().concat,
          empty: exports.fromCompare(function() {
            return 0;
          })
        };
      };
      exports.getMonoid = getMonoid;
      exports.Contravariant = {
        URI: exports.URI,
        contramap: contramap_
      };
      exports.trivial = {
        equals: function_1.constTrue,
        compare: /* @__PURE__ */ function_1.constant(0)
      };
      var equals = function(O) {
        return function(second) {
          return function(first) {
            return first === second || O.compare(first, second) === 0;
          };
        };
      };
      exports.equals = equals;
      var lt = function(O) {
        return function(first, second) {
          return O.compare(first, second) === -1;
        };
      };
      exports.lt = lt;
      var gt = function(O) {
        return function(first, second) {
          return O.compare(first, second) === 1;
        };
      };
      exports.gt = gt;
      var leq = function(O) {
        return function(first, second) {
          return O.compare(first, second) !== 1;
        };
      };
      exports.leq = leq;
      var geq = function(O) {
        return function(first, second) {
          return O.compare(first, second) !== -1;
        };
      };
      exports.geq = geq;
      var min = function(O) {
        return function(first, second) {
          return first === second || O.compare(first, second) < 1 ? first : second;
        };
      };
      exports.min = min;
      var max = function(O) {
        return function(first, second) {
          return first === second || O.compare(first, second) > -1 ? first : second;
        };
      };
      exports.max = max;
      var clamp = function(O) {
        var minO = exports.min(O);
        var maxO = exports.max(O);
        return function(low, hi) {
          return function(a) {
            return maxO(minO(a, hi), low);
          };
        };
      };
      exports.clamp = clamp;
      var between = function(O) {
        var ltO = exports.lt(O);
        var gtO = exports.gt(O);
        return function(low, hi) {
          return function(a) {
            return ltO(a, low) || gtO(a, hi) ? false : true;
          };
        };
      };
      exports.between = between;
      exports.getTupleOrd = exports.tuple;
      exports.getDualOrd = exports.reverse;
      exports.ord = exports.Contravariant;
      function compare(first, second) {
        return first < second ? -1 : first > second ? 1 : 0;
      }
      var strictOrd = {
        equals: Eq_1.eqStrict.equals,
        compare
      };
      exports.ordBoolean = strictOrd;
      exports.ordString = strictOrd;
      exports.ordNumber = strictOrd;
      exports.ordDate = /* @__PURE__ */ function_1.pipe(exports.ordNumber, /* @__PURE__ */ exports.contramap(function(date) {
        return date.valueOf();
      }));
    }
  });

  // node_modules/fp-ts/lib/Magma.js
  var require_Magma = __commonJS({
    "node_modules/fp-ts/lib/Magma.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.concatAll = exports.endo = exports.filterSecond = exports.filterFirst = exports.reverse = void 0;
      var reverse = function(M) {
        return {
          concat: function(first, second) {
            return M.concat(second, first);
          }
        };
      };
      exports.reverse = reverse;
      var filterFirst = function(predicate) {
        return function(M) {
          return {
            concat: function(first, second) {
              return predicate(first) ? M.concat(first, second) : second;
            }
          };
        };
      };
      exports.filterFirst = filterFirst;
      var filterSecond = function(predicate) {
        return function(M) {
          return {
            concat: function(first, second) {
              return predicate(second) ? M.concat(first, second) : first;
            }
          };
        };
      };
      exports.filterSecond = filterSecond;
      var endo = function(f) {
        return function(M) {
          return {
            concat: function(first, second) {
              return M.concat(f(first), f(second));
            }
          };
        };
      };
      exports.endo = endo;
      var concatAll = function(M) {
        return function(startWith) {
          return function(as) {
            return as.reduce(function(a, acc) {
              return M.concat(a, acc);
            }, startWith);
          };
        };
      };
      exports.concatAll = concatAll;
    }
  });

  // node_modules/fp-ts/lib/Semigroup.js
  var require_Semigroup = __commonJS({
    "node_modules/fp-ts/lib/Semigroup.js"(exports) {
      "use strict";
      var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() {
          return m[k];
        } });
      } : function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        o[k2] = m[k];
      });
      var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      } : function(o, v) {
        o["default"] = v;
      });
      var __importStar = exports && exports.__importStar || function(mod) {
        if (mod && mod.__esModule)
          return mod;
        var result = {};
        if (mod != null) {
          for (var k in mod)
            if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
              __createBinding(result, mod, k);
        }
        __setModuleDefault(result, mod);
        return result;
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.semigroupProduct = exports.semigroupSum = exports.semigroupString = exports.getFunctionSemigroup = exports.semigroupAny = exports.semigroupAll = exports.fold = exports.getIntercalateSemigroup = exports.getMeetSemigroup = exports.getJoinSemigroup = exports.getDualSemigroup = exports.getStructSemigroup = exports.getTupleSemigroup = exports.getFirstSemigroup = exports.getLastSemigroup = exports.getObjectSemigroup = exports.semigroupVoid = exports.concatAll = exports.last = exports.first = exports.intercalate = exports.tuple = exports.struct = exports.reverse = exports.constant = exports.max = exports.min = void 0;
      var function_1 = require_function();
      var _ = __importStar(require_internal());
      var M = __importStar(require_Magma());
      var Or = __importStar(require_Ord());
      var min = function(O) {
        return {
          concat: Or.min(O)
        };
      };
      exports.min = min;
      var max = function(O) {
        return {
          concat: Or.max(O)
        };
      };
      exports.max = max;
      var constant = function(a) {
        return {
          concat: function() {
            return a;
          }
        };
      };
      exports.constant = constant;
      exports.reverse = M.reverse;
      var struct = function(semigroups) {
        return {
          concat: function(first2, second) {
            var r = {};
            for (var k in semigroups) {
              if (_.has.call(semigroups, k)) {
                r[k] = semigroups[k].concat(first2[k], second[k]);
              }
            }
            return r;
          }
        };
      };
      exports.struct = struct;
      var tuple = function() {
        var semigroups = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          semigroups[_i] = arguments[_i];
        }
        return {
          concat: function(first2, second) {
            return semigroups.map(function(s, i) {
              return s.concat(first2[i], second[i]);
            });
          }
        };
      };
      exports.tuple = tuple;
      var intercalate = function(middle) {
        return function(S) {
          return {
            concat: function(x, y) {
              return S.concat(x, S.concat(middle, y));
            }
          };
        };
      };
      exports.intercalate = intercalate;
      var first = function() {
        return { concat: function_1.identity };
      };
      exports.first = first;
      var last = function() {
        return { concat: function(_2, y) {
          return y;
        } };
      };
      exports.last = last;
      exports.concatAll = M.concatAll;
      exports.semigroupVoid = exports.constant(void 0);
      var getObjectSemigroup = function() {
        return {
          concat: function(first2, second) {
            return Object.assign({}, first2, second);
          }
        };
      };
      exports.getObjectSemigroup = getObjectSemigroup;
      exports.getLastSemigroup = exports.last;
      exports.getFirstSemigroup = exports.first;
      exports.getTupleSemigroup = exports.tuple;
      exports.getStructSemigroup = exports.struct;
      exports.getDualSemigroup = exports.reverse;
      exports.getJoinSemigroup = exports.max;
      exports.getMeetSemigroup = exports.min;
      exports.getIntercalateSemigroup = exports.intercalate;
      function fold2(S) {
        var concatAllS = exports.concatAll(S);
        return function(startWith, as) {
          return as === void 0 ? concatAllS(startWith) : concatAllS(startWith)(as);
        };
      }
      exports.fold = fold2;
      exports.semigroupAll = {
        concat: function(x, y) {
          return x && y;
        }
      };
      exports.semigroupAny = {
        concat: function(x, y) {
          return x || y;
        }
      };
      exports.getFunctionSemigroup = function_1.getSemigroup;
      exports.semigroupString = {
        concat: function(x, y) {
          return x + y;
        }
      };
      exports.semigroupSum = {
        concat: function(x, y) {
          return x + y;
        }
      };
      exports.semigroupProduct = {
        concat: function(x, y) {
          return x * y;
        }
      };
    }
  });

  // node_modules/fp-ts/lib/ReadonlyNonEmptyArray.js
  var require_ReadonlyNonEmptyArray = __commonJS({
    "node_modules/fp-ts/lib/ReadonlyNonEmptyArray.js"(exports) {
      "use strict";
      var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() {
          return m[k];
        } });
      } : function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        o[k2] = m[k];
      });
      var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      } : function(o, v) {
        o["default"] = v;
      });
      var __importStar = exports && exports.__importStar || function(mod) {
        if (mod && mod.__esModule)
          return mod;
        var result = {};
        if (mod != null) {
          for (var k in mod)
            if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
              __createBinding(result, mod, k);
        }
        __setModuleDefault(result, mod);
        return result;
      };
      var __spreadArray = exports && exports.__spreadArray || function(to, from) {
        for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
          to[j] = from[i];
        return to;
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.reduceRight = exports.foldMap = exports.reduce = exports.mapWithIndex = exports.map = exports.flatten = exports.duplicate = exports.extend = exports.chain = exports.ap = exports.alt = exports.altW = exports.of = exports.chunksOf = exports.splitAt = exports.chop = exports.chainWithIndex = exports.intersperse = exports.prependAll = exports.unzip = exports.zip = exports.zipWith = exports.modifyAt = exports.updateAt = exports.sort = exports.groupBy = exports.group = exports.reverse = exports.concat = exports.concatW = exports.fromArray = exports.unappend = exports.unprepend = exports.range = exports.replicate = exports.makeBy = exports.fromReadonlyArray = exports.rotate = exports.union = exports.sortBy = exports.uniq = exports.unsafeUpdateAt = exports.unsafeInsertAt = exports.append = exports.appendW = exports.prepend = exports.prependW = exports.isOutOfBound = exports.isNonEmpty = exports.empty = void 0;
      exports.uncons = exports.filterWithIndex = exports.filter = exports.groupSort = exports.updateLast = exports.modifyLast = exports.updateHead = exports.modifyHead = exports.matchRight = exports.matchLeft = exports.concatAll = exports.max = exports.min = exports.init = exports.last = exports.tail = exports.head = exports.apS = exports.bind = exports.bindTo = exports.Do = exports.Comonad = exports.Alt = exports.TraversableWithIndex = exports.Traversable = exports.FoldableWithIndex = exports.Foldable = exports.Monad = exports.chainFirst = exports.Chain = exports.Applicative = exports.apSecond = exports.apFirst = exports.Apply = exports.FunctorWithIndex = exports.Pointed = exports.flap = exports.Functor = exports.getUnionSemigroup = exports.getEq = exports.getSemigroup = exports.getShow = exports.URI = exports.extract = exports.traverseWithIndex = exports.sequence = exports.traverse = exports.reduceRightWithIndex = exports.foldMapWithIndex = exports.reduceWithIndex = void 0;
      exports.readonlyNonEmptyArray = exports.fold = exports.prependToAll = exports.insertAt = exports.snoc = exports.cons = exports.unsnoc = void 0;
      var Apply_1 = require_Apply();
      var Chain_1 = require_Chain();
      var Eq_1 = require_Eq();
      var function_1 = require_function();
      var Functor_1 = require_Functor();
      var _ = __importStar(require_internal());
      var Ord_1 = require_Ord();
      var Se = __importStar(require_Semigroup());
      exports.empty = _.emptyReadonlyArray;
      exports.isNonEmpty = _.isNonEmpty;
      var isOutOfBound = function(i, as) {
        return i < 0 || i >= as.length;
      };
      exports.isOutOfBound = isOutOfBound;
      var prependW = function(head) {
        return function(tail) {
          return __spreadArray([head], tail);
        };
      };
      exports.prependW = prependW;
      exports.prepend = exports.prependW;
      var appendW = function(end) {
        return function(init2) {
          return __spreadArray(__spreadArray([], init2), [end]);
        };
      };
      exports.appendW = appendW;
      exports.append = exports.appendW;
      var unsafeInsertAt = function(i, a, as) {
        if (exports.isNonEmpty(as)) {
          var xs = _.fromReadonlyNonEmptyArray(as);
          xs.splice(i, 0, a);
          return xs;
        }
        return [a];
      };
      exports.unsafeInsertAt = unsafeInsertAt;
      var unsafeUpdateAt = function(i, a, as) {
        if (as[i] === a) {
          return as;
        } else {
          var xs = _.fromReadonlyNonEmptyArray(as);
          xs[i] = a;
          return xs;
        }
      };
      exports.unsafeUpdateAt = unsafeUpdateAt;
      var uniq = function(E) {
        return function(as) {
          if (as.length === 1) {
            return as;
          }
          var out = [exports.head(as)];
          var rest = exports.tail(as);
          var _loop_1 = function(a2) {
            if (out.every(function(o) {
              return !E.equals(o, a2);
            })) {
              out.push(a2);
            }
          };
          for (var _i = 0, rest_1 = rest; _i < rest_1.length; _i++) {
            var a = rest_1[_i];
            _loop_1(a);
          }
          return out;
        };
      };
      exports.uniq = uniq;
      var sortBy = function(ords) {
        if (exports.isNonEmpty(ords)) {
          var M = Ord_1.getMonoid();
          return exports.sort(ords.reduce(M.concat, M.empty));
        }
        return function_1.identity;
      };
      exports.sortBy = sortBy;
      var union2 = function(E) {
        var uniqE = exports.uniq(E);
        return function(second) {
          return function(first) {
            return uniqE(function_1.pipe(first, concat(second)));
          };
        };
      };
      exports.union = union2;
      var rotate = function(n) {
        return function(as) {
          var len = as.length;
          var m = Math.round(n) % len;
          if (exports.isOutOfBound(Math.abs(m), as) || m === 0) {
            return as;
          }
          if (m < 0) {
            var _a = exports.splitAt(-m)(as), f = _a[0], s = _a[1];
            return function_1.pipe(s, concat(f));
          } else {
            return exports.rotate(m - len)(as);
          }
        };
      };
      exports.rotate = rotate;
      var fromReadonlyArray = function(as) {
        return exports.isNonEmpty(as) ? _.some(as) : _.none;
      };
      exports.fromReadonlyArray = fromReadonlyArray;
      var makeBy = function(f) {
        return function(n) {
          var j = Math.max(0, Math.floor(n));
          var out = [f(0)];
          for (var i = 1; i < j; i++) {
            out.push(f(i));
          }
          return out;
        };
      };
      exports.makeBy = makeBy;
      var replicate = function(a) {
        return exports.makeBy(function() {
          return a;
        });
      };
      exports.replicate = replicate;
      var range = function(start, end) {
        return start <= end ? exports.makeBy(function(i) {
          return start + i;
        })(end - start + 1) : [start];
      };
      exports.range = range;
      var unprepend = function(as) {
        return [exports.head(as), exports.tail(as)];
      };
      exports.unprepend = unprepend;
      var unappend = function(as) {
        return [exports.init(as), exports.last(as)];
      };
      exports.unappend = unappend;
      var fromArray = function(as) {
        return exports.fromReadonlyArray(as.slice());
      };
      exports.fromArray = fromArray;
      function concatW(second) {
        return function(first) {
          return first.concat(second);
        };
      }
      exports.concatW = concatW;
      function concat(x, y) {
        return y ? x.concat(y) : function(y2) {
          return y2.concat(x);
        };
      }
      exports.concat = concat;
      var reverse = function(as) {
        return as.length === 1 ? as : __spreadArray([exports.last(as)], as.slice(0, -1).reverse());
      };
      exports.reverse = reverse;
      function group(E) {
        return function(as) {
          var len = as.length;
          if (len === 0) {
            return exports.empty;
          }
          var out = [];
          var head = as[0];
          var nea = [head];
          for (var i = 1; i < len; i++) {
            var a = as[i];
            if (E.equals(a, head)) {
              nea.push(a);
            } else {
              out.push(nea);
              head = a;
              nea = [head];
            }
          }
          out.push(nea);
          return out;
        };
      }
      exports.group = group;
      var groupBy = function(f) {
        return function(as) {
          var out = {};
          for (var _i = 0, as_1 = as; _i < as_1.length; _i++) {
            var a = as_1[_i];
            var k = f(a);
            if (out.hasOwnProperty(k)) {
              out[k].push(a);
            } else {
              out[k] = [a];
            }
          }
          return out;
        };
      };
      exports.groupBy = groupBy;
      var sort = function(O) {
        return function(as) {
          return as.length === 1 ? as : as.slice().sort(O.compare);
        };
      };
      exports.sort = sort;
      var updateAt = function(i, a) {
        return exports.modifyAt(i, function() {
          return a;
        });
      };
      exports.updateAt = updateAt;
      var modifyAt = function(i, f) {
        return function(as) {
          return exports.isOutOfBound(i, as) ? _.none : _.some(exports.unsafeUpdateAt(i, f(as[i]), as));
        };
      };
      exports.modifyAt = modifyAt;
      var zipWith = function(as, bs, f) {
        var cs = [f(as[0], bs[0])];
        var len = Math.min(as.length, bs.length);
        for (var i = 1; i < len; i++) {
          cs[i] = f(as[i], bs[i]);
        }
        return cs;
      };
      exports.zipWith = zipWith;
      function zip(as, bs) {
        if (bs === void 0) {
          return function(bs2) {
            return zip(bs2, as);
          };
        }
        return exports.zipWith(as, bs, function(a, b) {
          return [a, b];
        });
      }
      exports.zip = zip;
      var unzip = function(abs) {
        var fa = [abs[0][0]];
        var fb = [abs[0][1]];
        for (var i = 1; i < abs.length; i++) {
          fa[i] = abs[i][0];
          fb[i] = abs[i][1];
        }
        return [fa, fb];
      };
      exports.unzip = unzip;
      var prependAll = function(middle) {
        return function(as) {
          var out = [middle, as[0]];
          for (var i = 1; i < as.length; i++) {
            out.push(middle, as[i]);
          }
          return out;
        };
      };
      exports.prependAll = prependAll;
      var intersperse = function(middle) {
        return function(as) {
          var rest = exports.tail(as);
          return exports.isNonEmpty(rest) ? function_1.pipe(rest, exports.prependAll(middle), exports.prepend(exports.head(as))) : as;
        };
      };
      exports.intersperse = intersperse;
      var chainWithIndex = function(f) {
        return function(as) {
          var out = _.fromReadonlyNonEmptyArray(f(0, exports.head(as)));
          for (var i = 1; i < as.length; i++) {
            out.push.apply(out, f(i, as[i]));
          }
          return out;
        };
      };
      exports.chainWithIndex = chainWithIndex;
      var chop = function(f) {
        return function(as) {
          var _a = f(as), b = _a[0], rest = _a[1];
          var out = [b];
          var next = rest;
          while (exports.isNonEmpty(next)) {
            var _b = f(next), b_1 = _b[0], rest_2 = _b[1];
            out.push(b_1);
            next = rest_2;
          }
          return out;
        };
      };
      exports.chop = chop;
      var splitAt = function(n) {
        return function(as) {
          var m = Math.max(1, n);
          return m >= as.length ? [as, exports.empty] : [function_1.pipe(as.slice(1, m), exports.prepend(exports.head(as))), as.slice(m)];
        };
      };
      exports.splitAt = splitAt;
      var chunksOf = function(n) {
        return exports.chop(exports.splitAt(n));
      };
      exports.chunksOf = chunksOf;
      var _map = function(fa, f) {
        return function_1.pipe(fa, exports.map(f));
      };
      var _mapWithIndex = function(fa, f) {
        return function_1.pipe(fa, exports.mapWithIndex(f));
      };
      var _ap = function(fab, fa) {
        return function_1.pipe(fab, exports.ap(fa));
      };
      var _chain = function(ma, f) {
        return function_1.pipe(ma, exports.chain(f));
      };
      var _extend = function(wa, f) {
        return function_1.pipe(wa, exports.extend(f));
      };
      var _reduce = function(fa, b, f) {
        return function_1.pipe(fa, exports.reduce(b, f));
      };
      var _foldMap = function(M) {
        var foldMapM = exports.foldMap(M);
        return function(fa, f) {
          return function_1.pipe(fa, foldMapM(f));
        };
      };
      var _reduceRight = function(fa, b, f) {
        return function_1.pipe(fa, exports.reduceRight(b, f));
      };
      var _traverse = function(F) {
        var traverseF = exports.traverse(F);
        return function(ta, f) {
          return function_1.pipe(ta, traverseF(f));
        };
      };
      var _alt = function(fa, that) {
        return function_1.pipe(fa, exports.alt(that));
      };
      var _reduceWithIndex = function(fa, b, f) {
        return function_1.pipe(fa, exports.reduceWithIndex(b, f));
      };
      var _foldMapWithIndex = function(M) {
        var foldMapWithIndexM = exports.foldMapWithIndex(M);
        return function(fa, f) {
          return function_1.pipe(fa, foldMapWithIndexM(f));
        };
      };
      var _reduceRightWithIndex = function(fa, b, f) {
        return function_1.pipe(fa, exports.reduceRightWithIndex(b, f));
      };
      var _traverseWithIndex = function(F) {
        var traverseWithIndexF = exports.traverseWithIndex(F);
        return function(ta, f) {
          return function_1.pipe(ta, traverseWithIndexF(f));
        };
      };
      exports.of = _.singleton;
      var altW = function(that) {
        return function(as) {
          return function_1.pipe(as, concatW(that()));
        };
      };
      exports.altW = altW;
      exports.alt = exports.altW;
      var ap = function(as) {
        return exports.chain(function(f) {
          return function_1.pipe(as, exports.map(f));
        });
      };
      exports.ap = ap;
      var chain = function(f) {
        return exports.chainWithIndex(function(_2, a) {
          return f(a);
        });
      };
      exports.chain = chain;
      var extend = function(f) {
        return function(as) {
          var next = exports.tail(as);
          var out = [f(as)];
          while (exports.isNonEmpty(next)) {
            out.push(f(next));
            next = exports.tail(next);
          }
          return out;
        };
      };
      exports.extend = extend;
      exports.duplicate = /* @__PURE__ */ exports.extend(function_1.identity);
      exports.flatten = /* @__PURE__ */ exports.chain(function_1.identity);
      var map = function(f) {
        return exports.mapWithIndex(function(_2, a) {
          return f(a);
        });
      };
      exports.map = map;
      var mapWithIndex = function(f) {
        return function(as) {
          var out = [f(0, exports.head(as))];
          for (var i = 1; i < as.length; i++) {
            out.push(f(i, as[i]));
          }
          return out;
        };
      };
      exports.mapWithIndex = mapWithIndex;
      var reduce = function(b, f) {
        return exports.reduceWithIndex(b, function(_2, b2, a) {
          return f(b2, a);
        });
      };
      exports.reduce = reduce;
      var foldMap = function(S) {
        return function(f) {
          return function(as) {
            return as.slice(1).reduce(function(s, a) {
              return S.concat(s, f(a));
            }, f(as[0]));
          };
        };
      };
      exports.foldMap = foldMap;
      var reduceRight = function(b, f) {
        return exports.reduceRightWithIndex(b, function(_2, b2, a) {
          return f(b2, a);
        });
      };
      exports.reduceRight = reduceRight;
      var reduceWithIndex = function(b, f) {
        return function(as) {
          return as.reduce(function(b2, a, i) {
            return f(i, b2, a);
          }, b);
        };
      };
      exports.reduceWithIndex = reduceWithIndex;
      var foldMapWithIndex = function(S) {
        return function(f) {
          return function(as) {
            return as.slice(1).reduce(function(s, a, i) {
              return S.concat(s, f(i + 1, a));
            }, f(0, as[0]));
          };
        };
      };
      exports.foldMapWithIndex = foldMapWithIndex;
      var reduceRightWithIndex = function(b, f) {
        return function(as) {
          return as.reduceRight(function(b2, a, i) {
            return f(i, a, b2);
          }, b);
        };
      };
      exports.reduceRightWithIndex = reduceRightWithIndex;
      var traverse = function(F) {
        var traverseWithIndexF = exports.traverseWithIndex(F);
        return function(f) {
          return traverseWithIndexF(function(_2, a) {
            return f(a);
          });
        };
      };
      exports.traverse = traverse;
      var sequence = function(F) {
        return exports.traverseWithIndex(F)(function_1.SK);
      };
      exports.sequence = sequence;
      var traverseWithIndex = function(F) {
        return function(f) {
          return function(as) {
            var out = F.map(f(0, exports.head(as)), exports.of);
            for (var i = 1; i < as.length; i++) {
              out = F.ap(F.map(out, function(bs) {
                return function(b) {
                  return function_1.pipe(bs, exports.append(b));
                };
              }), f(i, as[i]));
            }
            return out;
          };
        };
      };
      exports.traverseWithIndex = traverseWithIndex;
      exports.extract = _.head;
      exports.URI = "ReadonlyNonEmptyArray";
      var getShow = function(S) {
        return {
          show: function(as) {
            return "[" + as.map(S.show).join(", ") + "]";
          }
        };
      };
      exports.getShow = getShow;
      var getSemigroup = function() {
        return {
          concat
        };
      };
      exports.getSemigroup = getSemigroup;
      var getEq = function(E) {
        return Eq_1.fromEquals(function(xs, ys) {
          return xs.length === ys.length && xs.every(function(x, i) {
            return E.equals(x, ys[i]);
          });
        });
      };
      exports.getEq = getEq;
      var getUnionSemigroup = function(E) {
        var unionE = exports.union(E);
        return {
          concat: function(first, second) {
            return unionE(second)(first);
          }
        };
      };
      exports.getUnionSemigroup = getUnionSemigroup;
      exports.Functor = {
        URI: exports.URI,
        map: _map
      };
      exports.flap = /* @__PURE__ */ Functor_1.flap(exports.Functor);
      exports.Pointed = {
        URI: exports.URI,
        of: exports.of
      };
      exports.FunctorWithIndex = {
        URI: exports.URI,
        map: _map,
        mapWithIndex: _mapWithIndex
      };
      exports.Apply = {
        URI: exports.URI,
        map: _map,
        ap: _ap
      };
      exports.apFirst = /* @__PURE__ */ Apply_1.apFirst(exports.Apply);
      exports.apSecond = /* @__PURE__ */ Apply_1.apSecond(exports.Apply);
      exports.Applicative = {
        URI: exports.URI,
        map: _map,
        ap: _ap,
        of: exports.of
      };
      exports.Chain = {
        URI: exports.URI,
        map: _map,
        ap: _ap,
        chain: _chain
      };
      exports.chainFirst = /* @__PURE__ */ Chain_1.chainFirst(exports.Chain);
      exports.Monad = {
        URI: exports.URI,
        map: _map,
        ap: _ap,
        of: exports.of,
        chain: _chain
      };
      exports.Foldable = {
        URI: exports.URI,
        reduce: _reduce,
        foldMap: _foldMap,
        reduceRight: _reduceRight
      };
      exports.FoldableWithIndex = {
        URI: exports.URI,
        reduce: _reduce,
        foldMap: _foldMap,
        reduceRight: _reduceRight,
        reduceWithIndex: _reduceWithIndex,
        foldMapWithIndex: _foldMapWithIndex,
        reduceRightWithIndex: _reduceRightWithIndex
      };
      exports.Traversable = {
        URI: exports.URI,
        map: _map,
        reduce: _reduce,
        foldMap: _foldMap,
        reduceRight: _reduceRight,
        traverse: _traverse,
        sequence: exports.sequence
      };
      exports.TraversableWithIndex = {
        URI: exports.URI,
        map: _map,
        mapWithIndex: _mapWithIndex,
        reduce: _reduce,
        foldMap: _foldMap,
        reduceRight: _reduceRight,
        traverse: _traverse,
        sequence: exports.sequence,
        reduceWithIndex: _reduceWithIndex,
        foldMapWithIndex: _foldMapWithIndex,
        reduceRightWithIndex: _reduceRightWithIndex,
        traverseWithIndex: _traverseWithIndex
      };
      exports.Alt = {
        URI: exports.URI,
        map: _map,
        alt: _alt
      };
      exports.Comonad = {
        URI: exports.URI,
        map: _map,
        extend: _extend,
        extract: exports.extract
      };
      exports.Do = /* @__PURE__ */ exports.of(_.emptyRecord);
      exports.bindTo = /* @__PURE__ */ Functor_1.bindTo(exports.Functor);
      exports.bind = /* @__PURE__ */ Chain_1.bind(exports.Chain);
      exports.apS = /* @__PURE__ */ Apply_1.apS(exports.Apply);
      exports.head = exports.extract;
      exports.tail = _.tail;
      var last = function(as) {
        return as[as.length - 1];
      };
      exports.last = last;
      var init = function(as) {
        return as.slice(0, -1);
      };
      exports.init = init;
      var min = function(O) {
        var S = Se.min(O);
        return function(as) {
          return as.reduce(S.concat);
        };
      };
      exports.min = min;
      var max = function(O) {
        var S = Se.max(O);
        return function(as) {
          return as.reduce(S.concat);
        };
      };
      exports.max = max;
      var concatAll = function(S) {
        return function(as) {
          return as.reduce(S.concat);
        };
      };
      exports.concatAll = concatAll;
      var matchLeft = function(f) {
        return function(as) {
          return f(exports.head(as), exports.tail(as));
        };
      };
      exports.matchLeft = matchLeft;
      var matchRight = function(f) {
        return function(as) {
          return f(exports.init(as), exports.last(as));
        };
      };
      exports.matchRight = matchRight;
      var modifyHead = function(f) {
        return function(as) {
          return __spreadArray([
            f(exports.head(as))
          ], exports.tail(as));
        };
      };
      exports.modifyHead = modifyHead;
      var updateHead = function(a) {
        return exports.modifyHead(function() {
          return a;
        });
      };
      exports.updateHead = updateHead;
      var modifyLast = function(f) {
        return function(as) {
          return function_1.pipe(exports.init(as), exports.append(f(exports.last(as))));
        };
      };
      exports.modifyLast = modifyLast;
      var updateLast = function(a) {
        return exports.modifyLast(function() {
          return a;
        });
      };
      exports.updateLast = updateLast;
      function groupSort(O) {
        var sortO = exports.sort(O);
        var groupO = group(O);
        return function(as) {
          return exports.isNonEmpty(as) ? groupO(sortO(as)) : exports.empty;
        };
      }
      exports.groupSort = groupSort;
      function filter(predicate) {
        return exports.filterWithIndex(function(_2, a) {
          return predicate(a);
        });
      }
      exports.filter = filter;
      var filterWithIndex = function(predicate) {
        return function(as) {
          return exports.fromReadonlyArray(as.filter(function(a, i) {
            return predicate(i, a);
          }));
        };
      };
      exports.filterWithIndex = filterWithIndex;
      exports.uncons = exports.unprepend;
      exports.unsnoc = exports.unappend;
      function cons(head, tail) {
        return tail === void 0 ? exports.prepend(head) : function_1.pipe(tail, exports.prepend(head));
      }
      exports.cons = cons;
      var snoc = function(init2, end) {
        return function_1.pipe(init2, concat([end]));
      };
      exports.snoc = snoc;
      var insertAt = function(i, a) {
        return function(as) {
          return i < 0 || i > as.length ? _.none : _.some(exports.unsafeInsertAt(i, a, as));
        };
      };
      exports.insertAt = insertAt;
      exports.prependToAll = exports.prependAll;
      exports.fold = exports.concatAll;
      exports.readonlyNonEmptyArray = {
        URI: exports.URI,
        of: exports.of,
        map: _map,
        mapWithIndex: _mapWithIndex,
        ap: _ap,
        chain: _chain,
        extend: _extend,
        extract: exports.extract,
        reduce: _reduce,
        foldMap: _foldMap,
        reduceRight: _reduceRight,
        traverse: _traverse,
        sequence: exports.sequence,
        reduceWithIndex: _reduceWithIndex,
        foldMapWithIndex: _foldMapWithIndex,
        reduceRightWithIndex: _reduceRightWithIndex,
        traverseWithIndex: _traverseWithIndex,
        alt: _alt
      };
    }
  });

  // node_modules/fp-ts/lib/string.js
  var require_string = __commonJS({
    "node_modules/fp-ts/lib/string.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.endsWith = exports.startsWith = exports.includes = exports.split = exports.size = exports.isEmpty = exports.empty = exports.slice = exports.trimRight = exports.trimLeft = exports.trim = exports.replace = exports.toLowerCase = exports.toUpperCase = exports.isString = exports.Show = exports.Ord = exports.Monoid = exports.Semigroup = exports.Eq = void 0;
      var ReadonlyNonEmptyArray_1 = require_ReadonlyNonEmptyArray();
      exports.Eq = {
        equals: function(first, second) {
          return first === second;
        }
      };
      exports.Semigroup = {
        concat: function(first, second) {
          return first + second;
        }
      };
      exports.Monoid = {
        concat: exports.Semigroup.concat,
        empty: ""
      };
      exports.Ord = {
        equals: exports.Eq.equals,
        compare: function(first, second) {
          return first < second ? -1 : first > second ? 1 : 0;
        }
      };
      exports.Show = {
        show: function(s) {
          return JSON.stringify(s);
        }
      };
      var isString2 = function(u) {
        return typeof u === "string";
      };
      exports.isString = isString2;
      var toUpperCase = function(s) {
        return s.toUpperCase();
      };
      exports.toUpperCase = toUpperCase;
      var toLowerCase = function(s) {
        return s.toLowerCase();
      };
      exports.toLowerCase = toLowerCase;
      var replace = function(searchValue, replaceValue) {
        return function(s) {
          return s.replace(searchValue, replaceValue);
        };
      };
      exports.replace = replace;
      var trim = function(s) {
        return s.trim();
      };
      exports.trim = trim;
      var trimLeft = function(s) {
        return s.trimLeft();
      };
      exports.trimLeft = trimLeft;
      var trimRight = function(s) {
        return s.trimRight();
      };
      exports.trimRight = trimRight;
      var slice = function(start, end) {
        return function(s) {
          return s.slice(start, end);
        };
      };
      exports.slice = slice;
      exports.empty = "";
      var isEmpty = function(s) {
        return s.length === 0;
      };
      exports.isEmpty = isEmpty;
      var size = function(s) {
        return s.length;
      };
      exports.size = size;
      var split = function(separator) {
        return function(s) {
          var out = s.split(separator);
          return ReadonlyNonEmptyArray_1.isNonEmpty(out) ? out : [s];
        };
      };
      exports.split = split;
      var includes = function(searchString, position) {
        return function(s) {
          return s.includes(searchString, position);
        };
      };
      exports.includes = includes;
      var startsWith = function(searchString, position) {
        return function(s) {
          return s.startsWith(searchString, position);
        };
      };
      exports.startsWith = startsWith;
      var endsWith = function(searchString, position) {
        return function(s) {
          return s.endsWith(searchString, position);
        };
      };
      exports.endsWith = endsWith;
    }
  });

  // node_modules/fp-ts/lib/Applicative.js
  var require_Applicative = __commonJS({
    "node_modules/fp-ts/lib/Applicative.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.getApplicativeComposition = exports.getApplicativeMonoid = void 0;
      var Apply_1 = require_Apply();
      var function_1 = require_function();
      var Functor_1 = require_Functor();
      function getApplicativeMonoid(F) {
        var f = Apply_1.getApplySemigroup(F);
        return function(M) {
          return {
            concat: f(M).concat,
            empty: F.of(M.empty)
          };
        };
      }
      exports.getApplicativeMonoid = getApplicativeMonoid;
      function getApplicativeComposition(F, G) {
        var map = Functor_1.getFunctorComposition(F, G).map;
        var _ap = Apply_1.ap(F, G);
        return {
          map,
          of: function(a) {
            return F.of(G.of(a));
          },
          ap: function(fgab, fga) {
            return function_1.pipe(fgab, _ap(fga));
          }
        };
      }
      exports.getApplicativeComposition = getApplicativeComposition;
    }
  });

  // node_modules/fp-ts/lib/ChainRec.js
  var require_ChainRec = __commonJS({
    "node_modules/fp-ts/lib/ChainRec.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.tailRec = void 0;
      var tailRec = function(startWith, f) {
        var ab = f(startWith);
        while (ab._tag === "Left") {
          ab = f(ab.left);
        }
        return ab.right;
      };
      exports.tailRec = tailRec;
    }
  });

  // node_modules/fp-ts/lib/FromEither.js
  var require_FromEither = __commonJS({
    "node_modules/fp-ts/lib/FromEither.js"(exports) {
      "use strict";
      var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() {
          return m[k];
        } });
      } : function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        o[k2] = m[k];
      });
      var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      } : function(o, v) {
        o["default"] = v;
      });
      var __importStar = exports && exports.__importStar || function(mod) {
        if (mod && mod.__esModule)
          return mod;
        var result = {};
        if (mod != null) {
          for (var k in mod)
            if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
              __createBinding(result, mod, k);
        }
        __setModuleDefault(result, mod);
        return result;
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.filterOrElse = exports.chainEitherK = exports.fromEitherK = exports.chainOptionK = exports.fromOptionK = exports.fromPredicate = exports.fromOption = void 0;
      var function_1 = require_function();
      var _ = __importStar(require_internal());
      function fromOption(F) {
        return function(onNone) {
          return function(ma) {
            return F.fromEither(_.isNone(ma) ? _.left(onNone()) : _.right(ma.value));
          };
        };
      }
      exports.fromOption = fromOption;
      function fromPredicate(F) {
        return function(predicate, onFalse) {
          return function(a) {
            return F.fromEither(predicate(a) ? _.right(a) : _.left(onFalse(a)));
          };
        };
      }
      exports.fromPredicate = fromPredicate;
      function fromOptionK(F) {
        var fromOptionF = fromOption(F);
        return function(onNone) {
          var from = fromOptionF(onNone);
          return function(f) {
            return function_1.flow(f, from);
          };
        };
      }
      exports.fromOptionK = fromOptionK;
      function chainOptionK(F, M) {
        var fromOptionKF = fromOptionK(F);
        return function(onNone) {
          var from = fromOptionKF(onNone);
          return function(f) {
            return function(ma) {
              return M.chain(ma, from(f));
            };
          };
        };
      }
      exports.chainOptionK = chainOptionK;
      function fromEitherK(F) {
        return function(f) {
          return function_1.flow(f, F.fromEither);
        };
      }
      exports.fromEitherK = fromEitherK;
      function chainEitherK(F, M) {
        var fromEitherKF = fromEitherK(F);
        return function(f) {
          return function(ma) {
            return M.chain(ma, fromEitherKF(f));
          };
        };
      }
      exports.chainEitherK = chainEitherK;
      function filterOrElse(F, M) {
        return function(predicate, onFalse) {
          return function(ma) {
            return M.chain(ma, function(a) {
              return F.fromEither(predicate(a) ? _.right(a) : _.left(onFalse(a)));
            });
          };
        };
      }
      exports.filterOrElse = filterOrElse;
    }
  });

  // node_modules/fp-ts/lib/Separated.js
  var require_Separated = __commonJS({
    "node_modules/fp-ts/lib/Separated.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.right = exports.left = exports.flap = exports.Functor = exports.Bifunctor = exports.URI = exports.bimap = exports.mapLeft = exports.map = exports.separated = void 0;
      var function_1 = require_function();
      var Functor_1 = require_Functor();
      var separated = function(left2, right2) {
        return { left: left2, right: right2 };
      };
      exports.separated = separated;
      var _map = function(fa, f) {
        return function_1.pipe(fa, exports.map(f));
      };
      var _mapLeft = function(fa, f) {
        return function_1.pipe(fa, exports.mapLeft(f));
      };
      var _bimap = function(fa, g, f) {
        return function_1.pipe(fa, exports.bimap(g, f));
      };
      var map = function(f) {
        return function(fa) {
          return exports.separated(exports.left(fa), f(exports.right(fa)));
        };
      };
      exports.map = map;
      var mapLeft = function(f) {
        return function(fa) {
          return exports.separated(f(exports.left(fa)), exports.right(fa));
        };
      };
      exports.mapLeft = mapLeft;
      var bimap = function(f, g) {
        return function(fa) {
          return exports.separated(f(exports.left(fa)), g(exports.right(fa)));
        };
      };
      exports.bimap = bimap;
      exports.URI = "Separated";
      exports.Bifunctor = {
        URI: exports.URI,
        mapLeft: _mapLeft,
        bimap: _bimap
      };
      exports.Functor = {
        URI: exports.URI,
        map: _map
      };
      exports.flap = /* @__PURE__ */ Functor_1.flap(exports.Functor);
      var left = function(s) {
        return s.left;
      };
      exports.left = left;
      var right = function(s) {
        return s.right;
      };
      exports.right = right;
    }
  });

  // node_modules/fp-ts/lib/Witherable.js
  var require_Witherable = __commonJS({
    "node_modules/fp-ts/lib/Witherable.js"(exports) {
      "use strict";
      var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() {
          return m[k];
        } });
      } : function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        o[k2] = m[k];
      });
      var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      } : function(o, v) {
        o["default"] = v;
      });
      var __importStar = exports && exports.__importStar || function(mod) {
        if (mod && mod.__esModule)
          return mod;
        var result = {};
        if (mod != null) {
          for (var k in mod)
            if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
              __createBinding(result, mod, k);
        }
        __setModuleDefault(result, mod);
        return result;
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.filterE = exports.witherDefault = exports.wiltDefault = void 0;
      var _ = __importStar(require_internal());
      function wiltDefault(T, C) {
        return function(F) {
          var traverseF = T.traverse(F);
          return function(wa, f) {
            return F.map(traverseF(wa, f), C.separate);
          };
        };
      }
      exports.wiltDefault = wiltDefault;
      function witherDefault(T, C) {
        return function(F) {
          var traverseF = T.traverse(F);
          return function(wa, f) {
            return F.map(traverseF(wa, f), C.compact);
          };
        };
      }
      exports.witherDefault = witherDefault;
      function filterE(W) {
        return function(F) {
          var witherF = W.wither(F);
          return function(predicate) {
            return function(ga) {
              return witherF(ga, function(a) {
                return F.map(predicate(a), function(b) {
                  return b ? _.some(a) : _.none;
                });
              });
            };
          };
        };
      }
      exports.filterE = filterE;
    }
  });

  // node_modules/fp-ts/lib/Either.js
  var require_Either = __commonJS({
    "node_modules/fp-ts/lib/Either.js"(exports) {
      "use strict";
      var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() {
          return m[k];
        } });
      } : function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        o[k2] = m[k];
      });
      var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      } : function(o, v) {
        o["default"] = v;
      });
      var __importStar = exports && exports.__importStar || function(mod) {
        if (mod && mod.__esModule)
          return mod;
        var result = {};
        if (mod != null) {
          for (var k in mod)
            if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
              __createBinding(result, mod, k);
        }
        __setModuleDefault(result, mod);
        return result;
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.fold = exports.match = exports.foldW = exports.matchW = exports.isRight = exports.isLeft = exports.fromOption = exports.fromPredicate = exports.FromEither = exports.MonadThrow = exports.throwError = exports.ChainRec = exports.Extend = exports.extend = exports.Alt = exports.alt = exports.altW = exports.Bifunctor = exports.mapLeft = exports.bimap = exports.Traversable = exports.sequence = exports.traverse = exports.Foldable = exports.reduceRight = exports.foldMap = exports.reduce = exports.Monad = exports.Chain = exports.chain = exports.chainW = exports.Applicative = exports.Apply = exports.ap = exports.apW = exports.Pointed = exports.of = exports.Functor = exports.map = exports.getAltValidation = exports.getApplicativeValidation = exports.getWitherable = exports.getFilterable = exports.getCompactable = exports.getSemigroup = exports.getEq = exports.getShow = exports.URI = exports.right = exports.left = void 0;
      exports.getValidation = exports.getValidationMonoid = exports.getValidationSemigroup = exports.getApplyMonoid = exports.getApplySemigroup = exports.either = exports.stringifyJSON = exports.parseJSON = exports.sequenceArray = exports.traverseArray = exports.traverseArrayWithIndex = exports.traverseReadonlyArrayWithIndex = exports.traverseReadonlyNonEmptyArrayWithIndex = exports.ApT = exports.apSW = exports.apS = exports.bindW = exports.bind = exports.bindTo = exports.Do = exports.exists = exports.elem = exports.toError = exports.toUnion = exports.chainNullableK = exports.fromNullableK = exports.tryCatchK = exports.tryCatch = exports.fromNullable = exports.orElse = exports.orElseW = exports.swap = exports.filterOrElseW = exports.filterOrElse = exports.chainOptionK = exports.fromOptionK = exports.duplicate = exports.flatten = exports.flattenW = exports.chainFirstW = exports.chainFirst = exports.apSecond = exports.apFirst = exports.flap = exports.getOrElse = exports.getOrElseW = void 0;
      var Applicative_1 = require_Applicative();
      var Apply_1 = require_Apply();
      var Chain_1 = require_Chain();
      var ChainRec_1 = require_ChainRec();
      var FromEither_1 = require_FromEither();
      var function_1 = require_function();
      var Functor_1 = require_Functor();
      var _ = __importStar(require_internal());
      var Separated_1 = require_Separated();
      var Witherable_1 = require_Witherable();
      exports.left = _.left;
      exports.right = _.right;
      var _map = function(fa, f) {
        return function_1.pipe(fa, exports.map(f));
      };
      var _ap = function(fab, fa) {
        return function_1.pipe(fab, exports.ap(fa));
      };
      var _chain = function(ma, f) {
        return function_1.pipe(ma, exports.chain(f));
      };
      var _reduce = function(fa, b, f) {
        return function_1.pipe(fa, exports.reduce(b, f));
      };
      var _foldMap = function(M) {
        return function(fa, f) {
          var foldMapM = exports.foldMap(M);
          return function_1.pipe(fa, foldMapM(f));
        };
      };
      var _reduceRight = function(fa, b, f) {
        return function_1.pipe(fa, exports.reduceRight(b, f));
      };
      var _traverse = function(F) {
        var traverseF = exports.traverse(F);
        return function(ta, f) {
          return function_1.pipe(ta, traverseF(f));
        };
      };
      var _bimap = function(fa, f, g) {
        return function_1.pipe(fa, exports.bimap(f, g));
      };
      var _mapLeft = function(fa, f) {
        return function_1.pipe(fa, exports.mapLeft(f));
      };
      var _alt = function(fa, that) {
        return function_1.pipe(fa, exports.alt(that));
      };
      var _extend = function(wa, f) {
        return function_1.pipe(wa, exports.extend(f));
      };
      var _chainRec = function(a, f) {
        return ChainRec_1.tailRec(f(a), function(e) {
          return exports.isLeft(e) ? exports.right(exports.left(e.left)) : exports.isLeft(e.right) ? exports.left(f(e.right.left)) : exports.right(exports.right(e.right.right));
        });
      };
      exports.URI = "Either";
      var getShow = function(SE, SA) {
        return {
          show: function(ma) {
            return exports.isLeft(ma) ? "left(" + SE.show(ma.left) + ")" : "right(" + SA.show(ma.right) + ")";
          }
        };
      };
      exports.getShow = getShow;
      var getEq = function(EL, EA) {
        return {
          equals: function(x, y) {
            return x === y || (exports.isLeft(x) ? exports.isLeft(y) && EL.equals(x.left, y.left) : exports.isRight(y) && EA.equals(x.right, y.right));
          }
        };
      };
      exports.getEq = getEq;
      var getSemigroup = function(S) {
        return {
          concat: function(x, y) {
            return exports.isLeft(y) ? x : exports.isLeft(x) ? y : exports.right(S.concat(x.right, y.right));
          }
        };
      };
      exports.getSemigroup = getSemigroup;
      var getCompactable = function(M) {
        var empty = exports.left(M.empty);
        return {
          URI: exports.URI,
          _E: void 0,
          compact: function(ma) {
            return exports.isLeft(ma) ? ma : ma.right._tag === "None" ? empty : exports.right(ma.right.value);
          },
          separate: function(ma) {
            return exports.isLeft(ma) ? Separated_1.separated(ma, ma) : exports.isLeft(ma.right) ? Separated_1.separated(exports.right(ma.right.left), empty) : Separated_1.separated(empty, exports.right(ma.right.right));
          }
        };
      };
      exports.getCompactable = getCompactable;
      var getFilterable = function(M) {
        var empty = exports.left(M.empty);
        var _a = exports.getCompactable(M), compact = _a.compact, separate = _a.separate;
        var filter = function(ma, predicate) {
          return exports.isLeft(ma) ? ma : predicate(ma.right) ? ma : empty;
        };
        var partition = function(ma, p) {
          return exports.isLeft(ma) ? Separated_1.separated(ma, ma) : p(ma.right) ? Separated_1.separated(empty, exports.right(ma.right)) : Separated_1.separated(exports.right(ma.right), empty);
        };
        return {
          URI: exports.URI,
          _E: void 0,
          map: _map,
          compact,
          separate,
          filter,
          filterMap: function(ma, f) {
            if (exports.isLeft(ma)) {
              return ma;
            }
            var ob = f(ma.right);
            return ob._tag === "None" ? empty : exports.right(ob.value);
          },
          partition,
          partitionMap: function(ma, f) {
            if (exports.isLeft(ma)) {
              return Separated_1.separated(ma, ma);
            }
            var e = f(ma.right);
            return exports.isLeft(e) ? Separated_1.separated(exports.right(e.left), empty) : Separated_1.separated(empty, exports.right(e.right));
          }
        };
      };
      exports.getFilterable = getFilterable;
      var getWitherable = function(M) {
        var F_ = exports.getFilterable(M);
        var C = exports.getCompactable(M);
        return {
          URI: exports.URI,
          _E: void 0,
          map: _map,
          compact: F_.compact,
          separate: F_.separate,
          filter: F_.filter,
          filterMap: F_.filterMap,
          partition: F_.partition,
          partitionMap: F_.partitionMap,
          traverse: _traverse,
          sequence: exports.sequence,
          reduce: _reduce,
          foldMap: _foldMap,
          reduceRight: _reduceRight,
          wither: Witherable_1.witherDefault(exports.Traversable, C),
          wilt: Witherable_1.wiltDefault(exports.Traversable, C)
        };
      };
      exports.getWitherable = getWitherable;
      var getApplicativeValidation = function(SE) {
        return {
          URI: exports.URI,
          _E: void 0,
          map: _map,
          ap: function(fab, fa) {
            return exports.isLeft(fab) ? exports.isLeft(fa) ? exports.left(SE.concat(fab.left, fa.left)) : fab : exports.isLeft(fa) ? fa : exports.right(fab.right(fa.right));
          },
          of: exports.of
        };
      };
      exports.getApplicativeValidation = getApplicativeValidation;
      var getAltValidation = function(SE) {
        return {
          URI: exports.URI,
          _E: void 0,
          map: _map,
          alt: function(me, that) {
            if (exports.isRight(me)) {
              return me;
            }
            var ea = that();
            return exports.isLeft(ea) ? exports.left(SE.concat(me.left, ea.left)) : ea;
          }
        };
      };
      exports.getAltValidation = getAltValidation;
      var map = function(f) {
        return function(fa) {
          return exports.isLeft(fa) ? fa : exports.right(f(fa.right));
        };
      };
      exports.map = map;
      exports.Functor = {
        URI: exports.URI,
        map: _map
      };
      exports.of = exports.right;
      exports.Pointed = {
        URI: exports.URI,
        of: exports.of
      };
      var apW = function(fa) {
        return function(fab) {
          return exports.isLeft(fab) ? fab : exports.isLeft(fa) ? fa : exports.right(fab.right(fa.right));
        };
      };
      exports.apW = apW;
      exports.ap = exports.apW;
      exports.Apply = {
        URI: exports.URI,
        map: _map,
        ap: _ap
      };
      exports.Applicative = {
        URI: exports.URI,
        map: _map,
        ap: _ap,
        of: exports.of
      };
      var chainW = function(f) {
        return function(ma) {
          return exports.isLeft(ma) ? ma : f(ma.right);
        };
      };
      exports.chainW = chainW;
      exports.chain = exports.chainW;
      exports.Chain = {
        URI: exports.URI,
        map: _map,
        ap: _ap,
        chain: _chain
      };
      exports.Monad = {
        URI: exports.URI,
        map: _map,
        ap: _ap,
        of: exports.of,
        chain: _chain
      };
      var reduce = function(b, f) {
        return function(fa) {
          return exports.isLeft(fa) ? b : f(b, fa.right);
        };
      };
      exports.reduce = reduce;
      var foldMap = function(M) {
        return function(f) {
          return function(fa) {
            return exports.isLeft(fa) ? M.empty : f(fa.right);
          };
        };
      };
      exports.foldMap = foldMap;
      var reduceRight = function(b, f) {
        return function(fa) {
          return exports.isLeft(fa) ? b : f(fa.right, b);
        };
      };
      exports.reduceRight = reduceRight;
      exports.Foldable = {
        URI: exports.URI,
        reduce: _reduce,
        foldMap: _foldMap,
        reduceRight: _reduceRight
      };
      var traverse = function(F) {
        return function(f) {
          return function(ta) {
            return exports.isLeft(ta) ? F.of(exports.left(ta.left)) : F.map(f(ta.right), exports.right);
          };
        };
      };
      exports.traverse = traverse;
      var sequence = function(F) {
        return function(ma) {
          return exports.isLeft(ma) ? F.of(exports.left(ma.left)) : F.map(ma.right, exports.right);
        };
      };
      exports.sequence = sequence;
      exports.Traversable = {
        URI: exports.URI,
        map: _map,
        reduce: _reduce,
        foldMap: _foldMap,
        reduceRight: _reduceRight,
        traverse: _traverse,
        sequence: exports.sequence
      };
      var bimap = function(f, g) {
        return function(fa) {
          return exports.isLeft(fa) ? exports.left(f(fa.left)) : exports.right(g(fa.right));
        };
      };
      exports.bimap = bimap;
      var mapLeft = function(f) {
        return function(fa) {
          return exports.isLeft(fa) ? exports.left(f(fa.left)) : fa;
        };
      };
      exports.mapLeft = mapLeft;
      exports.Bifunctor = {
        URI: exports.URI,
        bimap: _bimap,
        mapLeft: _mapLeft
      };
      var altW = function(that) {
        return function(fa) {
          return exports.isLeft(fa) ? that() : fa;
        };
      };
      exports.altW = altW;
      exports.alt = exports.altW;
      exports.Alt = {
        URI: exports.URI,
        map: _map,
        alt: _alt
      };
      var extend = function(f) {
        return function(wa) {
          return exports.isLeft(wa) ? wa : exports.right(f(wa));
        };
      };
      exports.extend = extend;
      exports.Extend = {
        URI: exports.URI,
        map: _map,
        extend: _extend
      };
      exports.ChainRec = {
        URI: exports.URI,
        map: _map,
        ap: _ap,
        chain: _chain,
        chainRec: _chainRec
      };
      exports.throwError = exports.left;
      exports.MonadThrow = {
        URI: exports.URI,
        map: _map,
        ap: _ap,
        of: exports.of,
        chain: _chain,
        throwError: exports.throwError
      };
      exports.FromEither = {
        URI: exports.URI,
        fromEither: function_1.identity
      };
      exports.fromPredicate = /* @__PURE__ */ FromEither_1.fromPredicate(exports.FromEither);
      exports.fromOption = /* @__PURE__ */ FromEither_1.fromOption(exports.FromEither);
      exports.isLeft = _.isLeft;
      exports.isRight = _.isRight;
      var matchW = function(onLeft, onRight) {
        return function(ma) {
          return exports.isLeft(ma) ? onLeft(ma.left) : onRight(ma.right);
        };
      };
      exports.matchW = matchW;
      exports.foldW = exports.matchW;
      exports.match = exports.matchW;
      exports.fold = exports.match;
      var getOrElseW = function(onLeft) {
        return function(ma) {
          return exports.isLeft(ma) ? onLeft(ma.left) : ma.right;
        };
      };
      exports.getOrElseW = getOrElseW;
      exports.getOrElse = exports.getOrElseW;
      exports.flap = /* @__PURE__ */ Functor_1.flap(exports.Functor);
      exports.apFirst = /* @__PURE__ */ Apply_1.apFirst(exports.Apply);
      exports.apSecond = /* @__PURE__ */ Apply_1.apSecond(exports.Apply);
      exports.chainFirst = /* @__PURE__ */ Chain_1.chainFirst(exports.Chain);
      exports.chainFirstW = exports.chainFirst;
      exports.flattenW = /* @__PURE__ */ exports.chainW(function_1.identity);
      exports.flatten = exports.flattenW;
      exports.duplicate = /* @__PURE__ */ exports.extend(function_1.identity);
      exports.fromOptionK = /* @__PURE__ */ FromEither_1.fromOptionK(exports.FromEither);
      exports.chainOptionK = /* @__PURE__ */ FromEither_1.chainOptionK(exports.FromEither, exports.Chain);
      exports.filterOrElse = /* @__PURE__ */ FromEither_1.filterOrElse(exports.FromEither, exports.Chain);
      exports.filterOrElseW = exports.filterOrElse;
      var swap = function(ma) {
        return exports.isLeft(ma) ? exports.right(ma.left) : exports.left(ma.right);
      };
      exports.swap = swap;
      var orElseW = function(onLeft) {
        return function(ma) {
          return exports.isLeft(ma) ? onLeft(ma.left) : ma;
        };
      };
      exports.orElseW = orElseW;
      exports.orElse = exports.orElseW;
      var fromNullable = function(e) {
        return function(a) {
          return a == null ? exports.left(e) : exports.right(a);
        };
      };
      exports.fromNullable = fromNullable;
      var tryCatch = function(f, onThrow) {
        try {
          return exports.right(f());
        } catch (e) {
          return exports.left(onThrow(e));
        }
      };
      exports.tryCatch = tryCatch;
      var tryCatchK = function(f, onThrow) {
        return function() {
          var a = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            a[_i] = arguments[_i];
          }
          return exports.tryCatch(function() {
            return f.apply(void 0, a);
          }, onThrow);
        };
      };
      exports.tryCatchK = tryCatchK;
      var fromNullableK = function(e) {
        var from = exports.fromNullable(e);
        return function(f) {
          return function_1.flow(f, from);
        };
      };
      exports.fromNullableK = fromNullableK;
      var chainNullableK = function(e) {
        var from = exports.fromNullableK(e);
        return function(f) {
          return exports.chain(from(f));
        };
      };
      exports.chainNullableK = chainNullableK;
      exports.toUnion = /* @__PURE__ */ exports.foldW(function_1.identity, function_1.identity);
      function toError(e) {
        return e instanceof Error ? e : new Error(String(e));
      }
      exports.toError = toError;
      function elem(E) {
        return function(a, ma) {
          if (ma === void 0) {
            var elemE_1 = elem(E);
            return function(ma2) {
              return elemE_1(a, ma2);
            };
          }
          return exports.isLeft(ma) ? false : E.equals(a, ma.right);
        };
      }
      exports.elem = elem;
      var exists = function(predicate) {
        return function(ma) {
          return exports.isLeft(ma) ? false : predicate(ma.right);
        };
      };
      exports.exists = exists;
      exports.Do = /* @__PURE__ */ exports.of(_.emptyRecord);
      exports.bindTo = /* @__PURE__ */ Functor_1.bindTo(exports.Functor);
      exports.bind = /* @__PURE__ */ Chain_1.bind(exports.Chain);
      exports.bindW = exports.bind;
      exports.apS = /* @__PURE__ */ Apply_1.apS(exports.Apply);
      exports.apSW = exports.apS;
      exports.ApT = /* @__PURE__ */ exports.of(_.emptyReadonlyArray);
      var traverseReadonlyNonEmptyArrayWithIndex = function(f) {
        return function(as) {
          var e = f(0, _.head(as));
          if (exports.isLeft(e)) {
            return e;
          }
          var out = [e.right];
          for (var i = 1; i < as.length; i++) {
            var e_1 = f(i, as[i]);
            if (exports.isLeft(e_1)) {
              return e_1;
            }
            out.push(e_1.right);
          }
          return exports.right(out);
        };
      };
      exports.traverseReadonlyNonEmptyArrayWithIndex = traverseReadonlyNonEmptyArrayWithIndex;
      var traverseReadonlyArrayWithIndex = function(f) {
        var g = exports.traverseReadonlyNonEmptyArrayWithIndex(f);
        return function(as) {
          return _.isNonEmpty(as) ? g(as) : exports.ApT;
        };
      };
      exports.traverseReadonlyArrayWithIndex = traverseReadonlyArrayWithIndex;
      exports.traverseArrayWithIndex = exports.traverseReadonlyArrayWithIndex;
      var traverseArray = function(f) {
        return exports.traverseReadonlyArrayWithIndex(function(_2, a) {
          return f(a);
        });
      };
      exports.traverseArray = traverseArray;
      exports.sequenceArray = /* @__PURE__ */ exports.traverseArray(function_1.identity);
      function parseJSON(s, onError) {
        return exports.tryCatch(function() {
          return JSON.parse(s);
        }, onError);
      }
      exports.parseJSON = parseJSON;
      var stringifyJSON = function(u, onError) {
        return exports.tryCatch(function() {
          var s = JSON.stringify(u);
          if (typeof s !== "string") {
            throw new Error("Converting unsupported structure to JSON");
          }
          return s;
        }, onError);
      };
      exports.stringifyJSON = stringifyJSON;
      exports.either = {
        URI: exports.URI,
        map: _map,
        of: exports.of,
        ap: _ap,
        chain: _chain,
        reduce: _reduce,
        foldMap: _foldMap,
        reduceRight: _reduceRight,
        traverse: _traverse,
        sequence: exports.sequence,
        bimap: _bimap,
        mapLeft: _mapLeft,
        alt: _alt,
        extend: _extend,
        chainRec: _chainRec,
        throwError: exports.throwError
      };
      exports.getApplySemigroup = /* @__PURE__ */ Apply_1.getApplySemigroup(exports.Apply);
      exports.getApplyMonoid = /* @__PURE__ */ Applicative_1.getApplicativeMonoid(exports.Applicative);
      var getValidationSemigroup = function(SE, SA) {
        return Apply_1.getApplySemigroup(exports.getApplicativeValidation(SE))(SA);
      };
      exports.getValidationSemigroup = getValidationSemigroup;
      var getValidationMonoid = function(SE, MA) {
        return Applicative_1.getApplicativeMonoid(exports.getApplicativeValidation(SE))(MA);
      };
      exports.getValidationMonoid = getValidationMonoid;
      function getValidation(SE) {
        var ap = exports.getApplicativeValidation(SE).ap;
        var alt = exports.getAltValidation(SE).alt;
        return {
          URI: exports.URI,
          _E: void 0,
          map: _map,
          of: exports.of,
          chain: _chain,
          bimap: _bimap,
          mapLeft: _mapLeft,
          reduce: _reduce,
          foldMap: _foldMap,
          reduceRight: _reduceRight,
          extend: _extend,
          traverse: _traverse,
          sequence: exports.sequence,
          chainRec: _chainRec,
          throwError: exports.throwError,
          ap,
          alt
        };
      }
      exports.getValidation = getValidation;
    }
  });

  // node_modules/io-ts/lib/index.js
  var require_lib = __commonJS({
    "node_modules/io-ts/lib/index.js"(exports) {
      "use strict";
      var __extends = exports && exports.__extends || function() {
        var extendStatics = function(d, b) {
          extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
            d2.__proto__ = b2;
          } || function(d2, b2) {
            for (var p in b2)
              if (Object.prototype.hasOwnProperty.call(b2, p))
                d2[p] = b2[p];
          };
          return extendStatics(d, b);
        };
        return function(d, b) {
          extendStatics(d, b);
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
      }();
      var __assign = exports && exports.__assign || function() {
        __assign = Object.assign || function(t2) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s)
              if (Object.prototype.hasOwnProperty.call(s, p))
                t2[p] = s[p];
          }
          return t2;
        };
        return __assign.apply(this, arguments);
      };
      var __spreadArrays = exports && exports.__spreadArrays || function() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
          s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
          for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
        return r;
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.partial = exports.PartialType = exports.type = exports.InterfaceType = exports.array = exports.ArrayType = exports.recursion = exports.RecursiveType = exports.Int = exports.brand = exports.RefinementType = exports.keyof = exports.KeyofType = exports.literal = exports.LiteralType = exports.void = exports.undefined = exports.null = exports.UnknownRecord = exports.AnyDictionaryType = exports.UnknownArray = exports.AnyArrayType = exports.boolean = exports.BooleanType = exports.bigint = exports.BigIntType = exports.number = exports.NumberType = exports.string = exports.StringType = exports.unknown = exports.UnknownType = exports.voidType = exports.VoidType = exports.UndefinedType = exports.nullType = exports.NullType = exports.getIndex = exports.getTags = exports.emptyTags = exports.mergeAll = exports.getDomainKeys = exports.appendContext = exports.getContextEntry = exports.getFunctionName = exports.identity = exports.Type = exports.success = exports.failure = exports.failures = void 0;
      exports.alias = exports.clean = exports.StrictType = exports.dictionary = exports.Integer = exports.refinement = exports.object = exports.ObjectType = exports.Dictionary = exports.any = exports.AnyType = exports.never = exports.NeverType = exports.getDefaultContext = exports.getValidationError = exports.interface = exports.Array = exports.taggedUnion = exports.TaggedUnionType = exports.Function = exports.FunctionType = exports.exact = exports.ExactType = exports.strict = exports.readonlyArray = exports.ReadonlyArrayType = exports.readonly = exports.ReadonlyType = exports.tuple = exports.TupleType = exports.intersection = exports.IntersectionType = exports.union = exports.UnionType = exports.record = exports.DictionaryType = void 0;
      var Either_1 = require_Either();
      exports.failures = Either_1.left;
      var failure = function(value, context, message) {
        return exports.failures([{ value, context, message }]);
      };
      exports.failure = failure;
      exports.success = Either_1.right;
      var Type = function() {
        function Type2(name, is, validate, encode) {
          this.name = name;
          this.is = is;
          this.validate = validate;
          this.encode = encode;
          this.decode = this.decode.bind(this);
        }
        Type2.prototype.pipe = function(ab, name) {
          var _this = this;
          if (name === void 0) {
            name = "pipe(" + this.name + ", " + ab.name + ")";
          }
          return new Type2(name, ab.is, function(i, c) {
            var e = _this.validate(i, c);
            if (Either_1.isLeft(e)) {
              return e;
            }
            return ab.validate(e.right, c);
          }, this.encode === exports.identity && ab.encode === exports.identity ? exports.identity : function(b) {
            return _this.encode(ab.encode(b));
          });
        };
        Type2.prototype.asDecoder = function() {
          return this;
        };
        Type2.prototype.asEncoder = function() {
          return this;
        };
        Type2.prototype.decode = function(i) {
          return this.validate(i, [{ key: "", type: this, actual: i }]);
        };
        return Type2;
      }();
      exports.Type = Type;
      var identity = function(a) {
        return a;
      };
      exports.identity = identity;
      function getFunctionName(f) {
        return f.displayName || f.name || "<function" + f.length + ">";
      }
      exports.getFunctionName = getFunctionName;
      function getContextEntry(key, decoder) {
        return { key, type: decoder };
      }
      exports.getContextEntry = getContextEntry;
      function appendContext(c, key, decoder, actual) {
        var len = c.length;
        var r = Array(len + 1);
        for (var i = 0; i < len; i++) {
          r[i] = c[i];
        }
        r[len] = { key, type: decoder, actual };
        return r;
      }
      exports.appendContext = appendContext;
      function pushAll(xs, ys) {
        var l = ys.length;
        for (var i = 0; i < l; i++) {
          xs.push(ys[i]);
        }
      }
      var hasOwnProperty = Object.prototype.hasOwnProperty;
      function getNameFromProps(props) {
        return Object.keys(props).map(function(k) {
          return k + ": " + props[k].name;
        }).join(", ");
      }
      function useIdentity(codecs) {
        for (var i = 0; i < codecs.length; i++) {
          if (codecs[i].encode !== exports.identity) {
            return false;
          }
        }
        return true;
      }
      function getInterfaceTypeName(props) {
        return "{ " + getNameFromProps(props) + " }";
      }
      function getPartialTypeName(inner) {
        return "Partial<" + inner + ">";
      }
      function enumerableRecord(keys, domain, codomain, name) {
        if (name === void 0) {
          name = "{ [K in " + domain.name + "]: " + codomain.name + " }";
        }
        var len = keys.length;
        return new DictionaryType(name, function(u) {
          return exports.UnknownRecord.is(u) && keys.every(function(k) {
            return codomain.is(u[k]);
          });
        }, function(u, c) {
          var e = exports.UnknownRecord.validate(u, c);
          if (Either_1.isLeft(e)) {
            return e;
          }
          var o = e.right;
          var a = {};
          var errors = [];
          var changed = false;
          for (var i = 0; i < len; i++) {
            var k = keys[i];
            var ok = o[k];
            var codomainResult = codomain.validate(ok, appendContext(c, k, codomain, ok));
            if (Either_1.isLeft(codomainResult)) {
              pushAll(errors, codomainResult.left);
            } else {
              var vok = codomainResult.right;
              changed = changed || vok !== ok;
              a[k] = vok;
            }
          }
          return errors.length > 0 ? exports.failures(errors) : exports.success(changed || Object.keys(o).length !== len ? a : o);
        }, codomain.encode === exports.identity ? exports.identity : function(a) {
          var s = {};
          for (var i = 0; i < len; i++) {
            var k = keys[i];
            s[k] = codomain.encode(a[k]);
          }
          return s;
        }, domain, codomain);
      }
      function getDomainKeys(domain) {
        var _a;
        if (isLiteralC(domain)) {
          var literal_1 = domain.value;
          if (exports.string.is(literal_1)) {
            return _a = {}, _a[literal_1] = null, _a;
          }
        } else if (isKeyofC(domain)) {
          return domain.keys;
        } else if (isUnionC(domain)) {
          var keys = domain.types.map(function(type3) {
            return getDomainKeys(type3);
          });
          return keys.some(undefinedType.is) ? void 0 : Object.assign.apply(Object, __spreadArrays([{}], keys));
        }
        return void 0;
      }
      exports.getDomainKeys = getDomainKeys;
      function nonEnumerableRecord(domain, codomain, name) {
        if (name === void 0) {
          name = "{ [K in " + domain.name + "]: " + codomain.name + " }";
        }
        return new DictionaryType(name, function(u) {
          if (exports.UnknownRecord.is(u)) {
            return Object.keys(u).every(function(k) {
              return domain.is(k) && codomain.is(u[k]);
            });
          }
          return isAnyC(codomain) && Array.isArray(u);
        }, function(u, c) {
          if (exports.UnknownRecord.is(u)) {
            var a = {};
            var errors = [];
            var keys = Object.keys(u);
            var len = keys.length;
            var changed = false;
            for (var i = 0; i < len; i++) {
              var k = keys[i];
              var ok = u[k];
              var domainResult = domain.validate(k, appendContext(c, k, domain, k));
              if (Either_1.isLeft(domainResult)) {
                pushAll(errors, domainResult.left);
              } else {
                var vk = domainResult.right;
                changed = changed || vk !== k;
                k = vk;
                var codomainResult = codomain.validate(ok, appendContext(c, k, codomain, ok));
                if (Either_1.isLeft(codomainResult)) {
                  pushAll(errors, codomainResult.left);
                } else {
                  var vok = codomainResult.right;
                  changed = changed || vok !== ok;
                  a[k] = vok;
                }
              }
            }
            return errors.length > 0 ? exports.failures(errors) : exports.success(changed ? a : u);
          }
          if (isAnyC(codomain) && Array.isArray(u)) {
            return exports.success(u);
          }
          return exports.failure(u, c);
        }, domain.encode === exports.identity && codomain.encode === exports.identity ? exports.identity : function(a) {
          var s = {};
          var keys = Object.keys(a);
          var len = keys.length;
          for (var i = 0; i < len; i++) {
            var k = keys[i];
            s[String(domain.encode(k))] = codomain.encode(a[k]);
          }
          return s;
        }, domain, codomain);
      }
      function getUnionName(codecs) {
        return "(" + codecs.map(function(type3) {
          return type3.name;
        }).join(" | ") + ")";
      }
      function mergeAll(base, us) {
        var equal = true;
        var primitive = true;
        var baseIsNotADictionary = !exports.UnknownRecord.is(base);
        for (var _i = 0, us_1 = us; _i < us_1.length; _i++) {
          var u = us_1[_i];
          if (u !== base) {
            equal = false;
          }
          if (exports.UnknownRecord.is(u)) {
            primitive = false;
          }
        }
        if (equal) {
          return base;
        } else if (primitive) {
          return us[us.length - 1];
        }
        var r = {};
        for (var _a = 0, us_2 = us; _a < us_2.length; _a++) {
          var u = us_2[_a];
          for (var k in u) {
            if (!r.hasOwnProperty(k) || baseIsNotADictionary || u[k] !== base[k]) {
              r[k] = u[k];
            }
          }
        }
        return r;
      }
      exports.mergeAll = mergeAll;
      function getProps(codec) {
        switch (codec._tag) {
          case "RefinementType":
          case "ReadonlyType":
            return getProps(codec.type);
          case "InterfaceType":
          case "StrictType":
          case "PartialType":
            return codec.props;
          case "IntersectionType":
            return codec.types.reduce(function(props, type3) {
              return Object.assign(props, getProps(type3));
            }, {});
        }
      }
      function stripKeys(o, props) {
        var keys = Object.getOwnPropertyNames(o);
        var shouldStrip = false;
        var r = {};
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          if (!hasOwnProperty.call(props, key)) {
            shouldStrip = true;
          } else {
            r[key] = o[key];
          }
        }
        return shouldStrip ? r : o;
      }
      function getExactTypeName(codec) {
        if (isTypeC(codec)) {
          return "{| " + getNameFromProps(codec.props) + " |}";
        } else if (isPartialC(codec)) {
          return getPartialTypeName("{| " + getNameFromProps(codec.props) + " |}");
        }
        return "Exact<" + codec.name + ">";
      }
      function isNonEmpty(as) {
        return as.length > 0;
      }
      exports.emptyTags = {};
      function intersect(a, b) {
        var r = [];
        for (var _i = 0, a_1 = a; _i < a_1.length; _i++) {
          var v = a_1[_i];
          if (b.indexOf(v) !== -1) {
            r.push(v);
          }
        }
        return r;
      }
      function mergeTags(a, b) {
        if (a === exports.emptyTags) {
          return b;
        }
        if (b === exports.emptyTags) {
          return a;
        }
        var r = Object.assign({}, a);
        for (var k in b) {
          if (a.hasOwnProperty(k)) {
            var intersection_1 = intersect(a[k], b[k]);
            if (isNonEmpty(intersection_1)) {
              r[k] = intersection_1;
            } else {
              r = exports.emptyTags;
              break;
            }
          } else {
            r[k] = b[k];
          }
        }
        return r;
      }
      function intersectTags(a, b) {
        if (a === exports.emptyTags || b === exports.emptyTags) {
          return exports.emptyTags;
        }
        var r = exports.emptyTags;
        for (var k in a) {
          if (b.hasOwnProperty(k)) {
            var intersection_2 = intersect(a[k], b[k]);
            if (intersection_2.length === 0) {
              if (r === exports.emptyTags) {
                r = {};
              }
              r[k] = a[k].concat(b[k]);
            }
          }
        }
        return r;
      }
      function isAnyC(codec) {
        return codec._tag === "AnyType";
      }
      function isLiteralC(codec) {
        return codec._tag === "LiteralType";
      }
      function isKeyofC(codec) {
        return codec._tag === "KeyofType";
      }
      function isTypeC(codec) {
        return codec._tag === "InterfaceType";
      }
      function isPartialC(codec) {
        return codec._tag === "PartialType";
      }
      function isStrictC(codec) {
        return codec._tag === "StrictType";
      }
      function isExactC(codec) {
        return codec._tag === "ExactType";
      }
      function isRefinementC(codec) {
        return codec._tag === "RefinementType";
      }
      function isIntersectionC(codec) {
        return codec._tag === "IntersectionType";
      }
      function isUnionC(codec) {
        return codec._tag === "UnionType";
      }
      function isRecursiveC(codec) {
        return codec._tag === "RecursiveType";
      }
      var lazyCodecs = [];
      function getTags(codec) {
        if (lazyCodecs.indexOf(codec) !== -1) {
          return exports.emptyTags;
        }
        if (isTypeC(codec) || isStrictC(codec)) {
          var index = exports.emptyTags;
          for (var k in codec.props) {
            var prop = codec.props[k];
            if (isLiteralC(prop)) {
              if (index === exports.emptyTags) {
                index = {};
              }
              index[k] = [prop.value];
            }
          }
          return index;
        } else if (isExactC(codec) || isRefinementC(codec)) {
          return getTags(codec.type);
        } else if (isIntersectionC(codec)) {
          return codec.types.reduce(function(tags2, codec2) {
            return mergeTags(tags2, getTags(codec2));
          }, exports.emptyTags);
        } else if (isUnionC(codec)) {
          return codec.types.slice(1).reduce(function(tags2, codec2) {
            return intersectTags(tags2, getTags(codec2));
          }, getTags(codec.types[0]));
        } else if (isRecursiveC(codec)) {
          lazyCodecs.push(codec);
          var tags = getTags(codec.type);
          lazyCodecs.pop();
          return tags;
        }
        return exports.emptyTags;
      }
      exports.getTags = getTags;
      function getIndex(codecs) {
        var tags = getTags(codecs[0]);
        var keys = Object.keys(tags);
        var len = codecs.length;
        var _loop_1 = function(k2) {
          var all = tags[k2].slice();
          var index = [tags[k2]];
          for (var i = 1; i < len; i++) {
            var codec = codecs[i];
            var ctags = getTags(codec);
            var values = ctags[k2];
            if (values === void 0) {
              return "continue-keys";
            } else {
              if (values.some(function(v) {
                return all.indexOf(v) !== -1;
              })) {
                return "continue-keys";
              } else {
                all.push.apply(all, values);
                index.push(values);
              }
            }
          }
          return { value: [k2, index] };
        };
        keys:
          for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var k = keys_1[_i];
            var state_1 = _loop_1(k);
            if (typeof state_1 === "object")
              return state_1.value;
            switch (state_1) {
              case "continue-keys":
                continue keys;
            }
          }
        return void 0;
      }
      exports.getIndex = getIndex;
      var NullType = function(_super) {
        __extends(NullType2, _super);
        function NullType2() {
          var _this = _super.call(this, "null", function(u) {
            return u === null;
          }, function(u, c) {
            return _this.is(u) ? exports.success(u) : exports.failure(u, c);
          }, exports.identity) || this;
          _this._tag = "NullType";
          return _this;
        }
        return NullType2;
      }(Type);
      exports.NullType = NullType;
      exports.nullType = new NullType();
      exports.null = exports.nullType;
      var UndefinedType = function(_super) {
        __extends(UndefinedType2, _super);
        function UndefinedType2() {
          var _this = _super.call(this, "undefined", function(u) {
            return u === void 0;
          }, function(u, c) {
            return _this.is(u) ? exports.success(u) : exports.failure(u, c);
          }, exports.identity) || this;
          _this._tag = "UndefinedType";
          return _this;
        }
        return UndefinedType2;
      }(Type);
      exports.UndefinedType = UndefinedType;
      var undefinedType = new UndefinedType();
      exports.undefined = undefinedType;
      var VoidType = function(_super) {
        __extends(VoidType2, _super);
        function VoidType2() {
          var _this = _super.call(this, "void", undefinedType.is, undefinedType.validate, exports.identity) || this;
          _this._tag = "VoidType";
          return _this;
        }
        return VoidType2;
      }(Type);
      exports.VoidType = VoidType;
      exports.voidType = new VoidType();
      exports.void = exports.voidType;
      var UnknownType = function(_super) {
        __extends(UnknownType2, _super);
        function UnknownType2() {
          var _this = _super.call(this, "unknown", function(_) {
            return true;
          }, exports.success, exports.identity) || this;
          _this._tag = "UnknownType";
          return _this;
        }
        return UnknownType2;
      }(Type);
      exports.UnknownType = UnknownType;
      exports.unknown = new UnknownType();
      var StringType = function(_super) {
        __extends(StringType2, _super);
        function StringType2() {
          var _this = _super.call(this, "string", function(u) {
            return typeof u === "string";
          }, function(u, c) {
            return _this.is(u) ? exports.success(u) : exports.failure(u, c);
          }, exports.identity) || this;
          _this._tag = "StringType";
          return _this;
        }
        return StringType2;
      }(Type);
      exports.StringType = StringType;
      exports.string = new StringType();
      var NumberType = function(_super) {
        __extends(NumberType2, _super);
        function NumberType2() {
          var _this = _super.call(this, "number", function(u) {
            return typeof u === "number";
          }, function(u, c) {
            return _this.is(u) ? exports.success(u) : exports.failure(u, c);
          }, exports.identity) || this;
          _this._tag = "NumberType";
          return _this;
        }
        return NumberType2;
      }(Type);
      exports.NumberType = NumberType;
      exports.number = new NumberType();
      var BigIntType = function(_super) {
        __extends(BigIntType2, _super);
        function BigIntType2() {
          var _this = _super.call(this, "bigint", function(u) {
            return typeof u === "bigint";
          }, function(u, c) {
            return _this.is(u) ? exports.success(u) : exports.failure(u, c);
          }, exports.identity) || this;
          _this._tag = "BigIntType";
          return _this;
        }
        return BigIntType2;
      }(Type);
      exports.BigIntType = BigIntType;
      exports.bigint = new BigIntType();
      var BooleanType = function(_super) {
        __extends(BooleanType2, _super);
        function BooleanType2() {
          var _this = _super.call(this, "boolean", function(u) {
            return typeof u === "boolean";
          }, function(u, c) {
            return _this.is(u) ? exports.success(u) : exports.failure(u, c);
          }, exports.identity) || this;
          _this._tag = "BooleanType";
          return _this;
        }
        return BooleanType2;
      }(Type);
      exports.BooleanType = BooleanType;
      exports.boolean = new BooleanType();
      var AnyArrayType = function(_super) {
        __extends(AnyArrayType2, _super);
        function AnyArrayType2() {
          var _this = _super.call(this, "UnknownArray", Array.isArray, function(u, c) {
            return _this.is(u) ? exports.success(u) : exports.failure(u, c);
          }, exports.identity) || this;
          _this._tag = "AnyArrayType";
          return _this;
        }
        return AnyArrayType2;
      }(Type);
      exports.AnyArrayType = AnyArrayType;
      exports.UnknownArray = new AnyArrayType();
      exports.Array = exports.UnknownArray;
      var AnyDictionaryType = function(_super) {
        __extends(AnyDictionaryType2, _super);
        function AnyDictionaryType2() {
          var _this = _super.call(this, "UnknownRecord", function(u) {
            var s = Object.prototype.toString.call(u);
            return s === "[object Object]" || s === "[object Window]";
          }, function(u, c) {
            return _this.is(u) ? exports.success(u) : exports.failure(u, c);
          }, exports.identity) || this;
          _this._tag = "AnyDictionaryType";
          return _this;
        }
        return AnyDictionaryType2;
      }(Type);
      exports.AnyDictionaryType = AnyDictionaryType;
      exports.UnknownRecord = new AnyDictionaryType();
      var LiteralType = function(_super) {
        __extends(LiteralType2, _super);
        function LiteralType2(name, is, validate, encode, value) {
          var _this = _super.call(this, name, is, validate, encode) || this;
          _this.value = value;
          _this._tag = "LiteralType";
          return _this;
        }
        return LiteralType2;
      }(Type);
      exports.LiteralType = LiteralType;
      function literal2(value, name) {
        if (name === void 0) {
          name = JSON.stringify(value);
        }
        var is = function(u) {
          return u === value;
        };
        return new LiteralType(name, is, function(u, c) {
          return is(u) ? exports.success(value) : exports.failure(u, c);
        }, exports.identity, value);
      }
      exports.literal = literal2;
      var KeyofType = function(_super) {
        __extends(KeyofType2, _super);
        function KeyofType2(name, is, validate, encode, keys) {
          var _this = _super.call(this, name, is, validate, encode) || this;
          _this.keys = keys;
          _this._tag = "KeyofType";
          return _this;
        }
        return KeyofType2;
      }(Type);
      exports.KeyofType = KeyofType;
      function keyof(keys, name) {
        if (name === void 0) {
          name = Object.keys(keys).map(function(k) {
            return JSON.stringify(k);
          }).join(" | ");
        }
        var is = function(u) {
          return exports.string.is(u) && hasOwnProperty.call(keys, u);
        };
        return new KeyofType(name, is, function(u, c) {
          return is(u) ? exports.success(u) : exports.failure(u, c);
        }, exports.identity, keys);
      }
      exports.keyof = keyof;
      var RefinementType = function(_super) {
        __extends(RefinementType2, _super);
        function RefinementType2(name, is, validate, encode, type3, predicate) {
          var _this = _super.call(this, name, is, validate, encode) || this;
          _this.type = type3;
          _this.predicate = predicate;
          _this._tag = "RefinementType";
          return _this;
        }
        return RefinementType2;
      }(Type);
      exports.RefinementType = RefinementType;
      function brand(codec, predicate, name) {
        return refinement(codec, predicate, name);
      }
      exports.brand = brand;
      exports.Int = brand(exports.number, function(n) {
        return Number.isInteger(n);
      }, "Int");
      var RecursiveType = function(_super) {
        __extends(RecursiveType2, _super);
        function RecursiveType2(name, is, validate, encode, runDefinition) {
          var _this = _super.call(this, name, is, validate, encode) || this;
          _this.runDefinition = runDefinition;
          _this._tag = "RecursiveType";
          return _this;
        }
        return RecursiveType2;
      }(Type);
      exports.RecursiveType = RecursiveType;
      Object.defineProperty(RecursiveType.prototype, "type", {
        get: function() {
          return this.runDefinition();
        },
        enumerable: true,
        configurable: true
      });
      function recursion(name, definition) {
        var cache;
        var runDefinition = function() {
          if (!cache) {
            cache = definition(Self);
            cache.name = name;
          }
          return cache;
        };
        var Self = new RecursiveType(name, function(u) {
          return runDefinition().is(u);
        }, function(u, c) {
          return runDefinition().validate(u, c);
        }, function(a) {
          return runDefinition().encode(a);
        }, runDefinition);
        return Self;
      }
      exports.recursion = recursion;
      var ArrayType = function(_super) {
        __extends(ArrayType2, _super);
        function ArrayType2(name, is, validate, encode, type3) {
          var _this = _super.call(this, name, is, validate, encode) || this;
          _this.type = type3;
          _this._tag = "ArrayType";
          return _this;
        }
        return ArrayType2;
      }(Type);
      exports.ArrayType = ArrayType;
      function array2(item, name) {
        if (name === void 0) {
          name = "Array<" + item.name + ">";
        }
        return new ArrayType(name, function(u) {
          return exports.UnknownArray.is(u) && u.every(item.is);
        }, function(u, c) {
          var e = exports.UnknownArray.validate(u, c);
          if (Either_1.isLeft(e)) {
            return e;
          }
          var us = e.right;
          var len = us.length;
          var as = us;
          var errors = [];
          for (var i = 0; i < len; i++) {
            var ui = us[i];
            var result = item.validate(ui, appendContext(c, String(i), item, ui));
            if (Either_1.isLeft(result)) {
              pushAll(errors, result.left);
            } else {
              var ai = result.right;
              if (ai !== ui) {
                if (as === us) {
                  as = us.slice();
                }
                as[i] = ai;
              }
            }
          }
          return errors.length > 0 ? exports.failures(errors) : exports.success(as);
        }, item.encode === exports.identity ? exports.identity : function(a) {
          return a.map(item.encode);
        }, item);
      }
      exports.array = array2;
      var InterfaceType = function(_super) {
        __extends(InterfaceType2, _super);
        function InterfaceType2(name, is, validate, encode, props) {
          var _this = _super.call(this, name, is, validate, encode) || this;
          _this.props = props;
          _this._tag = "InterfaceType";
          return _this;
        }
        return InterfaceType2;
      }(Type);
      exports.InterfaceType = InterfaceType;
      function type2(props, name) {
        if (name === void 0) {
          name = getInterfaceTypeName(props);
        }
        var keys = Object.keys(props);
        var types = keys.map(function(key) {
          return props[key];
        });
        var len = keys.length;
        return new InterfaceType(name, function(u) {
          if (exports.UnknownRecord.is(u)) {
            for (var i = 0; i < len; i++) {
              var k = keys[i];
              var uk = u[k];
              if (uk === void 0 && !hasOwnProperty.call(u, k) || !types[i].is(uk)) {
                return false;
              }
            }
            return true;
          }
          return false;
        }, function(u, c) {
          var e = exports.UnknownRecord.validate(u, c);
          if (Either_1.isLeft(e)) {
            return e;
          }
          var o = e.right;
          var a = o;
          var errors = [];
          for (var i = 0; i < len; i++) {
            var k = keys[i];
            var ak = a[k];
            var type_1 = types[i];
            var result = type_1.validate(ak, appendContext(c, k, type_1, ak));
            if (Either_1.isLeft(result)) {
              pushAll(errors, result.left);
            } else {
              var vak = result.right;
              if (vak !== ak || vak === void 0 && !hasOwnProperty.call(a, k)) {
                if (a === o) {
                  a = __assign({}, o);
                }
                a[k] = vak;
              }
            }
          }
          return errors.length > 0 ? exports.failures(errors) : exports.success(a);
        }, useIdentity(types) ? exports.identity : function(a) {
          var s = __assign({}, a);
          for (var i = 0; i < len; i++) {
            var k = keys[i];
            var encode = types[i].encode;
            if (encode !== exports.identity) {
              s[k] = encode(a[k]);
            }
          }
          return s;
        }, props);
      }
      exports.type = type2;
      exports.interface = type2;
      var PartialType = function(_super) {
        __extends(PartialType2, _super);
        function PartialType2(name, is, validate, encode, props) {
          var _this = _super.call(this, name, is, validate, encode) || this;
          _this.props = props;
          _this._tag = "PartialType";
          return _this;
        }
        return PartialType2;
      }(Type);
      exports.PartialType = PartialType;
      function partial(props, name) {
        if (name === void 0) {
          name = getPartialTypeName(getInterfaceTypeName(props));
        }
        var keys = Object.keys(props);
        var types = keys.map(function(key) {
          return props[key];
        });
        var len = keys.length;
        return new PartialType(name, function(u) {
          if (exports.UnknownRecord.is(u)) {
            for (var i = 0; i < len; i++) {
              var k = keys[i];
              var uk = u[k];
              if (uk !== void 0 && !props[k].is(uk)) {
                return false;
              }
            }
            return true;
          }
          return false;
        }, function(u, c) {
          var e = exports.UnknownRecord.validate(u, c);
          if (Either_1.isLeft(e)) {
            return e;
          }
          var o = e.right;
          var a = o;
          var errors = [];
          for (var i = 0; i < len; i++) {
            var k = keys[i];
            var ak = a[k];
            var type_2 = props[k];
            var result = type_2.validate(ak, appendContext(c, k, type_2, ak));
            if (Either_1.isLeft(result)) {
              if (ak !== void 0) {
                pushAll(errors, result.left);
              }
            } else {
              var vak = result.right;
              if (vak !== ak) {
                if (a === o) {
                  a = __assign({}, o);
                }
                a[k] = vak;
              }
            }
          }
          return errors.length > 0 ? exports.failures(errors) : exports.success(a);
        }, useIdentity(types) ? exports.identity : function(a) {
          var s = __assign({}, a);
          for (var i = 0; i < len; i++) {
            var k = keys[i];
            var ak = a[k];
            if (ak !== void 0) {
              s[k] = types[i].encode(ak);
            }
          }
          return s;
        }, props);
      }
      exports.partial = partial;
      var DictionaryType = function(_super) {
        __extends(DictionaryType2, _super);
        function DictionaryType2(name, is, validate, encode, domain, codomain) {
          var _this = _super.call(this, name, is, validate, encode) || this;
          _this.domain = domain;
          _this.codomain = codomain;
          _this._tag = "DictionaryType";
          return _this;
        }
        return DictionaryType2;
      }(Type);
      exports.DictionaryType = DictionaryType;
      function record(domain, codomain, name) {
        var keys = getDomainKeys(domain);
        return keys ? enumerableRecord(Object.keys(keys), domain, codomain, name) : nonEnumerableRecord(domain, codomain, name);
      }
      exports.record = record;
      var UnionType = function(_super) {
        __extends(UnionType2, _super);
        function UnionType2(name, is, validate, encode, types) {
          var _this = _super.call(this, name, is, validate, encode) || this;
          _this.types = types;
          _this._tag = "UnionType";
          return _this;
        }
        return UnionType2;
      }(Type);
      exports.UnionType = UnionType;
      function union2(codecs, name) {
        if (name === void 0) {
          name = getUnionName(codecs);
        }
        var index = getIndex(codecs);
        if (index !== void 0 && codecs.length > 0) {
          var tag_1 = index[0], groups_1 = index[1];
          var len_1 = groups_1.length;
          var find_1 = function(value) {
            for (var i = 0; i < len_1; i++) {
              if (groups_1[i].indexOf(value) !== -1) {
                return i;
              }
            }
            return void 0;
          };
          return new TaggedUnionType(name, function(u) {
            if (exports.UnknownRecord.is(u)) {
              var i = find_1(u[tag_1]);
              return i !== void 0 ? codecs[i].is(u) : false;
            }
            return false;
          }, function(u, c) {
            var e = exports.UnknownRecord.validate(u, c);
            if (Either_1.isLeft(e)) {
              return e;
            }
            var r = e.right;
            var i = find_1(r[tag_1]);
            if (i === void 0) {
              return exports.failure(u, c);
            }
            var codec = codecs[i];
            return codec.validate(r, appendContext(c, String(i), codec, r));
          }, useIdentity(codecs) ? exports.identity : function(a) {
            var i = find_1(a[tag_1]);
            if (i === void 0) {
              throw new Error("no codec found to encode value in union codec " + name);
            } else {
              return codecs[i].encode(a);
            }
          }, codecs, tag_1);
        } else {
          return new UnionType(name, function(u) {
            return codecs.some(function(type3) {
              return type3.is(u);
            });
          }, function(u, c) {
            var errors = [];
            for (var i = 0; i < codecs.length; i++) {
              var codec = codecs[i];
              var result = codec.validate(u, appendContext(c, String(i), codec, u));
              if (Either_1.isLeft(result)) {
                pushAll(errors, result.left);
              } else {
                return exports.success(result.right);
              }
            }
            return exports.failures(errors);
          }, useIdentity(codecs) ? exports.identity : function(a) {
            for (var _i = 0, codecs_1 = codecs; _i < codecs_1.length; _i++) {
              var codec = codecs_1[_i];
              if (codec.is(a)) {
                return codec.encode(a);
              }
            }
            throw new Error("no codec found to encode value in union type " + name);
          }, codecs);
        }
      }
      exports.union = union2;
      var IntersectionType = function(_super) {
        __extends(IntersectionType2, _super);
        function IntersectionType2(name, is, validate, encode, types) {
          var _this = _super.call(this, name, is, validate, encode) || this;
          _this.types = types;
          _this._tag = "IntersectionType";
          return _this;
        }
        return IntersectionType2;
      }(Type);
      exports.IntersectionType = IntersectionType;
      function intersection(codecs, name) {
        if (name === void 0) {
          name = "(" + codecs.map(function(type3) {
            return type3.name;
          }).join(" & ") + ")";
        }
        var len = codecs.length;
        return new IntersectionType(name, function(u) {
          return codecs.every(function(type3) {
            return type3.is(u);
          });
        }, codecs.length === 0 ? exports.success : function(u, c) {
          var us = [];
          var errors = [];
          for (var i = 0; i < len; i++) {
            var codec = codecs[i];
            var result = codec.validate(u, appendContext(c, String(i), codec, u));
            if (Either_1.isLeft(result)) {
              pushAll(errors, result.left);
            } else {
              us.push(result.right);
            }
          }
          return errors.length > 0 ? exports.failures(errors) : exports.success(mergeAll(u, us));
        }, codecs.length === 0 ? exports.identity : function(a) {
          return mergeAll(a, codecs.map(function(codec) {
            return codec.encode(a);
          }));
        }, codecs);
      }
      exports.intersection = intersection;
      var TupleType = function(_super) {
        __extends(TupleType2, _super);
        function TupleType2(name, is, validate, encode, types) {
          var _this = _super.call(this, name, is, validate, encode) || this;
          _this.types = types;
          _this._tag = "TupleType";
          return _this;
        }
        return TupleType2;
      }(Type);
      exports.TupleType = TupleType;
      function tuple(codecs, name) {
        if (name === void 0) {
          name = "[" + codecs.map(function(type3) {
            return type3.name;
          }).join(", ") + "]";
        }
        var len = codecs.length;
        return new TupleType(name, function(u) {
          return exports.UnknownArray.is(u) && u.length === len && codecs.every(function(type3, i) {
            return type3.is(u[i]);
          });
        }, function(u, c) {
          var e = exports.UnknownArray.validate(u, c);
          if (Either_1.isLeft(e)) {
            return e;
          }
          var us = e.right;
          var as = us.length > len ? us.slice(0, len) : us;
          var errors = [];
          for (var i = 0; i < len; i++) {
            var a = us[i];
            var type_3 = codecs[i];
            var result = type_3.validate(a, appendContext(c, String(i), type_3, a));
            if (Either_1.isLeft(result)) {
              pushAll(errors, result.left);
            } else {
              var va = result.right;
              if (va !== a) {
                if (as === us) {
                  as = us.slice();
                }
                as[i] = va;
              }
            }
          }
          return errors.length > 0 ? exports.failures(errors) : exports.success(as);
        }, useIdentity(codecs) ? exports.identity : function(a) {
          return codecs.map(function(type3, i) {
            return type3.encode(a[i]);
          });
        }, codecs);
      }
      exports.tuple = tuple;
      var ReadonlyType = function(_super) {
        __extends(ReadonlyType2, _super);
        function ReadonlyType2(name, is, validate, encode, type3) {
          var _this = _super.call(this, name, is, validate, encode) || this;
          _this.type = type3;
          _this._tag = "ReadonlyType";
          return _this;
        }
        return ReadonlyType2;
      }(Type);
      exports.ReadonlyType = ReadonlyType;
      function readonly(codec, name) {
        if (name === void 0) {
          name = "Readonly<" + codec.name + ">";
        }
        return new ReadonlyType(name, codec.is, codec.validate, codec.encode, codec);
      }
      exports.readonly = readonly;
      var ReadonlyArrayType = function(_super) {
        __extends(ReadonlyArrayType2, _super);
        function ReadonlyArrayType2(name, is, validate, encode, type3) {
          var _this = _super.call(this, name, is, validate, encode) || this;
          _this.type = type3;
          _this._tag = "ReadonlyArrayType";
          return _this;
        }
        return ReadonlyArrayType2;
      }(Type);
      exports.ReadonlyArrayType = ReadonlyArrayType;
      function readonlyArray(item, name) {
        if (name === void 0) {
          name = "ReadonlyArray<" + item.name + ">";
        }
        var codec = array2(item);
        return new ReadonlyArrayType(name, codec.is, codec.validate, codec.encode, item);
      }
      exports.readonlyArray = readonlyArray;
      var strict = function(props, name) {
        return exact(type2(props), name);
      };
      exports.strict = strict;
      var ExactType = function(_super) {
        __extends(ExactType2, _super);
        function ExactType2(name, is, validate, encode, type3) {
          var _this = _super.call(this, name, is, validate, encode) || this;
          _this.type = type3;
          _this._tag = "ExactType";
          return _this;
        }
        return ExactType2;
      }(Type);
      exports.ExactType = ExactType;
      function exact(codec, name) {
        if (name === void 0) {
          name = getExactTypeName(codec);
        }
        var props = getProps(codec);
        return new ExactType(name, codec.is, function(u, c) {
          var e = exports.UnknownRecord.validate(u, c);
          if (Either_1.isLeft(e)) {
            return e;
          }
          var ce = codec.validate(u, c);
          if (Either_1.isLeft(ce)) {
            return ce;
          }
          return Either_1.right(stripKeys(ce.right, props));
        }, function(a) {
          return codec.encode(stripKeys(a, props));
        }, codec);
      }
      exports.exact = exact;
      var FunctionType = function(_super) {
        __extends(FunctionType2, _super);
        function FunctionType2() {
          var _this = _super.call(this, "Function", function(u) {
            return typeof u === "function";
          }, function(u, c) {
            return _this.is(u) ? exports.success(u) : exports.failure(u, c);
          }, exports.identity) || this;
          _this._tag = "FunctionType";
          return _this;
        }
        return FunctionType2;
      }(Type);
      exports.FunctionType = FunctionType;
      exports.Function = new FunctionType();
      var TaggedUnionType = function(_super) {
        __extends(TaggedUnionType2, _super);
        function TaggedUnionType2(name, is, validate, encode, codecs, tag) {
          var _this = _super.call(this, name, is, validate, encode, codecs) || this;
          _this.tag = tag;
          return _this;
        }
        return TaggedUnionType2;
      }(UnionType);
      exports.TaggedUnionType = TaggedUnionType;
      var taggedUnion = function(tag, codecs, name) {
        if (name === void 0) {
          name = getUnionName(codecs);
        }
        var U = union2(codecs, name);
        if (U instanceof TaggedUnionType) {
          return U;
        } else {
          console.warn("[io-ts] Cannot build a tagged union for " + name + ", returning a de-optimized union");
          return new TaggedUnionType(name, U.is, U.validate, U.encode, codecs, tag);
        }
      };
      exports.taggedUnion = taggedUnion;
      var getValidationError = function(value, context) {
        return {
          value,
          context
        };
      };
      exports.getValidationError = getValidationError;
      var getDefaultContext = function(decoder) {
        return [
          { key: "", type: decoder }
        ];
      };
      exports.getDefaultContext = getDefaultContext;
      var NeverType = function(_super) {
        __extends(NeverType2, _super);
        function NeverType2() {
          var _this = _super.call(this, "never", function(_) {
            return false;
          }, function(u, c) {
            return exports.failure(u, c);
          }, function() {
            throw new Error("cannot encode never");
          }) || this;
          _this._tag = "NeverType";
          return _this;
        }
        return NeverType2;
      }(Type);
      exports.NeverType = NeverType;
      exports.never = new NeverType();
      var AnyType = function(_super) {
        __extends(AnyType2, _super);
        function AnyType2() {
          var _this = _super.call(this, "any", function(_) {
            return true;
          }, exports.success, exports.identity) || this;
          _this._tag = "AnyType";
          return _this;
        }
        return AnyType2;
      }(Type);
      exports.AnyType = AnyType;
      exports.any = new AnyType();
      exports.Dictionary = exports.UnknownRecord;
      var ObjectType = function(_super) {
        __extends(ObjectType2, _super);
        function ObjectType2() {
          var _this = _super.call(this, "object", function(u) {
            return u !== null && typeof u === "object";
          }, function(u, c) {
            return _this.is(u) ? exports.success(u) : exports.failure(u, c);
          }, exports.identity) || this;
          _this._tag = "ObjectType";
          return _this;
        }
        return ObjectType2;
      }(Type);
      exports.ObjectType = ObjectType;
      exports.object = new ObjectType();
      function refinement(codec, predicate, name) {
        if (name === void 0) {
          name = "(" + codec.name + " | " + getFunctionName(predicate) + ")";
        }
        return new RefinementType(name, function(u) {
          return codec.is(u) && predicate(u);
        }, function(i, c) {
          var e = codec.validate(i, c);
          if (Either_1.isLeft(e)) {
            return e;
          }
          var a = e.right;
          return predicate(a) ? exports.success(a) : exports.failure(a, c);
        }, codec.encode, codec, predicate);
      }
      exports.refinement = refinement;
      exports.Integer = refinement(exports.number, Number.isInteger, "Integer");
      exports.dictionary = record;
      var StrictType = function(_super) {
        __extends(StrictType2, _super);
        function StrictType2(name, is, validate, encode, props) {
          var _this = _super.call(this, name, is, validate, encode) || this;
          _this.props = props;
          _this._tag = "StrictType";
          return _this;
        }
        return StrictType2;
      }(Type);
      exports.StrictType = StrictType;
      function clean(codec) {
        return codec;
      }
      exports.clean = clean;
      function alias(codec) {
        return function() {
          return codec;
        };
      }
      exports.alias = alias;
    }
  });

  // node_modules/io-ts/lib/PathReporter.js
  var require_PathReporter = __commonJS({
    "node_modules/io-ts/lib/PathReporter.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.PathReporter = exports.success = exports.failure = void 0;
      var _1 = require_lib();
      var Either_1 = require_Either();
      function stringify(v) {
        if (typeof v === "function") {
          return _1.getFunctionName(v);
        }
        if (typeof v === "number" && !isFinite(v)) {
          if (isNaN(v)) {
            return "NaN";
          }
          return v > 0 ? "Infinity" : "-Infinity";
        }
        return JSON.stringify(v);
      }
      function getContextPath(context) {
        return context.map(function(_a) {
          var key = _a.key, type2 = _a.type;
          return key + ": " + type2.name;
        }).join("/");
      }
      function getMessage(e) {
        return e.message !== void 0 ? e.message : "Invalid value " + stringify(e.value) + " supplied to " + getContextPath(e.context);
      }
      function failure(es) {
        return es.map(getMessage);
      }
      exports.failure = failure;
      function success() {
        return ["No errors!"];
      }
      exports.success = success;
      exports.PathReporter = {
        report: Either_1.fold(failure, success)
      };
    }
  });

  // src/api-helpers.ts
  var import_url_join = __toModule(require_url_join());
  function getHeaders(authToken) {
    return {
      "Content-Type": "application/json",
      ...authToken != null ? { Authorization: `Bearer ${authToken}` } : {}
    };
  }
  function createApiHelpers(baseURL, authContext) {
    async function apiFetch(path, options) {
      const url = (0, import_url_join.default)(baseURL, path);
      const response = await fetch(url, {
        ...options,
        headers: getHeaders(authContext.getAuthToken())
      });
      if (response.status === 401) {
        return authContext.emitUnauthorized();
      }
      if (!response.ok) {
        throw new Error(`apiFetch failed with http-code ${response.status}`);
      }
      if (response.status === 201 || response.status === 204) {
        return response;
      }
      return response.json();
    }
    return {
      sendGetRequest: async (path, requestOptions) => {
        const options = {
          ...requestOptions,
          method: "GET"
        };
        return apiFetch(path, options);
      },
      sendPostRequest: async (path, body) => {
        const options = {
          method: "POST",
          body: JSON.stringify(body)
        };
        return apiFetch(path, options);
      },
      sendPutRequest: async (path, body) => {
        const options = {
          method: "PUT",
          body: JSON.stringify(body)
        };
        return apiFetch(path, options);
      },
      sendDeleteRequest: async (path, body) => {
        const options = {
          method: "DELETE",
          body: JSON.stringify(body)
        };
        return apiFetch(path, options);
      }
    };
  }

  // src/uniconfig/type-guards.ts
  function isCliOperationalState(state) {
    if (state !== null && typeof state === "object") {
      return "node-id" in state && typeof state["node-id"] === "string";
    }
    return false;
  }
  function isNetconfOperationalState(state) {
    if (state !== null && typeof state === "object") {
      return "node-id" in state && typeof state["node-id"] === "string";
    }
    return false;
  }
  function isCliConfigurationalState(state) {
    if (state !== null && typeof state === "object") {
      return "node-id" in state && typeof state["node-id"] === "string";
    }
    return false;
  }
  function isNetconfConfigurationalState(state) {
    if (state !== null && typeof state === "object") {
      return "node-id" in state && typeof state["node-id"] === "string";
    }
    return false;
  }
  function isCliTopology(topology) {
    if (topology !== null && typeof topology === "object") {
      return "topology" in topology;
    }
    return false;
  }
  function isNetconfTopology(topology) {
    if (topology !== null && typeof topology === "object") {
      return "topology" in topology;
    }
    return false;
  }
  function isCliDeviceTranslations(translations) {
    if (translations !== null && typeof translations === "object") {
      return "available-cli-device-translations" in translations;
    }
    return false;
  }

  // src/uniconfig/index.ts
  var BASE_CLI_URL = "/data/network-topology:network-topology/topology=cli";
  var BASE_NETCONF_URL = "/data/network-topology:network-topology/topology=topology-netconf";
  var CLI_TOPOLOGY_URL = `${BASE_CLI_URL}?content=nonconfig`;
  var NETCONF_TOPOLOGY_URL = `${BASE_NETCONF_URL}?content=nonconfig`;
  function createUniconfigApiClient(apiHelpers) {
    const { sendGetRequest, sendPostRequest, sendPutRequest, sendDeleteRequest } = apiHelpers;
    async function getCliOperationalState(nodeId) {
      const response = await sendGetRequest(`${BASE_CLI_URL}/node=${nodeId}?content=nonconfig`);
      const state = response.node[0];
      if (isCliOperationalState(state)) {
        return state;
      }
      throw new Error(`Expected CliOperationalState, got '${JSON.stringify(state)}'.`);
    }
    async function getNetconfOperationalState(nodeId) {
      const response = await sendGetRequest(`${BASE_NETCONF_URL}/node=${nodeId}?content=nonconfig`);
      const state = response.node[0];
      if (isNetconfOperationalState(state)) {
        return state;
      }
      throw new Error(`Expected NetconfOperationalState, got '${JSON.stringify(state)}'.`);
    }
    async function getCliConfigurationalState(nodeId) {
      const response = await sendGetRequest(`${BASE_CLI_URL}/node=${nodeId}?content=config`);
      const state = response.node[0];
      if (isCliConfigurationalState(state)) {
        return state;
      }
      throw new Error(`Expected CliConfigurationalState, got '${JSON.stringify(state)}'.`);
    }
    async function getNetconfConfigurationalState(nodeId) {
      const response = await sendGetRequest(`${BASE_NETCONF_URL}/node=${nodeId}?content=config`);
      const state = response.node[0];
      if (isNetconfConfigurationalState(state)) {
        return state;
      }
      throw new Error(`Expected NetconfConfigurationalState, got '${JSON.stringify(state)}'.`);
    }
    async function mountCliNode(nodeId, payload) {
      const datastore = await sendPutRequest(`${BASE_CLI_URL}/node=${nodeId}`, payload);
      return datastore;
    }
    async function mountNetconfNode(nodeId, payload) {
      const datastore = await sendPutRequest(`${BASE_NETCONF_URL}/node=${nodeId}`, payload);
      return datastore;
    }
    async function unmountCliNode(nodeId) {
      const datastore = await sendDeleteRequest(`${BASE_CLI_URL}/node=${nodeId}`);
      return datastore;
    }
    async function unmountNetconfNode(nodeId) {
      const datastore = await sendDeleteRequest(`${BASE_NETCONF_URL}/node=${nodeId}`);
      return datastore;
    }
    async function getCliTopology() {
      const topology = await sendGetRequest(CLI_TOPOLOGY_URL);
      if (isCliTopology(topology)) {
        return topology;
      }
      throw new Error(`Expected CliTopology, got '${JSON.stringify(topology)}'.`);
    }
    async function getNetconfTopology() {
      const topology = await sendGetRequest(NETCONF_TOPOLOGY_URL);
      if (isNetconfTopology(topology)) {
        return topology;
      }
      throw new Error(`Expected NetconfTopology, got '${JSON.stringify(topology)}'.`);
    }
    async function getCliDeviceTranslations() {
      const translations = await sendGetRequest(`/data/cli-translate-registry:available-cli-device-translations?content=nonconfig&depth=3`);
      if (isCliDeviceTranslations(translations)) {
        return translations;
      }
      throw new Error(`Expected CliDeviceTranslations, got '${JSON.stringify(translations)}'.`);
    }
    async function getCliConfigurationalDataStore(nodeId) {
      const datastore = await sendGetRequest(`/data/network-topology:network-topology/topology=uniconfig/node=${nodeId}/frinx-uniconfig-topology:configuration?content=config`);
      return datastore;
    }
    async function updateCliConfigurationalDataStore(nodeId, data) {
      const datastore = await sendPutRequest(`/data/network-topology:network-topology/topology=uniconfig/node=${nodeId}/frinx-uniconfig-topology:configuration`, data);
      return datastore;
    }
    async function getCliOperationalDataStore(nodeId) {
      const datastore = await sendGetRequest(`/data/network-topology:network-topology/topology=uniconfig/node=${nodeId}/frinx-uniconfig-topology:configuration?content=nonconfig`);
      return datastore;
    }
    async function calculateDiff(target) {
      const output = await sendPostRequest(`/operations/uniconfig-manager:calculate-diff`, target);
      return output;
    }
    async function commitToNetwork(target) {
      const output = await sendPostRequest(`/operations/uniconfig-manager:commit`, target);
      return output;
    }
    async function dryRunCommit(target) {
      const output = await sendPostRequest(`/operations/dryrun-manager:dryrun-commit`, target);
      return output;
    }
    async function syncFromNetwork(target) {
      const output = await sendPostRequest(`/operations/uniconfig-manager:sync-from-network`, target);
      return output;
    }
    async function replaceConfigWithOperational(target) {
      const output = await sendPostRequest(`/operations/uniconfig-manager:replace-config-with-operational`, target);
      return output;
    }
    async function getSnapshots() {
      const output = await sendGetRequest(`/data/network-topology:network-topology?content=config`);
      return output;
    }
    async function createSnapshot(target) {
      const output = await sendPostRequest(`/operations/snapshot-manager:create-snapshot`, target);
      return output;
    }
    async function deleteSnapshot(target) {
      const output = await sendPostRequest(`/operations/snapshot-manager:delete-snapshot`, target);
      return output;
    }
    async function replaceConfigWithSnapshot(target) {
      const output = await sendPostRequest(`/operations/snapshot-manager:replace-config-with-snapshot`, target);
      return output;
    }
    return {
      getCliOperationalState,
      getNetconfOperationalState,
      getCliConfigurationalState,
      getNetconfConfigurationalState,
      mountCliNode,
      mountNetconfNode,
      unmountCliNode,
      unmountNetconfNode,
      getCliTopology,
      getNetconfTopology,
      getCliDeviceTranslations,
      getCliConfigurationalDataStore,
      updateCliConfigurationalDataStore,
      getCliOperationalDataStore,
      calculateDiff,
      commitToNetwork,
      dryRunCommit,
      syncFromNetwork,
      replaceConfigWithOperational,
      getSnapshots,
      createSnapshot,
      deleteSnapshot,
      replaceConfigWithSnapshot
    };
  }

  // src/uniconfig-api.ts
  var _UniconfigApi = class {
    client;
    constructor(config) {
      const { authContext, url } = config;
      const apiHelpers = createApiHelpers(url, authContext);
      this.client = createUniconfigApiClient(apiHelpers);
    }
    static create(config) {
      if (!_UniconfigApi.instance) {
        this.instance = new _UniconfigApi(config);
      }
      return this.instance;
    }
  };
  var UniconfigApi = _UniconfigApi;
  __publicField(UniconfigApi, "instance");

  // src/uniflow/type-guards.ts
  function isWorkflow(workflow) {
    if (workflow !== null && typeof workflow === "object") {
      return "name" in workflow;
    }
    return false;
  }
  function isTaskDefinition(taskDefinition) {
    if (taskDefinition !== null && typeof taskDefinition === "object") {
      return "name" in taskDefinition;
    }
    return false;
  }
  function isArrayTypeOf(array2, testFunc) {
    return Array.isArray(array2) && array2.every(testFunc);
  }
  function isEventListener(eventListener) {
    if (eventListener !== null && typeof eventListener === "object") {
      return "name" in eventListener;
    }
    return false;
  }
  function isQueue(queue) {
    if (queue !== null && typeof queue === "object") {
      return "queueName" in queue;
    }
    return false;
  }

  // src/uniflow/index.ts
  function createUniflowApiClient(apiHelpers) {
    const { sendGetRequest, sendPostRequest, sendPutRequest, sendDeleteRequest } = apiHelpers;
    async function getWorkflows() {
      const response = await sendGetRequest("/metadata/workflow");
      const workflows = response.result;
      if (isArrayTypeOf(workflows, isWorkflow)) {
        return workflows;
      }
      throw new Error(`Expected Workflow[], got '${JSON.stringify(workflows)}'.`);
    }
    async function getSchedules() {
      const scheduled = await sendGetRequest("/schedule");
      return scheduled;
    }
    async function getSchedule(name, version) {
      const scheduled = await sendGetRequest(`/schedule/${name}:${version}`);
      return scheduled;
    }
    async function registerSchedule(name, version, schedule) {
      return sendPutRequest(`/schedule/${name}:${version}`, schedule);
    }
    async function deleteSchedule(name, version) {
      const scheduled = await sendDeleteRequest(`/schedule/${name}:${version}`);
      return scheduled;
    }
    async function registerTaskDefinition(taskDefinition) {
      const definition = await sendPostRequest("/metadata/taskdefs/", taskDefinition);
      return definition;
    }
    async function getTaskDefinitions() {
      const response = await sendGetRequest("/metadata/taskdefs");
      const definitions = response.result;
      if (isArrayTypeOf(definitions, isTaskDefinition)) {
        return definitions;
      }
      throw new Error(`Expected TaskDefinitions[], got '${JSON.stringify(definitions)}'.`);
    }
    async function getTaskDefinition(name) {
      const response = await sendGetRequest(`/metadata/taskdefs/${name}`);
      const definition = response.result;
      if (isTaskDefinition(definition)) {
        return definition;
      }
      throw new Error(`Expected TaskDefinition, got '${JSON.stringify(definition)}'.`);
    }
    async function deleteTaskDefinition(name) {
      const query = "?archiveWorfklow=false";
      const definition = await sendDeleteRequest(`/metadata/taskdefs/${name}${query}`);
      return definition;
    }
    async function getWorkflow(name, version) {
      const response = await sendGetRequest(`/metadata/workflow/${name}?version=${version}`);
      const workflow = response.result;
      if (isWorkflow(workflow)) {
        return workflow;
      }
      throw new Error(`Expected Workflow, got '${JSON.stringify(workflow)}'.`);
    }
    async function deleteWorkflow(name, version) {
      const workflow = await sendDeleteRequest(`/metadata/workflow/${name}/${version}`);
      return workflow;
    }
    async function putWorkflow(workflows) {
      const workflow = await sendPutRequest("/metadata/workflow", workflows);
      return workflow;
    }
    async function getEventListeners() {
      const eventListeners = await sendGetRequest("/event");
      if (isArrayTypeOf(eventListeners, isEventListener)) {
        return eventListeners;
      }
      throw new Error(`Expected EventListener[], got '${JSON.stringify(eventListeners)}'.`);
    }
    async function registerEventListener(eventListener) {
      const eventListenerRes = await sendPostRequest("/event", eventListener);
      return eventListenerRes;
    }
    async function deleteEventListener(name) {
      const query = "?archiveWorfklow=false";
      const eventListenerRes = await sendDeleteRequest(`/event/${name}${query}`);
      return eventListenerRes;
    }
    async function getQueues() {
      const response = await sendGetRequest("/queue/data");
      const queues = response.polldata;
      if (isArrayTypeOf(queues, isQueue)) {
        return queues;
      }
      throw new Error(`Expected Queue[], got '${JSON.stringify(queues)}'.`);
    }
    async function getWorkflowExecutions(workflowId = "*", label = 'status:"RUNNING"', start = 0, size = "") {
      const executions = sendGetRequest(`/executions/?workflowId=${workflowId}&status=${label}&start=${start}&size=${size}`);
      return executions;
    }
    async function getWorkflowExecutionsHierarchical(query, label, start, size) {
      const executions = sendGetRequest(`/hierarchical/?workflowId=${query}&status=${label}&start=${start}&size=${size}`);
      return executions;
    }
    async function getWorkflowInstanceDetail(workflowId, options) {
      const workflowDetails = await sendGetRequest(`/id/${workflowId}`, options);
      return workflowDetails;
    }
    async function executeWorkflow(workflowPayload) {
      const payload = await sendPostRequest("/workflow", workflowPayload);
      return payload;
    }
    async function terminateWorkflows(workflowIds) {
      const workflowIdsRes = await sendDeleteRequest("/workflow/bulk/terminate", workflowIds);
      return workflowIdsRes;
    }
    async function pauseWorkflows(workflowIds) {
      const workflowIdsRes = await sendPutRequest("/workflow/bulk/pause", workflowIds);
      return workflowIdsRes;
    }
    async function resumeWorkflows(workflowIds) {
      const workflowIdsRes = await sendPutRequest("/workflow/bulk/resume", workflowIds);
      return workflowIdsRes;
    }
    async function retryWorkflows(workflowIds) {
      const workflowIdsRes = await sendPostRequest("/workflow/bulk/retry", workflowIds);
      return workflowIdsRes;
    }
    async function restartWorkflows(workflowIds) {
      const workflowIdsRes = await sendPostRequest("/workflow/bulk/restart", workflowIds);
      return workflowIdsRes;
    }
    async function deleteWorkflowInstance(workflowId) {
      const workflowIdRes = await sendDeleteRequest(`/workflow/${workflowId}`);
      return workflowIdRes;
    }
    async function getExternalStorage(path) {
      const data = await sendGetRequest(`/external/postgres/${path}`);
      return data;
    }
    return {
      getWorkflows,
      getSchedules,
      getSchedule,
      registerSchedule,
      deleteSchedule,
      registerTaskDefinition,
      getTaskDefinitions,
      getTaskDefinition,
      deleteTaskDefinition,
      getWorkflow,
      deleteWorkflow,
      putWorkflow,
      getEventListeners,
      registerEventListener,
      deleteEventListener,
      getQueues,
      getWorkflowExecutions,
      getWorkflowExecutionsHierarchical,
      getWorkflowInstanceDetail,
      executeWorkflow,
      terminateWorkflows,
      pauseWorkflows,
      resumeWorkflows,
      retryWorkflows,
      restartWorkflows,
      deleteWorkflowInstance,
      getExternalStorage
    };
  }

  // src/uniflow-api.ts
  var _UniflowApi = class {
    client;
    constructor(config) {
      const { authContext, url } = config;
      const apiHelpers = createApiHelpers(url, authContext);
      this.client = createUniflowApiClient(apiHelpers);
    }
    static create(config) {
      if (!_UniflowApi.instance) {
        this.instance = new _UniflowApi(config);
      }
      return this.instance;
    }
  };
  var UniflowApi = _UniflowApi;
  __publicField(UniflowApi, "instance");

  // src/graphql-api.ts
  var _GraphQLApi = class {
    client;
    constructor(config) {
      const { authContext, url } = config;
      this.client = {
        clientOptions: {
          url,
          fetchOptions: () => {
            const authToken = authContext.getAuthToken();
            return {
              headers: {
                ...authToken != null ? { Authorization: `Bearer ${authToken}` } : {}
              }
            };
          }
        },
        onError: () => {
          config.authContext.emitUnauthorized();
        }
      };
    }
    static create(config) {
      if (!_GraphQLApi.instance) {
        this.instance = new _GraphQLApi(config);
      }
      return this.instance;
    }
  };
  var GraphQLApi = _GraphQLApi;
  __publicField(GraphQLApi, "instance");

  // src/unistore/index.ts
  var import_number = __toModule(require_number());
  var import_string = __toModule(require_string());

  // src/unistore/filter.helpers.ts
  function joinNonNullFilters(filters) {
    const separator = encodeURIComponent("&&");
    return filters.filter((f) => f !== null).join(separator);
  }
  function getServiceFilterParams(serviceFilter) {
    const filters = [];
    filters.push(serviceFilter.id ? `@."vpn-id"like_regex"${serviceFilter.id}"` : null);
    filters.push(serviceFilter.customerName ? `@."customer-name"like_regex"${serviceFilter.customerName}"` : null);
    const joinedFilters = joinNonNullFilters(filters);
    return joinedFilters ? `&jsonb-filter=${joinNonNullFilters(filters)}` : "";
  }
  function getSiteFilterParams(siteFilter) {
    const filters = [];
    filters.push(siteFilter.id ? `@."site-id"like_regex"${siteFilter.id}"` : null);
    filters.push(siteFilter.locationId ? `exists({@/locations/location}[*]  ? (@."location-id"like_regex"${siteFilter.locationId}"))` : null);
    filters.push(siteFilter.deviceId ? `exists({@/devices/device}[*]  ? (@."device-id"like_regex"${siteFilter.deviceId}"))` : null);
    const joinedFilters = joinNonNullFilters(filters);
    return joinedFilters ? `&jsonb-filter=${joinNonNullFilters(filters)}` : "";
  }
  function getSiteNetworkAccessFilterParams(siteNetworkAccessFilter) {
    const filters = [];
    filters.push(siteNetworkAccessFilter.id ? `@."site-network-access-id"like_regex"${siteNetworkAccessFilter.id}"` : null);
    filters.push(siteNetworkAccessFilter.locationId ? `@."location-reference"like_regex"${siteNetworkAccessFilter.locationId}"` : null);
    filters.push(siteNetworkAccessFilter.deviceId ? `@."device-reference"like_regex"${siteNetworkAccessFilter.deviceId}"` : null);
    const joinedFilters = joinNonNullFilters(filters);
    return joinedFilters ? `&jsonb-filter=${joinNonNullFilters(filters)}` : "";
  }
  function getVpnBearerFilterParams(vpnBearerFilter) {
    const filters = [];
    filters.push(vpnBearerFilter.id ? `@."sp-bearer-reference"like_regex"${vpnBearerFilter.id}"` : null);
    filters.push(vpnBearerFilter.description ? `@."description"like_regex"${vpnBearerFilter.description}"` : null);
    const joinedFilters = joinNonNullFilters(filters);
    return joinedFilters ? `&jsonb-filter=${joinNonNullFilters(filters)}` : "";
  }

  // src/unistore/types.ts
  var import_Either = __toModule(require_Either());
  var t = __toModule(require_lib());
  var import_PathReporter = __toModule(require_PathReporter());
  var YANG_MODULE = "gamma-l3vpn-svc";
  function optional(type2) {
    return t.union([type2, t.void]);
  }
  function extractResult(result) {
    return (0, import_Either.fold)(() => {
      const errorMessages = import_PathReporter.PathReporter.report(result);
      throw new Error(`BAD_REQUEST: ${errorMessages.join(",")}`);
    }, (data) => data)(result);
  }
  var VpnServicesOutputValidator = t.type({
    "vpn-service": t.array(t.type({
      "vpn-id": t.string,
      "customer-name": t.string,
      "extranet-vpns": t.type({
        "extranet-vpn": optional(t.array(t.type({
          "vpn-id": t.string,
          "local-sites-role": optional(t.string)
        })))
      }),
      "vpn-service-topology": t.string,
      "default-c-vlan": t.number
    }))
  });
  function decodeVpnServicesOutput(value) {
    return extractResult(VpnServicesOutputValidator.decode(value));
  }
  var SiteDevicesValidator = t.type({
    device: optional(t.array(t.type({
      "device-id": t.string,
      management: optional(t.type({
        address: t.string
      })),
      location: t.string
    })))
  });
  var MaximumRoutesValidator = t.type({
    "address-family": t.array(t.type({
      af: t.literal("ipv4"),
      "maximum-routes": t.number
    }))
  });
  var SiteVpnFlavorValidator = t.union([
    t.literal(`${YANG_MODULE}:site-vpn-flavor-single`),
    t.literal(`${YANG_MODULE}:site-vpn-flavor-sub`),
    t.literal(`${YANG_MODULE}:site-vpn-flavor-nni`)
  ]);
  var ManagementValidator = t.type({
    type: t.union([
      t.literal(`${YANG_MODULE}:point-to-point`),
      t.literal(`${YANG_MODULE}:provider-managed`),
      t.literal(`${YANG_MODULE}:co-managed`),
      t.literal(`${YANG_MODULE}:customer-managed`)
    ])
  });
  var LocationsValidator = t.type({
    location: optional(t.array(t.type({
      "location-id": t.string,
      "postal-code": optional(t.string),
      state: optional(t.string),
      address: optional(t.string),
      city: optional(t.string),
      "country-code": optional(t.string)
    })))
  });
  function decodeLocationsOutput(value) {
    return extractResult(LocationsValidator.decode(value));
  }
  var VpnValidator = t.type({
    "vpn-id": t.string,
    "site-role": optional(t.string)
  });
  var VpnPoliciesValidator = t.type({
    "vpn-policy": t.array(t.type({
      "vpn-policy-id": t.string,
      entries: t.array(t.type({
        id: t.string,
        filters: t.type({
          filter: t.array(t.type({
            type: t.string,
            "lan-tag": t.array(t.string),
            "ipv4-lan-prefix": t.array(t.string)
          }))
        }),
        vpn: t.array(VpnValidator)
      }))
    }))
  });
  var SiteServiceValidator = t.type({
    qos: t.type({
      "qos-profile": t.type({
        "qos-profile": t.array(t.type({
          profile: t.string
        }))
      })
    })
  });
  var RoutingProtocolItemValidator = t.type({
    type: t.string,
    vrrp: optional(t.type({
      "address-family": t.array(t.string)
    })),
    static: optional(t.type({
      "cascaded-lan-prefixes": t.type({
        "ipv4-lan-prefixes": t.array(t.type({
          lan: t.string,
          "next-hop": t.string,
          "lan-tag": optional(t.string)
        }))
      })
    })),
    bgp: optional(t.type({
      "bgp-profiles": t.type({
        "bgp-profile": t.array(t.type({
          profile: t.string
        }))
      }),
      "autonomous-system": t.number,
      "address-family": t.array(t.string)
    }))
  });
  var RoutingProtocolsValidator = t.type({
    "routing-protocol": optional(t.array(RoutingProtocolItemValidator))
  });
  var IPConnectionValidator = t.type({
    oam: optional(t.type({
      bfd: optional(t.type({
        enabled: optional(t.boolean),
        "profile-name": optional(t.string)
      }))
    })),
    ipv4: optional(t.type({
      "address-allocation-type": optional(t.string),
      addresses: optional(t.type({
        "customer-address": optional(t.string),
        "prefix-length": optional(t.number),
        "provider-address": optional(t.string)
      }))
    }))
  });
  var SiteNetworkAccessValidator = t.type({
    "site-network-access": t.array(t.type({
      "site-network-access-id": t.string,
      "site-network-access-type": t.string,
      "ip-connection": optional(IPConnectionValidator),
      "maximum-routes": MaximumRoutesValidator,
      "location-reference": optional(t.string),
      "device-reference": optional(t.string),
      "vpn-attachment": optional(VpnValidator),
      availability: t.type({
        "access-priority": t.number
      }),
      bearer: t.type({
        "always-on": t.boolean,
        "bearer-reference": t.string,
        "requested-c-vlan": t.number,
        "requested-type": t.type({
          "requested-type": t.string,
          strict: t.boolean
        })
      }),
      service: t.type({
        "svc-input-bandwidth": t.number,
        "svc-output-bandwidth": t.number,
        qos: t.type({
          "qos-profile": t.type({
            "qos-profile": t.array(t.type({
              profile: t.string
            }))
          })
        })
      }),
      "routing-protocols": optional(RoutingProtocolsValidator)
    }))
  });
  function decodeSiteNetworkAccessOutput(value) {
    return extractResult(SiteNetworkAccessValidator.decode(value));
  }
  var VpnSitesOutputValidator = t.type({
    site: t.array(t.type({
      "site-id": t.string,
      devices: optional(SiteDevicesValidator),
      "site-network-accesses": optional(SiteNetworkAccessValidator),
      "maximum-routes": MaximumRoutesValidator,
      "site-vpn-flavor": SiteVpnFlavorValidator,
      "traffic-protection": t.type({
        enabled: t.boolean
      }),
      management: ManagementValidator,
      locations: LocationsValidator,
      service: optional(SiteServiceValidator)
    }))
  });
  function decodeVpnSitesOutput(value) {
    return extractResult(VpnSitesOutputValidator.decode(value));
  }
  var ValidProviderIdentifiersOutputValidator = t.type({
    "valid-provider-identifiers": t.type({
      "qos-profile-identifier": optional(t.array(t.type({
        id: t.string
      }))),
      "bfd-profile-identifier": optional(t.array(t.type({
        id: t.string
      }))),
      "bgp-profile-identifier": optional(t.array(t.type({
        id: t.string
      })))
    })
  });
  function decodeValidProviderIdentifiersOutput(value) {
    return extractResult(ValidProviderIdentifiersOutputValidator.decode(value));
  }
  var VpnCarrierItemsValidator = t.type({
    carrier: t.array(t.type({
      "carrier-name": t.string,
      description: optional(t.string)
    }))
  });
  var VpnCarriersValidator = t.type({
    carriers: optional(VpnCarrierItemsValidator)
  });
  function decodeVpnCarriersOutput(value) {
    return extractResult(VpnCarriersValidator.decode(value));
  }
  var VpnNodeItemsValidator = t.type({
    "vpn-node": t.array(t.type({
      "ne-id": t.string,
      "router-id": t.string,
      role: optional(t.string)
    }))
  });
  var VpnNodesValidator = t.type({
    "vpn-nodes": optional(VpnNodeItemsValidator)
  });
  function decodeVpnNodesOutput(value) {
    return extractResult(VpnNodesValidator.decode(value));
  }
  var BearerStatusValidator = t.type({
    "admin-status": optional(t.type({
      status: optional(t.string),
      "last-updated": optional(t.string)
    })),
    "oper-status": optional(t.type({
      status: optional(t.string),
      "last-updated": optional(t.string)
    }))
  });
  var EvcAttachmentOutputValidator = t.type({
    "evc-type": t.string,
    "customer-name": optional(t.string),
    "circuit-reference": t.string,
    "carrier-reference": optional(t.string),
    "svlan-id": optional(t.number),
    status: optional(BearerStatusValidator),
    "input-bandwidth": t.number,
    "qos-input-profile": optional(t.string),
    "upstream-bearer": optional(t.string)
  });
  var CarrierOutputValidator = t.type({
    "carrier-name": optional(t.string),
    "carrier-reference": optional(t.string),
    "service-type": optional(t.string),
    "service-status": optional(t.string)
  });
  var ConnectionOutputValidator = t.type({
    "encapsulation-type": optional(t.string),
    "svlan-assignment-type": optional(t.string),
    tpid: optional(t.string),
    mtu: t.number,
    "remote-ne-id": optional(t.string),
    "remote-port-id": optional(t.string)
  });
  var VpnBearerItemsOutputValidator = t.array(t.type({
    "sp-bearer-reference": t.string,
    description: optional(t.string),
    "ne-id": t.string,
    "port-id": t.string,
    status: optional(BearerStatusValidator),
    carrier: optional(CarrierOutputValidator),
    connection: optional(ConnectionOutputValidator),
    "default-upstream-bearer": optional(t.string),
    "evc-attachments": optional(t.type({
      "evc-attachment": t.array(EvcAttachmentOutputValidator)
    }))
  }));
  var VpnBearerOutputValidator = t.type({
    "vpn-bearer": optional(VpnBearerItemsOutputValidator)
  });
  function decodeVpnBearerOutput(value) {
    return extractResult(VpnBearerOutputValidator.decode(value));
  }
  var SvcBearerOutputValidator = t.type({
    carriers: optional(VpnCarriersValidator),
    "vpn-nodes": optional(VpnNodesValidator),
    "vpn-bearers": optional(VpnBearerOutputValidator)
  });
  var DefaultCVlanEnum;
  (function(DefaultCVlanEnum2) {
    DefaultCVlanEnum2["Main Corporate VPN"] = "400";
    DefaultCVlanEnum2["Guest Wifi VPN"] = "1000";
    DefaultCVlanEnum2["Dedicated SIP VPN"] = "50";
    DefaultCVlanEnum2["Custom C-VLAN"] = "custom";
  })(DefaultCVlanEnum || (DefaultCVlanEnum = {}));
  var AccessPriority;
  (function(AccessPriority2) {
    AccessPriority2["Primary Ethernet"] = "150";
    AccessPriority2["Backup Ethernet"] = "100";
    AccessPriority2["PDSL"] = "90";
    AccessPriority2["Backup PDSL"] = "80";
    AccessPriority2["4G"] = "70";
    AccessPriority2["Backup 4G"] = "60";
  })(AccessPriority || (AccessPriority = {}));

  // src/unistore/index.ts
  var UNICONFIG_SERVICE_URL = "/data/network-topology:network-topology/topology=unistore/node=service/frinx-uniconfig-topology:configuration";
  function getContentParameter(contentType) {
    return contentType ? `content=${contentType}` : "content=config";
  }
  function createUnistoreApiClient(apiHelpers) {
    const { sendGetRequest, sendPostRequest, sendPutRequest, sendDeleteRequest } = apiHelpers;
    async function getVpnServices(pagination, serviceFilter, contentType) {
      try {
        const paginationParams = pagination ? `&offset=${pagination.offset}&limit=${pagination.limit}` : "";
        const filterParams = serviceFilter ? getServiceFilterParams(serviceFilter) : "";
        const content = getContentParameter(contentType);
        const json = await sendGetRequest(`${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/vpn-services/vpn-service?${content}${paginationParams}${filterParams}`);
        const data = decodeVpnServicesOutput(json);
        return data;
      } catch (e) {
        console.error(e);
        return {
          "vpn-service": []
        };
      }
    }
    async function editVpnServices(vpnService) {
      const json = await sendPutRequest(`${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/vpn-services/vpn-service=${vpnService["vpn-service"][0]["vpn-id"]}`, vpnService);
      return json;
    }
    async function deleteVpnService(vpnServiceId) {
      const json = await sendDeleteRequest(`${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/vpn-services/vpn-service=${vpnServiceId}`);
      return json;
    }
    async function createVpnService(vpnService) {
      await sendPostRequest(`${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/vpn-services`, vpnService);
    }
    async function getVpnSites(pagination, siteFilter, contentType) {
      try {
        const paginationParams = pagination ? `&offset=${pagination.offset}&limit=${pagination.limit}` : "";
        const filterParams = siteFilter ? getSiteFilterParams(siteFilter) : "";
        const content = getContentParameter(contentType);
        const json = await sendGetRequest(`${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/sites/site?${content}${paginationParams}${filterParams}`);
        const data = decodeVpnSitesOutput(json);
        return data;
      } catch (e) {
        console.error(e);
        return {
          site: []
        };
      }
    }
    async function createVpnSite(vpnSite) {
      await sendPostRequest(`${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/sites`, vpnSite);
    }
    async function editVpnSite(vpnSite) {
      await sendPutRequest(`${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/sites/site=${vpnSite.site[0]["site-id"]}`, vpnSite);
    }
    async function deleteVpnSite(vpnSiteId) {
      await sendDeleteRequest(`${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/sites/site=${vpnSiteId}?content=config`);
    }
    async function getValidProviderIdentifiers() {
      const json = await sendGetRequest(`${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/vpn-profiles/valid-provider-identifiers`);
      const data = decodeValidProviderIdentifiersOutput(json);
      return data;
    }
    async function getVpnBearers(pagination, vpnBearerFilter, contentType) {
      try {
        const paginationParams = pagination ? `&offset=${pagination.offset}&limit=${pagination.limit}` : "";
        const filterParams = vpnBearerFilter ? getVpnBearerFilterParams(vpnBearerFilter) : "";
        const content = getContentParameter(contentType);
        const json = await sendGetRequest(`/data/network-topology:network-topology/topology=unistore/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/vpn-bearers/vpn-bearer?${content}${paginationParams}${filterParams}`);
        const data = decodeVpnBearerOutput(json);
        return data;
      } catch (e) {
        console.error(e);
        return {
          "vpn-bearer": []
        };
      }
    }
    async function createVpnBearer(bearer) {
      await sendPostRequest("/data/network-topology:network-topology/topology=unistore/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/vpn-bearers", bearer);
    }
    async function editVpnBearer(bearer) {
      await sendPutRequest(`/data/network-topology:network-topology/topology=unistore/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/vpn-bearers/vpn-bearer=${bearer["vpn-bearer"][0]["sp-bearer-reference"]}`, bearer);
    }
    async function deleteVpnBearer(id) {
      await sendDeleteRequest(`/data/network-topology:network-topology/topology=unistore/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/vpn-bearers/vpn-bearer=${id}`);
    }
    async function getVpnNodes() {
      try {
        const json = await sendGetRequest("/data/network-topology:network-topology/topology=unistore/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/vpn-nodes");
        const data = decodeVpnNodesOutput(json);
        return data;
      } catch (e) {
        console.error(e);
        return {
          "vpn-nodes": {
            "vpn-node": []
          }
        };
      }
    }
    async function editVpnNode(node) {
      await sendPutRequest(`/data/network-topology:network-topology/topology=unistore/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/vpn-nodes/vpn-node=${node["vpn-node"][0]["ne-id"]}`, node);
    }
    async function deleteVpnNode(nodeId) {
      await sendDeleteRequest(`/data/network-topology:network-topology/topology=unistore/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/vpn-nodes/vpn-node=${nodeId}`);
    }
    async function getVpnCarriers() {
      try {
        const json = await sendGetRequest("/data/network-topology:network-topology/topology=unistore/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/carriers");
        const data = decodeVpnCarriersOutput(json);
        return data;
      } catch (e) {
        console.error(e);
        return {
          carriers: {
            carrier: []
          }
        };
      }
    }
    async function createVpnCarrier(carrier) {
      await sendPostRequest("/data/network-topology:network-topology/topology=unistore/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/carriers", carrier);
    }
    async function editVpnCarrier(carrier) {
      await sendPutRequest(`/data/network-topology:network-topology/topology=unistore/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/carriers/carrier=${carrier.carrier[0]["carrier-name"]}`, carrier);
    }
    async function deleteVpnCarrier(carrierId) {
      await sendDeleteRequest(`/data/network-topology:network-topology/topology=unistore/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/carriers/carrier=${carrierId}`);
    }
    async function getBearerValidProviderIdentifiers() {
      try {
        const json = await sendGetRequest("/data/network-topology:network-topology/topology=unistore/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/valid-provider-identifiers");
        const data = decodeValidProviderIdentifiersOutput(json);
        return data;
      } catch (e) {
        console.error(e);
        return {
          "valid-provider-identifiers": {
            "bfd-profile-identifier": [],
            "qos-profile-identifier": [],
            "bgp-profile-identifier": []
          }
        };
      }
    }
    async function getVpnServiceCount(serviceFilter, contentType) {
      try {
        const filterParams = serviceFilter ? getServiceFilterParams(serviceFilter) : "";
        const content = getContentParameter(contentType);
        const data = await sendGetRequest(`${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/vpn-services/vpn-service?${content}&fetch=count${filterParams}`);
        if (!(0, import_number.isNumber)(data)) {
          throw new Error("not a number");
        }
        return data;
      } catch (e) {
        console.error(e);
        return 0;
      }
    }
    async function getVpnSiteCount(siteFilter, contentType) {
      try {
        const filterParams = siteFilter ? getSiteFilterParams(siteFilter) : "";
        const content = getContentParameter(contentType);
        const data = await sendGetRequest(`${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/sites/site?${content}&fetch=count${filterParams}`);
        if (!(0, import_number.isNumber)(data)) {
          throw new Error("not a number");
        }
        return data;
      } catch (e) {
        console.error(e);
        return 0;
      }
    }
    async function getVpnBearerCount(vpnBearerFilter, contentType) {
      try {
        const filterParams = vpnBearerFilter ? getVpnBearerFilterParams(vpnBearerFilter) : "";
        const content = getContentParameter(contentType);
        const data = await sendGetRequest(`/data/network-topology:network-topology/topology=unistore/node=bearer/frinx-uniconfig-topology:configuration/gamma-bearer-svc:bearer-svc/vpn-bearers/vpn-bearer?${content}&fetch=count${filterParams}`);
        if (!(0, import_number.isNumber)(data)) {
          throw new Error("not a number");
        }
        return data;
      } catch (e) {
        console.error(e);
        return 0;
      }
    }
    async function getLocations(siteId, pagination, contentType) {
      try {
        const paginationParams = pagination ? `&offset=${pagination.offset}&limit=${pagination.limit}` : "";
        const content = getContentParameter(contentType);
        const json = await sendGetRequest(`${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/sites/site=${siteId}/locations/location?${content}${paginationParams}`);
        const data = decodeLocationsOutput(json);
        return data;
      } catch (e) {
        console.error(e);
        return { location: [] };
      }
    }
    async function getLocationsCount(siteId, contentType) {
      try {
        const content = getContentParameter(contentType);
        const data = await sendGetRequest(`${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/sites/site=${siteId}/locations/location?${content}&fetch=count`);
        if (!(0, import_number.isNumber)(data)) {
          throw new Error("not a number");
        }
        return data;
      } catch (e) {
        console.error(e);
        return 0;
      }
    }
    async function getSiteNetworkAccesses(siteId, pagination, siteNetworkAccessFilter, contentType) {
      try {
        const paginationParams = pagination ? `&offset=${pagination.offset}&limit=${pagination.limit}` : "";
        const filterParams = siteNetworkAccessFilter ? getSiteNetworkAccessFilterParams(siteNetworkAccessFilter) : "";
        const content = getContentParameter(contentType);
        const json = await sendGetRequest(`${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/sites/site=${siteId}/site-network-accesses/site-network-access?${content}${paginationParams}${filterParams}`);
        const data = decodeSiteNetworkAccessOutput(json);
        return data;
      } catch (e) {
        console.error(e);
        return { "site-network-access": [] };
      }
    }
    async function getSiteNetworkAccessesCount(siteId, siteNetworkAccessFilter, contentType) {
      try {
        const filterParams = siteNetworkAccessFilter ? getSiteNetworkAccessFilterParams(siteNetworkAccessFilter) : "";
        const content = getContentParameter(contentType);
        const data = await sendGetRequest(`${UNICONFIG_SERVICE_URL}/gamma-l3vpn-svc:l3vpn-svc/sites/site=${siteId}/site-network-accesses/site-network-access?${content}&fetch=count${filterParams}`);
        if (!(0, import_number.isNumber)(data)) {
          throw new Error("not a number");
        }
        return data;
      } catch (e) {
        console.error(e);
        return 0;
      }
    }
    async function getTransactionCookie() {
      const response = await sendPostRequest("/operations/uniconfig-manager:create-transaction");
      const data = await response.text();
      if (!(0, import_string.isString)(data)) {
        throw new Error("not a string");
      }
      return data;
    }
    return {
      getVpnServices,
      editVpnServices,
      deleteVpnService,
      createVpnService,
      getVpnSites,
      createVpnSite,
      editVpnSite,
      deleteVpnSite,
      getValidProviderIdentifiers,
      getVpnBearers,
      createVpnBearer,
      editVpnBearer,
      deleteVpnBearer,
      getVpnNodes,
      editVpnNode,
      deleteVpnNode,
      getVpnCarriers,
      createVpnCarrier,
      editVpnCarrier,
      deleteVpnCarrier,
      getBearerValidProviderIdentifiers,
      getVpnServiceCount,
      getVpnSiteCount,
      getVpnBearerCount,
      getLocations,
      getLocationsCount,
      getSiteNetworkAccesses,
      getSiteNetworkAccessesCount,
      getTransactionCookie
    };
  }

  // src/unistore-api.ts
  var _UnistoreApi = class {
    client;
    constructor(config) {
      const { authContext, url } = config;
      const apiHelpers = createApiHelpers(url, authContext);
      this.client = createUnistoreApiClient(apiHelpers);
    }
    static create(config) {
      if (!_UnistoreApi.instance) {
        this.instance = new _UnistoreApi(config);
      }
      return this.instance;
    }
  };
  var UnistoreApi = _UnistoreApi;
  __publicField(UnistoreApi, "instance");
})();
//# sourceMappingURL=dist.js.map
