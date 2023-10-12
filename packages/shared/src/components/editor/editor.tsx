import MonacoEditor, { BeforeMount, EditorProps, OnMount, useMonaco } from '@monaco-editor/react';
import * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';
import React, { FC, useCallback, useRef } from 'react';

const Editor: FC<EditorProps> = ({
  value,
  onChange,
  language = 'json',
  height = '600px',
  width = 'auto',
  ...props
}) => {
  const monaco = useMonaco();
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);

  const updateEditorLayout = useCallback(() => {
    // Type BUG: editor.IDimension.width & editor.IDimension.height should be "number"
    // but it needs to have "auto" otherwise layout can't be updated;
    // eslint-disable-next-line
    const editor: any = editorRef.current;
    if (!editor) return;
    // Initialize layout's width and height
    editor.layout({
      width: 'auto',
      height: 'auto',
    });
    // eslint-disable-next-line
    const editorEl = editor._domElement;
    if (editorEl == null) {
      return;
    }
    const { width: newWidth, height: newHeight } = editorEl.getBoundingClientRect();
    // update responsive width and height
    editor.layout({
      width: newWidth,
      height: newHeight,
    });
  }, []);

  const handleJsonSchemasUpdate = useCallback(() => {
    monaco?.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
    });
  }, [monaco]);

  const handleEditorWillMount: BeforeMount = () => {
    handleJsonSchemasUpdate();
  };

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;

    editor.getModel()?.updateOptions({ tabSize: 2, insertSpaces: false });
    updateEditorLayout();

    window.addEventListener('resize', updateEditorLayout);
  };

  return (
    <MonacoEditor
      theme="light"
      height={height}
      width={width}
      defaultLanguage={language}
      language={language}
      {...(value != null ? { value } : {})}
      options={{
        automaticLayout: true,
        autoClosingBrackets: 'always',
        autoClosingQuotes: 'always',
        formatOnPaste: true,
        formatOnType: true,
        scrollBeyondLastLine: false,
        readOnly: onChange == null,
      }}
      {...(onChange != null ? { onChange } : {})}
      onMount={handleEditorDidMount}
      beforeMount={handleEditorWillMount}
      path=""
      {...props}
    />
  );
};

export default Editor;
