import Embed from "@editorjs/embed";
import List from "@editorjs/list";
import SimpleImage from "@editorjs/simple-image";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import Link from "@editorjs/link";

export const tools = {
  embed: Embed,
  list: {
    class: List,
    inlineToolbar: true,
  },
  image: SimpleImage,
  header: {
    class: Header,
    config: {
      placeholder: "type heading...",
      levels: [1, 2, 3, 4, 5],
      defaultLevel: 2,
    },
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
  },
  marker: Marker,
  inlineCode: InlineCode,
  link: Link,
};
