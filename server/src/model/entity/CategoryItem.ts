import { Entity } from 'typeorm';
import { Item } from './Item';

@Entity()
export class CategoryItem extends Item {}
