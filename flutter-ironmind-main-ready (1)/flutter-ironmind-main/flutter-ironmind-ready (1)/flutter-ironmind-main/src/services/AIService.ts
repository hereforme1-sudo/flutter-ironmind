import { WebSearchService, SearchResult } from './WebSearchService';
import { ElevenLabsService } from './ElevenLabsService';

export interface AIResponse {
  text: string;
  action?: string;
  data?: any;
  shouldSpeak?: boolean;
  language?: 'ro-RO' | 'en-US';
}

export class AIService {
  private webSearch: WebSearchService;
  private tts: ElevenLabsService;
  private currentLanguage: 'ro-RO' | 'en-US' = 'ro-RO';

  constructor() {
    this.webSearch = new WebSearchService();
    this.tts = new ElevenLabsService();
  }

  setLanguage(language: 'ro-RO' | 'en-US') {
    this.currentLanguage = language;
  }

  setElevenLabsKey(apiKey: string) {
    this.tts.setApiKey(apiKey);
  }

  private detectLanguage(text: string): 'ro-RO' | 'en-US' {
    // Simple Romanian detection based on common words
    const romanianWords = ['și', 'cu', 'de', 'la', 'în', 'pe', 'pentru', 'este', 'sunt', 'ai', 'vreau', 'să', 'ce', 'cum', 'când', 'unde'];
    const words = text.toLowerCase().split(' ');
    const romanianCount = words.filter(word => romanianWords.includes(word)).length;
    
    return romanianCount > 0 ? 'ro-RO' : 'en-US';
  }

  private getGreeting(language: 'ro-RO' | 'en-US'): string {
    const greetings = {
      'ro-RO': [
        'Bună seara. Sunt JARVIS, asistentul tău personal. Cu ce te pot ajuta?',
        'Salut! JARVIS aici. Ce dorești să facem astăzi?',
        'Bună ziua! Sunt gata să îți execut comenzile.'
      ],
      'en-US': [
        'Good evening. I am JARVIS, your personal assistant. How may I assist you today?',
        'Hello! JARVIS at your service. What would you like to do?',
        'Good day! Ready to execute your commands.'
      ]
    };
    
    const options = greetings[language];
    return options[Math.floor(Math.random() * options.length)];
  }

  async processCommand(input: string): Promise<AIResponse> {
    const detectedLang = this.detectLanguage(input);
    const lowerInput = input.toLowerCase().trim();

    // Language switching
    if (lowerInput.includes('english') || lowerInput.includes('switch to english')) {
      this.currentLanguage = 'en-US';
      return {
        text: 'Language switched to English. How may I assist you?',
        language: 'en-US',
        shouldSpeak: true
      };
    }

    if (lowerInput.includes('română') || lowerInput.includes('romanian') || lowerInput.includes('schimbă în română')) {
      this.currentLanguage = 'ro-RO';
      return {
        text: 'Limba schimbată în română. Cu ce te pot ajuta?',
        language: 'ro-RO',
        shouldSpeak: true
      };
    }

    // Greetings
    if (this.isGreeting(lowerInput)) {
      return {
        text: this.getGreeting(detectedLang),
        language: detectedLang,
        shouldSpeak: true
      };
    }

    // Time queries
    if (this.isTimeQuery(lowerInput)) {
      return this.getTimeResponse(detectedLang);
    }

    // Weather queries  
    if (this.isWeatherQuery(lowerInput)) {
      return this.getWeatherResponse(detectedLang);
    }

    // Search queries
    if (this.isSearchQuery(lowerInput)) {
      return await this.performSearch(input, detectedLang);
    }

    // Web app controls
    if (this.isWebAppControl(lowerInput)) {
      return this.handleWebAppControl(lowerInput, detectedLang);
    }

    // System status
    if (this.isSystemQuery(lowerInput)) {
      return this.getSystemStatus(detectedLang);
    }

    // Default intelligent response
    return this.getIntelligentResponse(input, detectedLang);
  }

  private isGreeting(input: string): boolean {
    const greetingPatterns = [
      'hello', 'hi', 'hey', 'jarvis',
      'bună', 'salut', 'hey', 'hei'
    ];
    return greetingPatterns.some(pattern => input.includes(pattern));
  }

  private isTimeQuery(input: string): boolean {
    const timePatterns = [
      'time', 'clock', 'hour',
      'timp', 'ora', 'ceas', 'ce oră'
    ];
    return timePatterns.some(pattern => input.includes(pattern));
  }

  private isWeatherQuery(input: string): boolean {
    const weatherPatterns = [
      'weather', 'temperature', 'rain', 'sunny',
      'vreme', 'temperatură', 'ploaie', 'soare', 'meteo'
    ];
    return weatherPatterns.some(pattern => input.includes(pattern));
  }

  private isSearchQuery(input: string): boolean {
    const searchPatterns = [
      'search', 'find', 'look up', 'google',
      'caută', 'găsește', 'informații despre', 'ce este'
    ];
    return searchPatterns.some(pattern => input.includes(pattern));
  }

  private isWebAppControl(input: string): boolean {
    const controlPatterns = [
      'open', 'launch', 'start', 'go to',
      'deschide', 'pornește', 'navighează', 'mergi la'
    ];
    return controlPatterns.some(pattern => input.includes(pattern));
  }

  private isSystemQuery(input: string): boolean {
    const systemPatterns = [
      'status', 'system', 'diagnostics', 'health',
      'stare', 'sistem', 'diagnostic', 'sănătate'
    ];
    return systemPatterns.some(pattern => input.includes(pattern));
  }

  private getTimeResponse(language: 'ro-RO' | 'en-US'): AIResponse {
    const now = new Date();
    const time = now.toLocaleTimeString();
    const date = now.toLocaleDateString();

    const responses = {
      'ro-RO': `Ora actuală este ${time}, iar data de astăzi este ${date}.`,
      'en-US': `The current time is ${time}, and today's date is ${date}.`
    };

    return {
      text: responses[language],
      language,
      shouldSpeak: true
    };
  }

  private getWeatherResponse(language: 'ro-RO' | 'en-US'): AIResponse {
    const responses = {
      'ro-RO': 'Pentru informații meteo în timp real, aș avea nevoie de acces la un serviciu meteorologic. Te rog conectează-mă la un API meteo pentru date actuale.',
      'en-US': 'To provide real-time weather information, I would need access to a weather service. Please connect me to a weather API for current data.'
    };

    return {
      text: responses[language],
      language,
      shouldSpeak: true
    };
  }

  private async performSearch(query: string, language: 'ro-RO' | 'en-US'): Promise<AIResponse> {
    const searchLang = language === 'ro-RO' ? 'ro' : 'en';
    
    try {
      const results = await this.webSearch.comprehensiveSearch(query, searchLang);
      
      if (results.length === 0) {
        const noResultsText = {
          'ro-RO': 'Nu am găsit rezultate pentru căutarea ta.',
          'en-US': 'I could not find any results for your search.'
        };
        
        return {
          text: noResultsText[language],
          language,
          shouldSpeak: true
        };
      }

      const searchSummary = this.formatSearchResults(results, language);
      
      return {
        text: searchSummary,
        action: 'search',
        data: results,
        language,
        shouldSpeak: true
      };
    } catch (error) {
      const errorText = {
        'ro-RO': 'A apărut o eroare la căutare. Te rog încearcă din nou.',
        'en-US': 'An error occurred while searching. Please try again.'
      };
      
      return {
        text: errorText[language],
        language,
        shouldSpeak: true
      };
    }
  }

  private formatSearchResults(results: SearchResult[], language: 'ro-RO' | 'en-US'): string {
    if (results.length === 0) return '';

    const intro = {
      'ro-RO': 'Am găsit următoarele informații:',
      'en-US': 'I found the following information:'
    };

    const topResult = results[0];
    const summary = `${intro[language]} ${topResult.snippet}`;
    
    return summary.length > 200 ? summary.substring(0, 200) + '...' : summary;
  }

  private handleWebAppControl(command: string, language: 'ro-RO' | 'en-US'): AIResponse {
    const lowerCommand = command.toLowerCase();
    let url = '';
    let appName = '';

    // Detect app/website to open
    if (lowerCommand.includes('youtube')) {
      url = 'https://youtube.com';
      appName = 'YouTube';
    } else if (lowerCommand.includes('google')) {
      url = 'https://google.com';
      appName = 'Google';
    } else if (lowerCommand.includes('gmail')) {
      url = 'https://gmail.com';
      appName = 'Gmail';
    } else if (lowerCommand.includes('facebook')) {
      url = 'https://facebook.com';
      appName = 'Facebook';
    } else if (lowerCommand.includes('whatsapp')) {
      url = 'https://web.whatsapp.com';
      appName = 'WhatsApp Web';
    } else if (lowerCommand.includes('spotify')) {
      url = 'https://open.spotify.com';
      appName = 'Spotify';
    } else if (lowerCommand.includes('netflix')) {
      url = 'https://netflix.com';
      appName = 'Netflix';
    }

    if (url) {
      // Open in new tab
      window.open(url, '_blank');
      
      const responses = {
        'ro-RO': `Am deschis ${appName} într-o fereastră nouă.`,
        'en-US': `I've opened ${appName} in a new window.`
      };

      return {
        text: responses[language],
        action: 'open_app',
        data: { url, appName },
        language,
        shouldSpeak: true
      };
    }

    const responses = {
      'ro-RO': 'Nu am recunoscut aplicația pe care vrei să o deschid. Încearcă să specifici: YouTube, Gmail, Facebook, WhatsApp, Spotify sau Netflix.',
      'en-US': 'I did not recognize the application you want to open. Try specifying: YouTube, Gmail, Facebook, WhatsApp, Spotify, or Netflix.'
    };

    return {
      text: responses[language],
      language,
      shouldSpeak: true
    };
  }

  private getSystemStatus(language: 'ro-RO' | 'en-US'): AIResponse {
    const responses = {
      'ro-RO': 'Toate sistemele funcționează normal. Nivelul de energie este optim. Recunoașterea vocală este activă. Sunt gata să îți execut comenzile.',
      'en-US': 'All systems operational. Power levels optimal. Voice recognition is active. Ready to execute your commands.'
    };

    return {
      text: responses[language],
      language,
      shouldSpeak: true
    };
  }

  private getIntelligentResponse(input: string, language: 'ro-RO' | 'en-US'): AIResponse {
    // Intelligent responses based on input analysis
    const responses = {
      'ro-RO': [
        'Înțeleg cererea ta. Pentru o funcționalitate completă, ar fi utilă conectarea la servicii suplimentare și API-uri.',
        'Am procesat comanda ta. Pentru răspunsuri mai detaliate, poți să îmi oferi mai mult context.',
        'Cererea ta a fost înregistrată. Cum pot să te ajut mai departe?'
      ],
      'en-US': [
        'I understand your request. For full functionality, connecting to additional services and APIs would be helpful.',
        'I have processed your command. For more detailed responses, you can provide me with more context.',
        'Your request has been registered. How can I assist you further?'
      ]
    };

    const options = responses[language];
    const randomResponse = options[Math.floor(Math.random() * options.length)];

    return {
      text: randomResponse,
      language,
      shouldSpeak: true
    };
  }

  async speak(text: string, language?: 'ro-RO' | 'en-US'): Promise<void> {
    const lang = language || this.currentLanguage;
    try {
      await this.tts.playAudio(text, lang);
    } catch (error) {
      console.error('Speech synthesis error:', error);
    }
  }
}