import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessageWsService } from './message-ws.service';
import { Server, Socket } from 'socket.io';


@WebSocketGateway({cors: true, namespace: '/'})
export class MessageWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;

  constructor(private readonly messageWsService: MessageWsService) {}
  
  handleConnection(client: Socket) {
    this.messageWsService.registerClient(client);
    console.log({conectados: this.messageWsService.getConnectedClients()});
    this.wss.emit('clients-updated', this.messageWsService.getConnectedClients());
  }

  handleDisconnect(client: Socket) {
    this.messageWsService.removeClient(client.id);
    console.log({conectados: this.messageWsService.getConnectedClients()});
    this.wss.emit('clients-updated', this.messageWsService.getConnectedClients());
  }

  
}
