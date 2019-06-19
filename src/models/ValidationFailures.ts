import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'ValidationFailures' })
export class ValidationFailures {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public createdAt: Date;

  @Column()
  public reason: string;

  @Column()
  public migrationId: Date;

  @Column()
  public fileName: string;
}
