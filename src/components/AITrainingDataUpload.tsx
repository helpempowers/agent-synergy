'use client';

import { useState, useRef } from 'react';
import { useAITraining } from '@/hooks/useAI';
import { CloudArrowUpIcon, DocumentTextIcon, XMarkIcon, CheckIcon, ExclamationTriangleIcon, BeakerIcon } from '@heroicons/react/24/outline';

interface TrainingDataItem {
  id: string;
  input: string;
  output: string;
  metadata?: Record<string, any>;
}

interface AITrainingDataUploadProps {
  agentId: string;
  onUploadComplete?: (data: TrainingDataItem[]) => void;
  className?: string;
}

export default function AITrainingDataUpload({ 
  agentId, 
  onUploadComplete, 
  className = '' 
}: AITrainingDataUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedData, setUploadedData] = useState<TrainingDataItem[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'upload' | 'review' | 'validation'>('upload');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadTrainingData } = useAITraining();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);
    setValidationErrors([]);

    try {
      const allData: TrainingDataItem[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress((i / files.length) * 100);

        const data = await parseFile(file);
        allData.push(...data);
      }

      setUploadedData(allData);
      setUploadProgress(100);
      setActiveTab('review');
      
      // Auto-validate the data
      setTimeout(() => {
        validateData(allData);
        setActiveTab('validation');
      }, 1000);

    } catch (error) {
      console.error('Error processing files:', error);
      setValidationErrors(['Failed to process uploaded files']);
    } finally {
      setIsUploading(false);
    }
  };

  const parseFile = async (file: File): Promise<TrainingDataItem[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          let data: TrainingDataItem[] = [];

          if (file.name.endsWith('.csv')) {
            data = parseCSV(content);
          } else if (file.name.endsWith('.json')) {
            data = parseJSON(content);
          } else {
            throw new Error(`Unsupported file type: ${file.type}`);
          }

          resolve(data);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const parseCSV = (content: string): TrainingDataItem[] => {
    const lines = content.split('\n').filter(line => line.trim());
    if (lines.length < 2) throw new Error('CSV must have at least a header and one data row');

    const headers = lines[0].split(',').map(h => h.trim());
    const inputIndex = headers.findIndex(h => 
      h.toLowerCase().includes('input') || h.toLowerCase().includes('question') || h.toLowerCase().includes('prompt')
    );
    const outputIndex = headers.findIndex(h => 
      h.toLowerCase().includes('output') || h.toLowerCase().includes('answer') || h.toLowerCase().includes('response')
    );

    if (inputIndex === -1 || outputIndex === -1) {
      throw new Error('CSV must contain input and output columns');
    }

    return lines.slice(1).map((line, index) => {
      const values = line.split(',').map(v => v.trim());
      return {
        id: `csv-${index}`,
        input: values[inputIndex] || '',
        output: values[outputIndex] || '',
        metadata: {
          source: 'csv',
          row: index + 1,
        }
      };
    }).filter(item => item.input.trim() && item.output.trim());
  };

  const parseJSON = (content: string): TrainingDataItem[] => {
    try {
      const data = JSON.parse(content);
      
      if (Array.isArray(data)) {
        return data.map((item, index) => ({
          id: `json-${index}`,
          input: item.input || item.question || item.prompt || '',
          output: item.output || item.answer || item.response || '',
          metadata: {
            source: 'json',
            index,
            ...item.metadata,
          }
        })).filter(item => item.input.trim() && item.output.trim());
      } else if (data.training_data && Array.isArray(data.training_data)) {
        return data.training_data.map((item: any, index: number) => ({
          id: `json-${index}`,
          input: item.input || item.question || item.prompt || '',
          output: item.output || item.answer || item.response || '',
          metadata: {
            source: 'json',
            index,
            ...item.metadata,
          }
        })).filter(item => item.input.trim() && item.output.trim());
      } else {
        throw new Error('Invalid JSON format. Expected array or object with training_data array');
      }
    } catch (error) {
      throw new Error(`Invalid JSON: ${error}`);
    }
  };

  const validateData = (data: TrainingDataItem[]) => {
    const errors: string[] = [];
    
    if (data.length === 0) {
      errors.push('No valid training data found');
    }

    if (data.length < 10) {
      errors.push('Recommended minimum of 10 training examples for effective learning');
    }

    if (data.length > 10000) {
      errors.push('Maximum of 10,000 training examples allowed');
    }

    // Check for duplicate inputs
    const inputs = data.map(item => item.input.toLowerCase().trim());
    const uniqueInputs = new Set(inputs);
    if (uniqueInputs.size < inputs.length * 0.9) {
      errors.push('High number of duplicate inputs detected. Consider deduplicating your data.');
    }

    // Check input/output length
    const shortInputs = data.filter(item => item.input.length < 10).length;
    const shortOutputs = data.filter(item => item.output.length < 5).length;
    
    if (shortInputs > data.length * 0.2) {
      errors.push('Many inputs are very short. Consider providing more context.');
    }
    
    if (shortOutputs > data.length * 0.3) {
      errors.push('Many outputs are very short. Consider providing more detailed responses.');
    }

    setValidationErrors(errors);
  };

  const handleEditItem = (id: string, field: 'input' | 'output', value: string) => {
    setUploadedData(prev => 
      prev.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleDeleteItem = (id: string) => {
    setUploadedData(prev => prev.filter(item => item.id !== id));
  };

  const handleSubmitTraining = async () => {
    if (uploadedData.length === 0) return;

    try {
      setIsUploading(true);
      const result = await uploadTrainingData(agentId, uploadedData);
      
      if (result.success) {
        onUploadComplete?.(uploadedData);
        // Reset form
        setUploadedData([]);
        setValidationErrors([]);
        setActiveTab('upload');
      } else {
        setValidationErrors(result.errors || ['Upload failed']);
      }
    } catch (error) {
      console.error('Failed to upload training data:', error);
      setValidationErrors(['Upload failed: ' + (error instanceof Error ? error.message : 'Unknown error')]);
    } finally {
      setIsUploading(false);
    }
  };

  const resetUpload = () => {
    setUploadedData([]);
    setValidationErrors([]);
    setUploadProgress(0);
    setActiveTab('upload');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BeakerIcon className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-medium text-gray-900">Training Data Upload</h3>
          </div>
          <div className="flex items-center space-x-2">
            {uploadedData.length > 0 && (
              <button
                onClick={resetUpload}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'upload', name: 'Upload', count: 0 },
            { id: 'review', name: 'Review', count: uploadedData.length },
            { id: 'validation', name: 'Validation', count: validationErrors.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
              {tab.count > 0 && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="px-6 py-6">
        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="space-y-6">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragOver
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {isUploading ? 'Processing files...' : 'Upload Training Data'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Drag and drop CSV or JSON files, or click to browse
              </p>
              <div className="mt-6">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".csv,.json"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Choose Files
                </button>
              </div>
            </div>

            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Processing...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Supported Formats</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p><strong>CSV:</strong> Must have columns for input and output data</p>
                <p><strong>JSON:</strong> Array of objects with input/output fields</p>
                <p><strong>Requirements:</strong> Minimum 10 examples, maximum 10,000 examples</p>
              </div>
            </div>
          </div>
        )}

        {/* Review Tab */}
        {activeTab === 'review' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium text-gray-900">
                Review Training Data ({uploadedData.length} items)
              </h4>
              <button
                onClick={() => setActiveTab('validation')}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Continue to Validation
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {uploadedData.map((item, index) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">Item {index + 1}</span>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Input
                      </label>
                      <textarea
                        value={item.input}
                        onChange={(e) => handleEditItem(item.id, 'input', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Output
                      </label>
                      <textarea
                        value={item.output}
                        onChange={(e) => handleEditItem(item.id, 'output', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Validation Tab */}
        {activeTab === 'validation' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium text-gray-900">Data Validation</h4>
              <button
                onClick={handleSubmitTraining}
                disabled={isUploading || uploadedData.length === 0}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Uploading...' : 'Submit Training Data'}
              </button>
            </div>

            {/* Validation Results */}
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <CheckIcon className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    Data Ready for Training
                  </span>
                </div>
                <p className="mt-1 text-sm text-green-700">
                  {uploadedData.length} training examples validated and ready to upload
                </p>
              </div>

              {validationErrors.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">
                      Validation Warnings
                    </span>
                  </div>
                  <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Data Summary */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h5 className="text-sm font-medium text-gray-900 mb-3">Data Summary</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Total Items:</span>
                    <p className="font-medium">{uploadedData.length}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Avg Input Length:</span>
                    <p className="font-medium">
                      {Math.round(uploadedData.reduce((sum, item) => sum + item.input.length, 0) / uploadedData.length)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Avg Output Length:</span>
                    <p className="font-medium">
                      {Math.round(uploadedData.reduce((sum, item) => sum + item.output.length, 0) / uploadedData.length)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <p className="font-medium text-green-600">Ready</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
