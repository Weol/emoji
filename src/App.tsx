import React, { PropsWithChildren, useState } from "react";
import "./App.css";
import {
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Sheet,
  Stack,
  Switch,
  Textarea,
  Tooltip,
  Typography,
  styled,
} from "@mui/joy";
import { Check, ContentCopy, SwapVert, Upload } from "@mui/icons-material";
import { decode, encode, Input } from "./EmojiEncoder";
import { emojisReverse } from "./Emojis";
import { FileDrop } from "react-file-drop";

enum Mode {
  Encode,
  Decode,
}

function countEmojis(text: string) {
  const iterator = text[Symbol.iterator]();
  let char = iterator.next();

  let emojis = 0;
  let nonEmojis = 0;
  while (!char.done) {
    if (emojisReverse.get(char.value)) emojis++;
    else nonEmojis++;

    char = iterator.next();
  }

  return [emojis, nonEmojis];
}

function App() {
  const [input, setInput] = useState<Input>("");
  const [mode, setMode] = useState<Mode>(Mode.Encode);
  const output = mode === Mode.Encode ? encode(input) : decode(input as string);

  const onInputChanged = (input: Input) => {
    setInput(input);
  };

  const onModeSwitched = (mode: Mode) => {
    setMode(mode);
  };

  const onCopyClicked = (output: string) => {
    navigator.clipboard.writeText(output);
  };

  const onSwapClicked = (output: string) => {
    setInput(output);
  };

  return (
    <Container maxWidth="md" sx={{ paddingTop: "1em" }}>
      <Stack>
        <InputBox
          input={input}
          mode={mode}
          onInputChange={onInputChanged}
          onModeSwitch={onModeSwitched}
        />
        <Divider sx={{ marginTop: "1em" }} />
        <Toolbar
          output={output}
          mode={mode}
          onCopyClick={onCopyClicked}
          onSwapClick={onSwapClicked}
        />
        <Divider sx={{ marginBottom: "1em" }} />
        <Output output={output} />
      </Stack>
    </Container>
  );
}

function Output(props: { output: string }) {
  const fontSize = Math.max(20, 60 - Math.floor(props.output.length / 10));

  return (
    <Stack>
      {props.output.split("\n").map((line) => (
        <Typography
          sx={{
            whitespace: "pre-wrap",
            wordWrap: "break-word",
            fontSize: `${fontSize}px`,
          }}
        >
          {line}
        </Typography>
      ))}
    </Stack>
  );
}

function Toolbar(props: {
  output: string;
  mode: Mode;
  onCopyClick: (output: string) => void;
  onSwapClick: (output: string) => void;
}) {
  const [hasCopied, setHasCopied] = useState<boolean>(false);
  const [emojiCount, nonEmojiCount] = countEmojis(props.output);

  const onCopyContentTooltipClose = () => {
    setHasCopied(false);
  };

  const onCopyClick = (evt: React.MouseEvent<HTMLAnchorElement>) => {
    props.onCopyClick(props.output);
  };

  const onSwapClick = (evt: React.MouseEvent<HTMLButtonElement>) => {
    props.onSwapClick(props.output);
  };

  return (
    <Stack
      direction={"row"}
      justifyContent="space-between"
      sx={{ padding: "0 0.5em 0 0.5em" }}
    >
      <Typography alignSelf={"center"} fontSize={16}>
        {props.mode === Mode.Encode
          ? `${emojiCount} emojis`
          : `${emojiCount + nonEmojiCount} characters`}
      </Typography>
      <Stack direction={"row"} spacing={1}>
        <Tooltip
          arrow
          variant="plain"
          onClose={onCopyContentTooltipClose}
          title={
            <Typography
              startDecorator={hasCopied ? <Check color="success" /> : null}
              alignSelf={"center"}
              fontSize={16}
            >
              {hasCopied ? "Output copied" : "Copy output to clipboard"}
            </Typography>
          }
        >
          <IconButton
            sx={{ "&:hover": { bgcolor: "transparent" } }}
            variant="plain"
            onClick={onCopyClick}
          >
            <ContentCopy />
          </IconButton>
        </Tooltip>
        <Tooltip
          arrow
          variant="plain"
          title={
            <Typography alignSelf={"center"} fontSize={16}>
              Copy output to input
            </Typography>
          }
        >
          <IconButton
            sx={{ "&:hover": { bgcolor: "transparent" } }}
            variant="plain"
            onClick={onSwapClick}
          >
            <SwapVert />
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>
  );
}

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function InputBox(props: {
  input: Input;
  onInputChange: (input: Input) => void;
  mode: Mode;
  onModeSwitch: (mode: Mode) => void;
}) {
  const [frameHover, setFrameHover] = useState<boolean>(false);
  const [dropHover, setDropHover] = useState<boolean>(false);
  const [emojiCount, nonEmojiCount] =
    typeof props.input === "string" ? countEmojis(props.input) : [0, 0];
  const sumCount = emojiCount + nonEmojiCount;

  const onTextChanged = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    let text = evt.target.value;
    props.onInputChange(text);
  };

  const onSwitchChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    if (typeof props.input !== "string") props.onInputChange("");
    props.onModeSwitch(props.mode === Mode.Encode ? Mode.Decode : Mode.Encode);
  };

  const onFileUpload = (file: File) => {
    const reader = new FileReader();

    reader.onload = async function (e) {
      if (e.target != null) {
        const bytes = e.target.result as ArrayBuffer;
        const blob = new Blob([bytes]);

        props.onInputChange({
          name: file.name,
          mime: blob.type,
          bytes: new Uint8Array(bytes),
        });
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const onFileDropped = (
    files: FileList | null,
    event: React.DragEvent<HTMLDivElement>
  ) => {
    if (files != null && files.length >= 1) {
      const file = files[0];

      onFileUpload(file);
    }
    setDropHover(false);
    setFrameHover(false);
  };

  const onFileUploadInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files != null && files.length >= 1) {
      const file = files[0];

      onFileUpload(file);
    }
  };

  const onDragFrameEnter = () => {
    setFrameHover(true);
  };

  const onDragFrameExit = () => {
    setFrameHover(false);
  };

  const onDragEnter = () => {
    setDropHover(true);
  };

  const onDragExit = () => {
    setDropHover(false);
  };

  return (
    <Stack direction={"column"} spacing={2}>
      <Box position={"relative"}>
        <FileDrop
          className={
            (frameHover || typeof props.input !== "string") &&
            props.mode !== Mode.Decode
              ? "file-drop-display"
              : "file-drop-hide"
          }
          onFrameDragEnter={onDragFrameEnter}
          onFrameDragLeave={onDragFrameExit}
          onFrameDrop={onDragFrameExit}
          onDragOver={onDragEnter}
          onDragLeave={onDragExit}
          onDrop={onFileDropped}
        >
          <Box
            height="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Sheet
              color={dropHover ? "primary" : "neutral"}
              variant="soft"
              sx={{
                borderRadius: "1em",
                boxShadow: dropHover ? "0 0 7px 0px white;" : "none",
              }}
            >
              <Typography
                display="flex"
                alignSelf={"center"}
                fontSize={18}
                padding={"0.5em"}
              >
                {typeof props.input === "string"
                  ? "Drop file here to encode"
                  : props.input.name}
              </Typography>
            </Sheet>
          </Box>
        </FileDrop>
        <Textarea
          autoFocus
          onChange={onTextChanged}
          color="neutral"
          minRows={2}
          maxRows={10}
          variant="solid"
          sx={{ width: "100%", maxHeight: "80%" }}
          value={typeof props.input === "string" ? props.input : ""}
          placeholder={
            props.mode === Mode.Decode
              ? "Enter emojis here"
              : "Write something here"
          }
          endDecorator={
            <Stack
              width="100%"
              direction={"row"}
              justifyContent="space-between"
              sx={{ padding: "0 0.5em 0 0.5em" }}
            >
              {props.mode === Mode.Decode && sumCount !== emojiCount && (
                <Typography
                  level="body-xs"
                  color="warning"
                  sx={{ paddingRight: "2em" }}
                  fontFamily={"Inconsolata"}
                >
                  Non-emoji characters are ignored
                </Typography>
              )}
              <Typography
                level="body-xs"
                sx={{ ml: "auto" }}
                fontFamily={"Inconsolata"}
              >
                {sumCount} character(s)
              </Typography>
            </Stack>
          }
        />
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        position={"relative"}
      >
        <Switch
          color="neutral"
          size="lg"
          variant="solid"
          checked={props.mode === Mode.Decode}
          onChange={onSwitchChange}
          sx={{ display: "inline-flex", alignSelf: "center" }}
          startDecorator={
            <Typography
              fontFamily={"Inconsolata"}
              fontSize={20}
              fontWeight={props.mode === Mode.Decode ? "auto" : "bold"}
              color={props.mode === Mode.Decode ? "neutral" : "primary"}
            >
              ENCODE
            </Typography>
          }
          endDecorator={
            <Typography
              fontFamily={"Inconsolata"}
              fontSize={20}
              fontWeight={props.mode === Mode.Encode ? "auto" : "bold"}
              color={props.mode === Mode.Encode ? "neutral" : "primary"}
            >
              DECODE
            </Typography>
          }
        />
        {props.mode === Mode.Encode && (
          <Tooltip arrow variant="plain" title="Encode file">
            <IconButton
              component="label"
              sx={{
                display: "flex",
                float: "right",
                position: "absolute",
                right: "0",
              }}
            >
              <VisuallyHiddenInput
                type="file"
                onInput={onFileUploadInput}
                accept="*"
              />
              <Upload />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Stack>
  );
}

export default App;
