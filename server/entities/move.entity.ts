import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { GameRoom } from './game_room.entity';

@Entity()
export class Move {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gameRoomId: number;

  @Column()
  moveOrder: number;

  @Column()
  moveColumn: number;

  @ManyToOne(() => GameRoom, (gameRoom) => gameRoom.moves)
  gameRoom: GameRoom;
}
