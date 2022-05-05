import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameRoom } from 'server/entities/game_room.entity';
import { Repository } from 'typeorm';
import { Move } from 'server/entities/move.entity';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(GameRoom)
    private readonly gameRoomRepository: Repository<GameRoom>,
    @InjectRepository(Move)
    private readonly moveRepository: Repository<Move>,
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

  async handleTurn(move: Move): Promise<Move> {
    return this.moveRepository.save(move);
  }

  async getMoves(gameRoomId: number): Promise<Move[]> {
    return this.moveRepository.find({ where: { gameRoomId } });
  }

  async resetGame(gameRoomId: number) {
    const moves = await this.moveRepository.find({ where: { gameRoomId } });
    moves.forEach((move) => this.moveRepository.delete(move));
  }
}
