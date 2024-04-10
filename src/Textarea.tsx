import styled from "@emotion/styled";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";

const blue = {
  100: "#DAECFF",
  200: "#b6daff",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  900: "#003A75",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const TextareaAutosize = styled(BaseTextareaAutosize)(
  ({ theme }) => `
    box-sizing: border-box;
    width: 320px;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 8px;
    color: ${grey[300]};
    background: ${grey[900]};
    border: 1px solid ${grey[700]};
    box-shadow: 0px 2px 2px ${grey[900]};
    &:hover {
      border-color: ${blue[400]};
    }
    &:focus {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${blue[600]};
    }
  
    // firefox
    &:focus-visible {
      outline: 0;
    }
  `
);

export default function Textarea() {
  return <TextareaAutosize aria-label="empty textarea" placeholder="Empty" />;
}
