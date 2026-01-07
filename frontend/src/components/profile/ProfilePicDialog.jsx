
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Upload, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';

const ProfilePicDialog = ({ isOpen, onClose, currentPic, onSave }) => {
  const [url, setUrl] = useState(currentPic || '');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'link'

  const handleSave = () => {
    if (!url.trim()) {
      setError('Please select an image or enter a URL');
      return;
    }
    onSave(url);
    onClose();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
          setError("File size too large (max 5MB)");
          return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setUrl(reader.result);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b border-gray-100">
          <DialogTitle>Change Profile Photo</DialogTitle>
        </DialogHeader>
        
        <div className="p-4 space-y-6">
          {/* Preview Section */}
          <div className="flex flex-col items-center gap-3">
             <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg ring-1 ring-gray-100 relative group">
                <img 
                    src={url || currentPic || "https://i.pravatar.cc/150"} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                />
             </div>
             <p className="text-xs text-gray-500 font-medium">Preview</p>
          </div>

          {/* Tabs */}
          <div className="flex p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === 'upload' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Upload className="w-4 h-4" />
              Upload
            </button>
            <button
              onClick={() => setActiveTab('link')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === 'link' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <LinkIcon className="w-4 h-4" />
              Link
            </button>
          </div>

          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer relative text-center">
              <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-600">
                <ImageIcon className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Click to upload image</h3>
              <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF (max 5MB)</p>
            </div>
          )}

          {/* Link Tab */}
          {activeTab === 'link' && (
            <div className="space-y-3">
              <Label htmlFor="img-url">Paste image URL</Label>
              <Input 
                id="img-url"
                value={url.startsWith('data:') ? '' : url}
                onChange={(e) => {
                    setUrl(e.target.value);
                    setError('');
                }}
                placeholder="https://example.com/image.jpg"
                className="bg-gray-50 border-gray-200"
              />
              <p className="text-xs text-gray-500">
                Works best with direct links to images (ending in .jpg, .png, etc.)
              </p>
            </div>
          )}
          
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center justify-center">
              {error}
            </div>
          )}
        </div>

        <DialogFooter className="p-4 bg-gray-50 border-t border-gray-100 flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={handleSave} className="bg-mode-blue text-white flex-1 hover:bg-blue-700">
            Save Photo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfilePicDialog;
