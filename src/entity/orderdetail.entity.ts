import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'

@Entity('orderdetail')
export class OrderDetail {
  @PrimaryGeneratedColumn({ name: 'id_preorder' })
  id?: number

  @Column({ name: 'id_food' })
  foodId: number

  @Column()
  qty: number

  @Column()
  price: number

  @Column({ name: 'id_order' })
  orderId: number

  @Column({ name: 'id_user' })
  userId: number
}
