/*****************************************************************************************************\
******************************************************************************************************
****************************************** ROBOT APPLICATION *****************************************
******************************************        BY         *****************************************
******************************************   ALIREZA ASADI   *****************************************
******************************************************************************************************
******************************************************************************************************/




var util = require('util');
var fs = require('fs');

/***************************************************************************\
 ********************************* Public vars/consts **********************
\***************************************************************************/
var command_names = {
    PLACE : "PLACE",
    MOVE : "MOVE",
    LEFT : "LEFT",
    RIGHT : "RIGHT",
    REPORT : "REPORT",
    QUIT : "QUIT"
};
var facing_names = {
    NORTH : "NORTH",
    SOUTH : "SOUTH",
    EAST : "EAST",
    WEST : "WEST"
};
var commands = [
    command_names.PLACE, 
    command_names.MOVE, 
    command_names.LEFT, 
    command_names.RIGHT, 
    command_names.REPORT,
    command_names.QUIT
];
var faces = [
    facing_names.NORTH, 
    facing_names.SOUTH, 
    facing_names.EAST, 
    facing_names.WEST
];
var position = {
    X: 0,
    Y: 0,
    F: '-'
};
var MAX_LOC = {
    X: 5,
    Y: 5
};


  
  
/***************************************************************************\
 ********************************* Helper messages *************************
\***************************************************************************/
var helper = function(){
  console.log('Argument is not valid.');
  console.log('Please use the following valid args:');
  console.log('-f path-to-input-data');  
};
var helperParser = function(extra){
  console.log('Command is not valid. type "quit" to quit');
  if(extra) console.log(extra);
};
var checkFallingTable = function(X, Y){
    if(Y > MAX_LOC.Y || Y < 0){
        return true;
    }
    if(X > MAX_LOC.X || X < 0){
        return true;
    }
    
    return false;
};




/*******************************************************************************\
 ********************************* Processors **********************************
\*******************************************************************************/

var processFileInput = function(path){
    var lineReader = require('readline').createInterface({
        input: require('fs').createReadStream(path)
    });

    lineReader.on('line', function (line) {
        processRoute(line);
    });
};

var processCommandInput = function(){
    process.stdin.on('data', function (text) {
        processRoute(text.trim());
    });
};

var processRoute = function(command){
    var X = 0;
    var Y = 0;
    var c = command.split(' ')[0];
    switch (c) {
        case command_names.PLACE:
            if(command.split(' ').length != 2){
                helperParser(command_names.PLACE + " X,Y");
            }else{
                var place_loc = command.split(' ')[1];
                if(place_loc.split(',').length != 3){
                    helperParser(command_names.PLACE + " X,Y,F");
                }else{
                    X = parseInt(place_loc.split(',')[0]);
                    Y = parseInt(place_loc.split(',')[1]);
                    var face = place_loc.split(',')[2];
                    
                    if(faces.indexOf(face) == -1){
                        helperParser('Facing is not valid!' + face);
                        
                    // Check not fall the table
                    }else if(!checkFallingTable(X, Y)){
                        position.X = X;
                        position.Y = Y;
                        position.F = face;
                    }
                    
                }
            }
            break;
        case command_names.MOVE:
            // Check previously PLACE command used
            if(position.F == '-'){
                helperParser("First command should be PLACE X,Y,F");
                break;
            }
            
            X = position.X;
            Y = position.Y;
            switch (position.F) {
                case facing_names.NORTH:
                    Y++;
                    break;
                case facing_names.SOUTH:
                    Y--;
                    break;
                case facing_names.EAST:
                    X++;
                    break;
                case facing_names.WEST:
                    X--;
                    break;
                default:
                    break;
            }
            // Check not fall the table
            if(!checkFallingTable(X, Y)){
                position.X = X;
                position.Y = Y;
            }
            break;
        case command_names.LEFT:
            // Check previously PLACE command used
            if(position.F == '-'){
                helperParser("First command should be PLACE X,Y,F");
                break;
            }
            switch (position.F) {
                case facing_names.NORTH:
                    position.F = facing_names.WEST;
                    break;
                case facing_names.SOUTH:
                    position.F = facing_names.EAST;
                    break;
                case facing_names.EAST:
                    position.F = facing_names.NORTH;
                    break;
                case facing_names.WEST:
                    position.F = facing_names.SOUTH;
                    break;
                default:
                    break;
            }
            break;
        case command_names.RIGHT:
            // Check previously PLACE command used
            if(position.F == '-'){
                helperParser("First command should be PLACE X,Y,F");
                break;
            }
            
            switch (position.F) {
                case facing_names.NORTH:
                    position.F = facing_names.EAST;
                    break;
                case facing_names.SOUTH:
                    position.F = facing_names.WEST;
                    break;
                case facing_names.EAST:
                    position.F = facing_names.SOUTH;
                    break;
                case facing_names.WEST:
                    position.F = facing_names.NORTH;
                    break;
                default:
                    break;
            }
            break;
        case command_names.REPORT:
            // Check previously PLACE command used
            if(position.F == '-'){
                helperParser("First command should be PLACE X,Y,F");
                break;
            }
            
            console.log(position.X + ',' + position.Y + ',' + position.F);
            break;
    
        case command_names.QUIT:
            process.exit();
            break;
            
        default:
            helperParser();
            break;
    }
    
};
  
  
  
/***************************************************************************\
 ********************************* MAIN ************************************
\***************************************************************************/
var main = function(){
    // First two arguments are(node and appFile)
    if(process.argv.length > 2){
        var args = process.argv.slice(2);
        
        // Check file input argument
        if(args.indexOf('-f') === 0 && args.length == 2){
            
            /*************************************\
             *********** File input **************
            \*************************************/
            var path = args[1];
            processFileInput(path);
            
        }else{
            
            /*************************************\
             *********** Show helper *************
            \*************************************/
            
            helper();
            process.exit();
        }
    }else{
        /*************************************\
         *********** Command input ***********
        \*************************************/
        console.log("Please enter your command:");
        process.stdin.resume();
        process.stdin.setEncoding('utf8');
        processCommandInput();
    }
    
    
}();