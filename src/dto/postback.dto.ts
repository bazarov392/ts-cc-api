import { IsNotEmpty, IsString } from "class-validator";

export class PostbackDto
{
    @IsNotEmpty()
    @IsString()
    declare invoiceId: string

    @IsNotEmpty()
    @IsString()
    declare token: string
}