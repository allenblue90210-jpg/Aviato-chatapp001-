
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const ProfilePicDialog = ({ isOpen, onClose, currentPic, onSave }) => {
  const [url, setUrl] = useState(currentPic || '');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!url.trim()) {
      setError('Please enter a valid URL');
      return;
    }
    onSave(url);
    onClose();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
          setError("File size too large (max 2MB)");
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
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Update Profile Picture</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Preview */}
          <div className="flex justify-center">
             <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                <img 
                    src={url || currentPic || "https://i.pravatar.cc/150"} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                />
             </div>
          </div>

          <div className="space-y-2">
            <Label>Upload Image</Label>
            <Input 
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                className="cursor-pointer"
            />
            <p className="text-xs text-gray-500">Max size 2MB</p>
          </div>

          <div className="relative flex items-center gap-2 py-2">
             <div className="h-px bg-gray-200 flex-1"></div>
             <span className="text-xs text-gray-400">OR</span>
             <div className="h-px bg-gray-200 flex-1"></div>
          </div>

          <div className="space-y-2">
            <Label>Image URL</Label>
            <Input 
              value={url}
              onChange={(e) => {
                  setUrl(e.target.value);
                  setError('');
              }}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} className="bg-mode-blue text-white">Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfilePicDialog;
