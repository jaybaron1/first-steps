
import React from "react";
import VideoSchema from '../VideoSchema';

const BottomCtaSection = () => (
  <section className="py-16 bg-gradient-to-br from-galavanteer-purple-light/40 to-white border-t border-galavanteer-purple/10">
    <VideoSchema 
      name="Galavanteer Interview with Lancelot Theobald Jr."
      description="Jason Baron discusses Galavanteer, custom AI assistants, and the movement to amplify human capabilities through voice-trained AI systems."
      duration="PT15M"
      uploadDate="2025-01-15"
      embedUrl="https://www.facebook.com/lancelot.theobald/videos/550978194208493"
      contentUrl="https://www.facebook.com/lancelot.theobald/videos/550978194208493"
      width="560"
      height="314"
    />
    <div className="container max-w-2xl mx-auto text-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-5 text-galavanteer-purple">See Galavanteer in Action</h2>
      <p className="mb-8 text-galavanteer-gray/90 text-lg">
        I was recently featured on a show with Lancelot Theobald, Jr. talking all about Galavanteer—what it is, who it's for, and the movement we're building together.
      </p>
      <div className="relative w-full overflow-hidden rounded-lg shadow-md mb-8" style={{paddingTop: "56.25%"}}>
        <iframe
          src="https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2Flancelot.theobald%2Fvideos%2F550978194208493%2F&show_text=false&width=560&t=0"
          width="560"
          height="314"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          allowFullScreen={true}
          title="Galavanteer Interview Video"
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
      {/* Removed "Watch the Interview" button as requested */}
    </div>
  </section>
);

export default BottomCtaSection;
