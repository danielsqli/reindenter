import FormFields from '../../components/FormFields'

const SPLIT_LEN = 15;

const parseCode = (code: string): string => {
    if (code.length < SPLIT_LEN) {
        return code;
    } else {
        let stringMode = 0;
        let escapeMode = false;
        let bracketMode = false;
        let newCode = "";
        let newLine = "";
        let prevIsWS = false;
        for (let i = 0; i < code.length; i += 1) {
            newLine += code[i];
            if (stringMode) {
                if (code[i] === '\\') {
                    escapeMode = true;
                } else if (escapeMode) {
                    escapeMode = false;
                } else if ((code[i] === '"' && stringMode === 1) || (code[i] === '\'' && stringMode === 2)) {
                    stringMode = 0;
                }
            } else if (bracketMode) {
                if (code[i] === ')') {
                    bracketMode = false;
                }
            } if (code[i] === ' ' || code[i] === '\t' || code[i] === '\n') {
                if (prevIsWS) newLine = newLine.slice(0, -1);
                prevIsWS = true;
            } else {
                prevIsWS = false;
                if (code[i] == '(') {
                    bracketMode = true;
                } else if (code[i] === '"') {
                    stringMode = 1;
                } else if (code[i] === '\'') {
                    stringMode = 2;
                } else if (code[i] === '{' || code[i] === '}' || code[i] === ';' || code[i] === ',') {
                    newCode += newLine;
                    if ((i < code.length - 1 && code[i + 1] != '\n') || i === code.length - 1) newCode += '\n';
                    newLine = "";
                }
            }
        }
        if (newLine != "") {
            newCode += newLine;
            if (newLine[newLine.length - 1] != '\n') {
                newCode += '\n';
            }
        }
        return newCode;    
    }
}

const parseCodeBlock = (code: string): string => {
    let stringMode = 0;
    let escapeMode = false;
    let bracketMode = false;
    let blockStart = -1;
    let numBrackets = 0;
    for (let i = 0; i < code.length; i += 1) {
        if (stringMode) {
            if (code[i] === '\\') {
                escapeMode = true;
            } else if (escapeMode) {
                escapeMode = false;
            } else if ((code[i] === '"' && stringMode === 1) || (code[i] === '\'' && stringMode === 2)) {
                stringMode = 0;
            }
        } else if (bracketMode) {
            if (code[i] === '"') {
                stringMode = 1;
            } else if (code[i] === '\'') {
                stringMode = 2;
            } else if (code[i] == '}') {
                numBrackets -= 1;
                if (numBrackets === 0) {
                    return parseCode(code.substring(0, blockStart + 1)) + '\n' + parseCodeBlock(code.substring(blockStart + 1, i)) + '\n' + parseCodeBlock(code.substring(i));
                }
            } else if (code[i] == '{') {
                numBrackets += 1;
            }
        } else if (code[i] === '"') {
            stringMode = 1;
        } else if (code[i] === '\'') {
            stringMode = 2;
        } else if (code[i] === '{') {
            bracketMode = true;
            blockStart = i;
            numBrackets += 1;
        }
    }
    return parseCode(code);
}

const addIndents = (code: string[], indentChar: string, size: number): string => {
    let newLines = "";
    let numIndents = 0;
    const trimmedLines = removeExtraWS(code);
    for (const line of trimmedLines.split('\n')) {
        if (line === "") continue;
        if (line[0] == '}') {
            numIndents -= 1;
        }
        let newLine = "";
        for (let i = 0; i < numIndents; i += 1) {
            for (let j = 0; j < size; j += 1) {
                newLine += indentChar;
            }
        }
        newLines += (newLine += line) + '\n';
        if (line[line.length - 1] == '{') {
            numIndents += 1;
        }
    }
    return newLines;
}

const removeExtraWS = (code: string[]): string => {
    let newLines = "";
    for (const line of code) {
        let firstNonWS = -1;
        let lastNonWS = -1;
        for (let i = 0; i < line.length; i += 1) {
            if (line[i] !== ' ' && line[i] !== '\t' && line[i] !== '\n') {
                if (firstNonWS === -1) firstNonWS = i;
                lastNonWS = i;
            }
        }
        newLines += line.substring(firstNonWS, lastNonWS + 1) + '\n';
    }
    return newLines;
} 

const formatCode = (code: string, indents: string, size: number): string => {
    const lines: string[] = code.split('\n');
    const trimmedLines: string = removeExtraWS(lines);
    if (indents == 'tabs') {
        return addIndents(parseCodeBlock(trimmedLines).split('\n'), '\t', size);
    } else {
        return addIndents(parseCodeBlock(trimmedLines).split('\n'), ' ', size);
    }
}

export default (req, res) => {
    if (req.method != 'POST') {
        res.statusCode = 405;
    } else {
        const opts: FormFields = req.body;
        if (opts.indents != 'tabs' && opts.indents != 'spaces') {
            res.statusCode = 400;
            res.json({ error: "Invalid Configuration" });
        } else if (isNaN(Number(opts.size))) {
            res.statusCode = 400;
            res.json({ error: "Invalid Configuration" });
        } else {
            res.statusCode = 200;
            const formattedCode: string = formatCode(opts.code, opts.indents, Number(opts.size));
            res.json({ code: formattedCode });
        }

    }
}
