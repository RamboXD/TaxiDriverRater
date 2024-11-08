import { useRef } from 'react';

import {
  Button,
  Group,
  Modal,
  ModalProps,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import Webcam from 'react-webcam';

interface ModalTakePictureProps extends Pick<ModalProps, 'opened' | 'onClose'> {
  handleUpload: (file: File) => void;
}

const ModalTakePicture = ({
  opened,
  onClose,
  handleUpload,
}: ModalTakePictureProps) => {
  const webcamRef = useRef<Webcam>(null);

  const handleSubmit = async () => {
    if (!webcamRef || !webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();

    if (!imageSrc) return;

    const res: Response = await fetch(imageSrc);
    const blob: Blob = await res.blob();
    handleUpload(new File([blob], 'screenshot.webp', { type: 'image/webp' }));
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Title order={3}>Take a photo</Title>}
      centered
      size='lg'
    >
      <Stack>
        <Text>Take a photo of your passport next to your face</Text>
        <Webcam width='100%' ref={webcamRef} mirrored />
        <Group position='right' grow>
          <Button variant='default' onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Take a photo</Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default ModalTakePicture;
