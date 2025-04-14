
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Mic, MicOff, Send, RotateCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useDevices } from '@/store/DeviceStore';

const VoiceInput: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const { toast } = useToast();
  const { addCommand } = useDevices();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        // In a real app, here you would send the audio to your backend for processing
        setIsRecording(false);
        simulateProcessingResponse();
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      toast({
        title: "Aufnahme gestartet",
        description: "Bitte sprechen Sie jetzt",
      });
    } catch (err) {
      console.error('Error accessing microphone:', err);
      toast({
        title: "Fehler",
        description: "Mikrofon konnte nicht aktiviert werden",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      // Stop all audio tracks to release the microphone
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextInput(e.target.value);
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim() === '') return;
    
    // Process the text command
    simulateProcessingResponse(textInput);
    addCommand(textInput);
    setTextInput('');
  };

  // This is a mock response generator - in a real app, this would call your backend
  const simulateProcessingResponse = (text?: string) => {
    const command = text || "Sprachbefehl";
    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      const responses = [
        `Verstanden. Ich habe "${command}" ausgeführt.`,
        `Befehl "${command}" wird bearbeitet.`,
        `Ich kümmere mich um "${command}".`,
        `"${command}" wurde verarbeitet.`,
        `Erledigt! "${command}" wurde ausgeführt.`
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setResponse(randomResponse);
      setIsProcessing(false);
    }, 1500);
  };
  
  const resetResponse = () => {
    setResponse(null);
  };

  return (
    <div className="w-full space-y-4">
      <form onSubmit={handleInputSubmit} className="relative flex w-full">
        <Input
          type="text"
          placeholder="Geben Sie einen Befehl ein..."
          value={textInput}
          onChange={handleInputChange}
          className="pr-24"
          disabled={isProcessing}
        />
        <div className="absolute inset-y-0 right-0 flex items-center gap-2 pr-2">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
            className={isRecording ? "text-red-500 animate-pulse" : ""}
          >
            {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
          </Button>
          <Button 
            type="submit" 
            size="icon"
            variant="ghost"
            disabled={textInput.trim() === '' || isProcessing}
          >
            <Send size={18} />
          </Button>
        </div>
      </form>

      {isProcessing ? (
        <div className="flex items-center justify-center py-8">
          <RotateCw className="animate-spin h-8 w-8 text-butler-primary" />
          <span className="ml-2 text-sm text-muted-foreground">Verarbeite Anfrage...</span>
        </div>
      ) : response ? (
        <Card className="animate-fade-in">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <p className="text-sm">{response}</p>
              <Button variant="ghost" size="sm" onClick={resetResponse}>Schließen</Button>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
};

export default VoiceInput;
