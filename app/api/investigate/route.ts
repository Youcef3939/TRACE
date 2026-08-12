import { runInvestigation } from '@/lib/pipeline/runInvestigation';

export async function POST(req: Request) {
  const { input, language = 'en' } = await req.json();

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
        for await (const event of runInvestigation(input, language)) {
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
