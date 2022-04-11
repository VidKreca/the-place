import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { CanvasService } from '../canvas/canvas.service';
import { DrawMessage } from '../interfaces/Messages';

@WebSocketGateway({ cors: true })
export class PlaceGateway implements OnGatewayConnection {
  constructor(private canvasService: CanvasService) {}

  handleConnection(@ConnectedSocket() socket) {
    console.log('%cNew client connected', 'color: gray');

    const config = this.canvasService.getConfig();
    const image = this.canvasService.getCanvas();
    const message = { ...config, image };
    socket.emit('initial', message);
  }

  @SubscribeMessage('place')
  handlePlaceMessage(
    @MessageBody() data: DrawMessage,
    @ConnectedSocket() socket,
  ) {
    console.log('Received "place" message: ', data);

    this.canvasService.place(data);

    socket.broadcast.emit('update', data);
  }
}
