import React from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface CalendlyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CalendlyModal: React.FC<CalendlyModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Book Your Clarity Call</DialogTitle>
          <DialogDescription>
            Schedule a 15-minute discovery call to see if we're a good fit
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 p-6 pt-0">
          <iframe
            src="https://calendly.com/jason-galavanteer/discovery_call"
            width="100%"
            height="100%"
            frameBorder="0"
            title="Schedule a Clarity Call"
            className="rounded-lg"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalendlyModal;