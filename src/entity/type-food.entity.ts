import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('type_food')
export class FoodType {
  @PrimaryGeneratedColumn({ name: 'id_type_food' })
  id: number

  @Column()
  name: string
}
