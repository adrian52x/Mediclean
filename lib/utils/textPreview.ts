/**
 * Helper function to get plain text preview for cards and other components
 * Removes markdown formatting and truncates text to specified length
 */
export const getPlainTextPreview = (text: string, maxLength: number = 100): string => {
    if (!text) return '';
    
    // Remove markdown formatting and bullet points
    let plainText = text
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold **text**
        .replace(/\*(.*?)\*/g, '$1')     // Remove italic *text*
        .replace(/^[•\-*]\s+/gm, '')    // Remove bullet points at line start
        .replace(/\n+/g, ' ')           // Replace line breaks with spaces
        .trim();
    
    // Truncate if too long
    if (plainText.length > maxLength) {
        plainText = plainText.substring(0, maxLength).trim() + '...';
    }
    
    return plainText;
};
