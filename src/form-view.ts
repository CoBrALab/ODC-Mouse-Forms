import lz from "lz-string";

type EditorFile = {
  content: string;
  name: string;
};

type EncodedInstrument = {
  files: EditorFile[];
  label: string;
};

function encodeFiles(files: EditorFile[]): string {
  return lz.compressToEncodedURIComponent(JSON.stringify(files));
}

function encodeShareURL({ files, label }: EncodedInstrument): URL {
  const url = new URL("https://playground.opendatacapture.org");
  url.searchParams.append("files", encodeFiles(files));
  url.searchParams.append("label", lz.compressToEncodedURIComponent(label));
  return url;
}

export default function formViewer() {
  // if instrument contain more than just an index file, handle this case
  const textFiles: { [filepath: string]: string } = import.meta.glob(
    "../lib/forms/**/index.{js,jsx,ts,tsx}",
    {
      eager: true,
      import: "default",
      query: "?raw",
    }
  );

  const ul = document.createElement("ul");

  for (const filepath in textFiles) {
    const li = document.createElement("li");
    const formLabel = filepath.split("/")[3]
    li.innerHTML = `<span>${formLabel}</span>: <a target="_blank" href=${encodeShareURL(
      {
        label: formLabel,
        files: [
          { name: filepath.split("/").at(-1)!, content: textFiles[filepath] },
        ],
      }
    )}>Link</a>`;
    ul.appendChild(li);
  }

  const appElement = document.querySelector<HTMLDivElement>('#app');
  
  if (!appElement) {
    console.error("Could not find app element");
    return null;
  }
  return appElement.appendChild(ul);
}
