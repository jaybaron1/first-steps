import { useState } from 'react';
import { ArrowRight, CheckCircle2, AlertCircle, Mail, Globe, Building2, MapPin } from 'lucide-react';
import {
  trackScorecardSubmit,
  trackScorecardResultView,
  trackBookCallClick,
  calculateScorecardResults,
  getStoredAttribution,
  type ScorecardSubmission,
} from '@/lib/marketingTracking';

const businessTypes = [
  { value: '', label: 'Select your business type' },
  { value: 'medspa', label: 'Med Spa / Aesthetics' },
  { value: 'clinic', label: 'Clinic / Medical Practice' },
  { value: 'local-service', label: 'Local Service Business' },
  { value: 'consultant', label: 'Specialist / Consultant' },
  { value: 'other', label: 'Other' },
];

const platforms = [
  { value: '', label: 'Select your platform' },
  { value: 'wordpress', label: 'WordPress' },
  { value: 'shopify', label: 'Shopify' },
  { value: 'webflow', label: 'Webflow' },
  { value: 'squarespace', label: 'Squarespace' },
  { value: 'wix', label: 'Wix' },
  { value: 'custom', label: 'Custom / Other' },
];

const questions = [
  {
    key: 'hasGoogleAnalytics',
    question: 'Do you have Google Analytics installed?',
    help: 'GA4 tracks visitor behavior and conversions on your site.',
  },
  {
    key: 'hasSearchConsole',
    question: 'Do you have Google Search Console set up?',
    help: 'GSC shows how your site appears in search results.',
  },
  {
    key: 'hasFaqContent',
    question: 'Do you have FAQ content on key pages?',
    help: 'Structured Q&A helps both humans and AI understand your services.',
  },
  {
    key: 'hasAdvancedSchema',
    question: 'Do you have structured data (schema) beyond basics?',
    help: 'Schema markup helps machines read your business info accurately.',
  },
  {
    key: 'hasRobotsTxtStrategy',
    question: 'Do you have a robots.txt strategy (not just default)?',
    help: 'A customized robots.txt guides which bots can crawl what.',
  },
  {
    key: 'hasLlmsTxt',
    question: 'Do you have an llms.txt (AI discovery file)?',
    help: 'This new file helps AI engines understand and cite your business.',
  },
];

const AIVisibilityScorecard = () => {
  const [step, setStep] = useState<'form' | 'questions' | 'results'>('form');
  const [formData, setFormData] = useState({
    websiteUrl: '',
    businessType: '',
    platform: '',
    city: '',
    email: '',
  });
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [results, setResults] = useState<ScorecardSubmission['results'] | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.websiteUrl.trim()) {
      newErrors.websiteUrl = 'Website URL is required';
    } else if (!/^https?:\/\/|^www\.|^\w+\.\w+/.test(formData.websiteUrl)) {
      newErrors.websiteUrl = 'Please enter a valid URL';
    }
    
    if (!formData.businessType) {
      newErrors.businessType = 'Please select your business type';
    }
    
    if (!formData.platform) {
      newErrors.platform = 'Please select your platform';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setStep('questions');
    }
  };

  const handleAnswerChange = (key: string, value: boolean) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleQuestionsSubmit = () => {
    const typedAnswers = {
      hasGoogleAnalytics: answers.hasGoogleAnalytics ?? false,
      hasSearchConsole: answers.hasSearchConsole ?? false,
      hasFaqContent: answers.hasFaqContent ?? false,
      hasAdvancedSchema: answers.hasAdvancedSchema ?? false,
      hasRobotsTxtStrategy: answers.hasRobotsTxtStrategy ?? false,
      hasLlmsTxt: answers.hasLlmsTxt ?? false,
    };
    
    const calculatedResults = calculateScorecardResults(typedAnswers);
    setResults(calculatedResults);
    
    // Track submission
    trackScorecardSubmit({
      ...formData,
      answers: typedAnswers,
    });
    
    // Track result view
    trackScorecardResultView({
      overallGrade: calculatedResults.overallGrade,
      scores: calculatedResults.scores,
    });
    
    setStep('results');
  };

  const handleBookCall = () => {
    trackBookCallClick('scorecard');
    window.open('https://calendly.com/galavanteer', '_blank');
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-[hsl(150_70%_45%)]';
      case 'B': return 'text-[hsl(120_60%_50%)]';
      case 'C': return 'text-[hsl(45_90%_55%)]';
      case 'D': return 'text-[hsl(25_90%_55%)]';
      default: return 'text-[hsl(0_70%_55%)]';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-[hsl(150_70%_45%)]';
    if (score >= 60) return 'bg-[hsl(45_90%_55%)]';
    return 'bg-[hsl(0_70%_55%)]';
  };

  return (
    <section id="scorecard" className="mkt-section relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[hsl(175_70%_45%/0.03)] blur-3xl" />
      </div>

      <div className="mkt-container relative">
        <div className="text-center mb-12">
          <h2 className="mb-4">AI Visibility Scorecard</h2>
          <p className="text-[hsl(220_10%_50%)] max-w-xl mx-auto">
            Get a quick assessment of how well your website is set up for AI discovery. 
            Takes about 60 seconds.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="mkt-card relative overflow-hidden">
            {/* Progress indicator */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {['form', 'questions', 'results'].map((s, i) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                      step === s
                        ? 'bg-[hsl(175_70%_45%)] text-[hsl(220_25%_6%)]'
                        : ['form', 'questions', 'results'].indexOf(step) > i
                        ? 'bg-[hsl(175_70%_45%/0.3)] text-[hsl(175_70%_45%)]'
                        : 'bg-[hsl(220_15%_20%)] text-[hsl(220_10%_50%)]'
                    }`}
                  >
                    {i + 1}
                  </div>
                  {i < 2 && (
                    <div
                      className={`w-16 h-0.5 mx-2 ${
                        ['form', 'questions', 'results'].indexOf(step) > i
                          ? 'bg-[hsl(175_70%_45%/0.3)]'
                          : 'bg-[hsl(220_15%_20%)]'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Step 1: Basic Info Form */}
            {step === 'form' && (
              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div>
                  <label className="mkt-label">
                    <Globe className="inline w-4 h-4 mr-1.5 opacity-60" />
                    Website URL *
                  </label>
                  <input
                    type="text"
                    value={formData.websiteUrl}
                    onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                    placeholder="https://yoursite.com"
                    className={`mkt-input ${errors.websiteUrl ? 'border-[hsl(0_70%_55%)]' : ''}`}
                  />
                  {errors.websiteUrl && (
                    <p className="text-[hsl(0_70%_55%)] text-sm mt-1">{errors.websiteUrl}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="mkt-label">
                      <Building2 className="inline w-4 h-4 mr-1.5 opacity-60" />
                      Business Type *
                    </label>
                    <select
                      value={formData.businessType}
                      onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                      className={`mkt-input mkt-select ${errors.businessType ? 'border-[hsl(0_70%_55%)]' : ''}`}
                    >
                      {businessTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    {errors.businessType && (
                      <p className="text-[hsl(0_70%_55%)] text-sm mt-1">{errors.businessType}</p>
                    )}
                  </div>

                  <div>
                    <label className="mkt-label">Platform *</label>
                    <select
                      value={formData.platform}
                      onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                      className={`mkt-input mkt-select ${errors.platform ? 'border-[hsl(0_70%_55%)]' : ''}`}
                    >
                      {platforms.map((p) => (
                        <option key={p.value} value={p.value}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                    {errors.platform && (
                      <p className="text-[hsl(0_70%_55%)] text-sm mt-1">{errors.platform}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="mkt-label">
                    <MapPin className="inline w-4 h-4 mr-1.5 opacity-60" />
                    City / Region (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g., Manhattan, NYC"
                    className="mkt-input"
                  />
                </div>

                <div>
                  <label className="mkt-label">
                    <Mail className="inline w-4 h-4 mr-1.5 opacity-60" />
                    Email (to receive your scorecard) *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    className={`mkt-input ${errors.email ? 'border-[hsl(0_70%_55%)]' : ''}`}
                  />
                  {errors.email && (
                    <p className="text-[hsl(0_70%_55%)] text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <button type="submit" className="mkt-btn mkt-btn-primary w-full">
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Step 2: Yes/No Questions */}
            {step === 'questions' && (
              <div className="space-y-4">
                <p className="text-[hsl(220_10%_50%)] text-sm mb-6">
                  Answer these 6 quick questions about your current setup.
                </p>

                {questions.map((q, index) => (
                  <div
                    key={q.key}
                    className="p-4 rounded-lg bg-[hsl(220_20%_10%)] border border-[hsl(220_15%_20%)]"
                  >
                    <p className="font-medium mb-1">
                      {index + 1}. {q.question}
                    </p>
                    <p className="text-[hsl(220_10%_50%)] text-sm mb-3">{q.help}</p>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => handleAnswerChange(q.key, true)}
                        className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                          answers[q.key] === true
                            ? 'bg-[hsl(150_70%_45%)] text-[hsl(220_25%_6%)]'
                            : 'bg-[hsl(220_15%_20%)] text-[hsl(40_20%_95%)] hover:bg-[hsl(220_15%_25%)]'
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAnswerChange(q.key, false)}
                        className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                          answers[q.key] === false
                            ? 'bg-[hsl(0_70%_55%)] text-white'
                            : 'bg-[hsl(220_15%_20%)] text-[hsl(40_20%_95%)] hover:bg-[hsl(220_15%_25%)]'
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>
                ))}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep('form')}
                    className="mkt-btn mkt-btn-secondary flex-1"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleQuestionsSubmit}
                    disabled={Object.keys(answers).length < questions.length}
                    className="mkt-btn mkt-btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Get My Score
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Results */}
            {step === 'results' && results && (
              <div className="space-y-6 mkt-animate-scale-in">
                {/* Overall Grade */}
                <div className="text-center py-6 border-b border-[hsl(220_15%_20%)]">
                  <p className="text-[hsl(220_10%_50%)] text-sm mb-2">Your AI Visibility Grade</p>
                  <div className={`text-7xl font-bold ${getGradeColor(results.overallGrade)}`}>
                    {results.overallGrade}
                  </div>
                  <p className="text-[hsl(40_20%_95%)] mt-2">
                    Overall Score: {results.overallScore}/100
                  </p>
                </div>

                {/* Sub-scores */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-[hsl(40_20%_95%/0.8)]">Breakdown</h4>
                  {[
                    { key: 'aiDiscoverability', label: 'AI Discoverability', desc: 'How easily AI can find and understand you' },
                    { key: 'structuredData', label: 'Structured Data', desc: 'Machine-readable business information' },
                    { key: 'crawlSignals', label: 'Crawl & Indexing Signals', desc: 'How well you guide crawlers' },
                    { key: 'tracking', label: 'Tracking & Attribution', desc: 'Your ability to measure results' },
                    { key: 'contentClarity', label: 'Content Clarity', desc: 'How clear your content is to machines' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{item.label}</span>
                          <span className="text-sm text-[hsl(220_10%_50%)]">
                            {results.scores[item.key as keyof typeof results.scores]}/100
                          </span>
                        </div>
                        <div className="h-2 bg-[hsl(220_15%_20%)] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${getScoreColor(
                              results.scores[item.key as keyof typeof results.scores]
                            )}`}
                            style={{
                              width: `${results.scores[item.key as keyof typeof results.scores]}%`,
                            }}
                          />
                        </div>
                        <p className="text-xs text-[hsl(220_10%_50%)] mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Top Fixes */}
                <div className="p-4 rounded-lg bg-[hsl(220_20%_10%)] border border-[hsl(220_15%_20%)]">
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-[hsl(45_90%_55%)]" />
                    Top 3 Recommended Fixes
                  </h4>
                  <ul className="space-y-2">
                    {results.topFixes.map((fix, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[hsl(40_20%_95%/0.8)]">
                        <span className="text-[hsl(175_70%_45%)]">{i + 1}.</span>
                        {fix}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTAs */}
                <div className="space-y-3 pt-4">
                  <button
                    onClick={handleBookCall}
                    className="mkt-btn mkt-btn-primary w-full"
                  >
                    Book a Call to Fix This
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      // For v1, just show a message - webhook integration ready
                      alert('Your scorecard has been saved. Check your email for the full report.');
                    }}
                    className="mkt-btn mkt-btn-secondary w-full"
                  >
                    <Mail className="w-4 h-4" />
                    Email Me the Full Scorecard
                  </button>
                </div>

                <p className="text-center text-xs text-[hsl(220_10%_50%)]">
                  Your results have been saved. We do not share your information with third parties.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIVisibilityScorecard;
