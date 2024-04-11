import { useRef, useState } from "react";
import "./App.css";
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  Stack,
  Switch,
  Textarea,
  Tooltip,
  Typography,
} from "@mui/joy";
import { emojis, emojisReverse } from "./emojis";
import {
  Check,
  Clear,
  ContentCopy,
  Delete,
  SwapVert,
  Upload,
} from "@mui/icons-material";

function text2binary(text: string) {
  const encoder = new TextEncoder();

  const utf8bytes = encoder.encode(text);
  const binaries: string[] = [];
  utf8bytes.forEach((byte) => binaries.push(byte.toString(2).padStart(8, "0")));

  return binaries.join("");
}

function binary2blocks(binary: string, size: number): string[] {
  return binary.match(new RegExp(`.{1,${size}}`, "g")) ?? [];
}

function block2index(block: string): number {
  return parseInt(block.padEnd(8, "0"), 2);
}

function text2emoji(text: string) {
  const binary = text2binary(text);
  const padding = binary.length % 10 !== 0 ? 10 - (binary.length % 10) : 0;
  const padded = binary.padEnd(binary.length + padding, "0");
  console.log(
    `Binary length: ${binary.length}, padding ${padding} to ${padded.length}`
  );
  const blocks = binary2blocks(padded, 10);
  const indexes = blocks.map((block) => block2index(block));
  return indexes.map((i) => emojis[i]).join("");
}

function emoji2text(emojis: string) {
  const iterator = emojis[Symbol.iterator]();
  let emoji = iterator.next();

  const binaries: string[] = [];
  while (!emoji.done) {
    const index = emojisReverse.get(emoji.value);
    if (index !== undefined) binaries.push(index.toString(2).padStart(10, "0"));

    emoji = iterator.next();
  }
  var binary = binaries.join("");
  const strip = binary.length % 8;
  var stripped = binary.substring(0, binary.length - strip);

  const decoder = new TextDecoder("utf-8");
  var blocks = binary2blocks(stripped, 8);
  var values = blocks.map((block) => parseInt(block, 2));

  console.log(
    `Binary length: ${binary.length}, stripping ${strip} to ${stripped.length}`
  );

  var utf8bytes = new Uint8Array(values.length);
  for (let i = 0; i < values.length; i++) {
    utf8bytes[i] = values[i];
  }

  const decoded = decoder.decode(utf8bytes);

  return decoded;
}

function checkIfIsOnlyEmojis(text: string) {
  const iterator = text[Symbol.iterator]();
  let emoji = iterator.next();

  const binaries: string[] = [];
  while (!emoji.done) {
    const index = emojisReverse.get(emoji.value);
    if (index === undefined) return false;

    emoji = iterator.next();
  }

  return true;
}

function App() {
  const [text, setText] = useState<string>("");
  const textContainsOnlyEmojis = checkIfIsOnlyEmojis(text);
  const [decode, setDecode] = useState<boolean>(false);
  const output = decode ? emoji2text(text) : text2emoji(text);
  const [hasCopied, setHasCopied] = useState<boolean>(false);

  const emojiFontSize = Math.max(20, 60 - Math.floor(output.length / 10));

  const onTextChanged = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    let text = evt.target.value;
    setText(text);
  };

  const onCopyClicked = () => {
    navigator.clipboard.writeText(output);
    setHasCopied(true);
  };

  const onSwapClicked = () => {
    setText(output);
  };

  const onCopyTooltipClosed = () => {
    setHasCopied(false);
  };

  return (
    <Container maxWidth="md" sx={{ paddingTop: "1em" }}>
      <Stack direction={"column"} width={"100%"} height={"100%"} spacing={2}>
        <Textarea
          autoFocus
          onChange={onTextChanged}
          color="neutral"
          minRows={2}
          maxRows={10}
          variant="solid"
          sx={{ width: "100%", maxHeight: "80%" }}
          value={text}
          placeholder={decode ? "Enter emojis here" : "Write something here"}
          endDecorator={
            <Stack
              width="100%"
              direction={"row"}
              justifyContent="space-between"
              sx={{ padding: "0 0.5em 0 0.5em" }}
            >
              {decode && !textContainsOnlyEmojis && (
                <Typography
                  color="warning"
                  level="body-xs"
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
                {text.length} character(s)
              </Typography>
            </Stack>
          }
        />
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
            checked={decode}
            onChange={() => setDecode(!decode)}
            sx={{ display: "inline-flex", alignSelf: "center" }}
            startDecorator={
              <Typography
                fontFamily={"Inconsolata"}
                fontSize={20}
                fontWeight={decode ? "auto" : "bold"}
                color={decode ? "neutral" : "primary"}
              >
                ENCODE
              </Typography>
            }
            endDecorator={
              <Typography
                fontFamily={"Inconsolata"}
                fontSize={20}
                fontWeight={!decode ? "auto" : "bold"}
                color={!decode ? "neutral" : "primary"}
              >
                DECODE
              </Typography>
            }
          />
          <Tooltip arrow variant="plain" title="Encode file">
            <IconButton
              sx={{
                display: "flex",
                float: "right",
                position: "absolute",
                right: "0",
              }}
            >
              <Upload />
            </IconButton>
          </Tooltip>
        </Box>
        <Stack direction={"column"} width={"100%"} height={"100%"}>
          <Divider />
          <Stack
            direction={"row"}
            justifyContent="space-between"
            sx={{ padding: "0 0.5em 0 0.5em" }}
          >
            <Typography
              alignSelf={"center"}
              fontFamily={"Inconsolata"}
              fontSize={16}
            >
              {output.length} {decode ? "characters" : "emojis"}
            </Typography>
            <Stack direction={"row"} spacing={1}>
              <Tooltip
                arrow
                variant="plain"
                onClose={() => onCopyTooltipClosed()}
                title={
                  <Typography
                    startDecorator={
                      hasCopied ? <Check color="success" /> : null
                    }
                    alignSelf={"center"}
                    fontFamily={"Inconsolata"}
                    fontSize={16}
                  >
                    {hasCopied ? "Output copied" : "Copy output to clipboard"}
                  </Typography>
                }
              >
                <IconButton
                  sx={{ "&:hover": { bgcolor: "transparent" } }}
                  variant="plain"
                  onClick={() => onCopyClicked()}
                >
                  <ContentCopy />
                </IconButton>
              </Tooltip>
              <Tooltip
                arrow
                variant="plain"
                title={
                  <Typography
                    alignSelf={"center"}
                    fontFamily={"Inconsolata"}
                    fontSize={16}
                  >
                    Copy output to input
                  </Typography>
                }
              >
                <IconButton
                  sx={{ "&:hover": { bgcolor: "transparent" } }}
                  variant="plain"
                  onClick={() => onSwapClicked()}
                >
                  <SwapVert />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
          <Divider />
        </Stack>
        {output.split("\n").map((line) => (
          <Typography
            sx={{
              whitespace: "pre-wrap",
              wordWrap: "break-word",
              fontSize: `${emojiFontSize}px`,
            }}
          >
            {line}
          </Typography>
        ))}
      </Stack>
    </Container>
  );
}

export default App;
