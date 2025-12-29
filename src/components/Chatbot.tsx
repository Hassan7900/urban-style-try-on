import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { products } from "@/data/products";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your fashion assistant. I can help you find the perfect outfit, answer questions about clothing, sizes, and care instructions. What can I help you with today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();

    // Product recommendations
    if (message.includes("recommend") || message.includes("suggest")) {
      if (message.includes("hoodie") || message.includes("sweater")) {
        const hoodies = products.filter(p => p.category === "Hoodies" && p.inStock);
        return `I'd recommend our ${hoodies[0]?.name} for ${hoodies[0]?.price} PKR. It's perfect for Pakistani winters with premium cotton and fleece lining. We also have other great options in our Hoodies collection!`;
      }
      if (message.includes("pants") || message.includes("trouser")) {
        const pants = products.filter(p => p.category === "Pants" && p.inStock);
        return `Our ${pants[0]?.name} at ${pants[0]?.price} PKR would be perfect! They feature multiple utility pockets and are made from comfortable cotton blend fabric.`;
      }
      if (message.includes("t-shirt") || message.includes("tee")) {
        const tees = products.filter(p => p.category === "T-Shirts" && p.inStock);
        return `Check out our ${tees[0]?.name} for just ${tees[0]?.price} PKR. Made from 100% pure cotton, it's breathable and perfect for Karachi summers.`;
      }
      if (message.includes("jacket")) {
        const jackets = products.filter(p => p.category === "Jackets" && p.inStock);
        return `Our ${jackets[0]?.name} at ${jackets[0]?.price} PKR is an excellent choice! It has quilted lining for warmth and a stylish bomber design.`;
      }
    }

    // Size questions
    if (message.includes("size") || message.includes("fit")) {
      return "We offer sizes from S to XXL for most items. Our sizing is based on Pakistani standards - S (36-38), M (38-40), L (40-42), XL (42-44), XXL (44-46). For pants, we have waist sizes 28-36. If you're unsure, I recommend checking our size guide or trying our virtual try-on feature!";
    }

    // Care instructions
    if (message.includes("wash") || message.includes("care") || message.includes("clean")) {
      return "For best results: Machine wash cold, tumble dry low, or air dry. Avoid bleach and high heat. Cotton items can be ironed on medium heat. For delicate items, dry clean recommended. Always check the care label on each product!";
    }

    // Price questions
    if (message.includes("price") || message.includes("expensive") || message.includes("cheap")) {
      const affordable = products.filter(p => p.price < 3000 && p.inStock);
      const premium = products.filter(p => p.price > 5000 && p.inStock);
      return `We have options for every budget! Affordable picks under 3000 PKR include our basic tees and accessories. Premium items like jackets and hoodies range from 5000-9000 PKR. Many items are currently on sale with up to 30% off!`;
    }

    // Weather/fashion advice
    if (message.includes("winter") || message.includes("cold")) {
      return "For Pakistani winters, layer up with our hoodies and jackets! The Classic Oversized Hoodie with fleece lining is perfect for Lahore and Islamabad winters. Pair it with cargo pants for a complete urban look.";
    }

    if (message.includes("summer") || message.includes("hot")) {
      return "Stay cool in Karachi summers with our breathable cotton tees and lightweight fabrics. The Premium Cotton Tee is perfect for hot weather - 100% cotton and moisture-wicking properties.";
    }

    // Try-on feature
    if (message.includes("try") || message.includes("virtual")) {
      return "Love our virtual try-on feature! Most of our products are try-on compatible. Just select a product and click 'Try On' to see how it looks on you using AI technology. It's perfect for ensuring the perfect fit!";
    }

    // General questions
    if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
      return "Hello! I'm here to help you find the perfect fashion pieces. Whether you need outfit recommendations, size advice, or care instructions, I'm your fashion assistant!";
    }

    if (message.includes("shipping") || message.includes("delivery") || message.includes("information")) {
      return "We deliver across Pakistan! Karachi (1-2 days), Lahore (2-3 days), Islamabad (3-4 days). Free shipping on orders over 5000 PKR. Express delivery available for urgent orders.";
    }

    if (message.includes("return") || message.includes("exchange")) {
      return "Easy returns within 7 days! Items must be unused with original tags. Contact our support team to initiate returns. We're here to ensure you're completely satisfied with your purchase.";
    }

    // Default responses
    const defaultResponses = [
      "I'd be happy to help you find the perfect outfit! Could you tell me more about what you're looking for?",
      "That's an interesting question! Let me help you with that. What type of clothing are you interested in?",
      "Great question! I can help with recommendations, sizing, care instructions, and more. What would you like to know?",
      "I'm here to assist with all your fashion needs! Whether it's product recommendations or styling advice, just let me know.",
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateResponse(inputValue),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50"
        size="icon"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-80 h-96 shadow-2xl border z-40 flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
            <div className="h-8 w-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Fashion Assistant</h3>
              <p className="text-xs opacity-90">Online now</p>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.sender === "bot" && (
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] rounded-lg px-3 py-2 text-sm ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.text}
                  </div>
                  {message.sender === "user" && (
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-muted rounded-lg px-3 py-2 text-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about fashion, sizes, care..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button
                onClick={handleSendMessage}
                size="icon"
                disabled={!inputValue.trim() || isTyping}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default Chatbot;