module.exports = { SteamToDiscord: function(text) {
    return text // I used chat gpt because I am a lazy piece of shit
    // Headers
    .replace(/\[h1\](.*?)\[\/h1\]/gi, '# $1')
    .replace(/\[h2\](.*?)\[\/h2\]/gi, '## $1')
    .replace(/\[h3\](.*?)\[\/h3\]/gi, '### $1')
    // Bold, Italics, Underline, Strikethrough
    .replace(/\[b\](.*?)\[\/b\]/gi, '**$1**')
    .replace(/\[i\](.*?)\[\/i\]/gi, '*$1*')
    .replace(/\[u\](.*?)\[\/u\]/gi, '__$1__')
    .replace(/\[strike\](.*?)\[\/strike\]/gi, '~~$1~~')
    // Links
    .replace(/\[url=(.*?)\](.*?)\[\/url\]/gi, '[$2]($1)')
    // Lists
    .replace(/\[list\](.*?)\[\/list\]/gis, (match, p1) => 
      p1.replace(/\[\*\](.*?)(?=\[\*\]|$)/g, '* $1\n')
    )
    .replace(/\[olist\](.*?)\[\/olist\]/gis, (match, p1) => 
      p1.replace(/\[\*\](.*?)(?=\[\*\]|$)/g, (m, item, idx) => `${idx + 1}. ${item}\n`)
    )
    // Quotes
    .replace(/\[quote\](.*?)\[\/quote\]/gis, '> $1')
    // Code blocks
    .replace(/\[code\](.*?)\[\/code\]/gis, '```\n$1\n```')
    // Preserve other content as-is.
    .trim();
}}

