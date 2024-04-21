import React, { useState } from 'react';
import { Editor, EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css';

const DescriptionInput = ({ onChange }) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const handleEditorChange = (editorState) => {
    setEditorState(editorState);
    onChange(editorState.getCurrentContent().getPlainText());
  };

  return (
    <div className="desc">
      <Editor
      editorState={editorState}
      onChange={handleEditorChange}
      placeholder="Product Description"
      
    />
    </div>
  );
};

export default DescriptionInput;
