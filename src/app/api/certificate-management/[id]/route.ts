import { NextResponse } from "next/server";
import { lambdaClient } from "../../../../../lib/lambdaClient";

// PUT function to update an existing certificate
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params; // Get ID from route parameters
    const updatedData = await req.json();
    
    console.log('Updating certificate with ID:', id);
    console.log('Update data:', updatedData);

    // Check if certificate exists
    const existingResponse = await lambdaClient.select(
      "SELECT * FROM certification_report WHERE Reg_Id = ?",
      [id]
    );

    if (!existingResponse.success) {
      throw new Error(existingResponse.error || 'Failed to check certificate existence');
    }

    if (existingResponse.data.length === 0) {
      return NextResponse.json(
        { error: "Certificate not found" },
        { status: 404 }
      );
    }

    const existing = existingResponse.data[0];

    // Update the certificate in the database
    const updateResponse = await lambdaClient.update(
      `UPDATE certification_report SET
        Certificate_Name = ?, Item_Code = ?, Item_Name = ?, Expiry_Date = ?
        WHERE Reg_Id = ?`,
      [
        updatedData.certificateName || existing.Certificate_Name,
        updatedData.itemCode || existing.Item_Code,
        updatedData.itemName || existing.Item_Name,
        updatedData.expiryDate || existing.Expiry_Date,
        id,
      ]
    );

    if (!updateResponse.success) {
      throw new Error(updateResponse.error || 'Failed to update certificate');
    }

    // Fetch the updated certificate
    const updatedResponse = await lambdaClient.select(
      "SELECT * FROM certification_report WHERE Reg_Id = ?",
      [id]
    );

    if (!updatedResponse.success || updatedResponse.data.length === 0) {
      throw new Error('Failed to fetch updated certificate');
    }

    const updated = updatedResponse.data[0];

    // Return data in the format expected by frontend
    const responseData = {
      regId: updated.Reg_Id,
      certificateName: updated.Certificate_Name,
      itemCode: updated.Item_Code,
      itemName: updated.Item_Name,
      expiryDate: updated.Expiry_Date,
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE function to remove a certificate
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params; // Get ID from route parameters
    
    // Check if certificate exists
    const existingResponse = await lambdaClient.select(
      "SELECT * FROM certification_report WHERE Reg_Id = ?",
      [id]
    );

    if (!existingResponse.success) {
      throw new Error(existingResponse.error || 'Failed to check certificate existence');
    }

    if (existingResponse.data.length === 0) {
      return NextResponse.json(
        { error: "Certificate not found" },
        { status: 404 }
      );
    }

    // Delete the certificate
    const deleteResponse = await lambdaClient.delete(
      "DELETE FROM certification_report WHERE Reg_Id = ?",
      [id]
    );

    if (!deleteResponse.success) {
      throw new Error(deleteResponse.error || 'Failed to delete certificate');
    }

    return NextResponse.json(
      { message: "Certificate deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
  