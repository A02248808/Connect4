import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GameRoom } from 'server/entities/game_room.entity';
import { GamesService } from 'server/providers/services/games.service';
import * as crypto from 'crypto';

class GameRoomBody {
  name: string;
}

@Controller()
export class GameRoomsController {
  constructor(private gameRoomsService: GamesService) {}

  @Get('/game_rooms')
  async allRooms() {
    const gameRooms = await this.gameRoomsService.findAll();
    return { gameRooms };
  }

  @Get('/game_rooms/:id')
  async oneRoom(@Param('id') id: string) {
    const gameRoom = await this.gameRoomsService.findOne(parseInt(id));
    return { gameRoom };
  }

  @Post('game_rooms')
  async create(@Body() body: GameRoomBody) {
    let gameRoom = new GameRoom();
    gameRoom.name = body.name;
    gameRoom.roomkey = crypto.randomBytes(8).toString('hex');
    gameRoom = await this.gameRoomsService.create(gameRoom);
    return { gameRoom };
  }

  @Post('game_rooms/:id')
  async remove(@Param('id') id: string) {
    const gameRoom = await this.gameRoomsService.findOne(parseInt(id));
    await this.gameRoomsService.remove(gameRoom);
  }
}
