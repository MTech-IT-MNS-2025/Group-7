(function(global){
  function modexp_js(a,b,n){
    a = a % n;
    var result = 1;
    a = Number(a); b = Number(b); n = Number(n);
    while (b > 0){
      if (b & 1) result = (result * a) % n;
      a = (a * a) % n;
      b = b >> 1;
    }
    return result >>> 0;
  }
  var Module = global.Module || {};
  Module.cwrap = Module.cwrap || function(name, ret, args){
    if (name === 'modexp') {
      return function(a,b,n){ return modexp_js(Number(a), Number(b), Number(n)); };
    }
    throw new Error('unknown export ' + name);
  };
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { modexp: function(a,b,n){ return modexp_js(Number(a), Number(b), Number(n)); }, Module: Module };
  }
  global.Module = Module;
  global._modexp_js = modexp_js;
})(typeof window !== 'undefined' ? window : global);
