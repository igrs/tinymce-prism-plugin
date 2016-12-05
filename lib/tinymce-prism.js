import tinymcePrismPlugin from './tinymce-prism/plugin';

export default {
  plugin: tinymcePrismPlugin,
};

if (window.tinymce) {
  tinymce.PluginManager.add('prism', tinymcePrismPlugin.addPrismFullCodeSample);  
}
