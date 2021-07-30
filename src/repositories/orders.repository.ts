import { EntityRepository, Repository } from 'typeorm'
import { Orders } from '../entity/order.entity'

@EntityRepository(Orders)
export class OrdersRepository extends Repository<Orders> {}
