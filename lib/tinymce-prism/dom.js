export default {
  rawCharsRegExp: /[<>&\"\']/g,
  baseEntities: {
    '\"': '&quot;',
    '\'': '&#39;',
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '\u0060': '&#96;'
  },

  getViewPort() {
    return {
      w: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
      h: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
    };
  },

  encode(text) {
    return ('' + text).replace(this.rawCharsRegExp, (chr) => {
      return this.baseEntities[chr] || chr;
    });
  },
};
