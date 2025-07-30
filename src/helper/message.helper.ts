export function isTextMessage(message: any): message is { text: string } {
  return typeof message?.text === 'string';
}

export function isLocationMessage(message: any): message is { location: Location } {
  return (
    message &&
    typeof message === 'object' &&
    'location' in message &&
    typeof message.location === 'object' &&
    typeof message.location.latitude === 'number' &&
    typeof message.location.longitude === 'number'
  );
}