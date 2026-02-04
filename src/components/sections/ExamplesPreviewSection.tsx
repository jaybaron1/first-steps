
import React from 'react';
import Button from '@/components/Button';
import VideoSchema from '@/components/VideoSchema';
import IndividualReviewSchema from '@/components/IndividualReviewSchema';
import { ArrowRight } from 'lucide-react';

const ExamplesPreviewSection = () => {
  return (
    <section className="py-16 bg-galavanteer-gray-light" data-animate>
      <VideoSchema 
        name="Working with Galavanteer - Client Interview"
        description="See what it's like to work with Galavanteer. Real client interview showcasing the custom AI assistant development process and results."
        duration="PT10M"
        uploadDate="2025-01-20"
        embedUrl="https://www.facebook.com/lancelot.theobald/videos/1340406657193901"
        contentUrl="https://www.facebook.com/lancelot.theobald/videos/1340406657193901"
        width="560"
        height="314"
      />
      <VideoSchema 
        name="Brandon Gaydorus & Carl Michel Testimonial"
        description="Authors, Founders & Speakers Brandon Gaydorus and Carl Michel share their experience with Galavanteer's custom AI systems."
        duration="PT1M30S"
        uploadDate="2025-02-01"
        embedUrl="https://www.instagram.com/reel/DPAEdDAjQup/embed"
        contentUrl="https://www.instagram.com/reel/DPAEdDAjQup"
        width="1080"
        height="1920"
      />
      <IndividualReviewSchema
        reviewerName="Brandon Gaydorus"
        reviewerTitle="Author, Founder & Speaker"
        rating={5}
        reviewBody="One of the coolest things about what Jason does is he helps you become more efficient. So you can focus on the things that you need to be doing to grow your business instead of the things that are holding you back."
        datePublished="2025-02-01"
      />
      <IndividualReviewSchema
        reviewerName="Carl Michel"
        reviewerTitle="Author, Founder & Speaker"
        rating={5}
        reviewBody="Having a custom GPT is like having a virtual assistant. I'm able to get the thoughts out of my mind and have it structured in a way that is easy for me, but also in my own voice."
        datePublished="2025-02-01"
      />
      <IndividualReviewSchema 
        reviewerName="David Wood"
        reviewerTitle="Data Insights Analyst"
        rating={5}
        reviewBody="Jason didn't just answer questions — he equipped me with tools to solve them myself. His AI system helped me get up to speed in a completely new technical role 3x faster than traditional onboarding."
        datePublished="2025-01-25"
      />
      <IndividualReviewSchema 
        reviewerName="Celeste Moore"
        reviewerTitle="Luxury Image Strategist"
        rating={5}
        reviewBody="Honestly, I didn't know what a personalized chatbot was until Jason created one for me. I'm truly blown away not only by Jason but by what this system can do. Everyone needs one of these in their business."
        datePublished="2025-01-20"
      />
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-title mb-5 text-center">Real Voices. Real Wins.</h2>
          <p className="section-subtitle mb-10 text-center max-w-3xl mx-auto">
            You don't have to take our word for it – here's what it looks like when custom AI works in real life.
          </p>
          
          {/* Row 1: Video + Featured Testimonial */}
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            {/* Left Column: Video Embed */}
            <div className="flex flex-col">
              <div className="relative w-full overflow-hidden rounded-lg shadow-md mb-2" style={{paddingTop: "56.25%"}}>
                <iframe
                  src="https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2Flancelot.theobald%2Fvideos%2F1340406657193901%2F&show_text=false&width=560&t=0"
                  width="560"
                  height="314"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  allowFullScreen={true}
                  title="Client interview video"
                  loading="lazy"
                  style={{
                    border: "none",
                    overflow: "hidden",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%"
                  }}
                  scrolling="no"
                  frameBorder={0}
                />
              </div>
              <p className="text-sm text-galavanteer-gray/90 text-center">
                Watch what it's like to work with Galavanteer
              </p>
            </div>
            
            {/* Right Column: Brandon & Carl Video */}
            <div className="flex flex-col">
              <div className="relative w-full overflow-hidden rounded-lg shadow-md mb-2" style={{paddingTop: "56.25%"}}>
                <iframe
                  src="https://www.instagram.com/reel/DPAEdDAjQup/embed"
                  title="Brandon and Carl Instagram testimonial"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                  style={{
                    border: "none",
                    overflow: "hidden",
                    position: "absolute",
                    top: "-150%",
                    left: 0,
                    width: "100%",
                    height: "300%"
                  }}
                  scrolling="no"
                  frameBorder={0}
                />
              </div>
              <div>
                <p className="text-sm text-galavanteer-gray/70 text-center">
                  <strong>Carl Michel</strong> & <strong>Brandon Gaydorus:</strong> Authors, Founders & Speakers
                </p>
              </div>
            </div>
          </div>
          
          {/* Row 2: Additional Testimonials */}
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            {/* Left Block - David Wood */}
            <div className="bg-white p-6 rounded-lg border border-galavanteer-purple/10 shadow-sm">
              <p className="text-galavanteer-gray/90 italic mb-4">
                "Jason didn't just answer questions — he equipped me with tools to solve them myself. His AI system helped me get up to speed in a completely new technical role."
              </p>
              <p className="font-medium text-galavanteer-gray">– David Wood, Data Insights Analyst</p>
            </div>
            
            {/* Right Block - Celeste Testimonial */}
            <div className="bg-white p-6 rounded-lg border border-galavanteer-purple/10 shadow-sm flex flex-col justify-center">
              <p className="text-galavanteer-gray/90 italic mb-4">
                "Honestly, I didn't know what a personalized chatbot was until Jason created one for me. I'm truly blown away not only by Jason but by what this system can do. Everyone needs one of these in their business."
              </p>
              <p className="font-medium text-galavanteer-gray">– Celeste Moore, Luxury Image Strategist</p>
            </div>
          </div>
          
          {/* Optional CTA Below Testimonials */}
          <div className="text-center">
            <Button 
              variant="secondary" 
              href="/examples"
              className="flex items-center justify-center gap-2 mx-auto"
            >
              See More Client Examples <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExamplesPreviewSection;
