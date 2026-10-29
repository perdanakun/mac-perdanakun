export async function postPortfolio(path, body, { signal, timeout = 30_000 } = {}) {
  const controller = new AbortController();
  let rejectCancellation;
  const cancelled = new Promise((_, reject) => { rejectCancellation = reject; });
  // Settle the caller as well as aborting transport: a stalled response body
  // must not leave the interface waiting for fetch to acknowledge cancellation.
  const abort = () => {
    rejectCancellation(new DOMException('Response stopped.', 'AbortError'));
    controller.abort();
  };
  const timer = setTimeout(() => {
    rejectCancellation(new Error('The request took too long. Please try again.'));
    controller.abort();
  }, timeout);
  signal?.addEventListener('abort', abort, { once: true });
  try {
    if (signal?.aborted) abort();
    const request = async () => {
      controller.signal.throwIfAborted();
      // Functions live at the origin root, even when VITE_BASE is a subpath.
      const response = await fetch(`/api/${path}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body), signal: controller.signal,
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data) throw new Error(data?.error || 'This service is unavailable. Please try again later.');
      return data;
    };
    return await Promise.race([cancelled, request()]);
  } catch (error) {
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
