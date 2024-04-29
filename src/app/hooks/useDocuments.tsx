/* eslint-disable */
// @ts-nocheck
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { Document } from "@prisma/client";

export type DocumentWithCompletion = Document & { completed: boolean };

const useDocuments = (projectId: number, dealStageCheck: number) => {
  const queryClient = useQueryClient();
  const documentsQueryKey = ["documents", projectId, dealStageCheck];

  // Query function for fetching all documents within a project
  const fetchDocuments = async () => {
    const url = `/api/documents?projectId=${projectId}&dealStage=${dealStageCheck}`;
    const response = await axios.get(url);
    return response.data;
  };

  // Using useQuery to manage the fetching of documents
  const { isLoading, isError, data, error } = useQuery({
    queryKey: documentsQueryKey,
    queryFn: fetchDocuments,
  });

  // Mutation for creating a document event
  const documentEventMutation = useMutation({
    mutationFn: ({
      documentId,
      type,
    }: {
      documentId: number;
      type: string;
    }) => {
      const url = `/api/documents`;
      const body = { projectId, documentId, type };
      return axios.post(url, body);
    },
    onMutate: async ({ documentId, type }) => {
      await queryClient.cancelQueries(documentsQueryKey);

      const previousDocuments =
        queryClient.getQueryData(documentsQueryKey) ?? [];

      queryClient.setQueryData(
        documentsQueryKey,
        previousDocuments.map((doc) =>
          doc.id === documentId ? { ...doc, completed: true } : doc
        )
      );

      return { previousDocuments };
    },
    onError: (error, { documentId, type }, context) => {
      // Reverting to previous data if mutation fails
      toast.error(`Failed to update the document: ${error.message}`);
      if (context?.previousDocuments) {
        queryClient.setQueryData(documentsQueryKey, context.previousDocuments);
      }
    },
    onSuccess: (_, { documentId, type }) => {
      toast.success(`Document ${type.toLowerCase()} successfully!`);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure data consistency
      queryClient.invalidateQueries(documentsQueryKey);
    },
  });

  return { isLoading, isError, data, error, documentEventMutation };
};

export default useDocuments;
