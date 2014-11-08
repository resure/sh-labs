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

function printMatr(input, title) {
    var result = '<h3 class="title">' + title + '</h3>      ',
        N = input.length;

    for (var i = 1; i <= N; i++) {
        result += '<span style="color:#999;display:inline-block;transform:rotate(-45deg);padding-bottom:4px">' + i + '</span> ';
        if (i < 10) {
            result += '  ';
        }
    }

    result += '<br>'

    input.forEach(function (row, i) {
        result += '<span style="color:#999">' + (i+1) + '</span>   ';
        if (i < 9) {
            result += '  ';
        }
        row.forEach(function (el) {
            result += el + '   ';
            if (el < 10) {
                result += '    ';
            } 
            if (el.length == 2) {
                result += ' ';
            }
        });
        result += '<br>';
    });

    output(result);
}

function logicSum(a,b) {
    if (a == 0 || a == 1) {
        return b;
    }
    if (b == 0 || b == 1) { 
        return a;
    }

    return (a + b);
}

function logicMultiplication(a,b) {
    if (a == 0 || b == 0) {
        return 0;
    }
    if (a == 1) { 
        return b;
    }
    if (b == 1) {
        return a;
    }

    return (a + b);
}

function compute(tree) {

    /*

    Расчет матрицы следования

    */

    var N = Object.keys(tree).length;
    
    var matr = [];

    for (var i = 1; i <= N; i++) {
        var current = tree[i],
            row = [],
            conditionState = true;

        for (var j = 0; j < N; j++) {
            if (current[j + 1]) {
                if (current.condition) {
                    row[j] = conditionState ? (i + 'T') : (i + 'F');
                    conditionState = false;
                } else {
                    row[j] = 1;
                }
            } else {
                row[j] = 0;
            }
        }

        matr.push(row);
    }

    printMatr(matr, "Матрица следования: ");

    /*

    Расчет матрицы следования с указанием весов

    */

    var values = [];
    for (var i = 1; i <= N; i++) {
        values.push(tree[i].value);
    }
    matr.push(values);
    
    // Траспонирование матрицы
    matr = _.zip.apply(_, matr);
    
    printMatr(matr, "Матрица следования с указанием весов: ");

    /* 

    Расчет матрицы следования с указанием транзитивных связей
    
    */

    // Извлечение последнего столбца(столбца с весами элементов)
    matr = _.zip.apply(_, matr);
    matr.pop();  
    matr = _.zip.apply(_, matr);

    for (var i = 0; i < N; i++) {
        for (var j = 0; j < N; j++) {
            if (matr[i][j] != 0) {
                for (k = 0; k < j; k++) {
                    matr[i][k] = logicSum(logicMultiplication(matr[j][k], matr[i][j]), matr[i][k]);
                }
            }
        }
    }

    printMatr(matr, "Матрица следования с транзитивными связями: ");

}









$(function () {

    var tree = {
        1: {
            4: 2,
            value: 2,
        },
        2: {
            4: 2,
            5: 1,
            value: 4,
        },
        3: {
            5: 1,
            10: 3,
            value: 3,
        },
        4: {
            6: 4,
            7: 5,
            condition: [4.1, 4.2],
            value: 2,
        },
        5: {
            8: 7,
            9: 2,
            value: 1,
        },
        6: {
            11: 4,
            value: 4,
        },
        7: {
            12: 6,
            value: 5,
        },
        8: {
            12: 6,
            value: 7,
        },
        9: {
            13: 7,
            value: 2,
        },
        10: {
            14: 8,
            15: 9,
            condition: [10.1, 10.2],
            value: 3,
        },
        11: {
            value: 4,
        },
        12: {
            value: 6,
        },
        13: {
            16: 10,
            value: 7,
        },
        14: {
            16: 10,
            value: 8,
        },
        15: {
            value: 9,
        },
        16: {
            17: 6,
            18: 5,
            condition: [16.1, 16.2],
            value: 10,
        },
        17: {
            value: 6,
        },
        18: {
            value: 5,
        },
    };


    compute(tree);

});