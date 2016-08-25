//TODO: add Nano (sorry vi)

//Initialize the terminal to be draggable
$("#terminalWrapper").draggable();

var debug = false;

var userName = 'jreynolds';
var user = userName + '@server:~$';
var defaultUser = userName + '@server:/$';
var commandHistory = [];
var backgroundColorList = ['#141414', '#7F2F2A', '#66CC76', '#5E2957', '#52A7FF', '#CCC045'];
var commandIndex = -1;
var userDirectory = new Directory(userName, "sadas", null);
var home = new Directory('home', [userDirectory], null)
var root = new Directory('/', [home], null);
userDirectory.previous = home;
home.previous = root;

var currentDirectory = userDirectory;

function Directory(name, contents, previous) {
    this.name = name;
    this.contents = contents;
    this.previous = previous;
    this.isDir = true;
}

//Crazy hardcoded but I make no apologies
function updateUserPath(addingDirectory, directoryName, root) {
    if (addingDirectory && directoryName === userName) {
        user = defaultUser.substring(0, defaultUser.length - 2) + '~$';
    } else if (directoryName === userName) {
        user = defaultUser.substring(0, defaultUser.length - 2) + '/' + home.name + '$';
    } else if (addingDirectory && directoryName === home.name) {
        user = defaultUser.substring(0, defaultUser.length - 2) + '/' + home.name + '$';
    } else if (addingDirectory) {
        user = user.substring(0, user.length - 1) + '/' + directoryName + '$';
    } else if (root) {
        user = defaultUser;
    } else if (directoryName === home.name) {
        user = defaultUser;
    } else {
        user = user.replace('/' + directoryName, '');
    }
}

function File(name, content) {
    this.name = name;
    this.isDir = false;
    this.content = content;
}

//Detect the current browser for the 'ps' command
var currentBrowser = function () {
    var is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
    var is_explorer = navigator.userAgent.indexOf('MSIE') > -1;
    var is_firefox = navigator.userAgent.indexOf('Firefox') > -1;
    var is_safari = navigator.userAgent.indexOf("Safari") > -1;
    var is_edge = navigator.userAgent.indexOf("Edge") > -1;
    var is_opera = navigator.userAgent.toLowerCase().indexOf("op") > -1;
    if (is_chrome && is_safari && is_edge) {
        is_chrome = false;
        is_safari = false;
    } else if ((is_chrome) && (is_safari)) {
        is_safari = false;
    } else if ((is_chrome) && (is_opera)) {
        is_chrome = false;
    }
    if (is_chrome) {
        return 'Chrome';
    } else if (is_explorer) {
        return 'Internet Explorer';
    } else if (is_firefox) {
        return 'Firefox';
    } else if (is_safari) {
        return 'Safari';
    } else if (is_edge) {
        return 'Edge';
    } else if (is_opera) {
        return 'Opera';
    } else {
        return 'Browser';
    }
}

function printToOutput(string) {
    this.replaceInput();
    $("#terminalOutput").append(string + '<br>');
    addInput();
}


//Remove the input and add the input value to the output field
function replaceInput() {
    var value = $("#terminalInput").val();
    $("#terminalInput").remove();
    $("#terminalOutput").append(value + '<br>');
}

function updateInput() {
    replaceInput();
    addInput();
}

//Add a new input to the terminal
function addInput() {
    //reset the commandIndex
    commandIndex = -1;
    $("#terminalOutput").append(user + ' <input id="terminalInput" spellcheck="false"></input>');
    //Delaying for IE
    //stupid IE
    //Debug is because codepen will take you out of editing code
    //whenever it autosaves
    if (debug) {
        setTimeout(function () {
            $("#terminalInput").focus();
        }, 10);
    }

    //Add click handlers for terminal input
    $("#terminalInput").keydown(function (e) {
        var command = $("#terminalInput").val();
        if (e.keyCode == 13) {
            sendCommand(command);
            if (commandHistory.indexOf(command) === -1) {
                commandHistory.unshift(command);
                commandIndex = -1;
            }
        } else if (e.keyCode == 9) {
            e.preventDefault();

        } else if (e.keyCode == 38 && commandIndex != commandHistory.length - 1) {
            e.preventDefault();
            commandIndex++;
            $("#terminalInput").val(commandHistory[commandIndex]);
        } else if (e.keyCode == 40 && commandIndex > -1) {
            e.preventDefault();
            commandIndex--;
            $("#terminalInput").val(commandHistory[commandIndex]);
        } else if (e.keyCode == 40 && commandIndex <= 0) {
            e.preventDefault();
            $("#terminalInput").val('');
        } else if (e.keyCode == 67 && e.ctrlKey) {
            $("#terminalInput").val(command + '^C');
            replaceInput();
            addInput();
        }
    });
}

//Parse and execute a command from the terminal
function sendCommand(input) {
    var command = input.split(' ')[0];
    var secondary = input.split(' ')[1];

      console.log(input);

      console.log($.connection.hub.id);
     $.connection.terminalHub.server.receive($(input, $.connection.hub.id));
        


    // switch (command) {
    //     case '':
    //         updateInput();
    //         break;
    //     case 'clear':
    //         clear();
    //         break;
    //     default:
    //         printToOutput('Invalid command \"' + command + '"<br>type "help" for more options');
    // }
}

//Clear the terminal
//Need to have this save output, and just add x amount of spaces
function clear() {
    replaceInput();
    //Using < 21 because (terminalHeight = 325px / fontSize = 16px)
    for (var i = 0; i < 21; i++) {
        $("#terminalOutput").append('<br>');
    }
    addInput();
    //Had errors with the input not moving after clear
    scrollToBottom();
}


//Jquery initializers
$(document).ready(function () {
    function Directory(name, contents, previous) {
        this.name = name;
        this.contents = contents;
        this.previous = previous;
        this.isDir = true;
    }
    //Issues with IE showing the input when opacity at 0, so we add it when the section is clicked
    //Make it more realistic, anywhere they click in the terminal will focus the text field.
    $("#terminal").click(function () {
        $("#terminalInput").focus();
    })

    function directoryContains(entity) {
        for (var i = 0; i < currentDirectory.contents.length; i++) {
            var current = currentDirectory.contents[i];
            if (current.name === entity) {
                return current;
            }
        }
        return false;
    }

    function scrollToBottom() {
        $("#terminalOutput").scrollTop($(this).height());
    }

    //Print the given file, usually used with "cat"
    function printFile(file) {
        for (var i = 0; i < currentDirectory.contents.length; i++) {
            var entity = currentDirectory.contents[i];
            if (entity.name == file && !entity.isDir) {
                printToOutput(entity.content);
                return;
            }
        }
        printToOutput('"' + file + '"' + ' is an invalid file name or a directory.  Try typing "ls".');
    }

    addInput();
});