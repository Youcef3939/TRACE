export async function searchWeb(query: string, searchDepth: 'basic' | 'advanced' = 'advanced', maxResults: number = 5) {
  const apiKey = process.env.TAVILY_API_KEY;
  
  if (!apiKey) {
    throw new Error('TAVILY_API_KEY is not set');
  }

  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_key: apiKey,
      query: query,
      search_depth: searchDepth,
      include_answer: false,
      include_images: false,
      include_raw_content: true,
      max_results: maxResults,
    }),
  });

  if (!response.ok) {
    throw new Error(`Tavily search failed: ${response.statusText}`);
  }

  return response.json();
}
