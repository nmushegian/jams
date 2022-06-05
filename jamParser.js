export class JAM {
    static parse(jam){
        this.size = jam.length
        this.src = Array.from(jam)
        this.pos = 0;
        this.res = this.readJam()

        // if (this.pos < this.size) {
        //     return null
        // }
        return this.res
    }

    static readJam(){
        this.consumeWhitespace()
        while (this.pos < this.size) {
            var c = this.src[this.pos];
            switch (c) {
                case '{':
                    return this.readObject();
                case '[':
                    return this.readArray();
                case '"':
                    return this.readString();
                default:
                    return this.readItem();
            }
        }
        throw new ParseException("Empty JSON string");
    }

    static readObject() {
        this.pos += 1;
        this.consumeWhitespace();
        //Scriptable object = cx.newObject(scope);
        // handle empty object literal case early
        if (this.pos < this.size && this.src[this.pos] == '}') {
            this.pos += 1;
            return {};
        }

        var obj = {}
        while (this.pos < this.size) {
            var c = this.src[this.pos];
            switch (c) {
                case '}':
                    this.pos += 1;
                    return obj;
                default:
                    var key = this.readItem();
                    this.consumeWhitespace();
                    var value = this.readJam();

                    obj[key] = value;
                    break;
            }
            this.consumeWhitespace();
        }
        throw new ParseException("Unterminated object literal");
    }

    static readArray() {
        this.pos += 1;
        this.consumeWhitespace();
        //Scriptable object = cx.newObject(scope);
        // handle empty object literal case early
        if (this.pos < this.size && this.src[this.pos] == ']') {
            this.pos += 1;
            return [];
        }

        var arr = []
        while (this.pos < this.size) {
            var c = this.src[this.pos];
            switch (c) {
                case ']':
                    this.pos += 1;
                    return arr;
                default:
                    var value = this.readJam();
                    this.consumeWhitespace();

                    arr.push(value);
                    break;
            }
        }
        return arr
    }

    static readString() {
        this.pos += 1;
        var stringStart = this.pos;
        while (this.pos < this.size) {
            var c = this.src[this.pos++];
            switch(c){
                case '"':
                    var item = this.src.slice(stringStart,this.pos-1);
                    return item.join("")
                default:
                    break;
            }
        }
    }

    static readItem() {
        var stringStart = this.pos;
        var item;
        while (this.pos < this.size) {
            var c = this.src[this.pos];
            switch(c){
                case ' ':
                    item = this.src.slice(stringStart,this.pos);
                    return item.join("")
                case '\t':
                case '\n':
                case '\r':
                case '\\':
                case '[':
                case ']':
                case '{':
                case '}':
                    if (stringStart < this.pos){
                        item = this.src.slice(stringStart,this.pos);
                        return item.join("")
                    }
                    throw new Error("Item contains control character");
                default:
                    this.pos += 1
                    break;
            }
        }
        item = this.src.slice(stringStart-1,this.pos);
        return item[0]
    }
    
    static consumeWhitespace(){
        while (this.pos < this.size){
            var c = this.src[this.pos]
            switch(c) {
                case ' ':
                case '\t':
                case '\r':
                case '\n':
                    this.pos += 1;
                    break;
                default:
                    return;
            }
        }
    }
}
export default (JAM);

// var a = JAM.parse("[a b c]")
// var b = 1


