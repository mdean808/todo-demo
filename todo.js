var json = localStorage['json'] || '[{\n' +'    "tasks": [    ]\n' + '}]'
var todoEntries = [];
var tasks = JSON.parse(json).tasks;

if (typeof(tasks) != 'undefined') {
    for(var i = 0; i < tasks.length; i++) {
        var todoNumber = todoEntries.length;
        var task = tasks[i];
        //TODO: check value of priority-selector and append that to theTask LI class.
        todoEntries.push($('<li style="min-height: 12px" class="truncate ' + task.priority +'" title="' + task.task + '" onclick="todoModal($(this).attr(\'id\'));" id="' + todoNumber + '">' + task.task + '<ul style="color: #8c8c8c">Due: ' + task.due + '</ul> <div style=" border-radius: 5px" onclick="removeTask(this.parentElement); event.stopPropagation()"><img style="display: block; margin: 30% 0 0 50%;" src="checkBlue.svg"></div></li>').attr('task', task.task).attr('due', task.due).appendTo($('#list')));
    }
} else {
    todoNumber = -1;
}
$('#loading').remove();
var todoInput = $("#todo-input");
var todoDate = $("#due-date-input");
var todoInputButton = $("#todo-input-btn");
var prioritySelector = $('#priority-selector');
todoInput.focus();

function addTask() {
    todoNumber += 1;
    //TODO: check value of priority-selector and append that to theTask LI class.
    if (todoInput.val() && todoDate.val() && prioritySelector.val()) {
        var theTask = $('<li style="min-height: 12px" class="truncate ' + prioritySelector.val() + '" title="' + todoInput.val() + '" onclick="todoModal($(this).attr(\'id\'));" id="' + todoNumber + '">' + todoInput.val() + '<ul style="color: #8c8c8c">Due: ' + todoDate.val() + '</ul> <div style=" border-radius: 5px" onclick="removeTask(this.parentElement); event.stopPropagation()"><img style="display: block; margin: 30% 0 0 50%; " src="checkBlue.svg"></div></li>').attr('task', todoInput.val()).attr('due', todoDate.val()).attr('priority', prioritySelector.val());
        todoEntries.push(theTask);
        $('#list').append(theTask.hide().show(150));
        todoDate.val("");
        todoInput.val("")
        updateLocal();
    } else {
        $.amaran({
            'theme': 'colorful',
            'content': {
                bgcolor: '#dd4f3f',
                color: '#fff',
                message: 'Error: Task and date needed.'
            },
            'position': 'top right',
            'outEffect': 'slideTop'
        });
    }
    todoInput.focus();

}

function removeTask(todoElement) {
    console.log(todoElement.id);
    todoEntries.splice(todoEntries.indexOf(todoElement), 1); //this just removes the elemnt from da array, theres prob a better way like todoEntries.remove
    $(todoElement).remove();
    //todoEntries.splice(todoElementNumber, 1);
    todoInput.focus();
    todoNumber -= 1;
    updateLocal();
    $.amaran({
        'theme': 'colorful',
        'content': {
            bgcolor: '#77f442',
            color: '#fff',
            message: 'Task succesfully completed.'
        },
        'position': 'top right',
        'outEffect': 'slideTop'
    });
}

function exportJson() {
    var i = 0;
    if ($("#json-export").length) {
        $("#json-export").val(JSON.stringify(json, null, 4));
    } else {
        $('#main').append('<div style="margin-top: 50px" class="textInput" id="json-export"><textarea class="textarea" cols="45" rows="15" id="json-export">' + JSON.stringify(json, null, 4) + '</textarea><br><button onclick="removeExport();" class="btn" style="background-color: #6655ff;" id="export-hide">Hide</button></div>')
    }
    updateLocal();
}

function importJson(importText) {
    if (isJson(importText)) {
        var newTasks = JSON.parse(importText).tasks;
        try {
            for (var i = 0; i < newTasks.length; i++) {
                todoNumber += 1;
                var newTask = newTasks[i];
                console.log(newTask)
                //TODO: make sure priotiry is there.
                todoEntries.push($('<li style="min-height: 12px" class="truncate ' + newTask.priority + '" title="' + newTask.task + '" onclick="todoModal($(this).attr(\'id\'));" id="todo-' + todoNumber + '">' + newTask.task + '<ul style="color: #8c8c8c">Due: ' + newTask.due + '</ul> <div style="border-radius: 5px;" onclick="removeTask(this.parentElement); event.stopPropagation()"><img style="display: block; margin: 30% 0 0 50%; " src="checkBlue.svg"></div></li>').attr('task', newTask.task).attr('due', newTask.due).appendTo($('#list')));
            }
            updateLocal();
            $('#import').modal('close');
            $.amaran({
                'theme': 'colorful',
                'content': {
                    bgcolor: '#77f442',
                    color: '#fff',
                    message: 'Tasks successfully imported!'
                },
                'position': 'top right',
                'outEffect': 'slideTop'
            });
        } catch(e) {
            if (e == 'TypeError: Cannot read property \'length\' of undefined') {
                $.amaran({
                    'theme': 'colorful',
                    'content': {
                        bgcolor: '#dd4f3f',
                        color: '#fff',
                        message: 'Error: You may not have \"tasks:\" in the JSON.'
                    },
                    'position': 'top right',
                    'outEffect': 'slideTop'
                });
            } else {
                $.amaran({
                    'theme': 'colorful',
                    'content': {
                        bgcolor: '#dd4f3f',
                        color: '#fff',
                        message: e
                    },
                    'position': 'top right',
                    'outEffect': 'slideTop'
                });
            }
        }
    } else {
        $.amaran({
            'theme': 'colorful',
            'content': {
                bgcolor: '#dd4f3f',
                color: '#fff',
                message: 'Error: Text not valid JSON.'
            },
            'position': 'top right',
            'outEffect': 'slideTop'
        });
    }
}

function todoModal(elementNumber) {
    try {
            var text = todoEntries[elementNumber].attr("task")
            var date = todoEntries[elementNumber].attr("due");
            $('#todo-modal').modal('open');
            $('#todo-modal-text').text(text);
            $('#todo-modal-date').text('Due: ' + date);
    } catch(e) {
        console.log(e);
    }
}

function removeExport() {
    $('#json-export').remove();
}

function updateLocal() {
    json = {
        tasks: $.map(todoEntries, function (n, i) {
            return {task: n.attr('task'), due: n.attr('due'), priority: n.attr('priority')};
        })
    };
    localStorage['json'] = JSON.stringify(json, null, 4);
}

function isJson(str) {
    try {
        JSON.parse(str).tasks;
    } catch (e) {
        return false;
    }
    return true;
}

$(document).ready(function () {
    $('[data-toggle="datepicker"]').datepicker({
        autoHide: true
    });
    $('.modal').modal();
});