import remark from 'remark';
import html from 'remark-html';
// @ts-expect-error
import linkifyRegex from 'remark-linkify-regex';

export default async function markdownToHtml(
  markdown?: string
): Promise<string> {
  if (!markdown) {
    return '';
  }

  const result = await remark()
    .use(html)
    .use(
      linkifyRegex(
        // from: https://regexr.com/3um70
        /^(https?):\/\/[^\s$.?#].[^\s]*$/
      )
    )
    .process(markdown);
  return result.toString();
}
