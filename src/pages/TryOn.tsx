import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Camera, RefreshCw, Download, X, ShoppingBag, ChevronLeft, ChevronRight, Upload, Sparkles, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const TryOn = () => {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("product");
  
  const tryOnProducts = products.filter((p) => p.tryOnCompatible);
  const initialProduct = productId 
    ? tryOnProducts.find((p) => p.id === productId) || tryOnProducts[0]
    : tryOnProducts[0];

  const [selectedProduct, setSelectedProduct] = useState(initialProduct);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [productIndex, setProductIndex] = useState(tryOnProducts.indexOf(initialProduct));
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [uploadMode, setUploadMode] = useState<'camera' | 'upload' | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { addToCart } = useCart();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
        setUploadMode('camera');
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast.error("Could not access camera. Please try uploading a photo instead.");
    }
  };

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  const captureFromCamera = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL("image/jpeg", 0.9);
        setUserPhoto(imageData);
        stopCamera();
        setIsCapturing(true);
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error("Please upload an image file");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserPhoto(reader.result as string);
        setIsCapturing(true);
        setUploadMode('upload');
      };
      reader.readAsDataURL(file);
    }
  };

  const generateTryOn = async () => {
    if (!userPhoto) {
      toast.error("Please capture or upload a photo first");
      return;
    }

    setIsGenerating(true);
    toast.loading("Generating your virtual try-on...", { id: "generating" });

    try {
      const { data, error } = await supabase.functions.invoke('virtual-try-on', {
        body: {
          userImageBase64: userPhoto,
          productName: selectedProduct.name,
          productDescription: selectedProduct.description,
          productImageUrl: selectedProduct.image
        }
      });

      if (error) throw error;

      if (data.success && data.image) {
        setGeneratedImage(data.image);
        toast.success("Virtual try-on generated!", { id: "generating" });
      } else {
        throw new Error(data.error || "Failed to generate try-on");
      }
    } catch (error: any) {
      console.error("Error generating try-on:", error);
      toast.error(error.message || "Failed to generate virtual try-on. Please try again.", { id: "generating" });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    const imageToDownload = generatedImage || capturedImage;
    if (imageToDownload) {
      const link = document.createElement("a");
      link.download = `urbanwear-tryon-${selectedProduct.name.toLowerCase().replace(/\s+/g, "-")}.png`;
      link.href = imageToDownload;
      link.click();
      toast.success("Image downloaded!");
    }
  };

  const resetAll = () => {
    setCapturedImage(null);
    setUserPhoto(null);
    setGeneratedImage(null);
    setIsCapturing(false);
    setUploadMode(null);
    stopCamera();
  };

  const nextProduct = () => {
    const newIndex = (productIndex + 1) % tryOnProducts.length;
    setProductIndex(newIndex);
    setSelectedProduct(tryOnProducts[newIndex]);
    setGeneratedImage(null);
  };

  const prevProduct = () => {
    const newIndex = (productIndex - 1 + tryOnProducts.length) % tryOnProducts.length;
    setProductIndex(newIndex);
    setSelectedProduct(tryOnProducts[newIndex]);
    setGeneratedImage(null);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <>
      <Helmet>
        <title>Virtual Try-On | Urban Wear</title>
        <meta
          name="description"
          content="Try on Urban Wear clothes virtually using AI. Upload your photo and see how our premium fashion looks on you before you buy."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-28 pb-20">
          <div className="container mx-auto px-4">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Sparkles className="h-4 w-4" />
                AI-Powered
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                Virtual <span className="text-gradient-gold">Try-On</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Upload your photo and let AI show you how our pieces look on you. It's magic!
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main View */}
              <div className="lg:col-span-2">
                <div className="glass rounded-xl overflow-hidden">
                  <div className="relative aspect-video bg-charcoal">
                    {/* Initial State - Choose Method */}
                    {!isCapturing && !isCameraActive && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                        <div className="text-center mb-8">
                          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                            Start Your Try-On
                          </h2>
                          <p className="text-muted-foreground">
                            Choose how you'd like to provide your photo
                          </p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                          <Button variant="hero" size="lg" onClick={startCamera}>
                            <Camera className="h-5 w-5 mr-2" />
                            Use Camera
                          </Button>
                          <Button 
                            variant="luxe" 
                            size="lg" 
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="h-5 w-5 mr-2" />
                            Upload Photo
                          </Button>
                        </div>
                        
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        
                        <p className="text-muted-foreground text-sm mt-6 text-center max-w-md">
                          For best results, use a clear front-facing photo with good lighting
                        </p>
                      </div>
                    )}

                    {/* Camera Active */}
                    {isCameraActive && !isCapturing && (
                      <>
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
                          <Button variant="ghost" onClick={stopCamera}>
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                          <Button variant="hero" size="lg" onClick={captureFromCamera}>
                            <Camera className="h-5 w-5 mr-2" />
                            Capture
                          </Button>
                        </div>
                      </>
                    )}

                    {/* Photo Captured - Show comparison or generated result */}
                    {isCapturing && (
                      <div className="w-full h-full flex items-center justify-center p-4">
                        {generatedImage ? (
                          <div className="relative w-full h-full">
                            <img
                              src={generatedImage}
                              alt="Virtual Try-On Result"
                              className="w-full h-full object-contain"
                            />
                            <div className="absolute top-4 left-4 bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                              <Sparkles className="h-3 w-3" />
                              AI Generated
                            </div>
                          </div>
                        ) : isGenerating ? (
                          <div className="flex flex-col items-center justify-center text-center">
                            <div className="relative mb-6">
                              <div className="w-24 h-24 rounded-full bg-primary/20 animate-pulse flex items-center justify-center">
                                <Sparkles className="h-10 w-10 text-primary animate-spin" />
                              </div>
                            </div>
                            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                              AI is working its magic...
                            </h3>
                            <p className="text-muted-foreground text-sm max-w-sm">
                              Creating your personalized try-on with {selectedProduct.name}
                            </p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-4 w-full h-full">
                            <div className="relative rounded-lg overflow-hidden">
                              <img
                                src={userPhoto || ''}
                                alt="Your Photo"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute bottom-2 left-2 bg-background/80 px-2 py-1 rounded text-xs text-foreground">
                                Your Photo
                              </div>
                            </div>
                            <div className="relative rounded-lg overflow-hidden bg-card flex items-center justify-center">
                              <img
                                src={selectedProduct.image}
                                alt={selectedProduct.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute bottom-2 left-2 bg-background/80 px-2 py-1 rounded text-xs text-foreground">
                                {selectedProduct.name}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <canvas ref={canvasRef} className="hidden" />
                  </div>

                  {/* Controls */}
                  {isCapturing && (
                    <div className="p-6 flex flex-wrap items-center justify-center gap-4 border-t border-border">
                      {generatedImage ? (
                        <>
                          <Button variant="outline" onClick={resetAll}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Try Another Photo
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setGeneratedImage(null);
                            }}
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Try Different Item
                          </Button>
                          <Button variant="hero" onClick={downloadImage}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          <Button
                            variant="luxe"
                            onClick={() => addToCart(selectedProduct, selectedProduct.sizes[0], selectedProduct.colors[0])}
                          >
                            <ShoppingBag className="h-4 w-4 mr-2" />
                            Add to Cart
                          </Button>
                        </>
                      ) : !isGenerating ? (
                        <>
                          <Button variant="outline" onClick={resetAll}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Retake Photo
                          </Button>
                          <Button 
                            variant="hero" 
                            size="lg"
                            onClick={generateTryOn}
                          >
                            <Sparkles className="h-5 w-5 mr-2" />
                            Generate Try-On
                          </Button>
                        </>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>

              {/* Product Selector */}
              <div className="space-y-6">
                <div className="glass rounded-xl p-6">
                  <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                    Select Item
                  </h2>

                  {/* Current Product */}
                  <div className="relative mb-6">
                    <div className="aspect-[3/4] rounded-lg overflow-hidden bg-card">
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-background to-transparent">
                      <p className="font-display text-lg font-semibold text-foreground">
                        {selectedProduct.name}
                      </p>
                      <p className="text-primary font-semibold">Rs. {selectedProduct.price.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between">
                    <Button variant="outline" size="icon" onClick={prevProduct}>
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {productIndex + 1} / {tryOnProducts.length}
                    </span>
                    <Button variant="outline" size="icon" onClick={nextProduct}>
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Product Grid */}
                <div className="glass rounded-xl p-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">
                    Quick Select
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {tryOnProducts.slice(0, 6).map((product) => (
                      <button
                        key={product.id}
                        onClick={() => {
                          setSelectedProduct(product);
                          setProductIndex(tryOnProducts.indexOf(product));
                          setGeneratedImage(null);
                        }}
                        className={cn(
                          "aspect-square rounded-lg overflow-hidden border-2 transition-all",
                          selectedProduct.id === product.id
                            ? "border-primary"
                            : "border-transparent hover:border-border"
                        )}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* View Product Link */}
                <Button variant="luxe" className="w-full" asChild>
                  <Link to={`/product/${selectedProduct.id}`}>
                    View Full Details
                  </Link>
                </Button>
              </div>
            </div>

            {/* How It Works */}
            <div className="mt-16">
              <h2 className="font-display text-2xl font-bold text-center text-foreground mb-8">
                How It Works
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    step: "1",
                    title: "Upload Your Photo",
                    description: "Take a selfie or upload an existing photo of yourself"
                  },
                  {
                    step: "2",
                    title: "Choose Your Style",
                    description: "Browse and select the clothing item you want to try"
                  },
                  {
                    step: "3",
                    title: "See The Magic",
                    description: "AI generates a realistic image of you wearing the item"
                  }
                ].map((item) => (
                  <div key={item.step} className="glass rounded-xl p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/20 text-primary font-display text-xl font-bold flex items-center justify-center mx-auto mb-4">
                      {item.step}
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default TryOn;
