
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
import { Message } from "@shared/schema";
import html2pdf from 'html2pdf.js';

export async function exportAsMarkdown(messages: Message[]) {
  const markdown = messages.map(msg => {
    const role = msg.role === 'user' ? 'You' : 'Assistant';
    return `### ${role}\n${msg.content}\n`;
  }).join('\n');

  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `chat-export-${new Date().toISOString()}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function exportAsPDF(messages: Message[]) {
  const content = document.createElement('div');
  content.className = 'pdf-export';
  
  messages.forEach(msg => {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message';
    const role = msg.role === 'user' ? 'You' : 'Assistant';
    msgDiv.innerHTML = `<h3>${role}</h3><p>${msg.content}</p>`;
    content.appendChild(msgDiv);
  });

  const opt = {
    margin: 1,
    filename: `chat-export-${new Date().toISOString()}.pdf`,
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  await html2pdf().set(opt).from(content).save();
}
