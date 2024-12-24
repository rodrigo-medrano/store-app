import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema()
export class Product extends Document{
    @Prop({
        unique: true,
        index: true,
        required: true
    })
    name: string
    @Prop({
        required: true
    })
    product_date: Date
    @Prop({
        required: true
    })
    expiration_date: Date
    @Prop({
        required:true
    })
    stock: number
    @Prop({
        required:true
    })
    price: number
    tags: [string]

    //Referencia a User o Auth
    @Prop({type: Types.ObjectId, ref: 'User', required: true})
    user_id: Types.ObjectId
}

export const ProductSchema= SchemaFactory.createForClass(Product)