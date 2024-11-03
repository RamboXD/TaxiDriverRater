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
import { useDisclosure } from '@mantine/hooks';
import { IconCamera, IconPhotoPlus } from '@tabler/icons-react';
import useUploadDocument, {
  DocumentUpload,
} from 'hooks/document/useUploadDocument';
// import { Document } from 'types/generated';
import {
  showErrorNotification,
  showSuccessNotification,
} from 'utils/notifications';

import ModalTakePicture from './ModalTakePicture.tsx';
import UploadedFile from './UploadedFile.tsx';

interface PassportUploadStepProps {
  verificationRequestId: string;
  handleNext: () => void;
  uploadedPhotoWithPassport?: any;
}

const PassportUploadStep = ({
  verificationRequestId,
  handleNext,
  uploadedPhotoWithPassport,
}: PassportUploadStepProps): JSX.Element => {
  const theme = useMantineTheme();

  const uploadDocumentMutation = useUploadDocument();

  const [
    isTakePhotoModalOpened,
    { close: closeTakePhotoModal, open: openTakePhotoModal },
  ] = useDisclosure(false);
  const resetRef = useRef<() => void>(null);

  const clearFile = () => {
    resetRef.current?.();
  };

  const handleUpload = (fileToUpload: File | null) => {
    if (fileToUpload) {
      clearFile();

      const uploadDocumentPayload: DocumentUpload = {
        document: fileToUpload,
        documentType: 'photo_with_passport',
        verificationRequest: verificationRequestId,
      };

      uploadDocumentMutation.mutate(uploadDocumentPayload, {
        onSuccess: () => {
          showSuccessNotification('Photo with passport upload success');
          handleNext();
        },
        onError: (error) => {
          showErrorNotification(
            'Photo with passport upload failed',
            error.response?.data.message || error.message,
          );
        },
      });
    }
  };

  return (
    <Stack spacing='xl'>
      <Text color='dimmed'>
        Please, upload a picture of your passport next to your face
      </Text>

      <Image
        src='/images/face_photo.png'
        alt='face_photo'
        width={236}
        height={180}
        m='0 auto'
      />

      <Group noWrap grow>
        <Button
          fullWidth
          variant='outline'
          loading={uploadDocumentMutation.isLoading}
          onClick={openTakePhotoModal}
          disabled={!!uploadedPhotoWithPassport}
          leftIcon={<IconCamera size={theme.fontSizes.lg} />}
        >
          Take a photo
        </Button>

        <FileButton resetRef={resetRef} onChange={handleUpload} accept='*'>
          {(props) => (
            <Button
              fullWidth
              variant='outline'
              loading={uploadDocumentMutation.isLoading}
              leftIcon={<IconPhotoPlus size={theme.fontSizes.lg} />}
              disabled={!!uploadedPhotoWithPassport}
              {...props}
            >
              Upload a picture
            </Button>
          )}
        </FileButton>
      </Group>

      {uploadedPhotoWithPassport && (
        <UploadedFile document={uploadedPhotoWithPassport} />
      )}

      <Button
        fullWidth
        onClick={handleNext}
        loading={uploadDocumentMutation.isLoading}
        disabled={!uploadedPhotoWithPassport}
      >
        Next
      </Button>

      <ModalTakePicture
        handleUpload={handleUpload}
        opened={isTakePhotoModalOpened}
        onClose={closeTakePhotoModal}
      />
    </Stack>
  );
};

export default PassportUploadStep;
