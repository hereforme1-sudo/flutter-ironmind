# JARVIS - AI Assistant Web App

## 🤖 Descriere

JARVIS este un asistent AI avansat inspirat de tehnologia din Iron Man, construit cu React/TypeScript și optimizat pentru conversie în aplicație mobilă prin Codemagic.io.

## ✨ Funcționalități Principale

### 🎙️ Recunoaștere Vocală Avansată
- Support pentru română (ro-RO) și engleză (en-US)
- Recunoaștere în timp real cu Web Speech API
- Transcript live și procesare comenzi vocale

### 🔊 Text-to-Speech Premium
- Integrare ElevenLabs pentru voce naturală de înaltă calitate
- Fallback la browser TTS
- Voci optimizate pentru română și engleză

### 🔍 Căutare Web în Timp Real
- Integrare DuckDuckGo pentru rezultate web
- Căutare Wikipedia în română și engleză
- Afișare rezultate integrate în chat

### 🌐 Control Aplicații Web
- Deschidere automată aplicații: YouTube, Gmail, Facebook, WhatsApp Web, Spotify, Netflix
- Navigare intelligentă bazată pe comenzi vocale
- Support pentru URL-uri personalizate

### 🎨 Interfață Futuristă
- Design inspirat Iron Man cu efecte holografice
- Arc Reactor animat și efecte de glow
- Vizualizator vocal în timp real
- Panouri transparente cu efecte de scanning

## 🛠️ Tehnologii Utilizate

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **UI Components**: Shadcn/ui cu tematică personalizată
- **Speech**: Web Speech API, ElevenLabs TTS
- **Search**: DuckDuckGo API, Wikipedia API
- **Animations**: CSS custom animations, Tailwind keyframes

## 📱 Conversie la Aplicație Mobilă

Acest proiect este optimizat pentru conversie cu **Codemagic.io**:

### Configurare Codemagic
1. Conectează repository-ul la Codemagic
2. Configurează build pentru Android/iOS
3. Setează variabilele de mediu necesare
4. Build și deploy automat

### Variabile de Mediu Necesare
```
ELEVENLABS_API_KEY=sk-your-elevenlabs-api-key
```

### Build Commands pentru Codemagic
```yaml
# codemagic.yaml
workflows:
  react-app:
    name: React Web App to Mobile
    environment:
      vars:
        ELEVENLABS_API_KEY: $ELEVENLABS_API_KEY
    scripts:
      - npm install
      - npm run build
    artifacts:
      - build/**
```

## 🚀 Instalare și Rulare Locală

### Cerințe
- Node.js 18+
- npm sau yarn

### Pași Instalare
```bash
# Clonează repository
git clone [your-repo-url]
cd jarvis-ai-assistant

# Instalează dependențele
npm install

# Pornește development server
npm run dev
```

### Configurare API Keys
1. Obține o cheie ElevenLabs de pe [elevenlabs.io](https://elevenlabs.io)
2. Adaugă cheia în panoul de setări din aplicație
3. Sau setează variabila de mediu `ELEVENLABS_API_KEY`

## 📋 Comenzi Suportate

### Limbă Română
- **Salutări**: "Salut JARVIS", "Bună seara"
- **Timp**: "Ce oră este?", "Spune-mi timpul"
- **Căutare**: "Caută informații despre...", "Ce este..."
- **Aplicații**: "Deschide YouTube", "Pornește Gmail"
- **Sistem**: "Stare sistem", "Diagnostic"

### English Language
- **Greetings**: "Hello JARVIS", "Good evening"
- **Time**: "What time is it?", "Tell me the time"
- **Search**: "Search for...", "Find information about..."
- **Apps**: "Open YouTube", "Launch Gmail"
- **System**: "System status", "Diagnostics"

### Schimbare Limbă
- "Switch to English" / "Schimbă în română"
- Selector din panoul de setări

## 🎯 Funcționalități Avansate

### AI Inteligent
- Detectare automată a limbii
- Răspunsuri contextuale
- Procesare comenzi complexe
- Învățare din interacțiuni

### Căutare Multi-Sursă
- DuckDuckGo pentru rezultate generale
- Wikipedia pentru informații enciclopedice
- Agregare și deduplicare rezultate

### Control Aplicații
- Deschidere automată în tab nou
- Support pentru aplicații web populare
- Extensibil pentru aplicații custom

## 📱 Optimizări Mobile

### Responsive Design
- Layout adaptat pentru mobile
- Touch-friendly controls
- Gesturi intuitive

### Performance
- Lazy loading componente
- Optimizare bundle size
- Caching intelligent

### PWA Features
- Service worker pentru offline
- App manifest pentru instalare
- Native app feel

## 🔧 Customizare

### Adaugă Noi Comenzi
```typescript
// În AIService.ts
private handleCustomCommand(input: string): AIResponse {
  // Logica pentru comanda personalizată
}
```

### Adaugă Noi Aplicații
```typescript
// În AIService.ts - handleWebAppControl
if (lowerCommand.includes('new-app')) {
  url = 'https://new-app.com';
  appName = 'New App';
}
```

### Customize Voice Settings
```typescript
// În ElevenLabsService.ts
const requestBody = {
  voice_settings: {
    stability: 0.75,      // Stabilitate voce
    similarity_boost: 0.85, // Boost similaritate
    style: 0.5            // Stil vorbire
  }
}
```

## 🐛 Depanare

### Probleme Comune

**Recunoașterea vocală nu funcționează**
- Verifică permisiunile microfonului
- Asigură-te că browserul suportă Web Speech API
- Testează în Chrome/Edge (support complet)

**TTS nu funcționează**
- Verifică cheia ElevenLabs
- Testează conexiunea internet
- Fallback-ul browser ar trebui să funcționeze

**Căutarea returnează erori**
- Verifică conexiunea internet
- API-urile externe pot avea rate limiting
- Încearcă din nou după câteva secunde

### Console Debugging
```bash
# Pornește cu debug logging
REACT_APP_DEBUG=true npm run dev
```

## 📞 Support

Pentru probleme și întrebări:
- Verifică documentația
- Caută în issues existente
- Creează un issue nou cu detalii

## 🔮 Roadmap Viitor

### V2.0 - Integrări Avansate
- [ ] Integrare ChatGPT/Claude pentru răspunsuri mai inteligente
- [ ] Support pentru WhatsApp Business API
- [ ] Integrare calendar și email
- [ ] Automatizare task-uri complexe

### V2.1 - Mobile Native
- [ ] Aplicație React Native
- [ ] Acces la contacte și SMS
- [ ] Notificări push
- [ ] Sincronizare cross-device

### V2.2 - AI Avansat
- [ ] Învățare personalizată
- [ ] Context awareness
- [ ] Predicții și sugestii
- [ ] Integrare IoT devices

## 📄 Licență

MIT License - Vezi fișierul LICENSE pentru detalii.

## 👨‍💻 Dezvoltator

Dezvoltat cu ❤️ pentru conversie Codemagic.io
Inspirat de tehnologia JARVIS din Iron Man

---

**Notă**: Acest proiect demonstrează capabilitățile avansate ale unui asistent AI web, optimizat pentru conversie în aplicație mobilă prin Codemagic. Pentru funcționalități complete de control sistem și acces la date sensibile, recomandăm dezvoltarea unei aplicații native dedicate.