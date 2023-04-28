function refreshMeetingList() {
    $.getJSON('/meetings', function (data) {
        $('#meeting-table tbody').empty();
        $.each(data, function (index, meeting) {
            let row = $('<tr>');
            row.append($('<td>').text(meeting.topic));
            row.append($('<td>').text(meeting.date));
            row.append($('<td>').text(meeting.start_time));
            row.append($('<td>').text(meeting.end_time));
            row.append($('<td>').text(meeting.participants.join(', ')));
            let actions = $('<td>');
            actions.append($('<button>').text('Update').addClass('btn btn-sm btn-warning').on('click', function () {
                updateMeeting(meeting.id);
            }));
            actions.append(' ');
            actions.append($('<button>').text('Delete').addClass('btn btn-sm btn-danger').on('click', function () {
                deleteMeeting(meeting.id);
            }));
            row.append(actions);
            $('#meeting-table tbody').append(row);
        });
    });
}

function addMeeting() {
    let topic = $('#topic').val();
    let date = $('#date').val();
    let startTime = $('#start-time').val();
    let endTime = $('#end-time').val();
    let participants = $('#participants').val().split(',').map(p => p.trim());

    $.ajax({
        url: '/meetings',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ topic, date, start_time: startTime, end_time: endTime, participants }), success: function (response) {
            $('#meeting-form')[0].reset();
            refreshMeetingList();
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function updateMeeting(meetingId) {
    let topic = prompt("Enter new meeting topic:");
    let date = prompt("Enter new date:");
    let startTime = prompt("Enter new start time:");
    let endTime = prompt("Enter new end time:");
    let participants = prompt("Enter new participants (comma separated):").split(',').map(p => p.trim());

    $.ajax({
        url: `/meetings/${meetingId}`,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({ topic, date, start_time: startTime, end_time: endTime, participants }),
        success: function (response) {
            refreshMeetingList();
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function deleteMeeting(meetingId) {
    if (!confirm("Are you sure you want to delete this meeting?")) return;

    $.ajax({
        url: `/meetings/${meetingId}`,
        type: 'DELETE',
        success: function (response) {
            refreshMeetingList();
        },
        error: function (error) {
            console.log(error);
        }
    });
}

$(document).ready(function () {
    refreshMeetingList();

    $('#meeting-form').on('submit', function (e) {
        e.preventDefault();
        addMeeting();
    });
});

