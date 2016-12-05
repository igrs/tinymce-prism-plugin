import Prism from 'prismjs';
import Utils from './utils';
import Dialog from './dialog';

export default {
  addPrismFullCodeSample(editor, url) {
    let $ = editor.$;
    editor.on('PreProcess', (e) => {
      $('pre[contenteditable=false]', e.node).
      filter(Utils.trimArg(Utils.isCodeSample)).
      each(function(idx, elm) {
        let $elm = $(elm), code = elm.textContent;
        $elm.attr('class', $.trim($elm.attr('class')));
        $elm.removeAttr('contentEditable');
        $elm.empty().append($('<code></code>').each(() => {
          this.textContent = code;
        }));
      });
    });

    editor.on('SetContent', () => {
      let unprocessedCodeSamples = 
      $('pre').
      filter(Utils.trimArg(Utils.isCodeSample)).
      filter((idx, elm) => {
        return elm.contentEditable !== 'false';
      });

      if (unprocessedCodeSamples.length) {
        editor.undoManager.transact(() => {
          unprocessedCodeSamples.each((idx, elm) => {
            $(elm).find('br').each((idx, elm) => {
              elm.parentNode.replaceChild(editor.getDoc().createTextNode('\n'), elm);
            });
            elm.contentEditable = false;
            elm.innerHTML = editor.dom.encode(elm.textContent);
            Prism.highlightElement(elm);
            elm.className = $.trim(elm.className);
          });
        });
      }
    });

    editor.addCommand('prism', () => {
      if (editor.selection.isCollapsed()) {
        Dialog.open(editor);
      } else {
        editor.formatter.toggle('code');
      }
    });

    editor.addButton('prism', {
      text: '{;}',
      style: 'font-weight: bold',
      cmd: 'prism',
      title: 'Insert/Edit code sample'
    });

    editor.on('init',() => {
      let contentCssList = editor.settings.prism_content_css_list;
      if (Array.isArray(contentCssList)) {
        contentCssList.forEach((css) => {
          let linkElm = editor.dom.create('link', {
					  rel: 'stylesheet',
					  href: css,
				  });
          editor.getDoc().getElementsByTagName('head')[0].appendChild(linkElm);
        });
      }
    });
  },
};
