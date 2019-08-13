function interpret(code, input = "") {
    {
        let n = [];
        let end = {
            ")": "(",
            "]": "["
        };
        for (let c, i = 0; i < code.length; i++) {
            c = code[i];
            if (c == "(" || c == "[")
                n.push(c);
            if (c == ")" || c == "]") {
                if (n[n.length - 1] == end[c])
                    n.pop();
                else
                    return "Bracket mismatch: Unexpected '" + c + "' on character " + i;
            }
        }
        if (n.length)
            return "Unterminated bracket '" + n.pop() + "'";
    }
    var loop = [];
    for (let c, n = [], i = 0; i < code.length; i++) {
        c = code[i];
        if (c == "[")
            n.push(i);
        else if (c == "]")
            loop[i] = n.pop();
    }
    var skip = [];
    for (let c, p = [], b = [], i = 0; i < code.length; i++) {
        c = code[i];
        if (c == "(")
            p.push(i);
        else if (c == ")")
            skip[p.pop()] = i;
        else if (c == "[")
            b.push(i);
        else if (c == "]")
            skip[b.pop()] = i;
    }
    var aIn = input.split("").reverse();
    var cInd = 0;
    var scope = [[]];
    var cScope = [];
    var pipe = 0;
    var sElev = 0;
    var eof = false;
    var out = "";
    while (!eof) {
        let c = code[cInd];
        let s = false;
        if (c == "#")
            scope[scope.length - 1 - sElev].push(pipe);
        else if (c == "^")
            pipe = scope[scope.length - 1 - sElev].pop() || 0;
        else if (c == "-")
            pipe = 0;
        else if (c == "+")
            pipe++;
        else if (c == "?" && !pipe)
            s = true;
        else if (c == "!")
            s = true;
        else if (c == ":")
            pipe = scope[scope.length - 1 - sElev].length;
        else if (c == "~")
            sElev = sElev < scope.length - 1 ? sElev + 1 : sElev;
        else if (c == ">" && pipe)
            out += String.fromCodePoint(pipe);
        else if (c == "<")
            pipe = aIn.length ? aIn.pop().codePointAt(0) : 0;
        else if (c == ";")
            eof = true;
        else if (c == "=")
            pipe = (pipe == scope[scope.length - 1 - sElev].slice(-1)[0]) | 0;
        else if (c == "]")
            cInd = loop[cInd];
        else if (c == "(")
            scope.push([...cScope]), cScope = [];
        else if (c == ")")
            scope.pop(), cScope = [];
        if (c != "~")
            sElev = 0;
        cInd++;
        if (!code[cInd])
            eof = true;
        if (s) {
            if (code[cInd] == "(")
                cInd = skip[cInd];
            else if (code[cInd] == "[")
                cInd = skip[cInd];
            else if (code[cInd] == ")")
                cScope = scope.pop();
            cInd++;
        }
    }
    return out;
}
