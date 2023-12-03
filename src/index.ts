import {StrBinding} from 'collaborative-editor';
import {CodemirrorEditorFacade} from './CodemirrorEditorFacade';
import type {EditorView} from 'codemirror';
import type {StrApi} from 'json-joy/es2020/json-crdt';

export const bind = (str: StrApi, editor: EditorView, polling?: boolean): (() => void) => {
  const facade = new CodemirrorEditorFacade(editor);
  return StrBinding.bind(str, facade, polling);
};
