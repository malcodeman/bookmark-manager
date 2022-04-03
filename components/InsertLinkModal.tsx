import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Box,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

type Props = {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (values: { url: string }) => void;
};

const schema = yup
  .object({
    url: yup.string().required("URL is required.").url("URL need to be valid."),
  })
  .required();

const InsertLinkModal = (props: Props) => {
  const { isOpen, isLoading, onClose, onSubmit } = props;
  const form = useForm({
    defaultValues: { url: "" },
    resolver: yupResolver(schema),
  });

  React.useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add link</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box as="form" onSubmit={form.handleSubmit(onSubmit)}>
            <FormControl>
              <FormLabel htmlFor="url">URL</FormLabel>
              <Input {...form.register("url")} />
              <FormHelperText>
                {form.formState.errors.url?.message}
              </FormHelperText>
            </FormControl>
            <Button type="submit" isLoading={isLoading}>
              Add
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default InsertLinkModal;
