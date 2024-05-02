import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

type DocumentViewerModalProps = {
  open: boolean;
  onClose: () => void;
  fileUrl: string;
};

const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  open,
  onClose,
  fileUrl,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Document Viewer</DialogTitle>
      <DialogContent>
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
          <Viewer fileUrl={fileUrl} />
        </Worker>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewerModal;
