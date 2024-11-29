import React, { useState } from 'react';
import { X, CheckCircle, Edit2, Plus, Trash2 } from 'lucide-react';
import { submitJeux } from '../api/jeux';
import type { TeamCriteriaSubmission } from '../types';

interface DimensionModalProps {
  dimensionId: number;
  dimensionName: string;
  submission: TeamCriteriaSubmission | null;
  onClose: () => void;
  onSubmit: () => void;
  isSubmitted: boolean;
}

export const DimensionModal: React.FC<DimensionModalProps> = ({
  dimensionId,
  dimensionName,
  submission,
  onClose,
  onSubmit,
  isSubmitted,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [criteriaData, setCriteriaData] = useState(submission?.criteria_data || {});
  const [newCriteriaKey, setNewCriteriaKey] = useState('');

  const handleVerify = async () => {
    if (isSubmitted) return;
    
    try {
      const criteriaValues = Object.values(criteriaData);
      
      await submitJeux({
        dimension_id: dimensionId,
        atelier: criteriaValues,
        bbox: [],
      });
      
      onSubmit();
    } catch (error) {
      console.error('Error submitting verification:', error);
      alert('Failed to verify submission. Please try again.');
    }
  };

  const handleEdit = (key: string, value: string) => {
    setCriteriaData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAddCriteria = () => {
    if (!newCriteriaKey.trim()) return;
    
    setCriteriaData(prev => ({
      ...prev,
      [newCriteriaKey]: '',
    }));
    setNewCriteriaKey('');
  };

  const handleDeleteCriteria = (keyToDelete: string) => {
    setCriteriaData(prev => {
      const newData = { ...prev };
      delete newData[keyToDelete];
      return newData;
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">{dimensionName}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Atelier Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Atelier</h3>
              <div className="flex items-center space-x-2">
                {!isSubmitted && isEditing && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newCriteriaKey}
                      onChange={(e) => setNewCriteriaKey(e.target.value)}
                      placeholder="New criteria name"
                      className="px-3 py-1 border rounded-md text-sm"
                    />
                    <button
                      onClick={handleAddCriteria}
                      className="text-green-600 hover:text-green-700 p-1 rounded-md hover:bg-green-50"
                      title="Add new criteria"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                )}
                {!isSubmitted && (
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>{isEditing ? 'Done' : 'Edit'}</span>
                  </button>
                )}
              </div>
            </div>
            
            {Object.entries(criteriaData).map(([key, value], index) => (
              <div key={index} className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    {key}
                  </label>
                  {isEditing && !isSubmitted && (
                    <button
                      onClick={() => handleDeleteCriteria(key)}
                      className="text-red-500 hover:text-red-600 p-1 rounded-md hover:bg-red-50"
                      title="Delete criteria"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {isEditing && !isSubmitted ? (
                  <input
                    type="text"
                    value={value as string}
                    onChange={(e) => handleEdit(key, e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    {value as string}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50 flex justify-end">
          <button
            onClick={handleVerify}
            disabled={isSubmitted}
            className={`
              px-4 py-2 rounded-lg flex items-center space-x-2
              ${isSubmitted 
                ? 'bg-green-100 text-green-700 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
              }
            `}
          >
            {isSubmitted ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Verified</span>
              </>
            ) : (
              <span>Verify</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};