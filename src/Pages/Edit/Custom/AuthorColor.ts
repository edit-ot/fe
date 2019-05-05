
import Parchment from "parchment";
import Quill from "quill";

let QParchment: typeof Parchment = Quill.import('parchment');

export const AuthorAttr = new QParchment.Attributor.Class('author', 'author', {
    scope: QParchment.Scope.INLINE
})
