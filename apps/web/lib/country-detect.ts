export function detectCountry(): 'PK' | 'IN' | null {
  if (typeof navigator === 'undefined') {
    return null;
  }

  const language = navigator.language || '';
  let region = '';

  try {
    region = new Intl.Locale(language).region?.toLowerCase() ?? '';
  } catch {
    const parts = language.split('-');
    const candidate = parts.length > 1 ? parts[parts.length - 1] : undefined;
    region = candidate ? candidate.toLowerCase() : '';
  }

  if (region === 'pk') {
    return 'PK';
  }
  if (region === 'in') {
    return 'IN';
  }

  return null;
}
