import { runInvestigation } from '@/lib/pipeline/runInvestigation';
import { extractUrlContent } from '@/lib/tavily';

const MAX_URL_CONTENT_CHARS = 12000; // ~2500-3000 words — enough to find claims, not the whole page

export async function POST(req: Request) {
  const { input, language = 'en', mode = 'text' } = await req.json();

  if (!input || typeof input !== 'string' || !input.trim()) {
    return new Response(JSON.stringify({ error: 'Input is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        let textToInvestigate = input;

        if (mode === 'url') {
          try {
            const pageContent = await extractUrlContent(input);
            textToInvestigate = pageContent.slice(0, MAX_URL_CONTENT_CHARS);
          } catch (error) {
            controller.enqueue(
              encoder.encode(
                JSON.stringify({
                  stage: 'fatal',
                  error: `TRACE couldn't access that page (${error instanceof Error ? error.message : String(error)}). Try pasting the text directly instead.`,
                }) + '\n'
              )
            );
            return;
          }
        }

        for await (const event of runInvestigation(textToInvestigate, language)) {
          controller.enqueue(encoder.encode(JSON.stringify(event) + '\n'));
        }
      } catch (error) {
        controller.enqueue(encoder.encode(JSON.stringify({ stage: 'fatal', error: String(error) }) + '\n'));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
    },
  });
}
