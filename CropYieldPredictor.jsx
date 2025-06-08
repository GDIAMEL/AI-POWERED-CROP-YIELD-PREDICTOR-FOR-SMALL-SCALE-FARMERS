import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Cloud, Sun, Droplets, Thermometer, Sprout, TrendingUp, AlertTriangle, CheckCircle, MapPin, Calendar } from 'lucide-react';

const CropYieldPredictor = () => {
  const [formData, setFormData] = useState({
    cropType: 'maize',
    farmSize: 2.5,
    soilPH: 6.5,
    nitrogen: 45,
    phosphorus: 25,
    potassium: 35,
    rainfall: 850,
    temperature: 28,
    humidity: 65,
    plantingDate: '2024-03-15',
    previousYield: 3.2,
    irrigationAccess: true,
    location: 'Central Kenya'
  });

  const [prediction, setPrediction] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const [yieldHistory, setYieldHistory] = useState([]);

  // Simulate weather data
  useEffect(() => {
    const generateWeatherData = () => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months.map(month => ({
        month,
        rainfall: Math.random() * 200 + 50,
        temperature: Math.random() * 10 + 20,
        humidity: Math.random() * 30 + 50
      }));
    };

    const generateYieldHistory = () => {
      const years = ['2019', '2020', '2021', '2022', '2023'];
      return years.map(year => ({
        year,
        predicted: Math.random() * 2 + 2.5,
        actual: Math.random() * 2 + 2.5,
        market_price: Math.random() * 50 + 200
      }));
    };

    setWeatherData(generateWeatherData());
    setYieldHistory(generateYieldHistory());
  }, []);

  // Simplified AI prediction model
  const predictYield = () => {
    const { cropType, farmSize, soilPH, nitrogen, phosphorus, potassium, rainfall, temperature, humidity, previousYield, irrigationAccess } = formData;
    
    // Base yield calculation (simplified neural network simulation)
    let baseYield = 2.0;
    
    // Soil factors
    const optimalPH = cropType === 'maize' ? 6.5 : 6.0;
    const pHFactor = 1 - Math.abs(soilPH - optimalPH) * 0.1;
    
    // Nutrient factors
    const nutrientScore = (nitrogen * 0.4 + phosphorus * 0.3 + potassium * 0.3) / 100;
    
    // Weather factors
    const optimalRainfall = cropType === 'maize' ? 800 : 600;
    const rainfallFactor = 1 - Math.abs(rainfall - optimalRainfall) / 1000;
    
    const optimalTemp = cropType === 'maize' ? 25 : 22;
    const tempFactor = 1 - Math.abs(temperature - optimalTemp) * 0.05;
    
    // Irrigation bonus
    const irrigationBonus = irrigationAccess ? 0.2 : 0;
    
    // Historical performance
    const historyFactor = previousYield / 3.0;
    
    // Calculate final prediction
    const yieldPrediction = baseYield * pHFactor * nutrientScore * rainfallFactor * tempFactor * historyFactor + irrigationBonus;
    
    // Add some realistic variance
    const finalYield = Math.max(0.5, yieldPrediction + (Math.random() - 0.5) * 0.3);
    
    // Risk assessment
    const riskFactors = [];
    if (soilPH < 5.5 || soilPH > 7.5) riskFactors.push('Soil pH outside optimal range');
    if (rainfall < 400) riskFactors.push('Insufficient rainfall expected');
    if (temperature > 35) riskFactors.push('High temperature stress risk');
    if (nitrogen < 30) riskFactors.push('Low nitrogen levels');
    
    const riskLevel = riskFactors.length === 0 ? 'Low' : riskFactors.length <= 2 ? 'Medium' : 'High';
    
    setPrediction({
      yield: finalYield,
      confidence: Math.random() * 20 + 75,
      riskLevel,
      riskFactors,
      profitability: finalYield * 250 - farmSize * 150 // Simplified profit calculation
    });
    
    // Generate recommendations
    const newRecommendations = [];
    
    if (soilPH < 6.0) {
      newRecommendations.push({
        type: 'soil',
        priority: 'high',
        message: 'Apply lime to increase soil pH to optimal range (6.0-7.0)',
        impact: 'Could increase yield by 15-20%'
      });
    }
    
    if (nitrogen < 40) {
      newRecommendations.push({
        type: 'fertilizer',
        priority: 'medium',
        message: 'Consider additional nitrogen application',
        impact: 'Could increase yield by 10-15%'
      });
    }
    
    if (rainfall < 500 && !irrigationAccess) {
      newRecommendations.push({
        type: 'water',
        priority: 'high',
        message: 'Consider drought-resistant varieties or irrigation',
        impact: 'Could prevent 30-50% yield loss'
      });
    }
    
    newRecommendations.push({
      type: 'timing',
      priority: 'low',
      message: 'Optimal planting window is March 15 - April 15',
      impact: 'Maximizes growing season'
    });
    
    setRecommendations(newRecommendations);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-400 bg-red-50';
      case 'medium': return 'border-yellow-400 bg-yellow-50';
      case 'low': return 'border-green-400 bg-green-50';
      default: return 'border-gray-400 bg-gray-50';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-green-50 to-blue-50 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-green-800 mb-2 flex items-center justify-center gap-3">
          <Sprout className="text-green-600" size={40} />
          AI Crop Yield Predictor
        </h1>
        <p className="text-gray-600 text-lg">Empowering smallholder farmers with AI-driven agricultural insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <MapPin size={24} className="text-blue-600" />
              Farm Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Crop Type</label>
                <select 
                  value={formData.cropType} 
                  onChange={(e) => handleInputChange('cropType', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="maize">Maize</option>
                  <option value="wheat">Wheat</option>
                  <option value="rice">Rice</option>
                  <option value="beans">Beans</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Farm Size (hectares)</label>
                <input 
                  type="number" 
                  value={formData.farmSize} 
                  onChange={(e) => handleInputChange('farmSize', parseFloat(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input 
                  type="text" 
                  value={formData.location} 
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Soil pH</label>
                  <input 
                    type="number" 
                    value={formData.soilPH} 
                    onChange={(e) => handleInputChange('soilPH', parseFloat(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Previous Yield</label>
                  <input 
                    type="number" 
                    value={formData.previousYield} 
                    onChange={(e) => handleInputChange('previousYield', parseFloat(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    step="0.1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">N (kg/ha)</label>
                  <input 
                    type="number" 
                    value={formData.nitrogen} 
                    onChange={(e) => handleInputChange('nitrogen', parseInt(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">P (kg/ha)</label>
                  <input 
                    type="number" 
                    value={formData.phosphorus} 
                    onChange={(e) => handleInputChange('phosphorus', parseInt(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">K (kg/ha)</label>
                  <input 
                    type="number" 
                    value={formData.potassium} 
                    onChange={(e) => handleInputChange('potassium', parseInt(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Droplets size={16} className="inline mr-1" />
                    Rainfall (mm)
                  </label>
                  <input 
                    type="number" 
                    value={formData.rainfall} 
                    onChange={(e) => handleInputChange('rainfall', parseInt(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Thermometer size={16} className="inline mr-1" />
                    Temperature (°C)
                  </label>
                  <input 
                    type="number" 
                    value={formData.temperature} 
                    onChange={(e) => handleInputChange('temperature', parseInt(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={formData.irrigationAccess} 
                  onChange={(e) => handleInputChange('irrigationAccess', e.target.checked)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label className="text-sm font-medium text-gray-700">Irrigation Access</label>
              </div>

              <button 
                onClick={predictYield}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 font-semibold flex items-center justify-center gap-2"
              >
                <TrendingUp size={20} />
                Predict Yield
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          {prediction && (
            <div className="space-y-6">
              {/* Prediction Results */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Yield Prediction Results</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gradient-to-r from-green-100 to-green-200 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-700 font-medium">Predicted Yield</p>
                        <p className="text-2xl font-bold text-green-800">{prediction.yield.toFixed(2)} t/ha</p>
                      </div>
                      <Sprout size={32} className="text-green-600" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-700 font-medium">Confidence</p>
                        <p className="text-2xl font-bold text-blue-800">{prediction.confidence.toFixed(1)}%</p>
                      </div>
                      <CheckCircle size={32} className="text-blue-600" />
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${getRiskColor(prediction.riskLevel)}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Risk Level</p>
                        <p className="text-2xl font-bold">{prediction.riskLevel}</p>
                      </div>
                      <AlertTriangle size={32} />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Estimated Profitability</h3>
                  <p className="text-lg">
                    Expected Revenue: <span className="font-bold text-green-600">${(prediction.yield * formData.farmSize * 250).toFixed(0)}</span>
                  </p>
                  <p className="text-lg">
                    Estimated Profit: <span className="font-bold text-blue-600">${(prediction.profitability * formData.farmSize).toFixed(0)}</span>
                  </p>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">AI Recommendations</h2>
                
                <div className="space-y-3">
                  {recommendations.map((rec, index) => (
                    <div key={index} className={`p-4 rounded-lg border-l-4 ${getPriorityColor(rec.priority)}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{rec.message}</p>
                          <p className="text-sm text-gray-600 mt-1">{rec.impact}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          rec.priority === 'high' ? 'bg-red-200 text-red-800' :
                          rec.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                          'bg-green-200 text-green-800'
                        }`}>
                          {rec.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Weather Forecast</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={weatherData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="rainfall" stroke="#3B82F6" strokeWidth={2} />
                  <Line type="monotone" dataKey="temperature" stroke="#EF4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Yield History</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={yieldHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="predicted" fill="#10B981" />
                  <Bar dataKey="actual" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-gray-600">
        <p className="text-sm">
          🌱 Supporting SDG TWO: Zero Hunger | Empowering smallholder farmers with AI-driven insights
        </p>
      </div>
    </div>
  );
};

export default CropYieldPredictor;
