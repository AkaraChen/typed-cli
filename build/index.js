import 'reflect-metadata';
import yargs from 'yargs';
export class Command {
    name;
    description;
    constructor(name, description) {
        this.name = name;
        this.description = description;
    }
    handler() { }
}
export class Program {
    name;
    description;
    commands;
    constructor(name, description, commands) {
        this.name = name;
        this.description = description;
        this.commands = commands;
    }
    get yargs() {
        let program = yargs()
            .scriptName(this.name)
            .usage('$0 <cmd> [args]')
            .recommendCommands()
            .help();
        this.commands.forEach(command => {
            const options = Reflect.getMetadata('options', command.constructor);
            program = program.command(command.name, command.description, yargs => {
                let result = yargs;
                options.forEach(option => {
                    const type = option.type === Boolean
                        ? 'boolean'
                        : option.type === String
                            ? 'string'
                            : option.type === Number
                                ? 'number'
                                : option.type === Array
                                    ? 'array'
                                    : 'string';
                    result = yargs.option(option.key, {
                        type,
                        alias: option.shorthand,
                    });
                });
                return result;
            }, argv => {
                options.forEach(option => {
                    // @ts-ignore
                    command[option.key] = argv[option.key];
                });
                return command.handler.call(command);
            });
        });
        return program;
    }
}
export function Option(metadata = {}) {
    return function (target, propertyKey) {
        const type = Reflect.getMetadata('design:type', target, propertyKey);
        const options = Reflect.getMetadata('options', target.constructor) || [];
        options.push({
            key: propertyKey,
            type,
            shorthand: metadata.shorthand,
        });
        Reflect.defineMetadata('options', options, target.constructor);
    };
}
