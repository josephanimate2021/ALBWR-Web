// modules
import childProcess from 'child_process';

// spawn in a new shell for the randomizer.
const command = ['--preset', `form`];
if (process.argv.length == 3 && !isNaN(parseInt(process.argv[2]))) {
    command.push('--seed');
    command.push(process.argv[2])
}
console.log(command)
console.log('The randomizer has started.');
childProcess.execSync('chmod +x albw-randomizer')
const shellProcess = childProcess.spawn('./albw-randomizer', command, {
    shell: true
});

// log the output to the console
shellProcess.stdout.setEncoding('utf8');
shellProcess.stdout.on('data', function(data) {
    console.log(data);
});

shellProcess.stderr.setEncoding('utf8');
shellProcess.stderr.on('data', function(data) {
    console.log(data);
});

shellProcess.on('close', function(code) {
    console.log('closing code:', code);
    //childProcess.spawnSync('jsh')
});

shellProcess.on('error', function(code) { // An error occured
    console.log('error:', code);
});