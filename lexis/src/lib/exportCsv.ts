export function exportToCSV(data: { word: string; count: number }[], filename: string) {
  let csvContent = 'Word,Count\n';
  
  data.forEach(({ word, count }) => {
    // Escape quotes if any exist in the string
    const escapedWord = word.replace(/"/g, '""');
    csvContent += `"${escapedWord}",${count}\n`;
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
