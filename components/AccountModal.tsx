import React from "react";
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { isEmpty } from "ramda";

import useUser from "../data/useUser";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const AccountModal = (props: Props) => {
  const { isOpen, onClose } = props;
  const form = useForm({
    defaultValues: { email: "", name: "" },
  });
  const { user, updateUser } = useUser();

  React.useEffect(() => {
    if (!isEmpty(user)) {
      form.reset(user);
    }
  }, [form, user]);

  const handleOnSubmit = async (values: { email: string; name: string }) => {
    await updateUser(values);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Account</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={form.handleSubmit(handleOnSubmit)}>
            <FormControl mb="4" isDisabled>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input {...form.register("email")} />
              <FormHelperText>
                {form.formState.errors.email?.message}
              </FormHelperText>
            </FormControl>
            <FormControl mb="4">
              <FormLabel htmlFor="name">Name</FormLabel>
              <Input {...form.register("name")} />
              <FormHelperText>
                {form.formState.errors.name?.message}
              </FormHelperText>
            </FormControl>
            <Button type="submit">Update</Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AccountModal;
