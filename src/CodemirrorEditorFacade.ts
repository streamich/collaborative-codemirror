import type {EditorView} from 'codemirror';
import type {SimpleChange, EditorFacade, Selection} from 'collaborative-editor';

export class CodemirrorEditorFacade implements EditorFacade {
  public selection!: Selection;
  public onchange?: (changes: SimpleChange[] | void) => void;
  public onselection?: () => void;

  private disposed = false;
  private d0!: EditorView['dispatch'];
  private d1 = (...specs: Parameters<EditorView['dispatch']>) => {
    const res = this.d0!.apply(this.editor, specs);
    if (this.disposed) return res;
    if (specs.length === 1 && specs[0].constructor.name === 'Transaction') {
      this.onchange?.();
    } else {
      this.onchange?.();
      this.onselection?.();
    }
    return res;
  };

  constructor(protected readonly editor: EditorView) {
    this.d0 = editor.dispatch;
    Object.defineProperty(editor, 'dispatch', {
      ...Object.getOwnPropertyDescriptor(editor, 'dispatch'),
      value: this.d1,
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
    this.d0({
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

  public getSelection(): [number, number, -1 | 0 | 1] | null {
    const state = this.editor.state;
    const range = state.selection?.ranges[0];
    if (!range) return null;
    let start = range.anchor;
    let end = range.head;
    let direction: -1 | 0 | 1 = 1;
    if (end < start) {
      [start, end] = [end, start];
      direction = -1;
    }
    return [start, end, direction];
  }

  public setSelection(start: number, end: number, direction: -1 | 0 | 1): void {
    let anchor = start;
    let head = end;
    if (direction === -1) [anchor, head] = [head, anchor];
    this.d0?.({ selection: {anchor, head} });
  }

  public dispose(): void {
    this.disposed = true;
    const editor = this.editor;
    const descriptor = Object.getOwnPropertyDescriptor(editor, 'dispatch');
    if (descriptor?.value === this.d1) {
      Object.defineProperty(editor, 'dispatch', {
        ...descriptor,
        value: this.d0,
      });
    }
  }
}
