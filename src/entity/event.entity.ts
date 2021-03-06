import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'

@Entity('event')
export class Event {
  @PrimaryGeneratedColumn({ name: 'id_event' })
  id?: number

  @Column({ name: 'name_event' })
  name: string

  @Column({ name: 'start' })
  startDate: Date

  @Column({ name: 'end' })
  endDate: Date
}
