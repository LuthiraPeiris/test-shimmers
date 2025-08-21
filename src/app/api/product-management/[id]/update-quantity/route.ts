import { NextRequest, NextResponse } from 'next/server';
import { getDBConnection } from "../../../../../../lib/dbAdapter";

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const connection = await getDBConnection();
        const itemCode = params.id;
        const { quantity } = await request.json();
        
        await connection.execute(
            'UPDATE product_management SET Quantity = ? WHERE Item_Code = ?',
            [quantity, itemCode]
        );
        
        return NextResponse.json({ success: true, message: 'Product quantity updated successfully' });
    } catch (error) {
        console.error('Error updating product quantity:', error);
        return NextResponse.json({ error: 'Failed to update product quantity' }, { status: 500 });
    }
}
