import { Program, Command, Option, Positional } from './index.js'
import { deepStrictEqual } from 'assert'

function makeMockFn() {
    let count = 0
    return [() => count++, () => count]
}

const [mockFn, callCount] = makeMockFn()

const program = Program.make({
    name: 'git',
    description: "The world's most powerful version control system",
})

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
        mockFn()
        deepStrictEqual(this.files, ['index.js'])
        deepStrictEqual(this.all, true)
    }
}

const args = program.yargs.parse(['add', 'index.js', '-A'])

deepStrictEqual(args, {
    _: ['add'],
    A: true,
    all: true,
    files: ['index.js'],
    $0: 'git',
})

deepStrictEqual(callCount(), 1)
