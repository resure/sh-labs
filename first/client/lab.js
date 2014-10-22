function pretty(input) {
    return JSON.stringify(input, null, '\t');
}

function pp(input) {
    console.log(pretty(input));
}

function output(input) {
    $('.output').append('<p>' + input + '</p>');
}


function compute(N) {

    function createStructure(N) {
        var paths = {};

        if (N == 9) {
            paths = {
                0: {1: 1, 3: 1, 6: 1, 2: 1},
                1: {0: 1, 2: 1, 4: 1, 7: 1},
                2: {0: 1, 1: 1, 5: 1, 8: 1},
                3: {0: 1, 4: 1, 5: 1, 6: 1},
                4: {1: 1, 3: 1, 7: 1, 5: 1},
                5: {2: 1, 4: 1, 8: 1, 3: 1},
                6: {8: 1, 0: 1, 7: 1, 3: 1},
                7: {1: 1, 4: 1, 6: 1, 8: 1},
                8: {2: 1, 6: 1, 5: 1, 7: 1}
            };
        } else if (N == 12) {
            paths = {
                0:  {2: 1, 1: 1, 5: 1, 11: 1},
                1:  {4: 1, 0: 1, 2: 1, 10: 1},
                2:  {0: 1, 1: 1, 3: 1, 9: 1},
                3:  {2: 1, 4: 1, 5: 1, 8: 1},
                4:  {3: 1, 1: 1, 5: 1, 7: 1},
                5:  {0: 1, 4: 1, 6: 1, 3: 1},
                6:  {8: 1, 5: 1, 11: 1, 7: 1},
                7:  {10: 1, 4: 1, 6: 1, 8: 1},
                8:  {3: 1, 9: 1, 7: 1, 6: 1},
                9:  {2: 1, 11: 1, 10: 1, 8: 1},
                10: {1: 1, 11: 1, 9: 1, 7: 1},
                11: {0: 1, 9: 1, 10: 1, 6: 1},
            };
        }

        return paths;
    }

    var circ = createStructure(N);
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

    var result = 'N: ' + N + '; <br>';
    result += 'Max Diameter: ' + maxDiameter + '<br>';
    result += 'Average Diameter: ' + avgDiameter;

    output(result);
}


$(function () {
    compute(9);
    compute(12);
});


