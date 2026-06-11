import {Entity, Column, PrimaryColumn} from 'typeorm';
@Entity()
export class STUDENT {

    @PrimaryColumn({length: 10})
    SID: string;



}