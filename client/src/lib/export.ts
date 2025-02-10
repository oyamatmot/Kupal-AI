
export function exportAsMarkdown(messages: any[]) {
  const content = messages.map(msg => 
    `## ${msg.role.toUpperCase()}\n${msg.content}\n`
  ).join('\n');
  
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'conversation.md';
  a.click();
}

export function exportAsPDF(messages: any[]) {
  const content = messages.map(msg => 
    `${msg.role.toUpperCase()}\n${msg.content}\n\n`
  ).join('');
  
  const style = `
    <style>
      body { font-family: Arial, sans-serif; }
      .message { margin-bottom: 20px; }
      .role { font-weight: bold; }
    </style>
  `;
  
  const html = messages.map(msg => `
    <div class="message">
      <div class="role">${msg.role.toUpperCase()}</div>
      <div>${msg.content}</div>
    </div>
  `).join('');

  const fullHtml = `<!DOCTYPE html><html><head>${style}</head><body>${html}</body></html>`;
  const blob = new Blob([fullHtml], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'conversation.html';
  a.click();
}
