// api/alerts/[id]/route.js

// IMPORTANT: In a real application, you would import allAlerts from a shared module
// or a database connection. For this example, we'll re-declare it for simplicity,
// but be aware this means changes won't persist across requests if the server restarts.
let allAlerts = {
    itemExpiry: [
      { id: 'EXP-001', itemCode: 'ITM-101', itemName: 'Milk (2L)', quantity: 5, expiryDate: '2023-12-31' },
      { id: 'EXP-002', itemCode: 'ITM-105', itemName: 'Yogurt (Strawberry)', quantity: 12, expiryDate: '2024-01-15' },
    ],
    lowStock: [
      { id: 'LSTK-001', itemCode: 'ITM-203', itemName: 'Printer Paper (Ream)', currentQuantity: 8, reorderLevel: 10, notificationDate: '2023-12-20' },
      { id: 'LSTK-002', itemCode: 'ITM-310', itemName: 'AA Batteries (Pack)', currentQuantity: 3, reorderLevel: 5, notificationDate: '2023-12-18' },
    ],
    certificationExpiry: [
      { id: 'CERT-001', registrationId: 'REG-501', certificationName: 'First Aid Certification', expiryDate: '2024-03-01' },
      { id: 'CERT-002', registrationId: 'REG-502', certificationName: 'Forklift Operator License', expiryDate: '2024-02-10' },
    ],
  };
  
  // Helper to find alert by ID across all types
  const findAlertAndType = (id) => {
    for (const type in allAlerts) {
      const index = allAlerts[type].findIndex(alert => alert.id === id);
      if (index !== -1) {
        return { type, index, alert: allAlerts[type][index] };
      }
    }
    return null;
  };
  
  // PUT: Update an existing alert
  export async function PUT(req, { params }) {
    try {
      const { id } = params;
      const updatedData = await req.json();
  
      const found = findAlertAndType(id);
  
      if (!found) {
        return new Response(JSON.stringify({ error: "Alert not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
  
      const { type, index } = found;
      allAlerts[type][index] = { ...allAlerts[type][index], ...updatedData, id }; // Ensure ID is preserved
  
      return new Response(JSON.stringify(allAlerts[type][index]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error('PUT error:', error);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
  
  // DELETE: Remove an alert
  export async function DELETE(req, { params }) {
    try {
      const { id } = params;
      const found = findAlertAndType(id);
  
      if (!found) {
        return new Response(JSON.stringify({ error: "Alert not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
  
      const { type, index } = found;
      allAlerts[type].splice(index, 1);
  
      return new Response(JSON.stringify({ message: "Alert deleted successfully" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error('DELETE error:', error);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
  