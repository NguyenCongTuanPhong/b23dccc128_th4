import { useState, useCallback, useEffect } from 'react';
import {
  getDiplomaBooks,
  createDiplomaBook,
  getGraduationDecisions,
  createGraduationDecision,
  updateGraduationDecision,
  getDiplomaFormFields,
  createDiplomaFormField,
  updateDiplomaFormField,
  deleteDiplomaFormField,
  getDiplomaInfos,
  createDiplomaInfo,
  searchDiplomaInfo,
} from '@/services/diploma';

// Types
export type DataType = 'String' | 'Number' | 'Date';

// Interfaces
export interface DiplomaFormField {
  id: string;
  name: string;
  dataType: DataType;
  required: boolean;
  order: number;
}

export interface DiplomaBook {
  id: string;
  year: number;
  currentNumber: number;
  createdAt: string;
  updatedAt: string;
}

export interface GraduationDecision {
  id: string;
  number: string;
  issueDate: string;
  summary: string;
  diplomaBookId: string;
  searchCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface DiplomaInfo {
  id: string;
  bookNumber: number;
  diplomaNumber: string;
  studentId: string;
  fullName: string;
  dateOfBirth: string;
  graduationDecisionId: string;
  customFields: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface DiplomaSearchParams {
  diplomaNumber?: string;
  bookNumber?: number;
  studentId?: string;
  fullName?: string;
  dateOfBirth?: string;
}

// Model
export default function useDiplomaModel() {
  const [diplomaBooks, setDiplomaBooks] = useState<DiplomaBook[]>([]);
  const [graduationDecisions, setGraduationDecisions] = useState<GraduationDecision[]>([]);
  const [diplomaFormFields, setDiplomaFormFields] = useState<DiplomaFormField[]>([]);
  const [diplomaInfos, setDiplomaInfos] = useState<DiplomaInfo[]>([]);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [booksRes, decisionsRes, fieldsRes, infosRes] = await Promise.all([
          getDiplomaBooks(),
          getGraduationDecisions(),
          getDiplomaFormFields(),
          getDiplomaInfos(),
        ]);

        if (booksRes.status === 200) setDiplomaBooks(booksRes.data || []);
        if (decisionsRes.status === 200) setGraduationDecisions(decisionsRes.data || []);
        if (fieldsRes.status === 200) setDiplomaFormFields(fieldsRes.data || []);
        if (infosRes.status === 200) setDiplomaInfos(infosRes.data || []);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, []);

  // Diploma Book operations
  const fetchDiplomaBooks = async () => {
    try {
      const response = await getDiplomaBooks();
      if (response.status === 200) {
        setDiplomaBooks(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching diploma books:', error);
      throw error;
    }
  };

  const createBook = useCallback(async (year: number) => {
    try {
      const response = await createDiplomaBook(year);
      if (response.status === 200 && response.data) {
        setDiplomaBooks(prev => [...prev, response.data]);
        return response;
      }
      throw new Error(response.message || 'Failed to create diploma book');
    } catch (error) {
      console.error('Error creating diploma book:', error);
      throw error;
    }
  }, []);

  // Graduation Decision operations
  const createDecision = useCallback(async (data: Omit<GraduationDecision, 'id' | 'createdAt' | 'updatedAt' | 'searchCount'>) => {
    try {
      const response = await createGraduationDecision(data);
      if (response.status === 200 && response.data) {
        setGraduationDecisions(prev => [...prev, response.data]);
        return response.data;
      }
      throw new Error(response.message || 'Failed to create graduation decision');
    } catch (error) {
      console.error('Error creating graduation decision:', error);
      throw error;
    }
  }, []);

  const updateDecision = useCallback(async (id: string, data: Partial<GraduationDecision>) => {
    try {
      const response = await updateGraduationDecision(id, data);
      if (response.status === 200 && response.data) {
        setGraduationDecisions(prev => prev.map(d => d.id === id ? response.data : d));
        return response.data;
      }
      throw new Error(response.message || 'Failed to update graduation decision');
    } catch (error) {
      console.error('Error updating graduation decision:', error);
      throw error;
    }
  }, []);

  // Diploma Form Field operations
  const createFormField = useCallback(async (field: Omit<DiplomaFormField, 'id'>) => {
    try {
      const response = await createDiplomaFormField(field);
      if (response.status === 200 && response.data) {
        setDiplomaFormFields(prev => [...prev, response.data]);
        return response.data;
      }
      throw new Error(response.message || 'Failed to create diploma form field');
    } catch (error) {
      console.error('Error creating diploma form field:', error);
      throw error;
    }
  }, []);

  const updateFormField = useCallback(async (id: string, field: Partial<DiplomaFormField>) => {
    try {
      const response = await updateDiplomaFormField(id, field);
      if (response.status === 200 && response.data) {
        setDiplomaFormFields(prev => prev.map(f => f.id === id ? response.data : f));
        return response.data;
      }
      throw new Error(response.message || 'Failed to update diploma form field');
    } catch (error) {
      console.error('Error updating diploma form field:', error);
      throw error;
    }
  }, []);

  const deleteFormField = useCallback(async (id: string) => {
    try {
      const response = await deleteDiplomaFormField(id);
      if (response.status === 200) {
        setDiplomaFormFields(prev => prev.filter(f => f.id !== id));
      } else {
        throw new Error(response.message || 'Failed to delete diploma form field');
      }
    } catch (error) {
      console.error('Error deleting diploma form field:', error);
      throw error;
    }
  }, []);

  // Diploma Info operations
  const createInfo = useCallback(async (info: Omit<DiplomaInfo, 'id' | 'createdAt' | 'updatedAt' | 'bookNumber'>) => {
    try {
      const response = await createDiplomaInfo(info);
      if (response.status === 200 && response.data) {
        setDiplomaInfos(prev => [...prev, response.data]);
        return response.data;
      }
      throw new Error(response.message || 'Failed to create diploma info');
    } catch (error) {
      console.error('Error creating diploma info:', error);
      throw error;
    }
  }, []);

  // Search diploma info with at least 2 parameters
  const searchInfo = useCallback(async (params: DiplomaSearchParams) => {
    try {
      // Validate at least 2 search parameters
      const filledParams = Object.entries(params).filter(([_, value]) => value !== undefined && value !== '');
      if (filledParams.length < 2) {
        throw new Error('Vui lòng nhập ít nhất 2 thông tin để tìm kiếm');
      }

      const response = await searchDiplomaInfo(params);
      if (response.status === 200) {
        return response.data || [];
      }
      throw new Error(response.message || 'Failed to search diploma info');
    } catch (error) {
      console.error('Error searching diploma info:', error);
      throw error;
    }
  }, []);

  return {
    // State
    diplomaBooks,
    graduationDecisions,
    diplomaFormFields,
    diplomaInfos,

    // Book operations
    fetchDiplomaBooks,
    createBook,

    // Decision operations
    createDecision,
    updateDecision,

    // Form field operations
    createFormField,
    updateFormField,
    deleteFormField,

    // Info operations
    createInfo,
    searchInfo,
  };
}