import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameRoom } from 'server/entities/game_room.entity';
import { Move } from 'server/entities/move.entity';
import { GuardUtil } from 'server/providers/util/guard.util';

@Module({
  imports: [TypeOrmModule.forFeature([GameRoom, Move])],
  controllers: [],
  providers: [GuardUtil],
  exports: [],
})
export class GameRoomsModule {}
