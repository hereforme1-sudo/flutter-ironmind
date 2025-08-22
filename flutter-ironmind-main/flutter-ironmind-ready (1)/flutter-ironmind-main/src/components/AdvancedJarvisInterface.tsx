import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArcReactor } from "./ArcReactor";
import { VoiceVisualizer } from "./VoiceVisualizer";
import { HolographicPanel } from "./HolographicPanel";
import { SpeechRecognitionService } from "@/services/SpeechRecognitionService";
import { AIService, AIResponse } from "@/services/AIService";
import { SearchResult } from "@/services/WebSearchService";
import { Mic, MicOff, Send, Power, Settings, Globe, Search, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  type: 'user' | 'jarvis';
  timestamp: Date;
  language?: 'ro-RO' | 'en-US';
  searchResults?: SearchResult[];
}

export function AdvancedJarvisInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Bună seara. Sunt JARVIS, asistentul tău personal avansat. Pot să recunosc comanda vocală în română și engleză, să caut pe web, să deschid aplicații și să îți răspund cu voce naturală. Cu ce te pot ajuta?',
      type: 'jarvis',
      timestamp: new Date(),
      language: 'ro-RO'
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState<'ro-RO' | 'en-US'>('ro-RO');
  const [elevenLabsKey, setElevenLabsKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechService = useRef<SpeechRecognitionService>(new SpeechRecognitionService());
  const aiService = useRef<AIService>(new AIService());
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    aiService.current.setLanguage(currentLanguage);
    speechService.current.setLanguage(currentLanguage);
  }, [currentLanguage]);

  useEffect(() => {
    if (elevenLabsKey) {
      aiService.current.setElevenLabsKey(elevenLabsKey);
    }
  }, [elevenLabsKey]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      type: 'user',
      timestamp: new Date(),
      language: currentLanguage
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setCurrentTranscript('');

    if (!isOnline) return;

    try {
      setIsSpeaking(true);
      const response: AIResponse = await aiService.current.processCommand(content);
      
      const jarvisMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.text,
        type: 'jarvis',
        timestamp: new Date(),
        language: response.language || currentLanguage,
        searchResults: response.data
      };

      setMessages(prev => [...prev, jarvisMessage]);

      // Speak response if requested
      if (response.shouldSpeak) {
        await aiService.current.speak(response.text, response.language);
      }

    } catch (error) {
      console.error('Error processing command:', error);
      toast({
        title: "Error",
        description: "A apărut o eroare la procesarea comenzii",
        variant: "destructive"
      });
    } finally {
      setIsSpeaking(false);
    }
  };

  const toggleListening = () => {
    if (!isOnline) return;

    if (isListening) {
      speechService.current.stopListening();
      setIsListening(false);
      setCurrentTranscript('');
    } else {
      if (!speechService.current.isSupported()) {
        toast({
          title: "Error",
          description: "Speech recognition not supported in this browser",
          variant: "destructive"
        });
        return;
      }

      const success = speechService.current.startListening(
        (transcript, isFinal) => {
          setCurrentTranscript(transcript);
          if (isFinal && transcript.trim()) {
            handleSendMessage(transcript);
            setCurrentTranscript('');
            setIsListening(false);
          }
        },
        (error) => {
          console.error('Speech recognition error:', error);
          setIsListening(false);
          setCurrentTranscript('');
          toast({
            title: "Speech Error",
            description: error,
            variant: "destructive"
          });
        },
        () => {
          setIsListening(true);
        },
        () => {
          setIsListening(false);
          setCurrentTranscript('');
        }
      );

      if (!success) {
        toast({
          title: "Error",
          description: "Failed to start voice recognition",
          variant: "destructive"
        });
      }
    }
  };

  const togglePower = () => {
    setIsOnline(!isOnline);
    if (isListening) {
      speechService.current.stopListening();
      setIsListening(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-accent/10 rounded-full blur-2xl" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <ArcReactor size="lg" isActive={isOnline} />
            <div>
              <h1 className="text-4xl font-bold text-glow">JARVIS</h1>
              <p className="text-muted-foreground">Just A Rather Very Intelligent System</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  {currentLanguage === 'ro-RO' ? 'Română' : 'English'}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {isOnline ? 'Online' : 'Offline'}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
              className="border-primary/30 hover:border-primary"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={togglePower}
              className={cn(
                "border-primary/30 hover:border-primary",
                isOnline ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Power className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Panel */}
          {showSettings && (
            <div className="lg:col-span-1">
              <HolographicPanel className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Configurare</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Limbă / Language</label>
                    <Select value={currentLanguage} onValueChange={(value: 'ro-RO' | 'en-US') => setCurrentLanguage(value)}>
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ro-RO">🇷🇴 Română</SelectItem>
                        <SelectItem value="en-US">🇺🇸 English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">ElevenLabs API Key</label>
                    <Input
                      type="password"
                      value={elevenLabsKey}
                      onChange={(e) => setElevenLabsKey(e.target.value)}
                      placeholder="sk-..."
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Pentru voce naturală de înaltă calitate
                    </p>
                  </div>
                </div>
              </HolographicPanel>
            </div>
          )}

          {/* Chat Interface */}
          <div className={showSettings ? "lg:col-span-2" : "lg:col-span-3"}>
            <HolographicPanel className="h-[600px] flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex flex-col",
                      message.type === 'user' ? "items-end" : "items-start"
                    )}
                  >
                    <Card className={cn(
                      "max-w-[85%] p-4",
                      message.type === 'user' 
                        ? "bg-primary/10 border-primary/30" 
                        : "bg-secondary/50 border-secondary"
                    )}>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      
                      {/* Search Results */}
                      {message.searchResults && message.searchResults.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Search className="h-3 w-3" />
                            Rezultate căutare
                          </div>
                          {message.searchResults.slice(0, 3).map((result, idx) => (
                            <Card key={idx} className="p-2 bg-background/50">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-xs font-medium truncate">{result.title}</h4>
                                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                    {result.snippet}
                                  </p>
                                  <Badge variant="outline" className="text-xs mt-1">
                                    {result.source}
                                  </Badge>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 shrink-0"
                                  onClick={() => window.open(result.url, '_blank')}
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              </div>
                            </Card>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                        {message.language && (
                          <Badge variant="outline" className="text-xs">
                            {message.language === 'ro-RO' ? 'RO' : 'EN'}
                          </Badge>
                        )}
                      </div>
                    </Card>
                  </div>
                ))}
                
                {/* Current transcript preview */}
                {currentTranscript && (
                  <div className="flex justify-end">
                    <Card className="max-w-[85%] p-4 bg-primary/5 border-primary/20 border-dashed">
                      <p className="text-sm text-muted-foreground italic">{currentTranscript}</p>
                      <span className="text-xs text-muted-foreground">Ascultare...</span>
                    </Card>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Voice Visualizer */}
              {(isListening || isSpeaking) && (
                <VoiceVisualizer 
                  isListening={isListening} 
                  isSpeaking={isSpeaking}
                  className="mb-4" 
                />
              )}

              {/* Input */}
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(input)}
                  placeholder={currentLanguage === 'ro-RO' 
                    ? "Vorbește sau scrie comanda ta..." 
                    : "Speak or type your command..."
                  }
                  disabled={!isOnline}
                  className="flex-1 bg-background/50 border-primary/20 focus:border-primary"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleListening}
                  disabled={!isOnline}
                  className={cn(
                    "border-primary/30",
                    isListening && "bg-primary/20 border-primary text-primary"
                  )}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Button
                  onClick={() => handleSendMessage(input)}
                  disabled={!isOnline || (!input.trim() && !currentTranscript)}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </HolographicPanel>
          </div>

          {/* Status Panel */}
          <div className="lg:col-span-1 space-y-6">
            <HolographicPanel variant="glow">
              <h3 className="text-lg font-semibold mb-4">Stare Sistem</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Energie</span>
                  <span className="text-success">98%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Rețea</span>
                  <span className="text-success">Conectat</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">AI Motor</span>
                  <span className={isOnline ? "text-success" : "text-warning"}>
                    {isOnline ? "Online" : "Offline"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Recunoaștere Vocală</span>
                  <span className={isListening ? "text-success" : "text-muted-foreground"}>
                    {isListening ? "Ascult" : "Standby"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Text-to-Speech</span>
                  <span className={elevenLabsKey ? "text-success" : "text-warning"}>
                    {elevenLabsKey ? "ElevenLabs" : "Browser"}
                  </span>
                </div>
              </div>
            </HolographicPanel>

            <HolographicPanel variant="minimal">
              <h3 className="text-lg font-semibold mb-4">Acțiuni Rapide</h3>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  disabled={!isOnline}
                  onClick={() => handleSendMessage("system status")}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Diagnostic Sistem
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  disabled={!isOnline}
                  onClick={() => handleSendMessage("what time is it")}
                >
                  Ora Curentă
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  disabled={!isOnline}
                  onClick={() => handleSendMessage("search latest news")}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Căutare Web
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  disabled={!isOnline}
                  onClick={() => handleSendMessage("open youtube")}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Deschide Aplicații
                </Button>
              </div>
            </HolographicPanel>
          </div>
        </div>
      </div>
    </div>
  );
}