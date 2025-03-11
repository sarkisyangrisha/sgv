import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export const formatDate = (date: string | Date): string => {
  return format(new Date(date), 'd MMMM yyyy', { locale: ru });
};

export const formatEditorContent = (content: string): string => {
  if (!content) return '';

  // Split content into blocks
  const blocks = content.split('\n\n');
  
  // Process each block
  const formattedBlocks = blocks.map(block => {
    const trimmedBlock = block.trim();
    
    // Skip empty blocks
    if (!trimmedBlock) return '';
    
    // Handle lists
    if (trimmedBlock.startsWith('- ') || trimmedBlock.startsWith('* ')) {
      const items = trimmedBlock.split('\n').map(item => {
        const listItem = item.replace(/^[-*]\s+/, '').trim();
        return `<!-- wp:list-item -->\n<li>${listItem}</li>\n<!-- /wp:list-item -->`;
      }).join('\n');
      
      return `<!-- wp:list -->\n<ul>\n${items}\n</ul>\n<!-- /wp:list -->`;
    }
    
    // Handle paragraphs
    return `<!-- wp:paragraph -->\n<p>${trimmedBlock}</p>\n<!-- /wp:paragraph -->`;
  });
  
  return formattedBlocks.filter(Boolean).join('\n\n');
};

export const unformatEditorContent = (content: string): string => {
  if (!content) return '';

  let plainText = content
    // Convert paragraphs
    .replace(/<!-- wp:paragraph -->\s*<p>(.*?)<\/p>\s*<!-- \/wp:paragraph -->/gs, '$1\n\n')
    // Convert lists
    .replace(/<!-- wp:list -->\s*<ul>(.*?)<\/ul>\s*<!-- \/wp:list -->/gs, '$1\n\n')
    .replace(/<!-- wp:list-item -->\s*<li>(.*?)<\/li>\s*<!-- \/wp:list-item -->/g, '- $1\n')
    // Remove any remaining HTML tags
    .replace(/<[^>]+>/g, '')
    // Remove any remaining WordPress comments
    .replace(/<!--[\s\S]*?-->/g, '')
    // Normalize whitespace
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return plainText;
};

export const getPlainText = (content: string): string => {
  return unformatEditorContent(content)
    .replace(/\n+/g, ' ')
    .trim();
};