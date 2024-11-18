import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { IsString, IsNotEmpty, MaxLength, IsEmail } from "class-validator";
import { Post } from "./Post";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    firstName?: string;

    @Column()
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    lastName?: string;

    @Column()
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email?: string;

    @OneToMany(() => Post, post => post.userId)
    posts?: Post[];
}