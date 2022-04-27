import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameRoomsController } from 'server/controllers/games.controller';
import { GameRoom } from 'server/entities/game_room.entity';
import { Move } from 'server/entities/move.entity';
import { GamesService } from 'server/providers/services/games.service';
import { JwtService } from 'server/providers/services/jwt.service';
import { GuardUtil } from 'server/providers/util/guard.util';

@Module({
  imports: [TypeOrmModule.forFeature([GameRoom, Move])],
  controllers: [GameRoomsController],
  providers: [GuardUtil, GamesService, JwtService],
  exports: [],
})
export class GameRoomsModule {}
