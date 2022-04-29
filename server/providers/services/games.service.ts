import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameRoom } from 'server/entities/game_room.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(GameRoom)
    private readonly gameRoomRepository: Repository<GameRoom>,
  ) {}

  findAll(): Promise<GameRoom[]> {
    return this.gameRoomRepository.find();
  }

  findOne(id: number): Promise<GameRoom> {
    return this.gameRoomRepository.findOne(id);
  }

  async create(gameRoom: GameRoom): Promise<GameRoom> {
    return this.gameRoomRepository.save(gameRoom);
  }

  async remove(gameRoom: GameRoom) {
    return this.gameRoomRepository.delete(gameRoom);
  }
}
