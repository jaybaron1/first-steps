import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
const CustomGPTDemo = () => {
  return <div className="animate-fade-in h-auto min-h-[540px]">
      <div className="mb-4 md:mb-6">
        <span className="bg-galavanteer-purple-light/50 text-galavanteer-purple text-sm px-3 py-1 rounded-full">
          Custom GPT Demo
        </span>
        <h3 className="text-lg md:text-xl font-bold mt-2 mb-1">👑 King Carl's Throne Room</h3>
        <p className="text-galavanteer-gray/70 text-xs md:text-sm break-words">
          A personal GPT that channels your own frameworks and thinking style
        </p>
      </div>
      
      <Card className="h-auto p-0 overflow-hidden border border-galavanteer-purple/20">
        <ScrollArea className="h-[400px] sm:h-[400px] md:h-[400px] pr-2 md:pr-4">
          <div className="space-y-6 md:space-y-8 mb-6 md:mb-8 p-4 md:p-5">
            {/* Live Scenario Block */}
            <div className="bg-galavanteer-gray-light/30 p-3 md:p-4 rounded-lg shadow-sm">
              <p className="font-medium mb-2 text-galavanteer-gray text-sm md:text-base">🎬 Live Scenario: TEDx Talk Development</p>
              <p className="text-galavanteer-gray/90 text-sm break-words px-1 sm:px-2">
                From Blank Page to Stage-Ready Speech
              </p>
              <p className="text-galavanteer-gray/90 text-sm break-words px-1 sm:px-2 mt-2">
                <span className="font-medium">👤 Carl's Request:</span><br />
                "Aight, so I just got this TEDx invite. Ten minutes max. I want it to hit, but I don't wanna sound like I'm reading a script. Where do I start?"
              </p>
            </div>
            
            {/* GPT Response */}
            <div className="bg-galavanteer-purple-light/20 p-3 md:p-4 rounded-lg shadow-sm">
              <p className="font-medium mb-2 text-galavanteer-purple text-sm md:text-base">King Carl's Throne Room:</p>
              <div className="bg-white/70 p-2 md:p-3 rounded-md mb-4 border border-galavanteer-purple/10">
                <p className="text-galavanteer-gray/90 text-sm break-words px-1 sm:px-2">
                  "Congrats, King. TEDx is all about transformation. Point A to Point B. Where they are, where you want them to be. So tell me — what's the one story you know has to make it in?"
                </p>
              </div>
            </div>

            {/* Carl's Story Foundation */}
            <div className="bg-galavanteer-gray-light/30 p-3 md:p-4 rounded-lg shadow-sm">
              <div className="border-l-2 border-galavanteer-gray/40 pl-2 sm:pl-3">
                <p className="font-medium mb-1 text-galavanteer-gray text-sm md:text-base">Carl:</p>
                <p className="text-galavanteer-gray/90 text-sm break-words px-1 sm:px-2">
                  "My childhood. Haiti. Stamford. Thirteen people in three bedrooms. The steps with the dealers. That's where I gotta start. That's my foundation."
                </p>
              </div>
            </div>

            {/* GPT Guidance on Pacing */}
            <div className="bg-galavanteer-purple-light/20 p-3 md:p-4 rounded-lg shadow-sm">
              <p className="font-medium mb-2 text-galavanteer-purple text-sm md:text-base">King Carl's Throne Room:</p>
              <div className="bg-white/70 p-2 md:p-3 rounded-md mb-4 border border-galavanteer-purple/10">
                <p className="text-galavanteer-gray/90 text-sm break-words px-1 sm:px-2">
                  "Facts, that's your hook. But if you sit in it too long, they'll leave with sympathy instead of shift. TEDx isn't testimony time, it's transformation time. Two minutes to paint your world, then flip it: 'What are your steps?' That's how you pull them in."
                </p>
              </div>
            </div>

            {/* Carl's Concern */}
            <div className="bg-galavanteer-gray-light/30 p-3 md:p-4 rounded-lg shadow-sm">
              <div className="border-l-2 border-galavanteer-gray/40 pl-2 sm:pl-3">
                <p className="font-medium mb-1 text-galavanteer-gray text-sm md:text-base">Carl:</p>
                <p className="text-galavanteer-gray/90 text-sm break-words px-1 sm:px-2">
                  "Yeah but if I cut it short, I lose the grit. The rawness is what makes me real."
                </p>
              </div>
            </div>

            {/* GPT Structure Guidance */}
            <div className="bg-galavanteer-purple-light/20 p-3 md:p-4 rounded-lg shadow-sm">
              <p className="font-medium mb-2 text-galavanteer-purple text-sm md:text-base">King Carl's Throne Room:</p>
              <div className="bg-white/70 p-2 md:p-3 rounded-md mb-4 border border-galavanteer-purple/10">
                <p className="text-galavanteer-gray/90 text-sm break-words px-1 sm:px-2">
                  "You keep the grit, you just pace it. Raw story in the open, then pivot. Otherwise, it's a movie about you instead of a message for them. Three big lessons carry the rest: Find Your Voice. Filter the Noise. Lead Anyway. And the close? Legacy. That's your mic drop."
                </p>
              </div>
            </div>

            {/* Carl Wants to Build */}
            <div className="bg-galavanteer-gray-light/30 p-3 md:p-4 rounded-lg shadow-sm">
              <div className="border-l-2 border-galavanteer-gray/40 pl-2 sm:pl-3">
                <p className="font-medium mb-1 text-galavanteer-gray text-sm md:text-base">Carl:</p>
                <p className="text-galavanteer-gray/90 text-sm break-words px-1 sm:px-2">
                  "Alright, but let's build it like I'd actually say it. No outline. Talk it out."
                </p>
              </div>
            </div>

            {/* GPT Drafts Opening */}
            <div className="bg-galavanteer-purple-light/20 p-3 md:p-4 rounded-lg shadow-sm">
              <p className="font-medium mb-2 text-galavanteer-purple text-sm md:text-base">King Carl's Throne Room (Drafting Speech):</p>
              <div className="bg-white p-2 md:p-3 rounded-md mb-4 border border-galavanteer-purple/10">
                <p className="text-galavanteer-gray/90 text-sm break-words px-1 sm:px-2 italic">
                  "Good evening. I was born in Port-au-Prince, Haiti. By the time I was three years old, I was in Stamford, Connecticut. We had thirteen people in a three-bedroom apartment. That's not an exaggeration. Kitchen never quiet. Somebody always on the couch. Privacy didn't exist. And outside — a different kind of noise. The steps. And on those steps were the drug dealers. They had the cars. The chains. The respect. At ten years old, I thought that was success."
                </p>
              </div>
            </div>

            {/* Carl Requests More Detail */}
            <div className="bg-galavanteer-gray-light/30 p-3 md:p-4 rounded-lg shadow-sm">
              <div className="border-l-2 border-galavanteer-gray/40 pl-2 sm:pl-3">
                <p className="font-medium mb-1 text-galavanteer-gray text-sm md:text-base">Carl:</p>
                <p className="text-galavanteer-gray/90 text-sm break-words px-1 sm:px-2">
                  "Pause. Stretch that. I want them to feel the chaos. The smells, the sounds, the weight of it."
                </p>
              </div>
            </div>

            {/* GPT Expands the Scene */}
            <div className="bg-galavanteer-purple-light/20 p-3 md:p-4 rounded-lg shadow-sm">
              <p className="font-medium mb-2 text-galavanteer-purple text-sm md:text-base">King Carl's Throne Room (Revised Speech):</p>
              <div className="bg-white p-2 md:p-3 rounded-md mb-4 border border-galavanteer-purple/10">
                <p className="text-galavanteer-gray/90 text-sm break-words px-1 sm:px-2 italic">
                  "Thirteen people in a three-bedroom. Imagine that. You wake up, and there's a cousin on the floor, an uncle in the kitchen, aunties arguing about groceries. The TV blasting, the phone ringing, pots clanging, kids crying. No space. No silence. Just pressure. And then you step outside. Different kind of noise. The streets buzzing. Dealers posted on the steps like kings of the block. Every kid looked at them and thought, 'That's the life.' And so did I. At ten years old, I thought that was success."
                </p>
              </div>
            </div>

            {/* Carl Approves and Pivots */}
            <div className="bg-galavanteer-gray-light/30 p-3 md:p-4 rounded-lg shadow-sm">
              <div className="border-l-2 border-galavanteer-gray/40 pl-2 sm:pl-3">
                <p className="font-medium mb-1 text-galavanteer-gray text-sm md:text-base">Carl:</p>
                <p className="text-galavanteer-gray/90 text-sm break-words px-1 sm:px-2">
                  "Yeah, that's it. Now flip it to them."
                </p>
              </div>
            </div>

            {/* GPT Adds Audience Engagement */}
            <div className="bg-galavanteer-purple-light/20 p-3 md:p-4 rounded-lg shadow-sm">
              <p className="font-medium mb-2 text-galavanteer-purple text-sm md:text-base">King Carl's Throne Room (Speech):</p>
              <div className="bg-white p-2 md:p-3 rounded-md mb-4 border border-galavanteer-purple/10">
                <p className="text-galavanteer-gray/90 text-sm break-words px-1 sm:px-2 italic">
                  "But let me ask you… what are your steps? Who stood in your life shaping what you thought was cool, shaping what you thought was possible?"
                </p>
              </div>
            </div>

            {/* Carl Builds Key Lesson */}
            <div className="bg-galavanteer-gray-light/30 p-3 md:p-4 rounded-lg shadow-sm">
              <div className="border-l-2 border-galavanteer-gray/40 pl-2 sm:pl-3">
                <p className="font-medium mb-1 text-galavanteer-gray text-sm md:text-base">Carl:</p>
                <p className="text-galavanteer-gray/90 text-sm break-words px-1 sm:px-2">
                  "Good. Now bring in the first key — finding your voice."
                </p>
              </div>
            </div>

            {/* GPT Crafts Voice Section */}
            <div className="bg-galavanteer-purple-light/20 p-3 md:p-4 rounded-lg shadow-sm">
              <p className="font-medium mb-2 text-galavanteer-purple text-sm md:text-base">King Carl's Throne Room (Speech):</p>
              <div className="bg-white p-2 md:p-3 rounded-md mb-4 border border-galavanteer-purple/10">
                <p className="text-galavanteer-gray/90 text-sm break-words px-1 sm:px-2 italic">
                  "I used to be the quiet kid in the back of class. Safe in silence. Invisible. But silence was costing me. The first time I spoke up, my hands were shaking. My voice cracked. But the room got still. And I realized something: the moment you use your voice, people lean in. That was my turning point. I started telling kids like me: 'It's cool to be smart. It's okay to stand out.' And I'll tell you the same thing now. Your voice is not a weakness. Your voice is your weapon. The world doesn't change when you hide it. It changes when you use it."
                </p>
              </div>
            </div>

            {/* Carl Wants More Story */}
            <div className="bg-galavanteer-gray-light/30 p-3 md:p-4 rounded-lg shadow-sm">
              <div className="border-l-2 border-galavanteer-gray/40 pl-2 sm:pl-3">
                <p className="font-medium mb-1 text-galavanteer-gray text-sm md:text-base">Carl:</p>
                <p className="text-galavanteer-gray/90 text-sm break-words px-1 sm:px-2">
                  "That lands. But give me more story. Like an actual scene — me in the classroom, me breaking the silence."
                </p>
              </div>
            </div>

            {/* GPT Expands with Scene */}
            <div className="bg-galavanteer-purple-light/20 p-3 md:p-4 rounded-lg shadow-sm">
              <p className="font-medium mb-2 text-galavanteer-purple text-sm md:text-base">King Carl's Throne Room (Expanded Speech):</p>
              <div className="bg-white p-2 md:p-3 rounded-md mb-4 border border-galavanteer-purple/10">
                <p className="text-galavanteer-gray/90 text-sm break-words px-1 sm:px-2 italic">
                  "I remember being in class, maybe seventh grade. The teacher asked a question, and I knew the answer. But I kept my head down. I didn't want to be seen as the smart kid. I didn't want to be clowned. But something in me said, 'Say it.' So I raised my hand. Voice cracking, heart racing. I got the answer right. And instead of laughs, I got respect. That day I learned something: your voice opens doors your silence never will."
                </p>
              </div>
            </div>

            {/* Carl Moves to Filtering */}
            <div className="bg-galavanteer-gray-light/30 p-3 md:p-4 rounded-lg shadow-sm">
              <div className="border-l-2 border-galavanteer-gray/40 pl-2 sm:pl-3">
                <p className="font-medium mb-1 text-galavanteer-gray text-sm md:text-base">Carl:</p>
                <p className="text-galavanteer-gray/90 text-sm break-words px-1 sm:px-2">
                  "Aight, solid. Let's move to filtering the noise. But I want a real story — like me turning down something flashy because it didn't fit."
                </p>
              </div>
            </div>

            {/* GPT Filtering Section */}
            <div className="bg-galavanteer-purple-light/20 p-3 md:p-4 rounded-lg shadow-sm">
              <p className="font-medium mb-2 text-galavanteer-purple text-sm md:text-base">King Carl's Throne Room (Speech):</p>
              <div className="bg-white p-2 md:p-3 rounded-md mb-4 border border-galavanteer-purple/10">
                <p className="text-galavanteer-gray/90 text-sm break-words px-1 sm:px-2 italic">
                  "Here's the next thing I had to learn. Not every opportunity is your opportunity. See, I've been offered stages that looked good, gigs that paid well, people saying, 'This is your shot.' But deep down, I knew it wasn't aligned. So I built a filter. Three words: Impact. Alignment. Capacity. Does it impact the people I'm here to serve? Does it align with my bigger vision? Do I have the capacity to do it without burning out? If it hit all three, I said yes. If not, I said no. And no is a full sentence."
                </p>
              </div>
            </div>

            {/* Carl Wants More Weight */}
            <div className="bg-galavanteer-gray-light/30 p-3 md:p-4 rounded-lg shadow-sm">
              <div className="border-l-2 border-galavanteer-gray/40 pl-2 sm:pl-3">
                <p className="font-medium mb-1 text-galavanteer-gray text-sm md:text-base">Carl:</p>
                <p className="text-galavanteer-gray/90 text-sm break-words px-1 sm:px-2">
                  "Yeah, but add weight. Tell the story of saying no to something that looked like a big break."
                </p>
              </div>
            </div>

            {/* GPT Expanded Filtering Story */}
            <div className="bg-galavanteer-purple-light/20 p-3 md:p-4 rounded-lg shadow-sm">
              <p className="font-medium mb-2 text-galavanteer-purple text-sm md:text-base">King Carl's Throne Room (Expanded Speech):</p>
              <div className="bg-white p-2 md:p-3 rounded-md mb-4 border border-galavanteer-purple/10">
                <p className="text-galavanteer-gray/90 text-sm break-words px-1 sm:px-2 italic">
                  "I remember when I got invited to an event that looked huge. Big stage, big names, cameras everywhere. It was the kind of event that makes you feel like you 'made it.' But here's the truth: it wasn't for the youth. It wasn't aligned with my mission. And if I said yes, I'd be drained, distracted, and disconnected from why I started. So I said no. And that no made space for a yes that mattered. A week later, a school called. One hundred students. No cameras, no big checks. But that talk changed lives. That's the power of a filter. It saves you from chasing what looks good, so you can focus on what is good."
                </p>
              </div>
            </div>

            {/* Carl Last Key */}
            <div className="bg-galavanteer-gray-light/30 p-3 md:p-4 rounded-lg shadow-sm">
              <div className="border-l-2 border-galavanteer-gray/40 pl-2 sm:pl-3">
                <p className="font-medium mb-1 text-galavanteer-gray text-sm md:text-base">Carl:</p>
                <p className="text-galavanteer-gray/90 text-sm break-words px-1 sm:px-2">
                  "That's the meat. Now the last key — lead anyway. Make it about choosing yourself."
                </p>
              </div>
            </div>

            {/* GPT Leadership Section */}
            <div className="bg-galavanteer-purple-light/20 p-3 md:p-4 rounded-lg shadow-sm">
              <p className="font-medium mb-2 text-galavanteer-purple text-sm md:text-base">King Carl's Throne Room (Speech):</p>
              <div className="bg-white p-2 md:p-3 rounded-md mb-4 border border-galavanteer-purple/10">
                <p className="text-galavanteer-gray/90 text-sm break-words px-1 sm:px-2 italic">
                  "I wasn't born a leader. Nobody handed me that title. But leadership isn't about being chosen. Leadership is about choosing yourself. Choosing to stand up even when nobody claps. Choosing to lift others even when you're still climbing. Choosing to do the right thing even when it's not popular. That's leadership. And you don't need permission to walk in it."
                </p>
              </div>
            </div>

            {/* Carl Wants Leadership Story */}
            <div className="bg-galavanteer-gray-light/30 p-3 md:p-4 rounded-lg shadow-sm">
              <div className="border-l-2 border-galavanteer-gray/40 pl-2 sm:pl-3">
                <p className="font-medium mb-1 text-galavanteer-gray text-sm md:text-base">Carl:</p>
                <p className="text-galavanteer-gray/90 text-sm break-words px-1 sm:px-2">
                  "Solid, but give them a story. Like me mentoring kids when I barely had it together myself."
                </p>
              </div>
            </div>

            {/* GPT Expanded Leadership Story */}
            <div className="bg-galavanteer-purple-light/20 p-3 md:p-4 rounded-lg shadow-sm">
              <p className="font-medium mb-2 text-galavanteer-purple text-sm md:text-base">King Carl's Throne Room (Expanded Speech):</p>
              <div className="bg-white p-2 md:p-3 rounded-md mb-4 border border-galavanteer-purple/10">
                <p className="text-galavanteer-gray/90 text-sm break-words px-1 sm:px-2 italic">
                  "I'll never forget mentoring a group of students at a time when I was still figuring my own life out. I didn't have all the answers. I wasn't sure if I was qualified. But I showed up anyway. And that day, one of the students said, 'I've never had someone believe in me like this.' That's when I realized — leadership is not about being perfect. It's about being present. You don't wait until you 'arrive' to lead. You lead anyway."
                </p>
              </div>
            </div>

            {/* Carl Close Request */}
            <div className="bg-galavanteer-gray-light/30 p-3 md:p-4 rounded-lg shadow-sm">
              <div className="border-l-2 border-galavanteer-gray/40 pl-2 sm:pl-3">
                <p className="font-medium mb-1 text-galavanteer-gray text-sm md:text-base">Carl:</p>
                <p className="text-galavanteer-gray/90 text-sm break-words px-1 sm:px-2">
                  "That's the heartbeat. Now close it. Nipsey, then legacy."
                </p>
              </div>
            </div>

            {/* GPT Closing */}
            <div className="bg-galavanteer-purple-light/20 p-3 md:p-4 rounded-lg shadow-sm">
              <p className="font-medium mb-2 text-galavanteer-purple text-sm md:text-base">King Carl's Throne Room (Closing Speech):</p>
              <div className="bg-white p-2 md:p-3 rounded-md mb-4 border border-galavanteer-purple/10">
                <p className="text-galavanteer-gray/90 text-sm break-words px-1 sm:px-2 italic">
                  "The late Nipsey Hussle once said, 'You can have it all, it's about your reason why.' And my reason why is legacy. Not clout. Not likes. Not applause. Legacy. My kids. Their kids. And the students I may never meet, but who will feel the ripple. So I leave you with this. Find your voice. Filter the noise. Lead anyway. Because when you do, you won't just change your life. You'll change the lives of everyone watching you."
                </p>
              </div>
            </div>

            {/* Final Exchange */}
            <div className="bg-galavanteer-gray-light/30 p-3 md:p-4 rounded-lg shadow-sm">
              <div className="border-l-2 border-galavanteer-gray/40 pl-2 sm:pl-3">
                <p className="font-medium mb-1 text-galavanteer-gray text-sm md:text-base">Carl:</p>
                <p className="text-galavanteer-gray/90 text-sm break-words px-1 sm:px-2">
                  "Yeah… that's it. That's my talk. Not just words on a page. That's me, alive on stage."
                </p>
              </div>
            </div>
            
            {/* Outputs Block */}
            <div className="bg-white p-3 md:p-4 rounded-lg border border-galavanteer-purple/10 shadow-sm">
              <p className="font-medium mb-2 text-galavanteer-purple text-sm break-words">🔷 Outputs from This Session:</p>
              
              <div className="mb-4">
                <p className="font-medium text-galavanteer-gray text-sm mb-2">📝 Speech Outline & Structure:</p>
                <ul className="text-xs text-galavanteer-gray/90 space-y-1 ml-4 list-disc">
                  <li>Opening: Raw personal story (2 min) - Haiti to Stamford, thirteen in three bedrooms</li>
                  <li>Pivot: Audience engagement - "What are YOUR steps?"</li>
                  <li>Lesson 1: Finding Your Voice - classroom story, breaking silence</li>
                  <li>Lesson 2: Filter the Noise - staying authentic in pressure</li>
                  <li>Lesson 3: Lead Anyway - legacy-focused close</li>
                </ul>
              </div>
              
              <div className="mb-4">
                <p className="font-medium text-galavanteer-gray text-sm mb-2">🎤 Key Phrases & Delivery Notes:</p>
                <ul className="text-xs text-galavanteer-gray/90 space-y-1 ml-4 list-disc">
                  <li>"What are your steps?" - pause for effect, scan the room</li>
                  <li>"Thirteen people in a three-bedroom. Imagine that." - descriptive immersion</li>
                  <li>"Voice cracking, heart racing... and I got respect." - vulnerability as strength</li>
                </ul>
              </div>
              
              <ul className="text-xs md:text-sm text-galavanteer-gray/90 space-y-2 ml-2 sm:ml-3 md:ml-4 list-disc pr-2 sm:pr-3 md:pr-4">
                <li className="break-words pb-1">✅ Complete 10-minute speech draft in Carl's authentic voice</li>
                <li className="break-words pb-1">✅ Pacing guidance: Where to slow down, speed up, pause</li>
                <li className="break-words pb-1">✅ Audience engagement moments built throughout</li>
                <li className="break-words pb-1">✅ Emotional arc: Raw story → Universal lesson → Legacy call</li>
              </ul>
            </div>
          </div>
        </ScrollArea>
      </Card>
      
      <div className="mt-4 md:mt-6">
        <div className="text-center mb-4">
          <p className="text-xs md:text-sm text-galavanteer-gray/70 mb-4">This is a simulation of how a Custom GPT works.</p>
        </div>
        
        <div className="bg-galavanteer-purple-light/20 p-4 md:p-6 rounded-xl border border-galavanteer-purple/10">
          <p className="text-center text-sm md:text-base text-galavanteer-purple font-medium mb-4">🔷 The Value of a Custom GPT</p>
          <ul className="text-xs md:text-sm text-galavanteer-gray/90 space-y-3 ml-2 sm:ml-3 md:ml-4 list-disc pr-2 sm:pr-3 md:pr-4">
            <li className="break-words">✅ Reflects Your Unique Voice: Channels your vocabulary, frameworks, and authentic thinking patterns</li>
            <li className="break-words">🧠 Personalized Guidance: Creates solutions tailored to your specific challenges and style</li>
            <li className="break-words">📈 Your Best Self, Enhanced: Provides wisdom that feels like you — refined and amplified</li>
            <li className="break-words">🕒 Breaks Creative Blocks: Helps you move past sticking points using your own enhanced wisdom</li>
          </ul>
        </div>
      </div>
    </div>;
};
export default CustomGPTDemo;