import React, { useRef, useEffect, useState, useCallback } from 'react';
import Quill from 'quill';
import Text from '../Text';
import clsx from 'clsx';

const VideoBlot: any = Quill.import('blots/embed');
class Video extends VideoBlot {
  static blotName = 'video';
  static tagName = 'video';

  static create(value: string) {
    const node = super.create();
    node.setAttribute('src', value);
    node.setAttribute('controls', 'true');
    node.setAttribute('style', 'max-width: 100%; height: auto;');
    return node;
  }

  static value(node: HTMLVideoElement) {
    return node.getAttribute('src');
  }
}

// Custom Resizable Image Blot
const ImageBlot: any = Quill.import('formats/image');
class ResizableImage extends ImageBlot {
  static blotName = 'image';
  static tagName = 'img';

  static create(value: string | { src: string; width?: number; height?: number }) {
    const node = super.create(typeof value === 'string' ? value : value.src);
    const src = typeof value === 'string' ? value : value.src;
    const width = typeof value === 'object' ? value.width : undefined;
    const height = typeof value === 'object' ? value.height : undefined;
    
    node.setAttribute('src', src);
    node.setAttribute('draggable', 'false');
    
    if (width && height) {
      // If width and height are provided, use them
      node.setAttribute('data-width', width.toString());
      node.setAttribute('data-height', height.toString());
      node.setAttribute('style', `width: ${width}px; height: ${height}px; max-width: none; min-width: 50px; cursor: pointer;`);
    } else {
      // Default style
      node.setAttribute('style', 'max-width: 100%; height: auto; cursor: pointer;');
    }
    
    return node;
  }

  static value(node: HTMLImageElement) {
    const src = node.getAttribute('src') || '';
    const width = node.getAttribute('data-width');
    const height = node.getAttribute('data-height');
    const styleWidth = node.style.width;
    const styleHeight = node.style.height;
    
    // If we have explicit width/height from data attributes or inline styles
    if (width && height) {
      return {
        src,
        width: parseInt(width, 10),
        height: parseInt(height, 10),
      };
    }
    
    // Try to extract from inline styles if data attributes don't exist
    if (styleWidth && styleHeight && styleWidth !== 'auto' && styleHeight !== 'auto') {
      const widthMatch = styleWidth.match(/(\d+(?:\.\d+)?)px/);
      const heightMatch = styleHeight.match(/(\d+(?:\.\d+)?)px/);
      if (widthMatch && heightMatch) {
        return {
          src,
          width: parseFloat(widthMatch[1]),
          height: parseFloat(heightMatch[1]),
        };
      }
    }
    
    // Default: just return src
    return src;
  }
}

// Image Resize Handler
class ImageResize {
  private quill: Quill;
  private img: HTMLImageElement | null = null;
  private resizeHandle: HTMLDivElement | null = null;
  private isResizing: boolean = false;
  private startX: number = 0;
  private startY: number = 0;
  private startWidth: number = 0;
  private startHeight: number = 0;

  constructor(quill: Quill) {
    this.quill = quill;
    this.init();
  }

  private init() {
    const editor = this.quill.root;
    
    // Click outside to remove resize handle
    document.addEventListener('click', (e) => {
      if (this.img && !this.img.contains(e.target as Node) && 
          this.resizeHandle && !this.resizeHandle.contains(e.target as Node)) {
        this.hideResizeHandle();
      }
    });

    // Click on image to show resize handle
    editor.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG') {
        e.preventDefault();
        e.stopPropagation();
        this.showResizeHandle(target as HTMLImageElement);
      }
    });

    // Update resize handle position on scroll
    const updateOnScroll = () => {
      if (this.img && this.resizeHandle) {
        this.updateResizeHandlePosition();
      }
    };
    
    editor.addEventListener('scroll', updateOnScroll);
    window.addEventListener('scroll', updateOnScroll, true);

    // Handle mouse move for resizing
    document.addEventListener('mousemove', (e) => {
      if (this.isResizing && this.img) {
        const deltaX = e.clientX - this.startX;
        
        // Calculate new width based on horizontal movement
        const editorWidth = this.quill.root.getBoundingClientRect().width;
        const newWidth = Math.max(50, Math.min(editorWidth, this.startWidth + deltaX));
        
        // Maintain aspect ratio
        const aspectRatio = this.startWidth / this.startHeight;
        const finalWidth = newWidth;
        const finalHeight = finalWidth / aspectRatio;
        
        // Apply new dimensions
        this.img.style.width = `${finalWidth}px`;
        this.img.style.height = `${finalHeight}px`;
        this.img.style.maxWidth = 'none';
        this.img.style.minWidth = '50px';
        
        // Save dimensions to data attributes for persistence
        this.img.setAttribute('data-width', finalWidth.toString());
        this.img.setAttribute('data-height', finalHeight.toString());
        
        // Update resize handle position
        if (this.resizeHandle) {
          this.updateResizeHandlePosition();
        }
      }
    });

    // Handle mouse up to stop resizing
    document.addEventListener('mouseup', () => {
      if (this.isResizing && this.img) {
        this.isResizing = false;
        if (this.resizeHandle) {
          this.resizeHandle.style.cursor = 'nwse-resize';
        }
        
        // Trigger Quill update to persist the changes
        const width = parseFloat(this.img.getAttribute('data-width') || '0');
        const height = parseFloat(this.img.getAttribute('data-height') || '0');
        const src = this.img.getAttribute('src') || '';
        
        if (width > 0 && height > 0 && src) {
          // Find the blot for this image and update it
          const scroll = this.quill.scroll;
          const blot = scroll.find(this.img);
          
          if (blot) {
            const offset = blot.offset(scroll);
            const length = blot.length();
            
            // Update the image with new dimensions using Quill's API
            // First delete the old image, then insert the new one with dimensions
            this.quill.deleteText(offset, length, 'user');
            this.quill.insertEmbed(offset, 'image', { src, width, height }, 'user');
          }
        }
      }
    });
  }

  private showResizeHandle(img: HTMLImageElement) {
    this.hideResizeHandle();
    this.img = img;
    
    // Add visual indicator that image is selected
    img.style.outline = '2px solid #4285f4';
    img.style.outlineOffset = '2px';
    
    // Create resize handle
    const handle = document.createElement('div');
    handle.style.position = 'fixed';
    handle.style.width = '12px';
    handle.style.height = '12px';
    handle.style.backgroundColor = '#4285f4';
    handle.style.border = '2px solid white';
    handle.style.borderRadius = '50%';
    handle.style.cursor = 'nwse-resize';
    handle.style.zIndex = '1000';
    handle.style.pointerEvents = 'auto';
    handle.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
    
    this.resizeHandle = handle;
    document.body.appendChild(handle);
    
    // Wait for image to load if needed, then update position
    if (img.complete) {
      this.updateResizeHandlePosition();
    } else {
      img.onload = () => {
        this.updateResizeHandlePosition();
      };
    }
    
    // Add mousedown event to start resizing
    handle.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.startResize(e);
    });
  }

  private updateResizeHandlePosition() {
    if (!this.img || !this.resizeHandle) return;
    
    const imgRect = this.img.getBoundingClientRect();
    
    // Position handle at bottom-right corner of image (using fixed positioning)
    this.resizeHandle.style.left = `${imgRect.right - 6}px`;
    this.resizeHandle.style.top = `${imgRect.bottom - 6}px`;
  }

  private startResize(e: MouseEvent) {
    if (!this.img) return;
    
    this.isResizing = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
    
    const imgRect = this.img.getBoundingClientRect();
    this.startWidth = imgRect.width;
    this.startHeight = imgRect.height;
    
    if (this.resizeHandle) {
      this.resizeHandle.style.cursor = 'nwse-resize';
    }
  }

  private hideResizeHandle() {
    if (this.resizeHandle) {
      this.resizeHandle.remove();
      this.resizeHandle = null;
    }
    if (this.img) {
      this.img.style.outline = '';
      this.img.style.outlineOffset = '';
    }
    this.img = null;
  }
}
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
  const editorRef: any = useRef<HTMLDivElement | null>(null);
  const quillInstanceRef = useRef<Quill | null>(null);
  const [editor, setEditor] = useState<Quill | null>(null);

  const cleanupDom = useCallback(() => {
    if (!editorRef.current) return;
    const parent = editorRef.current.parentElement;
    // Remove toolbars that Quill attaches next to the editor
    if (parent) {
      parent.querySelectorAll('.ql-toolbar').forEach((tb: Element) => tb.remove());
    }
    editorRef.current.innerHTML = '';
  }, []);

  // Register custom video and image blots once
  useEffect(() => {
    if (!Quill.imports['formats/video']) {
      Quill.register(Video as any, true);
    }
    if (!Quill.imports['formats/image'] || Quill.imports['formats/image'] !== ResizableImage) {
      Quill.register(ResizableImage as any, true);
    }
  }, []);

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


  useEffect(() => {
    if (editorRef.current && !quillInstanceRef.current) {
      // ensure clean container before init
      cleanupDom();

      const quill = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: {
            container: [
              [{ header: '1' }, { header: '2' }],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['bold', 'italic', 'underline'],
              ['link'],
              [{ color: [] }],
              [{ align: [] }],
              ['image', 'video'],
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

      quillInstanceRef.current = quill;
      setEditor(quill);
      
      // Initialize image resize handler
      new ImageResize(quill);
      
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
      cleanupDom();
      quillInstanceRef.current = null;
      setEditor(null);
      editorRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (editor && value !== undefined) {
      const currentContent = editor.root.innerHTML;
      if (currentContent !== value) {
        const selection = editor.getSelection();
        editor.root.innerHTML = value;
        
        // After setting HTML, ensure images with data-width/data-height have correct styles
        const images = editor.root.querySelectorAll('img[data-width][data-height]');
        images.forEach((img) => {
          const imgElement = img as HTMLImageElement;
          const width = imgElement.getAttribute('data-width');
          const height = imgElement.getAttribute('data-height');
          if (width && height) {
            imgElement.style.width = `${width}px`;
            imgElement.style.height = `${height}px`;
            imgElement.style.maxWidth = 'none';
            imgElement.style.minWidth = '50px';
            imgElement.style.cursor = 'pointer';
          }
        });
        
        if (selection) {
          editor.setSelection(selection.index, selection.length);
        }
      }
    }
  }, [editor, value]);

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
