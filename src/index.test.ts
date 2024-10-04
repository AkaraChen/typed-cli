import { Program, Command, Option, Positional } from './index.js'

const program = new Program('git', 'Git version control')

@program.Command({
    name: 'add <files...>',
    description: 'Add a new file',
})
class Add extends Command {
    @Positional()
    files: string[] = []

    @Option({
        shorthand: 'A',
    })
    all: boolean

    override handler() {
        console.log('Add handler', this.files, this.all)
    }
}

const args = program.yargs.parse(['add', 'index.js', '-A'])

console.log(args)
