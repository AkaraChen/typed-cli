import 'reflect-metadata'
import yargs from 'yargs'
import type { Argv, PositionalOptionsType } from 'yargs'

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
            const positionals = Reflect.getMetadata(
                'positionals',
                command.constructor,
            ) as PositionalOutput[]
            program = program.command(
                command.name,
                command.description,
                yargs => {
                    let result = yargs
                    options.forEach(option => {
                        result = yargs.option(option.key, {
                            type: option.type,
                            alias: option.shorthand,
                        })
                    })
                    positionals.forEach(positional => {
                        result = yargs.positional(positional.key, {
                            type: positional.type as PositionalOptionsType,
                        })
                    })
                    return result
                },
                argv => {
                    options.forEach(option => {
                        command[option.key] = argv[option.key]
                    })
                    positionals.forEach(positional => {
                        command[positional.key] = argv[positional.key]
                    })
                    const instance = new command.constructor()
                    return instance.handler.call(command)
                },
            )
        })
        return program
    }

    Command(opts: { name: string; description: string }): ClassDecorator {
        return target => {
            this.commands.push({
                ...opts,
                constructor: target as unknown as new () => Command,
            })
        }
    }
}

export function matchDesignType(type: Function) {
    switch (type) {
        case String:
            return 'string'
        case Boolean:
            return 'boolean'
        case Number:
            return 'number'
        case Array:
            return 'array'
        default:
            return 'string'
    }
}

export interface OptionMetadata {
    shorthand?: string
}

export interface OptionOutput {
    key: string
    type: PositionalOptionsType | 'array' | 'count'
    shorthand?: string
}

export function Option(metadata: OptionMetadata = {}): PropertyDecorator {
    return function (target, propertyKey) {
        const type = Reflect.getMetadata('design:type', target, propertyKey)
        const options: OptionOutput[] =
            Reflect.getMetadata('options', target.constructor) || []
        options.push({
            key: propertyKey as string,
            type: matchDesignType(type),
            shorthand: metadata.shorthand,
        })
        Reflect.defineMetadata('options', options, target.constructor)
    }
}

export type PositionalOutput = Omit<OptionOutput, 'shorthand'>

export function Positional(): PropertyDecorator {
    return function (target, propertyKey) {
        const type = Reflect.getMetadata('design:type', target, propertyKey)
        const positionals: PositionalOutput[] =
            Reflect.getMetadata('positionals', target.constructor) || []
        positionals.push({
            key: propertyKey as string,
            type: matchDesignType(type),
        })
        Reflect.defineMetadata('positionals', positionals, target.constructor)
    }
}
