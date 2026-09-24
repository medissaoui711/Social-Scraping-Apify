import { PipelineWorkflow } from '../types';

export const PREBUILT_RECIPES: PipelineWorkflow[] = [
  {
    id: 'recipe-influencer-outreach',
    title: 'Instagram & TikTok Influencer Discovery & Lead Miner',
    titleAr: 'استخراج المؤثرين ووسائل التواصل عبر إنستغرام وتيك توك',
    description: 'Scrapes trending creator profiles, parses verified emails and WhatsApp numbers from bio links, and scores engagement rate.',
    descriptionAr: 'جمع بيانات صناع المحتوى الأكثر رواجاً، واستخلاص الإيميلات وأرقام الواتساب من البايو، واحتساب معدل التفاعل.',
    category: 'Influencer Marketing',
    tags: ['Instagram', 'TikTok', 'Email Miner', 'Engagement Score'],
    runsCount: 1420,
    steps: [
      {
        id: 's1',
        title: 'Scrape Instagram Creator Profiles by Niche Hashtag',
        actorId: 'apify/instagram-scraper',
        actorName: '⚡ Instagram Profile & Reels Scraper',
        platform: 'Instagram',
        actionType: 'scrape',
        customInput: {
          hashtags: ['#techcreator', '#gadgets'],
          resultsLimit: 25,
          minFollowers: 10000
        },
        isEnabled: true
      },
      {
        id: 's2',
        title: 'Extract Bio Link Emails & WhatsApp Contacts',
        actorId: 'apify/contact-details-scraper',
        actorName: '✨ Contact Details & Email Enricher',
        platform: 'Messaging',
        actionType: 'enrich',
        customInput: {
          extractEmails: true,
          extractPhones: true,
          verifyDeliverability: true
        },
        isEnabled: true
      },
      {
        id: 's3',
        title: 'AI Influencer Scoring & Sponsorship Pitch Generator',
        actorId: 'system/ai-orchestrator',
        actorName: '🧠 Gemini AI Score & Pitch Composer',
        platform: 'Multi-Platform',
        actionType: 'ai_analyze',
        customInput: {
          scoreEngagement: true,
          generatePersonalizedPitch: true
        },
        isEnabled: true
      },
      {
        id: 's4',
        title: 'Export Structured Lead List to CSV & Webhook',
        actorId: 'system/exporter',
        actorName: '📦 Automated Webhook & CSV Dispatch',
        platform: 'Multi-Platform',
        actionType: 'export',
        customInput: {
          format: 'csv',
          autoSync: true
        },
        isEnabled: true
      }
    ]
  },
  {
    id: 'recipe-b2b-leadgen',
    title: 'LinkedIn B2B Decision-Maker Finder & Email Enricher',
    titleAr: 'استخراج صناع القرار والمديرين في لينكد إن مع الإيميلات المباشرة',
    description: 'Searches executive LinkedIn profiles without cookies, enriches verified work emails, and exports directly to CRM.',
    descriptionAr: 'البحث عن القيادات والمديرين في الشركات بدون كوكيز، وتزويدهم بالإيميلات الوظيفية المؤكدة والتصدير الفوري.',
    category: 'B2B Sales',
    tags: ['LinkedIn', 'B2B Leads', 'Cookie-less', 'CRM Ready'],
    runsCount: 2890,
    steps: [
      {
        id: 's1',
        title: 'Scrape LinkedIn Decision Makers (Founders & CTOs)',
        actorId: 'scary_good_apis/linkedin-search-posts',
        actorName: '⚡️ LinkedIn Profile Scraper (No Cookie)',
        platform: 'LinkedIn',
        actionType: 'scrape',
        customInput: {
          jobTitles: ['CTO', 'VP of Engineering', 'Founder'],
          countries: ['United States', 'United Kingdom', 'UAE', 'Saudi Arabia'],
          maxProfiles: 30
        },
        isEnabled: true
      },
      {
        id: 's2',
        title: 'Verify Direct Work Emails & Phone Extensions',
        actorId: 'code_crafter/leads-finder',
        actorName: '✨ Leads Finder & Direct Phone Enricher',
        platform: 'Jobs & Recruitment',
        actionType: 'enrich',
        customInput: {
          includeCompanyDomain: true,
          validateMX: true
        },
        isEnabled: true
      },
      {
        id: 's3',
        title: 'Format for HubSpot / Salesforce CRM Pipeline',
        actorId: 'system/exporter',
        actorName: '📦 Multi-Format CRM Export',
        platform: 'Multi-Platform',
        actionType: 'export',
        customInput: {
          format: 'json',
          includeAuditMetadata: true
        },
        isEnabled: true
      }
    ]
  },
  {
    id: 'recipe-youtube-transcript-miner',
    title: 'YouTube Competitor Analysis & Video Transcript Miner',
    titleAr: 'تفريغ وتلخيص محتوى قنوات اليوتيوب والمنافسين بالذكاء الاصطناعي',
    description: 'Downloads full timestamped video subtitles from target YouTube channels, runs AI semantic summarization, and extracts key talking points.',
    descriptionAr: 'سحب النصوص الكاملة والترجمة لمقاطع اليوتيوب مع الطوابع الزمنية، والتلخيص الدلالي وتحديد أهم النقاط.',
    category: 'Content Intelligence',
    tags: ['YouTube', 'Transcripts', 'AI Summarizer', 'Video Analytics'],
    runsCount: 970,
    steps: [
      {
        id: 's1',
        title: 'Extract Recent Video IDs & Metrics from Channel',
        actorId: 'n.nobar/youtube-channel-comment-collector',
        actorName: '▶️ YouTube Channel & Video Collector',
        platform: 'YouTube',
        actionType: 'scrape',
        customInput: {
          channelUrl: 'https://youtube.com/@ai-breakthroughs',
          maxVideos: 10
        },
        isEnabled: true
      },
      {
        id: 's2',
        title: 'Download Full Timed Transcripts & Subtitles',
        actorId: 'supreme_coder/youtube-transcript-scraper',
        actorName: '🌟 Youtube Transcript Bulk Extractor',
        platform: 'YouTube',
        actionType: 'scrape',
        customInput: {
          format: 'json_timestamps',
          preferredLanguage: 'ar'
        },
        isEnabled: true
      },
      {
        id: 's3',
        title: 'Gemini AI Competitive Topic Synthesis & Insights',
        actorId: 'system/ai-orchestrator',
        actorName: '🧠 AI Competitive Intelligence Digest',
        platform: 'Multi-Platform',
        actionType: 'ai_analyze',
        customInput: {
          extractKeyThemes: true,
          generateActionableTakeaways: true
        },
        isEnabled: true
      }
    ]
  },
  {
    id: 'recipe-viral-tiktok-radar',
    title: 'TikTok & Reels Viral Sound & Trend Radar',
    titleAr: 'رادار التريندات والأصوات الرائجة في تيك توك وريلز',
    description: 'Monitors viral hashtags and sounds, tracks velocity of views and shares in real-time, and flags emerging meme formats.',
    descriptionAr: 'مراقبة الهاشتاغات والأصوات واسعة الانتشار، وتتبع سرعة المشاهدات والمشاركات آنياً لاكتشاف الاتجاهات الصاعدة.',
    category: 'Trend Intelligence',
    tags: ['TikTok', 'Viral Radar', 'Sound Tracker', 'Fast Refresh'],
    runsCount: 1650,
    steps: [
      {
        id: 's1',
        title: 'Scrape Top 50 Trending TikTok Videos by Sound ID',
        actorId: 'scrapearchitect/douyin-video-downloader',
        actorName: '🎥 TikTok & Douyin Trend Scraper',
        platform: 'TikTok',
        actionType: 'scrape',
        customInput: {
          searchQuery: '#viral',
          downloadWithoutWatermark: true,
          maxItems: 40
        },
        isEnabled: true
      },
      {
        id: 's2',
        title: 'Analyze Engagement Velocity (Views / Hour)',
        actorId: 'system/ai-orchestrator',
        actorName: '⚡ Trend Velocity Calculator',
        platform: 'Multi-Platform',
        actionType: 'filter',
        customInput: {
          minVelocityRatio: 2.5
        },
        isEnabled: true
      }
    ]
  }
];
