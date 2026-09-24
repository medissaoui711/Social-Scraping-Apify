import { ScrapingApiItem } from '../types';

export interface PrecomputedApiSearchEntry {
  api: ScrapingApiItem;
  searchString: string; // pre-lowercased name + description + author + slug + tags + platform
  tagsLower: string[];
}

export class ApiSearchIndex {
  private entries: PrecomputedApiSearchEntry[] = [];
  private platformMap: Map<string, PrecomputedApiSearchEntry[]> = new Map();

  constructor(apis: ScrapingApiItem[]) {
    this.reindex(apis);
  }

  public reindex(apis: ScrapingApiItem[]) {
    this.platformMap.clear();
    this.entries = apis.map((api) => {
      const tagsLower = (api.tags || []).map((t) => t.toLowerCase());
      const searchString = `${api.name} ${api.description} ${api.author} ${api.slug} ${api.platform} ${tagsLower.join(' ')}`.toLowerCase();
      const entry: PrecomputedApiSearchEntry = {
        api,
        searchString,
        tagsLower
      };

      // Add to platform map
      const platformKey = api.platform || 'Multi-Platform';
      if (!this.platformMap.has(platformKey)) {
        this.platformMap.set(platformKey, []);
      }
      this.platformMap.get(platformKey)!.push(entry);

      return entry;
    });
  }

  public search(
    query: string,
    selectedPlatform: string = 'ALL',
    selectedTag: string = '',
    sortBy: 'popular' | 'rating' | 'speed' | 'success' | 'name' = 'popular'
  ): ScrapingApiItem[] {
    const trimmed = query.trim().toLowerCase();
    const queryTokens = trimmed ? trimmed.split(/\s+/).filter(Boolean) : [];
    const tagLower = selectedTag ? selectedTag.toLowerCase() : '';

    // Determine candidate pool
    let candidates = this.entries;
    if (selectedPlatform !== 'ALL') {
      candidates = this.platformMap.get(selectedPlatform) || [];
    }

    // Filter candidates
    const results: ScrapingApiItem[] = [];

    for (let i = 0; i < candidates.length; i++) {
      const entry = candidates[i];

      // Check tag filter
      if (tagLower && !entry.tagsLower.includes(tagLower)) {
        continue;
      }

      // Check token search match
      if (queryTokens.length > 0) {
        let matchesAll = true;
        for (let j = 0; j < queryTokens.length; j++) {
          if (!entry.searchString.includes(queryTokens[j])) {
            matchesAll = false;
            break;
          }
        }
        if (!matchesAll) continue;
      }

      results.push(entry.api);
    }

    // Sort results
    return results.sort((a, b) => {
      if (sortBy === 'popular') return (b.runsCount || 0) - (a.runsCount || 0);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'speed') return (a.avgRunTimeSec || 0) - (b.avgRunTimeSec || 0);
      if (sortBy === 'success') return (b.successRate || 0) - (a.successRate || 0);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  }
}
