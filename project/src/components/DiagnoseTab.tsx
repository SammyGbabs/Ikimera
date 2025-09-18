import React, { useState, useRef } from 'react';
import { Camera, Upload, MapPin } from 'lucide-react';

const DiagnoseTab = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [cropType, setCropType] = useState('');
  const [location, setLocation] = useState({ latitude: null, longitude: null, address: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      handleImageSelect(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleImageSelect(files[0]);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('ikimera_token');
      const formData = new FormData();
      
      formData.append('cropImage', selectedImage);
      formData.append('notes', notes);
      formData.append('cropType', cropType);
      
      if (location.latitude && location.longitude) {
        formData.append('latitude', location.latitude.toString());
        formData.append('longitude', location.longitude.toString());
        formData.append('address', location.address);
      }

      const response = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedImage(null);
    setPreviewUrl('');
    setNotes('');
    setCropType('');
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'healthy': return 'status-healthy';
      case 'warning': return 'status-warning';
      case 'infected': return 'status-infected';
      default: return 'status-warning';
    }
  };

  if (result) {
    return (
      <div className="fade-in">
        <div className="card">
          <div className="card-header">
            <Camera size={24} />
            <h2>Diagnosis Result</h2>
          </div>
          
          {previewUrl && (
            <img src={previewUrl} alt="Crop analysis" className="uploaded-image" />
          )}
          
          <div className={`status-badge ${getSeverityClass(result.diagnosis.severity)}`}>
            <strong>{result.diagnosis.disease}</strong>
            <span style={{ marginLeft: '8px' }}>
              ({result.diagnosis.confidence}% confidence)
            </span>
          </div>

          {result.diagnosis.recommendations && (
            <div style={{ marginTop: '16px' }}>
              <h4>Recommendations:</h4>
              <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                {result.diagnosis.recommendations.map((rec: string, index: number) => (
                  <li key={index} style={{ marginBottom: '4px' }}>{rec}</li>
                ))}
              </ul>
            </div>
          )}

          <button onClick={resetForm} className="btn btn-primary" style={{ marginTop: '16px' }}>
            <Camera size={20} />
            Diagnose Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="card">
        <div className="card-header">
          <Camera size={24} />
          <h2>Crop Diagnosis</h2>
        </div>

        {!selectedImage ? (
          <div
            className={`image-upload-area ${dragOver ? 'dragover' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={48} style={{ color: 'var(--primary)', marginBottom: '16px' }} />
            <h3>Upload Crop Image</h3>
            <p>Drag and drop or click to select an image of your crop leaf</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              style={{ display: 'none' }}
            />
          </div>
        ) : (
          <div>
            <img src={previewUrl} alt="Selected crop" className="uploaded-image" />
            
            <div className="form-group">
              <label className="form-label">Crop Type</label>
              <input
                type="text"
                className="form-input"
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                placeholder="e.g., Tomato, Maize, Bean"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Additional Notes</label>
              <textarea
                className="form-textarea"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe any symptoms or concerns you've noticed..."
              />
            </div>

            <div className="form-group">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={getCurrentLocation}
                style={{ marginBottom: '8px' }}
              >
                <MapPin size={20} />
                Get Current Location
              </button>
              {location.address && (
                <p style={{ fontSize: '0.875rem', color: 'var(--neutral-600)' }}>
                  📍 {location.address}
                </p>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleSubmit}
                className="btn btn-primary"
                disabled={loading}
                style={{ flex: 1 }}
              >
                {loading ? <div className="spinner" /> : <><Camera size={20} />Analyze Crop</>}
              </button>
              
              <button
                onClick={resetForm}
                className="btn btn-secondary"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagnoseTab;