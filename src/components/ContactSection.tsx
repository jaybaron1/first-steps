
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Zap, Star } from 'lucide-react';

const ContactSection = () => {
  return (
    <section id="contact" className="py-16 md:py-24 bg-gradient-to-br from-galavanteer-purple-light/30 to-white">
      <div className="container max-w-4xl px-4 md:px-8">
        {/* Enhanced CTA Section */}
        <div className="text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-galavanteer-gray mb-4">
              Build Your Personalized AI System
            </h2>
            <p className="text-galavanteer-gray/80 mb-8 text-lg">
              Every system is unique—built specifically for your voice, your challenges, and your goals. 
              Let's discuss what your personalized AI ecosystem could look like.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
              <Button 
                asChild
                size="lg"
                className="btn-primary group"
              >
                <a href="https://calendly.com/jason-galavanteer/discovery_call" target="_blank" rel="noopener noreferrer">
                  Book Your Discovery Call
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              
              <div className="flex items-center gap-2 text-sm text-galavanteer-gray/70">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Free consultation • No commitment required
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center justify-center gap-2 text-galavanteer-gray/70">
                <Zap className="w-4 h-4 text-galavanteer-purple" />
                <span>Personalized to your voice</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-galavanteer-gray/70">
                <Star className="w-4 h-4 text-galavanteer-purple" />
                <span>Complete implementation</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-galavanteer-gray/70">
                <CheckCircle className="w-4 h-4 text-galavanteer-purple" />
                <span>Ongoing support included</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
