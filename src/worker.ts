import { EmailMessage } from 'cloudflare:email';

export interface Env {
  ASSETS?: {
    fetch: (request: Request) => Promise<Response>;
  };
  CONTACT_EMAIL?: {
    send: (message: EmailMessage) => Promise<void>;
  };
}

interface ContactPayload {
  subject?: string;
  name?: string;
  company?: string;
  email?: string;
  engagement_type?: string;
  message?: string;
}

function buildMimeEmail(params: {
  fromAddress: string;
  toAddress: string;
  replyTo: string;
  subject: string;
  bodyText: string;
}): string {
  const msgId = `<${crypto.randomUUID()}@tanvir-islam.dev>`;
  const dateHeader = new Date().toUTCString();
  const cleanSubject = params.subject.replace(/[\r\n]+/g, ' ').trim();
  const cleanReplyTo = params.replyTo.replace(/[\r\n]+/g, '').trim();

  const headers = [
    `From: "Tanvir Portfolio Inquiry" <${params.fromAddress}>`,
    `To: <${params.toAddress}>`,
    `Reply-To: <${cleanReplyTo}>`,
    `Subject: ${cleanSubject}`,
    `Message-ID: ${msgId}`,
    `Date: ${dateHeader}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=utf-8',
    'Content-Transfer-Encoding: 8bit',
  ];

  return `${headers.join('\r\n')}\r\n\r\n${params.bodyText}\r\n`;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/contact') {
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Accept',
          },
        });
      }

      if (request.method !== 'POST') {
        return Response.json(
          { ok: false, error: 'Method not allowed' },
          { status: 405 }
        );
      }

      try {
        const body = (await request.json()) as ContactPayload;
        const name = (body.name || 'Portfolio Visitor').trim();
        const company = (body.company || 'N/A').trim();
        const email = (body.email || 'contact@tanvir-islam.dev').trim();
        const engagementType = (body.engagement_type || 'Contract').trim();
        const message = (body.message || '').trim();
        const subject =
          body.subject ||
          `[Portfolio Inquiry - ${engagementType}] from ${name} (${company})`;

        const plainBody = [
          `New Portfolio Inquiry from https://tanvir-islam.dev`,
          `--------------------------------------------------`,
          `Name: ${name}`,
          `Company / Organization: ${company}`,
          `Work Email: ${email}`,
          `Engagement Type: ${engagementType}`,
          ``,
          `Message:`,
          message,
        ].join('\r\n');

        if (env.CONTACT_EMAIL && typeof env.CONTACT_EMAIL.send === 'function') {
          const rawMime = buildMimeEmail({
            fromAddress: 'contact@tanvir-islam.dev',
            toAddress: 'tanvir6@gmail.com',
            replyTo: email,
            subject,
            bodyText: plainBody,
          });

          const emailMsg = new EmailMessage(
            'contact@tanvir-islam.dev',
            'tanvir6@gmail.com',
            rawMime
          );
          await env.CONTACT_EMAIL.send(emailMsg);

          return Response.json({
            ok: true,
            delivered: true,
            provider: 'cloudflare-email-routing',
          });
        }

        return Response.json({
          ok: true,
          delivered: false,
          reason: 'CONTACT_EMAIL binding not active',
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown email delivery error';
        return Response.json({
          ok: true,
          delivered: false,
          reason: errorMessage,
        });
      }
    }

    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not Found', { status: 404 });
  },
};
