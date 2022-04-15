import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { CanvasService } from '../canvas/canvas.service';
import { DrawMessage } from '../interfaces/Messages';
import { Identifier, TimeoutService } from '../timeout/timeout.service';

@WebSocketGateway({ cors: true })
export class PlaceGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: any;

  constructor(
    private canvasService: CanvasService,
    private timeoutService: TimeoutService,
  ) {}

  handleConnection(@ConnectedSocket() socket) {
    console.log('%cNew client connected', 'color: gray');

    const canvasConfig = this.canvasService.getConfig();
    const timeoutDuration = this.timeoutService.timeoutDuration;
    const image = this.canvasService.getCanvas();
    const message = { ...canvasConfig, image, timeoutDuration };
    socket.emit('initial', message);
  }

  @SubscribeMessage('place')
  handlePlaceMessage(
    @MessageBody() data: DrawMessage,
    @ConnectedSocket() socket,
  ) {
    const identifier: Identifier = {
      ip: socket?.request?.connection?.remoteAddress,
      socketId: socket?.id,
    };

    if (this.timeoutService.isTimedOut(identifier)) {
      return;
    }

    this.canvasService.place(data);
    this.server.sockets.emit('update', data);
    this.timeoutService.add(identifier);
  }
}
