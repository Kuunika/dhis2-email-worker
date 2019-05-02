export interface Message {
  channelId: string;
  client: string;
  email?: string;
  migrationFailed: boolean;
  migrationId: number;
  source: string;
  clientId: string;
  description: string;
}
