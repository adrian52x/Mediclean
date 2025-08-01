import React from 'react';

/**
 * Formats plain text with basic styling support
 * Supports:
 * - Line breaks
 * - Bold text with **text**
 * - Italic text with *text*
 * - Bullet points starting with - or *
 */
export function formatText(text: string): React.ReactElement {
  if (!text) return <></>;

  const lines = text.split('\n');
  
  return (
    <>
      {lines.map((line, index) => {
        // Handle bullet points
        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
          const bulletText = line.trim().substring(2);
          return (
            <div key={index} className="flex items-start gap-2 mb-1">
              <span className="text-gray-500 mt-1">•</span>
              <span>{formatInlineText(bulletText)}</span>
            </div>
          );
        }
        
        // Handle empty lines
        if (line.trim() === '') {
          return <br key={index} />;
        }
        
        // Handle regular lines
        return (
          <div key={index} className="mb-1">
            {formatInlineText(line)}
          </div>
        );
      })}
    </>
  );
}

function formatInlineText(text: string): React.ReactElement {
  // Handle bold text **text**
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Handle italic text *text*
  text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  return <span dangerouslySetInnerHTML={{ __html: text }} />;
}
