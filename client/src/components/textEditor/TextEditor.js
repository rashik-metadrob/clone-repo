import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
// import {ClassicEditor} from '@ckeditor/ckeditor5-editor-classic';
import { getBase64 } from "../../utils/util";
import { useRef, useState } from "react";
// import Font from '@ckeditor/ckeditor5-font/src/font';

import "./styles.scss"

const TextEditor = ({
    value = "",
    onChange = () => {},
    onBlur = () => {}
}) => {
    const docuemntToolbarRef = useRef()
    const toolbarRef = useRef()

    function uploadAdapter(loader) {
        return {
            upload: () => {
                return new Promise((resolve, reject) => {
                    const body = new FormData();
                    loader.file.then(async (file) => {
                        body.append('files', file);
                        const previewUrl = await getBase64(file);
                        resolve({
                            default: previewUrl,
                        });
                    });
                });
            },
        };
    }

    function uploadPlugin(editor) {
        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
            return uploadAdapter(loader);
        };
    }

    return <>
    <div>
        <div className='text-editor__toolbar' ref={docuemntToolbarRef}>

        </div>
        <div className='text-editor_editor'>
            <CKEditor
                editor={DecoupledEditor}
                data={value}
                initial
                config={{
                    extraPlugins: [uploadPlugin],
                    toolbar: {
                        items: [ 
                            'undo', 'redo',
                            '|', 'heading',
                            '|', 'fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor',
                            '|', 'bold', 'italic',
                            '|', 'link',
                            '|', 'bulletedList', 'numberedList' 
                        ]
                    }
                    // placeholder: "Add your description here..."
                }}
                onReady={(editor) => {
                    if(toolbarRef.current){
                        docuemntToolbarRef.current.removeChild(toolbarRef.current)
                    }
                    toolbarRef.current = editor.ui.view.toolbar.element
                    docuemntToolbarRef.current.appendChild(editor.ui.view.toolbar.element)
                    editor.editing.view.change((writer) => {
                        writer.setStyle('height', '180px', editor.editing.view.document.getRoot());
                    });
                }}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    onChange(data);
                }}
                onBlur={(event, editor) => {
                    const data = editor.getData();
                    onBlur(data);
                }}
            />
        </div>
    </div>
        
    </>
}

export default TextEditor;