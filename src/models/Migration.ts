import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Migration' })
export class Migration {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public uploadedAt: string;

  @Column()
  public structureValidatedAt: string;

  @Column()
  public structureFailedValidationAt: string;

  @Column()
  public elementsAuthorizationAt: string;

  @Column()
  public elementsFailedAuthorizationAt: string;

  @Column()
  public valuesValidatedAt: string;

  @Column()
  public valuesFailedValidationAt: string;

  @Column()
  public reportDispatchedAt: string;

  @Column()
  public totalMigratedElements: number;

  @Column()
  public totalDataElements: number;

  @Column()
  public totalFailedElements: number;

  @Column()
  public migrationCompletedAt: string;

  @Column()
  public clientId: number;
}
