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
        $('<label></label>').text(file.date).prop({id:file.date}).appendTo(td_date)

        var td_time = $('<td></td>').text(file.time).appendTo(row);

        var td_seq = $('<td></td>').prop({align:"right"}).appendTo(row);

        var href_seq = $('<a></a>').
            text(file.seq).
            prop({href: file.url, target: "_blank"}).
            appendTo(td_seq)

        var td_audio = $('<td></td>').appendTo(row);

        var audio = $('<audio preload="none"></audio>').
            prop({id:"player_"+file.id, src:file.download_url}).
            appendTo(td_audio)

        var href_play = $('<a> ▶ </a>').
            prop({href:"#", id:file.id}).
            on('click', function(e) {
            e.preventDefault()

            var id = "player_" + e.target.id
            var audio_control = document.getElementById(id)

            stop_all_audios()
            audio_control.play()
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
