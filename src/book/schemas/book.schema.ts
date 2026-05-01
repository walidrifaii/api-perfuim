import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum Category {
  ADVENTURE = 'Adventure',
  CALSSICS = 'Classics',
  CRIME = 'Crime',
  FANTASY = 'Fantasy',
}

@Entity({ name: 'books' })
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  author: string;

  @Column('float')
  price: number;

  @Column({
    type: 'enum',
    enum: Category,
    default: Category.ADVENTURE,
  })
  category: Category;
}
