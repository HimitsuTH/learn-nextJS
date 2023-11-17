import { NextResponse } from "next/server";


export async function GET(req:Request) {
    const product = {
        name: "T-St-shirt",
        price: 500
    }

    return NextResponse.json(product);
}