import type {SimpleChange, EditorFacade, Selection} from 'collaborative-editor';
import type {EditorView} from 'codemirror';

export class CodemirrorEditorFacade implements EditorFacade {
  public selection!: Selection;
  public onchange?: (changes: SimpleChange[] | void) => void;
  public onselection?: () => void;

  constructor(protected readonly editor: EditorView) {}

  public get(): string {
    return this.editor.state.doc.toString();
  }

  // public getLength(): number {
  //   throw new Error('Not implemented');
  // }

  public set(text: string): void {
    const state = this.editor.state;
    state.update({
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

  // public dispose(): void {
  //   throw new Error('Not implemented');
  // }
}
