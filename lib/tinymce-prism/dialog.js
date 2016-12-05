import Prism from 'prismjs';
import Utils from './utils';
import DOM from './dom';

export default {
  getLanguages(editor) {
    var defaultLanguages = [
      {text: 'HTML/XML', value: 'markup'},
      {text: 'JavaScript', value: 'javascript'},
      {text: 'CSS', value: 'css'},
      {text: 'PHP', value: 'php'},
      {text: 'Ruby', value: 'ruby'},
      {text: 'Python', value: 'python'},
      {text: 'Java', value: 'java'},
      {text: 'C', value: 'c'},
      {text: 'C#', value: 'csharp'},
      {text: 'C++', value: 'cpp'}
    ];

    var customLanguages = editor.settings.prism_languages;
    return customLanguages ? customLanguages : defaultLanguages;
  },

  insertCodeSample(editor, language, code) {
    editor.undoManager.transact(() => {
      var node = this.getSelectedCodeSample(editor);
      code = DOM.encode(code);
      if (node) {
        editor.dom.setAttrib(node, 'class', 'language-' + language);
        node.innerHTML = code;
        Prism.highlightElement(node);
        editor.selection.select(node);
      } else {
        editor.insertContent('<pre id="__new" class="language-' + language + '">' + code + '</pre>');
        editor.selection.select(editor.$('#__new').removeAttr('id')[0]);
      }
    });
  },

  getSelectedCodeSample(editor) {
    var node = editor.selection.getNode();
    if (Utils.isCodeSample(node)) {
      return node;
    }
    return null;
  },

  getCurrentCode(editor) {
    var node = this.getSelectedCodeSample(editor);
    if (node) {
      return node.textContent;
    }
    return '';
  },
  
  getCurrentLanguage(editor) {
    var matches, node =this.getSelectedCodeSample(editor);
    if (node) {
      matches = node.className.match(/language-(\w+)/);
      return matches ? matches[1] : '';
    }
    return '';
  },
  
  open(editor) {
    editor.windowManager.open({
      title: 'Insert/Edit code sample',
      minWidth: Math.min(DOM.getViewPort().w, editor.getParam('codesample_dialog_width', 800)),
      minHeight: Math.min(DOM.getViewPort().h, editor.getParam('codesample_dialog_height', 650)),
      layout: 'flex',
      direction: 'column',
      align: 'stretch',
      body: [
        {
          type: 'listbox',
          name: 'language',
          label: 'Language',
          maxWidth: 200,
          value: this.getCurrentLanguage(editor),
          values: this.getLanguages(editor),
        },
        {
          type: 'textbox',
          name: 'code',
          multiline: true,
          spellcheck: false,
          ariaLabel: 'Code view',
          flex: 1,
          style: 'direction: ltr; text-align: left',
          classes: 'monospace',
          value: this.getCurrentCode(editor),
          autofocus: true
        }
      ],
      onSubmit: (e) => {
        this.insertCodeSample(editor, e.data.language, e.data.code);
      }
    });
  },
};
