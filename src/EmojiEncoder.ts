import { emojis, emojisReverse } from "./Emojis";

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

function binary2number(block: string): number {
  return parseInt(block.padEnd(8, "0"), 2);
}

export type FileInput = { name: string; mime: string, bytes: Uint8Array }
export type Input = string | FileInput ;

export function encode(input: Input) {
  let binary: string
  if (typeof(input) === "string") {
    binary = text2binary(input);
  } else {
    let values: Array<number> = [0b111111111, 0b111111111]; 
    const encoder = new TextEncoder();
    const fileNameBytes = encoder.encode(input.name)
    const mimeTypeBytes = encoder.encode(input.mime)

    values.push(fileNameBytes.length)
    fileNameBytes.forEach(byte => values.push(byte))
    values.push(mimeTypeBytes.length)
    mimeTypeBytes.forEach(byte => values.push(byte))
    input.bytes.forEach(byte => values.push(byte));

    binary = values.map(byte => byte.toString(2).padStart(8)).join("");
  }

  const padding = binary.length % 10 !== 0 ? 10 - (binary.length % 10) : 0;
  const padded = binary.padEnd(binary.length + padding, "0");
  const blocks = binary2blocks(padded, 10);
  const indexes = blocks.map((block) => binary2number(block));
  return indexes.map((i) => emojis[i]).join("");
}

export function decode(emojis: string) {
  const binaries: string[] = [];

  const iterator = emojis[Symbol.iterator]();
  let emoji = iterator.next();

  while (!emoji.done) {
    const index = emojisReverse.get(emoji.value);
    if (index !== undefined) binaries.push(index.toString(2).padStart(10, "0"));

    emoji = iterator.next();
  }

  var binary = binaries.join("");
  const strip = binary.length % 8;
  var stripped = binary.substring(0, binary.length - strip);

  var blocks = binary2blocks(stripped, 8);
  var values = blocks.map((block) => parseInt(block, 2));

  var utf8bytes = new Uint8Array(values.length);
  for (let i = 0; i < values.length; i++) {
    utf8bytes[i] = values[i];
  }

  const decoder = new TextDecoder("utf-8");
  const decoded = decoder.decode(utf8bytes);

  return decoded;
}
