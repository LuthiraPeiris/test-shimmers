import { NextRequest, NextResponse } from "next/server";
import { lambdaClient } from "../../../../lib/lambdaClient";

// ✅ GET: List all goods issues
export async function GET() {
  try {
    const response = await lambdaClient.select(
      "SELECT * FROM good_issues_data ORDER BY Good_Issue_Id DESC",
      []
    );

    if (!response.success) {
      throw new Error(response.error || "Failed to fetch goods issues");
    }

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error("Error fetching goods issues:", error);
    return NextResponse.json(
      { error: "Failed to fetch goods issues", success: false },
      { status: 500 }
    );
  }
}

// ✅ POST: Create new goods issue
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { Item_Code, Item_Name, Quantity, Reason, createdDate } = body;

    if (!Item_Code || !Quantity || isNaN(parseInt(Quantity)) || parseInt(Quantity) <= 0) {
      return NextResponse.json(
        { error: "Valid Item_Code and positive Quantity are required", success: false },
        { status: 400 }
      );
    }

    // Check product stock
    const productResponse = await lambdaClient.select(
      "SELECT Available_Stock FROM item_master_data WHERE Item_Code = ?",
      [Item_Code]
    );

    if (!productResponse.success) {
      throw new Error(productResponse.error || "Failed to check product stock");
    }

    if (productResponse.data.length === 0) {
      return NextResponse.json(
        { error: "Product not found in inventory", success: false },
        { status: 404 }
      );
    }

    const currentStock = productResponse.data[0].Available_Stock;
    const requestedQuantity = parseInt(Quantity, 10);

    if (currentStock < requestedQuantity) {
      return NextResponse.json(
        {
          error: `Insufficient stock. Available: ${currentStock}, Requested: ${requestedQuantity}`,
          success: false,
        },
        { status: 400 }
      );
    }

    // Auto-generate Good_Issue_Id
    let Good_Issue_Id = "GI0001";
    const lastIdResponse = await lambdaClient.select(
      "SELECT Good_Issue_Id FROM good_issues_data ORDER BY Good_Issue_Id DESC LIMIT 1",
      []
    );

    if (!lastIdResponse.success) {
      throw new Error(lastIdResponse.error || "Failed to get last ID");
    }

    if (lastIdResponse.data.length > 0) {
      const lastId = lastIdResponse.data[0].Good_Issue_Id;
      const numericPart = parseInt(lastId.replace("GI", ""), 10);
      Good_Issue_Id = `GI${(numericPart + 1).toString().padStart(4, "0")}`;
    }

    const parsedQuantity = parseInt(Quantity, 10);
    const issuedDate = createdDate ? new Date(createdDate) : new Date();

    // Insert goods issue
    const insertResponse = await lambdaClient.insert(
      `INSERT INTO good_issues_data 
        (Good_Issue_Id, Item_Code, Item_Name, Quantity, Reason, Issued_Date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [Good_Issue_Id, Item_Code, Item_Name || null, parsedQuantity, Reason || null, issuedDate]
    );

    if (!insertResponse.success) {
      throw new Error(insertResponse.error || "Failed to create goods issue");
    }

    // Update stock
    const updateResponse = await lambdaClient.update(
      "UPDATE item_master_data SET Available_Stock = Available_Stock - ? WHERE Item_Code = ?",
      [parsedQuantity, Item_Code]
    );

    if (!updateResponse.success) {
      throw new Error(updateResponse.error || "Failed to update stock");
    }

    // Fetch new record
    const newRecordResponse = await lambdaClient.select(
      "SELECT * FROM good_issues_data WHERE Good_Issue_Id = ?",
      [Good_Issue_Id]
    );

    return NextResponse.json(
      {
        message: "Goods issue created successfully and stock updated",
        data: newRecordResponse.success ? newRecordResponse.data[0] : null,
        updatedProduct: {
          Item_Code,
          quantityDecreased: parsedQuantity,
        },
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating goods issue:", error);
    return NextResponse.json(
      { error: "Failed to create goods issue", success: false },
      { status: 500 }
    );
  }
}

// ✅ PUT: Update a goods issue
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { Good_Issue_Id, Item_Code, Item_Name, Quantity, Reason, Issued_Date } = body;

    if (!Good_Issue_Id) {
      return NextResponse.json(
        { error: "Good_Issue_Id is required", success: false },
        { status: 400 }
      );
    }

    if (Quantity && (isNaN(Quantity) || Quantity <= 0)) {
      return NextResponse.json(
        { error: "Quantity must be positive", success: false },
        { status: 400 }
      );
    }

    const existingResponse = await lambdaClient.select(
      "SELECT * FROM good_issues_data WHERE Good_Issue_Id = ?",
      [Good_Issue_Id]
    );

    if (!existingResponse.success) {
      throw new Error(existingResponse.error || "Failed to check record");
    }

    if (existingResponse.data.length === 0) {
      return NextResponse.json(
        { error: "Goods issue not found", success: false },
        { status: 404 }
      );
    }

    const updateResponse = await lambdaClient.update(
      `UPDATE good_issues_data 
       SET Item_Code = ?, Item_Name = ?, Quantity = ?, Reason = ?, Issued_Date = ?
       WHERE Good_Issue_Id = ?`,
      [Item_Code, Item_Name, Quantity, Reason, Issued_Date, Good_Issue_Id]
    );

    if (!updateResponse.success) {
      throw new Error(updateResponse.error || "Failed to update goods issue");
    }

    const updatedResponse = await lambdaClient.select(
      "SELECT * FROM good_issues_data WHERE Good_Issue_Id = ?",
      [Good_Issue_Id]
    );

    return NextResponse.json(
      { message: "Goods issue updated successfully", data: updatedResponse.data[0], success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating goods issue:", error);
    return NextResponse.json(
      { error: "Failed to update goods issue", success: false },
      { status: 500 }
    );
  }
}

// ✅ DELETE: Remove a goods issue
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const Good_Issue_Id = url.searchParams.get("Good_Issue_Id");

    if (!Good_Issue_Id) {
      return NextResponse.json(
        { error: "Good_Issue_Id is required", success: false },
        { status: 400 }
      );
    }

    const existingResponse = await lambdaClient.select(
      "SELECT * FROM good_issues_data WHERE Good_Issue_Id = ?",
      [Good_Issue_Id]
    );

    if (!existingResponse.success) {
      throw new Error(existingResponse.error || "Failed to check record");
    }

    if (existingResponse.data.length === 0) {
      return NextResponse.json(
        { error: "Goods issue not found", success: false },
        { status: 404 }
      );
    }

    const deleteResponse = await lambdaClient.delete(
      "DELETE FROM good_issues_data WHERE Good_Issue_Id = ?",
      [Good_Issue_Id]
    );

    if (!deleteResponse.success) {
      throw new Error(deleteResponse.error || "Failed to delete goods issue");
    }

    return NextResponse.json(
      { message: "Goods issue deleted successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting goods issue:", error);
    return NextResponse.json(
      { error: "Failed to delete goods issue", success: false },
      { status: 500 }
    );
  }
}
