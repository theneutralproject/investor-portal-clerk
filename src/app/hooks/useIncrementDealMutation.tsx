/* eslint-disable */
// @ts-nocheck
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

const useManageDealMutation = (projectId: number) => {
  const queryClient = useQueryClient();
  const queryKey = ["deal", projectId];

  return useMutation({
    // Accept an operation parameter to determine what mutation function to perform
    mutationFn: (operation: string) => {
      const url = `/api/deals`;
      const body = { projectId, operation };
      return axios.post(url, body);
    },
    onMutate: async (operation: string) => {
      await queryClient.cancelQueries(queryKey);

      const previousData = queryClient.getQueryData(queryKey) ?? {
        dealStage: 0,
      };

      // Optimistic update
      if (operation === "increment") {
        queryClient.setQueryData(queryKey, {
          ...previousData,
          dealStage: previousData.dealStage + 1,
        });
      } else if (operation === "reset") {
        queryClient.setQueryData(queryKey, {
          ...previousData,
          dealStage: 0,
        });
      }

      return { previousData };
    },
    onError: (error, _variables, context) => {
      // Reverting to previous data if mutation fails
      toast.error("Failed to manage deal stage.");
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },
    onSuccess: (_, operation) => {
      if (operation === "increment") {
        toast.success("Deal stage incremented successfully!");
      } else if (operation === "reset") {
        toast.success("Deal stage reset successfully!");
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure data consistency
      queryClient.invalidateQueries(queryKey);
    },
  });
};

export default useManageDealMutation;
