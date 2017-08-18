export class Writer {
    private str: string = "";
    private indentCount: number = 0;

    private getIndentionStr() {
        var indentStr = "    ";
        var actualIndentStr = "";
        for (let i = 0; i < this.indentCount; i++)
            actualIndentStr += indentStr;
        return actualIndentStr;
    }

    public writeLine(line: string) {
        this.str += this.getIndentionStr() + line + "\r\n";
    }

    public indent(times: number = 1) {
        this.indentCount += times;
    }

    public outdent(times: number = 1) {
        this.indentCount -= times;
    }

    public writeIndented(text: string) {
        text = text.replace("\r\n", "\n");
        text = this.getIndentionStr() + text.replace("\n", this.getIndentionStr() + "\n");
        this.str += text;
    }

    public toString() { return this.str; }
}