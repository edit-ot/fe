import { Operation } from "edit-ot-quill-delta";

export function op2str(op: Operation) {
    if (op.delete) return `delete(${ op.delete })`;
    else if (op.insert) return `insert(${ JSON.stringify(op.insert) })`;
    else if (op.retain) return `retain(${ op.retain })`;
    else return `Other()`;
}
