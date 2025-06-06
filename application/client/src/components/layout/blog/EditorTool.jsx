// application/client/src/components/layout/blog/EditorTools.jsx

import CheckList from "@editorjs/checklist";
import Code from "@editorjs/code";
import Delimiter from "@editorjs/delimiter";
import Embed from "@editorjs/embed";
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
import ImageTool from "@editorjs/image";
import axios from "axios";

export const getTools = (setBlog) => ({
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
  image: {
    class: ImageTool,
    config: {
      endpoints: {
        byFile: "http://localhost:8000/api/upload/uploadFile",
        byUrl: "http://localhost:8000/api/upload/uploadUrl",
      },
      additionalRequestHeaders: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      uploader: {
        uploadByFile: async (file) => {
          try {
            const formData = new FormData();
            formData.append("image", file);

            const response = await axios.post(
              "http://localhost:8000/api/upload/uploadFile",
              formData,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "access_token"
                  )}`,
                  "Content-Type": "multipart/form-data",
                },
              }
            );

            console.log(response.data.file.url);
            // Add the image URL to blog.images array
            setBlog((prev) => ({
              ...prev,
              images: [...prev.images, response.data.file.url],
            }));

            return response.data;
          } catch (error) {
            console.error("Upload failed:", error);
            throw new Error(error.message);
          }
        },
        uploadByUrl: async (url) => {
          try {
            const response = await axios.post(
              "http://localhost:8000/api/upload/uploadUrl",
              { url },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "access_token"
                  )}`,
                },
              }
            );

            // Add the image URL to blog.images array
            setBlog((prev) => ({
              ...prev,
              images: [...prev.images, response.data.file.url],
            }));

            return response.data;
          } catch (error) {
            console.error("Upload by URL failed:", error);
            throw new Error(error.message);
          }
        },
      },
    },
  },
});
