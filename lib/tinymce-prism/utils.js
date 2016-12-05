export default {
  
  isCodeSample(elm) {
    return elm && elm.nodeName == 'PRE' && elm.className.indexOf('language-') !== -1;
  },

  trimArg(predicateFn) {
    return function(arg1, arg2) {
      return predicateFn(arg2);
    };
  }
  
};
