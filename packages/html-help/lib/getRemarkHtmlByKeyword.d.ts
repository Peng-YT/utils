/**
 * 通过关键字匹配html里面的内容，并且给该内容新增一个className
 * @param html
 * @param keyword
 * @param matchClassName
 * @param startIndex
 * @returns
 */
export declare const getRemarkHtmlByKeyword: (html: string, keyword: string, matchClassName?: string, startIndex?: number) => {
    match: boolean;
    html: string;
    length: number;
    scrollHandler?: (index: number) => void;
};
