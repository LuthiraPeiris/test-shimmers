'use client';

import React, { useState, useEffect, useCallback } from 'react';
import '../../app/globals.css'; // Adjust if needed
import AlertsHeader from '../components/alerts/AlertsHeader';
import AlertsTable from '../components/alerts/AlertsTable';
import AlertsModal from '../components/alerts/AlertsModal';

const AlertsPage = () => {
  const [itemExpiryAlerts, setItemExpiryAlerts] = useState([]);
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [certificationExpiryAlerts, setCertificationExpiryAlerts] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAlert, setCurrentAlert] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const [currentAlertType, setCurrentAlertType] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchAlerts = useCallback(async (type, search = '') => {
    setLoading(true);
    try {
      let url = '', searchParam = search ? `?search=${encodeURIComponent(search)}` : '';

      switch (type) {
        case 'itemExpiry':
          url = '/api/alerts/expiry-notification';
          break;
        case 'lowStock':
          url = '/api/alerts/low_stock_notification';
          break;
        case 'certificationExpiry':
          url = '/api/alerts/certification_expiry';
          break;
        default:
          console.error(`Invalid alert type: ${type}`);
          return;
      }

      const res = await fetch(`${url}${searchParam}`);
      const data = await res.json();

      if (!res.ok) {
        console.error(`Failed to fetch ${type} alerts:`, data.error || 'Unknown error');
        return;
      }

      const transformData = (items, type) =>
        items.map((item) => {
          switch (type) {
            case 'itemExpiry':
              return {
                id: item.Notification_ID || item.notification_id,
                itemCode: item.Item_Code || item.item_code,
                itemName: item.Item_Name || item.item_name,
                quantity: item.Quantity || item.quantity,
                expiryDate: item.Expiry_Date || item.expiry_date,
                status: item.Notification_Status || item.notification_status,
              };
            case 'lowStock':
              return {
                id: item.Notification_Id || item.notification_id,
                itemCode: item.Item_Code || item.item_code,
                itemName: item.Item_Name || item.item_name,
                currentQuantity: item.Current_Qty || item.current_qty,
                reorderLevel: item.Reorder_level || item.reorder_level,
                notificationDate: item.Notification_Date || item.notification_date,
                status: item.Notification_Status || item.notification_status,
                email: item.Email || item.email,
              };
            case 'certificationExpiry':
              return {
                id: item.Notification_ID || item.notification_id,
                registrationId: item.Reg_Id || item.reg_id,
                certificationName: item.Certification_Name || item.certification_name,
                expiryDate: item.Expiry_Date || item.expiry_date,
                status: item.Notification_Status || item.notification_status,
              };
            default:
              return item;
          }
        });

      const transformed = transformData(Array.isArray(data) ? data : [], type);

      switch (type) {
        case 'itemExpiry':
          setItemExpiryAlerts(transformed);
          break;
        case 'lowStock':
          setLowStockAlerts(transformed);
          break;
        case 'certificationExpiry':
          setCertificationExpiryAlerts(transformed);
          break;
        default:
          break;
      }
    } catch (err) {
      console.error(`Failed to fetch ${type} alerts:`, err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshAllAlerts = useCallback(() => {
    fetchAlerts('itemExpiry', searchTerm);
    fetchAlerts('lowStock', searchTerm);
    fetchAlerts('certificationExpiry', searchTerm);
  }, [fetchAlerts, searchTerm]);

  useEffect(() => {
    refreshAllAlerts();
  }, [refreshAllAlerts]);

  const handleEditAlert = (alert, type) => {
    setCurrentAlert(alert);
    setCurrentAlertType(type);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteAlert = async (alertId, alertType) => {
    if (!window.confirm(`Are you sure you want to delete alert ${alertId}?`)) return;

    try {
      let url = '';
      let idParam = '';

      switch (alertType) {
        case 'itemExpiry':
          url = '/api/alerts/expiry-notification';
          idParam = `Notification_ID=${alertId}`;
          break;
        case 'lowStock':
          url = '/api/alerts/low_stock_notification';
          idParam = `Notification_Id=${alertId}`;
          break;
        case 'certificationExpiry':
          url = '/api/alerts/certification_expiry';
          idParam = `Notification_ID=${alertId}`;
          break;
        default:
          console.error(`Invalid alert type: ${alertType}`);
          return;
      }

      const res = await fetch(`${url}?${idParam}`, { method: 'DELETE' });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete alert');
      }

      refreshAllAlerts();
    } catch (err) {
      console.error('Failed to delete alert:', err);
      alert('Failed to delete alert. Please try again.');
    }
  };

  const handleSaveAlert = async (alertData, type) => {
    try {
      let url = '', method = '', body = null;

      switch (type) {
        case 'itemExpiry':
          url = '/api/alerts/expiry-notification';
          body = {
            Item_Code: alertData.itemCode,
            Item_Name: alertData.itemName,
            Quantity: alertData.quantity,
            Expiry_Date: alertData.expiryDate,
            Notification_Status: alertData.status || 'active',
          };
          if (modalMode === 'edit') {
            method = 'PUT';
            body.Notification_ID = alertData.id;
          } else {
            method = 'POST';
          }
          break;

        case 'lowStock':
          url = '/api/alerts/low_stock_notification';
          body = {
            Item_Code: alertData.itemCode,
            Item_Name: alertData.itemName,
            Current_Qty: alertData.currentQuantity,
            Reorder_level: alertData.reorderLevel,
            Notification_Status: alertData.status || 'active',
            Notification_Date: alertData.notificationDate,
            Email: alertData.email || '',
          };
          if (modalMode === 'edit') {
            method = 'PUT';
            body.Notification_Id = alertData.id;
          } else {
            method = 'POST';
          }
          break;

        case 'certificationExpiry':
          url = '/api/alerts/certification_expiry';
          body = {
            Reg_Id: alertData.registrationId,
            Certification_Name: alertData.certificationName,
            Expiry_Date: alertData.expiryDate,
            Notification_Status: alertData.status || 'active',
          };
          if (modalMode === 'edit') {
            method = 'PUT';
            body.Notification_ID = alertData.id;
          } else {
            method = 'POST';
          }
          break;

        default:
          console.error(`Invalid alert type: ${type}`);
          return;
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save alert');
      }

      setIsModalOpen(false);
      refreshAllAlerts();
    } catch (err) {
      console.error('Failed to save alert:', err);
      alert('Failed to save alert. Please try again.');
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    refreshAllAlerts();
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <AlertsHeader onSearch={handleSearch} />

      <main className="container mx-auto p-4 space-y-8">
        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading alerts...</div>
        ) : (
          <>
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center text-gray-900">
                <i className="fa-solid fa-clock-rotate-left text-red-500 mr-3"></i>
                Item Expiry Alerts
              </h2>
              <AlertsTable
                type="itemExpiry"
                alerts={itemExpiryAlerts}
                onEdit={handleEditAlert}
                onDelete={(id) => handleDeleteAlert(id, 'itemExpiry')}
              />
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center text-gray-900">
                <i className="fa-solid fa-box-open text-yellow-500 mr-3"></i>
                Low Stock Alerts
              </h2>
              <AlertsTable
                type="lowStock"
                alerts={lowStockAlerts}
                onEdit={handleEditAlert}
                onDelete={(id) => handleDeleteAlert(id, 'lowStock')}
              />
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center text-gray-900">
                <i className="fa-solid fa-id-card-clip text-blue-500 mr-3"></i>
                Certification Expiry Alerts
              </h2>
              <AlertsTable
                type="certificationExpiry"
                alerts={certificationExpiryAlerts}
                onEdit={handleEditAlert}
                onDelete={(id) => handleDeleteAlert(id, 'certificationExpiry')}
              />
            </section>
          </>
        )}
      </main>

      <AlertsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        alertData={currentAlert}
        mode={modalMode}
        alertType={currentAlertType}
        onSave={(data) => handleSaveAlert(data, currentAlertType)}
      />
    </div>
  );
};

export default AlertsPage;
