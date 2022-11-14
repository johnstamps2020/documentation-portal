import { Entity } from 'typeorm';
import { Item } from './Item';

@Entity()
export class SubjectItem extends Item {}
