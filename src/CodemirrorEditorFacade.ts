import type {EditorView} from 'codemirror';
import type {SimpleChange, EditorFacade, Selection} from 'collaborative-editor';

export class CodemirrorEditorFacade implements EditorFacade {
  public selection!: Selection;
  public onchange?: (changes: SimpleChange[] | void) => void;
  public onselection?: () => void;

  private _d?: (...args: any[]) => unknown;

  constructor(protected readonly editor: EditorView) {
    this._d = editor.dispatch;
    Object.defineProperty(editor, 'dispatch', {
      ...Object.getOwnPropertyDescriptor(editor, 'dispatch'),
      value: (...args: any[]) => {
        const res = this._d!.apply(editor, args);
        this.onchange?.();
        return res;
      },
    });
  }

  public get(): string {
    return this.editor.state.doc.toString();
  }

  public getLength(): number {
    return this.editor.state.doc.length;
  }

  public set(text: string): void {
    const editor = this.editor;
    const state = editor.state;
    editor.dispatch({
      changes: {
        from: 0,
        to: state.doc.length,
        insert: text,
      },
    });
  }

  // public ins(pos: number, text: string): void {
  //   throw new Error('Not implemented');
  // }

  // public del(pos: number, length: number): void {
  //   throw new Error('Not implemented');
  // }

  // public getSelection(): [number, number, -1 | 0 | 1] | null {
  //   throw new Error('Not implemented');
  // }

  // public setSelection(start: number, end: number, direction: -1 | 0 | 1): void {
  //   throw new Error('Not implemented');
  // }

  public dispose(): void {
    if (this._d) {
      Object.defineProperty(this.editor, 'dispatch', {
        ...Object.getOwnPropertyDescriptor(this.editor, 'dispatch'),
        value: this._d,
      });
      this._d = undefined;
    }
  }
}
