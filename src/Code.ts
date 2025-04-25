/**
 * translates each field into its corresponding binary value
 */
type Command = string
export class Code {
    public comp(cc: Command) {
        return '111'
    }
    public dest(dd: Command) {
        return '000'
    }
    public jump(jj: Command) {
        return '111'
    }
    public label(ll: Command) {
        return '010'
    }
}