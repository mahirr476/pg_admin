export const generateSlug = (text: string): string => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')       // Replace spaces with dashes
      .replace(/[^\w\-]+/g, '')   // Remove non-word chars
      .replace(/\-\-+/g, '-')     // Replace multiple dashes with single dash
      .replace(/^-+/, '')         // Trim dash from start
      .replace(/-+$/, '');        // Trim dash from end
  };