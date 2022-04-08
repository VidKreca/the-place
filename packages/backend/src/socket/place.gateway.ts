import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

@WebSocketGateway({ cors: true })
export class PlaceGateway {
  constructor() {}

  @SubscribeMessage('echo')
  handleMessage(@MessageBody() data: string): string {
    console.log('Received message: ', data);
    return data;
  }
}
