import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { IsString, IsNotEmpty, MaxLength } from "class-validator";
import { User } from './User';

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    title?: string;

    @Column()
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    description?: string;

    @ManyToOne(() => User, user => user.id)
    userId?: User;
}