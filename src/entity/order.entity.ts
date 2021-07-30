import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn({ name: 'order_id' })
  id?: number

  @Column({ name: 'id_user' })
  userId: number

  @Column({ name: 'sum_price' })
  price: string
}
