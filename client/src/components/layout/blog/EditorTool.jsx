// ./client/src/components/blog/Tools.jsx

import CheckList from "@editorjs/checklist";
import Code from "@editorjs/code";
import Delimiter from "@editorjs/delimiter";
import Embed from "@editorjs/embed";
import Image from "@editorjs/image";
import InlineCode from "@editorjs/inline-code";
import LinkTool from "@editorjs/link";
import List from "@editorjs/list";
import Marker from "@editorjs/marker";
import Quote from "@editorjs/quote";
import Raw from "@editorjs/raw";
import Table from "@editorjs/table";
import Warning from "@editorjs/warning";
import Paragraph from "@editorjs/paragraph";
import Header from "@editorjs/header";
import SimpleImage from "@editorjs/simple-image";

export const tools = {
  image: SimpleImage,
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
    config: {
      placeholder: "Write something",
    },
  },
  embed: Embed,
  table: Table,
  list: List,
  warning: Warning,
  code: Code,
  linkTool: LinkTool,
  header: {
    class: Header,
    config: {
      placeholder: "type heading...",
      levels: [1, 2, 3, 4, 5],
      defaultLevel: 1,
    },
  },

  raw: Raw,
  quote: Quote,
  marker: Marker,
  checklist: CheckList,
  delimiter: Delimiter,
  inlineCode: InlineCode,
};
