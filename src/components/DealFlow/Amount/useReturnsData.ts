// hooks/useReturnsData.ts
import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { type ReturnsDataPoint } from "./dealFlow.types";

interface UseReturnsDataProps {
  projectId?: number;
  amount: number;
  minInvestment: number;
  financingType?: string;
}

export const useReturnsData = ({
  projectId,
  amount,
  minInvestment,
  financingType,
}: UseReturnsDataProps) => {
  const [returnsData, setReturnsData] = useState<ReturnsDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchReturnsData = useCallback(
    async (investmentAmount: number) => {
      if (!projectId || investmentAmount < minInvestment) return;

      setIsLoading(true);
      try {
        const { data } = await axios.post<ReturnsDataPoint[]>(
          "/api/projects/returns",
          {
            projectId,
            amount: investmentAmount,
            financingType,
          }
        );

        setReturnsData(
          data.map((item) => ({
            ...item,
            date: new Date(item.date),
          }))
        );
        setError("");
      } catch (err) {
        setError(
          axios.isAxiosError(err)
            ? (err.response?.data as { message: string })?.message ||
                "Failed to fetch returns data"
            : "An error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [projectId, financingType, minInvestment]
  );

  useEffect(() => {
    if (amount >= minInvestment) {
      void fetchReturnsData(amount);
    }
  }, [amount, fetchReturnsData, minInvestment]);

  return { returnsData, isLoading, error };
};
