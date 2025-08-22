# 📱 JARVIS Mobile Setup Guide

## Configurare pentru Codemagic.io

Acest ghid te ajută să convertești JARVIS web app într-o aplicație mobilă nativă folosind Codemagic.

## 🚀 Pași pentru Configurare

### 1. Pregătire Repository

```bash
# Clonează proiectul
git clone [repository-url]
cd jarvis-ai-assistant

# Asigură-te că ai toate fișierele necesare
ls -la
# Verifică: codemagic.yaml, capacitor.config.ts, package.json
```

### 2. Configurare Codemagic

1. **Conectare Repository**
   - Mergi pe [codemagic.io](https://codemagic.io)
   - Conectează repository-ul GitHub/GitLab
   - Selectează proiectul JARVIS

2. **Setare Environment Variables**
   ```
   ELEVENLABS_API_KEY = sk-your-elevenlabs-key-here
   ```

3. **Configurare Signing (Android)**
   - Upload keystore pentru semnarea APK
   - Setează alias și parole în Codemagic UI

4. **Configurare Signing (iOS)**
   - Upload certificat și provisioning profile
   - Configurare App Store Connect (dacă dorești)

### 3. Build Commands

Codemagic va rula automat:

```yaml
# Build sequence
npm ci                    # Install dependencies
npm run build            # Build React app
npx cap add android      # Add Android platform  
npx cap add ios          # Add iOS platform
npx cap sync            # Sync web assets
./gradlew assembleRelease # Build Android APK
```

## 📋 Fișiere Obligatorii

### `codemagic.yaml`
✅ Deja inclus - configurează build workflow-ul complet

### `capacitor.config.ts` 
✅ Deja inclus - configurează app-ul pentru mobile

### `package.json` dependencies
Verifică că ai aceste dependințe (vor fi adăugate automat):
```json
{
  "@capacitor/core": "^5.0.0",
  "@capacitor/cli": "^5.0.0", 
  "@capacitor/android": "^5.0.0",
  "@capacitor/ios": "^5.0.0"
}
```

## 🔑 Permisiuni Necesare

### Android (`AndroidManifest.xml`)
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

### iOS (`Info.plist`) 
```xml
<key>NSMicrophoneUsageDescription</key>
<string>JARVIS needs microphone access for voice commands</string>
<key>NSSpeechRecognitionUsageDescription</key> 
<string>JARVIS uses speech recognition for voice commands</string>
```

## ⚙️ Optimizări Mobile

### Performance
- Bundle size optimization
- Lazy loading pentru componente
- Service worker pentru caching
- WebView optimization pentru Capacitor

### UX Mobile
- Touch-friendly controls
- Responsive breakpoints
- Haptic feedback support
- Status bar customization

### Voice Recognition
- Optimizat pentru microfon mobil
- Noise cancellation îmbunătățit  
- Battery usage optimization
- Background processing limits

## 🔧 Build Local (Opțional)

Pentru testare locală:

```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios

# Build web app
npm run build

# Initialize Capacitor 
npx cap init

# Add platforms
npx cap add android
npx cap add ios

# Sync assets
npx cap sync

# Open in native IDE
npx cap open android    # Android Studio
npx cap open ios        # Xcode (doar macOS)
```

## 📱 Testare pe Dispozitiv

### Android Testing
1. Enable Developer Options
2. Enable USB Debugging  
3. Connect device via USB
4. Run în Android Studio sau `npx cap run android`

### iOS Testing (necesită macOS)
1. Add device în Apple Developer Console
2. Update provisioning profile
3. Connect device via USB
4. Run în Xcode sau `npx cap run ios`

## 🚀 Deploy Production

### Google Play Store
1. Build signed APK/AAB prin Codemagic
2. Upload în Play Console
3. Complete store listing
4. Submit for review

### Apple App Store
1. Build signed IPA prin Codemagic  
2. Upload via App Store Connect
3. Complete app information
4. Submit for review

## 🐛 Troubleshooting

### Build Errors
```bash
# Clear cache
npm clean-install
npx cap clean

# Rebuild
npm run build
npx cap sync
```

### Permission Errors
- Verifică că utilizatorii acceptă permisiunile microfonului
- Testează pe device real (nu emulator pentru voice)
- iOS necesită HTTPS pentru speech recognition

### Performance Issues
- Optimizează bundle size cu `npm run build -- --analyze`
- Enable hardware acceleration în WebView
- Reduce memory usage în JS

## 📚 Resurse Utile

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Codemagic Documentation](https://docs.codemagic.io)
- [Android Developer Guide](https://developer.android.com)
- [iOS Developer Guide](https://developer.apple.com)

## 💡 Tips pentru Success

1. **Testează pe dispozitive reale** - emulatorii nu suportă complet voice recognition
2. **Optimizează pentru battery** - voice recognition consumă energie
3. **Respectă guidelines** - Google Play și App Store au reguli stricte
4. **User permissions** - explică clar de ce ai nevoie de microfon
5. **Fallback options** - oferă alternative dacă voice recognition nu e disponibil

---

**Ready pentru Codemagic!** 🎉 

Doar commitează modificările și Codemagic va face automat build-ul pentru Android și iOS.