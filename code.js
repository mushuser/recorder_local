function check_audios_paused() {
    var audios = document.getElementsByTagName("audio")
    for(var i in audios) {
        if(audios[i].paused == false) {
            return false
        }
    }

    return true
}


function stop_all_audios() {
    var audios = document.getElementsByTagName("audio")
    for(var i in audios) {
        if(audios[i].paused == false) {
            audios[i].pause()
            audios[i].currentTime = 0
        }
    }
}


function format_date(datestr) {
    return datestr.slice(0,4) + "/" + datestr.slice(4,6) + "/" + datestr.slice(6,8)
}


function format_time(timestr) {
    return timestr.slice(0,2) + ":" + timestr.slice(2,4)
}

function render_page(data) {
    var files = data.files
    var dates = data.dates

    $("#top-date").html("")

    for(var i in dates) {
        var date = dates[i]
        var href_date = $('<a></a>').
            text("["+date+"] ").
            prop({href: "#"+date, date: date})

        href_date.appendTo($("#top-date"))
    }

    var tbl = $('<table></table>').attr({id: "top-table", border:1});

    $("#top-div").html(tbl)

    for(var i in files) {
        var file = files[i]

        var row = $('<tr></tr>').prop({align:"right"}).appendTo($("#top-table"));

        var td_index = $('<td></td>').text(i).appendTo(row)

        var td_date = $('<td></td>').appendTo(row);
        $('<label></label>').text(format_date(file.date)).prop({id:file.date}).appendTo(td_date)

        var td_time = $('<td></td>').text(format_time(file.time)).appendTo(row);

        var td_seq = $('<td></td>').prop({align:"right"}).appendTo(row);

        var href_seq = $('<a></a>').
            text(file.seq).
            prop({href: file.url, target: "_blank"}).
            appendTo(td_seq)

        var td_audio = $('<td></td>').appendTo(row);

        var audio = $('<audio preload="none"></audio>').
            prop({id:"player_"+file.id, src:file.download_url}).
            appendTo(td_audio)

        var char_playing = ' ▶ '

        var href_play = $('<a>' + char_playing + '</a>').
            prop({href:"#", id:file.id, style:"font-size: 30px"}).
            on('click', function(e) {
                e.preventDefault()

                var id = "player_" + e.target.id
                var audio_control = document.getElementById(id)

                if(audio_control.paused == false) {
                    audio_control.pause()
                    audio_control.currentTime = 0
                } else {
                    stop_all_audios()
                    audio_control.play()
                }
            }).
            appendTo(td_audio)


        $('<td></td>').text(file.size).appendTo(row);

        var td_starred = $('<td></td>').appendTo(row);    

        $('<input type="checkbox"/>').
            prop({checked: file.starred, id: file.id}).
            appendTo(td_starred);

        $('<td></td>').prop({align:"left"}).text(file.desc).appendTo(row);    
    }

    $(':checkbox').change(function () {
        var cb = $(this)[0]
        var id = cb.id
        var starred = cb.checked

        $.post(exec_url, {action:"set_starred", id:id, starred: starred}, function(data) {
            console.log( "$.post() success: %s", JSON.stringify(data));
        })
        .done(function() {
            //console.log( "$.post() success: %s", JSON.parse(e));
        })
        .fail(function() {
            console.log( "$.post() error" );
        })
    });   
}

$(function() {
    $.post(exec_url, function(files) {
        render_page(files)
    })
    .done(function() {
        console.log( "$.post() success" );
    })
    .fail(function() {
        $("#top-date").html("Loading... ERROR!")
        $("#top-div").html("Loading... ERROR!")
    })
})
