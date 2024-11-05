import React, { useState, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  IconButton,
  CircularProgress,
  Paper,
  Divider,
} from "@mui/material";
import { Upload, Check, X, FileText } from "lucide-react";
import { useDealFlow } from "./DealFlowContext";
import { type OrganizationDocument, type DealDocument } from "@prisma/client";

type UploadStatus = "uploading" | "success" | "error";
type DocumentType = "organization" | "deal";

interface Document {
  display: string;
  key: string;
}

interface DocumentUploadProps {
  documents: Document[];
  type: DocumentType;
}

interface FileUploadState {
  file: File;
  status: UploadStatus;
  error?: string;
}

type UploadState = Record<string, FileUploadState[]>;
type DocumentTypes = OrganizationDocument | DealDocument;

const DealFlowDocumentUpload: React.FC<DocumentUploadProps> = ({
  documents,
  type,
}) => {
  const { organization, deal, refetchOrganization, refetchDeal } =
    useDealFlow();

  const [uploadState, setUploadState] = useState<UploadState>(() => {
    const initial: UploadState = {};
    documents.forEach((doc) => {
      initial[doc.key] = [];
    });
    return initial;
  });

  const resetUploadState = useCallback(() => {
    const initial: UploadState = {};
    documents.forEach((doc) => {
      initial[doc.key] = [];
    });
    setUploadState(initial);
  }, [documents]);

  const handleFileUpload = useCallback(
    async (key: string, file: File, formData: FormData): Promise<void> => {
      try {
        const response = await fetch("/api/documents", {
          method: "POST",
          body: formData,
        });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const responseData = await response.json();

        if (!response.ok) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
          throw new Error(responseData?.error || "Upload failed");
        }

        setUploadState((prev) => ({
          ...prev,
          [key]: (prev[key] ?? []).map((item) =>
            item.file === file ? { ...item, status: "success" as const } : item
          ),
        }));

        // Wait for the state update to complete before refetching
        await Promise.resolve();
        await refetchOrganization();
        await refetchDeal();
        resetUploadState();
      } catch (error) {
        setUploadState((prev) => ({
          ...prev,
          [key]: (prev[key] ?? []).map((item) =>
            item.file === file
              ? {
                  ...item,
                  status: "error" as const,
                  error:
                    error instanceof Error ? error.message : "Upload failed",
                }
              : item
          ),
        }));
      }
    },
    [refetchOrganization, refetchDeal, resetUploadState]
  );

  const handleFileSelect = useCallback(
    async (key: string, file: File) => {
      if (!organization?.id || !deal?.id) {
        console.error("Missing organization or deal ID");
        return;
      }

      console.log("File select triggered:", {
        key,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      });

      // Update state immediately for UI feedback
      setUploadState((prev) => ({
        ...prev,
        [key]: [
          ...(prev[key] ?? []),
          {
            file,
            status: "uploading",
          },
        ],
      }));

      // Prepare form data
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);
      formData.append("organizationId", organization.id.toString());
      formData.append("key", key);
      formData.append("dealId", deal.id.toString());

      // Start upload process
      void handleFileUpload(key, file, formData);
    },
    [organization?.id, deal?.id, handleFileUpload, type]
  );

  const handleRemoveFile = useCallback((key: string, fileToRemove: File) => {
    setUploadState((prev) => ({
      ...prev,
      [key]: (prev[key] ?? []).filter((item) => item.file !== fileToRemove),
    }));
  }, []);

  const getExistingDocuments = useCallback(
    (key: string): Partial<DocumentTypes>[] => {
      if (type === "organization") {
        return (organization?.document?.filter((doc) => doc.key === key) ||
          []) as Partial<OrganizationDocument>[];
      } else {
        return (deal?.document?.filter((doc) => doc.type === key) ||
          []) as Partial<DealDocument>[];
      }
    },
    [organization?.document, deal?.document, type]
  );

  const renderUploadStatus = useCallback((upload: FileUploadState) => {
    switch (upload.status) {
      case "uploading":
        return <CircularProgress size={20} sx={{ ml: 1 }} />;
      case "success":
        return <Check size={20} color="green" style={{ marginLeft: 8 }} />;
      case "error":
        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="caption" color="error" sx={{ mr: 1 }}>
              {upload.error}
            </Typography>
            <X size={20} color="red" />
          </Box>
        );
      default:
        return null;
    }
  }, []);

  const renderDocumentSection = useCallback(
    (
      doc: Document,
      existingDocs: Partial<DocumentTypes>[],
      currentUploads: FileUploadState[]
    ) => (
      <Paper key={doc.key} elevation={1} sx={{ mb: 2, overflow: "hidden" }}>
        <Box sx={{ p: 2, bgcolor: "grey.50" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
            {doc.display}
          </Typography>
        </Box>

        <Divider />

        {existingDocs.length > 0 && (
          <Box>
            <List dense>
              {existingDocs.map((existingDoc) => (
                <ListItem
                  key={existingDoc.id}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                  }}
                >
                  <FileText size={16} style={{ marginRight: 8 }} />
                  <Typography variant="body2">{existingDoc.name}</Typography>
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {currentUploads?.length > 0 && (
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Current Uploads
            </Typography>
            <List dense>
              {currentUploads.map((upload, uploadIndex) => (
                <ListItem
                  key={`${upload.file.name}-${uploadIndex}`}
                  sx={{
                    bgcolor: "grey.50",
                    borderRadius: 1,
                    mb: 0.5,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                    <FileText size={16} style={{ marginRight: 8 }} />
                    <Typography variant="body2">{upload.file.name}</Typography>
                  </Box>

                  {renderUploadStatus(upload)}

                  <IconButton
                    size="small"
                    onClick={() => handleRemoveFile(doc.key, upload.file)}
                    sx={{ ml: 1 }}
                  >
                    <X size={16} />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        <Box sx={{ p: 2, bgcolor: "grey.50" }}>
          <Button
            variant="grayCancel"
            component="label"
            startIcon={<Upload size={18} />}
            size="small"
          >
            Upload New File
            <input
              type="file"
              hidden
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  void handleFileSelect(doc.key, file);
                }
              }}
            />
          </Button>
        </Box>
      </Paper>
    ),
    [handleFileSelect, handleRemoveFile, renderUploadStatus]
  );

  return (
    <Box sx={{ mt: 3 }}>
      <List sx={{ width: "100%" }}>
        {documents.map((doc) => {
          const existingDocs = getExistingDocuments(doc.key);
          const currentUploads = uploadState[doc.key] ?? [];
          return renderDocumentSection(doc, existingDocs, currentUploads);
        })}
      </List>
    </Box>
  );
};

export default DealFlowDocumentUpload;
