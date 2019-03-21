import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'MigrationDataElements' })
export class MigrationDataElements {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public organizationUnitCode: string;

  @Column()
  public dataElementId: number;

  @Column()
  public migrationId: number;

  @Column()
  public value: number;

  @Column()
  public isProcessed: boolean;

  @Column()
  public isMigrated: boolean;

  @Column()
  public isElementAuthorized: boolean;

  @Column()
  public period: string;

  @Column()
  public isValueValid: boolean;
}
