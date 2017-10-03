var json = localStorage['json'] || '[{\n' +'    "tasks": [    ]\n' + '}]'
var todoEntries = [];
var tasks = JSON.parse(json).tasks;
var tempTodoEntries;
if (typeof(tasks) != 'undefined') {
    for(var i = 0; i < tasks.length; i++) {
        var todoNumber = todoEntries.length;
        var task = tasks[i];
        todoEntries.push($('<li style="min-height: 12px" class="truncate todo-menu ' + task.priority +' ' + task.completed + '" title="' + task.task + '" onclick="todoModal($(this));" id="' + todoNumber + '">' + task.task + '<ul style="color: #8c8c8c">Due: ' + task.due + '</ul> <div style=" border-radius: 5px" onclick="completeTask(this.parentElement); event.stopPropagation()"><img style="display: block; margin: 30% 0 0 50%;" src="checkBlue.svg"></div></li>').attr('task', task.task).attr('due', task.due).attr('priority', task.priority).attr('completed', task.completed).attr('id', task.id).appendTo($('#list')));
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
    if (todoInput.val() && todoDate.val() && prioritySelector.val()) {
        var theTask = $('<li style="min-height: 12px" class="truncate todo-menu ' + prioritySelector.val() + '" title="' + todoInput.val() + '" onclick="todoModal($(this));" id="' + todoNumber + '">' + todoInput.val() + '<ul style="color: #8c8c8c">Due: ' + todoDate.val() + '</ul> <div style=" border-radius: 5px" onclick="completeTask(this.parentElement); event.stopPropagation()"><img style="display: block; margin: 30% 0 0 50%; " src="checkBlue.svg"></div></li>').attr('task', todoInput.val()).attr('due', todoDate.val()).attr('priority', prioritySelector.val()).attr('completed', 'uncomplete').attr('id', this.id);
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
    if (confirm('Are you sure you want to delete this task?')) {
        todoEntries.splice(todoEntries.indexOf(todoElement), 1); //this just removes the elemnt from da array, theres prob a better way like todoEntries.remove
        $(todoElement).remove();
        updateLocal();
    }
}

function editTask(taskToEdit) {
    var editText = $('#edit-input');
    var editDate = $('#edit-due-date');
    var editPriority = $('#edit-priority');
    editText.val(taskToEdit.attr('task'))
    editDate.val(taskToEdit.attr('due'))
    editPriority.val(taskToEdit.attr('priority'))
    $('#edit').modal('open');
    tempTodoEntries = taskToEdit;
}

function updateTask(taskToEdit) {
    var editText = $('#edit-input');
    var editDate = $('#edit-due-date');
    var editPriority = $('#edit-priority');
    taskToEdit.attr('task', editText.val())
    taskToEdit.attr('due', editDate.val())
    taskToEdit.attr('priority', editPriority.val())
    updateLocal()
    $('.modal').modal('close');
}

function completeTask(todoElement) {
    if (!$(todoElement).hasClass('complete')) {
        $(todoElement).attr('completed', 'complete');
        $(todoElement).addClass($(todoElement).attr('completed'));
        $(todoElement).removeClass('uncompleted');
        todoInput.focus();
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
    } else if($(todoElement).hasClass('complete')) {
        $(todoElement).attr('completed', 'uncompleted');
        $(todoElement).addClass('uncompleted');
        $(todoElement).removeClass('complete');
    }
    updateLocal();
}

function exportJson() {
    updateLocal();
    if ($("#json-export").val()) {
        $("#json-export").val(JSON.stringify(json, null, 4));
    } else {
        $('#main').append('<div style="margin-top: 50px" class="textInput" ><textarea class="textarea" cols="45" rows="15" id="json-export">' + JSON.stringify(json, null, 4) + '</textarea><br><button onclick="removeExport();" class="btn" style="background-color: #6655ff;" id="export-hide">Hide</button></div>')
    }
}

function importJson(importText) {
    if (isJson(importText)) {
        var newTasks = JSON.parse(importText).tasks;
        try {
            for (var i = 0; i < newTasks.length; i++) {
                todoNumber += 1;
                var newTask = newTasks[i];
                console.log(newTask)
                todoEntries.push($('<li style="min-height: 12px" class="truncate todo-menu ' + newTask.priority + '" title="' + newTask.task + '" onclick="todoModal($(this))" id="todo-' + todoNumber + '">' + newTask.task + '<ul style="color: #8c8c8c">Due: ' + newTask.due + '</ul> <div style="border-radius: 5px;" onclick="completeTask(this.parentElement); event.stopPropagation()"><img style="display: block; margin: 30% 0 0 50%; " src="checkBlue.svg"></div></li>').attr('task', newTask.task).attr('due', newTask.due).attr('priority', newTask.priority).attr('completed', newTask.completed).attr('id', newTask.id).appendTo($('#list')));
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
            var text = elementNumber.attr("task")
            var date = elementNumber.attr("due");
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
            return {task: n.attr('task'), due: n.attr('due'), priority: n.attr('priority'), completed: n.attr('completed'), id: n.attr('id')};
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
    $('.datepicker').datepicker({
        autoHide: true
    });
    $('.modal').modal();
});

$(function() {
    $.contextMenu({
        selector: '.todo-menu',
        callback: function(key, options) {
            if (key == 'delete') {
                removeTask(this);
            } else if (key == 'edit') {
                editTask(this);
            }
            //console.log(key, this)
        },
        items: {
            "edit": {name: "Edit", icon: "edit"},
            "delete": {name: "Delete", icon: "delete"}
        }
    });

    $('.todo-menu').on('contextmenu', function(e){
    })
});