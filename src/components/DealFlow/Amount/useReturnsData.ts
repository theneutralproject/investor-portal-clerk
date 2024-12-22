// hooks/useReturnsData.ts
import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import type {
  ProjectReturnsResponse,
  ProjectReturnsStats,
  ReturnsDateObject,
} from '@/libs/returns/schema';

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
  const [returnsData, setReturnsData] = useState<ReturnsDateObject[]>([]);
  const [stats, setStats] = useState<ProjectReturnsStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const fetchReturnsData = useCallback(
    async (investmentAmount: number) => {
      if (!projectId || investmentAmount < minInvestment) return;

      setIsLoading(true);
      try {
        const { data } = await axios.post<ProjectReturnsResponse>(
          '/api/projects/returns',
          {
            projectId,
            amount: investmentAmount,
            financingType,
          }
        );

        const { stats, schedule } = data;
        setStats(stats);
        setReturnsData(
          schedule.map(item => ({
            ...item,
            date: new Date(item.date),
          }))
        );
        setError('');
      } catch (err) {
        setError(
          axios.isAxiosError(err)
            ? (err.response?.data as { message: string })?.message ||
                'Failed to fetch returns data'
            : 'An error occurred'
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

  return { returnsData, stats, isLoading, error };
};
