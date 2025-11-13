import React, { useRef, useEffect, useState } from 'react';
import Quill from 'quill';
import Text from '../Text';
import clsx from 'clsx';

const QuillEditor = ({
  label,
  inputDefault,
  placeholder,
  value,
  inputQuizz,
  onChange,
  error,
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
  const editorRef: any = useRef(null);
  const [editor, setEditor] = useState<Quill | null>(null);

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
              [{ color: [] }],
              [{ align: [] }],
              ['image'],
            ],
            handlers: {
              image: () => handleImageUpload(quill),
            },
          },
          clipboard: {
            matchVisual: false,
          },
        },
        placeholder,
      });

      // @ts-ignore
      // Handle pasted content formatting - only use clipboard matchers
      // quill.clipboard.addMatcher(Node.ELEMENT_NODE, (node, delta) => {
      //   const ops = delta.ops.map((op: any) => {
      //     if (op.insert && typeof op.insert === 'string') {
      //       return {
      //         insert: op.insert,
      //         attributes: {
      //           ...(op.attributes || {}),
      //           color: 'white',
      //           background: 'transparent',
      //         },
      //       };
      //     }
      //     return op;
      //   });
      //   return { ops };
      // });

      // @ts-ignore
      quill.clipboard.addMatcher(Node.TEXT_NODE, (node, delta) => {
        return {
          ops: delta.ops.map((op: any) => {
            if (op.insert && typeof op.insert === 'string') {
              return {
                insert: op.insert,
                attributes: {
                  color: 'white',
                  background: 'transparent',
                },
              };
            }
            return op;
          }),
        };
      });

      setEditor(quill);
      quill.on('text-change', () => {
        const content = quill.root.innerHTML;
        if (onChange) {
          onChange(content);
        }
      });

      // Thiết lập màu chữ mặc định cho editor là trắng
      quill.format('color', 'white');
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
    const input = document.createElement('input') as any;
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
    };
  };

  return (
    <div className="w-full flex flex-col gap-2">
      {label && (
        <Text type="font-16-600" className="text-letter">
          {label}
        </Text>
      )}
      <div
        className={clsx('w-full customContentEditor', {
          ['custom-quill-editor']: inputDefault,
          ['custom-quill-editor-quizz']: inputQuizz,
          // ['quill-error']: error,
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
