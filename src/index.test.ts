import { Program, Command, Option } from './index.js'

const program = new Program('git', 'Git version control')

@program.Command({
    name: 'add',
    description: 'Add a new file',
})
class Add extends Command {
    @Option()
    files: string[] = []

    @Option({
        shorthand: 'A',
    })
    all: boolean

    override handler() {
        console.log('Add handler', this.files, this.all)
    }
}

const args = program.yargs.parse(['add', '--files', 'index.js', '-A'])

console.log(args)
