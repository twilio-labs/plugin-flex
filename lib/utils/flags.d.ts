/**
 * OClif flag pass everything you pass to its constructor down, we just don't have the type definition
 * This file is where we can add custom type definition such as max/min so we can use it
 */
import { flags as OclifFlags } from '@oclif/command';
import { Default, Definition, IOptionFlag } from '@oclif/parser/lib/flags';
/**
 * Extension of the flag({}) options by adding min/max for type string
 */
export interface SizeIOptionFlag<T extends string | string[] | undefined> extends IOptionFlag<T> {
    min?: number;
    max?: number;
}
/**
 * Taken from https://github.com/oclif/parser/blob/master/src/flags.ts#L47
 * But replaces {@link IOptionFlag} with {@link SizeIOptionFlag}
 */
interface StringDefinition extends Definition<string> {
    (options: {
        multiple: true;
    } & Partial<SizeIOptionFlag<string[]>>): SizeIOptionFlag<string[]>;
    (options: ({
        required: true;
    } | {
        default: Default<string>;
    }) & Partial<SizeIOptionFlag<string>>): SizeIOptionFlag<string>;
    (options?: Partial<SizeIOptionFlag<string>>): SizeIOptionFlag<string | undefined>;
}
declare const string: StringDefinition;
export { string };
export declare const boolean: typeof OclifFlags.boolean;
declare const _enum: <T = string>(opts: import("@oclif/parser/lib/flags").EnumFlagOptions<T>) => OclifFlags.IOptionFlag<T>;
export { _enum as enum };
