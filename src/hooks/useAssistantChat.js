import { useEffect, useRef, useState } from 'react';
import { postPortfolio } from '../services/portfolioApi.js';

export function useAssistantChat() {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const transcript = useRef([]);
  const activeRequest = useRef(null);
  const retryRequest = useRef(null);
  const update = value => { transcript.current = value; setMessages(value); };
  useEffect(() => () => { activeRequest.current?.abort(); activeRequest.current = null; }, []);

  async function send(value, retry = false) {
    if (activeRequest.current) return;
    const prompt = value.trim();
    if (!prompt) return;
    if (prompt.length > 4000) { setError('Keep your question under 4,000 characters.'); return; }
    const history = retry ? retryRequest.current?.history : transcript.current;
    if (!history) return;
    if (!retry) { update([...history, { sender: 'user', text: prompt }]); setDraft(''); }
    retryRequest.current = { prompt, history };
    const controller = new AbortController();
    activeRequest.current = controller;
    setPending(true); setError('');
    try {
      const data = await postPortfolio('chat', { prompt, history: history.slice(-12) }, { signal: controller.signal });
      if (activeRequest.current !== controller) return;
      if (typeof data.text !== 'string' || !data.text.trim()) throw new Error('No answer was received. Please try again.');
      update([...transcript.current, { sender: 'ai', text: data.text }]);
      retryRequest.current = null;
    } catch (failure) {
      if (activeRequest.current === controller) setError(failure.message || 'Could not answer. Please try again.');
    } finally {
      if (activeRequest.current === controller) { activeRequest.current = null; setPending(false); }
    }
  }
  function stop() {
    if (!activeRequest.current) return;
    activeRequest.current.abort(); activeRequest.current = null;
    setPending(false); setError('Response stopped. You can try again.');
  }
  function clear() {
    activeRequest.current?.abort(); activeRequest.current = null; retryRequest.current = null;
    update([]); setDraft(''); setError(''); setPending(false);
  }
  return { messages, draft, setDraft, pending, error, send, stop, clear,
    retry: () => retryRequest.current && send(retryRequest.current.prompt, true),
    canRetry: Boolean(retryRequest.current) };
}
