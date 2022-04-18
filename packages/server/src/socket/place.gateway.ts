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

  getInitialMessage() {
    const canvasConfig = this.canvasService.getConfig();
    const timeoutDuration = this.timeoutService.timeoutDuration;
    const image = this.canvasService.getCanvas();
    return { ...canvasConfig, image, timeoutDuration };
  }

  handleConnection(@ConnectedSocket() socket) {
    console.log('%cNew client connected', 'color: gray');

    socket.emit('initial', this.getInitialMessage());
  }

  sendUpdatedConfig() {
    this.server.emit('initial', this.getInitialMessage());
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

    const valid = this.canvasService.place(data);
    if (valid) this.server.sockets.emit('update', data);
    this.timeoutService.add(identifier);
  }
}
