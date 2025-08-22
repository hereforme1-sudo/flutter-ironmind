import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArcReactor } from "./ArcReactor";
import { VoiceVisualizer } from "./VoiceVisualizer";
import { HolographicPanel } from "./HolographicPanel";
import { Mic, MicOff, Send, Power } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  type: 'user' | 'jarvis';
  timestamp: Date;
}

export function JarvisInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Good evening. I am JARVIS, your personal assistant. How may I assist you today?',
      type: 'jarvis',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      type: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate Jarvis response
    setTimeout(() => {
      const jarvisResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getJarvisResponse(content),
        type: 'jarvis',
        timestamp: new Date()
      };
      
      setIsSpeaking(true);
      setMessages(prev => [...prev, jarvisResponse]);
      
      // Simulate speech duration
      setTimeout(() => setIsSpeaking(false), 2000);
    }, 1000);
  };

  const getJarvisResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
      return "Hello there. I'm at your service.";
    }
    
    if (lowerInput.includes('weather')) {
      return "I would need access to weather services to provide current conditions. Please connect me to a weather API for real-time data.";
    }
    
    if (lowerInput.includes('time')) {
      return `The current time is ${new Date().toLocaleTimeString()}.`;
    }
    
    if (lowerInput.includes('status') || lowerInput.includes('systems')) {
      return "All systems operational. Power levels optimal. Ready to assist.";
    }
    
    return "I understand your request. However, I would need additional integrations and API connections to provide more specific assistance. Please configure my services through the settings panel.";
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // In a real implementation, this would start/stop speech recognition
  };

  const togglePower = () => {
    setIsOnline(!isOnline);
  };

  return (
    <div className="min-h-screen bg-background p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <ArcReactor size="lg" isActive={isOnline} />
            <div>
              <h1 className="text-4xl font-bold text-glow">JARVIS</h1>
              <p className="text-muted-foreground">Just A Rather Very Intelligent System</p>
            </div>
          </div>
          
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <HolographicPanel className="h-[600px] flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.type === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    <Card className={cn(
                      "max-w-[80%] p-3",
                      message.type === 'user' 
                        ? "bg-primary/10 border-primary/30" 
                        : "bg-secondary border-secondary"
                    )}>
                      <p className="text-sm">{message.content}</p>
                      <span className="text-xs text-muted-foreground mt-2 block">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </Card>
                  </div>
                ))}
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
                  placeholder="Speak or type your command..."
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
                    isListening && "bg-primary/20 border-primary"
                  )}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Button
                  onClick={() => handleSendMessage(input)}
                  disabled={!isOnline || !input.trim()}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </HolographicPanel>
          </div>

          {/* Status Panel */}
          <div className="space-y-6">
            <HolographicPanel variant="glow">
              <h3 className="text-lg font-semibold mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Power Level</span>
                  <span className="text-success">98%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Network</span>
                  <span className="text-success">Connected</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">AI Engine</span>
                  <span className={isOnline ? "text-success" : "text-warning"}>
                    {isOnline ? "Online" : "Offline"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Voice Recognition</span>
                  <span className={isListening ? "text-success" : "text-muted-foreground"}>
                    {isListening ? "Listening" : "Standby"}
                  </span>
                </div>
              </div>
            </HolographicPanel>

            <HolographicPanel variant="minimal">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" disabled={!isOnline}>
                  System Diagnostics
                </Button>
                <Button variant="outline" className="w-full justify-start" disabled={!isOnline}>
                  Weather Report
                </Button>
                <Button variant="outline" className="w-full justify-start" disabled={!isOnline}>
                  Calendar Events
                </Button>
                <Button variant="outline" className="w-full justify-start" disabled={!isOnline}>
                  Device Controls
                </Button>
              </div>
            </HolographicPanel>
          </div>
        </div>
      </div>
    </div>
  );
}