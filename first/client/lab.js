function pretty(input) {
    return JSON.stringify(input, null, '\t');
}

function pp(input) {
    console.log(pretty(input));
}

function output(input) {
    $('.output').append('<p>' + input + '</p>');
}


function compute(N, qNum) {
    var primeNumbers = [1, 3, 5, 7, 11, 13, 17, 19, 23, 29];

    function createQ(N, qNum) {
        var res = [];
        for (var i = 1; i < (N + 1) / 2; i++) {
            if (primeNumbers.indexOf(i) !== -1 && res.length < qNum)
                res.push(i);
        }
        return res;
    }

    function createCirtulate(N, q) {
        var paths = {};
        
        for (var i = 0; i < N; i++) {
            paths[i] = {};
            q.forEach(function (base) {
                paths[i][(i + base) % N] = 1;

                if (i - base < 0)
                    paths[i][(i - base) % N + N] = 1;
                else
                    paths[i][(i - base) % N] = 1;
            });
        }

        return paths;
    }

    var q = createQ(N, qNum);
    var circ = createCirtulate(N, q);
    var graph = new Graph(circ);
    var maxDiameter = 0;

    for (var i = 0; i < N; i++) {
        for (var j = 0; j < N; j++) {
            if (i !== j) {
                var path = graph.findShortestPath(i.toString(), j.toString()).slice(1);
                if (path.length > maxDiameter) {
                    maxDiameter = path.length;
                }
            }
        }
    }


    var avgDiameters = [];

    for (var i = 0; i < N; i++) {
        var d = 0;
        for (var j = 0; j < N; j++) {
            if (i !== j) {
                d += graph.findShortestPath(i.toString(), j.toString()).length - 1;
            }
        }

        avgDiameters[i] = d / (N-1);
    }

    var sum = 0;
    avgDiameters.forEach(function (e) {
        sum += e;
    });
    var avgDiameter = sum / N;

    var result = 'N: ' + N + '; q: ' + qNum + '<br>';
    result += 'Max Diameter: ' + maxDiameter + '<br>';
    result += 'Average Diameter: ' + avgDiameter;

    output(result);
}


$(function () {
    var N = [7, 14, 24];
    var q = [3, 4, 4];

    for (var i = 0; i < N.length; i++) {
        compute(N[i], q[i]);
    }
});


