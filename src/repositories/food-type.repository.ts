import { EntityRepository, Repository } from 'typeorm'
import { FoodType } from '../entity/food-type.entity'

@EntityRepository(FoodType)
export class FoodTypeRepository extends Repository<FoodType> {}
