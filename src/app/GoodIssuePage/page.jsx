'use client';

import React, { useState, useEffect } from 'react';
import '../../app/globals.css';
import toast, { Toaster } from 'react-hot-toast';
import GoodIssueHeader from '../components/good-issue/GoodIssueHeader';
import GoodIssueToolbar from '../components/good-issue/GoodIssueToolbar';
import GoodIssueTable from '../components/good-issue/GoodIssueTable';
import GoodIssueModal from '../components/good-issue/GoodIssueModal';

const GoodIssuePage = () => {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIssue, setCurrentIssue] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch issues from API
  const fetchIssues = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/goods-issues');
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }
      const data = await res.json();

      const mappedIssues = data.map(issue => ({
        goodIssueId: issue.Good_Issue_Id || issue.goodIssueId,
        itemCode: issue.Item_Code || issue.itemCode,
        itemName: issue.Item_Name || issue.itemName,
        quantity: issue.Quantity || issue.quantity,
        reason: issue.Reason || issue.reason,
        createdDate: issue.Issued_Date || issue.createdDate
          ? new Date(issue.Issued_Date || issue.createdDate).toLocaleDateString()
          : new Date().toLocaleDateString()
      }));

      setIssues(mappedIssues || []);
    } catch (err) {
      console.error('Error fetching issues:', err);
      toast.error(err.message || 'Failed to load issues');
      setIssues([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  // Filter issues
  useEffect(() => {
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      setFilteredIssues(
        issues.filter(issue =>
          issue.goodIssueId?.toString().toLowerCase().includes(lower) ||
          issue.itemCode?.toString().toLowerCase().includes(lower) ||
          issue.itemName?.toString().toLowerCase().includes(lower) ||
          issue.reason?.toString().toLowerCase().includes(lower)
        )
      );
    } else {
      setFilteredIssues(issues);
    }
  }, [searchTerm, issues]);

  const handleAddIssue = () => {
    setCurrentIssue(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEditIssue = (issue) => {
    setCurrentIssue(issue);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteIssue = async (goodIssueId) => {
    toast(t => (
      <div>
        <p className="font-medium">Delete issue {goodIssueId}?</p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const res = await fetch(`/api/goods-issues?Good_Issue_Id=${goodIssueId}`, { method: 'DELETE' });
                if (res.ok) {
                  toast.success('Issue deleted successfully');
                  fetchIssues();
                } else {
                  const errorData = await res.json();
                  toast.error(errorData.error || 'Failed to delete issue');
                }
              } catch (err) {
                console.error('Error deleting issue:', err);
                toast.error(err.message || 'Failed to delete issue');
              }
            }}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
          >
            No
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  const handleSaveIssue = async (issueData) => {
    try {
      let res;
      if (modalMode === 'add') {
        res = await fetch('/api/goods-issues', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            Item_Code: issueData.itemCode,
            Item_Name: issueData.itemName,
            Quantity: parseInt(issueData.quantity),
            Reason: issueData.reason,
            createdDate: issueData.createdDate
          }),
        });
      } else if (modalMode === 'edit') {
        res = await fetch('/api/goods-issues', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            Good_Issue_Id: issueData.goodIssueId,
            Item_Code: issueData.itemCode,
            Item_Name: issueData.itemName,
            Quantity: parseInt(issueData.quantity),
            Reason: issueData.reason,
            Issued_Date: issueData.createdDate
          }),
        });
      }

      if (res.ok) {
        toast.success(modalMode === 'add' ? 'Issue added successfully' : 'Issue updated successfully');
        setIsModalOpen(false);
        fetchIssues();
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || 'Failed to save issue');
      }
    } catch (err) {
      console.error('Error saving issue:', err);
      toast.error('Failed to save issue');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" reverseOrder={false} />
      <GoodIssueHeader searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <main className="container mx-auto p-6">
        <GoodIssueToolbar onAddIssue={handleAddIssue} />
        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading...</div>
        ) : (
          <GoodIssueTable
            issues={filteredIssues}
            onEdit={handleEditIssue}
            onDelete={handleDeleteIssue}
          />
        )}
      </main>
      <GoodIssueModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        issueData={currentIssue}
        mode={modalMode}
        onSave={handleSaveIssue}
      />
    </div>
  );
};

export default GoodIssuePage;
