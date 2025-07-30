export function isTextMessage(message: any): message is { text: string } {
  return typeof message?.text === 'string';
}