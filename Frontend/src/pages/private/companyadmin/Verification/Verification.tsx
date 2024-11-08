import { useState } from 'react';

import {
  Stack,
  Flex,
  Text,
  Title,
  Paper,
  Stepper,
  LoadingOverlay,
} from '@mantine/core';
import useDocuments from 'hooks/document/useDocuments';
import useVerificationRequest from 'hooks/verification-request/useVerification';

import CompanyDocumentUploadStep from './components/CompanyDocumentUploadStep.tsx';
import CompleteStep from './components/CompleteStep.tsx';
import PassportUploadStep from './components/PassportUploadStep.tsx';
import PhotoWithPassportUploadStep from './components/PhotoWithPassportUploadStep.tsx';

const Verification = () => {
  const [active, setActive] = useState(0);

  const { data: documents, isLoading: isDocumentsLoading } = useDocuments();

  const {
    data: verificationRequestData,
    isLoading: isVerificationRequestLoading,
  } = useVerificationRequest();

  const isSubmitted = verificationRequestData?.data.status === 'submitted';

  const uploadedPassport = documents?.data.find(
    ({ documentType }) => documentType === 'passport',
  );
  const uploadedPhotoWithPassport = documents?.data.find(
    ({ documentType }) => documentType === 'photo_with_passport',
  );
  const uploadedCompanyDocument = documents?.data.find(
    ({ documentType }) => documentType === 'company_document',
  );

  return (
    <Paper
      shadow='2xl'
      radius='md'
      p='xl'
      maw={520}
      w='100%'
      m='0 auto'
      sx={{ position: 'relative', overflow: 'hidden' }}
    >
      <LoadingOverlay
        visible={isVerificationRequestLoading || isDocumentsLoading}
      />

      <Stack spacing='xl'>
        <Flex direction='column'>
          <Title order={2} weight={700} ta='center'>
            {isSubmitted
              ? 'Your verification is on review'
              : 'Account verification'}
          </Title>
          {!isSubmitted && (
            <Text size='lg' color='dimmed' ta='center'>
              You need to upload 3 documents to verify your account
            </Text>
          )}
        </Flex>

        {isSubmitted && <CompleteStep />}
        {!isSubmitted && verificationRequestData?.data && (
          <Stepper
            active={active}
            onStepClick={setActive}
            orientation='horizontal'
            allowNextStepsSelect={false}
          >
            <Stepper.Step label='Passport'>
              <PassportUploadStep
                verificationRequestId={verificationRequestData?.data.id}
                handleNext={() => setActive(1)}
                uploadedPassport={uploadedPassport}
              />
            </Stepper.Step>
            <Stepper.Step label='Photo with passport'>
              <PhotoWithPassportUploadStep
                verificationRequestId={verificationRequestData?.data.id}
                handleNext={() => setActive(2)}
                uploadedPhotoWithPassport={uploadedPhotoWithPassport}
              />
            </Stepper.Step>
            <Stepper.Step label='Company registration'>
              <CompanyDocumentUploadStep
                verificationRequestId={verificationRequestData?.data.id}
                uploadedCompanyDocument={uploadedCompanyDocument}
              />
            </Stepper.Step>
          </Stepper>
        )}
      </Stack>
    </Paper>
  );
};

export default Verification;
