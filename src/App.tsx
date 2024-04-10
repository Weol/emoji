import { useState } from "react";
import "./App.css";
import {
  Button,
  Container,
  Divider,
  Stack,
  Switch,
  Textarea,
  Typography,
} from "@mui/joy";
import { emojis, emojisReverse } from "./emojis";

function text2binary(text: string) {
  return text
    .split("")
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
    .join("");
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
  const blocks = binary2blocks(padded, 10);
  const indexes = blocks.map((block) => block2index(block));
  return indexes.map((i) => String.fromCodePoint(emojis[i]));
}

function emoji2text(emojis: string) {
  const strip = 10 - ((emojis.length * 10) % 8);

  const asd = emojis.split("").map((emoji) => emoji.charCodeAt(0).toString(16));

  console.log(asd);
  return ["asd"];
}

function App() {
  const [text, setText] = useState<string>("");
  const [decode, setDecode] = useState<boolean>(false);
  const output = decode ? emoji2text(text) : text2emoji(text);

  const emojiFontSize = Math.max(20, 60 - Math.floor(output.length / 10));

  const onTextChanged = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(evt.target.value);
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
        ></Textarea>
        <Switch
          color="neutral"
          size="lg"
          variant="solid"
          checked={decode}
          onChange={() => setDecode(!decode)}
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
        <Divider />
        <Typography
          sx={{ wordWrap: "break-word", fontSize: `${emojiFontSize}px` }}
        >
          {output}
        </Typography>
      </Stack>
    </Container>
  );
}

export default App;
