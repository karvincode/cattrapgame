console.log("connected")
window.onload = function () {

    let g = new Graph();
    for (var i = 0; i < 121; i++) {
        var idRow = Math.floor(i / 11)
        var idCol = i % 11
        g.addNode(idRow, idCol);
    }
    for (var i = 0; i < 121; i++) {
        var idRow = Math.floor(i / 11)
        var idCol = i % 11
        // console.log(idRow,idCol)
        var node = g.getNode(idRow, idCol);
        var neighbors = node.getNeighbors();
        // console.log(node,neighbors)
        for (var j = 0; j < neighbors.length; j++) {
            var neighbor = neighbors[j]
            var neighborRow = neighbor[0]
            var neighborCol = neighbor[1]
            if (neighborRow >= 0 && neighborRow <= 10 && neighborCol >= 0 && neighborCol <= 10) {
                g.addEdge(idRow, idCol, neighborRow, neighborCol)
            }
        }
    }
    // On windows load decides how many cells will be preclicked between and 14
    var clickedCells = Math.floor(Math.random() * (6) + 9)
    var numClickedCells = [];

    // For loop generates 9-14 numbers depending on clickedCells the number will between 1 and 121 corresponding to a hexagon the id is than appended to an empty list
    for (i = 0; i < clickedCells; i++) {
        do {
            var numOfCells = Math.floor(Math.random() * (121) + 1);
        } while ([49, 50, 59, 60, 61, 71, 72].includes(numOfCells));
        numClickedCells.push(numOfCells);
    }
    var hexagonContainer = document.createElement('svg');
    document.body.appendChild(hexagonContainer)
    hexagonContainer.setAttribute('class', 'hexagon-container')
    // Create the Hexagon Cells
    for (var k = 0; k < 121; k++) {
        var idRow = Math.floor(k / 11)
        var idCol = k % 11
        if (numClickedCells.includes(k)) {
            var hexagon = document.createElement('div');
            hexagon.setAttribute('id', "cell-" + idRow + "-" + idCol)
            hexagon.setAttribute('class', "clicked-hexagon");
            if ((11 <= k && k <= 21) || (33 <= k && k <= 43) || (55 <= k && k <= 65) || (77 <= k && k <= 87) || (99 <= k && k <= 109)) {
                hexagon.setAttribute('class', "even-clicked-hexagon");
                hexagonContainer.appendChild(hexagon);
            } else {
                hexagon.setAttribute('class', "odd-clicked-hexagon");
                hexagonContainer.appendChild(hexagon);
            }
        } if (!numClickedCells.includes(k)) {
            var hexagon = document.createElement('div');
            hexagon.setAttribute('id', "cell-" + idRow + "-" + idCol);
            if ((11 <= k && k <= 21) || (33 <= k && k <= 43) || (55 <= k && k <= 65) || (77 <= k && k <= 87) || (99 <= k && k <= 109)) {
                hexagon.setAttribute('class', "even-hexagon");
                hexagonContainer.appendChild(hexagon);
                hexagon.addEventListener('click', (event) => {
                    clickedHexagon(event,g)
                })
            } else {
                hexagon.setAttribute('class', "odd-hexagon");
                hexagonContainer.appendChild(hexagon);
                hexagon.addEventListener('click', (event) => {
                    clickedHexagon(event,g)
                })
            }
        }

        // if()
    };
    var cat = document.createElement('div');
    cat.setAttribute('class', "resting-cat");
    cat.setAttribute('id', "cat");
    centerHexId = document.getElementById('cell-5-5')
    centerHexId.appendChild(cat)

    const eCollection = document.getElementsByClassName("even-clicked-hexagon");
    console.log(eCollection, eCollection.length)
    for (var i = 0; i < eCollection.length; i++) {
        console.log(eCollection[i])
        var [_, eRow, eCol] = eCollection[i].id.split("-")
        var evenRow = parseInt(eRow);
        var evenCol = parseInt(eCol);
        var node = evenRow * 11 + evenCol
        g.removeEdge(node)
    }
    const oCollection = document.getElementsByClassName("odd-clicked-hexagon");
    for (var i = 0; i < oCollection.length; i++) {
        var [_, oRow, oCol] = oCollection[i].id.split("-")
        var oddRow = parseInt(oRow);
        var oddCol = parseInt(oCol);
        var node = oddRow * 11 + oddCol
        g.removeEdge(node)
    }
};

function clickedHexagon(event,g) {
    //function to remove selected cell as a available node and remove edges as well
    if (event.target.firstChild == null) {
        if (event.target.className == "even-hexagon") {
            event.target.className = "even-clicked-hexagon"
        } else if (event.target.className == "odd-hexagon") {
            event.target.className = "odd-clicked-hexagon"
        } else if (event.target.className == "even-clicked-hexagon") {
            return
        } else if (event.target.className == "odd-clicked-hexagon") {
            return
        }
    } else {
        return
    }
    var cat = document.getElementById("cat")
    var oldParent = cat.parentElement

    var [_, row, col] = oldParent.id.split("-")
    var idRow = parseInt(row)
    var idCol = parseInt(col)
    var clickedCellId = event.target.id
    var [_, clickedRow, clickedCol] = clickedCellId.split("-")
    var clickedRow = parseInt(clickedRow);
    var clickedCol = parseInt(clickedCol);
    var node = clickedRow * 11 + clickedCol;

    g.removeEdge(node)
    let newCatCell = g.BFS(idRow, idCol)
    var newIdRow = Math.floor(newCatCell / 11)
    var newIdCol = newCatCell % 11
    var newCatLocation = document.getElementById('cell-' + newIdRow + '-' + newIdCol)
    newCatLocation.appendChild(cat)

    //lasty something to get the first move id of the cell and just append the cat there.

}

class Node {
    constructor(idRow, idCol) {
        this.idRow = idRow;
        this.idCol = idCol;
    }
    getNeighbors() {

        if (this.idRow % 2 == 0) {
            // add a restictor that checks the class of the neighbors div and if it is even-clicked-hexagon or odd-clicked-hexagon do not add the neigbor
            return [
                [this.idRow - 1, this.idCol - 1],
                [this.idRow - 1, this.idCol],
                [this.idRow, this.idCol - 1],
                [this.idRow, this.idCol + 1],
                [this.idRow + 1, this.idCol - 1],
                [this.idRow + 1, this.idCol]
            ]
        } else {
            return [
                [this.idRow - 1, this.idCol],
                [this.idRow - 1, this.idCol + 1],
                [this.idRow, this.idCol - 1],
                [this.idRow, this.idCol + 1],
                [this.idRow + 1, this.idCol],
                [this.idRow + 1, this.idCol + 1]
            ]
        }

    }
}

class Graph {
    constructor() {
        this.edges = {};
        this.nodes = [];
    }
    addNode(idRow, idCol) {
        var node = new Node(idRow, idCol)
        this.nodes.push(node);
        this.edges[idRow * 11 + idCol] = [];
    }
    getNode(idRow, idCol) {
        return this.nodes[idRow * 11 + idCol]
    }
    addEdge(idRow, idCol, neighborRow, neighborCol) {
        var node1 = idRow * 11 + idCol
        var node2 = neighborRow * 11 + neighborCol
        this.edges[node1].push(node2);
        //    this.edges[node2].push(node1);
    }
    removeEdge(node) {
        // console.log(numClickedCells)
        //get a nodes neighbors and the list of edges for those neighbros remove the current idROw and ID Col from that list
        var neighborNodes = this.edges[node]
        for (let neighbors in neighborNodes) {
            // console.log(neighbors, this.edges[neighborNodes[neighbors]])
            let indexOfNode = this.edges[neighborNodes[neighbors]].indexOf(node)
            this.edges[neighborNodes[neighbors]].splice(indexOfNode, 1)
        }


        // this.edges[node] = null;
    }
    // addDirectedEdge(node1, node2) {
    //    this.edges[node1].push(node2);
    // }

    // Do the https://www.redblobgames.com/pathfinding/tower-defense/ come from first as it will be easier to accomplish than worry about blockers after.

    BFS(idRow, idCol) {
        // Create a Queue and add our initial node in it
        var node = this.getNode(idRow, idCol)
        const start = idRow * 11 + idCol;
        const goal = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 21, 22, 32, 33, 43, 44, 54, 55, 65, 66, 76, 77, 87, 88, 98, 99, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120]
        let q = []
        let explored = new Set();
        q.unshift(idRow * 11 + idCol);
        // console.log(JSON.stringify(q))

        // Mark the first node as explored explored.
        explored.add(idRow * 11 + idCol);
        let parent = {};

        // We'll continue till our queue gets empty
        while (q.length != 0) {


            let t = q.pop();
            if (goal.includes(t)) {
                // replace current will be a checker of the parents object going through the parents until it finds the current cat position and returns the path it took to get there
                let path = [];

                // need to get the goal that triggered the if statement 
                let current = t;
                while (current != start) {
                    path.push(current);
                    current = parent[current]
                }
                // console.log(path)
                //return the first cell in the path to move the cat
                return path[path.length - 1]

            }

            // Log every element that comes out of the Queue
            // 1. In the edges object, we search for nodes this node is directly connected to.
            // 2. We filter out the nodes that have already been explored.
            // 3. Then we mark each unexplored node as explored and add it to the queue.edges[t])
            this.edges[t]
                .filter(n => !explored.has(n))
                .forEach(n => {
                    parent[n] = t
                    explored.add(n);
                    q.unshift(n);
                })
        }
    }

}




