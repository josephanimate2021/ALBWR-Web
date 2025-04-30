// modules
import childProcess from 'child_process';

// spawn in a new shell for the randomizer.
const command = [
    `+x albw-randomizer && ./albw-randomizer --preset form${process.argv.length == 3 && !isNaN(parseInt(process.argv[2])) ? ` --seed ${process.argv[2]}` : ''}`
];
console.log('Running Command: chmod', command.join(''));
const shellProcess = childProcess.spawn('chmod', command, {
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