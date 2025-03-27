import { request } from 'umi';
import type { 
  DiplomaBook, 
  GraduationDecision,
  DiplomaFormField,
  DiplomaInfo,
  DiplomaSearchParams,
} from '@/models/diploma';

const baseURL = '/api/diploma';

interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// Helper function to handle API errors
const handleApiError = (error: unknown): never => {
  console.error('API Error:', error);
  if (error instanceof Error) {
    throw error;
  }
  throw new Error(typeof error === 'string' ? error : 'An error occurred while making the request');
};

// Helper function to validate API response
const validateApiResponse = <T>(response: ApiResponse<T> | null | undefined): ApiResponse<T> => {
  if (!response) {
    throw new Error('Không nhận được phản hồi từ server');
  }
  if (response.status !== 200) {
    throw new Error(response.message || 'Lỗi từ server');
  }
  return response;
};

// Helper function to save data to localStorage
const saveToLocalStorage = (key: string, data: unknown): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Diploma Book APIs
export async function getDiplomaBooks(): Promise<ApiResponse<DiplomaBook[]>> {
  try {
    const response = await request<ApiResponse<DiplomaBook[]>>(`${baseURL}/books`, {
      method: 'GET',
    });
    const validatedResponse = validateApiResponse(response);
    if (validatedResponse.status === 200) {
      saveToLocalStorage('diplomaBooks', validatedResponse.data);
    }
    return validatedResponse;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function createDiplomaBook(data: Partial<DiplomaBook>): Promise<ApiResponse<DiplomaBook>> {
  try {
    const response = await request<ApiResponse<DiplomaBook>>(`${baseURL}/books`, {
      method: 'POST',
      data,
    });
    const validatedResponse = validateApiResponse(response);
    if (validatedResponse.status === 200) {
      saveToLocalStorage('createdDiplomaBook', validatedResponse.data);
    }
    return validatedResponse;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function updateDiplomaBook(id: string, data: Partial<DiplomaBook>): Promise<ApiResponse<DiplomaBook>> {
  try {
    const response = await request<ApiResponse<DiplomaBook>>(`${baseURL}/books/${id}`, {
      method: 'PUT',
      data,
    });
    return validateApiResponse(response);
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function deleteDiplomaBook(id: string): Promise<ApiResponse<void>> {
  try {
    const response = await request<ApiResponse<void>>(`${baseURL}/books/${id}`, {
      method: 'DELETE',
    });
    const validatedResponse = validateApiResponse(response);
    if (validatedResponse.status === 200) {
      saveToLocalStorage(`deletedDiplomaBook_${id}`, { deleted: true });
    }
    return validatedResponse;
  } catch (error) {
    throw handleApiError(error);
  }
}

// Graduation Decision APIs
export async function getGraduationDecisions(): Promise<ApiResponse<GraduationDecision[]>> {
  try {
    const response = await request<ApiResponse<GraduationDecision[]>>(`${baseURL}/decisions`, {
      method: 'GET',
    });
    const validatedResponse = validateApiResponse(response);
    if (validatedResponse.status === 200) {
      saveToLocalStorage('graduationDecisions', validatedResponse.data);
    }
    return validatedResponse;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function createGraduationDecision(data: Partial<GraduationDecision>): Promise<ApiResponse<GraduationDecision>> {
  try {
    const response = await request<ApiResponse<GraduationDecision>>(`${baseURL}/decisions`, {
      method: 'POST',
      data,
    });
    const validatedResponse = validateApiResponse(response);
    if (validatedResponse.status === 200) {
      saveToLocalStorage('createdGraduationDecision', validatedResponse.data);
    }
    return validatedResponse;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function updateGraduationDecision(id: string, data: Partial<GraduationDecision>): Promise<ApiResponse<GraduationDecision>> {
  try {
    const response = await request<ApiResponse<GraduationDecision>>(`${baseURL}/decisions/${id}`, {
      method: 'PUT',
      data,
    });
    return validateApiResponse(response);
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function deleteGraduationDecision(id: string): Promise<ApiResponse<void>> {
  try {
    const response = await request<ApiResponse<void>>(`${baseURL}/decisions/${id}`, {
      method: 'DELETE',
    });
    const validatedResponse = validateApiResponse(response);
    if (validatedResponse.status === 200) {
      saveToLocalStorage(`deletedGraduationDecision_${id}`, { deleted: true });
    }
    return validatedResponse;
  } catch (error) {
    throw handleApiError(error);
  }
}

// Diploma Form Field APIs
export async function getDiplomaFormFields(): Promise<ApiResponse<DiplomaFormField[]>> {
  try {
    const response = await request<ApiResponse<DiplomaFormField[]>>(`${baseURL}/fields`, {
      method: 'GET',
    });
    const validatedResponse = validateApiResponse(response);
    if (validatedResponse.status === 200) {
      saveToLocalStorage('diplomaFormFields', validatedResponse.data);
    }
    return validatedResponse;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function createDiplomaFormField(data: Partial<DiplomaFormField>): Promise<ApiResponse<DiplomaFormField>> {
  try {
    const response = await request<ApiResponse<DiplomaFormField>>(`${baseURL}/fields`, {
      method: 'POST',
      data,
    });
    const validatedResponse = validateApiResponse(response);
    if (validatedResponse.status === 200) {
      saveToLocalStorage('createdDiplomaFormField', validatedResponse.data);
    }
    return validatedResponse;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function updateDiplomaFormField(id: string, data: Partial<DiplomaFormField>): Promise<ApiResponse<DiplomaFormField>> {
  try {
    const response = await request<ApiResponse<DiplomaFormField>>(`${baseURL}/fields/${id}`, {
      method: 'PUT',
      data,
    });
    const validatedResponse = validateApiResponse(response);
    if (validatedResponse.status === 200) {
      saveToLocalStorage(`updatedDiplomaFormField_${id}`, validatedResponse.data);
    }
    return validatedResponse;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function deleteDiplomaFormField(id: string): Promise<ApiResponse<void>> {
  try {
    const response = await request<ApiResponse<void>>(`${baseURL}/fields/${id}`, {
      method: 'DELETE',
    });
    const validatedResponse = validateApiResponse(response);
    if (validatedResponse.status === 200) {
      saveToLocalStorage(`deletedDiplomaFormField_${id}`, { deleted: true });
    }
    return validatedResponse;
  } catch (error) {
    throw handleApiError(error);
  }
}

// Diploma Info APIs
export async function getDiplomaInfos(params?: { diplomaBookId?: string }): Promise<ApiResponse<DiplomaInfo[]>> {
  try {
    const response = await request<ApiResponse<DiplomaInfo[]>>(`${baseURL}/infos`, {
      method: 'GET',
      params,
    });
    const validatedResponse = validateApiResponse(response);
    if (validatedResponse.status === 200) {
      saveToLocalStorage('diplomaInfos', validatedResponse.data);
    }
    return validatedResponse;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function createDiplomaInfo(data: Partial<DiplomaInfo>): Promise<ApiResponse<DiplomaInfo>> {
  try {
    // Validate required fields
    if (!data.diplomaNumber) {
      throw new Error('Số hiệu văn bằng không được để trống');
    }
    if (!data.studentId) {
      throw new Error('Mã sinh viên không được để trống');
    }
    if (!data.fullName) {
      throw new Error('Họ tên không được để trống');
    }
    if (!data.dateOfBirth) {
      throw new Error('Ngày sinh không được để trống');
    }
    if (!data.graduationDecisionId) {
      throw new Error('Quyết định tốt nghiệp không được để trống');
    }

    // Format date if needed
    const formattedData = {
      ...data,
      dateOfBirth: new Date(data.dateOfBirth).toISOString().split('T')[0],
    };

    const response = await request<ApiResponse<DiplomaInfo>>(`${baseURL}/infos`, {
      method: 'POST',
      data: formattedData,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const validatedResponse = validateApiResponse(response);
    if (validatedResponse.status === 200) {
      saveToLocalStorage('createdDiplomaInfo', validatedResponse.data);
      console.log('Tạo văn bằng thành công:', validatedResponse.data);
    }
    return validatedResponse;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function updateDiplomaInfo(id: string, data: Partial<DiplomaInfo>): Promise<ApiResponse<DiplomaInfo>> {
  try {
    const response = await request<ApiResponse<DiplomaInfo>>(`${baseURL}/infos/${id}`, {
      method: 'PUT',
      data,
    });
    return validateApiResponse(response);
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function deleteDiplomaInfo(id: string): Promise<ApiResponse<void>> {
  try {
    const response = await request<ApiResponse<void>>(`${baseURL}/infos/${id}`, {
      method: 'DELETE',
    });
    const validatedResponse = validateApiResponse(response);
    if (validatedResponse.status === 200) {
      saveToLocalStorage(`deletedDiplomaInfo_${id}`, { deleted: true });
    }
    return validatedResponse;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function searchDiplomaInfo(params: DiplomaSearchParams): Promise<ApiResponse<DiplomaInfo[]>> {
  try {
    // Validate at least 2 search parameters
    const filledParams = Object.entries(params).filter(([_, value]) => value !== undefined && value !== '');
    if (filledParams.length < 2) {
      throw new Error('Vui lòng nhập ít nhất 2 thông tin để tìm kiếm');
    }

    const response = await request<ApiResponse<DiplomaInfo[]>>(`${baseURL}/infos/search`, {
      method: 'GET',
      params,
    });
    const validatedResponse = validateApiResponse(response);
    if (validatedResponse.status === 200) {
      saveToLocalStorage('searchedDiplomaInfos', validatedResponse.data);
    }
    return validatedResponse;
  } catch (error) {
    throw handleApiError(error);
  }
}

// Validation APIs
export async function validateDiplomaNumber(diplomaNumber: string): Promise<ApiResponse<{ valid: boolean; message?: string }>> {
  try {
    const response = await request<ApiResponse<{ valid: boolean; message?: string }>>(`${baseURL}/validate/diploma-number`, {
      method: 'POST',
      data: { diplomaNumber },
    });
    return validateApiResponse(response);
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function validateStudentId(studentId: string): Promise<ApiResponse<{ valid: boolean; message?: string }>> {
  try {
    const response = await request<ApiResponse<{ valid: boolean; message?: string }>>(`${baseURL}/validate/student-id`, {
      method: 'POST',
      data: { studentId },
    });
    return validateApiResponse(response);
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function validateDiplomaBook(year: number): Promise<ApiResponse<{ valid: boolean; message?: string }>> {
  try {
    const response = await request<ApiResponse<{ valid: boolean; message?: string }>>(`${baseURL}/validate/diploma-book`, {
      method: 'POST',
      data: { year },
    });
    return validateApiResponse(response);
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function validateGraduationDecision(number: string): Promise<ApiResponse<{ valid: boolean; message?: string }>> {
  try {
    const response = await request<ApiResponse<{ valid: boolean; message?: string }>>(`${baseURL}/validate/graduation-decision`, {
      method: 'POST',
      data: { number },
    });
    return validateApiResponse(response);
  } catch (error) {
    throw handleApiError(error);
  }
}