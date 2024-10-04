import { Program, Command, Option, Positional } from './index.js'
import { deepEqual } from 'assert'

const program = new Program('git', 'Git version control')

function makeMockFn() {
    let count = 0
    return [() => count++, () => count]
}

const [mockFn, callCounter] = makeMockFn()

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
        deepEqual(this.files, ['index.js'])
        deepEqual(this.all, true)
    }
}

const args = program.yargs.parse(['add', 'index.js', '-A'])

deepEqual(args, {
    _: ['add'],
    A: true,
    all: true,
    files: ['index.js'],
    $0: 'git',
})

deepEqual(callCounter(), 1)
