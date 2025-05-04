import { IsNotEmpty, IsString } from "class-validator";

export class PostbackDto
{
    @IsNotEmpty()
    @IsString()
    declare invoice_id: string

    @IsNotEmpty()
    @IsString()
    declare token: string
}