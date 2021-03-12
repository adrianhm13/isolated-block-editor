var effects = {
  TOGGLE_FEATURE: function TOGGLE_FEATURE(action, store) {
    var getState = store.getState;

    var _getState = getState(),
        preferences = _getState.preferences,
        editor = _getState.editor; // Save the feature to `localStorage`


    if (editor.settings.preferencesKey) {
      localStorage.setItem(editor.settings.preferencesKey, JSON.stringify(preferences));
    }
  }
};
export default effects;
//# sourceMappingURL=effects.js.map