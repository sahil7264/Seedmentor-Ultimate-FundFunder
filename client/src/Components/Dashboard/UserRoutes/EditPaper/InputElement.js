import React, { useRef, useState } from "react";
import { Textarea, Button, useToast, Flex, Alert } from "@chakra-ui/react";
// import { Alert, AlertIcon, AlertDescription } from "@chakra-ui/react";
import InfoIcon from '@mui/icons-material/Info';
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  Portal,
} from "@chakra-ui/react";
import {
  ArrowBackIcon,
  ArrowForwardIcon,
  DeleteIcon,
  ExternalLinkIcon,
} from "@chakra-ui/icons";
import { Select } from "@chakra-ui/react";
import { Kbd } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
function InputElement(props) {
  const navigate = useNavigate();
  const [value, setValue] = React.useState(props.value);
  const [value2, setValue2] = React.useState(props.name);
  const newDoc = { ...props.document };
  const toast = useToast();
  const inputValRef = useRef(null);
  const selectRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const handleInputChange = (e) => {
    setValue(e.target.value);
    handleSaveField();
  };
  const handleSave = async () => {
    setIsSaving(true);
    let url =
      "https://seedmentor.onrender.com/api/proposal/update/" + props.id;
    let response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": sessionStorage.getItem("token"),
      },
      body: JSON.stringify(props.document),
    });
    let data = await response.json();
    if (data.success) {
      toast({
        title: data.message,
        status: "success",
        duration: 1500,
        isClosable: true,
        position: "top-right",
        marginTop: "2rem",
      });
      setIsSaving(false);
    } else {
      toast({
        title: "Error",
        description: data.message,
        status: "error",
        duration: 1500,
        isClosable: true,
      });
      setIsSaving(false);
    }
  };
  const handleSaveField = () => {
    newDoc[inputValRef.current.name] = inputValRef.current.value;
    props.setDocument(newDoc);
  };
  const handleSelectChange = () => {
    setValue2(selectRef.current.value);
    let index = selectRef.current.selectedIndex;
    props.setHeaderNum(index);
  };
  const handleDelete = async () => {
    setIsDeleting(true);
    let url =
      "https://seedmentor.onrender.com/api/proposal/delete/" + props.id;
    let response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": sessionStorage.getItem("token"),
      },
    });
    let data = await response.json();
    if (data.success) {
      toast({
        title: data.message,
        status: "success",
        duration: 1500,
        isClosable: true,
        position: "top-right",
        marginTop: "2rem",
      });
      setIsDeleting(false);
      navigate("/dashboard/drafts");
    } else {
      toast({
        title: "Error",
        description: data.message,
        status: "error",
        duration: 1500,
        isClosable: true,
      });
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* SAVE , DELETE AND MANAGE BUTTONS FOR DOCUMENTS */}
      <Flex
        m={8}
        w="100%"
        align="center"
        justify="center"
        wrap={{ base: "wrap", md: "no-wrap", lg: "no-wrap" }}
      >
        {/* SAVING THE DOCUMENT */}
        <Button
        w="300px"
          leftIcon={<SaveOutlinedIcon />}
          mb={8}
          isLoading={isSaving}
          loadingText="Saving"
          onClick={handleSave}
          colorScheme="facebook"
        >
          &nbsp;Save Document{" "}
          <Kbd ml={2} color="white" bg="#171717">
            ctrl
          </Kbd>
          +
          <Kbd color="white" bg="#171717">
            S
          </Kbd>
        </Button>

        {/* DELETING THE DOCUMENT!!!!! */}
        <Popover>
          <PopoverTrigger>
            <Button
              w="300px"
              mb={8}
              colorScheme="red"
              ml={4}
              isLoading={isDeleting}
              loadingText="Deleting..."
            >
              <DeleteIcon />
              &nbsp;Delete Document{" "}
              <Kbd ml={2} color="white" bg="#171717">
                del
              </Kbd>
            </Button>
          </PopoverTrigger>
          <Portal>
            <PopoverContent>
              <PopoverArrow />
              <PopoverHeader display="flex"><InfoIcon/>&nbsp;Delete the Document ?</PopoverHeader>
              <PopoverCloseButton />
              <PopoverBody>
                <Alert status="warning" fontSize="12px">
                All the changes made to this document will be discarded and deleted.
                This Action cannot be undone.
                </Alert>
              </PopoverBody>
              <PopoverFooter>
                <Button size="sm" onClick={handleDelete} colorScheme="red">Yes, Delete</Button>
                </PopoverFooter>
            </PopoverContent>
          </Portal>
        </Popover>

        <Button
          w="300px"
          mb={8}
          colorScheme="messenger"
          ml={4}
          onClick={() => {
            navigate("/dashboard/drafts");
          }}
        >
          <ExternalLinkIcon />
          &nbsp;Manage Documents{" "}
          <Kbd ml={2} color="white" bg="#171717">
            ctrl
          </Kbd>
          +
          <Kbd color="white" bg="#171717">
            M
          </Kbd>
        </Button>
      </Flex>

      <Flex mb={4} align="center" justify="space-between" w="100%">
        {/* PREVIOUS HEADING */}
        <Button
          isDisabled={!props.headerNum}
          onClick={() => {
            handleSaveField();
            props.setHeaderNum(props.headerNum - 1);
          }}
        >
          <ArrowBackIcon />
          Previous
        </Button>

        {/* OPTIONS MENU FOR HEADING */}
        <Select
          w="30vw"
          textAlign="center"
          ref={selectRef}
          value={value2}
          onChange={handleSelectChange}
        >
          {props.headers.map((title, index) => {
            return (
              <option key={index} value={title}>
                {title.toUpperCase().split("_").join(" ")}
              </option>
            );
          })}
        </Select>

        {/* NEXT HEADING */}
        <Button
          display={
            props.headerNum !== props.headers.length - 1 ? "flex" : "none"
          }
          onClick={() => {
            props.setHeaderNum(props.headerNum + 1);
            handleSaveField();
          }}
        >
          Next
          <ArrowForwardIcon />
        </Button>

        {/* SAVE ON LAST HEADING */}
        <Button
          display={
            props.headerNum === props.headers.length - 1 ? "flex" : "none"
          }
          onClick={handleSave}
          leftIcon={<SaveOutlinedIcon />}
          colorScheme="green"
          isLoading={isSaving}
          loadingText="Saving..."
        >
          Save
        </Button>
      </Flex>

      {/* MAIN TEXT AREA */}
      <Textarea
        ref={inputValRef}
        onFocus={(e) =>
          e.currentTarget.setSelectionRange(
            e.currentTarget.value.length,
            e.currentTarget.value.length
          )
        }
        name={props.name}
        textAlign="left"
        value={value}
        placeholder={props.value ? value : "Nothing to show yet"}
        onChange={handleInputChange}
        size="lg"
        resize="none"
        variant="outlined"
        autoFocus={true}
        _focus={{ outline: "none", boxShadow: "none", border: "none" }}
        boxShadow="none"
        h="80vh"
        p={4}
      />

      {/* ALERT FOR USER */}
      {/* <Alert
        mt={8}
        mb={8}
        status="warning"
        display="flex"
        align="center"
        justify="center"
      >
        <AlertDescription w="100%" display="flex" direction="row">
          <AlertIcon />
          You cannot undo the action of saving the field!
        </AlertDescription>
      </Alert> */}
    </>
  );
}

export default InputElement;
