// // src/app/api/index.ts
// // This file serves as the central export point for all API modules

// // Re-export all API route handlers
// export { GET as alertsGET, POST as alertsPOST } from './alerts/route';
// export { GET as certificateManagementGET, POST as certificateManagementPOST } from './certificate-management/route';
// export { GET as customerManagementGET, POST as customerManagementPOST, PUT as customerManagementPUT, DELETE as customerManagementDELETE } from './customer-management/route';
// export { GET as deliveriesGET, POST as deliveriesPOST } from './deliveries/route';
// export { GET as goodsReceiptsGET, POST as goodsReceiptsPOST } from './goods-receipts/route';
// export { GET as invoicesGET, POST as invoicesPOST } from './invoices/route';
// export { GET as productManagementGET, POST as productManagementPOST } from './product-management/route';
// export { GET as purchaseOrdersGET, POST as purchaseOrdersPOST } from './purchase-orders/route';
// export { GET as salesOrderGET, POST as salesOrderPOST } from './sales-order/route';
// export { GET as supplierInvoicesGET, POST as supplierInvoicesPOST } from './supplier-invoices/route';
// export { GET as supplierManagementGET, POST as supplierManagementPOST } from './supplier-management/route';
// export { GET as userSettingsGET, PUT as userSettingsPUT } from './UserSettings/route';

// // API Path Constants
// export const API_PATHS = {
//   ALERTS: '/api/alerts',
//   CERTIFICATE_MANAGEMENT: '/api/certificate-management',
//   CUSTOMER_MANAGEMENT: '/api/customer-management',
//   DELIVERIES: '/api/deliveries',
//   GOODS_RECEIPTS: '/api/goods-receipts',
//   INVOICES: '/api/invoices',
//   PRODUCT_MANAGEMENT: '/api/product-management',
//   PURCHASE_ORDERS: '/api/purchase-orders',
//   SALES_ORDER: '/api/sales-order',
//   SUPPLIER_INVOICES: '/api/supplier-invoices',
//   SUPPLIER_MANAGEMENT: '/api/supplier-management',
//   USER_SETTINGS: '/api/UserSettings'
// } as const;

// // API Module Types
// export type ApiModule = {
//   GET?: Function;
//   POST?: Function;
//   PUT?: Function;
//   DELETE?: Function;
//   PATCH?: Function;
// };

// // Utility function to check if a module has a specific method
// export const hasMethod = (module: ApiModule, method: keyof ApiModule): boolean => {
//   return typeof module[method as keyof ApiModule] === 'function';
// };

// // Default export
// export default {
//   API_PATHS,
//   hasMethod
// };
