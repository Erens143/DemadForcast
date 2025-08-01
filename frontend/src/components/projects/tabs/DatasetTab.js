import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DatasetTab = ({ projectId }) => {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [datasetName, setDatasetName] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);

  useEffect(() => {
    fetchDatasets();
  }, [projectId]);

  const fetchDatasets = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8000/projects/${projectId}/datasets/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDatasets(response.data.datasets || []);
    } catch (error) {
      console.error('Error fetching datasets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setDatasetName(file.name.split('.')[0]); // Set default name
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile || !datasetName) {
      setUploadError('Please select a file and enter a name');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('name', datasetName);

      const response = await axios.post(
        `http://localhost:8000/projects/${projectId}/datasets/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log('Dataset uploaded:', response.data);
      setShowUploadModal(false);
      setSelectedFile(null);
      setDatasetName('');
      fetchDatasets(); // Refresh list
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error.response?.data?.detail || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handlePreviewDataset = async (dataset) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8000/datasets/${dataset.id}/preview`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPreviewData(response.data);
      setSelectedDataset(dataset);
    } catch (error) {
      console.error('Error fetching preview:', error);
    }
  };

  const handleAnalyzeDataset = async (dataset) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8000/datasets/${dataset.id}/analysis`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalysisData(response.data);
      setSelectedDataset(dataset);
    } catch (error) {
      console.error('Error analyzing dataset:', error);
    }
  };

  const handleDeleteDataset = async (dataset) => {
    if (!window.confirm(`Are you sure you want to delete "${dataset.name}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/datasets/${dataset.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDatasets(); // Refresh list
    } catch (error) {
      console.error('Error deleting dataset:', error);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading datasets...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">📁 Dataset</h2>
        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Upload Dataset
        </button>
      </div>

      {datasets.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No datasets uploaded</h3>
          <p className="text-gray-600 mb-4">Upload your first dataset to get started with forecasting</p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Upload Dataset
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Dataset List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {datasets.map((dataset) => (
              <div key={dataset.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-900">{dataset.name}</h3>
                  <button
                    onClick={() => handleDeleteDataset(dataset)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>Type: {dataset.file_type.toUpperCase()}</p>
                  <p>Size: {formatFileSize(dataset.file_size)}</p>
                  <p>Rows: {dataset.row_count.toLocaleString()}</p>
                  <p>Columns: {dataset.column_count}</p>
                  <p>Uploaded: {new Date(dataset.uploaded_at).toLocaleDateString()}</p>
                </div>
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => handlePreviewDataset(dataset)}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors"
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => handleAnalyzeDataset(dataset)}
                    className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600 transition-colors"
                  >
                    Analyze
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Preview Modal */}
          {previewData && selectedDataset && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Dataset Preview: {selectedDataset.name}</h3>
                  <button
                    onClick={() => setPreviewData(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        {previewData.columns.map((col, index) => (
                          <th key={index} className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.preview.map((row, rowIndex) => (
                        <tr key={rowIndex} className="border-b">
                          {previewData.columns.map((col, colIndex) => (
                            <td key={colIndex} className="px-4 py-2 text-sm text-gray-900">
                              {row[col]?.toString() || ''}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  Showing first 5 rows of {previewData.total_rows.toLocaleString()} total rows
                </div>
              </div>
            </div>
          )}

          {/* Analysis Modal */}
          {analysisData && selectedDataset && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Dataset Analysis: {selectedDataset.name}</h3>
                  <button
                    onClick={() => setAnalysisData(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Statistics */}
                  <div>
                    <h4 className="font-semibold mb-3">Statistics</h4>
                    <div className="space-y-3">
                      {Object.entries(analysisData.statistics).map(([col, stats]) => (
                        <div key={col} className="border rounded p-3">
                          <h5 className="font-medium text-sm mb-2">{col}</h5>
                          {stats.min !== undefined ? (
                            <div className="text-xs space-y-1">
                              <div>Min: {stats.min}</div>
                              <div>Max: {stats.max}</div>
                              <div>Mean: {stats.mean?.toFixed(2)}</div>
                              <div>Std: {stats.std?.toFixed(2)}</div>
                              <div>Count: {stats.count}</div>
                            </div>
                          ) : (
                            <div className="text-xs space-y-1">
                              <div>Unique values: {stats.unique_count}</div>
                              <div>Most common: {Object.keys(stats.most_common)[0]}</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dataset Info */}
                  <div>
                    <h4 className="font-semibold mb-3">Dataset Information</h4>
                    <div className="space-y-2 text-sm">
                      <div>Total Rows: {analysisData.total_rows.toLocaleString()}</div>
                      <div>Total Columns: {analysisData.total_columns}</div>
                      <div>Columns: {analysisData.columns.join(', ')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold mb-4">Upload Dataset</h2>
            
            {uploadError && (
              <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {uploadError}
              </div>
            )}
            
            <form onSubmit={handleUpload}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dataset Name *
                </label>
                <input
                  type="text"
                  value={datasetName}
                  onChange={(e) => setDatasetName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter dataset name"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File *
                </label>
                <input
                  type="file"
                  onChange={handleFileSelect}
                  accept=".csv,.xlsx,.xls"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: CSV, Excel (.xlsx, .xls)
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatasetTab; 