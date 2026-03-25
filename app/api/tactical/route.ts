import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { buildTacticalPrompt } from '@/lib/tactical-prompt';
import type { Match } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { match: Match; trigger: string };

    if (!body.match) {
      return NextResponse.json(
        { error: 'Match data required' },
        { status: 400 },
      );
    }

    const { system, user } = buildTacticalPrompt(
      body.match,
      body.trigger || 'manual',
    );

    const client = new Anthropic();

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const messageStream = client.messages.stream({
            model: 'claude-sonnet-4-6',
            max_tokens: 1024,
            system,
            messages: [{ role: 'user', content: user }],
          });

          for await (const event of messageStream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              const data = JSON.stringify({
                type: 'content',
                text: event.delta.text,
              });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          }

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: 'done' })}\n\n`,
            ),
          );
          controller.close();
        } catch (err) {
          const errMsg =
            err instanceof Error ? err.message : 'Unknown error';
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: 'error', message: errMsg })}\n\n`,
            ),
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Tactical API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate analysis' },
      { status: 500 },
    );
  }
}
