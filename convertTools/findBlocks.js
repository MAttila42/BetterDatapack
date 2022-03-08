function findBlocks(f, regex) {
    
    
    let lastContent = ""; // Will store the last results content to avoid duplicates
    let start = regex.exec(f);
    while (start != null) { // Look through the matches
        let full = start[0], // Will contain the full result
            open = 1,
            close = 0;
        for (let i of f.slice(regex.lastIndex)) { // Go throught the string one character at a time
            full += i;
            if (i == '{') open++;
            if (i == '}') close++;
            if (open == close) break; // If every braces are closed then we have the full result
        }
        if (full == lastContent.trim()) continue; // If this result is the content of the last result then don't do anything with it
    }
}

module.exports = {
    findBlocks
};
