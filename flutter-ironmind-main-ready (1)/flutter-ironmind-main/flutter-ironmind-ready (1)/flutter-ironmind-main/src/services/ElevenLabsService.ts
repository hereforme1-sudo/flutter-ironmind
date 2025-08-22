export class ElevenLabsService {
  private apiKey: string = '';
  private baseUrl = 'https://api.elevenlabs.io/v1';

  // Romanian and English optimized voices
  private voices = {
    'ro-RO': {
      id: 'Xb7hH8MSUJpSbSDYk0k2', // Alice - good for Romanian
      name: 'Alice'
    },
    'en-US': {
      id: 'TX3LPaxmHKxFdv7VOQHJ', // Liam - professional English
      name: 'Liam'
    }
  };

  constructor() {
    // In a real app, get from environment or user input
    this.apiKey = process.env.ELEVENLABS_API_KEY || '';
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateSpeech(
    text: string, 
    language: 'ro-RO' | 'en-US' = 'en-US',
    options?: {
      stability?: number;
      similarity_boost?: number;
      style?: number;
    }
  ): Promise<ArrayBuffer | null> {
    if (!this.apiKey) {
      console.error('ElevenLabs API key not set');
      return null;
    }

    const voice = this.voices[language];
    const url = `${this.baseUrl}/text-to-speech/${voice.id}`;

    const requestBody = {
      text: text,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: options?.stability || 0.75,
        similarity_boost: options?.similarity_boost || 0.85,
        style: options?.style || 0.5,
        use_speaker_boost: true
      }
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.arrayBuffer();
    } catch (error) {
      console.error('Error generating speech:', error);
      return null;
    }
  }

  async playAudio(text: string, language: 'ro-RO' | 'en-US' = 'en-US'): Promise<void> {
    const audioBuffer = await this.generateSpeech(text, language);
    
    if (!audioBuffer) {
      // Fallback to browser TTS
      this.fallbackTTS(text, language);
      return;
    }

    try {
      const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      return new Promise((resolve, reject) => {
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          resolve();
        };
        audio.onerror = () => {
          URL.revokeObjectURL(audioUrl);
          reject(new Error('Audio playback failed'));
        };
        audio.play().catch(reject);
      });
    } catch (error) {
      console.error('Error playing audio:', error);
      this.fallbackTTS(text, language);
    }
  }

  private fallbackTTS(text: string, language: 'ro-RO' | 'en-US') {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  }

  getAvailableVoices() {
    return this.voices;
  }
}