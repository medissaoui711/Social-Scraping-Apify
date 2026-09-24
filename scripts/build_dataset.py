import re
import json
import os

with open('extracted_project/social-media-scraping-apis-main/social-media-apis-3268/README.md', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

pattern = r'\|\s*\[(.*?)\]\((.*?)\)\s*\|\s*(.*?)\s*\|'
matches = re.findall(pattern, text)
print(f'Matches count: {len(matches)}')

items = []
categories_set = set()

def detect_platform_and_tags(name, desc, url):
    combined = (name + ' ' + desc + ' ' + url).lower()
    platform = 'Multi-Platform'
    icon = 'Globe'
    
    if any(k in combined for k in ['instagram', 'insta ', 'reels', 'ig stories', 'ig post']):
        platform = 'Instagram'
        icon = 'Instagram'
    elif any(k in combined for k in ['linkedin', 'recruiter', 'job applicant', 'company profile']):
        platform = 'LinkedIn'
        icon = 'Linkedin'
    elif any(k in combined for k in ['youtube', 'youtu.be', 'yt channel', 'yt transcript', 'shorts']):
        platform = 'YouTube'
        icon = 'Youtube'
    elif any(k in combined for k in ['tiktok', 'douyin', 'tik tok']):
        platform = 'TikTok'
        icon = 'Video'
    elif any(k in combined for k in ['facebook', 'fb group', 'fb post', 'fb video', 'meta ads']):
        platform = 'Facebook'
        icon = 'Facebook'
    elif any(k in combined for k in ['twitter', 'tweet', ' x.com', 'tweets']):
        platform = 'Twitter / X'
        icon = 'Twitter'
    elif any(k in combined for k in ['reddit', 'subreddit', 'redditor']):
        platform = 'Reddit'
        icon = 'MessageSquare'
    elif any(k in combined for k in ['whatsapp', 'telegram', 'discord']):
        platform = 'Messaging'
        icon = 'MessageCircle'
    elif any(k in combined for k in ['threads']):
        platform = 'Threads'
        icon = 'AtSign'
    elif any(k in combined for k in ['pinterest', 'pin ']):
        platform = 'Pinterest'
        icon = 'Pin'
    elif any(k in combined for k in ['snapchat']):
        platform = 'Snapchat'
        icon = 'Camera'
    elif any(k in combined for k in ['twitch', 'vimeo', 'spotify', 'podcast', 'soundcloud']):
        platform = 'Media & Audio'
        icon = 'Radio'
    elif any(k in combined for k in ['indeed', 'glassdoor', 'ziprecruiter', 'job']):
        platform = 'Jobs & Recruitment'
        icon = 'Briefcase'

    tags = []
    if 'no cookie' in combined or 'without cookie' in combined or 'no login' in combined:
        tags.append('Cookie-less')
    if 'download' in combined or 'video' in combined or 'hd' in combined:
        tags.append('Media Downloader')
    if 'email' in combined or 'phone' in combined or 'lead' in combined or 'contact' in combined:
        tags.append('Lead & Contact Extractor')
    if 'transcript' in combined or 'subtitles' in combined or 'speech' in combined:
        tags.append('Transcript Extractor')
    if 'profile' in combined or 'bio' in combined:
        tags.append('Profile & Bio')
    if 'comment' in combined or 'sentiment' in combined or 'review' in combined:
        tags.append('Comments & Sentiment')
    if 'bulk' in combined or 'batch' in combined:
        tags.append('Bulk Processing')
    if 'proxy' in combined or 'residential' in combined:
        tags.append('Proxy Shield')
    if 'fast' in combined or 'speed' in combined or '⚡' in combined:
        tags.append('Ultra Fast')
    if 'ai' in combined or 'smart' in combined or 'gpt' in combined or 'ideas' in combined:
        tags.append('AI Enhanced')
    if not tags:
        tags.append('Data Extractor')

    pricing = 'Free Trial'
    price_match = re.search(r'\$(\d+(?:\.\d+)?)\s*(?:/|per|\/)\s*([a-zA-Z0-9]+)?', combined)
    if price_match:
        pricing = f"${price_match.group(1)} / {price_match.group(2) or '1k'}"
    elif 'free' in combined:
        pricing = 'Free Tier'
    elif 'rental' in combined or 'month' in combined:
        pricing = 'Monthly Rental'

    return platform, icon, tags, pricing

for idx, (raw_name, url, desc) in enumerate(matches):
    clean_name = re.sub(r'[\r\n\t]+', ' ', raw_name)
    clean_name = re.sub(r'[\x00-\x1f\x7f-\x9f]', '', clean_name).strip()
    clean_desc = re.sub(r'[\r\n\t]+', ' ', desc)
    clean_desc = re.sub(r'[\x00-\x1f\x7f-\x9f]', '', clean_desc).strip()
    
    author = 'apify'
    slug = f'actor-{idx+1}'
    url_match = re.search(r'apify\.com/([^/?#]+)/([^/?#]+)', url)
    if url_match:
        author = url_match.group(1)
        slug = url_match.group(2)
    elif 'apify.com/' in url:
        parts = url.split('apify.com/')[1].split('?')[0].split('/')
        if len(parts) >= 1:
            slug = parts[0]
            
    platform, icon, tags, pricing = detect_platform_and_tags(clean_name, clean_desc, url)
    categories_set.add(platform)
    
    # Generate default input schema based on platform & tags
    input_schema = {
        "maxItems": 50,
        "proxyConfig": {"useApifyProxy": True, "apifyProxyGroups": ["RESIDENTIAL"]},
        "extendOutputFunction": ""
    }
    if platform == 'Instagram':
        input_schema["directUrls"] = ["https://www.instagram.com/p/DFxyz123/"]
        input_schema["searchType"] = "hashtag"
        input_schema["searchLimit"] = 25
    elif platform == 'YouTube':
        input_schema["startUrls"] = [{"url": "https://www.youtube.com/@techtrends/videos"}]
        input_schema["maxComments"] = 100
        input_schema["downloadSubtitles"] = True
    elif platform == 'LinkedIn':
        input_schema["searchKeywords"] = "Senior AI Engineer"
        input_schema["location"] = "Worldwide"
        input_schema["maxProfiles"] = 30
    elif platform == 'TikTok':
        input_schema["profiles"] = ["tiktok_creator"]
        input_schema["scrapePosts"] = True
        input_schema["downloadVideos"] = False
    elif platform == 'Twitter / X':
        input_schema["searchQueries"] = ["#AI", "#Automation"]
        input_schema["maxTweets"] = 100
        input_schema["sort"] = "Top"
    else:
        input_schema["targetUrls"] = ["https://example.com/target"]
        input_schema["extractFields"] = ["title", "author", "metrics", "timestamp", "content"]

    items.append({
        'id': f'api-{idx+1}',
        'name': clean_name,
        'slug': slug,
        'author': author,
        'actorId': f'{author}/{slug}',
        'url': url,
        'description': clean_desc,
        'platform': platform,
        'icon': icon,
        'tags': tags,
        'pricing': pricing,
        'rating': round(4.1 + (abs(hash(clean_name)) % 9) / 10.0, 1),
        'runsCount': 2400 + (abs(hash(slug)) % 86000),
        'successRate': round(97.2 + (abs(hash(clean_desc)) % 27) / 10.0, 1),
        'avgRunTimeSec': round(0.8 + (abs(hash(slug)) % 35) / 10.0, 1),
        'defaultInput': input_schema
    })

os.makedirs('src/data', exist_ok=True)
with open('src/data/scrapingApis.json', 'w', encoding='utf-8') as f:
    json.dump(items, f, ensure_ascii=False, indent=2)

print(f'Successfully saved {len(items)} APIs to src/data/scrapingApis.json')
print('Categories:', sorted(list(categories_set)))
