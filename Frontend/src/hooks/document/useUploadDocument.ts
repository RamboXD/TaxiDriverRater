import { AxiosError, AxiosResponse } from 'axios';
import { useClient } from 'contexts/AuthContext';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
// import { Document, DocumentCreate } from 'types/generated';

export interface DocumentUpload extends Omit<any, 'document'> {
  document: File;
}

export default function useUploadDocument(): UseMutationResult<
  AxiosResponse<any>,
  AxiosError<{ message: string }>,
  DocumentUpload
> {
  const client = useClient();
  const queryClient = useQueryClient();

  const createDocument = (payload: DocumentUpload) => {
    const formData = new FormData();

    formData.append('document', payload.document);
    formData.append('documentType', payload.documentType);
    formData.append('verificationRequest', payload.verificationRequest);

    return client.post('documents/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };

  return useMutation(createDocument, {
    onSuccess: () => {
      queryClient.invalidateQueries(['documents']);
    },
  });
}
