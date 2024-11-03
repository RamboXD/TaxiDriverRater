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
// import { Document } from 'types/generated';
import {
  showErrorNotification,
  showSuccessNotification,
} from 'utils/notifications';

import UploadedFile from './UploadedFile.tsx';

interface PassportUploadStepProps {
  verificationRequestId: string;
  handleNext: () => void;
  uploadedPassport?: any;
}

const PassportUploadStep = ({
  verificationRequestId,
  handleNext,
  uploadedPassport,
}: PassportUploadStepProps): JSX.Element => {
  const theme = useMantineTheme();

  const uploadDocumentMutation = useUploadDocument();

  const resetRef = useRef<() => void>(null);

  const clearFile = () => {
    resetRef.current?.();
  };

  const handleUpload = (fileToUpload: File | null) => {
    if (fileToUpload) {
      clearFile();

      const uploadDocumentPayload: DocumentUpload = {
        document: fileToUpload,
        documentType: 'passport',
        verificationRequest: verificationRequestId,
      };

      uploadDocumentMutation.mutate(uploadDocumentPayload, {
        onSuccess: () => {
          showSuccessNotification('Passport upload success');
          handleNext();
        },
        onError: (error) => {
          showErrorNotification(
            'Passport upload failed',
            error.response?.data.message || error.message,
          );
        },
      });
    }
  };

  return (
    <Stack spacing='xl'>
      <Text color='dimmed'>
        Please, upload a picture of the front side of your passport
      </Text>

      <Image
        src='/images/passport_photo.png'
        alt='passport_photo'
        width={250}
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
              disabled={!!uploadedPassport}
              {...props}
            >
              Upload a picture
            </Button>
          )}
        </FileButton>
      </Group>

      {uploadedPassport && <UploadedFile document={uploadedPassport} />}

      <Button
        fullWidth
        onClick={handleNext}
        loading={uploadDocumentMutation.isLoading}
        disabled={!uploadedPassport}
      >
        Next
      </Button>
    </Stack>
  );
};

export default PassportUploadStep;
