import { JwtBodyDto } from 'server/dto/jwt_body.dto';
import { Server, Socket } from 'socket.io';
import { GatewayAuthGuard } from '../guards/gatewayauth.guard';
import { OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect, WebSocketServer, WebSocketGateway, WsException, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { JwtService } from '../services/jwt.service';
import { UseGuards } from '@nestjs/common';
import { GamesService } from '../services/games.service';
import { Move } from 'server/entities/move.entity';


class TurnPayload {
  moveOrder: number;
  moveColumn: number;
}

 @WebSocketGateway()
 @UseGuards(GatewayAuthGuard)
 export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
   @WebSocketServer()
   server: Server;

   constructor(private jwtService: JwtService, 
     //This one is subject to naming
     private gamesService: GamesService) {}

   async handleConnection(client: any, ...args: any[]) {
     try {
      // Get the auth token from the client and parse, it it fails it wont connect
      const jwt = client.handshake.auth.token;
      await this.jwtService.parseToken(jwt);
      console.log("Client Connected to room " + client.handshake.query.room);
      //Add them to the room
      client.join(client.handshake.query.room as unknown as string);
      //Send the moves to the client
      const moves = await this.gamesService.getMoves(client.handshake.query.room as number);
      client.emit('initial-moves', moves);
     }
     catch (e) {
      throw new WsException('Invalid token');
     }
   }

   handleDisconnect(client: any) {
     console.log('Client Disconnected');
   }

  @SubscribeMessage('turn')
  public async handleTurn(client: any, payload: TurnPayload) {
    console.log('Client Turn');
    //Store the turn in the database
    let move = new Move();
    move.gameRoomId = client.handshake.query.room as number;
    move.moveOrder = payload.moveOrder;
    move.moveColumn = payload.moveColumn;
    await this.gamesService.handleTurn(move);
    //Send the turn to all clients in the room
    this.server.to(`${client.handshake.query.room}`).emit('turn', move);
   }

  @SubscribeMessage('reset')
  public async handleReset(client: any) {
    //Reset the game
    const gameRoomId = client.handshake.query.gameRoomId as number;
    await this.gamesService.resetGame(gameRoomId);
    //Send the reset to all clients in the room
    this.server.to(`${gameRoomId}`).emit('reset');
  }
 }