'use client';

import React, { createContext, useContext } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import type {
  DealWithOrgMembersAndProject,
  ProjectWithAllNestedData,
} from '@/libs/types';

interface DashboardContextType {
  projects: ProjectWithAllNestedData[];
  deals: DealWithOrgMembersAndProject[];
  isLoading: boolean;
  isError: boolean;
  loggedIn: boolean;
  user: ReturnType<typeof useUser>['user'];
  deleteDeal: (dealId: number) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();

  const pathname = usePathname();
  const loggedIn = !!user;
  const isRequestEnabled = pathname !== '/onboarding' && loggedIn;

  const {
    isLoading: projectsLoading,
    isError: projectsError,
    data: projectsData,
  } = useQuery<ProjectWithAllNestedData[], Error>({
    queryKey: ['project', 'all'],
    queryFn: () =>
      axios
        .get<ProjectWithAllNestedData[]>('/api/public/projects')
        .then(res => res.data),
    enabled: isRequestEnabled,
  });

  const {
    isLoading: dealsLoading,
    isError: dealsError,
    data: dealsData,
    refetch: refetchDeals,
  } = useQuery<DealWithOrgMembersAndProject[], Error>({
    queryKey: ['deals', 'all'],
    queryFn: () =>
      axios
        .get<DealWithOrgMembersAndProject[]>('/api/dashboard/deals')
        .then(res => res.data),
    enabled: isRequestEnabled,
  });

  const deleteDeal = async (dealId: number) => {
    await axios.delete(`/api/dashboard/deals`, { data: { dealId } });
    void refetchDeals();
  };

  const value = {
    projects: projectsData ?? [],
    deals: dealsData ?? [],
    isLoading: projectsLoading || dealsLoading,
    isError: projectsError || dealsError,
    loggedIn,
    user,
    deleteDeal,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}

export default DashboardContext;
