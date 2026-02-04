import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, CheckCircle, Zap, Star } from 'lucide-react';
const JordanOSShowcase = () => {
  return <section id="jordan-showcase" className="py-16 md:py-24 bg-gradient-to-br from-galavanteer-purple-light/30 to-white">
      <div className="container max-w-5xl px-4 md:px-8">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-galavanteer-purple-light/50 text-galavanteer-purple border-galavanteer-purple/20">
            <Star className="w-4 h-4 mr-2" />
            Real Client Delivery
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-galavanteer-gray mb-4">
            What You Actually Get
          </h2>
          <p className="text-lg text-galavanteer-gray/80 max-w-2xl mx-auto">
            This is the actual delivery email I sent to Jordan with his finished AI system. 
            See the level of personalization and detail in every project.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* System Overview */}
          <Card className="border-galavanteer-purple/20 shadow-lg bg-gradient-to-br from-white to-galavanteer-purple-light/10">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  System Delivered
                </Badge>
              </div>
              <CardTitle className="text-galavanteer-gray flex items-center gap-2">
                <Zap className="w-5 h-5 text-galavanteer-purple" />
                JordanOS
              </CardTitle>
              <CardDescription>
                A complete AI ecosystem tailored to Jordan's unique voice and business approach
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white/60 p-3 rounded-lg">
                    <div className="font-medium text-galavanteer-purple mb-1">Custom GPT</div>
                    <div className="text-galavanteer-gray/70">Personal reflection partner</div>
                  </div>
                  <div className="bg-white/60 p-3 rounded-lg">
                    <div className="font-medium text-galavanteer-purple mb-1">AI Boardroom</div>
                    <div className="text-galavanteer-gray/70">Strategic advisors</div>
                  </div>
                  <div className="bg-white/60 p-3 rounded-lg">
                    <div className="font-medium text-galavanteer-purple mb-1">Voice Capture</div>
                    <div className="text-galavanteer-gray/70">Authentic communication</div>
                  </div>
                  <div className="bg-white/60 p-3 rounded-lg">
                    <div className="font-medium text-galavanteer-purple mb-1">Implementation</div>
                    <div className="text-galavanteer-gray/70">Complete training</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Email */}
          <Card className="border-galavanteer-purple/20 shadow-lg bg-gradient-to-br from-white to-galavanteer-gray-light/20">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-5 h-5 text-galavanteer-purple" />
                <Badge variant="outline" className="bg-galavanteer-purple-light/50 text-galavanteer-purple border-galavanteer-purple/20">
                  Actual Delivery Email
                </Badge>
              </div>
              <CardTitle className="text-galavanteer-gray">Personal Delivery Note</CardTitle>
              <CardDescription>
                How I personally deliver each finished system to clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-galavanteer-gray-light/50 p-4 rounded-lg border-l-4 border-galavanteer-purple">
                  <p className="text-sm text-galavanteer-gray/90 italic leading-relaxed mb-3">"Jordan, your system is live. I've built something that doesn't just sound like you; it thinks like you."</p>
                  <p className="text-sm text-galavanteer-gray/90 italic leading-relaxed mb-3">
                    "The Custom GPT captures your direct, no-BS approach to helping clients cut through complexity. 
                    Your AI Boardroom assembles the exact perspectives you'd want: the skeptical CFO, the visionary CMO, the pragmatic ops lead."
                  </p>
                  <p className="text-sm text-galavanteer-gray/90 italic leading-relaxed font-medium">"This is your boardroom. Type 'menu' to get started."</p>
                </div>
                
                <div className="flex items-center gap-2 pt-2">
                  <div className="w-8 h-8 bg-galavanteer-purple-light/50 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-galavanteer-purple" />
                  </div>
                  <span className="text-xs text-galavanteer-gray/70 font-medium">
                    Personal touch in every delivery
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>;
};
export default JordanOSShowcase;