import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.jarvis.assistant',
  appName: 'JARVIS AI Assistant',
  webDir: 'dist',
  bundledWebRuntime: false,
  
  server: {
    androidScheme: 'https',
    // For development with live reload (comment out for production)
    // url: 'http://192.168.1.100:5173',
    // cleartext: true
  },
  
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: "#0A0A0A",
      androidSplashResourceName: "splash",
      showSpinner: true,
      spinnerColor: "#00D4FF",
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "large"
    },
    
    Keyboard: {
      resize: "body",
      style: "dark",
      resizeOnFullScreen: true
    },
    
    StatusBar: {
      style: "dark",
      backgroundColor: "#0A0A0A",
      overlaysWebView: true
    },
    
    App: {
      launchUrl: undefined
    },
    
    Device: {},
    
    Haptics: {},
    
    Network: {}
  },
  
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
    minWebViewVersion: 60,
    flavor: "release",
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
      keystoreAliasPassword: undefined,
      keystorePassword: undefined,
      releaseType: "APK",
      signingType: "jarsigner"
    }
  },
  
  ios: {
    scheme: "JARVIS",
    contentInset: "automatic",
    backgroundColor: "#0A0A0A",
    allowsLinkPreview: false,
    handleApplicationNotifications: false,
    minVersion: "13.0"
  }
};

export default config;