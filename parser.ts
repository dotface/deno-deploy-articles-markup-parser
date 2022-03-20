export const links = async (content: string) => {
  let _content = content;
  const regex = /\[(.+)\]\("{0,1}(.+)"{0,1}\)/;

  let match = null;
  do {
    match = regex.exec(_content);
    if (match) {
      let title = "";
      let url = match[2] as string;
      if (url.startsWith("/")) {
        url = `https://articles.dotface.kr${url}`;
      }

      const pageContent = await fetch(url).then((res) => res.text());
      const titleRegex = /\<title\>(.+)\<\/title\>/;
      const titles = titleRegex.exec(pageContent);
      if (titles?.length) {
        title = titles[1];
        _content = _content.replace(regex, `<a href="$2" title="${title}">$1</a>`);
      } else {
        _content = _content.replace(regex, `<a href="$2" title="">$1</a>`);
      }
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
