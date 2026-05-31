/* ── Web Speech API Service ── */

export interface SpeechRecognitionResult {
  finalTranscript: string;
  interimTranscript: string;
}

let recognition: SpeechRecognition | null = null;

export function isSpeechSupported(): boolean {
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
}

export function startListening(
  onResult: (result: SpeechRecognitionResult) => void,
  onEnd: () => void,
  onError?: (error: string) => void,
): void {
  if (!isSpeechSupported()) {
    onError?.('Speech recognition not supported in this browser.');
    return;
  }

  // Stop any existing instance before creating a new one
  if (recognition) {
    recognition.onend = null;
    recognition.onresult = null;
    recognition.onerror = null;
    try { recognition.stop(); } catch { /* ignore */ }
    recognition = null;
  }

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  // Track ALL final transcripts across the session
  let accumulatedFinal = '';

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    let sessionFinal = '';
    let sessionInterim = '';

    // Process ALL results from the beginning
    for (let i = 0; i < event.results.length; i++) {
      const result = event.results[i];
      if (result.isFinal) {
        sessionFinal += result[0].transcript + ' ';
      } else {
        sessionInterim += result[0].transcript;
      }
    }

    accumulatedFinal = sessionFinal;

    onResult({
      finalTranscript: accumulatedFinal.trim(),
      interimTranscript: sessionInterim.trim(),
    });
  };

  recognition.onerror = (event) => {
    if (event.error === 'no-speech') return; // Ignore no-speech errors
    onError?.(event.error);
  };

  recognition.onend = () => {
    // Auto-restart if still supposed to be listening (Chrome stops after ~60s)
    if (recognition) {
      try {
        recognition.start();
      } catch {
        onEnd();
      }
    } else {
      onEnd();
    }
  };

  recognition.start();
}

export function stopListening(): void {
  const ref = recognition;
  recognition = null; // Set to null FIRST so onend doesn't restart
  if (ref) {
    ref.onend = null;
    ref.stop();
  }
}

/* ── Text-to-Speech (Enhanced) ── */

// Ranked voice preferences — best quality first
const VOICE_PREFERENCES = [
  'Google UK English Female',
  'Google UK English Male',
  'Google US English',
  'Microsoft Zira',
  'Microsoft David',
  'Microsoft Mark',
  'Samantha',           // macOS
  'Karen',              // macOS Australian
  'Daniel',             // macOS British
];

let cachedVoice: SpeechSynthesisVoice | null = null;
let voicesLoaded = false;

function getBestVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice && voicesLoaded) return cachedVoice;

  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  // Try each preferred voice in order
  for (const pref of VOICE_PREFERENCES) {
    const match = voices.find((v) => v.name === pref);
    if (match) { cachedVoice = match; voicesLoaded = true; return match; }
  }

  // Fallback: best English voice (prefer non-local for clarity)
  const englishVoices = voices.filter((v) => v.lang.startsWith('en'));

  // Prefer remote/cloud voices (usually higher quality)
  const remoteEnglish = englishVoices.find((v) => !v.localService);
  if (remoteEnglish) { cachedVoice = remoteEnglish; voicesLoaded = true; return remoteEnglish; }

  // Any English voice
  if (englishVoices.length) { cachedVoice = englishVoices[0]; voicesLoaded = true; return englishVoices[0]; }

  voicesLoaded = true;
  return null;
}

// Ensure voices are loaded (Chrome loads them async)
function ensureVoicesLoaded(): Promise<void> {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) { resolve(); return; }
    window.speechSynthesis.onvoiceschanged = () => resolve();
    // Timeout fallback
    setTimeout(resolve, 1000);
  });
}

// Split text into natural sentences for pacing
function splitIntoSentences(text: string): string[] {
  // Split on sentence boundaries but keep the delimiters
  const raw = text.match(/[^.!?]+[.!?]+\s*/g) || [text];
  return raw.map((s) => s.trim()).filter(Boolean);
}

// Chrome workaround: long utterances get paused/cut off after ~15s
// This keepalive pings the synthesis engine to prevent that
let keepAliveInterval: ReturnType<typeof setInterval> | null = null;

function startKeepAlive() {
  stopKeepAlive();
  keepAliveInterval = setInterval(() => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      window.speechSynthesis.resume();
    }
  }, 10000);
}

function stopKeepAlive() {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
    keepAliveInterval = null;
  }
}

let isSpeakingActive = false;

export async function speak(text: string, onEnd?: () => void): Promise<void> {
  if (!('speechSynthesis' in window)) { onEnd?.(); return; }

  window.speechSynthesis.cancel();
  stopKeepAlive();
  isSpeakingActive = true;

  await ensureVoicesLoaded();
  const voice = getBestVoice();

  const sentences = splitIntoSentences(text);
  let currentIndex = 0;

  startKeepAlive();

  const speakNext = () => {
    if (!isSpeakingActive || currentIndex >= sentences.length) {
      stopKeepAlive();
      isSpeakingActive = false;
      onEnd?.();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(sentences[currentIndex]);

    // Optimal settings for a clear, professional interviewer voice
    utterance.rate = 0.92;    // Slightly slower than normal for clarity
    utterance.pitch = 1.02;   // Very slight pitch lift for warmth
    utterance.volume = 1;

    if (voice) utterance.voice = voice;

    utterance.onend = () => {
      currentIndex++;
      // Natural pause between sentences (120ms)
      if (isSpeakingActive && currentIndex < sentences.length) {
        setTimeout(speakNext, 120);
      } else {
        stopKeepAlive();
        isSpeakingActive = false;
        onEnd?.();
      }
    };

    utterance.onerror = () => {
      currentIndex++;
      if (isSpeakingActive && currentIndex < sentences.length) {
        setTimeout(speakNext, 50);
      } else {
        stopKeepAlive();
        isSpeakingActive = false;
        onEnd?.();
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  speakNext();
}

export function stopSpeaking(): void {
  isSpeakingActive = false;
  stopKeepAlive();
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
