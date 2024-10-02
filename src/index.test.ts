import { Program, Command, Option } from './index.js'

class Add extends Command {
    constructor() {
        super('add', 'Add a new file')
    }

    @Option()
    files: string[] = []

    @Option({
        shorthand: 'A',
    })
    all: boolean = false

    override handler() {
        console.log('Add handler', this.files, this.all)
    }
}

const program = new Program('git', 'Git version control', [new Add()])

const args = program.yargs.parse(['add', '--files', 'index.js', '-A'])

console.log(args)
