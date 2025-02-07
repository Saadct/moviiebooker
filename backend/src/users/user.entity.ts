import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;  

    username: string;

    @Column({ unique: true })
    email: string;
  
    @Column()
    password: string;

    @Column({ default: 'user' })
    role: string;
}
