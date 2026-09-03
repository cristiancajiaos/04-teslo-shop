import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessageWsService } from './message-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dto/new-message.dto';


@WebSocketGateway({cors: true, namespace: '/'})
export class MessageWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;

  constructor(private readonly messageWsService: MessageWsService) {}
  
  handleConnection(client: Socket) {
    this.messageWsService.registerClient(client);
    // console.log({conectados: this.messageWsService.getConnectedClients()});
    this.wss.emit('clients-updated', this.messageWsService.getConnectedClients());
  }

  handleDisconnect(client: Socket) {
    this.messageWsService.removeClient(client.id);
    // console.log({conectados: this.messageWsService.getConnectedClients()});
    this.wss.emit('clients-updated', this.messageWsService.getConnectedClients());
  }

  //message-from-client
  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto) {
    console.log(client.id, payload);
  }

  
}
