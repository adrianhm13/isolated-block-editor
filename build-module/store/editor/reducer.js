import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * WordPress dependencies
 */
import { serialize, parse, createBlock, synchronizeBlocksWithTemplate } from '@wordpress/blocks';

var getPattern = function getPattern(patterns, currentPattern) {
  return patterns && patterns.find(function (item) {
    return item.name === currentPattern;
  });
};
/** @typedef {import('../../index').IsoSettings} IsoSettings */

/**
 * Pattern type.
 * @typedef Pattern
 * @property {string} name - Name of the pattern.
 * @property {string} content - Content for the pattern.
 */

/**
 * Editor mode
 * @typedef {('visual'|'text')} EditorMode
 */

/**
 * The editor state object
 *
 * @typedef EditorState
 * @property {EditorMode} editorMode - whether in visual or code editing mode.
 * @property {boolean} isInserterOpened - whether the inserter is open
 * @property {boolean} isInspecting - whether the block inspector is open
 * @property {Pattern[]} patterns - array of patterns.
 * @property {string|null} currentPattern - current pattern name.
 * @property {string[]} ignoredContent - content to ignore when saving.
 * @property {object|null} gutenbergTemplate - the Gutenberg template
 * @property {boolean} isEditing - is this editor being used?
 * @property {boolean} isReady - is the editor ready?
 * @property {IsoSettings} settings - editor settings
 */

/** @type EditorState */


var DEFAULT_STATE = {
  // Editor state
  editorMode: 'visual',
  isInserterOpened: false,
  isEditing: false,
  isInspecting: false,
  isReady: false,
  patterns: [],
  currentPattern: null,
  gutenbergTemplate: null,
  ignoredContent: [],
  settings: {
    preferencesKey: null,
    persistenceKey: null,
    blocks: {
      allowBlocks: [],
      disallowBlocks: []
    },
    disallowEmbed: [],
    toolbar: {
      inserter: true,
      toc: false,
      undo: true,
      inspector: true,
      navigation: false
    },
    moreMenu: {
      editor: false,
      fullscreen: false,
      preview: false,
      topToolbar: false
    },
    linkMenu: [],
    currentPattern: null,
    defaultPreferences: {},
    allowApi: false
  }
};
/**
 * Ignored content are pieces of HTML that we don't need to save. This could be, for example, an empty pattern.
 *
 * @param {Pattern[]} patterns - Array of patterns.
 * @param {string} currentPattern - Selected pattern name.
 * @param {object|null} gutenbergTemplate - Gutenberg template.
 * @returns {string[]} Array of ignored HTML strings.
 */

function getIgnoredContent(patterns, currentPattern, gutenbergTemplate) {
  var ignored = [serialize(createBlock('core/paragraph')), serialize(createBlock('core/paragraph', {
    className: ''
  }))];
  var found = getPattern(patterns, currentPattern); // If we're using a starter pattern then add the empty pattern to our ignored content list

  if (found) {
    // We parse and then serialize so it will better match the formatting from Gutenberg when saving content
    ignored.push(serialize(parse(found.content)));
  } // If we're using a Gutenberg template then add that to the ignored list


  if (gutenbergTemplate) {
    ignored.push(serialize(synchronizeBlocksWithTemplate([], gutenbergTemplate)));
  }

  return ignored;
}

var reducer = function reducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_STATE;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case 'SETUP_EDITOR':
      {
        var _action$settings$iso = action.settings.iso,
            currentPattern = _action$settings$iso.currentPattern,
            patterns = _action$settings$iso.patterns;
        return _objectSpread(_objectSpread({}, state), {}, {
          patterns: patterns,
          currentPattern: currentPattern,
          ignoredContent: getIgnoredContent(patterns, currentPattern, action.settings.editor.template),
          gutenbergTemplate: action.settings.editor.template,
          settings: _objectSpread(_objectSpread({}, state.settings), action.settings.iso)
        });
      }

    case 'SET_CURRENT_PATTERN':
      return _objectSpread(_objectSpread({}, state), {}, {
        currentPattern: action.pattern,
        ignoredContent: getIgnoredContent(state.patterns, action.pattern, state.gutenbergTemplate),
        isInspecting: false
      });

    case 'SET_EDITOR_MODE':
      return _objectSpread(_objectSpread({}, state), {}, {
        editorMode: action.editorMode,
        isInspecting: false
      });

    case 'SET_INSERTER_OPEN':
      return _objectSpread(_objectSpread({}, state), {}, {
        isInserterOpened: action.isOpen,
        isInspecting: false
      });

    case 'SET_INSPECTOR_OPEN':
      return _objectSpread(_objectSpread({}, state), {}, {
        isInspecting: action.isOpen,
        isInserterOpened: false
      });

    case 'SET_EDITING':
      return _objectSpread(_objectSpread({}, state), {}, {
        isEditing: action.isEditing,
        isInspecting: false
      });

    case 'SET_EDITOR_READY':
      return _objectSpread(_objectSpread({}, state), {}, {
        isReady: action.isReady
      });
  }

  return state;
};

export default reducer;
//# sourceMappingURL=reducer.js.map