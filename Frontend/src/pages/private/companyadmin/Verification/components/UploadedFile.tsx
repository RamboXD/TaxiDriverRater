import { ActionIcon, Group, Text, useMantineTheme } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import useDeleteDocument from 'hooks/document/useDeleteDocument';
// import { Document } from 'types/generated';
import { showSuccessNotification } from 'utils/notifications';

type UploadedFileProps = {
  document: any;
};

const UploadedFile = ({ document }: UploadedFileProps) => {
  const theme = useMantineTheme();

  const deleteMutation = useDeleteDocument();

  const handleDelete = () => {
    deleteMutation.mutate(document.id, {
      onSuccess: () => {
        showSuccessNotification('Document delete success');
      },
      onError: () => {
        showSuccessNotification('Document delete failed');
      },
    });
  };

  return (
    <Group spacing='xs' noWrap>
      <ActionIcon color='red' onClick={() => handleDelete()}>
        <IconX size={theme.fontSizes.lg} />
      </ActionIcon>

      <Text
        component='a'
        href={document.fileUrl}
        underline
        size='sm'
        lineClamp={1}
      >
        {document.fileUrl}
      </Text>
    </Group>
  );
};

export default UploadedFile;
