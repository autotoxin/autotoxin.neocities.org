/**
 * Add the aria-label attribute to checkboxes resulting from markdown task lists
 * (uses regex to parse html; sue me)
 *
 * @param html HTML string
 * @returns HTML string with aria-labels added to checkboxes
 */
export const markdownTasklistA11y = (html: string): string => {
    return html.replace(/<li.*?>(.+)<\/li>/gi, (listItem) => {
        const label = listItem.replace(/<[^>]+>/g, "").trim() || "";

        const modifiedListItem = listItem.replace(/(<input.*?type="checkbox".*?>)/i, (checkbox) => {
            // shouldn't happen but maybe the markdown parser will one day add this
            if (checkbox.includes("aria-label=")) {
                return checkbox;
            }
            const before = checkbox.slice(0, -1);
            return `${before} aria-label="${label}" />`;
        });

        return modifiedListItem;
    });
};
