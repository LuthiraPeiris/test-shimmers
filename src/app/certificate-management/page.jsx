'use client'
import "../globals.css"
import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Header from '../components/certificate-management/Header';
import Toolbar from '../components/certificate-management/Toolbar';
import CertificatesTable from '../components/certificate-management/CertificatesTable';
import CertificateModal from '../components/certificate-management/CertificateModal';

const App = () => {
    const [certificates, setCertificates] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCertificate, setCurrentCertificate] = useState(null);
    const [modalMode, setModalMode] = useState('add');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCertificates, setTotalCertificates] = useState(0);
    const certificatesPerPage = 20;

    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const response = await fetch(`/api/certificate-management?page=${currentPage}&limit=${certificatesPerPage}&search=${searchTerm}`);
                const data = await response.json();
                setCertificates(data.certificates);
                setTotalCertificates(data.total);
            } catch (error) {
                console.error('Error fetching certificates:', error);
                toast.error('Failed to fetch certificates. Please try again.');
            }
        };
        fetchCertificates();
    }, [currentPage, searchTerm]);

    const handleAddCertificate = () => {
        setCurrentCertificate(null);
        setModalMode('add');
        setIsModalOpen(true);
    };

    const handleEditCertificate = (certificate) => {
        setCurrentCertificate(certificate);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleDeleteCertificate = async (regId) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete certificate ${regId}?`);
        if (confirmDelete) {
            const deletePromise = fetch(`/api/certificate-management/${regId}`, { method: 'DELETE' });
            
            toast.promise(
                deletePromise,
                {
                    loading: 'Deleting certificate...',
                    success: () => {
                        setCertificates(certificates.filter(cert => cert.regId !== regId));
                        setTotalCertificates(prev => prev - 1);
                        return 'Certificate deleted successfully!';
                    },
                    error: 'Failed to delete certificate. Please try again.',
                }
            );
        }
    };

    const handleViewCertificate = (certificate) => {
        setCurrentCertificate(certificate);
        setModalMode('view');
        setIsModalOpen(true);
    };

    const handleSaveCertificate = async (certificateData) => {
        try {
            let response;
            const isEdit = modalMode === 'edit';
            
            const savePromise = isEdit 
                ? fetch(`/api/certificate-management/${certificateData.regId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(certificateData),
                })
                : fetch('/api/certificate-management', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(certificateData),
                });

            const newOrUpdatedCert = await toast.promise(
                savePromise,
                {
                    loading: isEdit ? 'Updating certificate...' : 'Adding certificate...',
                    success: isEdit ? 'Certificate updated successfully!' : 'Certificate added successfully!',
                    error: isEdit ? 'Failed to update certificate.' : 'Failed to add certificate.',
                }
            );

            const result = await newOrUpdatedCert.json();
            
            if (modalMode === 'add') {
                setCertificates([...certificates, result]);
                setTotalCertificates(prev => prev + 1);
            } else {
                setCertificates(certificates.map(cert =>
                    cert.regId === result.regId ? result : cert
                ));
            }
            setIsModalOpen(false);
            
        } catch (error) {
            console.error('Error saving certificate:', error);
            toast.error('Error saving certificate. Please try again.');
        }
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        setCurrentPage(1);
        if (term) {
            toast.success(`Searching for: ${term}`);
        }
    };

    const handlePreviousPage = () => {
        setCurrentPage(prev => Math.max(1, prev - 1));
    };

    const handleNextPage = () => {
        const totalPages = Math.ceil(totalCertificates / certificatesPerPage);
        setCurrentPage(prev => Math.min(totalPages, prev + 1));
    };

    return (
        <div className="min-h-screen bg-white">
            <Toaster 
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: {
                        duration: 3000,
                        style: {
                            background: '#22c55e',
                        },
                    },
                    error: {
                        duration: 5000,
                        style: {
                            background: '#ef4444',
                        },
                    },
                }}
            />
            <Header title="Certificates Management System" onSearch={handleSearch} />
            <main className="container mx-auto p-4">
                <Toolbar
                    onAddCertificate={handleAddCertificate}
                    currentPage={currentPage}
                    totalPages={Math.ceil(totalCertificates / certificatesPerPage)}
                    totalCertificates={totalCertificates}
                    onPreviousPage={handlePreviousPage}
                    onNextPage={handleNextPage}
                />
                <CertificatesTable
                    certificates={certificates}
                    onEdit={handleEditCertificate}
                    onDelete={handleDeleteCertificate}
                    onView={handleViewCertificate}
                />
            </main>
            <CertificateModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                certificateData={currentCertificate}
                mode={modalMode}
                onSave={handleSaveCertificate}
            />
        </div>
    );
};

export default App;
