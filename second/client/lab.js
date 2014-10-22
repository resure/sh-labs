function pretty(input) {
    return JSON.stringify(input, null, '\t');
}

function pp(input) {
    console.log(pretty(input));
}

function output(input) {
    $('.output').append('<p>' + input + '</p>');
}

function copy(input) {
    return JSON.parse(JSON.stringify(input));
}

function printTree(tree) {

    function printBlock(block, scope, i) {
        block.type = block.block;

        if (block.type === 'start') {
            output('[START]');
        } else if (block.type === 'args') {
            output('[ARGS: ' + Object.keys(tree.args).join(', ') + ']');
        } else if (block.type === 'finish') {
            output('[FINISH]');

        } else if (block.type === 'compute') {
            var result = '[COMPUTE';
            if (block.parallel && i > 0) {
                result += ' PARALLEL';
            }

            result += '] (' + block.args.join(', ') + ') -> ' + block.result + ']';
            output(result);

        } else if (block.type === 'if') {
            output('[IF ' + block.value + ' THEN]');

            output('');

            printBlock(block.t);

            output('');
            output('[ELSE]');
            output('');

            printBlock(block.f);

            output('');
            output('[END]');

        } else if (block.type === 'print') {
            output('Print vars: ' + block.args.join(', '));

        } else if (block.type === 'sequence') {
            block.content.forEach(function (b, i) {
                printBlock(b, block, i);
            });
        }
    }

    printBlock(tree.alg);
}

function compute(tree) {

    function inspect(block, scope) {
        block.type = block.block;

        if (block.type === 'start') {
            return block;

        } else if (block.type === 'args') {
            return block;

        } else if (block.type === 'finish') {
            return block;

        } else if (block.type === 'compute') {
            scope.computed[block.result] = 1;

            block.parallel = true;
            block.args.forEach(function (arg) {
                if (! scope.done[arg]) {
                    block.parallel = false;
                }
            });

            return block;

        } else if (block.type === 'if') {
            inspect(block.t, scope);
            inspect(block.f, scope);

        } else if (block.type === 'print') {
            return block;

        } else if (block.type === 'sequence') {
            if (scope) {
                block.computed = copy(scope.computed);
                block.done = copy(scope.computed);
            } else {
                block.computed = copy(tree.args);
                block.done = copy(tree.args);
            }

            block.content.forEach(function (b, i) {
                block[i] = inspect(b, block);
            });

            if (scope) {
                _.extend(scope.computed, block.computed);
            }

            return block;
        }
    }

    // output('<br><strong>BEFORE:</strong><br>')
    // printTree(tree);
    
    tree.alg = inspect(tree.alg);

    output('<br><br><br><br><strong>AFTER:</strong><br>');
    printTree(tree);
}


$(function () {
    var tree = {
        args: {a: 1, b: 1, c: 1, d: 1, e: 1, f: 1},
        alg: {
            block: 'sequence',
            content: [
                {block: 'start'},
                {block: 'args'},
                {block: 'sequence', content: [
                    {block: 'compute', args: ['a', 'b'], result: 'sp1'},
                    {block: 'compute', args: ['b', 'sp1'], result: 'sp2'},
                    {block: 'compute', args: ['f', 'sp2'], result: 'sp3'},
                ]},
                {block: 'if', value: 'a > b',
                    f: {
                        block: 'sequence',
                        content: [
                            {block: 'compute', args: ['a', 'f'], result: 'sp4'},
                            {block: 'compute', args: ['f', 'b'], result: 'sp5'},
                            {block: 'compute', args: ['a', 'sp4'], result: 'sp6'},
                            {block: 'print', args: ['sp4', 'sp5', 'sp6']},
                        ],
                    },
                    t: {
                        block: 'sequence',
                        content: [
                            {block: 'compute', args: ['a', 'b'], result: 'sp7'},
                            {block: 'compute', args: ['sp7', 'c'], result: 'sp8'},
                            {block: 'compute', args: ['c', 'sp7'], result: 'sp9'},
                            {block: 'print', args: ['sp7, sp8, sp9']},
                        ]
                    }
                },
                {block: 'finish'},
            ]
        }
    };

    compute(tree);
});




