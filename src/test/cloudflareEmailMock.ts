export class EmailMessage {
  from: string;
  to: string;
  raw: ReadableStream | string;
  constructor(from: string, to: string, raw: ReadableStream | string) {
    this.from = from;
    this.to = to;
    this.raw = raw;
  }
}
