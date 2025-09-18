import React, { useState, useEffect } from 'react';
import { History, Calendar, Eye } from 'lucide-react';

interface HistoryItem {
  _id: string;
  imageUrl: string;
  diagnosis: {
    disease: string;
    confidence: number;
    severity: string;
  };
  notes: string;
  cropType: string;
  createdAt: string;
}

const HistoryTab = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('ikimera_token');
      const response = await fetch('http://localhost:3001/api/history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setHistory(data.uploads || []);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'healthy': return 'status-healthy';
      case 'warning': return 'status-warning';
      case 'infected': return 'status-infected';
      default: return 'status-warning';
    }
  };

  if (selectedItem) {
    return (
      <div className="fade-in">
        <div className="card">
          <div className="card-header">
            <button
              onClick={() => setSelectedItem(null)}
              className="btn btn-secondary"
              style={{ marginRight: '12px' }}
            >
              ← Back
            </button>
            <h2>Diagnosis Details</h2>
          </div>

          <img
            src={`http://localhost:3001${selectedItem.imageUrl}`}
            alt="Crop diagnosis"
            className="uploaded-image"
          />

          <div className="form-group">
            <label className="form-label">Crop Type</label>
            <p>{selectedItem.cropType || 'Not specified'}</p>
          </div>

          <div className="form-group">
            <label className="form-label">Diagnosis</label>
            <div className={`status-badge ${getSeverityClass(selectedItem.diagnosis.severity)}`}>
              <strong>{selectedItem.diagnosis.disease}</strong>
              <span style={{ marginLeft: '8px' }}>
                ({selectedItem.diagnosis.confidence}% confidence)
              </span>
            </div>
          </div>

          {selectedItem.notes && (
            <div className="form-group">
              <label className="form-label">Notes</label>
              <p>{selectedItem.notes}</p>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Date</label>
            <p>{formatDate(selectedItem.createdAt)}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="card">
        <div className="card-header">
          <History size={24} />
          <h2>Diagnosis History</h2>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner" />
          </div>
        ) : history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--neutral-500)' }}>
            <History size={48} style={{ marginBottom: '16px' }} />
            <h3>No diagnoses yet</h3>
            <p>Upload your first crop image to get started!</p>
          </div>
        ) : (
          <div>
            {history.map((item) => (
              <div
                key={item._id}
                className="history-item"
                onClick={() => setSelectedItem(item)}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={`http://localhost:3001${item.imageUrl}`}
                  alt="Crop diagnosis"
                  className="history-image"
                />
                <div className="history-content">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4>{item.diagnosis.disease}</h4>
                      <div className={`status-badge ${getSeverityClass(item.diagnosis.severity)}`} style={{ fontSize: '0.75rem', padding: '2px 8px' }}>
                        {item.diagnosis.confidence}% confidence
                      </div>
                    </div>
                    <Eye size={16} style={{ color: 'var(--neutral-400)' }} />
                  </div>
                  {item.cropType && (
                    <p style={{ fontSize: '0.875rem', color: 'var(--neutral-600)', marginTop: '4px' }}>
                      {item.cropType}
                    </p>
                  )}
                  <div className="history-meta">
                    <Calendar size={14} />
                    {formatDate(item.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryTab;