import 'reflect-metadata'
import yargs from 'yargs'
import type { Argv } from 'yargs'

export class Command {
    handler() {}
}

export class Program {
    constructor(
        public readonly name: string,
        public readonly description: string,
    ) {}

    private commands: Array<{
        name: string
        description: string
        constructor: new () => Command
    }> = []

    get yargs(): Argv {
        let program = yargs()
            .scriptName(this.name)
            .usage('$0 <cmd> [args]')
            .recommendCommands()
            .help()

        this.commands.forEach(command => {
            const options = Reflect.getMetadata(
                'options',
                command.constructor,
            ) as OptionOutput[]
            program = program.command(
                command.name,
                command.description,
                yargs => {
                    let result = yargs
                    options.forEach(option => {
                        const type =
                            option.type === Boolean
                                ? 'boolean'
                                : option.type === String
                                  ? 'string'
                                  : option.type === Number
                                    ? 'number'
                                    : option.type === Array
                                      ? 'array'
                                      : 'string'
                        result = yargs.option(option.key as string, {
                            type,
                            alias: option.shorthand,
                        })
                    })
                    return result
                },
                argv => {
                    options.forEach(option => {
                        // @ts-ignore
                        command[option.key] = argv[option.key as string]
                    })
                    const instance = new command.constructor()
                    return instance.handler.call(command)
                },
            )
        })
        return program
    }

    Command(opts: {
        name: string
        description: string
    }): ClassDecorator {
        return (target) => {
            this.commands.push({
                ...opts,
                constructor: target as unknown as new () => Command,
            })
        }
    }
}

export interface OptionMetadata {
    shorthand?: string
}

export interface OptionOutput {
    key: string
    type:
        | StringConstructor
        | BooleanConstructor
        | NumberConstructor
        | ArrayConstructor
    shorthand?: string
}

export function Option(metadata: OptionMetadata = {}): PropertyDecorator {
    return function (target, propertyKey) {
        const type = Reflect.getMetadata('design:type', target, propertyKey)
        const options: OptionOutput[] =
            Reflect.getMetadata('options', target.constructor) || []
        options.push({
            key: propertyKey as string,
            type,
            shorthand: metadata.shorthand,
        })
        Reflect.defineMetadata('options', options, target.constructor)
    }
}
