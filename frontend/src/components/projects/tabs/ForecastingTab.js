import React, { useState } from 'react';

const ForecastingTab = ({ projectId }) => {
  const [activeSection, setActiveSection] = useState('models'); // 'models' hoặc 'results'
  const [selectedModel, setSelectedModel] = useState(null);
  const [training, setTraining] = useState(false);
  const [trainConfig, setTrainConfig] = useState({
    modelType: 'ARIMA',
    // ARIMA parameters
    p: 1,
    d: 1,
    q: 1,
    // Prophet parameters
    changepoint_prior_scale: 0.05,
    seasonality_prior_scale: 10,
    // LSTM parameters
    epochs: 100,
    batch_size: 32,
    // Common parameters
    horizon: 30,
    startDate: '',
    endDate: '',
    dataset: '',
    products: []
  });

  // Mock data cho danh sách mô hình
  const models = [
    {
      id: 1,
      name: 'ARIMA Model v1',
      type: 'ARIMA',
      mape: 12.5,
      rmse: 45.2,
      mae: 38.7,
      date: '2024-01-15',
      status: 'active'
    },
    {
      id: 2,
      name: 'Prophet Model v1',
      type: 'Prophet',
      mape: 15.2,
      rmse: 52.1,
      mae: 44.3,
      date: '2024-01-10',
      status: 'active'
    }
  ];

  // Mock data cho datasets
  const datasets = [
    { id: 1, name: 'Sales Data 2023', records: 365, uploaded: '2024-01-15' },
    { id: 2, name: 'Inventory Data Q4', records: 90, uploaded: '2024-01-10' },
    { id: 3, name: 'Customer Orders', records: 730, uploaded: '2024-01-05' }
  ];

  // Mock data cho sản phẩm
  const products = [
    { id: 1, name: 'Product A' },
    { id: 2, name: 'Product B' },
    { id: 3, name: 'Product C' },
    { id: 4, name: 'Product D' }
  ];

  const handleTrainModel = async () => {
    setTraining(true);
    console.log('Training model with config:', trainConfig);
    
    // Simulate training process
    setTimeout(() => {
      setTraining(false);
      console.log('Training completed!');
      // Reset form
      setTrainConfig({
        modelType: 'ARIMA',
        p: 1, d: 1, q: 1,
        changepoint_prior_scale: 0.05,
        seasonality_prior_scale: 10,
        epochs: 100,
        batch_size: 32,
        horizon: 30,
        startDate: '',
        endDate: '',
        dataset: '',
        products: []
      });
    }, 3000);
  };

  const handleRetrainModel = (modelId) => {
    setSelectedModel(models.find(m => m.id === modelId));
    // Pre-fill config with existing model settings
    setTrainConfig({
      ...trainConfig,
      modelType: models.find(m => m.id === modelId)?.type || 'ARIMA'
    });
  };

  const handleViewResults = (modelId) => {
    setSelectedModel(models.find(m => m.id === modelId));
    setActiveSection('results');
  };

  const handleExport = (format) => {
    console.log(`Exporting results in ${format} format`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">📈 Forecasting & Results</h2>
      </div>

      {/* Navigation between Models and Results */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveSection('models')}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeSection === 'models'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          1. Mô hình dự báo
        </button>
        <button
          onClick={() => setActiveSection('results')}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeSection === 'results'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          2. Kết quả dự báo
        </button>
      </div>

      {activeSection === 'models' && (
        <div className="space-y-6">
          {/* Train Model Section - Đặt ở đầu */}
          <div className="bg-white border rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">🚀 Train Model</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* 🔽 Loại mô hình */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🔽 Loại mô hình
                </label>
                <select
                  value={trainConfig.modelType}
                  onChange={(e) => setTrainConfig({...trainConfig, modelType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ARIMA">ARIMA</option>
                  <option value="Prophet">Prophet</option>
                  <option value="LSTM">LSTM</option>
                </select>
              </div>

              {/* ⚙️ Tham số mô hình */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ⚙️ Tham số mô hình
                </label>
                {trainConfig.modelType === 'ARIMA' && (
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      placeholder="p"
                      value={trainConfig.p}
                      onChange={(e) => setTrainConfig({...trainConfig, p: parseInt(e.target.value)})}
                      className="px-2 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <input
                      type="number"
                      placeholder="d"
                      value={trainConfig.d}
                      onChange={(e) => setTrainConfig({...trainConfig, d: parseInt(e.target.value)})}
                      className="px-2 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <input
                      type="number"
                      placeholder="q"
                      value={trainConfig.q}
                      onChange={(e) => setTrainConfig({...trainConfig, q: parseInt(e.target.value)})}
                      className="px-2 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                )}
                {trainConfig.modelType === 'Prophet' && (
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="changepoint_prior_scale"
                      value={trainConfig.changepoint_prior_scale}
                      onChange={(e) => setTrainConfig({...trainConfig, changepoint_prior_scale: parseFloat(e.target.value)})}
                      className="px-2 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="seasonality_prior_scale"
                      value={trainConfig.seasonality_prior_scale}
                      onChange={(e) => setTrainConfig({...trainConfig, seasonality_prior_scale: parseFloat(e.target.value)})}
                      className="px-2 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                )}
                {trainConfig.modelType === 'LSTM' && (
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="epochs"
                      value={trainConfig.epochs}
                      onChange={(e) => setTrainConfig({...trainConfig, epochs: parseInt(e.target.value)})}
                      className="px-2 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <input
                      type="number"
                      placeholder="batch_size"
                      value={trainConfig.batch_size}
                      onChange={(e) => setTrainConfig({...trainConfig, batch_size: parseInt(e.target.value)})}
                      className="px-2 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                )}
              </div>

              {/* 📅 Khoảng thời gian */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📅 Khoảng thời gian
                </label>
                <div className="space-y-2">
                  <input
                    type="date"
                    placeholder="Từ ngày"
                    value={trainConfig.startDate}
                    onChange={(e) => setTrainConfig({...trainConfig, startDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="date"
                    placeholder="Đến ngày"
                    value={trainConfig.endDate}
                    onChange={(e) => setTrainConfig({...trainConfig, endDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* 🗂 Chọn tập dữ liệu */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🗂 Chọn tập dữ liệu
                </label>
                <select
                  value={trainConfig.dataset}
                  onChange={(e) => setTrainConfig({...trainConfig, dataset: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn dataset...</option>
                  {datasets.map(dataset => (
                    <option key={dataset.id} value={dataset.id}>
                      {dataset.name} ({dataset.records} records)
                    </option>
                  ))}
                </select>
              </div>

              {/* Horizon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horizon (ngày dự báo)
                </label>
                <input
                  type="number"
                  value={trainConfig.horizon}
                  onChange={(e) => setTrainConfig({...trainConfig, horizon: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="365"
                />
              </div>

              {/* 🚀 Nút Train Model */}
              <div className="flex items-end">
                <button
                  onClick={handleTrainModel}
                  disabled={training}
                  className="w-full bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {training ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Training...
                    </>
                  ) : (
                    '🚀 Train Model'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Danh sách mô hình */}
          <div className="bg-white border rounded-lg">
            <div className="px-6 py-4 border-b bg-gray-50">
              <h3 className="text-lg font-medium">Danh sách mô hình</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên mô hình</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MAPE</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RMSE</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MAE</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày huấn luyện</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {models.map((model) => (
                    <tr key={model.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{model.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{model.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{model.mape}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{model.rmse}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{model.mae}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{model.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleRetrainModel(model.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Retrain
                        </button>
                        <button
                          onClick={() => handleViewResults(model.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Xem kết quả
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'results' && (
        <div className="space-y-6">
          {/* Bộ lọc */}
          <div className="bg-white border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">Bộ lọc</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sản phẩm</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Tất cả</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>{product.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô hình</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Tất cả</option>
                  {models.map(model => (
                    <option key={model.id} value={model.id}>{model.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Line Chart */}
          <div className="bg-white border rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Actual vs Predicted</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleExport('CSV')}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                >
                  CSV
                </button>
                <button
                  onClick={() => handleExport('Excel')}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                >
                  Excel
                </button>
                <button
                  onClick={() => handleExport('PDF')}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                >
                  PDF
                </button>
                <button
                  onClick={() => handleExport('PNG')}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                >
                  PNG
                </button>
              </div>
            </div>
            
            {/* Placeholder cho chart */}
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">📊</div>
                <p className="text-gray-600">Chart sẽ hiển thị ở đây</p>
              </div>
            </div>
          </div>

          {/* Bảng chi tiết */}
          <div className="bg-white border rounded-lg">
            <div className="px-6 py-4 border-b bg-gray-50">
              <h3 className="text-lg font-medium">Bảng chi tiết</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actual</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Predicted</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Error</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2024-01-15</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Product A</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">150</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">145</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">ARIMA Model v1</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2024-01-16</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Product A</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">160</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">158</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">ARIMA Model v1</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForecastingTab; 