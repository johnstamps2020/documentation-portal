import { Entity } from 'typeorm';
import { Item } from './Item';

@Entity()
export class SubCategoryItem extends Item {}
