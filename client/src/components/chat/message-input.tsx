import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Globe, Brain, ArrowUp, Paperclip, Mic } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

interface MessageInputProps {
  onSendMessage: (content: string, useDeepThink?: boolean) => void;
  isLoading: boolean;
  onQuickMessage: (message: string) => void;
}

export function MessageInput({ onSendMessage, isLoading, onQuickMessage }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [useDeepThink, setUseDeepThink] = useState(false);

  const handleSubmit = (e: React.FormEvent, forceDeepThink?: boolean) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim(), forceDeepThink || useDeepThink);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleDeepThink = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim(), true);
      setMessage("");
    }
  };

  const quickActions = [
    { icon: Globe, label: "بحث", action: () => {} },
    { 
      icon: Brain, 
      label: "تفكير عميق (R1)", 
      action: handleDeepThink,
      active: useDeepThink 
    },
  ];

  return (
    <TooltipProvider>
      <footer className="glass-card border-t backdrop-blur-xl">
        <div className="container mx-auto p-4">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="glass-strong rounded-3xl p-4 space-y-3">
              {/* Quick Actions Row */}
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hidden">
                {quickActions.map((action, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant={action.active ? "default" : "ghost"}
                        size="sm"
                        className={`${action.active ? 'btn-primary' : 'btn-ghost'} rounded-2xl px-3 py-2 h-8 flex items-center gap-2 text-xs whitespace-nowrap`}
                        onClick={action.action}
                        disabled={isLoading || (action.label.includes('تفكير') && !message.trim())}
                      >
                        <action.icon className="w-3.5 h-3.5" />
                        <span>{action.label}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{action.label}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
                
                {/* Deep Think Toggle */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant={useDeepThink ? "default" : "ghost"}
                      size="sm"
                      className={`${useDeepThink ? 'btn-primary' : 'btn-ghost'} rounded-2xl px-3 py-2 h-8 flex items-center gap-2 text-xs whitespace-nowrap`}
                      onClick={() => setUseDeepThink(!useDeepThink)}
                      disabled={isLoading}
                    >
                      <Brain className="w-3.5 h-3.5" />
                      <span>تفكير تلقائي</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>تفعيل نمط التفكير العميق تلقائياً لجميع الرسائل</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Main Input Row */}
              <div className="flex items-end gap-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="btn-ghost rounded-2xl w-10 h-10 flex-shrink-0"
                      disabled={isLoading}
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>إرفاق ملف</p>
                  </TooltipContent>
                </Tooltip>

                <div className="flex-1 relative">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="أرسل رسالة إلى dr.x AI... ✨"
                    className="input-modern rounded-2xl pr-12 pl-4 py-3 text-right resize-none border-0 bg-input/50 focus:bg-input/70 transition-all"
                    disabled={isLoading}
                    dir="rtl"
                  />
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 btn-ghost rounded-xl w-8 h-8"
                        disabled={isLoading}
                      >
                        <Mic className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>تسجيل صوتي</p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="submit"
                      size="icon"
                      className="btn-primary rounded-2xl w-10 h-10 flex-shrink-0"
                      disabled={!message.trim() || isLoading}
                    >
                      {isLoading ? (
                        <div className="spinner" />
                      ) : (
                        <ArrowUp className="w-5 h-5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>إرسال الرسالة</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Quick Messages */}
              {message === "" && (
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hidden animate-fade-in">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">اقتراحات:</span>
                  {[
                    "اشرح لي البرمجة",
                    "ساعدني في الكود",
                    "أريد تعلم الذكاء الاصطناعي"
                  ].map((suggestion, index) => (
                    <Button
                      key={index}
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="btn-ghost rounded-2xl px-3 py-1.5 h-7 text-xs whitespace-nowrap border border-border/50 hover:border-border"
                      onClick={() => onQuickMessage(suggestion)}
                      disabled={isLoading}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </form>
        </div>
      </footer>
    </TooltipProvider>
  );
}
