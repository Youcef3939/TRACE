const MIN_EXTRACTED_CONTENT_CHARS = 200;

function stripLinkListBoilerplate(text: string): string {
  return text
    .split('\n')
    .filter((line) => !/^[*+-]\s*\[[^\]]*\]\([^)]*\)(\s*"[^"]*")?\s*$/.test(line.trim()))
    .join('\n');
}

export async function extractUrlContent(url: string): Promise<string> {
  const apiKey = process.env.TAVILY_API_KEY;

  if (!apiKey) {
    throw new Error('TAVILY_API_KEY is not set');
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error("That doesn't look like a valid URL.");
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error('Only http:// and https:// URLs are supported.');
  }

  const response = await fetch('https://api.tavily.com/extract', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_key: apiKey,
      urls: [url],
      include_images: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Tavily extract request failed: ${response.statusText}`);
  }

  const data = await response.json();

  const failure = data.failed_results?.[0];
  if (failure) {
    throw new Error(`That page couldn't be fetched (${failure.error || 'unreachable'}).`);
  }

  const rawContent: string = data.results?.[0]?.raw_content ?? '';
  const content = stripLinkListBoilerplate(rawContent);
  if (content.trim().length < MIN_EXTRACTED_CONTENT_CHARS) {
    throw new Error("That page didn't have enough readable text to investigate.");
  }

  return content;
}

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
      include_raw_content: false,
      max_results: maxResults,
    }),
  });

  if (!response.ok) {
    throw new Error(`Tavily search failed: ${response.statusText}`);
  }

  return response.json();
}
