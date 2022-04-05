export const etc = (content: string): string => {
  let _content = content;
  const regexForSingle = /[‘’]/gm;
  _content = _content.replaceAll(regexForSingle, "'");
  const regexForDouble = /[“”]/gm;
  _content = _content.replaceAll(regexForDouble, `"`);
  const regexForWhitespace = /\n\n\n/gm;
  _content = _content.replaceAll(regexForWhitespace, `\n\n`);
  return _content;
};

export const links = async (content: string) => {
  let _content = content;
  const regex = /\[(.+)\]\((.[^()]+)\)/;

  let match = null;
  do {
    match = regex.exec(_content);
    if (match) {
      let title = "";
      let url = match[2] as string;
      if (url.startsWith("/")) {
        url = `https://articles.dotface.kr${url}`;
      }

      try {
        const pageContent = await fetch(url).then((res) => res.text());
        const titleRegex = /\<title\>(.+)\<\/title\>/;
        const titles = titleRegex.exec(pageContent);
        if (titles?.length) {
          title = titles[1];
          _content = _content.replace(regex, `<a href="$2" title="${title}">$1</a>`);
        } else {
          _content = _content.replace(regex, `<a href="$2" title="">$1</a>`);
        }
      } catch (_) {
        _content = _content.replace(regex, `<a href="$2" title="">$1</a>`);
      }
    }
  } while (match);

  return _content;
};

export const annotations = (content: string): string => {
  const reForAnnotation = /{\+\+([ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-z0-9|\s]+)\+\+}/gm;
  const reForAnnotationDesc = /^\+\+\}(.+)/gm;

  return content
    .replaceAll(reForAnnotation, "<Annotation>$1</Annotation>")
    .replaceAll(reForAnnotationDesc, "<AnnotationDesc>$1</AnnotationDesc>");
};

export const images = (content: string): string => {
  const regex =
    /이미지([0-9]+).*[\r\n|\r|\n]{0,1}((캡|캡션): (.+)){0,1}[\r\n|\r|\n]{0,1}((알|알트|알트텍스트): (.+)){0,1}[\r\n|\r|\n]{0,1}(maxWidth){0,1}/gm;
  return content.replaceAll(regex, '<Image number="$1" caption="$4" alt="$7" $8 />\n\n');
};

export const lineBreaks = (content: string): string => {
  const regexForBoxes = /<box>((.|\s)*(\n{0,2})(.|\s)*)*<\/box>/gm;
  const test = regexForBoxes.exec(content);
  let result = content;
  if (test !== null) {
    result = test[1].trim().replaceAll("\n", "<br />");
  }
  return `<Box>${result}</Box>`;
};
