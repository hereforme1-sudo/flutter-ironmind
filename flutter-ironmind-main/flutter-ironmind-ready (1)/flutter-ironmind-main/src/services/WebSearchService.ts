export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source?: string;
}

export class WebSearchService {
  private apiKey: string = '';
  private searchEngineId: string = '';

  // Free search alternatives
  async searchDuckDuckGo(query: string, language: 'ro' | 'en' = 'en'): Promise<SearchResult[]> {
    try {
      // Using DuckDuckGo instant answer API (limited but free)
      const encodedQuery = encodeURIComponent(query);
      const url = `https://api.duckduckgo.com/?q=${encodedQuery}&format=json&no_html=1&skip_disambig=1&region=${language}-${language.toUpperCase()}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      const results: SearchResult[] = [];
      
      // Add abstract as first result if available
      if (data.Abstract) {
        results.push({
          title: data.Heading || 'DuckDuckGo Answer',
          url: data.AbstractURL || '#',
          snippet: data.Abstract,
          source: 'DuckDuckGo'
        });
      }
      
      // Add related topics
      if (data.RelatedTopics) {
        data.RelatedTopics.slice(0, 3).forEach((topic: any) => {
          if (topic.Text && topic.FirstURL) {
            results.push({
              title: topic.Text.split(' - ')[0] || 'Related Topic',
              url: topic.FirstURL,
              snippet: topic.Text,
              source: 'DuckDuckGo'
            });
          }
        });
      }
      
      return results;
    } catch (error) {
      console.error('DuckDuckGo search error:', error);
      return [];
    }
  }

  async searchWikipedia(query: string, language: 'ro' | 'en' = 'en'): Promise<SearchResult[]> {
    try {
      const lang = language === 'ro' ? 'ro' : 'en';
      const encodedQuery = encodeURIComponent(query);
      
      // Search for pages
      const searchUrl = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodedQuery}`;
      
      const response = await fetch(searchUrl);
      
      if (!response.ok) {
        // If direct page not found, try search
        const fallbackUrl = `https://${lang}.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodedQuery}&srlimit=3&origin=*`;
        const fallbackResponse = await fetch(fallbackUrl);
        const fallbackData = await fallbackResponse.json();
        
        if (fallbackData.query?.search) {
          return fallbackData.query.search.map((result: any) => ({
            title: result.title,
            url: `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(result.title)}`,
            snippet: result.snippet.replace(/<[^>]*>/g, ''), // Remove HTML tags
            source: 'Wikipedia'
          }));
        }
        return [];
      }
      
      const data = await response.json();
      
      return [{
        title: data.title,
        url: data.content_urls?.desktop?.page || `https://${lang}.wikipedia.org/wiki/${encodedQuery}`,
        snippet: data.extract || 'No description available',
        source: 'Wikipedia'
      }];
      
    } catch (error) {
      console.error('Wikipedia search error:', error);
      return [];
    }
  }

  async searchNews(query: string, language: 'ro' | 'en' = 'en'): Promise<SearchResult[]> {
    try {
      // Using NewsAPI free tier alternative - RSS feeds
      const rssFeedUrls = {
        en: [
          'https://rss.cnn.com/rss/edition.rss',
          'https://feeds.bbci.co.uk/news/rss.xml'
        ],
        ro: [
          'https://www.hotnews.ro/rss',
          'https://www.digi24.ro/rss'
        ]
      };

      // For demo purposes, return mock news results
      // In production, you'd parse RSS feeds or use a news API
      return [
        {
          title: `Latest news about: ${query}`,
          url: '#',
          snippet: 'Real news integration would require RSS parsing or News API access.',
          source: 'News Aggregator'
        }
      ];
      
    } catch (error) {
      console.error('News search error:', error);
      return [];
    }
  }

  async performSearch(
    query: string, 
    type: 'web' | 'wikipedia' | 'news' = 'web',
    language: 'ro' | 'en' = 'en'
  ): Promise<SearchResult[]> {
    switch (type) {
      case 'wikipedia':
        return await this.searchWikipedia(query, language);
      case 'news':
        return await this.searchNews(query, language);
      case 'web':
      default:
        return await this.searchDuckDuckGo(query, language);
    }
  }

  // Enhanced search with multiple sources
  async comprehensiveSearch(query: string, language: 'ro' | 'en' = 'en'): Promise<SearchResult[]> {
    try {
      const [webResults, wikiResults] = await Promise.all([
        this.searchDuckDuckGo(query, language),
        this.searchWikipedia(query, language)
      ]);

      // Combine and deduplicate results
      const allResults = [...wikiResults, ...webResults];
      const uniqueResults = allResults.filter((result, index, self) => 
        index === self.findIndex(r => r.url === result.url)
      );

      return uniqueResults.slice(0, 5); // Limit to top 5 results
    } catch (error) {
      console.error('Comprehensive search error:', error);
      return [];
    }
  }
}