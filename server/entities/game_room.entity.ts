import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Move } from './move.entity';

@Entity()
export class GameRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  roomkey: string;

  @OneToMany(() => Move, (move) => move.gameRoom)
  moves: Move[];
}
