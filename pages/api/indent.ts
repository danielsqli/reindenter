import FormFields from '../../components/FormFields'

const addNewLines = (code: string[]): string[] => {
    const newLines: string[] = [];
    var remainingBrackets: number = 0;
    for (const line of code) {
        let startPos = 0;
        const bracketPos: number[] = []
        for (let i = 0; i < line.length; i += 1) {
            if (line[i] === '{') {
                bracketPos.push[i];
            } else if (line[i] === '}') {
                if (bracketPos.length === 0) {
                    if (remainingBrackets > 0) {
                        remainingBrackets -= 1;
                        newLines.push(line.substr(startPos, i - startPos));
                        startPos = i;
                    }
                } else {
                    bracketPos.pop[i];
                }
            }
        }
        const len = bracketPos.length;
        if (len > 0) {
            console.log(len);
            newLines.push(line.substr(startPos, bracketPos[len - 1] + 1));
            newLines.push(line.substr(bracketPos[len - 1] + 1));
            remainingBrackets += len;
        } else {
            newLines.push(line);
        }
    }
    return newLines;
}

const addIndents = (code: string[], indentChar: string, size: number): string => {
    let newLines: string = "";
    let numIndents = 0;
    for (const line of code) {
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

const removeExtraWS = (code: string[]): string[] => {
    const newLines:string[] = [];
    for (const line of code) {
        let firstNonWS = -1;
        let lastNonWS = -1;
        for (let i = 0; i < line.length; i += 1) {
            if (line[i] !== ' ' && line[i] !== '\t' && line[i] !== '\n') {
                if (firstNonWS === -1) firstNonWS = i;
                lastNonWS = i;
            }
        }
        newLines.push(line.substring(firstNonWS, lastNonWS + 1));
    }
    return newLines;
}

const formatCode = (code: string, indents: string, size: number): string => {
    const lines: string[] = code.split('\n');
    const trimmedLines: string[] = removeExtraWS(lines);
    if (indents == 'tabs') {
        return addIndents(addNewLines(trimmedLines), '\t', size);
    } else {
        return addIndents(addNewLines(trimmedLines), ' ', size); 
    }
}

export default (req, res) => {
    if (req.method != 'POST') {
        res.statusCode = 405;
    } else {
        const opts: FormFields = req.body;
        if (opts.indents != 'tabs' && opts.indents != 'spaces') {
            res.statusCode = 400;
            res.json({error: "Invalid Configuration"});
        } else if (isNaN(Number(opts.size))) {
            res.statusCode = 400;
            res.json({error: "Invalid Configuration"});
        } else {
            res.statusCode = 200;
            const formattedCode: string = formatCode(opts.code, opts.indents, Number(opts.size));
            res.json({ code: formattedCode });
        }
        
    }
}
