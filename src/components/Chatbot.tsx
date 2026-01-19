import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { products } from "@/data/products";
import { toast } from "sonner";

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
      text: "Hi! I'm an AI-powered assistant for Urban Wear. I can help you with fashion advice, product recommendations, general questions, and much more. Ask me anything!",
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

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch(
        `https://free-chatgpt-api.p.rapidapi.com/chat-completion-one?prompt=${encodeURIComponent(userMessage)}`,
        {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": "2fd0a37b3dmsh21d9090729230d1p166b15jsnd10b03afd3b6",
            "X-RapidAPI-Host": "free-chatgpt-api.p.rapidapi.com",
          },
        }
      );

      const data = await response.json();
      console.log("API Response:", data);
      
      if (!response.ok) {
        console.error("API Error:", data);
        throw new Error(data.message || "API request failed");
      }
      
      // Try different possible response formats
      const aiResponse = data.response || data.result || data.answer || data.message || data.text || data.content || data.output;
      
      if (aiResponse && typeof aiResponse === 'string' && aiResponse.trim()) {
        return aiResponse;
      }
      
      // If no valid response, use fallback
      throw new Error("Invalid API response format");
    } catch (error) {
      console.error("AI API error:", error);
      // Use enhanced fallback without notifying user of API failure
      return generateEnhancedResponse(userMessage);
    }
  };

  const generateEnhancedResponse = (userMessage: string): string => {
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
      return "Hello! I'm here to help you with fashion advice, product recommendations, or answer any questions you have. What would you like to know?";
    }

    if (message.includes("who") && (message.includes("are you") || message.includes("r u"))) {
      return "I'm an AI assistant for Urban Wear! I'm here to help with fashion advice, product information, and answer any questions you might have - whether about clothing or general topics. How can I assist you today?";
    }

    if (message.includes("what") && message.includes("can you")) {
      return "I can help you with fashion advice, product recommendations, styling tips, size guides, care instructions, shipping info, and much more! I'm also here to answer general questions on any topic. Just ask away!";
    }

    if (message.includes("shipping") || message.includes("delivery")) {
      return "We deliver across Pakistan! Karachi (1-2 days), Lahore (2-3 days), Islamabad (3-4 days). Free shipping on orders over 5000 PKR. Express delivery available for urgent orders. Track your order anytime from our shipping page!";
    }

    if (message.includes("return") || message.includes("exchange")) {
      return "Easy returns within 7 days! Items must be unused with original tags. Contact our support team to initiate returns. We're here to ensure you're completely satisfied with your purchase.";
    }

    if (message.includes("thank")) {
      return "You're welcome! If you have any other questions about fashion, our products, or anything else, feel free to ask. I'm here to help! 😊";
    }

    // Try to give helpful responses for common question patterns
    if (message.includes("how") && (message.includes("work") || message.includes("use"))) {
      if (message.includes("try-on") || message.includes("virtual")) {
        return "Our virtual try-on is easy! Browse products, select an item, and click 'Try On'. Use your camera or upload a photo to see how the clothing looks on you using AI technology. It's a great way to visualize your purchase!";
      }
      return "I'd be happy to explain how that works! Could you be more specific about what you'd like to know?";
    }

    if (message.includes("why") || message.includes("explain")) {
      return "That's a great question! While I can provide general information, for detailed answers, could you specify what topic you'd like me to explain? Whether it's fashion-related or something else, I'll do my best to help!";
    }

    if (message.includes("best") || message.includes("top")) {
      const featured = products.filter(p => p.inStock).slice(0, 3);
      return `Our top picks right now include: ${featured.map(p => `${p.name} (${p.price} PKR)`).join(", ")}. These are customer favorites with great reviews! Would you like to know more about any of these?`;
    }

    // Default responses that encourage engagement
    const defaultResponses = [
      "I'd be happy to help! Whether you're looking for fashion advice, product info, or have general questions, I'm here. What would you like to know?",
      "Interesting question! I'm here to assist with fashion recommendations, product details, or answer any other questions you might have. How can I help?",
      "Great! I can help with fashion advice, our products, or general information. What's on your mind?",
      "I'm your AI assistant for all things Urban Wear and beyond! Ask me about products, styling tips, or anything else you'd like to know.",
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    const messageText = inputValue;
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      // Get AI response
      const responseText = await generateAIResponse(messageText);
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error("Error generating response:", error);
      toast.error("Sorry, I encountered an error. Please try again.");
      
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I encountered an error. Could you please try asking again?",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
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
              <h3 className="font-semibold text-sm">AI Fashion Assistant</h3>
              <p className="text-xs opacity-90">Powered by AI • Online now</p>
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
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:0.2s]"></div>
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
                placeholder="Ask me anything..."
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