export async function postPortfolio(path, body, { signal, timeout = 30_000 } = {}) {
  const controller = new AbortController();
  const abort = () => controller.abort();
  if (signal?.aborted) abort();
  signal?.addEventListener('abort', abort, { once: true });
  const timer = setTimeout(abort, timeout);
  try {
    // Functions live at the origin root, even when VITE_BASE is a subpath.
    const response = await fetch(`/api/${path}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body), signal: controller.signal,
    });
    const data = await response.json().catch(() => null);
    if (!response.ok || !data) throw new Error(data?.error || 'This service is unavailable. Please try again later.');
    return data;
  } catch (error) {
    if (controller.signal.aborted && !signal?.aborted) throw new Error('The request took too long. Please try again.');
    if (error instanceof TypeError) throw new Error('Could not connect. Check your connection and try again.');
    throw error;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', abort);
  }
}

export function readAttachment(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the attachment. Please select it again.'));
    reader.onload = () => resolve({ filename: file.name, content: String(reader.result).split(',')[1] });
    reader.readAsDataURL(file);
  });
}
