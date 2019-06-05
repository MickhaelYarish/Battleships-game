"use strict"
$( document ).ready(function() {

    var shipInfo = {
        '4cell': {
            color: 'black',
            count: 1,
            size:4
        },
        '3cell': {
            color: 'grey',
            count: 2,
            size: 3
        },
        '2cell': {
            color: 'lightgrey',
            count: 3,
            size: 2
        },
        '1cell': {
           color: 'green',
           count: 4,
           size: 1
        }
    }

    var userBoard = [];
    var botBoard = [];

    var userHealth = 10;
    var botHealth = 10;

    var shipsCoordinates = [];
    var userTurn = true;

    var botHitArray = [];

    
    fillTable();

    $('#bot table').on('click',function(e){

        var x = e.target.cellIndex;
        var y = e.target.parentNode.rowIndex;
        userTurn = shootBoard(y,x,botBoard,'bot');

        if(!userTurn){

        var botShootingCoordinates;
            botShootingCoordinates = getBotShootingCoordinates(botHitArray);
          userTurn = !shootBoard(botShootingCoordinates.y,botShootingCoordinates.x,userBoard,'user');
          while(userTurn === false){
                botShootingCoordinates = getBotShootingCoordinates(botHitArray);
                userTurn = !shootBoard(botShootingCoordinates.y,botShootingCoordinates.x,userBoard,'user');
        }



        }
    });

    $('#restart').on('click', startGame)

    startGame();

    function getBotShootingCoordinates(botHitArray){
        var c = null;

        if(!botHitArray.length){

            c = {
                x: getRandom(),
                y: getRandom()
            }
            return c;

        }else if(botHitArray.length === 1){

           return shootSecondTime(botHitArray[0]);

        }else if(botHitArray.length > 1){

           return shootNext(botHitArray);

        }

        function shootSecondTime(c){
            console.log('shotSecondTime', botHitArray)

            var coordArray = [];
            var x = c['x'];
            var y = c['y'];

            if(x - 1 !== -1 && (userBoard[y][x - 1]['type'] === 'border' || userBoard[y][x - 1]['type'] === 'ship')){
                coordArray.push({'x': x - 1, 'y': y})
            };

            if(x + 1 !== 10 && (userBoard[y][x + 1]['type'] === 'border' || userBoard[y][x + 1]['type'] === 'ship')){
                coordArray.push({'x': x + 1, 'y': y})
            }

            if(y - 1 !== -1 && (userBoard[y - 1][x]['type'] === 'border' || userBoard[y - 1][x]['type'] === 'ship')){
                coordArray.push({'x': x, 'y': y - 1})
            }

            if(y + 1 !== 10 && (userBoard[y + 1][x]['type'] === 'border' || userBoard[y + 1][x]['type'] === 'ship')){
                coordArray.push({'x': x, 'y': y + 1})
            }

            return coordArray[Math.floor(Math.random()*coordArray.length)];
        }

        function shootNext(c){
            console.log('shotnext')
            var cords = [];
            if(c[0]['x'] !== c[1]['x']){
                var y = c[0]['y'];
                var minX = getMinX(c);
                var maxX = getMaxX(c);

              

               if( minX - 1 !== -1 && (userBoard[y][minX - 1]['type'] === 'border' || userBoard[y][minX - 1]['type'] === 'ship')){
                   cords.push({
                       'y': y,
                       'x': minX - 1
                   })
               }

               if( maxX + 1 !== 10 && (userBoard[y][maxX + 1]['type'] === 'border' || userBoard[y][maxX + 1]['type'] === 'ship')){
                   cords.push({
                       'y': y,
                       'x': maxX + 1
                   })
               }

               console.log(cords)


               return cords[Math.floor(Math.random()*cords.length)];
                
            }else{

                var x = c[0]['x'];
                var minY = getMinY(c);
                var maxY = getMaxY(c);

              

               if( minY - 1 !== -1 && (userBoard[minY - 1][x]['type'] === 'border' || userBoard[minY - 1][x]['type'] === 'ship')){
                   cords.push({
                       'y': minY - 1,
                       'x': x
                   })
               }

               if( maxY + 1 !== 10 && (userBoard[maxY + 1][x]['type'] === 'border' || userBoard[maxY + 1][x]['type'] === 'ship')){
                   cords.push({
                       'y': maxY + 1,
                       'x': x
                   })
               }

               console.log(cords)
                
              

                return cords[Math.floor(Math.random()*cords.length)];

            }

            function getMinY(c){
                let min = c[0]['y'];
                for(let i = 1; i < c.length; i++){
                    if(min > c[i]['y']){
                        min = c[i]['y'];
                    }

                }
                return min;
            }

            function getMaxY(c){
                let max = c[0]['y'];
                for(let i = 1; i < c.length; i++){
                    if(max < c[i]['y']){
                        max = c[i]['y'];
                    }
                }
                return max;
            }

            function getMinX(c){
                let min = c[0]['x'];
                for(let i = 1; i < c.length; i++){
                    if(min > c[i]['x']){
                        min = c[i]['x'];
                    }

                }
                return min;
            }

            function getMaxX(c){
                let max = c[0]['x'];
                for(let i = 1; i < c.length; i++){
                    if(max < c[i]['x']){
                        max = c[i]['x'];
                    }
                }
                return max;
            }

        }

        
    }

    function shootBoard(y,x, board, boardName){
            if(board[y][x] !== null && board[y][x]['type'] === 'ship'){
                if(!userTurn){
                botHitArray.push({
                    'x': x,
                    'y': y
                })
            }
              shootShip(board, x, y, boardName);
              return true;
            }else if(board[y][x] === null || board[y][x]['type'] === 'border'){
               board[y][x] = {type: 'shotEmpty'};
               $(`#${boardName} table tr:nth-child(${y+1}) td:nth-child(${x+1})`).text('.');
             return false;
            }
            return true;
        
    }

    function removeShips(){
        for(let i = 1; i <= 10; i++){
            for(let j = 1; j <= 10; j++){
                $(`#user table tr:nth-child(${i}) td:nth-child(${j})`).css('background-color', 'white');
                $(`#user table tr:nth-child(${i}) td:nth-child(${j})`).text('');
                $(`#bot table tr:nth-child(${i}) td:nth-child(${j})`).css('background-color', 'white');
                $(`#bot table tr:nth-child(${i}) td:nth-child(${j})`).text('');
            }        
        }
    }

    function startGame(){
        botBoard = [];
        userBoard = [];
        shipsCoordinates = [];
        userTurn = true;
        userBoard = addNullWaluesToArray(userBoard);
        botBoard = addNullWaluesToArray(userBoard);

        userHealth = 10;
        botHealth = 10;

        removeShips();

        addShips(userBoard, 'user');
        addShips(botBoard, 'bot');
    }

    function showWinner(number, board){
        if(number === 0){
            alert(board + ' has won');
            setTimeout(startGame,1000)
        }
    }

    function shootShip(board, x, y, boardName){

       let ship = getShip();

       if(ship.health === 1){
           ship.health = 0;
          
         for(let i = 0; i < ship.coordinates.length; i++){
            board[ship.coordinates[i].y][ship.coordinates[i].x]['type'] = 'destroyed';
            $(`#${boardName} table tr:nth-child(${ship.coordinates[i].y+1}) td:nth-child(${ship.coordinates[i].x+1})`).css('background-color', 'red');
         }
         drawBorder();
         if(userTurn === true){
            botHealth -=1;
            showWinner(botHealth,'User');
        }else{
            userHealth -= 1;
            botHitArray = [];
            showWinner(userHealth,'Bot');
        }
       }else{
            ship.health -= 1;
            board[y][x]['type'] = 'shot';
            $(`#${boardName} table tr:nth-child(${y+1}) td:nth-child(${x+1})`).css('background-color', 'orange');
       }

        function getShip(){
            for(let i = 0; i < shipsCoordinates.length;i++){
                if(shipsCoordinates[i]['enemy'] === boardName){
                  for(let j = 0; j < shipsCoordinates[i]['coordinates'].length; j++){
                     if(shipsCoordinates[i]['coordinates'][j]['x'] === x && shipsCoordinates[i]['coordinates'][j]['y'] === y){
                         return shipsCoordinates[i];
                     }
                  }
                }
            }
        }

        function drawBorder(){

            let beginX = ship.coordinates[0]['x'];
            let beginY = ship.coordinates[0]['y'];
            let endX = ship.coordinates[ship.coordinates.length-1]['x'];
            let endY = ship.coordinates[ship.coordinates.length-1]['y'];

            if(beginX - 1 !== -1){
                beginX -= 1;
            }

            if(endX + 1 !== 10){
                endX += 1;
            }

            if(beginY - 1 !== -1){
                beginY -= 1;
            }

            if(endY + 1 !== 10){
              endY += 1;
           }
          
          if(ship.coordinates[0]['position'] === 'vertical'){
             for(let i = beginX; i < endX + 1; i++){
                 for(let j = beginY; j < endY + 1; j++){
                     if(board[j][i]['type'] === 'border' || board[j][i]['type'] === 'shotEmpty'){
                        board[j][i]['type'] = 'borderRevealed'
                        $(`#${boardName} table tr:nth-child(${j+1}) td:nth-child(${i+1})`).text('X');
                     }
                 }
             }
          }else{
            for(let i = beginY; i < endY + 1; i++){
                for(let j = beginX; j < endX + 1; j++){
                    if(board[i][j]['type'] === 'border' || board[i][j]['type'] === 'shotEmpty'){
                        board[i][j]['type'] = 'borderRevealed'
                       $(`#${boardName} table tr:nth-child(${i+1}) td:nth-child(${j+1})`).text('X');
                    }
                }
            }
          }
        }

    }
    
    function addShipBorder(coordinates, board){
        var borderCoordinates = coordinates.slice();

        if(coordinates[0]['position'] === 'vertical'){

            if( !isBoardBorderTop(coordinates[0]['y']) ){
                borderCoordinates.unshift({
                    x: coordinates[0]['x'],
                    y: coordinates[0]['y'] - 1
                })
            }

            if( !isBoardBorderBottom(coordinates[coordinates.length-1]['y']) ){
                borderCoordinates.push({
                    x: coordinates[0]['x'],
                    y: coordinates[coordinates.length-1]['y'] + 1
                })
            }


            function placeBorder(board, x, y){
                if(x < 0 || x > 9 || (board[y][x] !== null)){

                }else{
                    board[y][x] = {type: 'border'}
                    // $(`#user table tr:nth-child(${y+1}) td:nth-child(${x+1})`).css('background-color','#c1f7f2');
                }
                
               
            }
            

            for(let i = 0; i < borderCoordinates.length; i++){
                for(let j = -1; j < 2; j++){
                    placeBorder(board, borderCoordinates[i]['x']+j, borderCoordinates[i]['y'])
                }
             
            }

        }else{

            if( !isBoardBorderTop(coordinates[0]['x']) ){
                borderCoordinates.unshift({
                    x: coordinates[0]['x'] - 1,
                    y: coordinates[0]['y']
                })
            }

            if( !isBoardBorderBottom(coordinates[coordinates.length-1]['x']) ){
                borderCoordinates.push({
                    x: coordinates[coordinates.length-1]['x'] + 1,
                    y: coordinates[0]['y']
                })
            }


            function placeBorder(board, x, y){
                if(y < 0 || y > 9 || (board[y][x] !== null)){

                }else{
                    board[y][x] = {type: 'border'}
                    // $(`#user table tr:nth-child(${y+1}) td:nth-child(${x+1})`).css('background-color','#c1f7f2');
                }
                
               
            }
            

            for(let i = 0; i < borderCoordinates.length; i++){
                for(let j = -1; j < 2; j++){
                    placeBorder(board, borderCoordinates[i]['x'], borderCoordinates[i]['y'] + j)
                }
             
            }

        }
    
    }

    function getEmptySpaceCoordinates(board, size){
      var coordinates = [];
      var isEmpty = false;
      var isHorizontal = !!Math.round(Math.random());

      if(size === 1){
        var xRandom = getRandom();
        var yRandom = getRandom();
        while(!isEmpty){
        if(board[yRandom][xRandom] === null){
            isEmpty = true;
            coordinates.push({
                x: xRandom,
                y: yRandom,
                position: 'vertical'
            });
            return coordinates;
        }else{
            xRandom = getRandom();
            yRandom = getRandom();
        }
    }
      }else{
          while(!isEmpty){
              if(!isHorizontal){
                var xRandom = getRandom();
                var yRandom = getRandom(size);
              if(board[yRandom][xRandom] === null && board[yRandom+size-1][xRandom] === null){
                  isEmpty = true;
                  for(let i = 0; i < size; i++){
                      coordinates.push({
                          x: xRandom ,
                          y: yRandom + i,
                          position: 'vertical'
                      })
                  }
                  return coordinates;
              }else{
                xRandom = getRandom();
                yRandom = getRandom(size);
              }
            }else{
                var xRandom = getRandom(size);
                var yRandom = getRandom();
                if(board[yRandom][xRandom] === null && board[yRandom][xRandom + size - 1] === null){
                    isEmpty = true;
                    for(let i = 0; i < size; i++){
                        coordinates.push({
                            x: xRandom + i,
                            y: yRandom,
                            position: 'horizontal' 
                        })
                    }
                    return coordinates;
                }else{
                  xRandom = getRandom(size);
                  yRandom = getRandom();
                }
            }
          }
      }
    }


    function placeShip(board, size, color, tableId){
        var coordinates = getEmptySpaceCoordinates(board, size);
        if(tableId === 'bot'){
            color = 'white';
        }
        for(let i = 0; i < coordinates.length; i++){
        board[coordinates[i].y][coordinates[i].x] = {[size]:color,
        type:'ship', size: size};
        $(`#${tableId} table tr:nth-child(${coordinates[i].y+1}) td:nth-child(${coordinates[i].x+1})`).css('background-color',color);
        }
        addShipBorder(coordinates, board);
        shipsCoordinates.push({
            enemy: tableId,
            coordinates: coordinates,
            health: size
        })
    }

    function addShips(board, tableId){
        for(let ship in shipInfo){
            for(let i = 0; i < shipInfo[ship]['count']; i++){
               placeShip(board, shipInfo[ship]['size'], shipInfo[ship]['color'], tableId)
            }
        }
    }
    
    function getRandom(size){
        if(!arguments.length){
          return Math.floor(Math.random() * 10);
        }else{
            return Math.floor(Math.random() * (11-size));
        }
       
    }
    
    function fillTable(){
        for(let i = 0; i < 10; i++){
            $('.board table').append('<tr></tr>');
            for(let j = 0; j < 10; j++){
                $('.board table').children(`tr:nth-child(${i+1})`).append('<td></td>')
               
            }
        }
    }

    function addNullWaluesToArray(array){
        array = new Array(10);
        var inArray = [];
        for(let i = 0; i < array.length; i++){
            for(let j = 0; j < 10; j++){
                inArray.push(null)
            }
            array[i] = inArray
            inArray = [];
        }
        return array;
    }

    function isBoardBorderTop(number){
        if(number - 1 === -1){
            return true;
        }
    }

    function isBoardBorderBottom(number){
        if(number + 1 === 10){
            return true;
        }
    }
});



