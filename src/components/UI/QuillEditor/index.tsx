import React, { useRef, useEffect, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import Text from '../Text';
import clsx from 'clsx';
import { useUploadFile } from '@/components/CreateCourse/service';
import { PREFIX_API } from '@/api/request';
import { API_PATH } from '@/api/constant';
import { getAccessToken } from '@/store/auth';

const QuillEditor = ({
  label,
  inputDefault,
  placeholder,
  value,
  inputQuizz,
  onChange,
  error,
  autoFocus = false,
}: {
  label?: string;
  inputDefault?: boolean;
  placeholder?: string;
  value?: string;
  inputQuizz?: boolean;
  error?: string;
  onChange?: (value: string) => void;
  autoFocus?: boolean;
}) => {
  const editorRef = useRef(null);
  const [editor, setEditor] = useState<Quill | null>(null);

  const accessToken = getAccessToken();

  useEffect(() => {
    if (editorRef.current) {
      const quill = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: {
            container: [
              [{ header: '1' }, { header: '2' }],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['bold', 'italic', 'underline'],
              [{ color: [] }, { background: [] }],
              [{ align: [] }],
              ['image'],
            ],
            handlers: {
              image: () => handleImageUpload(quill),
            },
          },
        },
        placeholder,
      });
      setEditor(quill);
      quill.on('text-change', () => {
        const content = quill.root.innerHTML;
        if (onChange) {
          onChange(content);
        }
      });
    }

    return () => {
      if (editorRef.current) {
        editorRef.current = null;
      }
    };
  }, [placeholder]);

  useEffect(() => {
    if (editor && value !== undefined) {
      const currentContent = editor.root.innerHTML;
      if (currentContent !== value) {
        const selection = editor.getSelection();
        editor.root.innerHTML = value;
        if (selection) {
          editor.setSelection(selection.index, selection.length);
        }
      }
    }
  }, [editor, value]);

  const handleImageUpload = (quill: Quill) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      if (input.files && input.files[0]) {
        const file = input.files[0];
        const reader = new FileReader();

        reader.onload = () => {
          const range = quill.getSelection();
          if (range) {
            quill.insertEmbed(range.index, 'image', reader.result as string);
          }
        };

        reader.readAsDataURL(file);
      }
      // if (input.files && input.files[0]) {
      //   const file = input.files[0];

      //   try {
      //     const formData = new FormData();
      //     formData.append('file', file);

      //     const response = await fetch(`${PREFIX_API}${API_PATH.UPLOAD_FILE}`, {
      //       method: 'POST',
      //       body: formData,
      //       headers: {
      //         Authorization: `Bearer ${accessToken}`,
      //       },
      //     });

      //     const result = await response.json();

      //     if (result?.data?.url) {
      //       const imageUrl = result?.data?.url;

      //       const range = quill.getSelection();

      //       if (range) {
      //         quill.insertEmbed(range.index, 'image', imageUrl);
      //       }
      //     } else {
      //     }
      //   } catch (error) {
      //     console.error('error', error);
      //   }
      // }
    };
  };

  return (
    <div className="w-full flex flex-col gap-2">
      {label && (
        <Text type="font-16-600" className="text-white">
          {label}
        </Text>
      )}
      <div
        className={clsx('w-full', {
          ['custom-quill-editor']: inputDefault,
          ['custom-quill-editor-quizz']: inputQuizz,
          ['quill-error']: error,
        })}
      >
        <div ref={editorRef}></div>
      </div>
      {error && (
        <Text type="font-14-400" className="text-danger-300">
          {error}
        </Text>
      )}
    </div>
  );
};

export default QuillEditor;
