import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, ArrowRight, X, Loader } from 'lucide-react';

export default function PrescriptionModal({ 
  pharmacy, 
  isOpen, 
  onClose, 
  onSubmit,
  isLoading = false,
  className = "" 
}) {
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [notes, setNotes] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    setPrescriptionFile(file);
  };

  const handleSubmit = () => {
    if (!prescriptionFile && !notes) {
      alert('Please upload a prescription or add notes');
      return;
    }

    onSubmit({
      pharmacyId: pharmacy.id,
      file: prescriptionFile,
      notes: notes
    });

    // Reset form
    setPrescriptionFile(null);
    setNotes('');
  };

  const handleClose = () => {
    if (!isLoading) {
      setPrescriptionFile(null);
      setNotes('');
      onClose();
    }
  };

  if (!isOpen || !pharmacy) return null;

  return (
    <div className="fixed inset-0 modal-backdrop z-50 flex items-center justify-center p-6" onClick={handleClose}>
      <div 
        className={`bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${className}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-8 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Upload Prescription</h3>
              <p className="text-cyan-100">Sending to {pharmacy.name}</p>
            </div>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="p-2 hover:bg-white/20 rounded-full transition-colors magnetic-hover interactive-element disabled:opacity-50"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-8">
          <div className="bg-cyan-50 border border-cyan-100 rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-cyan-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-1">Selected Pharmacy</h4>
                <p className="text-sm text-gray-600 mb-2">{pharmacy.name}</p>
                <p className="text-sm text-gray-500">{pharmacy.address}</p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-xs font-medium text-gray-600">Rating:</span>
                  <span className="text-xs font-bold text-yellow-600">★ {pharmacy.rating}</span>
                  <span className="text-xs text-gray-500">({pharmacy.reviews} reviews)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Upload Prescription Image or PDF
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-cyan-500 transition-colors">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="prescription-upload"
                  disabled={isLoading}
                />
                <label htmlFor="prescription-upload" className={`cursor-pointer ${isLoading ? 'opacity-50' : ''}`}>
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-400">
                    PNG, JPG, PDF (max. 10MB)
                  </p>
                </label>
              </div>
              {prescriptionFile && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-800">{prescriptionFile.name}</span>
                  <button
                    onClick={() => setPrescriptionFile(null)}
                    disabled={isLoading}
                    className="ml-auto p-1 hover:bg-green-100 rounded-full transition-colors disabled:opacity-50"
                  >
                    <X className="w-4 h-4 text-green-600" />
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Additional Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Any specific instructions or questions for the pharmacist..."
                disabled={isLoading}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 outline-none transition-all resize-none disabled:opacity-50"
              />
              <p className="text-xs text-gray-500 mt-2">
                Example: "Need urgent delivery", "Allergic to penicillin", etc.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-blue-900 mb-1">What happens next?</h5>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Your prescription will be reviewed by our pharmacist</li>
                    <li>• We'll contact you to confirm availability and pricing</li>
                    <li>• You can pick up in-store or request home delivery</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 btn-enhanced bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-cyan-200 transition-all duration-300 flex items-center justify-center gap-2 magnetic-hover interactive-element disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    Submit Prescription
                    <ArrowRight className="w-5 h-5 animate-float" />
                  </>
                )}
              </button>
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="px-8 py-4 border-2 border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-bold transition-all magnetic-hover interactive-element disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}