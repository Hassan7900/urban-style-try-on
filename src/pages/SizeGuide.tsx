import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const SizeGuide = () => {
  return (
    <>
      <Helmet>
        <title>Size Guide | Urban Wear</title>
        <meta name="description" content="Find your perfect fit with our comprehensive size guide. Detailed measurements and sizing tips for all our products." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-28 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                  Size Guide
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Find your perfect fit with our detailed size guide. All measurements are in inches and based on Pakistani sizing standards.
                </p>
              </div>

              <div className="space-y-12">
                {/* Men's Tops */}
                <div className="bg-card rounded-xl p-8 shadow-card">
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                    Men's Tops (T-Shirts, Shirts, Hoodies)
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-border">
                      <thead>
                        <tr className="bg-muted">
                          <th className="border border-border px-4 py-3 text-left font-medium">Size</th>
                          <th className="border border-border px-4 py-3 text-left font-medium">Chest</th>
                          <th className="border border-border px-4 py-3 text-left font-medium">Shoulder</th>
                          <th className="border border-border px-4 py-3 text-left font-medium">Length</th>
                          <th className="border border-border px-4 py-3 text-left font-medium">Sleeve</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-border px-4 py-3 font-medium">S</td>
                          <td className="border border-border px-4 py-3">36-38</td>
                          <td className="border border-border px-4 py-3">16.5</td>
                          <td className="border border-border px-4 py-3">27</td>
                          <td className="border border-border px-4 py-3">8</td>
                        </tr>
                        <tr className="bg-muted/50">
                          <td className="border border-border px-4 py-3 font-medium">M</td>
                          <td className="border border-border px-4 py-3">38-40</td>
                          <td className="border border-border px-4 py-3">17.5</td>
                          <td className="border border-border px-4 py-3">28</td>
                          <td className="border border-border px-4 py-3">8.5</td>
                        </tr>
                        <tr>
                          <td className="border border-border px-4 py-3 font-medium">L</td>
                          <td className="border border-border px-4 py-3">40-42</td>
                          <td className="border border-border px-4 py-3">18.5</td>
                          <td className="border border-border px-4 py-3">29</td>
                          <td className="border border-border px-4 py-3">9</td>
                        </tr>
                        <tr className="bg-muted/50">
                          <td className="border border-border px-4 py-3 font-medium">XL</td>
                          <td className="border border-border px-4 py-3">42-44</td>
                          <td className="border border-border px-4 py-3">19.5</td>
                          <td className="border border-border px-4 py-3">30</td>
                          <td className="border border-border px-4 py-3">9.5</td>
                        </tr>
                        <tr>
                          <td className="border border-border px-4 py-3 font-medium">XXL</td>
                          <td className="border border-border px-4 py-3">44-46</td>
                          <td className="border border-border px-4 py-3">20.5</td>
                          <td className="border border-border px-4 py-3">31</td>
                          <td className="border border-border px-4 py-3">10</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Men's Bottoms */}
                <div className="bg-card rounded-xl p-8 shadow-card">
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                    Men's Bottoms (Pants, Jeans)
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-border">
                      <thead>
                        <tr className="bg-muted">
                          <th className="border border-border px-4 py-3 text-left font-medium">Size</th>
                          <th className="border border-border px-4 py-3 text-left font-medium">Waist</th>
                          <th className="border border-border px-4 py-3 text-left font-medium">Length</th>
                          <th className="border border-border px-4 py-3 text-left font-medium">Inseam</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-border px-4 py-3 font-medium">28</td>
                          <td className="border border-border px-4 py-3">28-29</td>
                          <td className="border border-border px-4 py-3">40</td>
                          <td className="border border-border px-4 py-3">32</td>
                        </tr>
                        <tr className="bg-muted/50">
                          <td className="border border-border px-4 py-3 font-medium">30</td>
                          <td className="border border-border px-4 py-3">30-31</td>
                          <td className="border border-border px-4 py-3">40</td>
                          <td className="border border-border px-4 py-3">32</td>
                        </tr>
                        <tr>
                          <td className="border border-border px-4 py-3 font-medium">32</td>
                          <td className="border border-border px-4 py-3">32-33</td>
                          <td className="border border-border px-4 py-3">41</td>
                          <td className="border border-border px-4 py-3">33</td>
                        </tr>
                        <tr className="bg-muted/50">
                          <td className="border border-border px-4 py-3 font-medium">34</td>
                          <td className="border border-border px-4 py-3">34-35</td>
                          <td className="border border-border px-4 py-3">41</td>
                          <td className="border border-border px-4 py-3">33</td>
                        </tr>
                        <tr>
                          <td className="border border-border px-4 py-3 font-medium">36</td>
                          <td className="border border-border px-4 py-3">36-37</td>
                          <td className="border border-border px-4 py-3">42</td>
                          <td className="border border-border px-4 py-3">34</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Women's Tops */}
                <div className="bg-card rounded-xl p-8 shadow-card">
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                    Women's Tops (T-Shirts, Blouses, Hoodies)
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-border">
                      <thead>
                        <tr className="bg-muted">
                          <th className="border border-border px-4 py-3 text-left font-medium">Size</th>
                          <th className="border border-border px-4 py-3 text-left font-medium">Bust</th>
                          <th className="border border-border px-4 py-3 text-left font-medium">Waist</th>
                          <th className="border border-border px-4 py-3 text-left font-medium">Shoulder</th>
                          <th className="border border-border px-4 py-3 text-left font-medium">Length</th>
                          <th className="border border-border px-4 py-3 text-left font-medium">Sleeve</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-border px-4 py-3 font-medium">XS</td>
                          <td className="border border-border px-4 py-3">32-33</td>
                          <td className="border border-border px-4 py-3">24-25</td>
                          <td className="border border-border px-4 py-3">13.5</td>
                          <td className="border border-border px-4 py-3">24</td>
                          <td className="border border-border px-4 py-3">7</td>
                        </tr>
                        <tr className="bg-muted/50">
                          <td className="border border-border px-4 py-3 font-medium">S</td>
                          <td className="border border-border px-4 py-3">34-35</td>
                          <td className="border border-border px-4 py-3">26-27</td>
                          <td className="border border-border px-4 py-3">14</td>
                          <td className="border border-border px-4 py-3">25</td>
                          <td className="border border-border px-4 py-3">7.5</td>
                        </tr>
                        <tr>
                          <td className="border border-border px-4 py-3 font-medium">M</td>
                          <td className="border border-border px-4 py-3">36-37</td>
                          <td className="border border-border px-4 py-3">28-29</td>
                          <td className="border border-border px-4 py-3">14.5</td>
                          <td className="border border-border px-4 py-3">26</td>
                          <td className="border border-border px-4 py-3">8</td>
                        </tr>
                        <tr className="bg-muted/50">
                          <td className="border border-border px-4 py-3 font-medium">L</td>
                          <td className="border border-border px-4 py-3">38-39</td>
                          <td className="border border-border px-4 py-3">30-31</td>
                          <td className="border border-border px-4 py-3">15</td>
                          <td className="border border-border px-4 py-3">27</td>
                          <td className="border border-border px-4 py-3">8.5</td>
                        </tr>
                        <tr>
                          <td className="border border-border px-4 py-3 font-medium">XL</td>
                          <td className="border border-border px-4 py-3">40-41</td>
                          <td className="border border-border px-4 py-3">32-33</td>
                          <td className="border border-border px-4 py-3">15.5</td>
                          <td className="border border-border px-4 py-3">28</td>
                          <td className="border border-border px-4 py-3">9</td>
                        </tr>
                        <tr className="bg-muted/50">
                          <td className="border border-border px-4 py-3 font-medium">XXL</td>
                          <td className="border border-border px-4 py-3">42-43</td>
                          <td className="border border-border px-4 py-3">34-35</td>
                          <td className="border border-border px-4 py-3">16</td>
                          <td className="border border-border px-4 py-3">29</td>
                          <td className="border border-border px-4 py-3">9.5</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Women's Bottoms */}
                <div className="bg-card rounded-xl p-8 shadow-card">
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                    Women's Bottoms (Pants, Jeans, Leggings)
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-border">
                      <thead>
                        <tr className="bg-muted">
                          <th className="border border-border px-4 py-3 text-left font-medium">Size</th>
                          <th className="border border-border px-4 py-3 text-left font-medium">Waist</th>
                          <th className="border border-border px-4 py-3 text-left font-medium">Hip</th>
                          <th className="border border-border px-4 py-3 text-left font-medium">Length</th>
                          <th className="border border-border px-4 py-3 text-left font-medium">Inseam</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-border px-4 py-3 font-medium">XS</td>
                          <td className="border border-border px-4 py-3">24-25</td>
                          <td className="border border-border px-4 py-3">34-35</td>
                          <td className="border border-border px-4 py-3">38</td>
                          <td className="border border-border px-4 py-3">28</td>
                        </tr>
                        <tr className="bg-muted/50">
                          <td className="border border-border px-4 py-3 font-medium">S</td>
                          <td className="border border-border px-4 py-3">26-27</td>
                          <td className="border border-border px-4 py-3">36-37</td>
                          <td className="border border-border px-4 py-3">39</td>
                          <td className="border border-border px-4 py-3">29</td>
                        </tr>
                        <tr>
                          <td className="border border-border px-4 py-3 font-medium">M</td>
                          <td className="border border-border px-4 py-3">28-29</td>
                          <td className="border border-border px-4 py-3">38-39</td>
                          <td className="border border-border px-4 py-3">40</td>
                          <td className="border border-border px-4 py-3">30</td>
                        </tr>
                        <tr className="bg-muted/50">
                          <td className="border border-border px-4 py-3 font-medium">L</td>
                          <td className="border border-border px-4 py-3">30-31</td>
                          <td className="border border-border px-4 py-3">40-41</td>
                          <td className="border border-border px-4 py-3">41</td>
                          <td className="border border-border px-4 py-3">31</td>
                        </tr>
                        <tr>
                          <td className="border border-border px-4 py-3 font-medium">XL</td>
                          <td className="border border-border px-4 py-3">32-33</td>
                          <td className="border border-border px-4 py-3">42-43</td>
                          <td className="border border-border px-4 py-3">42</td>
                          <td className="border border-border px-4 py-3">32</td>
                        </tr>
                        <tr className="bg-muted/50">
                          <td className="border border-border px-4 py-3 font-medium">XXL</td>
                          <td className="border border-border px-4 py-3">34-35</td>
                          <td className="border border-border px-4 py-3">44-45</td>
                          <td className="border border-border px-4 py-3">43</td>
                          <td className="border border-border px-4 py-3">33</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* How to Measure */}
                <div className="bg-card rounded-xl p-8 shadow-card">
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                    How to Measure Yourself
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Chest/Bust</h3>
                        <p className="text-muted-foreground text-sm">
                          Measure around the fullest part of your chest/bust, keeping the tape horizontal and under your armpits.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Waist</h3>
                        <p className="text-muted-foreground text-sm">
                          Measure around your natural waistline, which is usually just above the belly button. Don't suck in!
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Hips</h3>
                        <p className="text-muted-foreground text-sm">
                          Measure around the widest part of your hips, usually 7-9 inches below your waist.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Shoulder</h3>
                        <p className="text-muted-foreground text-sm">
                          Measure from the edge of one shoulder to the other, across your back.
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Length</h3>
                        <p className="text-muted-foreground text-sm">
                          Measure from the highest point of your shoulder down to where you want the hem to end.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Sleeve</h3>
                        <p className="text-muted-foreground text-sm">
                          Measure from the center of your back neck, over your shoulder, and down to your wrist.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Inseam</h3>
                        <p className="text-muted-foreground text-sm">
                          Measure from your crotch down to the bottom of your ankle (or desired pant length).
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Tips</h3>
                        <p className="text-muted-foreground text-sm">
                          Wear form-fitting clothes, use a flexible tape, and measure 2-3 times for accuracy.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-primary/5 rounded-xl p-8 border border-primary/20">
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                    Sizing Tips
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h3 className="font-semibold text-foreground">General Advice</h3>
                      <ul className="text-muted-foreground text-sm space-y-2">
                        <li>• Take measurements while wearing form-fitting clothing</li>
                        <li>• Use a flexible measuring tape for accuracy</li>
                        <li>• Measure yourself 2-3 times to ensure consistency</li>
                        <li>• If between sizes, size up for comfort</li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-semibold text-foreground">Fit Preferences</h3>
                      <ul className="text-muted-foreground text-sm space-y-2">
                        <li>• Slim fit: Choose your exact measurements</li>
                        <li>• Regular fit: Add 1-2 inches to measurements</li>
                        <li>• Loose fit: Add 3-4 inches to measurements</li>
                        <li>• Our sizes follow Pakistani standards</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div className="text-center bg-card rounded-xl p-8 shadow-card">
                  <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                    Still Need Help?
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    If you're unsure about your size or have any questions, our customer service team is here to help.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="mailto:support@urbanwear.pk"
                      className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                      Email Support
                    </a>
                    <a
                      href="tel:+923001234567"
                      className="inline-flex items-center justify-center px-6 py-3 border border-border bg-card text-foreground rounded-lg font-medium hover:bg-accent transition-colors"
                    >
                      Call Us
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default SizeGuide;