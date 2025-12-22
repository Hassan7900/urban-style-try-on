import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Camera, RefreshCw, Download, X, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";

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
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

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
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      if (ctx) {
        // Draw video frame
        ctx.drawImage(video, 0, 0);
        
        // Overlay the product image (simulated AR)
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          // Position product overlay (simplified - center it)
          const scale = 0.4;
          const x = (canvas.width - img.width * scale) / 2;
          const y = canvas.height * 0.2;
          ctx.globalAlpha = 0.85;
          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
          ctx.globalAlpha = 1;
          
          setCapturedImage(canvas.toDataURL("image/png"));
          setIsCapturing(true);
        };
        img.src = selectedProduct.image;
      }
    }
  };

  const downloadImage = () => {
    if (capturedImage) {
      const link = document.createElement("a");
      link.download = `urbanwear-tryon-${selectedProduct.name.toLowerCase().replace(/\s+/g, "-")}.png`;
      link.href = capturedImage;
      link.click();
    }
  };

  const resetCapture = () => {
    setCapturedImage(null);
    setIsCapturing(false);
  };

  const nextProduct = () => {
    const newIndex = (productIndex + 1) % tryOnProducts.length;
    setProductIndex(newIndex);
    setSelectedProduct(tryOnProducts[newIndex]);
  };

  const prevProduct = () => {
    const newIndex = (productIndex - 1 + tryOnProducts.length) % tryOnProducts.length;
    setProductIndex(newIndex);
    setSelectedProduct(tryOnProducts[newIndex]);
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
          content="Try on Urban Wear clothes virtually using your webcam. See how our premium streetwear looks on you before you buy."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-28 pb-20">
          <div className="container mx-auto px-4">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                Virtual <span className="text-gradient-gold">Try-On</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                See how our pieces look on you using your webcam. Select an item and strike a pose!
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Camera View */}
              <div className="lg:col-span-2">
                <div className="glass rounded-xl overflow-hidden">
                  <div className="relative aspect-video bg-charcoal">
                    {!isCameraActive ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Camera className="h-16 w-16 text-muted-foreground mb-6" />
                        <Button variant="hero" size="lg" onClick={startCamera}>
                          Start Camera
                        </Button>
                        <p className="text-muted-foreground text-sm mt-4">
                          Allow camera access to try on clothes virtually
                        </p>
                      </div>
                    ) : isCapturing && capturedImage ? (
                      <img
                        src={capturedImage}
                        alt="Captured"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <>
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover"
                        />
                        {/* Product Overlay (simplified AR simulation) */}
                        <div className="absolute inset-0 flex items-start justify-center pt-[10%] pointer-events-none">
                          <img
                            src={selectedProduct.image}
                            alt={selectedProduct.name}
                            className="w-[35%] opacity-80 mix-blend-normal"
                            style={{ filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.5))" }}
                          />
                        </div>
                      </>
                    )}
                    <canvas ref={canvasRef} className="hidden" />
                  </div>

                  {/* Controls */}
                  {isCameraActive && (
                    <div className="p-6 flex items-center justify-center gap-4">
                      {isCapturing ? (
                        <>
                          <Button variant="outline" onClick={resetCapture}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Retake
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
                      ) : (
                        <>
                          <Button variant="ghost" onClick={stopCamera}>
                            <X className="h-4 w-4 mr-2" />
                            Stop
                          </Button>
                          <Button variant="hero" size="lg" onClick={captureImage}>
                            <Camera className="h-5 w-5 mr-2" />
                            Capture
                          </Button>
                        </>
                      )}
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
                      <p className="text-primary font-semibold">${selectedProduct.price}</p>
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
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default TryOn;
