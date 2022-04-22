import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class AddGameRooms1650587804984 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'game_room',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'name',
            type: 'text',
          },
          {
            name: 'roomkey',
            type: 'text',
            isUnique: true,
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'move',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'gameRoomId',
            type: 'int',
          },
          {
            name: 'moveOrder',
            type: 'int',
          },
          {
            name: 'moveColumn',
            type: 'int',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'move',
      new TableForeignKey({
        columnNames: ['gameRoomId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'game_room',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('move');
    await queryRunner.dropTable('game_room');
  }
}
