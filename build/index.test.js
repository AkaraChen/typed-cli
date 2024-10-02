var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Program, Command, Option } from './index.js';
class Add extends Command {
    constructor() {
        super('add', 'Add a new file');
    }
    files = [];
    all = false;
    handler() {
        console.log('Add handler', this.files, this.all);
    }
}
__decorate([
    Option(),
    __metadata("design:type", Array)
], Add.prototype, "files", void 0);
__decorate([
    Option({
        shorthand: 'A',
    }),
    __metadata("design:type", Boolean)
], Add.prototype, "all", void 0);
const program = new Program('git', 'Git version control', [new Add()]);
const args = program.yargs.parse(['add', '--files', 'index.js', '-A']);
console.log(args);
