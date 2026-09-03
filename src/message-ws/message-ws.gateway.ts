import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessageWsService } from './message-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dto/new-message.dto';


@WebSocketGateway({cors: true, namespace: '/'})
export class MessageWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;

  constructor(private readonly messageWsService: MessageWsService) {}
  
  handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    console.log(token);


    this.messageWsService.registerClient(client);
    // console.log({conectados: this.messageWsService.getConnectedClients()});
    this.wss.emit('clients-updated', this.messageWsService.getConnectedClients());
  }

  handleDisconnect(client: Socket) {
    this.messageWsService.removeClient(client.id);
    // console.log({conectados: this.messageWsService.getConnectedClients()});
    this.wss.emit('clients-updated', this.messageWsService.getConnectedClients());
  }

  // Emite únicamente al cliente
  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto) {
    console.log(client.id, payload);
    // Emite únicamente al cliente
    /*
    client.emit('message-from-server', {
      fullName: 'Yo',
      message: payload.message || 'no message!'
    });
    */

    // Emite a todos menos al cliente inicial
    /*
    client.broadcast.emit('message-from-server', {
      fullName: 'Yo',
      message: payload.message || 'no message!'
    });
    */

    this.wss.emit('message-from-server', {
      fullName: 'Yo',
      message: payload.message || 'no message!'
    });

  }

  
}
