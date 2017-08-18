import "../tyml-parser/tyml.js";
import "reflect-metadata";
import "./types";
import { SyntaxDescription, ReservedOp, ReservedId, SpecialToken } from "./types";
import { Deserializer } from "./Helper/Deserializer";
import { AnnotationBasedTypeSystem } from "./Helper/TypeSystem/AnnotationBasedTypeSystem";
import fs = require("fs-extra");
import { Writer } from "./Writer";

const data = fs.readFileSync("./../../syntax.tyml", { encoding: "utf8" });

const content: SyntaxDescription =
    new Deserializer(AnnotationBasedTypeSystem.getInstance()).deserialize(data);


//const reservedIds = content.tokenKinds.filter(t => t instanceof ReservedId) as ReservedId[];


const w = new Writer();

w.writeLine("export enum TokenKinds {");
w.indent();
for (const t of content.tokenKinds) {
    w.writeLine(t.getName() + ",");
}
w.outdent();
w.writeLine("}");

const reservedIds = {} as any;
for (const t of content.tokenKinds) {
    if (!(t instanceof ReservedId)) continue;
    reservedIds[t.identifier] = t.getName();
}
w.writeLine("export const reservedIds = " + JSON.stringify(reservedIds, undefined, "  ") + ";");

const reservedOps = {} as any;
for (const t of content.tokenKinds) {
    if (!(t instanceof ReservedOp)) continue;
    reservedOps[t.op] = t.getName();
}
w.writeLine("export const reservedOps = " + JSON.stringify(reservedOps, undefined, "  ") + ";");

const specialTokens = {} as any;
for (const t of content.tokenKinds) {
    if (!(t instanceof SpecialToken)) continue;
    specialTokens[t.character] = t.getName();
}
w.writeLine("export const specialTokens = " + JSON.stringify(specialTokens, undefined, "  ") + ";");

fs.writeFileSync("./../../parser/generated.ts", w.toString(), { encoding: "utf8" });

//console.log(w.toString());
