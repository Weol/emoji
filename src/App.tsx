import React, { PropsWithChildren, useState } from "react";
import "./App.css";
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  IconButton,
  Link,
  Sheet,
  Stack,
  Switch,
  Textarea,
  Tooltip,
  Typography,
  styled,
} from "@mui/joy";
import {
  Check,
  ContentCopy,
  SwapVert,
  Upload,
  Cancel,
} from "@mui/icons-material";
import { decode, encode, FileData, Input } from "./EmojiEncoder";
import { emojisReverse } from "./Emojis";
import { FileDrop } from "react-file-drop";
import { byteToBase64 } from "./B64";
import { render } from "@testing-library/react";

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

  const onCopyClicked = (output: string | FileData) => {
    if (typeof output === "string") {
      navigator.clipboard.writeText(output);
    } else {
      navigator.clipboard.write([
        new ClipboardItem({ [output.mime]: new Blob([output.bytes]) }),
      ]);
    }
  };

  const onSwapClicked = (output: string | FileData) => {
    setMode(mode === Mode.Encode ? Mode.Decode : Mode.Encode);
    if (typeof output !== "string") {
      setMode(Mode.Encode);
    }
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

function Output(props: { output: string | FileData }) {
  const [viewAsText, setViewAsText] = useState<boolean>(false);

  const fontSize =
    typeof props.output === "string"
      ? Math.max(20, 60 - Math.floor(props.output.length / 10))
      : 20;

  const onViewAsTextClick = () => {
    setViewAsText(!viewAsText);
  };

  const renderFileAsText = (bytes: Uint8Array) => {
    const decoder = new TextDecoder();
    return renderText(decoder.decode(bytes));
  };

  const renderText = (text: string) => (
    <Stack textAlign={"left"}>
      {text.split("\n").map((line) => (
        <pre
          style={{
            margin: "0",
            wordWrap: "break-word",
            whiteSpace: "pre-wrap",
          }}
        >
          <Typography
            sx={{
              fontSize: `${fontSize}px`,
            }}
          >
            {line}
          </Typography>
        </pre>
      ))}
    </Stack>
  );

  return typeof props.output === "string" ? (
    renderText(props.output)
  ) : props.output.mime.toLowerCase().startsWith("image") ? (
    <Stack spacing={2} textAlign={"center"}>
      <Typography fontSize={16}>
        Dette ser ut som en fil. Se forhåndsvisning eller{" "}
        <Link
          href={window.URL.createObjectURL(
            new Blob([props.output.bytes], { type: props.output.mime })
          )}
        >
          last ned
        </Link>
        .
      </Typography>
      <Divider sx={{ width: "100%" }} orientation={"horizontal"}>
        <Typography sx={{ fontFamily: "Inconsolata" }} color="neutral">
          {props.output.name}
        </Typography>
      </Divider>
      {!props.output.mime.toLowerCase().startsWith("image") && (
        <Typography>
          Kan ikke forhåndsvise denne filen.{" "}
          <Link component={"button"} onClick={onViewAsTextClick}>
            Prøv å vis som tekst
          </Link>
        </Typography>
      )}
      {props.output.mime.toLowerCase().startsWith("image") && !viewAsText && (
        <img
          alt={props.output.name}
          style={{ width: "100%" }}
          src={`data:${props.output.mime};base64,${byteToBase64(
            props.output.bytes
          )}`}
        />
      )}
    </Stack>
  ) : (
    <Stack spacing={2} textAlign={"center"}>
      <Typography fontSize={16}>
        Dette ser ut som en fil. Kan ikke forhåndsvise,{" "}
        <Link
          href={window.URL.createObjectURL(
            new Blob([props.output.bytes], { type: props.output.mime })
          )}
        >
          last ned
        </Link>{" "}
        eller{" "}
        <Link component={"button"} onClick={onViewAsTextClick}>
          prøv å vis som tekst
        </Link>
        .
      </Typography>
      {viewAsText && (
        <Divider sx={{ width: "100%" }} orientation={"horizontal"}>
          <Typography sx={{ fontFamily: "Inconsolata" }} color="neutral">
            {props.output.name}
          </Typography>
        </Divider>
      )}
      {viewAsText && renderFileAsText(props.output.bytes)}
    </Stack>
  );
}

function Toolbar(props: {
  output: string | FileData;
  mode: Mode;
  onCopyClick: (output: string | FileData) => void;
  onSwapClick: (output: string | FileData) => void;
}) {
  const [hasCopied, setHasCopied] = useState<boolean>(false);
  const [emojiCount, nonEmojiCount] =
    typeof props.output === "string"
      ? countEmojis(props.output)
      : [props.output.bytes.length, 0];

  const onCopyContentTooltipClose = () => {
    setHasCopied(false);
  };

  const onCopyClick = (evt: React.MouseEvent<HTMLAnchorElement>) => {
    props.onCopyClick(props.output);
    setHasCopied(true);
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
          : `${emojiCount + nonEmojiCount} ${
              typeof props.output === "string" ? "characters" : "bytes"
            }`}
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

  const onClearClick = () => {
    props.onInputChange("");
  };

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

        props.onInputChange({
          name: file.name,
          mime: file.type,
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
            position="relative"
          >
            <Sheet
              color={dropHover ? "primary" : "neutral"}
              variant="soft"
              sx={{
                borderRadius: "0.5em",
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
        <Tooltip arrow variant="plain" title="Reset">
          <IconButton
            onClick={onClearClick}
            component="label"
            sx={{
              display: "flex",
              position: "absolute",
              left: "0",
            }}
          >
            <Cancel />
          </IconButton>
        </Tooltip>
        <Switch
          color="neutral"
          size="lg"
          variant="solid"
          checked={props.mode === Mode.Decode}
          onChange={onSwitchChange}
          sx={{ alignSelf: "center" }}
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
