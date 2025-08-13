import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: null })
  imageUrl?: string;

  @Column()
  password: string;

  @Column({ default: 0 })
  totalBlog: number;

  @Column({ default: null })
  refreshToken: string;
}
