import * as Parser from '@oclif/parser';
declare type Input<F> = Parser.Input<F>;
declare type Output<F, A> = Parser.Output<F, A>;
/**
 * Trims the object
 * @param obj
 * @private
 */
export declare const _trim: <F>(obj: F) => F;
/**
 * Validates the flags
 * @param flags
 * @param options
 * @param parse
 * @private
 */
export declare const _validate: <F, A>(flags: F, options: Parser.flags.Input<F>, parse?: Parser.Output<F, A> | undefined) => void;
/**
 * Extends the parsing of OClif by adding support for empty/min/max
 * @param OclifParser the original parser from the command
 */
declare const parser: <F, A extends {
    [name: string]: any;
}>(OclifParser: (options?: Parser.Input<F> | undefined, argv?: string[] | undefined) => Parser.Output<F, A>) => (options?: Parser.Input<F> | undefined, argv?: string[]) => Parser.Output<F, A>;
export default parser;
