/**
 * 通过关键字匹配html里面的内容，并且给该内容新增一个className
 * @param html 
 * @param keyword 
 * @param matchClassName 
 * @param startIndex 
 * @returns {
        match: string,
        html: string,
        length: number
    }
 */
export const getRemarkHtmlByKeyword = (html: string, keyword: string, matchClassName = 'red', startIndex = 0): {
    match: boolean,
    html: string,
    length: number,
    scrollHandler?: (index: number) => void
} => {
    if (!keyword.trim()) {
        return {
            match: false,
            html,
            length: 0
        }
    }
    const reg1 = new RegExp(
        keyword.split('').map((word, idx) => {
            const startTag = '<(?!style)(?!title)(?!meta)(text)[^>]*?>'
            const endTag = '</(text)>'
            return `${idx === 0 ? `${startTag}[^<]*` : `(${startTag})?`}${word}${idx === keyword.split('').length - 1 ? `[^>]*${endTag}` : `(${endTag})?`}`
        }).join(''),
        'gi'
    ) // 匹配text标签的html
    const hasMatch = html.match(reg1)
    if (hasMatch?.length) {
        let newHtml = html.slice(0)
        hasMatch.forEach((item, index) => {
            newHtml = newHtml.replace(item, item.replace(
                /<text(.*?)>(.*?)<\/text>/g,
                `<text class="match-${startIndex + index + 1} ${matchClassName}" $1>$2</text>`)
            )
        })
        return {
            match: true,
            html: newHtml,
            length: hasMatch.length,
            scrollHandler: (index: number) => {
                const keyGroups: {
                    els: Element[],
                    group: string
                }[] = []
                document.querySelectorAll(`.${matchClassName}`).forEach(item => {
                    let curGroup = ''
                    item.classList?.forEach((className, index) => {
                        if(className.match(/match-\d{1,}/) && index === 0) {
                            curGroup = className
                        }
                    })
                    const group = keyGroups.find(group => group.group === curGroup)
                    if(group) {
                        group.els.push(item)
                    }else {
                        keyGroups.push({
                            group: curGroup,
                            els: [item]
                        })
                    }
                    item.classList?.remove?.('active')
                })
                keyGroups[index - 1]?.els?.forEach((item, index) => {
                    item.classList.add('active')
                    if(index === 0) {
                        item.scrollIntoView?.()
                    }
                })
            }
        }
    }
    const specKeys = ['&nbsp;', '&gt;', '&lt;', '&#xa0;']
    const getSpecKeyReg = (word) => {
        let reg = word
        specKeys.forEach(item => {
            const idx = item.indexOf(word)
            if(idx > -1) {
                const prev = item.slice(0, idx)
                const next = item.slice(idx + word.length)
                if(prev) {
                    reg = `(?<!${prev})${reg}`
                }
                if(next) {
                    reg = `${reg}(?!${next})`
                }
            }
        })
        return reg
    }
    const reg2 = new RegExp(
        keyword.split('').map((word, idx) => {
            const startTag = '<(?!style)(?!title)(?!meta)(?!text)[a-z|A-Z]+[^>]*?>'
            const endTag = '</(?!title)(?!meta)(?!text)[a-z|A-Z]+>'
            return `${idx === 0 ? `(${startTag}[^<]*?)(` : `(?:${startTag})?`}${getSpecKeyReg(word)}${idx === keyword.split('').length - 1 ? `)([^>]*?${endTag})` : `(?:${endTag})?`}`
        }).join(''),
        'gi'
    ) // 匹配非text标签的html
    const hasMatch2 = html.match(reg2)
    if (hasMatch2) {
        return {
            match: true,
            html: (html as any).replaceAll(reg2, `$1<span class="${matchClassName}">$2</span>$3`),
            length: hasMatch2.length,
            scrollHandler: (index: number) => {
                const targets = document.querySelectorAll(`.${matchClassName}`)
                targets.forEach(item => {
                    item.classList?.remove?.('active')
                })
                targets[index - 1]?.scrollIntoView?.()
                targets[index - 1]?.classList?.add?.('active')
            }
        }
    }
    return {
        match: false,
        html,
        length: 0
    }
}
// hahah

// test-1

// hahah-2
