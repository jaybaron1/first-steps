import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
const AIBoardroomDemo = () => {
  return <div className="animate-fade-in h-auto min-h-[540px]">
      <div className="mb-4 md:mb-6">
        <span className="bg-galavanteer-purple-light/50 text-galavanteer-purple text-sm px-3 py-1 rounded-full">
          🏛️ Boardroom Showcase
        </span>
        <h3 className="text-lg md:text-xl font-bold mt-2 mb-1">Powered by Galavanteer</h3>
        <p className="text-galavanteer-gray/70 text-xs md:text-sm">
          Where Dialogue Becomes Deliverable
        </p>
      </div>
      
      <Card className="h-auto p-0 overflow-hidden border border-galavanteer-purple/20">
        <ScrollArea className="h-[400px] sm:h-[400px] md:h-[400px] pr-2 md:pr-4">
          <div className="space-y-6 md:space-y-8 mb-6 md:mb-8 p-4 md:p-5">
            {/* Live Scenario Block */}
            <div className="bg-galavanteer-gray-light/30 p-3 md:p-4 rounded-lg shadow-sm">
              <p className="font-medium mb-2 text-galavanteer-gray text-sm md:text-base">🎬 Live Scenario: Rebranding the "Subway Series"</p>
              <p className="text-galavanteer-gray/90 text-sm break-words px-1 sm:px-2">
                From Baseball Game to Cultural Movement
              </p>
              <p className="text-galavanteer-gray/90 text-sm break-words px-1 sm:px-2 mt-2">
                <span className="font-medium">👤 User Query:</span><br />
                "I'm sitting in a room with the Mets manager. We're trying to promote a Mets v. Yankees game. We're looking to rebrand the 'Subway Series' into something even more catchy. Who do we need to talk to figure this out?"
              </p>
            </div>
            
            {/* Initial Boardroom Lineup Block */}
            <div className="bg-galavanteer-gray-light/30 p-3 md:p-4 rounded-lg shadow-sm">
              <p className="font-medium mb-2 text-galavanteer-gray text-sm md:text-base">🧑‍🤝‍🧑 Initial Boardroom Lineup (Auto-Assembled by Objective)</p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-xs md:text-sm">
                  <thead>
                    <tr className="border-b border-galavanteer-gray/20">
                      <th className="text-left py-1 pr-2 font-medium text-galavanteer-gray">Name</th>
                      <th className="text-left py-1 pr-2 font-medium text-galavanteer-gray">Role</th>
                      <th className="text-left py-1 font-medium text-galavanteer-gray">Perspective</th>
                    </tr>
                  </thead>
                  <tbody className="text-galavanteer-gray/90">
                    <tr><td className="py-1 pr-2">Jason Baron</td><td className="py-1 pr-2">CEO</td><td className="py-1">Strategic conductor</td></tr>
                    <tr><td className="py-1 pr-2">Mets Manager</td><td className="py-1 pr-2">Baseball Operations</td><td className="py-1">Competitive pride, fan psychology</td></tr>
                    <tr><td className="py-1 pr-2">CMO</td><td className="py-1 pr-2">Marketing</td><td className="py-1">Brand voice, sponsor synergy</td></tr>
                    <tr><td className="py-1 pr-2">CRO</td><td className="py-1 pr-2">Revenue Focus</td><td className="py-1">Revenue opportunities, hype-to-conversion</td></tr>
                    <tr><td className="py-1 pr-2">CTO</td><td className="py-1 pr-2">Digital Experience</td><td className="py-1">App integrations, VR/AR, social</td></tr>
                    <tr><td className="py-1 pr-2">NYC Brand Historian</td><td className="py-1 pr-2">Cultural Specialist</td><td className="py-1">NY rivalries, iconography</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Live Agenda Tracker */}
            <div className="bg-galavanteer-purple-light/20 p-3 md:p-4 rounded-lg shadow-sm">
              <p className="font-medium mb-2 text-galavanteer-purple text-sm md:text-base">📋 Live Agenda Tracker</p>
              
              <div className="bg-white/70 p-2 md:p-3 rounded-md mb-4 md:mb-5 border border-galavanteer-purple/10">
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs md:text-sm">
                    <span className="text-galavanteer-gray/90">1. Subway Series Rebrand Ideation</span>
                    <span className="text-galavanteer-purple">🔄 In Progress</span>
                  </div>
                  <div className="flex justify-between items-center text-xs md:text-sm">
                    <span className="text-galavanteer-gray/90">2. Stakeholder Map (Who Needs to Be at the Table?)</span>
                    <span className="text-galavanteer-purple">🔄 In Progress</span>
                  </div>
                  <div className="flex justify-between items-center text-xs md:text-sm">
                    <span className="text-galavanteer-gray/90">3. Market & Fan Reaction Forecasting</span>
                    <span className="text-galavanteer-gray/60">⏳ Optional</span>
                  </div>
                </div>
              </div>
              
              <p className="font-medium text-galavanteer-purple text-sm break-words px-1 sm:px-2 mb-3">🧠 Full Simulation Transcript</p>
              
              {/* Receptionist Opening */}
              <div className="mb-3 bg-white/50 p-2 rounded-md border border-galavanteer-purple/10">
                <p className="font-medium text-galavanteer-gray text-sm break-words mb-1">🎤 Receptionist (Moderator):</p>
                <p className="text-galavanteer-gray/90 text-sm break-words px-1 sm:px-2">
                  "Let's begin. Jason, you're joined today by core stakeholders to reimagine the brand identity of the Mets vs. Yankees rivalry. We're exploring how to elevate the 'Subway Series' into something with fresh magnetism for fans, sponsors, and digital campaigns."
                </p>
              </div>
              
              {/* Mets Manager */}
              <div className="mb-3 bg-white/50 p-2 rounded-md border border-galavanteer-purple/10">
                <p className="font-medium text-galavanteer-gray text-sm break-words mb-1">⚾ Mets Manager:</p>
                <p className="text-galavanteer-gray/90 text-sm break-words px-1 sm:px-2">
                  "'Subway Series' is historic... but stale. Doesn't light up a 20-year-old's Instagram. We need a name that makes Queens vs. Bronx feel like Avengers vs. X-Men. Same city — two worlds."
                </p>
              </div>
              
              {/* CMO */}
              <div className="mb-3 bg-white/50 p-2 rounded-md border border-galavanteer-purple/10">
                <p className="font-medium text-galavanteer-gray text-sm break-words mb-1">🎨 CMO – Sports & Culture:</p>
                <p className="text-galavanteer-gray/90 text-sm break-words px-1 sm:px-2">
                  "The brand must hit across demographics: legacy fans, TikTok teens, and corporate sponsors. 'Subway' roots it in NY, but it's also... utilitarian. Not iconic. We want emotion, not infrastructure. Jason, do we explore radical renaming or evolutionary branding? 'Empire Clash' vs. 'Subway Showdown 2.0'?"
                </p>
              </div>
              
              {/* CRO */}
              <div className="mb-3 bg-white/50 p-2 rounded-md border border-galavanteer-purple/10">
                <p className="font-medium text-galavanteer-gray text-sm break-words mb-1">💰 CRO – Revenue:</p>
                <p className="text-galavanteer-gray/90 text-sm break-words px-1 sm:px-2">
                  "If this becomes merch, we're golden. Rivalry packs. Sponsor-ready drops. The name needs to convert excitement into spend."
                </p>
              </div>
              
              {/* Historian */}
              <div className="mb-3 bg-white/50 p-2 rounded-md border border-galavanteer-purple/10">
                <p className="font-medium text-galavanteer-gray text-sm break-words mb-1">🧠 Historian:</p>
                <p className="text-galavanteer-gray/90 text-sm break-words px-1 sm:px-2">
                  "'Subway Series' is cultural bedrock. But NY is more than trains now. Think borough pride, post-COVID rebirth, intergenerational fire."
                </p>
              </div>
              
              {/* CTO */}
              <div className="mb-3 bg-white/50 p-2 rounded-md border border-galavanteer-purple/10">
                <p className="font-medium text-galavanteer-gray text-sm break-words mb-1">🧑‍💻 CTO – Fan Tech Lead:</p>
                <p className="text-galavanteer-gray/90 text-sm break-words px-1 sm:px-2">
                  "Name must be short. Punchy. Hashtag-ready. AR filters. Instant recall. Think in 15-character limits."
                </p>
              </div>
              
              {/* Jason's Decision */}
              <div className="mb-3 bg-white/50 p-2 rounded-md border border-galavanteer-purple/10">
                <p className="font-medium text-galavanteer-gray text-sm break-words mb-1">✅ Jason's Call:</p>
                <p className="text-galavanteer-gray/90 text-sm break-words px-1 sm:px-2">
                  "Let's go straight into naming ideation."
                </p>
              </div>
              
              {/* Naming Sprint */}
              <div className="mb-3 bg-galavanteer-gray-light/20 p-2 rounded-md border border-galavanteer-purple/10">
                <p className="font-medium text-galavanteer-purple text-sm break-words mb-2">🔤 Naming Sprint: Round 1</p>
                
                <div className="mb-2">
                  <p className="font-medium text-galavanteer-gray text-xs mb-1">🎨 CMO Proposes:</p>
                  <div className="text-xs text-galavanteer-gray/90 ml-2">
                    <p>• The Borough Brawl</p>
                    <p>• City Divide</p>
                    <p>• CrossTown Crown</p>
                    <p>• Gotham Clash</p>
                    <p>• 7-Line Showdown</p>
                  </div>
                </div>
                
                <div className="text-xs text-galavanteer-gray/90 space-y-1">
                  <p><span className="font-medium">⚾ Mets Manager:</span> "7-Line is a deep cut. But Borough Brawl hits hard."</p>
                  <p><span className="font-medium">💰 CRO:</span> "'Gotham Clash' will print. It'll move merch."</p>
                  <p><span className="font-medium">🧠 Historian:</span> "Also consider: Empire Rumble, NYC Civil Series, Concrete Clash."</p>
                </div>
              </div>
              
              {/* Final Framework */}
              <div className="bg-white/50 p-2 rounded-md border border-galavanteer-purple/10">
                <p className="font-medium text-galavanteer-purple text-sm break-words mb-2">🎯 Audience-Tiered Naming Framework (Finalized):</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-galavanteer-gray/20">
                        <th className="text-left py-1 pr-2">Layer</th>
                        <th className="text-left py-1 pr-2">Name</th>
                        <th className="text-left py-1 pr-2">Audience</th>
                        <th className="text-left py-1">Use Case</th>
                      </tr>
                    </thead>
                    <tbody className="text-galavanteer-gray/90">
                      <tr><td className="py-1 pr-2">Master Brand</td><td className="py-1 pr-2">City Clash</td><td className="py-1 pr-2">Press, League</td><td className="py-1">Official narrative</td></tr>
                      <tr><td className="py-1 pr-2">Street Brand</td><td className="py-1 pr-2">Borough Brawl</td><td className="py-1 pr-2">Gen Z, Teachers</td><td className="py-1">Civic energy, chantable</td></tr>
                      <tr><td className="py-1 pr-2">Legacy Brand</td><td className="py-1 pr-2">Subway Series</td><td className="py-1 pr-2">Boomers</td><td className="py-1">Tradition & continuity</td></tr>
                      <tr><td className="py-1 pr-2">Campaign Line</td><td className="py-1 pr-2">One City. Two Empires.</td><td className="py-1 pr-2">Sponsors</td><td className="py-1">Emotional resonance</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-galavanteer-purple mt-2 font-medium">✅ Jason's Final Selection: "Borough Brawl" becomes the campaign's public-facing social identity.</p>
              </div>
            </div>
            
            {/* Outputs Block */}
            <div className="bg-white p-3 md:p-4 rounded-lg border border-galavanteer-purple/10 shadow-sm">
              <p className="font-medium mb-2 text-galavanteer-purple text-sm break-words">🔷 Outputs from This Session:</p>
              
              <div className="mb-4">
                <p className="font-medium text-galavanteer-gray text-sm mb-2">📅 Social Media Content Calendar (Teacher-Led Campaign):</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border border-galavanteer-gray/20 rounded">
                    <thead>
                      <tr className="bg-galavanteer-gray-light/30">
                        <th className="text-left py-1 px-2 border-r border-galavanteer-gray/20">Week</th>
                        <th className="text-left py-1 px-2 border-r border-galavanteer-gray/20">Theme</th>
                        <th className="text-left py-1 px-2 border-r border-galavanteer-gray/20">Caption Sample</th>
                        <th className="text-left py-1 px-2">Hashtag</th>
                      </tr>
                    </thead>
                    <tbody className="text-galavanteer-gray/90">
                      <tr><td className="py-1 px-2 border-r border-galavanteer-gray/20">1</td><td className="py-1 px-2 border-r border-galavanteer-gray/20">Announce</td><td className="py-1 px-2 border-r border-galavanteer-gray/20">"NYC's biggest rivalry. Teachers = Captains."</td><td className="py-1 px-2">#BoroughBrawl</td></tr>
                      <tr><td className="py-1 px-2 border-r border-galavanteer-gray/20">2</td><td className="py-1 px-2 border-r border-galavanteer-gray/20">Borough Pride</td><td className="py-1 px-2 border-r border-galavanteer-gray/20">"Queens vs. Bronx. Who ya got?"</td><td className="py-1 px-2">#QueensVsBronx</td></tr>
                      <tr><td className="py-1 px-2 border-r border-galavanteer-gray/20">3</td><td className="py-1 px-2 border-r border-galavanteer-gray/20">History</td><td className="py-1 px-2 border-r border-galavanteer-gray/20">"Turn baseball into a lesson plan."</td><td className="py-1 px-2">#SubwaySeries</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="font-medium text-galavanteer-gray text-sm mb-2">⚙️ Campaign Automation Stack:</p>
                <ul className="text-xs text-galavanteer-gray/90 space-y-1 ml-4 list-disc">
                  <li>Later / Hootsuite: Auto-scheduling, visual planner</li>
                  <li>Predis.ai: Captions, image generation</li>
                  <li>ReplyRush / LinkDM: Auto-comments, DM triggers</li>
                  <li>Airtable / Google Sheets: Content review & tracking dashboard</li>
                </ul>
              </div>
              
              <ul className="text-xs md:text-sm text-galavanteer-gray/90 space-y-2 ml-2 sm:ml-3 md:ml-4 list-disc pr-2 sm:pr-3 md:pr-4">
                <li className="break-words pb-1">✅ Demo Script: Tailored to engineering-focused SaaS buyers</li>
                <li className="break-words pb-1">✅ Competitive Battlecard: Against TermWiki Pro, GlossaryTech, Lexeri</li>
                <li className="break-words pb-1">✅ Pricing Proposal: Mid-tier "Business" plan with strategic consultation</li>
                <li className="break-words pb-1">⚠️ Open Risk Logged: No Confluence plugin (flagged for roadmap)</li>
              </ul>
            </div>
          </div>

        </ScrollArea>
      </Card>
      
      <div className="mt-4 md:mt-6">
        <div className="text-center mb-4">
          <p className="text-xs md:text-sm text-galavanteer-gray/70 mb-4">This is a simulation of how an AI Boardroom works.</p>
        </div>
        
        <div className="bg-galavanteer-purple-light/20 p-4 md:p-6 rounded-xl border border-galavanteer-purple/10">
          <p className="text-center text-sm md:text-base text-galavanteer-purple font-medium mb-4">🔷 The Value of AI Boardroom</p>
          <ul className="text-xs md:text-sm text-galavanteer-gray/90 space-y-3 ml-2 sm:ml-3 md:ml-4 list-disc pr-2 sm:pr-3 md:pr-4">
            <li className="break-words">✅ Multi-Perspective Simulation: Get insights from marketing, tech, finance, product, and culture — all live</li>
            <li className="break-words">🧠 Structured Strategy Frameworks: Moves naturally from vision → discussion → decision → deliverables</li>
            <li className="break-words">📈 No Consulting Fees, No Scheduling Lag: High-level expertise, always available — without the cost or calendar friction</li>
            <li className="break-words">🕒 Real-Time Problem Solving: From brand strategy to automation workflows — all in one session</li>
          </ul>
        </div>
      </div>
    </div>;
};
export default AIBoardroomDemo;