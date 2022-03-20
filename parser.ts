import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.21-alpha/deno-dom-wasm.ts";

export const links = async (content: string) => {
  let _content = content;
  const regex = /\[(.+)\]\("(.+)"\)/;

  let match = null;
  do {
    match = regex.exec(_content);
    if (match) {
      const pageContent = await fetch(match[2]).then((res) => res.text());
      console.log(pageContent);
      const doc: any = new DOMParser().parseFromString(pageContent, "text/html");
      const titles = doc.querySelectorAll("title");
      console.log(titles);
      const title = titles[titles.length - 1].textContent.trim();
      _content = _content.replace(regex, `<a href="$2" title="${title}">$1</a>`);
    }
  } while (match);

  return _content;
};

export const annotations = (content: string): string => {
  const reForAnnotation = /\{\+\+(.+)\+\+\}/gm;
  const reForAnnotationDesc = /\B\+\+\}(.+)/gm;
  const result = content
    .replaceAll(reForAnnotation, "<Annotation>$1</Annotation>")
    .replaceAll(reForAnnotationDesc, "<AnnotationDesc>$1</AnnotationDesc>");
  return result;
};

export const images = (content: string): string => {
  const regex = /이미지([0-9]+).*[\r\n|\r|\n]{0,1}(캡[션|]: (.+)){0,1}[\r\n|\r|\n]{0,1}(알[트|트텍스트|]: (.+)){0,1}/gm;
  return content.replaceAll(regex, '<Image number="$1" caption="$3" alt="$5" />');
};
