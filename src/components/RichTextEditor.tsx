import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  height?: number;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, height = 400, placeholder }: RichTextEditorProps) {
  return (
    <Editor
      apiKey="obz0wiivzl0wmmsbvsedaw0t2eqm0aqn3gjc56dkuuwsq6so"
      value={value}
      onEditorChange={onChange}
      init={{
        height,
        menubar: false,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'charmap', 'preview',
          'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'wordcount'
        ],
        toolbar: 'undo redo | formatselect | ' +
          'bold italic | bullist numlist | ' +
          'removeformat',
        formats: {
          p: { block: 'p' },
          h1: { block: 'h1' },
          h2: { block: 'h2' },
          h3: { block: 'h3' },
          h4: { block: 'h4' },
          h5: { block: 'h5' },
          h6: { block: 'h6' },
          ul: { block: 'ul' },
          ol: { block: 'ol' },
          li: { block: 'li' }
        },
        content_style: `
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            font-size: 16px;
            line-height: 1.5;
            color: #1f2937;
            margin: 1rem;
          }
          body.dark-mode {
            background-color: #1f2937;
            color: #f3f4f6;
          }
          p { margin: 0 0 1em 0; }
          ul, ol { margin: 0 0 1em 0; padding-left: 2em; }
          li { margin: 0.5em 0; }
        `,
        placeholder,
        skin: 'oxide',
        content_css: 'default',
        setup: (editor) => {
          // Add dark mode support
          const isDarkMode = document.documentElement.classList.contains('dark');
          if (isDarkMode) {
            editor.on('init', () => {
              const editorBody = editor.getBody();
              if (editorBody) {
                editorBody.classList.add('dark-mode');
              }
            });
          }

          // Format content on paste to maintain WordPress-style blocks
          editor.on('PastePreProcess', (e) => {
            let content = e.content;
            
            // Convert plain text paragraphs to WordPress blocks
            content = content.split('\n\n').map(p => {
              if (p.trim()) {
                return `<!-- wp:paragraph -->\n<p>${p.trim()}</p>\n<!-- /wp:paragraph -->`;
              }
              return '';
            }).join('\n\n');

            e.content = content;
          });
        }
      }}
    />
  );
}