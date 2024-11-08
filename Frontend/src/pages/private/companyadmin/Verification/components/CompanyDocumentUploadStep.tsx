import { useRef } from 'react';

import {
  Button,
  FileButton,
  Group,
  Image,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { IconPhotoPlus } from '@tabler/icons-react';
import useUploadDocument, {
  DocumentUpload,
} from 'hooks/document/useUploadDocument';
import useUpdateVerification from 'hooks/verification-request/useUpdateVerification';
// import { Document } from 'types/generated';
import {
  showErrorNotification,
  showSuccessNotification,
} from 'utils/notifications';

import UploadedFile from './UploadedFile.tsx';

interface CompanyDocumentUploadStepProps {
  verificationRequestId: string;
  uploadedCompanyDocument?: Document;
}

const CompanyDocumentUploadStep = ({
  verificationRequestId,
  uploadedCompanyDocument,
}: CompanyDocumentUploadStepProps): JSX.Element => {
  const theme = useMantineTheme();

  const uploadDocumentMutation = useUploadDocument();
  const updateVerificationMutation = useUpdateVerification();

  const resetRef = useRef<() => void>(null);

  const clearFile = () => {
    resetRef.current?.();
  };

  const handleUpload = (fileToUpload: File | null) => {
    if (fileToUpload) {
      clearFile();

      const uploadDocumentPayload: DocumentUpload = {
        document: fileToUpload,
        documentType: 'company_document',
        verificationRequest: verificationRequestId,
      };

      uploadDocumentMutation.mutate(uploadDocumentPayload, {
        onSuccess: () => {
          showSuccessNotification('Company document upload success');
        },
        onError: (error) => {
          showErrorNotification(
            'Company document upload failed',
            error.response?.data.message || error.message,
          );
        },
      });
    }
  };

  const handleSubmit = () => {
    updateVerificationMutation.mutate('submitted', {
      onSuccess: () => {
        showSuccessNotification('User verification submit success');
      },
      onError: (error) => {
        showErrorNotification(
          'User verification submit failed',
          error.response?.data.detail || error.message,
        );
      },
    });
  };

  return (
    <Stack spacing='xl'>
      <Text color='dimmed'>
        Please, upload a copy of company registration document.
      </Text>

      <Image
        src='/images/documents_photo.png'
        alt='face_photo'
        width={236}
        height={180}
        m='0 auto'
      />

      <Group noWrap grow>
        <FileButton resetRef={resetRef} onChange={handleUpload} accept='*'>
          {(props) => (
            <Button
              fullWidth
              variant='outline'
              loading={uploadDocumentMutation.isLoading}
              leftIcon={<IconPhotoPlus size={theme.fontSizes.lg} />}
              disabled={!!uploadedCompanyDocument}
              {...props}
            >
              Upload a picture
            </Button>
          )}
        </FileButton>
      </Group>

      {uploadedCompanyDocument && (
        <UploadedFile document={uploadedCompanyDocument} />
      )}

      <Button
        fullWidth
        onClick={handleSubmit}
        loading={uploadDocumentMutation.isLoading}
        disabled={!uploadedCompanyDocument}
      >
        Submit
      </Button>
    </Stack>
  );
};

export default CompanyDocumentUploadStep;
