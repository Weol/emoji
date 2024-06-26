import { emojis, emojisReverse } from "./Emojis";

export function encodeString(input: string) {
  const encoder = new TextEncoder();
  const bytes = Array.from(encoder.encode(input))
  const binaryBlocks = bytes.map(byte => byte.toString(2).padStart(8, "0"));
  const binary = binaryBlocks.join("")
  const padding = (bytes.length % 5) * 2
  const padded = binary.padEnd(binary.length + padding, "0");
  const blocks = padded.match(new RegExp(`.{1,10}`, "g")) ?? [];
  const indexes = blocks.map((block) => parseInt(block, 2));
  const encoded = indexes.map(index => emojis[index])
  const output = encoded.join("")
  return output
}

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

export type FileData = { name: string; mime: string, bytes: Uint8Array }
export type Input = string | FileData ;

export function encode(input: Input) {
  let binary: string
  if (typeof(input) === "string") {
    binary = text2binary(input);
  } else {
    let values: Array<number> = [0b11111111, 0b11111111]; 
    const encoder = new TextEncoder();
    const fileNameBytes = encoder.encode(input.name)
    const mimeTypeBytes = encoder.encode(input.mime)
    console.log(input.mime)

    values.push(fileNameBytes.length)
    values.push(mimeTypeBytes.length)
    fileNameBytes.forEach(byte => values.push(byte))
    mimeTypeBytes.forEach(byte => values.push(byte))
    input.bytes.forEach(byte => values.push(byte));

    console.log(values)
    binary = values.map(byte => byte.toString(2).padStart(8, "0")).join("");
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
    if (index !== undefined) 
      binaries.push(index.toString(2).padStart(10, "0"));
    
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
  if (utf8bytes[0] === 0b11111111 && utf8bytes[1] === 0b11111111) {
    const fileNameLength = utf8bytes[2]
    const mimeTypeLength = utf8bytes[3]

    const fileName = decoder.decode(utf8bytes.slice(4, 4 + fileNameLength))
    const mimeType = decoder.decode(utf8bytes.slice(4 + fileNameLength, 4 + fileNameLength + mimeTypeLength))
  
    return {
      name: fileName,
      mime: mimeType,
      bytes: utf8bytes.slice(4 + fileNameLength + mimeTypeLength)
    } as FileData
  }

  const decoded = decoder.decode(utf8bytes);

  return decoded;
}
